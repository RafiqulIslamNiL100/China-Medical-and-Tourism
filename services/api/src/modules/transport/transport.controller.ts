import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { TransportService } from "./transport.service";
import {
  AssignDriverDto,
  AssignInterpreterDto,
  CreateInterpreterSessionDto,
  CreateTransferDto,
} from "./dto/transport.dto";

@Controller()
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get("applications/:applicationId/transfers")
  listTransfers(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.transportService.listTransfers(user, applicationId);
  }

  @Post("applications/:applicationId/transfers")
  requestTransfer(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: CreateTransferDto,
  ) {
    return this.transportService.requestTransfer(user, applicationId, dto);
  }

  @Post("transfers/:transferId/assign")
  assignDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Param("transferId") transferId: string,
    @Body() dto: AssignDriverDto,
  ) {
    return this.transportService.assignDriver(user, transferId, dto);
  }

  @Post("transfers/:transferId/complete")
  completeTransfer(@CurrentUser() user: AuthenticatedUser, @Param("transferId") transferId: string) {
    return this.transportService.completeTransfer(user, transferId);
  }

  // Directory endpoints for the ops assignment board (Screen 46).
  @Get("drivers")
  listDrivers(@CurrentUser() user: AuthenticatedUser) {
    return this.transportService.listDrivers(user);
  }

  @Get("interpreters")
  listInterpreters(@CurrentUser() user: AuthenticatedUser) {
    return this.transportService.listInterpreters(user);
  }

  @Get("drivers/me/trips")
  listMyTrips(@CurrentUser() user: AuthenticatedUser, @Query("status") status?: "Assigned" | "Completed") {
    return this.transportService.listMyTrips(user, status);
  }

  @Get("applications/:applicationId/interpreter-sessions")
  listInterpreterSessions(@CurrentUser() user: AuthenticatedUser, @Param("applicationId") applicationId: string) {
    return this.transportService.listInterpreterSessions(user, applicationId);
  }

  @Post("applications/:applicationId/interpreter-sessions")
  requestInterpreterSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: CreateInterpreterSessionDto,
  ) {
    return this.transportService.requestInterpreterSession(user, applicationId, dto);
  }

  @Post("interpreter-sessions/:sessionId/assign")
  assignInterpreter(
    @CurrentUser() user: AuthenticatedUser,
    @Param("sessionId") sessionId: string,
    @Body() dto: AssignInterpreterDto,
  ) {
    return this.transportService.assignInterpreter(user, sessionId, dto);
  }

  @Post("interpreter-sessions/:sessionId/complete")
  completeInterpreterSession(@CurrentUser() user: AuthenticatedUser, @Param("sessionId") sessionId: string) {
    return this.transportService.completeInterpreterSession(user, sessionId);
  }

  @Get("interpreters/me/appointments")
  listMyAppointments(@CurrentUser() user: AuthenticatedUser) {
    return this.transportService.listMyAppointments(user);
  }

  @Get("assignment-board")
  listAssignmentBoard(@CurrentUser() user: AuthenticatedUser) {
    return this.transportService.listAssignmentBoard(user);
  }
}
