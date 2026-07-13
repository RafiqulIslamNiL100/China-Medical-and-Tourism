import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AppException } from "../../common/filters/app-exception";
import { CreateDependentDto, UpdateDependentDto, UpdatePatientDto } from "./dto/patients.dto";

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOwnProfile(userId: string) {
    return this.requirePatient(userId);
  }

  async updateOwnProfile(userId: string, dto: UpdatePatientDto) {
    const patient = await this.requirePatient(userId);
    return this.prisma.patient.update({ where: { id: patient.id }, data: dto });
  }

  async listDependents(userId: string) {
    const patient = await this.requirePatient(userId);
    return this.prisma.dependent.findMany({ where: { patientId: patient.id }, orderBy: { createdAt: "asc" } });
  }

  async addDependent(userId: string, dto: CreateDependentDto) {
    const patient = await this.requirePatient(userId);
    return this.prisma.dependent.create({
      data: { ...dto, dateOfBirth: new Date(dto.dateOfBirth), patientId: patient.id },
    });
  }

  async updateDependent(userId: string, dependentId: string, dto: UpdateDependentDto) {
    const patient = await this.requirePatient(userId);
    await this.requireOwnDependent(patient.id, dependentId);
    return this.prisma.dependent.update({
      where: { id: dependentId },
      data: { ...dto, dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined },
    });
  }

  async removeDependent(userId: string, dependentId: string) {
    const patient = await this.requirePatient(userId);
    await this.requireOwnDependent(patient.id, dependentId);
    await this.prisma.dependent.delete({ where: { id: dependentId } });
  }

  private async requirePatient(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw AppException.notFound("PATIENT_PROFILE_NOT_FOUND", "Patient profile not found.");
    return patient;
  }

  private async requireOwnDependent(patientId: string, dependentId: string) {
    const dependent = await this.prisma.dependent.findUnique({ where: { id: dependentId } });
    if (!dependent || dependent.patientId !== patientId) {
      throw AppException.notFound("DEPENDENT_NOT_FOUND", "Dependent not found.");
    }
    return dependent;
  }
}
