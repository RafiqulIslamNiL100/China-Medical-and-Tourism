import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { HospitalListingStatus } from "@prisma/client";

const HOSPITAL_STATUSES = Object.values(HospitalListingStatus);

export class SearchHospitalsQuery {
  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class SubmitHospitalChangeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];
}

export class CreateDoctorDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsString()
  specialtySlug!: string;

  @IsString()
  credentials!: string;

  @IsInt()
  @Min(0)
  yearsExperience!: number;

  @IsArray()
  @IsString({ each: true })
  languages!: string[];

  @IsString()
  bio!: string;
}

export class CreateTreatmentPackageDto {
  @IsString()
  name!: string;

  @IsString()
  specialtySlug!: string;

  @IsString()
  description!: string;

  @IsNumber()
  priceMinUsd!: number;

  @IsNumber()
  priceMaxUsd!: number;

  @IsArray()
  @IsString({ each: true })
  includes!: string[];
}

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  specialtySlug?: string;

  @IsOptional()
  @IsString()
  credentials?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  specialtySlug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  priceMinUsd?: number;

  @IsOptional()
  @IsNumber()
  priceMaxUsd?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includes?: string[];
}

/** Admin-only: creates a hospital directly (no moderation queue — admins are trusted). */
export class CreateHospitalDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsString()
  citySlug!: string;

  @IsString()
  description!: string;

  @IsString()
  priceTier!: string;

  @IsArray()
  @IsString({ each: true })
  accreditations!: string[];

  @IsArray()
  @IsString({ each: true })
  languages!: string[];

  @IsArray()
  @IsString({ each: true })
  facilities!: string[];

  @IsOptional()
  @IsIn(HOSPITAL_STATUSES)
  status?: HospitalListingStatus;
}

/** Admin-only: applies directly, bypassing the hospital_staff moderation-queue flow. */
export class AdminUpdateHospitalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  citySlug?: string;

  @IsOptional()
  @IsString()
  priceTier?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accreditations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @IsOptional()
  @IsIn(HOSPITAL_STATUSES)
  status?: HospitalListingStatus;
}
