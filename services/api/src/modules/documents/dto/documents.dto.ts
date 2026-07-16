import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { DocumentCategory } from "@prisma/client";

export class VerifyDocumentDto {
  @IsBoolean()
  approved!: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateApplicationDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DocumentCategory)
  category?: DocumentCategory;
}
