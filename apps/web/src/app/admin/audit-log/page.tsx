import type { Metadata } from "next";
import { auditLog } from "@/data/admin";

export const metadata: Metadata = { title: "Audit Log" };

export default function AdminAuditLogPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Audit Log</h1>
        <button className="text-sm font-semibold text-primary-700">Export CSV</button>
      </div>
      <p className="text-sm text-neutral-500">
        Read-only, immutable record of sensitive platform actions — document access, role
        changes, financial adjustments, listing approvals.
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
            {auditLog.map((entry) => (
              <tr key={entry.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500 tabular-nums">
                  {new Date(entry.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-900">{entry.actor}</td>
                <td className="px-4 py-3 text-neutral-700">{entry.action}</td>
                <td className="px-4 py-3 text-neutral-700">{entry.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
