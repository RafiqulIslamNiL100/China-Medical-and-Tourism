"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { fmtDateTime } from "@/lib/portal";
import { listAuditLog, type AuditLogEntry } from "@/lib/api";

export default function AdminAuditLogPage() {
  const { accessToken } = useAuth();
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    listAuditLog(accessToken)
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  }, [accessToken]);

  function exportCsv() {
    const header = "Timestamp,Actor,Action,Target\n";
    const rows = entries
      .map((e) => [e.createdAt, e.actorLabel, e.action, `${e.targetType}${e.targetId ? `:${e.targetId}` : ""}`].map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Audit Log</h1>
        <button className="text-sm font-semibold text-primary-700" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <p className="text-sm text-neutral-500">
        Read-only, immutable record of sensitive platform actions — document access, role changes, financial
        adjustments, listing approvals.
      </p>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500 tabular-nums">{fmtDateTime(entry.createdAt)}</td>
                <td className="px-4 py-3 font-semibold text-neutral-900">{entry.actorLabel}</td>
                <td className="px-4 py-3 text-neutral-700">{entry.action}</td>
                <td className="px-4 py-3 text-neutral-700">
                  {entry.targetType}
                  {entry.targetId ? ` · ${entry.targetId}` : ""}
                </td>
              </tr>
            ))}
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  No audit entries yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
