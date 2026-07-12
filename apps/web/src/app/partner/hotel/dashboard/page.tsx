import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { hotelBookings } from "@/data/partner";

export const metadata: Metadata = { title: "Hotel Dashboard" };

const statusTone = { Pending: "warning", Confirmed: "success", Rejected: "danger" } as const;

export default function HotelDashboardPage() {
  const upcoming = hotelBookings.filter((b) => b.status === "Confirmed").slice(0, 5);
  const pending = hotelBookings.filter((b) => b.status === "Pending");

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
                  {b.roomType} &middot; {b.checkIn} &rarr; {b.checkOut}
                </p>
              </div>
              <Badge tone={statusTone[b.status]}>{b.status}</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
