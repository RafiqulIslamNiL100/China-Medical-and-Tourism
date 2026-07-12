import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { opsCases } from "@/data/opsConsole";

export const metadata: Metadata = { title: "Case Queue" };

export default async function OpsQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view = "all" } = await searchParams;
  const filtered = opsCases.filter((c) => {
    if (view === "urgent") return c.slaRisk === "breached" || c.slaRisk === "at-risk";
    if (view === "mine") return c.assignedCaseManager === "Li Wei";
    if (view === "unassigned") return c.assignedCaseManager === "Unassigned";
    return true;
  });

  const views = [
    { key: "all", label: "All Cases" },
    { key: "mine", label: "My Cases" },
    { key: "urgent", label: "Urgent" },
    { key: "unassigned", label: "Unassigned" },
  ];

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

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Case Manager</th>
              <th className="px-4 py-3">Travel Date</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-100/50">
                <td className="px-4 py-3">
                  <Link href={`/ops/cases/${c.id}`} className="font-semibold text-primary-700">
                    {c.patientName}
                  </Link>
                  <p className="text-xs text-neutral-500">
                    {c.refNumber} &middot; {c.patientCountry}
                  </p>
                </td>
                <td className="px-4 py-3 text-neutral-700">{c.hospitalName}</td>
                <td className="px-4 py-3 text-neutral-700">
                  {c.assignedCaseManager === "Unassigned" ? (
                    <Badge tone="warning">Unassigned</Badge>
                  ) : (
                    c.assignedCaseManager
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-500">{c.travelDate ?? "TBC"}</td>
                <td className="px-4 py-3">
                  <SlaChip risk={c.slaRisk} />
                </td>
                <td className="px-4 py-3">
                  <Badge>{c.status}</Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No cases in this view.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
