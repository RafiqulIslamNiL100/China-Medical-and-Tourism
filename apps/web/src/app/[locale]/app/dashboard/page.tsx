"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";
import { StatusChip } from "@/components/portal/StatusChip";
import type { CaseStatus } from "@/data/patient";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, fmtDate } from "@/lib/portal";
import {
  listApplications,
  getMyPatientProfile,
  listMyHotelBookings,
  searchHospitals,
  type Application,
  type HotelBooking,
} from "@/lib/api";

export default function PatientDashboardPage() {
  const { accessToken } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      getMyPatientProfile(accessToken),
      listApplications(accessToken),
      listMyHotelBookings(accessToken),
      searchHospitals(),
    ])
      .then(([profile, apps, hotelBookings, hospitals]) => {
        setFirstName(profile.fullName.split(" ")[0]);
        setApplications(apps.data);
        setBookings(hotelBookings);
        setHospitalNames(Object.fromEntries(hospitals.data.map((h) => [h.id, h.name])));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  const activeCases = applications.filter((c) => c.status !== "Completed" && c.status !== "Declined");
  const caseNeedingAction = applications.find((c) => c.status === "Accepted" || c.status === "InfoRequested");
  const upcomingBookings = bookings.filter((b) => new Date(b.checkIn) >= new Date()).slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back{firstName ? `, ${firstName}` : ""}</h1>
        <p className="text-neutral-500">Here&apos;s what&apos;s happening across your cases.</p>
      </div>

      {caseNeedingAction ? (
        <div className="flex items-center justify-between gap-4 rounded-[10px] border border-warning-600/30 bg-warning-100 p-4">
          <div>
            <p className="text-sm font-bold text-neutral-900">Action needed</p>
            <p className="text-sm text-neutral-700">
              {caseNeedingAction.status === "InfoRequested"
                ? `The hospital requested more information on ${caseNeedingAction.refNumber}.`
                : `Your case ${caseNeedingAction.refNumber} was accepted — review documents and payments.`}
            </p>
          </div>
          <Button href={`/app/cases/${caseNeedingAction.id}`} size="sm" variant="accent">
            Resolve
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-neutral-900">Active applications</h2>
            <Link href="/app/cases" className="text-sm font-semibold text-primary-700">
              View all &rarr;
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {activeCases.map((c) => (
              <Link
                key={c.id}
                href={`/app/cases/${c.id}`}
                className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">{hospitalNames[c.hospitalId] ?? "Hospital"}</span>
                  <StatusChip status={statusLabel(c.status) as CaseStatus} />
                </div>
                <p className="text-sm text-neutral-500">
                  {c.specialtySlug} &middot; {c.refNumber} &middot; Submitted {fmtDate(c.submittedAt)}
                </p>
              </Link>
            ))}
            {activeCases.length === 0 ? (
              <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center">
                <p className="font-semibold text-neutral-900">No active applications</p>
                <Button href="/app/apply" className="mt-3">
                  Start your first application
                </Button>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-bold text-neutral-900">Upcoming hotel stays</h2>
          <div className="flex flex-col gap-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <div key={b.id} className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-primary-700">{b.status}</p>
                  <p className="text-sm font-bold text-neutral-900">
                    {b.hotel?.name ?? "Hotel"} — {b.roomType?.name ?? "Room"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">Nothing scheduled yet.</p>
            )}
          </div>

          <h2 className="mt-6 mb-3 font-bold text-neutral-900">Quick links</h2>
          <div className="flex flex-col gap-2">
            <Button href="/app/apply" variant="secondary" className="justify-start">
              New Application
            </Button>
            <Button href="/app/dependents" variant="secondary" className="justify-start">
              Manage Dependents
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
