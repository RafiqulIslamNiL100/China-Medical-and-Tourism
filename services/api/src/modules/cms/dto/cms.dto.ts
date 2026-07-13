import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(["Draft", "Published"])
  status?: "Draft" | "Published";
}
