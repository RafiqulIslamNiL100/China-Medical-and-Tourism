import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsUUID()
  applicationId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  text!: string;
}

export class ModerateReviewDto {
  @IsIn(["Approve", "Redact", "Reject"])
  decision!: "Approve" | "Redact" | "Reject";

  @IsOptional()
  @IsString()
  redactedText?: string;
}
