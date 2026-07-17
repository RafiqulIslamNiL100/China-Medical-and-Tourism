"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { getMyHotels, listHotelBookings, confirmHotelBooking, rejectHotelBooking, type HotelBooking } from "@/lib/api";

const statusTone = { Pending: "warning", Confirmed: "success", Rejected: "danger", Cancelled: "neutral" } as const;

export default function HotelBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getMyHotels(accessToken)
      .then(async (hotels) => {
        const hotel = hotels[0];
        if (!hotel) return;
        setBookings(await listHotelBookings(accessToken, hotel.id));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleConfirm(booking: HotelBooking) {
    if (!accessToken) return;
    setActingId(booking.id);
    const updated = await confirmHotelBooking(accessToken, booking.id);
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
    setActingId(null);
  }

  async function handleReject(booking: HotelBooking) {
    if (!accessToken) return;
    setActingId(booking.id);
    const updated = await rejectHotelBooking(accessToken, booking.id);
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
    setActingId(null);
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>

      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-neutral-900">{b.guestName}</p>
                <p className="text-sm text-neutral-500">
                  {b.roomType?.name ?? "Room"} &middot; {fmtDate(b.checkIn)} &rarr; {fmtDate(b.checkOut)}
                </p>
              </div>
              <Badge tone={statusTone[b.status]}>{b.status}</Badge>
            </div>
            {b.status === "Pending" ? (
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => handleConfirm(b)} disabled={actingId === b.id}>
                  Confirm
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleReject(b)} disabled={actingId === b.id}>
                  Reject
                </Button>
              </div>
            ) : null}
          </div>
        ))}
        {bookings.length === 0 ? <p className="text-sm text-neutral-500">No bookings yet.</p> : null}
      </div>
    </div>
  );
}
