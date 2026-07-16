import { Controller, Get } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { HospitalsService } from "./hospitals.service";

/** Separate from HospitalsController (@Controller("hospitals")) since this is a
 * top-level taxonomy list, not scoped to one hospital — used by the patient
 * application wizard's specialty picker and admin's hospital-specialty selector. */
@Controller("specialties")
export class SpecialtiesController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Public()
  @Get()
  list() {
    return this.hospitalsService.listSpecialties();
  }
}
