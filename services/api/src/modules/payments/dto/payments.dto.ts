import { Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { PartnerType } from "@prisma/client";

export class PayInvoiceDto {
  @IsUUID()
  invoiceId!: string;

  @IsString()
  paymentMethodToken!: string;
}

export class RefundDto {
  @IsNumber()
  @Min(0.01)
  amountUsd!: number;

  @IsString()
  reason!: string;
}

export class SetCommissionRateDto {
  @IsIn([PartnerType.Hospital, PartnerType.Hotel, PartnerType.Transport])
  partnerType!: PartnerType;

  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @IsOptional()
  @IsUUID()
  hotelId?: string;

  @IsNumber()
  @Min(0)
  rate!: number;
}

export class ListPaymentsQuery {
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
