import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { AdminService } from "./admin.service";
import {
  InviteUserDto,
  ListAuditLogQuery,
  ListUsersQuery,
  ResolveModerationItemDto,
  UpdateSettingDto,
  UpdateUserDto,
} from "./dto/admin.dto";

@Controller("admin")
@Roles(UserRole.admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get("users")
  listUsers(@Query() query: ListUsersQuery) {
    return this.adminService.listUsers(query);
  }

  @Post("users")
  inviteUser(@CurrentUser() user: AuthenticatedUser, @Body() dto: InviteUserDto) {
    return this.adminService.inviteUser(user, dto);
  }

  @Patch("users/:userId")
  updateUser(@CurrentUser() user: AuthenticatedUser, @Param("userId") userId: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(user, userId, dto);
  }

  @Get("hospitals/moderation-queue")
  listModerationQueue() {
    return this.adminService.listModerationQueue();
  }

  @Post("hospitals/moderation-queue/:itemId/resolve")
  resolveModerationItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param("itemId") itemId: string,
    @Body() dto: ResolveModerationItemDto,
  ) {
    return this.adminService.resolveModerationItem(user, itemId, dto);
  }

  @Get("audit-log")
  auditLog(@Query() query: ListAuditLogQuery) {
    return this.adminService.auditLog(query);
  }

  @Get("settings")
  getSettings() {
    return this.adminService.getSettings();
  }

  @Put("settings")
  updateSetting(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateSettingDto) {
    return this.adminService.updateSetting(user, dto);
  }
}
