import { Module } from "@nestjs/common";
import { HospitalsController } from "./hospitals.controller";
import { SpecialtiesController } from "./specialties.controller";
import { HospitalsService } from "./hospitals.service";

@Module({
  controllers: [HospitalsController, SpecialtiesController],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
