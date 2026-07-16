import { Module } from "@nestjs/common";
import { HospitalsController } from "./hospitals.controller";
import { TreatmentsController } from "./treatments.controller";
import { HospitalsService } from "./hospitals.service";

@Module({
  controllers: [HospitalsController, TreatmentsController],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
