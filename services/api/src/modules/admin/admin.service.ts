import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { CaseStatus, HospitalListingStatus, UserRole, UserStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AuditService } from "../../common/audit/audit.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import {
  InviteUserDto,
  ListAuditLogQuery,
  ListUsersQuery,
  ResolveModerationItemDto,
  UpdateSettingDto,
  UpdateUserDto,
} from "./dto/admin.dto";
import {
  AdminUpdateHospitalDto,
  CreateDoctorDto,
  CreateHospitalDto,
  CreateTreatmentPackageDto,
  UpdateDoctorDto,
  UpdatePackageDto,
} from "../hospitals/dto/hospitals.dto";

const OPEN_STATUSES: CaseStatus[] = [
  CaseStatus.Submitted,
  CaseStatus.UnderReview,
  CaseStatus.InfoRequested,
  CaseStatus.Accepted,
];
const FUNNEL_STAGES: CaseStatus[] = [
  CaseStatus.Submitted,
  CaseStatus.UnderReview,
  CaseStatus.InfoRequested,
  CaseStatus.Accepted,
  CaseStatus.Completed,
];

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
  ) {}

  async dashboard() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [bookingsThisMonth, payments, activeCases, activeWithManager, conversionFunnel] = await Promise.all([
      this.prisma.application.count({ where: { submittedAt: { gte: startOfMonth } } }),
      this.prisma.payment.aggregate({ where: { paidAt: { gte: startOfMonth } }, _sum: { amountUsd: true } }),
      this.prisma.application.count({ where: { status: { in: OPEN_STATUSES } } }),
      this.prisma.application.count({ where: { status: { in: OPEN_STATUSES }, caseManagerUserId: { not: null } } }),
      Promise.all(
        FUNNEL_STAGES.map(async (stage) => ({
          stage,
          count: await this.prisma.caseStatusHistory
            .findMany({ where: { status: stage }, distinct: ["applicationId"], select: { applicationId: true } })
            .then((rows) => rows.length),
        })),
      ),
    ]);

    return {
      bookingsThisMonth,
      revenueThisMonthUsd: Number(payments._sum.amountUsd ?? 0),
      activeCases,
      // Proxy metric: share of open cases with a case manager assigned. No SLA
      // due-date tracking exists in the schema, so this stands in for true SLA
      // compliance until due-date fields are added.
      slaComplianceRate: activeCases === 0 ? 1 : activeWithManager / activeCases,
      conversionFunnel,
    };
  }

  async listUsers(query: ListUsersQuery) {
    const take = query.limit ?? 20;
    const users = await this.prisma.user.findMany({
      where: query.role ? { role: query.role } : undefined,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = users.length > take;
    const data = hasMore ? users.slice(0, take) : users;
    return { data: data.map((u) => this.toPublicUser(u)), meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
  }

  async inviteUser(user: AuthenticatedUser, dto: InviteUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw AppException.conflict("EMAIL_IN_USE", "An account with this email already exists.");

    const tempPassword = randomBytes(12).toString("base64url");
    const passwordHash = await argon2.hash(tempPassword);

    const created = await this.prisma.user.create({
      // Admin-invited accounts skip self-service OTP verification — the admin entering
      // this email address is itself the trust bootstrap, same as inviting a teammate
      // in most SaaS products. Without this, invited staff could never log in: they
      // get a "set your password" email, not an OTP, so login()'s emailVerifiedAt gate
      // would lock them out permanently.
      data: { email: dto.email, passwordHash, role: dto.role, emailVerifiedAt: new Date() },
    });

    await this.notifications.notify({
      userId: created.id,
      title: "You've been invited to Asia Health Link and Travel",
      body: `An account was created for you with role ${dto.role}. Use "Forgot password" with this email to set your own password.`,
      category: "staff_invited",
    });

    await this.audit.record({
      actorUserId: user.userId,
      actorLabel: "Admin",
      action: "user_invited",
      targetType: "User",
      targetId: created.id,
      metadata: { email: dto.email, role: dto.role },
    });

    return this.toPublicUser(created);
  }

  async updateUser(user: AuthenticatedUser, userId: string, dto: UpdateUserDto) {
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw AppException.notFound("USER_NOT_FOUND", "User not found.");

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: dto.role ?? target.role,
        status: dto.status ?? target.status,
      },
    });

    await this.audit.record({
      actorUserId: user.userId,
      actorLabel: "Admin",
      action: "user_updated",
      targetType: "User",
      targetId: userId,
      metadata: { role: dto.role, status: dto.status },
    });

    if (dto.status === UserStatus.Deactivated) {
      await this.prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    }

    return this.toPublicUser(updated);
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    phone: string | null;
    role: UserRole;
    status: UserStatus;
    twoFactorEnabled: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async listModerationQueue() {
    return this.prisma.hospitalModerationItem.findMany({
      where: { resolvedAt: null },
      orderBy: { submittedAt: "asc" },
    });
  }

  async resolveModerationItem(user: AuthenticatedUser, itemId: string, dto: ResolveModerationItemDto) {
    const item = await this.prisma.hospitalModerationItem.findUnique({ where: { id: itemId } });
    if (!item) throw AppException.notFound("MODERATION_ITEM_NOT_FOUND", "Moderation item not found.");
    if (item.resolvedAt) {
      throw AppException.conflict("ALREADY_RESOLVED", "This moderation item has already been resolved.");
    }
    if (!dto.approved && !dto.rejectionReason) {
      throw AppException.validation("rejectionReason is required when approved=false.");
    }

    const updated = await this.prisma.hospitalModerationItem.update({
      where: { id: item.id },
      data: {
        approved: dto.approved,
        resolvedAt: new Date(),
        changeSummary: dto.approved ? item.changeSummary : `${item.changeSummary} | Rejected: ${dto.rejectionReason}`,
      },
    });

    await this.audit.record({
      actorUserId: user.userId,
      actorLabel: "Admin",
      action: dto.approved ? "hospital_change_approved" : "hospital_change_rejected",
      targetType: "Hospital",
      targetId: item.hospitalId,
      metadata: { moderationItemId: item.id },
    });

    return updated;
  }

  async auditLog(query: ListAuditLogQuery) {
    const take = query.limit ?? 20;
    const entries = await this.prisma.auditLog.findMany({
      where: query.targetType ? { targetType: query.targetType } : undefined,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = entries.length > take;
    const data = hasMore ? entries.slice(0, take) : entries;
    return { data, meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
  }

  async listAllArticles() {
    return this.prisma.article.findMany({ orderBy: { updatedAt: "desc" } });
  }

  async getSettings() {
    const rows = await this.prisma.platformSetting.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  }

  async updateSetting(user: AuthenticatedUser, dto: UpdateSettingDto) {
    const updated = await this.prisma.platformSetting.upsert({
      where: { key: dto.key },
      create: { key: dto.key, value: dto.value as never },
      update: { value: dto.value as never },
    });

    await this.audit.record({
      actorUserId: user.userId,
      actorLabel: "Admin",
      action: "setting_updated",
      targetType: "PlatformSetting",
      targetId: dto.key,
      metadata: { value: dto.value as never },
    });

    return updated;
  }

  // --- hospitals / doctors / packages (direct admin CRUD, bypasses the ---
  // --- hospital_staff moderation-queue flow since admins are trusted) ---

  async listAllHospitals() {
    return this.prisma.hospital.findMany({ orderBy: { name: "asc" } });
  }

  async createHospital(admin: AuthenticatedUser, dto: CreateHospitalDto) {
    const existing = await this.prisma.hospital.findUnique({ where: { slug: dto.slug } });
    if (existing) throw AppException.conflict("SLUG_IN_USE", "A hospital with this slug already exists.");

    const hospital = await this.prisma.hospital.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        citySlug: dto.citySlug,
        description: dto.description,
        priceTier: dto.priceTier,
        accreditations: dto.accreditations,
        languages: dto.languages,
        facilities: dto.facilities,
        status: dto.status ?? HospitalListingStatus.Published,
      },
    });

    await this.audit.record({
      actorUserId: admin.userId,
      actorLabel: "Admin",
      action: "hospital_created",
      targetType: "Hospital",
      targetId: hospital.id,
      metadata: { slug: dto.slug },
    });

    return hospital;
  }

  async updateHospital(admin: AuthenticatedUser, hospitalId: string, dto: AdminUpdateHospitalDto) {
    const hospital = await this.requireHospital(hospitalId);

    const updated = await this.prisma.hospital.update({
      where: { id: hospitalId },
      data: {
        name: dto.name ?? hospital.name,
        description: dto.description ?? hospital.description,
        citySlug: dto.citySlug ?? hospital.citySlug,
        priceTier: dto.priceTier ?? hospital.priceTier,
        accreditations: dto.accreditations ?? hospital.accreditations,
        languages: dto.languages ?? hospital.languages,
        facilities: dto.facilities ?? hospital.facilities,
        status: dto.status ?? hospital.status,
      },
    });

    await this.audit.record({
      actorUserId: admin.userId,
      actorLabel: "Admin",
      action: "hospital_updated",
      targetType: "Hospital",
      targetId: hospitalId,
      metadata: { fields: Object.keys(dto) },
    });

    return updated;
  }

  async createDoctor(admin: AuthenticatedUser, hospitalId: string, dto: CreateDoctorDto) {
    await this.requireHospital(hospitalId);
    const doctor = await this.prisma.doctor.create({ data: { ...dto, hospitalId } });

    await this.audit.record({
      actorUserId: admin.userId,
      actorLabel: "Admin",
      action: "doctor_created",
      targetType: "Doctor",
      targetId: doctor.id,
      metadata: { hospitalId },
    });

    return doctor;
  }

  async updateDoctor(admin: AuthenticatedUser, hospitalId: string, doctorId: string, dto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor || doctor.hospitalId !== hospitalId) {
      throw AppException.notFound("DOCTOR_NOT_FOUND", "Doctor not found.");
    }

    const updated = await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        name: dto.name ?? doctor.name,
        specialtySlug: dto.specialtySlug ?? doctor.specialtySlug,
        credentials: dto.credentials ?? doctor.credentials,
        yearsExperience: dto.yearsExperience ?? doctor.yearsExperience,
        languages: dto.languages ?? doctor.languages,
        bio: dto.bio ?? doctor.bio,
      },
    });

    await this.audit.record({
      actorUserId: admin.userId,
      actorLabel: "Admin",
      action: "doctor_updated",
      targetType: "Doctor",
      targetId: doctorId,
      metadata: { hospitalId },
    });

    return updated;
  }

  async createPackage(admin: AuthenticatedUser, hospitalId: string, dto: CreateTreatmentPackageDto) {
    await this.requireHospital(hospitalId);
    const pkg = await this.prisma.treatmentPackage.create({ data: { ...dto, hospitalId } });

    await this.audit.record({
      actorUserId: admin.userId,
      actorLabel: "Admin",
      action: "package_created",
      targetType: "TreatmentPackage",
      targetId: pkg.id,
      metadata: { hospitalId },
    });

    return pkg;
  }

  async updatePackage(admin: AuthenticatedUser, hospitalId: string, packageId: string, dto: UpdatePackageDto) {
    const pkg = await this.prisma.treatmentPackage.findUnique({ where: { id: packageId } });
    if (!pkg || pkg.hospitalId !== hospitalId) {
      throw AppException.notFound("PACKAGE_NOT_FOUND", "Treatment package not found.");
    }

    const updated = await this.prisma.treatmentPackage.update({
      where: { id: packageId },
      data: {
        name: dto.name ?? pkg.name,
        specialtySlug: dto.specialtySlug ?? pkg.specialtySlug,
        description: dto.description ?? pkg.description,
        priceMinUsd: dto.priceMinUsd ?? pkg.priceMinUsd,
        priceMaxUsd: dto.priceMaxUsd ?? pkg.priceMaxUsd,
        includes: dto.includes ?? pkg.includes,
      },
    });

    await this.audit.record({
      actorUserId: admin.userId,
      actorLabel: "Admin",
      action: "package_updated",
      targetType: "TreatmentPackage",
      targetId: packageId,
      metadata: { hospitalId },
    });

    return updated;
  }

  private async requireHospital(hospitalId: string) {
    const hospital = await this.prisma.hospital.findUnique({ where: { id: hospitalId } });
    if (!hospital) throw AppException.notFound("HOSPITAL_NOT_FOUND", "Hospital not found.");
    return hospital;
  }
}
