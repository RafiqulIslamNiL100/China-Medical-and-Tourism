import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { StatusChip } from "@/components/portal/StatusChip";
import { patientCases } from "@/data/patient";

export const metadata: Metadata = { title: "My Applications" };

export default async function CasesListPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "active" } = await searchParams;
  const filtered = patientCases.filter((c) => {
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

      <div className="flex flex-col gap-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/app/cases/${c.id}`}
            className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold text-neutral-900">{c.hospitalName}</p>
              <p className="text-sm text-neutral-500">
                {c.specialty} &middot; {c.refNumber} &middot; Submitted {c.submittedDate}
              </p>
            </div>
            <StatusChip status={c.status} />
          </Link>
        ))}
        {filtered.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            No {filter} applications.
          </div>
        ) : null}
      </div>
    </div>
  );
}
