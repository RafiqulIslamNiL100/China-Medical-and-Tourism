"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { StatusChip } from "@/components/portal/StatusChip";
import type { CaseStatus } from "@/data/patient";
import { listApplications, searchHospitals, type Application } from "@/lib/api";
import { useAuth } from "@/lib/auth-client";

function formatStatus(status: Application["status"]): CaseStatus {
  const map: Record<Application["status"], CaseStatus> = {
    Submitted: "Submitted",
    UnderReview: "Under Review",
    InfoRequested: "Info Requested",
    Accepted: "Accepted",
    Declined: "Declined",
    Completed: "Completed",
  };
  return map[status];
}

export default function CasesListPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
      <CasesListContent />
    </Suspense>
  );
}

function CasesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") ?? "active";
  const { accessToken, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      router.push("/login");
      return;
    }
    Promise.all([listApplications(accessToken), searchHospitals()])
      .then(([apps, hospitals]) => {
        setApplications(apps.data);
        setHospitalNames(Object.fromEntries(hospitals.data.map((h) => [h.id, h.name])));
      })
      .finally(() => setLoading(false));
  }, [accessToken, authLoading, router]);

  const filtered = applications.filter((c) => {
    if (filter === "completed") return c.status === "Completed";
    if (filter === "declined") return c.status === "Declined";
    return c.status !== "Completed" && c.status !== "Declined";
  });

  const tabs = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "declined", label: "Declined" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">My Applications</h1>
        <Button href="/app/apply">New Application</Button>
      </div>

      <div className="flex gap-1 border-b border-neutral-300">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/app/cases?filter=${t.key}`}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${
              filter === t.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/app/cases/${c.id}`}
              className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-neutral-900">{hospitalNames[c.hospitalId] ?? "Hospital"}</p>
                <p className="text-sm text-neutral-500">
                  {c.specialtySlug} &middot; {c.refNumber} &middot; Submitted{" "}
                  {new Date(c.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <StatusChip status={formatStatus(c.status)} />
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
              No {filter} applications.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
