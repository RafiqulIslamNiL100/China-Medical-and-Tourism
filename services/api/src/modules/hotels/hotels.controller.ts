import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { HotelsService } from "./hotels.service";
import { CreateHotelBookingDto, CreateRoomTypeDto, SearchHotelsQuery } from "./dto/hotels.dto";

@Controller()
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Public()
  @Get("hotels")
  search(@Query() query: SearchHotelsQuery) {
    return this.hotelsService.search(query);
  }

  @Get("hotels/mine")
  @Roles(UserRole.hotel_partner)
  getMyHotels(@CurrentUser() user: AuthenticatedUser) {
    return this.hotelsService.getMyHotels(user.userId);
  }

  @Get("hotel-bookings/me")
  @Roles(UserRole.patient)
  listMyBookings(@CurrentUser() user: AuthenticatedUser) {
    return this.hotelsService.listMyBookings(user.userId);
  }

  @Public()
  @Get("hotels/:hotelId/room-types")
  listRoomTypes(@Param("hotelId") hotelId: string) {
    return this.hotelsService.listRoomTypes(hotelId);
  }

  @Post("hotels/:hotelId/room-types")
  @Roles(UserRole.hotel_partner)
  addRoomType(
    @Param("hotelId") hotelId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRoomTypeDto,
  ) {
    return this.hotelsService.addRoomType(hotelId, user.userId, dto);
  }

  @Get("hotels/:hotelId/bookings")
  @Roles(UserRole.hotel_partner)
  listBookings(@Param("hotelId") hotelId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.hotelsService.listBookings(hotelId, user.userId);
  }

  @Post("hotels/:hotelId/bookings")
  @Roles(UserRole.patient)
  requestBooking(
    @Param("hotelId") hotelId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateHotelBookingDto,
  ) {
    return this.hotelsService.requestBooking(hotelId, user.userId, dto);
  }

  @Post("hotel-bookings/:bookingId/confirm")
  @Roles(UserRole.hotel_partner)
  confirm(@Param("bookingId") bookingId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.hotelsService.confirmBooking(bookingId, user.userId);
  }

  @Post("hotel-bookings/:bookingId/reject")
  @Roles(UserRole.hotel_partner)
  reject(@Param("bookingId") bookingId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.hotelsService.rejectBooking(bookingId, user.userId);
  }
}
