import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { HospitalsService } from "./hospitals.service";
import { SearchTreatmentsQuery } from "./dto/hospitals.dto";

/** Cross-hospital treatment search, separate from HospitalsController (@Controller("hospitals"))
 * since this searches TreatmentPackage across every hospital rather than scoping to one. */
@Controller("treatments")
export class TreatmentsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Public()
  @Get()
  search(@Query() query: SearchTreatmentsQuery) {
    return this.hospitalsService.searchTreatments(query);
  }
}
