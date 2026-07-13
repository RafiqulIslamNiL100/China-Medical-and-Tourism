import { Injectable } from "@nestjs/common";
import { CaseStatus, HospitalListingStatus, Prisma, UserRole } from "@prisma/client";
import { randomInt } from "crypto";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import {
  AddInternalNoteDto,
  ApplicationDecisionDto,
  CreateApplicationDto,
  ListApplicationsQuery,
  ReassignDto,
  SendMessageDto,
} from "./dto/applications.dto";

const OPEN_STATUSES: CaseStatus[] = [
  CaseStatus.Submitted,
  CaseStatus.UnderReview,
  CaseStatus.InfoRequested,
  CaseStatus.Accepted,
];

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  async create(userId: string, dto: CreateApplicationDto) {
    if (!dto.consentToProcessMedicalData) {
      throw AppException.validation("Consent to process medical data is required to submit an application.");
    }

    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw AppException.notFound("PATIENT_PROFILE_NOT_FOUND", "Patient profile not found.");

    if (dto.dependentId) {
      const dependent = await this.prisma.dependent.findUnique({ where: { id: dto.dependentId } });
      if (!dependent || dependent.patientId !== patient.id) {
        throw AppException.validation("Dependent does not belong to this account.");
      }
    }

    let hospitalId = dto.hospitalId;
    if (!hospitalId) {
      const suggested = await this.prisma.hospital.findFirst({
        where: {
          status: HospitalListingStatus.Published,
          OR: [
            { doctors: { some: { specialtySlug: dto.specialtySlug } } },
            { packages: { some: { specialtySlug: dto.specialtySlug } } },
          ],
        },
      });
      if (!suggested) {
        throw AppException.validation("No hospitals currently offer this specialty. Please choose a hospital.");
      }
      hospitalId = suggested.id;
    } else {
      const hospital = await this.prisma.hospital.findUnique({ where: { id: hospitalId } });
      if (!hospital) throw AppException.validation("Selected hospital does not exist.");
    }

    const refNumber = await this.generateRefNumber();

    const application = await this.prisma.application.create({
      data: {
        refNumber,
        patientId: patient.id,
        dependentId: dto.dependentId,
        hospitalId,
        doctorId: dto.doctorId,
        specialtySlug: dto.specialtySlug,
        conditionSummary: dto.conditionSummary,
        medications: dto.medications,
        allergies: dto.allergies,
        status: CaseStatus.Submitted,
        statusHistory: { create: { status: CaseStatus.Submitted, changedByUserId: userId } },
      },
    });

    const staff = await this.prisma.hospitalStaff.findMany({ where: { hospitalId } });
    await Promise.all(
      staff.map((s) =>
        this.notifications.notify({
          userId: s.userId,
          title: "New treatment application",
          body: `A new application (${refNumber}) was submitted for ${dto.specialtySlug}.`,
          category: "application_submitted",
          linkUrl: `/hospital/applications/${application.id}`,
        }),
      ),
    );

    return application;
  }

  async list(user: AuthenticatedUser, query: ListApplicationsQuery) {
    const where = await this.buildScopedWhere(user, query);
    const take = query.limit ?? 20;

    const applications = await this.prisma.application.findMany({
      where,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { submittedAt: "desc" },
    });

    const hasMore = applications.length > take;
    const data = hasMore ? applications.slice(0, take) : applications;
    return { data, meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
  }

  async getById(user: AuthenticatedUser, applicationId: string) {
    const application = await this.findScoped(user, applicationId);
    // Screen 12/45: the case timeline. History is append-only and visible to every
    // role that can see the case at all.
    const statusHistory = await this.prisma.caseStatusHistory.findMany({
      where: { applicationId: application.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, status: true, note: true, createdAt: true },
    });
    const [patient, dependent] = await Promise.all([
      this.prisma.patient.findUnique({
        where: { id: application.patientId },
        select: { fullName: true, country: true },
      }),
      application.dependentId
        ? this.prisma.dependent.findUnique({
            where: { id: application.dependentId },
            select: { fullName: true, relationship: true },
          })
        : Promise.resolve(null),
    ]);
    return {
      ...application,
      statusHistory,
      patientName: dependent ? dependent.fullName : (patient?.fullName ?? null),
      patientCountry: patient?.country ?? null,
    };
  }

  async decide(user: AuthenticatedUser, applicationId: string, dto: ApplicationDecisionDto) {
    const staff = await this.requireHospitalStaff(user.userId);
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) {
      throw AppException.notFound("CASE_NOT_FOUND", "Application not found.");
    }
    if (application.hospitalId !== staff.hospitalId) {
      throw AppException.forbidden();
    }

    if (dto.decision === "Accept" && !dto.treatmentPlan) {
      throw AppException.validation("treatmentPlan is required when accepting an application.");
    }
    if ((dto.decision === "RequestInfo" || dto.decision === "Decline") && !dto.message) {
      throw AppException.validation("message is required for this decision.");
    }

    const statusMap: Record<string, CaseStatus> = {
      Accept: CaseStatus.Accepted,
      RequestInfo: CaseStatus.InfoRequested,
      Decline: CaseStatus.Declined,
    };
    const newStatus = statusMap[dto.decision];

    let caseManagerUserId = application.caseManagerUserId;
    if (dto.decision === "Accept" && !caseManagerUserId) {
      caseManagerUserId = (await this.pickCaseManager()) ?? null;
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        treatmentPlan: dto.decision === "Accept" ? dto.treatmentPlan : application.treatmentPlan,
        costEstimateMinUsd: dto.decision === "Accept" ? dto.costEstimateMinUsd : application.costEstimateMinUsd,
        costEstimateMaxUsd: dto.decision === "Accept" ? dto.costEstimateMaxUsd : application.costEstimateMaxUsd,
        caseManagerUserId,
        statusHistory: { create: { status: newStatus, note: dto.message, changedByUserId: user.userId } },
        messages: dto.message ? { create: { senderUserId: user.userId, body: dto.message } } : undefined,
        // FR-VISA-01: seed the standard document checklist once accepted.
        documents:
          dto.decision === "Accept"
            ? {
                create: [
                  { name: "Passport photo page", category: "IdentityDocuments" },
                  { name: "Recent diagnostic report", category: "MedicalRecords" },
                  { name: "Proof of funds", category: "VisaDocuments" },
                ],
              }
            : undefined,
        // BR-14: a booking deposit invoice is required before an invitation letter can
        // be issued (BR-17). 20% of the low end of the cost estimate, minimum $500.
        invoices:
          dto.decision === "Accept" && dto.costEstimateMinUsd
            ? {
                create: [
                  {
                    description: "Booking deposit",
                    amountUsd: Math.max(500, Math.round(dto.costEstimateMinUsd * 0.2)),
                    status: "Due",
                  },
                ],
              }
            : undefined,
      },
    });

    const patient = await this.prisma.patient.findUnique({ where: { id: updated.patientId } });
    if (patient) {
      await this.notifications.notify({
        userId: patient.userId,
        title: `Your application ${updated.refNumber} was updated`,
        body: `Status changed to ${newStatus}.`,
        category: "case_status_changed",
        linkUrl: `/app/cases/${updated.id}`,
      });
    }
    if (dto.decision === "Accept" && caseManagerUserId) {
      await this.notifications.notify({
        userId: caseManagerUserId,
        title: "New case assigned",
        body: `You have been assigned case ${updated.refNumber}.`,
        category: "case_assigned",
        linkUrl: `/ops/cases/${updated.id}`,
      });
    }

    return updated;
  }

  async reassign(user: AuthenticatedUser, applicationId: string, dto: ReassignDto) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) throw AppException.notFound("CASE_NOT_FOUND", "Application not found.");

    const newManager = await this.prisma.user.findUnique({ where: { id: dto.caseManagerUserId } });
    if (!newManager || newManager.role !== UserRole.case_manager) {
      throw AppException.validation("caseManagerUserId must reference a user with role case_manager.");
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        caseManagerUserId: dto.caseManagerUserId,
        statusHistory: {
          create: { status: application.status, note: "Case manager reassigned", changedByUserId: user.userId },
        },
      },
    });

    await this.notifications.notify({
      userId: dto.caseManagerUserId,
      title: "Case reassigned to you",
      body: `You have been assigned case ${updated.refNumber}.`,
      category: "case_assigned",
      linkUrl: `/ops/cases/${updated.id}`,
    });

    return updated;
  }

  async listMessages(user: AuthenticatedUser, applicationId: string) {
    await this.findScoped(user, applicationId);
    return this.prisma.caseMessage.findMany({ where: { applicationId }, orderBy: { createdAt: "asc" } });
  }

  async sendMessage(user: AuthenticatedUser, applicationId: string, dto: SendMessageDto) {
    const application = await this.findScoped(user, applicationId);
    const message = await this.prisma.caseMessage.create({
      data: { applicationId, senderUserId: user.userId, body: dto.body },
    });

    const recipients = await this.recipientsFor(application, { excludeUserId: user.userId });
    await Promise.all(
      recipients.map((userId) =>
        this.notifications.notify({
          userId,
          title: `New message on ${application.refNumber}`,
          body: dto.body,
          category: "case_message",
          linkUrl: `/app/cases/${application.id}`,
        }),
      ),
    );

    return message;
  }

  async listInternalNotes(user: AuthenticatedUser, applicationId: string) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    return this.prisma.caseInternalNote.findMany({ where: { applicationId }, orderBy: { createdAt: "asc" } });
  }

  async addInternalNote(user: AuthenticatedUser, applicationId: string, dto: AddInternalNoteDto) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) throw AppException.notFound("CASE_NOT_FOUND", "Application not found.");

    return this.prisma.caseInternalNote.create({
      data: { applicationId, authorUserId: user.userId, note: dto.note },
    });
  }

  // --- internal helpers -----------------------------------------------------------

  private async buildScopedWhere(user: AuthenticatedUser, query: ListApplicationsQuery): Promise<Prisma.ApplicationWhereInput> {
    const base: Prisma.ApplicationWhereInput = query.status ? { status: query.status } : {};

    if (user.role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({ where: { userId: user.userId } });
      if (!patient) throw AppException.notFound("PATIENT_PROFILE_NOT_FOUND", "Patient profile not found.");
      return { ...base, patientId: patient.id };
    }

    if (user.role === UserRole.hospital_staff) {
      const staff = await this.requireHospitalStaff(user.userId);
      return { ...base, hospitalId: staff.hospitalId };
    }

    if (user.role === UserRole.case_manager || user.role === UserRole.admin) {
      if (query.view === "mine") return { ...base, caseManagerUserId: user.userId };
      if (query.view === "unassigned") return { ...base, caseManagerUserId: null };
      if (query.view === "urgent") {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60_000);
        return { ...base, status: { in: OPEN_STATUSES }, submittedAt: { lte: twoDaysAgo } };
      }
      return base;
    }

    throw AppException.forbidden();
  }

  private async findScoped(user: AuthenticatedUser, applicationId: string) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) {
      throw AppException.notFound("CASE_NOT_FOUND", "Application not found.");
    }

    if (user.role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({ where: { userId: user.userId } });
      if (!patient || application.patientId !== patient.id) throw AppException.forbidden();
    } else if (user.role === UserRole.hospital_staff) {
      const staff = await this.requireHospitalStaff(user.userId);
      if (application.hospitalId !== staff.hospitalId) throw AppException.forbidden();
    } else if (user.role !== UserRole.case_manager && user.role !== UserRole.admin) {
      throw AppException.forbidden();
    }

    return application;
  }

  private async recipientsFor(
    application: { patientId: string; hospitalId: string; caseManagerUserId: string | null },
    { excludeUserId }: { excludeUserId: string },
  ): Promise<string[]> {
    const patient = await this.prisma.patient.findUnique({ where: { id: application.patientId } });
    const staff = await this.prisma.hospitalStaff.findMany({ where: { hospitalId: application.hospitalId } });

    const ids = new Set<string>();
    if (patient) ids.add(patient.userId);
    staff.forEach((s) => ids.add(s.userId));
    if (application.caseManagerUserId) ids.add(application.caseManagerUserId);
    ids.delete(excludeUserId);
    return Array.from(ids);
  }

  private async requireHospitalStaff(userId: string) {
    const staff = await this.prisma.hospitalStaff.findUnique({ where: { userId } });
    if (!staff) throw AppException.forbidden();
    return staff;
  }

  private requireRole(user: AuthenticatedUser, roles: UserRole[]) {
    if (!roles.includes(user.role)) throw AppException.forbidden();
  }

  private async pickCaseManager(): Promise<string | undefined> {
    const managers = await this.prisma.user.findMany({ where: { role: UserRole.case_manager } });
    if (managers.length === 0) return undefined;

    const loads = await Promise.all(
      managers.map(async (m) => ({
        id: m.id,
        count: await this.prisma.application.count({
          where: { caseManagerUserId: m.id, status: { in: OPEN_STATUSES } },
        }),
      })),
    );
    loads.sort((a, b) => a.count - b.count);
    return loads[0].id;
  }

  private async generateRefNumber(): Promise<string> {
    const year = new Date().getFullYear();
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `CMT-${year}-${randomInt(1000, 9999)}`;
      const exists = await this.prisma.application.findUnique({ where: { refNumber: candidate } });
      if (!exists) return candidate;
    }
    throw AppException.validation("Could not generate a unique reference number. Please try again.");
  }
}
