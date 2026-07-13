import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import twilio from "twilio";

export interface SendSmsInput {
  to: string;
  body: string;
}

/**
 * Real Twilio integration, gated on TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/
 * TWILIO_FROM_NUMBER all being set — same credential-gated pattern as EmailService.
 * Without them, falls back to a console-log dev stand-in, so nothing breaks without
 * credentials. Once configured, NotificationService.notify() starts sending real SMS
 * for any user with a phone number and smsEnabled on their NotificationPreference
 * (that column already existed in the schema — it was simply never wired to anything
 * until this service existed).
 */
@Injectable()
export class SmsService implements OnModuleInit {
  private readonly logger = new Logger("SmsService");
  private client: ReturnType<typeof twilio> | null = null;
  private fromNumber = "";

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const accountSid = this.config.get<string>("TWILIO_ACCOUNT_SID");
    const authToken = this.config.get<string>("TWILIO_AUTH_TOKEN");
    const fromNumber = this.config.get<string>("TWILIO_FROM_NUMBER");

    if (accountSid && authToken && fromNumber) {
      this.client = twilio(accountSid, authToken);
      this.fromNumber = fromNumber;
      this.logger.log("Twilio configured — outgoing SMS will be sent for real.");
    } else {
      this.logger.warn("TWILIO_* env vars not fully set — SMS will be logged to the console instead of sent.");
    }
  }

  async send(input: SendSmsInput): Promise<void> {
    if (!this.client) {
      this.logger.log(`[dev SMS stand-in] to ${input.to}: ${input.body}`);
      return;
    }

    try {
      await this.client.messages.create({ to: input.to, from: this.fromNumber, body: input.body });
    } catch (err) {
      this.logger.error(`Twilio send failed for ${input.to}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
