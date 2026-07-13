import { Body, Controller, Get, Headers, Param, Post, Query, RawBodyRequest, Req } from "@nestjs/common";
import type { Request } from "express";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { PaymentsService } from "./payments.service";
import { AppException } from "../../common/filters/app-exception";
import { ListPaymentsQuery, PayInvoiceDto, RefundDto, SetCommissionRateDto } from "./dto/payments.dto";

function requireIdempotencyKey(key: string | undefined): string {
  if (!key) throw AppException.validation("The Idempotency-Key header is required for this endpoint.");
  return key;
}

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("applications/:applicationId/invoices")
  listInvoices(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.paymentsService.listInvoices(user, applicationId);
  }

  @Post("invoices/:invoiceId/pay")
  @Roles(UserRole.patient)
  payInvoice(
    @CurrentUser() user: AuthenticatedUser,
    @Param("invoiceId") invoiceId: string,
    @Headers("idempotency-key") idempotencyKey: string | undefined,
    @Body() dto: PayInvoiceDto,
  ) {
    return this.paymentsService.payInvoice(user, invoiceId, requireIdempotencyKey(idempotencyKey), dto);
  }

  @Get("invoices/:invoiceId/receipt")
  downloadReceipt(@CurrentUser() user: AuthenticatedUser, @Param("invoiceId") invoiceId: string) {
    return this.paymentsService.downloadReceipt(user, invoiceId);
  }

  @Post("payments/:paymentId/refund")
  @Roles(UserRole.admin)
  refund(
    @CurrentUser() user: AuthenticatedUser,
    @Param("paymentId") paymentId: string,
    @Headers("idempotency-key") idempotencyKey: string | undefined,
    @Body() dto: RefundDto,
  ) {
    return this.paymentsService.refund(user, paymentId, requireIdempotencyKey(idempotencyKey), dto);
  }

  @Get("payments/me")
  @Roles(UserRole.patient)
  myPayments(@CurrentUser() user: AuthenticatedUser, @Query() query: ListPaymentsQuery) {
    return this.paymentsService.myPayments(user, query);
  }

  @Get("admin/commission-rates")
  @Roles(UserRole.admin)
  listCommissionRates(@CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.listCommissionRates(user);
  }

  @Post("admin/commission-rates")
  @Roles(UserRole.admin)
  setCommissionRate(@CurrentUser() user: AuthenticatedUser, @Body() dto: SetCommissionRateDto) {
    return this.paymentsService.setCommissionRate(user, dto);
  }

  @Get("admin/transactions")
  @Roles(UserRole.admin)
  transactions(@CurrentUser() user: AuthenticatedUser, @Query() query: ListPaymentsQuery) {
    return this.paymentsService.transactions(user, query);
  }

  // Called by Stripe itself, not a logged-in user — authenticated via the
  // "stripe-signature" header instead of a JWT, hence @Public(). Requires
  // STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to be configured; returns 400
  // (via the global exception filter) if the signature doesn't verify.
  @Public()
  @Post("payments/webhook/stripe")
  handleStripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers("stripe-signature") signature: string | undefined) {
    if (!signature) throw AppException.validation("Missing stripe-signature header.");
    if (!req.rawBody) throw AppException.validation("Missing raw request body.");
    return this.paymentsService.handleStripeWebhook(req.rawBody, signature);
  }
}
