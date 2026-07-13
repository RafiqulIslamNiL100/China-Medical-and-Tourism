import { IsString, MinLength } from "class-validator";

export class VerifyDto {
  @IsString()
  userId!: string;

  @IsString()
  code!: string;
}

export class LoginDto {
  @IsString()
  emailOrPhone!: string;

  @IsString()
  password!: string;
}

export class TwoFactorVerifyDto {
  @IsString()
  challengeId!: string;

  @IsString()
  code!: string;
}

export class ForgotPasswordDto {
  @IsString()
  emailOrPhone!: string;
}

export class ResetPasswordDto {
  @IsString()
  resetToken!: string;

  @IsString()
  @MinLength(10)
  newPassword!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}
