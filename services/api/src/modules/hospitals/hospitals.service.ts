import { Injectable } from "@nestjs/common";
import { HospitalListingStatus, Prisma, UserRole } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AppException } from "../../common/filters/app-exception";
import {
  CreateDoctorDto,
  CreateTreatmentPackageDto,
  SearchHospitalsQuery,
  SearchTreatmentsQuery,
  SubmitHospitalChangeDto,
} from "./dto/hospitals.dto";

@Injectable()
export class HospitalsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchHospitalsQuery) {
    const where: Prisma.HospitalWhereInput = {
      status: HospitalListingStatus.Published,
      ...(query.city ? { citySlug: query.city } : {}),
      ...(query.minRating ? { rating: { gte: query.minRating } } : {}),
      ...(query.language ? { languages: { has: query.language } } : {}),
      ...(query.specialty
        ? {
            OR: [
              { doctors: { some: { specialtySlug: query.specialty } } },
              { packages: { some: { specialtySlug: query.specialty } } },
            ],
          }
        : {}),
    };

    const take = query.limit ?? 20;
    const hospitals = await this.prisma.hospital.findMany({
      where,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { name: "asc" },
    });

    const hasMore = hospitals.length > take;
    const data = hasMore ? hospitals.slice(0, take) : hospitals;
    return { data, meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
  }

  /** Cross-hospital treatment search — homepage "Explore Treatments" and the /treatments page. */
  async searchTreatments(query: SearchTreatmentsQuery) {
    const where: Prisma.TreatmentPackageWhereInput = {
      hospital: {
        status: HospitalListingStatus.Published,
        ...(query.city ? { citySlug: query.city } : {}),
      },
      ...(query.specialty ? { specialtySlug: query.specialty } : {}),
      ...(query.search ? { name: { contains: query.search, mode: "insensitive" } } : {}),
    };

    const take = query.limit ?? 20;
    const packages = await this.prisma.treatmentPackage.findMany({
      where,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { name: "asc" },
      include: { hospital: { select: { name: true, slug: true, citySlug: true } } },
    });

    const hasMore = packages.length > take;
    const data = hasMore ? packages.slice(0, take) : packages;
    return { data, meta: { nextCursor: hasMore ? data[data.length - 1].id : null, hasMore } };
  }

  /** The hospital this staff member belongs to — Screen 20's "my hospital" context. */
  async getMine(staffUserId: string) {
    const staff = await this.prisma.hospitalStaff.findUnique({
      where: { userId: staffUserId },
      include: { hospital: true },
    });
    if (!staff) throw AppException.forbidden();
    return { ...staff.hospital, staffTitle: staff.title };
  }

  async getById(hospitalId: string) {
    const hospital = await this.prisma.hospital.findUnique({ where: { id: hospitalId } });
    if (!hospital || hospital.status !== HospitalListingStatus.Published) {
      throw AppException.notFound("HOSPITAL_NOT_FOUND", "Hospital not found.");
    }
    return hospital;
  }

  async submitChange(hospitalId: string, staffUserId: string, dto: SubmitHospitalChangeDto) {
    await this.requireOwnHospital(hospitalId, staffUserId);
    const changeSummary = Object.entries(dto)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join("; ");

    const item = await this.prisma.hospitalModerationItem.create({
      data: { hospitalId, changeSummary: changeSummary || "No fields changed" },
    });
    return item;
  }

  async listDoctors(hospitalId: string) {
    return this.prisma.doctor.findMany({ where: { hospitalId }, orderBy: { name: "asc" } });
  }

  async addDoctor(hospitalId: string, staffUserId: string, dto: CreateDoctorDto) {
    await this.requireOwnHospital(hospitalId, staffUserId);
    return this.prisma.doctor.create({ data: { ...dto, hospitalId } });
  }

  async getDoctor(hospitalId: string, doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor || doctor.hospitalId !== hospitalId) {
      throw AppException.notFound("DOCTOR_NOT_FOUND", "Doctor not found.");
    }
    return doctor;
  }

  async listPackages(hospitalId: string) {
    return this.prisma.treatmentPackage.findMany({ where: { hospitalId }, orderBy: { name: "asc" } });
  }

  async addPackage(hospitalId: string, staffUserId: string, dto: CreateTreatmentPackageDto) {
    await this.requireOwnHospital(hospitalId, staffUserId);
    return this.prisma.treatmentPackage.create({ data: { ...dto, hospitalId } });
  }

  async getReports(hospitalId: string, requestingUserId: string, requestingUserRole: UserRole) {
    // Admins may view any hospital's report (FR-ANALYTICS-01); hospital_staff are
    // restricted to their own hospital per BR-03.
    if (requestingUserRole !== UserRole.admin) {
      await this.requireOwnHospital(hospitalId, requestingUserId);
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [bookingsThisMonth, activeCases, paidInvoices, statusCounts] = await Promise.all([
      this.prisma.application.count({ where: { hospitalId, submittedAt: { gte: startOfMonth } } }),
      this.prisma.application.count({ where: { hospitalId, status: { notIn: ["Completed", "Declined"] } } }),
      this.prisma.invoice.aggregate({
        where: { status: "Paid", application: { hospitalId }, updatedAt: { gte: startOfMonth } },
        _sum: { amountUsd: true },
      }),
      this.prisma.application.groupBy({ by: ["status"], where: { hospitalId }, _count: true }),
    ]);

    const totalCases = statusCounts.reduce((sum, s) => sum + s._count, 0);
    const completed = statusCounts.find((s) => s.status === "Completed")?._count ?? 0;

    return {
      bookingsThisMonth,
      revenueThisMonthUsd: Number(paidInvoices._sum.amountUsd ?? 0),
      activeCases,
      slaComplianceRate: totalCases === 0 ? 1 : Number((completed / totalCases).toFixed(2)),
      conversionFunnel: statusCounts.map((s) => ({ stage: s.status, count: s._count })),
    };
  }

  private async requireOwnHospital(hospitalId: string, staffUserId: string) {
    const staff = await this.prisma.hospitalStaff.findUnique({ where: { userId: staffUserId } });
    if (!staff || staff.hospitalId !== hospitalId) {
      throw AppException.forbidden("You do not have access to this hospital.");
    }
    return staff;
  }
}
