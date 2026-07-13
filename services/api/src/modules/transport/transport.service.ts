import { Injectable } from "@nestjs/common";
import { ServiceAssignmentStatus, UserRole } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import {
  AssignDriverDto,
  AssignInterpreterDto,
  CreateInterpreterSessionDto,
  CreateTransferDto,
} from "./dto/transport.dto";

@Injectable()
export class TransportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  // --- transfers (FR-XFER-01..04) --------------------------------------------------

  async listTransfers(user: AuthenticatedUser, applicationId: string) {
    await this.requireCaseAccess(user, applicationId);
    return this.prisma.transferRequest.findMany({ where: { applicationId, deletedAt: null }, orderBy: { scheduledAt: "asc" } });
  }

  async requestTransfer(user: AuthenticatedUser, applicationId: string, dto: CreateTransferDto) {
    const application = await this.requireCaseAccess(user, applicationId);
    if (user.role !== UserRole.patient) throw AppException.forbidden();

    const transfer = await this.prisma.transferRequest.create({
      data: {
        applicationId: application.id,
        direction: dto.direction,
        flightNumber: dto.flightNumber,
        scheduledAt: new Date(dto.scheduledAt),
        pickupLocation: dto.pickupLocation,
        status: ServiceAssignmentStatus.Requested,
      },
    });

    if (application.caseManagerUserId) {
      await this.notifications.notify({
        userId: application.caseManagerUserId,
        title: "New transfer request",
        body: `A ${dto.direction.toLowerCase()} transfer was requested for case ${application.refNumber}.`,
        category: "transfer_requested",
        linkUrl: `/ops/cases/${application.id}`,
      });
    }

    return transfer;
  }

  async assignDriver(user: AuthenticatedUser, transferId: string, dto: AssignDriverDto) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const transfer = await this.requireTransfer(transferId);

    const driver = await this.prisma.driver.findUnique({ where: { id: dto.driverId } });
    if (!driver) throw AppException.validation("driverId must reference an existing driver.");

    const updated = await this.prisma.transferRequest.update({
      where: { id: transfer.id },
      data: { driverId: driver.id, status: ServiceAssignmentStatus.Assigned },
    });

    await this.notifications.notify({
      userId: driver.userId,
      title: "New trip assigned",
      body: `You have been assigned a ${transfer.direction.toLowerCase()} transfer on ${transfer.scheduledAt.toISOString()}.`,
      category: "transfer_assigned",
      linkUrl: `/driver/trips/${transfer.id}`,
    });
    await this.notifyPatient(transfer.applicationId, "Transfer confirmed", "A driver has been assigned to your transfer.");

    return updated;
  }

  async completeTransfer(user: AuthenticatedUser, transferId: string) {
    const transfer = await this.requireTransfer(transferId);
    const driver = await this.prisma.driver.findUnique({ where: { userId: user.userId } });
    if (!driver || transfer.driverId !== driver.id) throw AppException.forbidden();

    return this.prisma.transferRequest.update({
      where: { id: transfer.id },
      data: { status: ServiceAssignmentStatus.Completed },
    });
  }

  async listMyTrips(user: AuthenticatedUser, status?: "Assigned" | "Completed") {
    const driver = await this.prisma.driver.findUnique({ where: { userId: user.userId } });
    if (!driver) throw AppException.forbidden();

    return this.prisma.transferRequest.findMany({
      where: { driverId: driver.id, deletedAt: null, ...(status ? { status } : {}) },
      orderBy: { scheduledAt: "asc" },
    });
  }

  // --- interpreter sessions (FR-INTERP-01..03) --------------------------------------

  async listInterpreterSessions(user: AuthenticatedUser, applicationId: string) {
    await this.requireCaseAccess(user, applicationId);
    return this.prisma.interpreterAssignment.findMany({
      where: { applicationId, deletedAt: null },
      orderBy: { hospitalVisitAt: "asc" },
    });
  }

  async requestInterpreterSession(user: AuthenticatedUser, applicationId: string, dto: CreateInterpreterSessionDto) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const application = await this.requireCaseAccess(user, applicationId);

    return this.prisma.interpreterAssignment.create({
      data: {
        applicationId: application.id,
        hospitalVisitAt: new Date(dto.hospitalVisitAt),
        department: dto.department,
        note: dto.note,
        status: ServiceAssignmentStatus.Requested,
      },
    });
  }

  async assignInterpreter(user: AuthenticatedUser, sessionId: string, dto: AssignInterpreterDto) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const session = await this.requireInterpreterSession(sessionId);

    const interpreter = await this.prisma.interpreter.findUnique({ where: { id: dto.interpreterId } });
    if (!interpreter) throw AppException.validation("interpreterId must reference an existing interpreter.");

    const updated = await this.prisma.interpreterAssignment.update({
      where: { id: session.id },
      data: { interpreterId: interpreter.id, status: ServiceAssignmentStatus.Assigned },
    });

    await this.notifications.notify({
      userId: interpreter.userId,
      title: "New interpreter appointment assigned",
      body: `You have been assigned a hospital visit on ${session.hospitalVisitAt.toISOString()}.`,
      category: "interpreter_assigned",
      linkUrl: `/interpreter/appointments/${session.id}`,
    });
    await this.notifyPatient(session.applicationId, "Interpreter confirmed", "An interpreter has been assigned to your hospital visit.");

    return updated;
  }

  async completeInterpreterSession(user: AuthenticatedUser, sessionId: string) {
    const session = await this.requireInterpreterSession(sessionId);
    const interpreter = await this.prisma.interpreter.findUnique({ where: { userId: user.userId } });
    if (!interpreter || session.interpreterId !== interpreter.id) throw AppException.forbidden();

    return this.prisma.interpreterAssignment.update({
      where: { id: session.id },
      data: { status: ServiceAssignmentStatus.Completed },
    });
  }

  async listMyAppointments(user: AuthenticatedUser) {
    const interpreter = await this.prisma.interpreter.findUnique({ where: { userId: user.userId } });
    if (!interpreter) throw AppException.forbidden();

    return this.prisma.interpreterAssignment.findMany({
      where: { interpreterId: interpreter.id, deletedAt: null },
      orderBy: { hospitalVisitAt: "asc" },
    });
  }

  async listDrivers(user: AuthenticatedUser) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    return this.prisma.driver.findMany({ orderBy: { fullName: "asc" } });
  }

  async listInterpreters(user: AuthenticatedUser) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    return this.prisma.interpreter.findMany({ orderBy: { fullName: "asc" } });
  }

  // --- internal helpers -----------------------------------------------------------

  private async notifyPatient(applicationId: string, title: string, body: string) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) return;
    const patient = await this.prisma.patient.findUnique({ where: { id: application.patientId } });
    if (!patient) return;
    await this.notifications.notify({ userId: patient.userId, title, body, category: "case_status_changed", linkUrl: `/app/cases/${applicationId}` });
  }

  private async requireCaseAccess(user: AuthenticatedUser, applicationId: string) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application || application.deletedAt) {
      throw AppException.notFound("CASE_NOT_FOUND", "Application not found.");
    }

    if (user.role === UserRole.patient) {
      const patient = await this.prisma.patient.findUnique({ where: { userId: user.userId } });
      if (!patient || application.patientId !== patient.id) throw AppException.forbidden();
    } else if (user.role === UserRole.hospital_staff) {
      const staff = await this.prisma.hospitalStaff.findUnique({ where: { userId: user.userId } });
      if (!staff || staff.hospitalId !== application.hospitalId) throw AppException.forbidden();
    } else if (user.role !== UserRole.case_manager && user.role !== UserRole.admin) {
      throw AppException.forbidden();
    }

    return application;
  }

  private async requireTransfer(transferId: string) {
    const transfer = await this.prisma.transferRequest.findUnique({ where: { id: transferId } });
    if (!transfer || transfer.deletedAt) throw AppException.notFound("TRANSFER_NOT_FOUND", "Transfer request not found.");
    return transfer;
  }

  private async requireInterpreterSession(sessionId: string) {
    const session = await this.prisma.interpreterAssignment.findUnique({ where: { id: sessionId } });
    if (!session || session.deletedAt) {
      throw AppException.notFound("INTERPRETER_SESSION_NOT_FOUND", "Interpreter session not found.");
    }
    return session;
  }

  private requireRole(user: AuthenticatedUser, roles: UserRole[]) {
    if (!roles.includes(user.role)) throw AppException.forbidden();
  }
}
