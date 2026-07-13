import { Injectable } from "@nestjs/common";
import { CaseStatus, ReviewStatus, UserRole } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateReviewDto, ModerateReviewDto } from "./dto/reviews.dto";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateReviewDto) {
    if (user.role !== UserRole.patient) throw AppException.forbidden();

    const patient = await this.prisma.patient.findUnique({ where: { userId: user.userId } });
    if (!patient) throw AppException.notFound("PATIENT_PROFILE_NOT_FOUND", "Patient profile not found.");

    const application = await this.prisma.application.findUnique({ where: { id: dto.applicationId } });
    if (!application || application.patientId !== patient.id) {
      throw AppException.validation("Application does not belong to this account.");
    }
    if (application.status !== CaseStatus.Completed) {
      throw AppException.conflict("PRECONDITION_FAILED", "A review can only be submitted for a Completed case.");
    }

    const existing = await this.prisma.review.findUnique({ where: { applicationId: dto.applicationId } });
    if (existing) {
      throw AppException.conflict("REVIEW_ALREADY_EXISTS", "A review already exists for this case (BR-20).");
    }

    return this.prisma.review.create({
      data: {
        applicationId: application.id,
        patientId: patient.id,
        hospitalId: application.hospitalId,
        rating: dto.rating,
        text: dto.text,
        status: ReviewStatus.Pending,
      },
    });
  }

  async listApprovedForHospital(hospitalId: string) {
    return this.prisma.review.findMany({
      where: { hospitalId, status: ReviewStatus.Approved, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPendingModeration(user: AuthenticatedUser) {
    this.requireAdmin(user);
    return this.prisma.review.findMany({ where: { status: ReviewStatus.Pending, deletedAt: null }, orderBy: { createdAt: "asc" } });
  }

  async moderate(user: AuthenticatedUser, reviewId: string, dto: ModerateReviewDto) {
    this.requireAdmin(user);

    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.deletedAt) throw AppException.notFound("REVIEW_NOT_FOUND", "Review not found.");

    if (dto.decision === "Redact" && !dto.redactedText) {
      throw AppException.validation("redactedText is required when decision=Redact.");
    }

    const statusMap = {
      Approve: ReviewStatus.Approved,
      Redact: ReviewStatus.Redacted,
      Reject: ReviewStatus.Rejected,
    } as const;

    const updated = await this.prisma.review.update({
      where: { id: review.id },
      data: {
        status: statusMap[dto.decision],
        text: dto.decision === "Redact" ? dto.redactedText! : review.text,
        moderatedByUserId: user.userId,
        moderatedAt: new Date(),
      },
    });

    const patient = await this.prisma.patient.findUnique({ where: { id: review.patientId } });
    if (patient) {
      await this.notifications.notify({
        userId: patient.userId,
        title: "Your review was moderated",
        body: `Your review was ${dto.decision.toLowerCase()}d.`,
        category: "review_moderated",
        linkUrl: `/app/cases/${review.applicationId}`,
      });
    }

    return updated;
  }

  private requireAdmin(user: AuthenticatedUser) {
    if (user.role !== UserRole.admin) throw AppException.forbidden();
  }
}
