"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/lib/auth-client";
import { fmtDate } from "@/lib/portal";
import { getMyHotels, listHotelBookings, type HotelBooking } from "@/lib/api";

const statusTone = { Pending: "warning", Confirmed: "success", Rejected: "danger", Cancelled: "neutral" } as const;

export default function HotelDashboardPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  const upcoming = bookings.filter((b) => b.status === "Confirmed").slice(0, 5);
  const pending = bookings.filter((b) => b.status === "Pending");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>

      {pending.length > 0 ? (
        <div className="rounded-[10px] border border-warning-600/30 bg-warning-100 p-4">
          <p className="text-sm font-bold text-neutral-900">
            {pending.length} booking request{pending.length === 1 ? "" : "s"} awaiting your confirmation
          </p>
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 font-bold text-neutral-900">Upcoming check-ins</h2>
        <div className="flex flex-col gap-3">
          {upcoming.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
              <div>
                <p className="font-semibold text-neutral-900">{b.guestName}</p>
                <p className="text-sm text-neutral-500">
                  {b.roomType?.name ?? "Room"} &middot; {fmtDate(b.checkIn)} &rarr; {fmtDate(b.checkOut)}
                </p>
              </div>
              <Badge tone={statusTone[b.status]}>{b.status}</Badge>
            </div>
          ))}
          {upcoming.length === 0 ? <p className="text-sm text-neutral-500">No upcoming check-ins.</p> : null}
        </div>
      </section>
    </div>
  );
}
