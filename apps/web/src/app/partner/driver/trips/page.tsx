import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SimplePartnerHeader } from "@/components/portal/SimplePartnerHeader";
import { currentDriver, driverTrips } from "@/data/partner";

export const metadata: Metadata = { title: "My Trips" };

export default function DriverTripsPage() {
  const upcoming = driverTrips.filter((t) => t.status === "Upcoming");
  const completed = driverTrips.filter((t) => t.status === "Completed");

  return (
    <div className="flex min-h-full flex-col bg-neutral-100">
      <SimplePartnerHeader title="My Trips" subtitle={currentDriver.name} />
      <main className="mx-auto w-full max-w-lg flex-1 p-4">
        <section>
          <h2 className="mb-3 font-bold text-neutral-900">Upcoming</h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((t) => (
              <div key={t.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge tone={t.direction === "Arrival" ? "info" : "primary"}>{t.direction}</Badge>
                  <p className="text-sm font-bold text-neutral-900 tabular-nums">
                    {t.date} &middot; {t.time}
                  </p>
                </div>
                <p className="mt-2 text-lg font-bold text-neutral-900">{t.patientName}</p>
                <p className="text-sm text-neutral-600">Flight {t.flightNumber}</p>
                <p className="text-sm text-neutral-600">{t.pickupLocation}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1">
                    Mark Complete
                  </Button>
                  <a
                    href={`tel:+861012345678`}
                    className="inline-flex flex-1 items-center justify-center rounded-[10px] border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
                  >
                    Call Patient
                  </a>
                </div>
              </div>
            ))}
            {upcoming.length === 0 ? (
              <p className="text-sm text-neutral-500">No upcoming trips.</p>
            ) : null}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-bold text-neutral-900">Trip history</h2>
          <div className="flex flex-col gap-3">
            {completed.map((t) => (
              <div key={t.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 opacity-70 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge>{t.direction}</Badge>
                  <p className="text-sm text-neutral-500 tabular-nums">{t.date}</p>
                </div>
                <p className="mt-2 font-semibold text-neutral-900">{t.patientName}</p>
                <p className="text-sm text-neutral-500">{t.pickupLocation}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
