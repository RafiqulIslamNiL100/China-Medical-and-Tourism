import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { StorageService } from "./storage/storage.service";
import { EmailService } from "./email/email.service";
import { NotificationService } from "./notifications/notification.service";
import { AuditService } from "./audit/audit.service";
import { MockPaymentProcessor } from "./payments/mock-payment-processor.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { HttpExceptionFilter } from "./filters/http-exception.filter";

@Global()
@Module({
  imports: [
    // Global rate limit: 100 requests/minute per client IP. Auth endpoints carry much
    // stricter per-route @Throttle overrides — see auth.controller.ts (NFR-SEC-04).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
    }),
  ],
  providers: [
    StorageService,
    EmailService,
    NotificationService,
    AuditService,
    MockPaymentProcessor,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  exports: [JwtModule, StorageService, EmailService, NotificationService, AuditService, MockPaymentProcessor],
})
export class CommonModule {}
