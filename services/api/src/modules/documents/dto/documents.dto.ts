import { IsBoolean, IsOptional, IsString } from "class-validator";

export class VerifyDocumentDto {
  @IsBoolean()
  approved!: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
