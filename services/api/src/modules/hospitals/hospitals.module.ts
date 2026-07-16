import { Module } from "@nestjs/common";
import { HospitalsController } from "./hospitals.controller";
import { SpecialtiesController } from "./specialties.controller";
import { CitiesController } from "./cities.controller";
import { HospitalsService } from "./hospitals.service";

@Module({
  controllers: [HospitalsController, SpecialtiesController, CitiesController],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
