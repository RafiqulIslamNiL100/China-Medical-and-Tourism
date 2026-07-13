import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { PatientsService } from "./patients.service";
import { CreateDependentDto, UpdateDependentDto, UpdatePatientDto } from "./dto/patients.dto";

@Controller("patients/me")
@Roles(UserRole.patient)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.patientsService.getOwnProfile(user.userId);
  }

  @Patch()
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdatePatientDto) {
    return this.patientsService.updateOwnProfile(user.userId, dto);
  }

  @Get("dependents")
  listDependents(@CurrentUser() user: AuthenticatedUser) {
    return this.patientsService.listDependents(user.userId);
  }

  @Post("dependents")
  addDependent(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDependentDto) {
    return this.patientsService.addDependent(user.userId, dto);
  }

  @Patch("dependents/:dependentId")
  updateDependent(
    @CurrentUser() user: AuthenticatedUser,
    @Param("dependentId") dependentId: string,
    @Body() dto: UpdateDependentDto,
  ) {
    return this.patientsService.updateDependent(user.userId, dependentId, dto);
  }

  @Delete("dependents/:dependentId")
  removeDependent(@CurrentUser() user: AuthenticatedUser, @Param("dependentId") dependentId: string) {
    return this.patientsService.removeDependent(user.userId, dependentId);
  }
}
