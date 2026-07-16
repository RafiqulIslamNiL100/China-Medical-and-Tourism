import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { RegisterDto } from "./dto/register.dto";
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshDto,
  ResendVerificationDto,
  ResetPasswordDto,
  TwoFactorVerifyDto,
  VerifyDto,
} from "./dto/auth.dto";

// Stricter rate limit than the global 100/min for everything under /auth —
// these endpoints are the brute-force surface (credentials, OTP codes, reset
// tokens), per NFR-SEC-04. 10 requests per minute per client IP.
@Throttle({ default: { ttl: 60_000, limit: 10 } })
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("verify")
  verify(@Body() dto: VerifyDto) {
    return this.authService.verify(dto.userId, dto.code);
  }

  @Public()
  @Post("resend-verification")
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.authService.resendVerification(dto.userId);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post("2fa/verify")
  @HttpCode(HttpStatus.OK)
  verifyTwoFactor(@Body() dto: TwoFactorVerifyDto) {
    return this.authService.verifyTwoFactor(dto.challengeId, dto.code);
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: RefreshDto) {
    await this.authService.logout(dto.refreshToken);
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.emailOrPhone);
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}

/** Separate controller so the route is `/v1/me`, matching api/openapi.yaml exactly. */
@Controller()
export class MeController {
  constructor(private readonly authService: AuthService) {}

  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.userId);
  }
}
