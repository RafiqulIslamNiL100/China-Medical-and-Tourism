import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { HospitalsService } from "./hospitals.service";
import {
  CreateDoctorDto,
  CreateTreatmentPackageDto,
  SearchHospitalsQuery,
  SubmitHospitalChangeDto,
} from "./dto/hospitals.dto";

@Controller("hospitals")
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Public()
  @Get()
  search(@Query() query: SearchHospitalsQuery) {
    return this.hospitalsService.search(query);
  }

  @Public()
  @Get(":hospitalId")
  getById(@Param("hospitalId") hospitalId: string) {
    return this.hospitalsService.getById(hospitalId);
  }

  @Patch(":hospitalId")
  @Roles(UserRole.hospital_staff)
  submitChange(
    @Param("hospitalId") hospitalId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitHospitalChangeDto,
  ) {
    return this.hospitalsService.submitChange(hospitalId, user.userId, dto);
  }

  @Public()
  @Get(":hospitalId/doctors")
  listDoctors(@Param("hospitalId") hospitalId: string) {
    return this.hospitalsService.listDoctors(hospitalId);
  }

  @Post(":hospitalId/doctors")
  @Roles(UserRole.hospital_staff)
  addDoctor(
    @Param("hospitalId") hospitalId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDoctorDto,
  ) {
    return this.hospitalsService.addDoctor(hospitalId, user.userId, dto);
  }

  @Public()
  @Get(":hospitalId/doctors/:doctorId")
  getDoctor(@Param("hospitalId") hospitalId: string, @Param("doctorId") doctorId: string) {
    return this.hospitalsService.getDoctor(hospitalId, doctorId);
  }

  @Public()
  @Get(":hospitalId/packages")
  listPackages(@Param("hospitalId") hospitalId: string) {
    return this.hospitalsService.listPackages(hospitalId);
  }

  @Post(":hospitalId/packages")
  @Roles(UserRole.hospital_staff)
  addPackage(
    @Param("hospitalId") hospitalId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTreatmentPackageDto,
  ) {
    return this.hospitalsService.addPackage(hospitalId, user.userId, dto);
  }

  @Get(":hospitalId/reports")
  @Roles(UserRole.hospital_staff, UserRole.admin)
  getReports(@Param("hospitalId") hospitalId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.hospitalsService.getReports(hospitalId, user.userId, user.role);
  }
}
