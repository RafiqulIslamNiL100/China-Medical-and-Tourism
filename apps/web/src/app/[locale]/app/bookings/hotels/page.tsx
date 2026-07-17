"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Stars } from "@/components/Stars";
import { cities } from "@/data/hospitals";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import {
  searchHotels,
  requestHotelBooking,
  listMyHotelBookings,
  listApplications,
  ApiError,
  type Hotel,
  type HotelBooking,
  type Application,
} from "@/lib/api";

export default function HotelBookingsPage() {
  const { accessToken } = useAuth();
  const [city, setCity] = useState<string>(cities[0]?.slug ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookingHotelId, setBookingHotelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadHotels() {
    const res = await searchHotels({ city: city || undefined });
    setHotels(res);
  }

  async function loadBookings() {
    if (!accessToken) return;
    const [bks, apps] = await Promise.all([listMyHotelBookings(accessToken), listApplications(accessToken)]);
    setBookings(bks);
    setApplications(apps.data);
  }

  useEffect(() => {
    loadHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleBook(hotel: Hotel) {
    if (!accessToken) return;
    setError(null);
    if (!checkIn || !checkOut) {
      setError("Choose check-in and check-out dates first.");
      return;
    }
    const roomTypeId = hotel.roomTypes?.[0]?.id;
    if (!roomTypeId) {
      setError("This hotel has no room types available yet.");
      return;
    }
    setBookingHotelId(hotel.id);
    try {
      const activeApplication = applications.find((a) => a.status !== "Completed" && a.status !== "Declined");
      await requestHotelBooking(accessToken, hotel.id, {
        applicationId: activeApplication?.id,
        roomTypeId,
        checkIn,
        checkOut,
      });
      await loadBookings();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not book this hotel.");
    } finally {
      setBookingHotelId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Hotel Bookings</h1>
      <p className="text-sm text-neutral-500">Book a hotel near your hospital for your treatment stay.</p>
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <Button size="sm" onClick={loadHotels}>
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {hotels.map((h) => (
          <div key={h.id} className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-neutral-900">{h.name}</p>
            <p className="text-sm text-neutral-500">{h.address ?? h.citySlug}</p>
            <div className="flex items-center justify-between">
              <Stars rating={Number(h.rating)} />
              {h.roomTypes?.[0] ? (
                <span className="font-semibold text-primary-700">${h.roomTypes[0].baseRateUsd}/night</span>
              ) : null}
            </div>
            <Button size="sm" className="mt-2" onClick={() => handleBook(h)} disabled={bookingHotelId === h.id}>
              {bookingHotelId === h.id ? "Booking…" : "Book"}
            </Button>
          </div>
        ))}
        {hotels.length === 0 ? (
          <p className="text-sm text-neutral-500 sm:col-span-2">No hotels found for this city.</p>
        ) : null}
      </div>

      <div>
        <h2 className="mb-3 font-bold text-neutral-900">My bookings</h2>
        <div className="flex flex-col gap-2">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  {b.hotel?.name ?? "Hotel"} — {b.roomType?.name ?? "Room"}
                </p>
                <p className="text-xs text-neutral-500">
                  {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                </p>
              </div>
              <span className="text-xs font-semibold text-neutral-500">{b.status}</span>
            </div>
          ))}
          {bookings.length === 0 ? <p className="text-sm text-neutral-500">No bookings yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
