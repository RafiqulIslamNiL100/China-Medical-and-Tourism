import { HttpStatus, Injectable, StreamableFile } from "@nestjs/common";
import { InvoiceStatus, PartnerType, UserRole } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AuditService } from "../../common/audit/audit.service";
import { MockPaymentProcessor } from "../../common/payments/mock-payment-processor.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { ListPaymentsQuery, PayInvoiceDto, RefundDto, SetCommissionRateDto } from "./dto/payments.dto";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
    private readonly processor: MockPaymentProcessor,
  ) {}

  async listInvoices(user: AuthenticatedUser, applicationId: string) {
    await this.requireCaseAccess(user, applicationId);
    return this.prisma.invoice.findMany({ where: { applicationId, deletedAt: null }, orderBy: { createdAt: "asc" } });
  }

  async payInvoice(user: AuthenticatedUser, invoiceId: string, idempotencyKey: string, dto: PayInvoiceDto) {
    if (user.role !== UserRole.patient) throw AppException.forbidden();
    if (invoiceId !== dto.invoiceId) {
      throw AppException.validation("invoiceId in the path and request body must match.");
    }

    const existing = await this.prisma.payment.findUnique({
      where: { provider_providerRef: { provider: "mock", providerRef: idempotencyKey } },
    });
    if (existing) return existing;

    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.deletedAt) throw AppException.notFound("INVOICE_NOT_FOUND", "Invoice not found.");
    await this.requireCaseAccess(user, invoice.applicationId);
    if (invoice.status !== InvoiceStatus.Due) {
      throw AppException.conflict("PRECONDITION_FAILED", "This invoice is not due for payment.");
    }

    const result = await this.processor.charge(dto.paymentMethodToken);
    if (!result.success) {
      throw new AppException(HttpStatus.PAYMENT_REQUIRED, "PAYMENT_DECLINED", "The payment was declined by the processor.");
    }

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amountUsd: invoice.amountUsd,
        provider: "mock",
        providerRef: idempotencyKey,
      },
    });
    await this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: InvoiceStatus.Paid } });

    await this.audit.record({
      actorUserId: user.userId,
      actorLabel: "Patient",
      action: "invoice_paid",
      targetType: "Invoice",
      targetId: invoice.id,
      metadata: { paymentId: payment.id, amountUsd: invoice.amountUsd.toString() },
    });

    const application = await this.prisma.application.findUnique({ where: { id: invoice.applicationId } });
    if (application?.caseManagerUserId) {
      await this.notifications.notify({
        userId: application.caseManagerUserId,
        title: "Invoice paid",
        body: `${invoice.description} for case ${application.refNumber} has been paid.`,
        category: "invoice_paid",
        linkUrl: `/ops/cases/${application.id}`,
      });
    }

    return payment;
  }

  async downloadReceipt(user: AuthenticatedUser, invoiceId: string): Promise<StreamableFile> {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.deletedAt) throw AppException.notFound("INVOICE_NOT_FOUND", "Invoice not found.");
    await this.requireCaseAccess(user, invoice.applicationId);

    const payment = await this.prisma.payment.findFirst({ where: { invoiceId: invoice.id }, orderBy: { paidAt: "desc" } });
    const application = await this.prisma.application.findUniqueOrThrow({ where: { id: invoice.applicationId } });

    const text = [
      "RECEIPT",
      "",
      `Case reference: ${application.refNumber}`,
      `Invoice: ${invoice.description}`,
      `Amount: $${invoice.amountUsd.toString()} USD`,
      `Status: ${invoice.status}`,
      payment ? `Paid at: ${payment.paidAt.toISOString()}` : "Not yet paid.",
      "",
      "(Development placeholder — no PDF rendering library is available in this",
      "environment, so this receipt is served as plain text; a production build",
      "renders a real PDF per FR-PAY-05.)",
    ].join("\n");

    return new StreamableFile(Buffer.from(text), { type: "text/plain" });
  }

  async refund(user: AuthenticatedUser, paymentId: string, idempotencyKey: string, dto: RefundDto) {
    this.requireRole(user, [UserRole.admin]);

    const existing = await this.prisma.refund.findUnique({ where: { idempotencyKey } });
    if (existing) return existing;

    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw AppException.notFound("PAYMENT_NOT_FOUND", "Payment not found.");

    const alreadyRefunded = await this.prisma.refund.aggregate({
      where: { paymentId },
      _sum: { amountUsd: true },
    });
    const refundedSoFar = Number(alreadyRefunded._sum.amountUsd ?? 0);
    if (refundedSoFar + dto.amountUsd > Number(payment.amountUsd)) {
      throw AppException.validation("Refund amount exceeds the remaining refundable balance.");
    }

    const refund = await this.prisma.refund.create({
      data: {
        paymentId: payment.id,
        amountUsd: dto.amountUsd,
        reason: dto.reason,
        processedByUserId: user.userId,
        idempotencyKey,
      },
    });

    const invoice = await this.prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
    if (invoice && refundedSoFar + dto.amountUsd >= Number(payment.amountUsd)) {
      await this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: InvoiceStatus.Refunded } });
    }

    await this.audit.record({
      actorUserId: user.userId,
      actorLabel: "Admin",
      action: "payment_refunded",
      targetType: "Payment",
      targetId: payment.id,
      metadata: { refundId: refund.id, amountUsd: dto.amountUsd.toString(), reason: dto.reason },
    });

    if (invoice) {
      const application = await this.prisma.application.findUnique({ where: { id: invoice.applicationId } });
      const patient = application ? await this.prisma.patient.findUnique({ where: { id: application.patientId } }) : null;
      if (patient) {
        await this.notifications.notify({
          userId: patient.userId,
          title: "Refund processed",
          body: `A refund of $${dto.amountUsd} was issued for ${invoice.description}.`,
          category: "refund_processed",
          linkUrl: `/app/cases/${invoice.applicationId}`,
        });
      }
    }

    return refund;
  }

  async myPayments(user: AuthenticatedUser, query: ListPaymentsQuery) {
    if (user.role !== UserRole.patient) throw AppException.forbidden();
    const patient = await this.prisma.patient.findUnique({ where: { userId: user.userId } });
    if (!patient) throw AppException.notFound("PATIENT_PROFILE_NOT_FOUND", "Patient profile not found.");

    const applications = await this.prisma.application.findMany({ where: { patientId: patient.id }, select: { id: true } });
    const applicationIds = applications.map((a) => a.id);

    return this.paginatedPayments(query, { invoice: { applicationId: { in: applicationIds } } });
  }

  async listCommissionRates(user: AuthenticatedUser) {
    this.requireRole(user, [UserRole.admin]);
    return this.prisma.commissionRate.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  async setCommissionRate(user: AuthenticatedUser, dto: SetCommissionRateDto) {
    this.requireRole(user, [UserRole.admin]);
    if (dto.partnerType === PartnerType.Hospital && !dto.hospitalId) {
      throw AppException.validation("hospitalId is required for partnerType Hospital.");
    }
    if (dto.partnerType === PartnerType.Hotel && !dto.hotelId) {
      throw AppException.validation("hotelId is required for partnerType Hotel.");
    }

    return this.prisma.commissionRate.create({
      data: {
        partnerType: dto.partnerType,
        hospitalId: dto.hospitalId,
        hotelId: dto.hotelId,
        rate: dto.rate,
      },
    });
  }

  async transactions(user: AuthenticatedUser, query: ListPaymentsQuery) {
    this.requireRole(user, [UserRole.admin]);
    return this.paginatedPayments(query, {});
  }

  // --- internal helpers -----------------------------------------------------------

  private async paginatedPayments(query: ListPaymentsQuery, extraWhere: Record<string, unknown>) {
    const take = query.limit ?? 20;
    const payments = await this.prisma.payment.findMany({
      where: extraWhere,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { paidAt: "desc" },
    });

    const hasMore = payments.length > take;
    const data = hasMore ? payments.slice(0, take) : payments;
    return { data, meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
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

  private requireRole(user: AuthenticatedUser, roles: UserRole[]) {
    if (!roles.includes(user.role)) throw AppException.forbidden();
  }
}
