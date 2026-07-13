import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { TransferDirection } from "@prisma/client";

export class CreateTransferDto {
  @IsEnum(TransferDirection)
  direction!: TransferDirection;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsString()
  pickupLocation!: string;
}

export class AssignDriverDto {
  @IsString()
  driverId!: string;
}

export class CreateInterpreterSessionDto {
  @IsDateString()
  hospitalVisitAt!: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AssignInterpreterDto {
  @IsString()
  interpreterId!: string;
}
