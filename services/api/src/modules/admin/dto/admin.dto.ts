import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsEmail, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { UserRole, UserStatus } from "@prisma/client";

export class ListUsersQuery {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class ResolveModerationItemDto {
  @IsBoolean()
  approved!: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class UpdateSettingDto {
  @IsString()
  key!: string;

  @IsDefined()
  value: unknown;
}

export class CreateCityDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  climate?: string;
}

export class ListAuditLogQuery {
  @IsOptional()
  @IsString()
  targetType?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
