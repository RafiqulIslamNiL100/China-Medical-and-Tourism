import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { hotelBookings } from "@/data/partner";

export const metadata: Metadata = { title: "Bookings" };

const statusTone = { Pending: "warning", Confirmed: "success", Rejected: "danger" } as const;

export default function HotelBookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Bookings</h1>

      <div className="flex flex-col gap-3">
        {hotelBookings.map((b) => (
          <div key={b.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-neutral-900">{b.guestName}</p>
                <p className="text-sm text-neutral-500">
                  {b.roomType} &middot; {b.checkIn} &rarr; {b.checkOut}
                </p>
              </div>
              <Badge tone={statusTone[b.status]}>{b.status}</Badge>
            </div>
            {b.status === "Pending" ? (
              <div className="mt-3 flex gap-2">
                <Button size="sm">Confirm</Button>
                <Button size="sm" variant="secondary">
                  Reject
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
