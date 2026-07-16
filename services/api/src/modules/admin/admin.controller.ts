import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { AdminService } from "./admin.service";
import {
  CreateCityDto,
  CreateSpecialtyDto,
  InviteUserDto,
  ListAuditLogQuery,
  ListUsersQuery,
  ResolveModerationItemDto,
  UpdateSettingDto,
  UpdateUserDto,
} from "./dto/admin.dto";
import {
  AdminUpdateHospitalDto,
  CreateDoctorDto,
  CreateHospitalDto,
  CreateTreatmentPackageDto,
  UpdateDoctorDto,
  UpdatePackageDto,
} from "../hospitals/dto/hospitals.dto";

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

  @Get("articles")
  listAllArticles() {
    return this.adminService.listAllArticles();
  }

  @Get("settings")
  getSettings() {
    return this.adminService.getSettings();
  }

  @Put("settings")
  updateSetting(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateSettingDto) {
    return this.adminService.updateSetting(user, dto);
  }

  // --- cities -----------------------------------------------------------------

  @Get("cities")
  listCities() {
    return this.adminService.listCities();
  }

  @Post("cities")
  createCity(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCityDto) {
    return this.adminService.createCity(user, dto);
  }

  // --- specialties --------------------------------------------------------------

  @Post("specialties")
  createSpecialty(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSpecialtyDto) {
    return this.adminService.createSpecialty(user, dto);
  }

  // --- hospitals / doctors / packages: direct admin CRUD, bypassing the ---
  // --- hospital_staff moderation-queue flow since admins are trusted ---

  @Get("hospitals")
  listAllHospitals() {
    return this.adminService.listAllHospitals();
  }

  @Post("hospitals")
  createHospital(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateHospitalDto) {
    return this.adminService.createHospital(user, dto);
  }

  @Patch("hospitals/:hospitalId")
  updateHospital(
    @CurrentUser() user: AuthenticatedUser,
    @Param("hospitalId") hospitalId: string,
    @Body() dto: AdminUpdateHospitalDto,
  ) {
    return this.adminService.updateHospital(user, hospitalId, dto);
  }

  @Post("hospitals/:hospitalId/doctors")
  createDoctor(
    @CurrentUser() user: AuthenticatedUser,
    @Param("hospitalId") hospitalId: string,
    @Body() dto: CreateDoctorDto,
  ) {
    return this.adminService.createDoctor(user, hospitalId, dto);
  }

  @Patch("hospitals/:hospitalId/doctors/:doctorId")
  updateDoctor(
    @CurrentUser() user: AuthenticatedUser,
    @Param("hospitalId") hospitalId: string,
    @Param("doctorId") doctorId: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.adminService.updateDoctor(user, hospitalId, doctorId, dto);
  }

  @Post("hospitals/:hospitalId/packages")
  createPackage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("hospitalId") hospitalId: string,
    @Body() dto: CreateTreatmentPackageDto,
  ) {
    return this.adminService.createPackage(user, hospitalId, dto);
  }

  @Patch("hospitals/:hospitalId/packages/:packageId")
  updatePackage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("hospitalId") hospitalId: string,
    @Param("packageId") packageId: string,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.adminService.updatePackage(user, hospitalId, packageId, dto);
  }
}
