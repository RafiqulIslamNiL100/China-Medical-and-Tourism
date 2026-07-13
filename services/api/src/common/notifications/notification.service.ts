import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
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
 * Notifications module); the "Email" send is a console-log stand-in for Resend/Twilio,
 * since no provider credentials exist in this environment. Swap `dispatchEmail` for a
 * real provider call without touching any caller.
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger("NotificationDispatch");

  constructor(private readonly prisma: PrismaService) {}

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
  }

  private async dispatchEmail(input: NotifyInput): Promise<void> {
    this.logger.log(`[dev email stand-in] to user ${input.userId}: "${input.title}" — ${input.body}`);
  }
}
