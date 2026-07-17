"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, fmtDate, slaRiskFor } from "@/lib/portal";
import { listApplications, searchHospitals, type Application } from "@/lib/api";

const views = [
  { key: "all", label: "All Cases" },
  { key: "mine", label: "My Cases" },
  { key: "urgent", label: "Urgent" },
  { key: "unassigned", label: "Unassigned" },
];

export default function OpsQueuePage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "all";
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [hospitalNames, setHospitalNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    Promise.all([
      listApplications(accessToken, { view: view === "all" ? undefined : view }),
      searchHospitals(),
    ])
      .then(([apps, hospitals]) => {
        setApplications(apps.data);
        setHospitalNames(Object.fromEntries(hospitals.data.map((h) => [h.id, h.name])));
      })
      .finally(() => setLoading(false));
  }, [accessToken, view]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Case Queue</h1>

      <div className="flex gap-1 border-b border-neutral-300">
        {views.map((v) => (
          <Link
            key={v.key}
            href={`/ops/queue?view=${v.key}`}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${
              view === v.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">Case Manager</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">SLA</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-100/50">
                  <td className="px-4 py-3">
                    <Link href={`/ops/cases/${c.id}`} className="font-semibold text-primary-700">
                      {c.refNumber}
                    </Link>
                    <p className="text-xs text-neutral-500">{c.specialtySlug}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{hospitalNames[c.hospitalId] ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">
                    {c.caseManagerUserId ? "Assigned" : <Badge tone="warning">Unassigned</Badge>}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{fmtDate(c.submittedAt)}</td>
                  <td className="px-4 py-3">
                    <SlaChip risk={slaRiskFor(c.submittedAt, c.status)} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{statusLabel(c.status)}</Badge>
                  </td>
                </tr>
              ))}
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No cases in this view.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
