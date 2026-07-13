import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

export interface ChargeResult {
  success: boolean;
  providerRef: string;
}

/**
 * Stand-in for a real payment gateway (e.g. Stripe) — no processor credentials exist
 * in this environment. Swap this class for a real `StripePaymentProcessor` behind the
 * same interface to go live; nothing above the PaymentsService needs to change. The
 * token "tok_decline" is a documented test hook that simulates a processor decline so
 * the 402 path is exercisable.
 */
@Injectable()
export class MockPaymentProcessor {
  async charge(paymentMethodToken: string): Promise<ChargeResult> {
    if (paymentMethodToken === "tok_decline") {
      return { success: false, providerRef: randomUUID() };
    }
    return { success: true, providerRef: randomUUID() };
  }
}
