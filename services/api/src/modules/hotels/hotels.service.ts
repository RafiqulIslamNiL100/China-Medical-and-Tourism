import { Injectable } from "@nestjs/common";
import { HotelBookingStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { NotificationService } from "../../common/notifications/notification.service";
import { AppException } from "../../common/filters/app-exception";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateHotelBookingDto, CreateRoomTypeDto, SearchHotelsQuery } from "./dto/hotels.dto";

@Injectable()
export class HotelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  async search(query: SearchHotelsQuery) {
    if (query.nearHospitalId) {
      const hospital = await this.prisma.hospital.findUnique({ where: { id: query.nearHospitalId } });
      if (hospital) return this.prisma.hotel.findMany({ where: { citySlug: hospital.citySlug } });
    }
    return this.prisma.hotel.findMany({ where: query.city ? { citySlug: query.city } : undefined });
  }

  async listRoomTypes(hotelId: string) {
    return this.prisma.hotelRoomType.findMany({ where: { hotelId } });
  }

  async addRoomType(hotelId: string, partnerUserId: string, dto: CreateRoomTypeDto) {
    await this.requireOwnHotel(hotelId, partnerUserId);
    return this.prisma.hotelRoomType.create({ data: { ...dto, hotelId } });
  }

  async listBookings(hotelId: string, partnerUserId: string) {
    await this.requireOwnHotel(hotelId, partnerUserId);
    return this.prisma.hotelBooking.findMany({ where: { hotelId }, orderBy: { checkIn: "asc" } });
  }

  async requestBooking(hotelId: string, userId: string, dto: CreateHotelBookingDto) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw AppException.notFound("PATIENT_PROFILE_NOT_FOUND", "Patient profile not found.");

    const roomType = await this.prisma.hotelRoomType.findUnique({ where: { id: dto.roomTypeId } });
    if (!roomType || roomType.hotelId !== hotelId) {
      throw AppException.validation("Room type does not belong to this hotel.");
    }

    if (dto.applicationId) {
      const application = await this.prisma.application.findUnique({ where: { id: dto.applicationId } });
      if (!application || application.patientId !== patient.id) {
        throw AppException.validation("Application does not belong to this account.");
      }
    }

    const booking = await this.prisma.hotelBooking.create({
      data: {
        hotelId,
        roomTypeId: dto.roomTypeId,
        applicationId: dto.applicationId,
        guestName: patient.fullName,
        checkIn: new Date(dto.checkIn),
        checkOut: new Date(dto.checkOut),
        status: HotelBookingStatus.Pending,
      },
    });

    const partners = await this.prisma.hotelPartner.findMany({ where: { hotels: { some: { id: hotelId } } } });
    await Promise.all(
      partners.map((p) =>
        this.notifications.notify({
          userId: p.userId,
          title: "New booking request",
          body: `${patient.fullName} requested a booking for ${dto.checkIn} to ${dto.checkOut}.`,
          category: "hotel_booking_requested",
          linkUrl: `/partner/hotel/bookings`,
        }),
      ),
    );

    return booking;
  }

  async confirmBooking(bookingId: string, partnerUserId: string) {
    const booking = await this.requireOwnBooking(bookingId, partnerUserId);
    const updated = await this.prisma.hotelBooking.update({
      where: { id: booking.id },
      data: { status: HotelBookingStatus.Confirmed },
    });
    await this.notifyGuest(booking.id, "Hotel booking confirmed", "Your hotel booking has been confirmed.");
    return updated;
  }

  async rejectBooking(bookingId: string, partnerUserId: string) {
    const booking = await this.requireOwnBooking(bookingId, partnerUserId);
    const updated = await this.prisma.hotelBooking.update({
      where: { id: booking.id },
      data: { status: HotelBookingStatus.Rejected },
    });
    await this.notifyGuest(
      booking.id,
      "Hotel booking unavailable",
      "Unfortunately your requested hotel booking could not be confirmed — please choose an alternative.",
    );
    return updated;
  }

  private async notifyGuest(bookingId: string, title: string, body: string) {
    const booking = await this.prisma.hotelBooking.findUnique({ where: { id: bookingId } });
    if (!booking?.applicationId) return;
    const application = await this.prisma.application.findUnique({ where: { id: booking.applicationId } });
    if (!application) return;
    const patient = await this.prisma.patient.findUnique({ where: { id: application.patientId } });
    if (!patient) return;
    await this.notifications.notify({ userId: patient.userId, title, body, category: "hotel_booking_status" });
  }

  private async requireOwnHotel(hotelId: string, partnerUserId: string) {
    const partner = await this.prisma.hotelPartner.findUnique({ where: { userId: partnerUserId } });
    if (!partner) throw AppException.forbidden();
    const hotel = await this.prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel || hotel.hotelPartnerId !== partner.id) throw AppException.forbidden();
    return hotel;
  }

  private async requireOwnBooking(bookingId: string, partnerUserId: string) {
    const booking = await this.prisma.hotelBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw AppException.notFound("BOOKING_NOT_FOUND", "Booking not found.");
    await this.requireOwnHotel(booking.hotelId, partnerUserId);
    return booking;
  }
}
