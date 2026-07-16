import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { authenticator } from "otplib";
import { createHash, randomBytes, randomInt } from "crypto";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AuditService } from "../../common/audit/audit.service";
import { AppException } from "../../common/filters/app-exception";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto, ResetPasswordDto } from "./dto/auth.dto";
import { UserRole, UserStatus, VerificationCodePurpose } from "@prisma/client";

const REFRESH_TOKEN_TTL_DAYS = 30;
const OTP_TTL_MINUTES = 10;
const RESET_TOKEN_TTL_MINUTES = 30;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.termsAccepted) {
      throw AppException.validation("You must accept the Terms of Service to register.");
    }

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] },
    });
    if (existing) {
      throw AppException.conflict("EMAIL_IN_USE", "An account with this email or phone already exists.");
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: UserRole.patient,
        patientProfile: { create: { fullName: dto.fullName } },
      },
    });

    await this.issueOtp(user.id, VerificationCodePurpose.EmailVerification);

    return { user: this.toPublicUser(user) };
  }

  async verify(userId: string, code: string) {
    const user = await this.requireUser(userId);
    await this.consumeCode(userId, code, VerificationCodePurpose.EmailVerification);

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });

    return this.issueTokens(user.id, user.role);
  }

  /** Re-sends the OTP for an account that hasn't completed email verification yet —
   * the recovery path when the original email was lost, delayed, or never arrived. */
  async resendVerification(userId: string) {
    const user = await this.requireUser(userId);
    if (user.emailVerifiedAt) {
      throw AppException.conflict("ALREADY_VERIFIED", "This account is already verified.");
    }
    await this.issueOtp(user.id, VerificationCodePurpose.EmailVerification);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }] },
    });
    if (!user || user.status !== UserStatus.Active) {
      throw AppException.unauthenticated("Invalid credentials.");
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw AppException.unauthenticated("Invalid credentials.");
    }

    // FR-AUTH-02: an account isn't usable until its email is verified. This is checked
    // here (not just at registration) because it's the actual security boundary — a
    // credential-holder with an unverified email must not receive tokens. `userId` is
    // included in `details` so the client can jump straight into the verify flow
    // (and call resend-verification) without another round trip.
    if (!user.emailVerifiedAt) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        "EMAIL_NOT_VERIFIED",
        "Please verify your email before logging in.",
        { userId: user.id },
      );
    }

    if (user.twoFactorEnabled) {
      const challengeId = this.jwt.sign(
        { sub: user.id, purpose: "2fa_challenge" },
        { secret: this.config.get<string>("JWT_ACCESS_SECRET"), expiresIn: "2m" },
      );
      return { twoFactorRequired: true, challengeId };
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user.id, user.role);
  }

  async verifyTwoFactor(challengeId: string, code: string) {
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwt.verify(challengeId, { secret: this.config.get<string>("JWT_ACCESS_SECRET") });
    } catch {
      throw AppException.unauthenticated("Two-factor challenge expired or invalid.");
    }
    if (payload.purpose !== "2fa_challenge") {
      throw AppException.unauthenticated("Invalid challenge.");
    }

    const user = await this.requireUser(payload.sub);
    if (!user.twoFactorSecret || !authenticator.check(code, user.twoFactorSecret)) {
      throw AppException.unauthenticated("Invalid authentication code.");
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; sid: string };
    try {
      payload = this.jwt.verify(refreshToken, { secret: this.config.get<string>("JWT_REFRESH_SECRET") });
    } catch {
      throw AppException.unauthenticated("Refresh token is invalid or expired.");
    }

    const session = await this.prisma.session.findUnique({ where: { id: payload.sid } });
    if (!session || session.revokedAt || session.refreshTokenHash !== hashToken(refreshToken)) {
      throw AppException.unauthenticated("Session has been revoked. Please log in again.");
    }

    await this.prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });

    const user = await this.requireUser(session.userId);
    return this.issueTokens(user.id, user.role);
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sid: string }>(refreshToken, {
        secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      });
      await this.prisma.session.updateMany({
        where: { id: payload.sid, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Already invalid/expired — logout is idempotent from the client's perspective.
    }
  }

  async forgotPassword(emailOrPhone: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });
    // Always behave identically whether or not the account exists, to avoid account
    // enumeration — matching the 202 contract in api/openapi.yaml.
    if (user) {
      const secret = randomBytes(24).toString("hex");
      const record = await this.prisma.verificationCode.create({
        data: {
          userId: user.id,
          codeHash: hashToken(secret),
          purpose: VerificationCodePurpose.PasswordReset,
          expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60_000),
        },
      });
      const resetToken = `${record.id}.${secret}`;
      const frontendUrl = this.config.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
      await this.notifications.notify({
        userId: user.id,
        title: "Reset your password",
        body: `Use this link within ${RESET_TOKEN_TTL_MINUTES} minutes to reset your password: ${resetUrl}`,
        category: "account_security",
        linkUrl: `/reset-password?token=${resetToken}`,
      });
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const [recordId, secret] = dto.resetToken.split(".");
    if (!recordId || !secret) {
      throw AppException.validation("Invalid reset token.");
    }

    const record = await this.prisma.verificationCode.findUnique({ where: { id: recordId } });
    if (
      !record ||
      record.purpose !== VerificationCodePurpose.PasswordReset ||
      record.consumedAt ||
      record.expiresAt < new Date() ||
      record.codeHash !== hashToken(secret)
    ) {
      throw AppException.validation("Reset token is invalid or has expired.");
    }

    const passwordHash = await argon2.hash(dto.newPassword);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      this.prisma.verificationCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } }),
      // Revoke every existing session — a password reset should force re-login everywhere.
      this.prisma.session.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    await this.audit.record({
      actorUserId: record.userId,
      actorLabel: "Self (password reset)",
      action: "password_reset",
      targetType: "User",
      targetId: record.userId,
    });
  }

  async me(userId: string) {
    const user = await this.requireUser(userId);
    return this.toPublicUser(user);
  }

  // --- internal helpers -----------------------------------------------------------

  private async issueOtp(userId: string, purpose: VerificationCodePurpose) {
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    await this.prisma.verificationCode.create({
      data: {
        userId,
        codeHash: hashToken(code),
        purpose,
        expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60_000),
      },
    });
    await this.notifications.notify({
      userId,
      title: "Verify your account",
      body: `Your verification code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes.`,
      category: "account_security",
    });
  }

  private async consumeCode(userId: string, code: string, purpose: VerificationCodePurpose) {
    const record = await this.prisma.verificationCode.findFirst({
      where: { userId, purpose, consumedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!record || record.expiresAt < new Date() || record.codeHash !== hashToken(code)) {
      throw AppException.validation("Verification code is invalid or has expired.");
    }
    await this.prisma.verificationCode.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
  }

  private async issueTokens(userId: string, role: UserRole) {
    const accessToken = this.jwt.sign(
      { sub: userId, role },
      { secret: this.config.get<string>("JWT_ACCESS_SECRET"), expiresIn: "15m" },
    );

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: "pending", // placeholder until we know the session id for the JWT payload
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60_000),
      },
    });
    const refreshToken = this.jwt.sign(
      { sub: userId, sid: session.id },
      { secret: this.config.get<string>("JWT_REFRESH_SECRET"), expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d` },
    );
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash: hashToken(refreshToken) },
    });

    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }

  private async requireUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppException.notFound("USER_NOT_FOUND", "User not found.");
    return user;
  }

  private toPublicUser(user: {
    id: string;
    email: string;
    phone: string | null;
    role: UserRole;
    status: UserStatus;
    twoFactorEnabled: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}
