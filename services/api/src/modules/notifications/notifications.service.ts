import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { ListNotificationsQuery, NotificationPreferenceDto } from "./dto/notifications.dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListNotificationsQuery) {
    const take = query.limit ?? 20;
    const notifications = await this.prisma.notification.findMany({
      where: { userId: user.userId, ...(query.unreadOnly ? { readAt: null } : {}) },
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
    });

    const hasMore = notifications.length > take;
    const data = hasMore ? notifications.slice(0, take) : notifications;
    return { data, meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
  }

  async markRead(user: AuthenticatedUser, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== user.userId) {
      throw AppException.notFound("NOTIFICATION_NOT_FOUND", "Notification not found.");
    }
    return this.prisma.notification.update({ where: { id: notification.id }, data: { readAt: new Date() } });
  }

  async markAllRead(user: AuthenticatedUser) {
    await this.prisma.notification.updateMany({
      where: { userId: user.userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async getPreferences(user: AuthenticatedUser) {
    return this.prisma.notificationPreference.findMany({ where: { userId: user.userId } });
  }

  async updatePreferences(user: AuthenticatedUser, preferences: NotificationPreferenceDto[]) {
    await this.prisma.$transaction(
      preferences.map((pref) =>
        this.prisma.notificationPreference.upsert({
          where: { userId_category: { userId: user.userId, category: pref.category } },
          create: {
            userId: user.userId,
            category: pref.category,
            emailEnabled: pref.emailEnabled,
            smsEnabled: pref.smsEnabled,
            inAppEnabled: pref.inAppEnabled,
          },
          update: {
            emailEnabled: pref.emailEnabled,
            smsEnabled: pref.smsEnabled,
            inAppEnabled: pref.inAppEnabled,
          },
        }),
      ),
    );
    return this.getPreferences(user);
  }
}
