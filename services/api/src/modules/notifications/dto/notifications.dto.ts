import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListNotificationsQuery {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean;

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

export class NotificationPreferenceDto {
  @IsString()
  category!: string;

  @IsBoolean()
  emailEnabled!: boolean;

  @IsBoolean()
  smsEnabled!: boolean;

  @IsBoolean()
  inAppEnabled!: boolean;
}
