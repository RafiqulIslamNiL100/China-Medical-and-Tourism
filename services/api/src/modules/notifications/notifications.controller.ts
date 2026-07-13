import { Body, Controller, Get, Param, ParseArrayPipe, Post, Put, Query } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { NotificationsService } from "./notifications.service";
import { ListNotificationsQuery, NotificationPreferenceDto } from "./dto/notifications.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListNotificationsQuery) {
    return this.notificationsService.list(user, query);
  }

  @Post(":notificationId/read")
  markRead(@CurrentUser() user: AuthenticatedUser, @Param("notificationId") notificationId: string) {
    return this.notificationsService.markRead(user, notificationId);
  }

  @Post("read-all")
  markAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user);
  }

  @Get("preferences")
  getPreferences(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.getPreferences(user);
  }

  @Put("preferences")
  updatePreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ParseArrayPipe({ items: NotificationPreferenceDto })) preferences: NotificationPreferenceDto[],
  ) {
    return this.notificationsService.updatePreferences(user, preferences);
  }
}
