import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class SearchHotelsQuery {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  nearHospitalId?: string;
}

export class CreateRoomTypeDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(0)
  roomCount!: number;

  @IsNumber()
  baseRateUsd!: number;
}

export class CreateHotelBookingDto {
  @IsOptional()
  @IsString()
  applicationId?: string;

  @IsString()
  roomTypeId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;
}
