import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { SmsService } from "../sms/sms.service";
import { NotificationChannel } from "@prisma/client";

export interface NotifyInput {
  userId: string;
  title: string;
  body: string;
  category: string;
  linkUrl?: string;
}

/**
 * Central notification dispatch, per docs/03-architecture/07-notification-architecture.md
 * §1 — every module emits through here rather than calling an email/SMS provider
 * directly. Always writes the in-app Notification row (real, queryable by the
 * Notifications module); the email send goes through EmailService (real Resend once
 * RESEND_API_KEY is configured, console-log stand-in otherwise — see email.service.ts).
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger("NotificationDispatch");

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly sms: SmsService,
  ) {}

  async notify(input: NotifyInput): Promise<void> {
    const preference = await this.prisma.notificationPreference.findUnique({
      where: { userId_category: { userId: input.userId, category: input.category } },
    });

    if (preference?.inAppEnabled ?? true) {
      await this.prisma.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          body: input.body,
          category: input.category,
          channel: NotificationChannel.InApp,
          linkUrl: input.linkUrl,
        },
      });
    }

    if (preference?.emailEnabled ?? true) {
      await this.dispatchEmail(input);
    }

    // smsEnabled defaults to false when no preference row exists (opt-in, unlike
    // email/in-app) — SMS costs real money per message even in dev/test mode, so it
    // shouldn't fire for every user by default the moment Twilio is configured.
    if (preference?.smsEnabled) {
      await this.dispatchSms(input);
    }
  }

  private async dispatchEmail(input: NotifyInput): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: input.userId }, select: { email: true } });
    if (!user) {
      this.logger.warn(`Cannot email notification "${input.title}" — user ${input.userId} not found.`);
      return;
    }

    await this.email.send({ to: user.email, subject: input.title, text: input.body });
  }

  private async dispatchSms(input: NotifyInput): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: input.userId }, select: { phone: true } });
    if (!user?.phone) return;

    await this.sms.send({ to: user.phone, body: `${input.title}: ${input.body}` });
  }
}
