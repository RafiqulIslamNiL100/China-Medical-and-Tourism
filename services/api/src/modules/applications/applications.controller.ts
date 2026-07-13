import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { ApplicationsService } from "./applications.service";
import {
  AddInternalNoteDto,
  ApplicationDecisionDto,
  CreateApplicationDto,
  ListApplicationsQuery,
  ReassignDto,
  SendMessageDto,
} from "./dto/applications.dto";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListApplicationsQuery) {
    return this.applicationsService.list(user, query);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user.userId, dto);
  }

  // Directory endpoint for the ops console's reassign picker (Screen 46). Must be
  // registered before :applicationId below, or "case-managers" would be captured
  // as an applicationId.
  @Get("case-managers")
  listCaseManagers(@CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.listCaseManagers(user);
  }

  @Get(":applicationId")
  getById(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.applicationsService.getById(user, applicationId);
  }

  @Post(":applicationId/decision")
  decide(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: ApplicationDecisionDto,
  ) {
    return this.applicationsService.decide(user, applicationId, dto);
  }

  @Post(":applicationId/reassign")
  reassign(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: ReassignDto,
  ) {
    return this.applicationsService.reassign(user, applicationId, dto);
  }

  @Get(":applicationId/messages")
  listMessages(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.applicationsService.listMessages(user, applicationId);
  }

  @Post(":applicationId/messages")
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.applicationsService.sendMessage(user, applicationId, dto);
  }

  @Get(":applicationId/internal-notes")
  listInternalNotes(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.applicationsService.listInternalNotes(user, applicationId);
  }

  @Post(":applicationId/internal-notes")
  addInternalNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: AddInternalNoteDto,
  ) {
    return this.applicationsService.addInternalNote(user, applicationId, dto);
  }
}
