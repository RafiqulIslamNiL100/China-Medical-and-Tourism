import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { CaseStatus } from "@prisma/client";

export class ListApplicationsQuery {
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @IsOptional()
  @IsIn(["mine", "urgent", "unassigned"])
  view?: "mine" | "urgent" | "unassigned";

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

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsString()
  dependentId?: string;

  @IsString()
  specialtySlug!: string;

  @IsOptional()
  @IsDateString()
  preferredStartDate?: string;

  @IsOptional()
  @IsBoolean()
  datesFlexible?: boolean;

  @IsOptional()
  @IsString()
  conditionSummary?: string;

  @IsOptional()
  @IsString()
  medications?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsBoolean()
  consentToProcessMedicalData!: boolean;
}

export type DecisionType = "Accept" | "RequestInfo" | "Decline";

export class ApplicationDecisionDto {
  @IsIn(["Accept", "RequestInfo", "Decline"])
  decision!: DecisionType;

  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @IsOptional()
  @Type(() => Number)
  costEstimateMinUsd?: number;

  @IsOptional()
  @Type(() => Number)
  costEstimateMaxUsd?: number;

  @IsOptional()
  @IsString()
  message?: string;
}

export class ReassignDto {
  @IsString()
  caseManagerUserId!: string;
}

export class SendMessageDto {
  @IsString()
  body!: string;
}

export class AddInternalNoteDto {
  @IsString()
  note!: string;
}
