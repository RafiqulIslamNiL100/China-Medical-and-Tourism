import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateDependentDto {
  @IsString()
  fullName!: string;

  @IsString()
  relationship!: string;

  @IsDateString()
  dateOfBirth!: string;
}

export class UpdateDependentDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
