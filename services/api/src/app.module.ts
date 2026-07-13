import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./common/prisma/prisma.module";
import { CommonModule } from "./common/common.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PatientsModule } from "./modules/patients/patients.module";
import { HospitalsModule } from "./modules/hospitals/hospitals.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { HotelsModule } from "./modules/hotels/hotels.module";
import { TransportModule } from "./modules/transport/transport.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { CmsModule } from "./modules/cms/cms.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    AuthModule,
    PatientsModule,
    HospitalsModule,
    ApplicationsModule,
    DocumentsModule,
    HotelsModule,
    TransportModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    CmsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
