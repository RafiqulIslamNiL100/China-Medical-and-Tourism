import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(10)
  password!: string;

  @IsString()
  fullName!: string;

  @IsBoolean()
  termsAccepted!: boolean;

  @IsBoolean()
  marketingConsent!: boolean;
}
