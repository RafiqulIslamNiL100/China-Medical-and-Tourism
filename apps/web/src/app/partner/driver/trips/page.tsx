"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SimplePartnerHeader } from "@/components/portal/SimplePartnerHeader";
import { useAuth } from "@/lib/auth-client";
import { fmtDate, fmtDateTime } from "@/lib/portal";
import { listMyTrips, completeTransfer, type MyTrip } from "@/lib/api";

export default function DriverTripsPage() {
  const router = useRouter();
  const { accessToken, user, logout } = useAuth();
  const [trips, setTrips] = useState<MyTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  async function load() {
    if (!accessToken) return;
    setTrips(await listMyTrips(accessToken));
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handleComplete(tripId: string) {
    if (!accessToken) return;
    setCompletingId(tripId);
    await completeTransfer(accessToken, tripId);
    await load();
    setCompletingId(null);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const upcoming = trips.filter((t) => t.status === "Assigned");
  const completed = trips.filter((t) => t.status === "Completed");

  return (
    <div className="flex min-h-full flex-col bg-neutral-100">
      <SimplePartnerHeader title="My Trips" subtitle={user?.email ?? ""} onLogout={handleLogout} />
      <main className="mx-auto w-full max-w-lg flex-1 p-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading…</p>
        ) : (
          <>
            <section>
              <h2 className="mb-3 font-bold text-neutral-900">Upcoming</h2>
              <div className="flex flex-col gap-3">
                {upcoming.map((t) => (
                  <div key={t.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Badge tone={t.direction === "Arrival" ? "info" : "primary"}>{t.direction}</Badge>
                      <p className="text-sm font-bold text-neutral-900 tabular-nums">{fmtDateTime(t.scheduledAt)}</p>
                    </div>
                    <p className="mt-2 text-lg font-bold text-neutral-900">{t.patientName ?? "Patient"}</p>
                    {t.flightNumber ? <p className="text-sm text-neutral-600">Flight {t.flightNumber}</p> : null}
                    <p className="text-sm text-neutral-600">{t.pickupLocation}</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleComplete(t.id)}
                        disabled={completingId === t.id}
                      >
                        {completingId === t.id ? "Marking…" : "Mark Complete"}
                      </Button>
                      {t.patientPhone ? (
                        <a
                          href={`tel:${t.patientPhone}`}
                          className="inline-flex flex-1 items-center justify-center rounded-[10px] border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
                        >
                          Call Patient
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
                {upcoming.length === 0 ? <p className="text-sm text-neutral-500">No upcoming trips.</p> : null}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="mb-3 font-bold text-neutral-900">Trip history</h2>
              <div className="flex flex-col gap-3">
                {completed.map((t) => (
                  <div key={t.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 opacity-70 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Badge>{t.direction}</Badge>
                      <p className="text-sm text-neutral-500 tabular-nums">{fmtDate(t.scheduledAt)}</p>
                    </div>
                    <p className="mt-2 font-semibold text-neutral-900">{t.patientName ?? "Patient"}</p>
                    <p className="text-sm text-neutral-500">{t.pickupLocation}</p>
                  </div>
                ))}
                {completed.length === 0 ? <p className="text-sm text-neutral-500">No completed trips yet.</p> : null}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
