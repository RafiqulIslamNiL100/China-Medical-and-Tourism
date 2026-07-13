import { Injectable, StreamableFile } from "@nestjs/common";
import { DocumentStatus, InvoiceStatus, UserRole } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { StorageService } from "../../common/storage/storage.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { VerifyDocumentDto } from "./dto/documents.dto";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationService,
  ) {}

  async listChecklist(user: AuthenticatedUser, applicationId: string) {
    const application = await this.requireAccess(user, applicationId);
    const items = await this.prisma.documentChecklistItem.findMany({
      where: { applicationId: application.id, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
    return Promise.all(items.map((item) => this.withDownloadUrl(item)));
  }

  async upload(user: AuthenticatedUser, applicationId: string, documentId: string, file: Express.Multer.File) {
    await this.requireAccess(user, applicationId);
    const item = await this.requireItem(applicationId, documentId);

    if (!file) throw AppException.validation("A file is required.");

    const key = await this.storage.save(file.originalname, file.buffer);
    const updated = await this.prisma.documentChecklistItem.update({
      where: { id: item.id },
      data: { status: DocumentStatus.Uploaded, fileStorageKey: key, uploadedAt: new Date() },
    });
    return this.withDownloadUrl(updated);
  }

  async downloadFile(key: string): Promise<StreamableFile> {
    try {
      const stream = await this.storage.download(key);
      return new StreamableFile(stream);
    } catch {
      throw AppException.notFound("DOCUMENT_FILE_NOT_FOUND", "File not found.");
    }
  }

  async verify(user: AuthenticatedUser, applicationId: string, documentId: string, dto: VerifyDocumentDto) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const item = await this.requireItem(applicationId, documentId);

    const updated = await this.prisma.documentChecklistItem.update({
      where: { id: item.id },
      data: {
        status: dto.approved ? DocumentStatus.Verified : DocumentStatus.Rejected,
        note: dto.note,
        verifiedByUserId: user.userId,
        verifiedAt: new Date(),
      },
    });

    const application = await this.prisma.application.findUniqueOrThrow({ where: { id: applicationId } });
    const patient = await this.prisma.patient.findUnique({ where: { id: application.patientId } });
    if (patient) {
      await this.notifications.notify({
        userId: patient.userId,
        title: dto.approved ? "Document verified" : "Document needs attention",
        body: `${item.name}: ${dto.approved ? "verified" : `rejected — ${dto.note ?? "see case notes"}`}`,
        category: "document_status",
        linkUrl: `/app/cases/${applicationId}`,
      });
    }

    return this.withDownloadUrl(updated);
  }

  async generateInvitationLetter(user: AuthenticatedUser, applicationId: string) {
    this.requireRole(user, [UserRole.case_manager, UserRole.admin]);
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) throw AppException.notFound("CASE_NOT_FOUND", "Application not found.");

    if (application.status !== "Accepted") {
      throw AppException.conflict(
        "PRECONDITION_FAILED",
        "The hospital must accept this case before an invitation letter can be issued.",
      );
    }
    const depositPaid = await this.prisma.invoice.findFirst({
      where: { applicationId, description: "Booking deposit", status: InvoiceStatus.Paid },
    });
    if (!depositPaid) {
      throw AppException.conflict(
        "PRECONDITION_FAILED",
        "The booking deposit must be paid before an invitation letter can be issued (BR-17).",
      );
    }

    const key = await this.storage.save(
      `invitation-letter-${application.refNumber}.txt`,
      Buffer.from(this.renderInvitationLetter(application.refNumber)),
    );

    const letter = await this.prisma.invitationLetter.create({
      data: { applicationId, fileStorageKey: key, templateVersion: "v1", issuedByUserId: user.userId },
    });

    const patient = await this.prisma.patient.findUnique({ where: { id: application.patientId } });
    if (patient) {
      await this.notifications.notify({
        userId: patient.userId,
        title: "Your invitation letter is ready",
        body: `Your invitation letter for case ${application.refNumber} has been issued.`,
        category: "invitation_letter_issued",
        linkUrl: `/app/cases/${applicationId}`,
      });
    }

    return { ...letter, downloadUrl: await this.storage.getDownloadUrl(letter.fileStorageKey) };
  }

  private renderInvitationLetter(refNumber: string): string {
    return [
      "INVITATION LETTER",
      "",
      `Case reference: ${refNumber}`,
      "",
      "This letter confirms that the patient referenced above has been accepted for",
      "treatment and is invited to travel to China for the purpose of receiving medical",
      "care, per the treatment plan on file with the hospital.",
      "",
      "(Development placeholder — a production template renders hospital letterhead,",
      "patient/passport details, and treatment dates per",
      "docs/03-architecture/03-backend-api-architecture.md and FR-VISA-02.)",
    ].join("\n");
  }

  private async withDownloadUrl<T extends { fileStorageKey: string | null }>(item: T) {
    return {
      ...item,
      downloadUrl: item.fileStorageKey ? await this.storage.getDownloadUrl(item.fileStorageKey) : null,
    };
  }

  private async requireItem(applicationId: string, documentId: string) {
    const item = await this.prisma.documentChecklistItem.findUnique({ where: { id: documentId } });
    if (!item || item.applicationId !== applicationId || item.deletedAt) {
      throw AppException.notFound("DOCUMENT_NOT_FOUND", "Document checklist item not found.");
    }
    return item;
  }

  private async requireAccess(user: AuthenticatedUser, applicationId: string) {
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

  private requireRole(user: AuthenticatedUser, roles: UserRole[]) {
    if (!roles.includes(user.role)) throw AppException.forbidden();
  }
}
