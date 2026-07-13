import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

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
