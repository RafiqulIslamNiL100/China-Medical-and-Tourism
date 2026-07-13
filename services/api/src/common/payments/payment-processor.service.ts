import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { randomUUID } from "crypto";

export interface ChargeResult {
  success: boolean;
  gatewayRef: string;
  declineReason?: string;
}

export interface RefundResult {
  gatewayRef: string;
}

/**
 * Real Stripe integration, gated on STRIPE_SECRET_KEY. Falls back to the original
 * documented mock behavior (any token "succeeds" except the literal "tok_decline")
 * when no key is configured, so nothing breaks without credentials — same pattern as
 * EmailService/StorageService.
 *
 * In Stripe mode, paymentMethodToken must be a real Stripe PaymentMethod id (e.g. one
 * of Stripe's test cards — "pm_card_visa" succeeds, "pm_card_chargeDeclined" declines,
 * see https://stripe.com/docs/testing) rather than the legacy "tok_visa"-style Charges
 * API token used by the mock path, since PaymentIntents (the modern API this uses)
 * takes PaymentMethod ids.
 */
@Injectable()
export class PaymentProcessorService implements OnModuleInit {
  private readonly logger = new Logger("PaymentProcessorService");
  private stripe: Stripe | null = null;
  providerName: "stripe" | "mock" = "mock";

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const secretKey = this.config.get<string>("STRIPE_SECRET_KEY");
    if (secretKey) {
      this.stripe = new Stripe(secretKey);
      this.providerName = "stripe";
      this.logger.log("Stripe configured — payments will be processed for real.");
    } else {
      this.logger.warn("STRIPE_SECRET_KEY not set — payments will be simulated by the mock processor.");
    }
  }

  async charge(paymentMethodToken: string, amountUsd: number): Promise<ChargeResult> {
    if (!this.stripe) {
      if (paymentMethodToken === "tok_decline") {
        return { success: false, gatewayRef: randomUUID(), declineReason: "Simulated decline (mock processor)." };
      }
      return { success: true, gatewayRef: randomUUID() };
    }

    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amountUsd * 100),
        currency: "usd",
        payment_method: paymentMethodToken,
        payment_method_types: ["card"],
        confirm: true,
      });

      if (intent.status === "succeeded") {
        return { success: true, gatewayRef: intent.id };
      }
      return { success: false, gatewayRef: intent.id, declineReason: `Payment intent status: ${intent.status}` };
    } catch (err) {
      if (err instanceof Stripe.errors.StripeCardError) {
        return {
          success: false,
          gatewayRef: err.payment_intent?.id ?? randomUUID(),
          declineReason: err.message,
        };
      }
      throw err;
    }
  }

  async refund(gatewayRef: string | null, amountUsd: number): Promise<RefundResult> {
    if (!this.stripe || !gatewayRef) {
      return { gatewayRef: randomUUID() };
    }
    const refund = await this.stripe.refunds.create({
      payment_intent: gatewayRef,
      amount: Math.round(amountUsd * 100),
    });
    return { gatewayRef: refund.id };
  }

  /** Throws if verification fails — callers should return 400 on the caught error. */
  verifyWebhookSignature(rawBody: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.config.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!this.stripe || !webhookSecret) {
      throw new Error(
        "Stripe webhook verification requires both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to be configured.",
      );
    }
    return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }
}
