import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
}

/**
 * Real Resend integration, gated on RESEND_API_KEY being set. Without a key (e.g. this
 * sandbox, which has no provider credentials) it falls back to the same console-log
 * dev stand-in NotificationService always used, so local development keeps working
 * unchanged. Once RESEND_API_KEY is set in env, every email this service sends —
 * OTP codes, password reset, invoice/case notifications, everything routed through
 * NotificationService.notify() — starts actually delivering, with no other code
 * changes required.
 */
@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger("EmailService");
  private client: Resend | null = null;
  private fromAddress = "Asia Health Link and Travel <onboarding@resend.dev>";
  private usingSandboxSender = true;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.get<string>("RESEND_API_KEY");
    const fromAddress = this.config.get<string>("RESEND_FROM_EMAIL");
    if (fromAddress) this.fromAddress = fromAddress;
    this.usingSandboxSender = this.fromAddress.includes("@resend.dev");

    if (apiKey) {
      this.client = new Resend(apiKey);
      this.logger.log("Resend configured — outgoing email will be sent for real.");
      if (this.usingSandboxSender) {
        // Resend's onboarding@resend.dev sender only delivers to the Resend account's
        // own verified owner address — it silently cannot reach real patients/users.
        // Verify a domain in the Resend dashboard and set RESEND_FROM_EMAIL to an
        // address on it (e.g. "Asia Health Link and Travel <noreply@yourdomain.com>")
        // before relying on OTP/notification email in production.
        this.logger.warn(
          "RESEND_FROM_EMAIL is unset or still using onboarding@resend.dev — Resend's " +
            "sandbox sender can ONLY deliver to the Resend account owner's own verified " +
            "email address. Real users will not receive OTP/notification emails until " +
            "you verify a sending domain in Resend and set RESEND_FROM_EMAIL to an " +
            "address on that domain.",
        );
      }
    } else {
      this.logger.warn("RESEND_API_KEY not set — email will be logged to the console instead of sent.");
    }
  }

  async send(input: SendEmailInput): Promise<void> {
    if (!this.client) {
      this.logger.log(`[dev email stand-in] to ${input.to}: "${input.subject}" — ${input.text}`);
      return;
    }

    const { error } = await this.client.emails.send({
      from: this.fromAddress,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });

    if (error) {
      const hint = this.usingSandboxSender
        ? " (likely cause: RESEND_FROM_EMAIL is still the onboarding@resend.dev sandbox " +
          "sender, which can only email the Resend account owner — verify a domain in " +
          "Resend and set RESEND_FROM_EMAIL to fix this for all recipients)"
        : "";
      this.logger.error(`Resend send failed for ${input.to}: ${error.message}${hint}`);
    }
  }
}
