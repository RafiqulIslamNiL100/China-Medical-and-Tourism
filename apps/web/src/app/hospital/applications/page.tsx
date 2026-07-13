"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, fmtDate, slaRiskFor } from "@/lib/portal";
import { listApplications, type Application } from "@/lib/api";

export default function HospitalApplicationsPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    listApplications(accessToken)
      .then((res) => setApplications(res.data))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Applications Queue</h1>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Specialty</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-100/50">
                <td className="px-4 py-3">
                  <Link href={`/hospital/applications/${a.id}`} className="font-semibold text-primary-700">
                    {a.refNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700">{a.specialtySlug}</td>
                <td className="px-4 py-3 text-neutral-500">{fmtDate(a.submittedAt)}</td>
                <td className="px-4 py-3">
                  <SlaChip risk={slaRiskFor(a.submittedAt, a.status)} />
                </td>
                <td className="px-4 py-3">
                  <Badge>{statusLabel(a.status)}</Badge>
                </td>
              </tr>
            ))}
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No applications yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
