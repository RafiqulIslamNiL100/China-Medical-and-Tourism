import { Controller, Get } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { HospitalsService } from "./hospitals.service";

/** Separate from HospitalsController (@Controller("hospitals")) since this is a
 * top-level taxonomy list, not scoped to one hospital — used by the public
 * hospital/specialty directory pages to render real city names and filters. */
@Controller("cities")
export class CitiesController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Public()
  @Get()
  list() {
    return this.hospitalsService.listCities();
  }
}
