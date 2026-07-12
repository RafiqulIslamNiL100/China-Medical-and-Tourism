import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SlaChip } from "@/components/portal/SlaChip";
import { opsCases, availableDrivers, availableInterpreters } from "@/data/opsConsole";

export function generateStaticParams() {
  return opsCases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = opsCases.find((x) => x.id === id);
  return c ? { title: `${c.refNumber} — ${c.patientName}` } : {};
}

export default async function OpsCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opsCase = opsCases.find((c) => c.id === id);
  if (!opsCase) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500">{opsCase.refNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900">{opsCase.patientName}</h1>
            <p className="text-sm text-neutral-500">
              {opsCase.hospitalName} &middot; {opsCase.specialty} &middot; {opsCase.patientCountry}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{opsCase.status}</Badge>
            <SlaChip risk={opsCase.slaRisk} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-neutral-900">Internal notes</h2>
          <p className="mb-4 text-xs text-neutral-500">
            Visible to Case Managers and Admins only — never shown to the patient or hospital.
          </p>
          <div className="flex flex-col gap-3">
            {opsCase.internalNotes.map((n, i) => (
              <div key={i} className="rounded-md bg-neutral-100 p-3">
                <p className="text-sm text-neutral-700">{n.note}</p>
                <p className="mt-1 text-xs font-semibold text-neutral-500">
                  {n.author} &middot; {n.date}
                </p>
              </div>
            ))}
            {opsCase.internalNotes.length === 0 ? (
              <p className="text-sm text-neutral-500">No internal notes yet.</p>
            ) : null}
          </div>
          <form className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add an internal note…"
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
            />
            <Button type="submit" size="sm">
              Add Note
            </Button>
          </form>
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Case manager</h2>
            <p className="text-sm text-neutral-700">{opsCase.assignedCaseManager}</p>
            <Button size="sm" variant="secondary" className="mt-3 w-full">
              Reassign
            </Button>
          </div>

          <div className="rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Assignments</h2>
            <div className="flex flex-col gap-3">
              {opsCase.assignments.map((a, i) => (
                <div key={i} className="rounded-md border border-neutral-300 p-3">
                  <p className="text-xs font-semibold text-primary-700">{a.type}</p>
                  <p className="text-sm text-neutral-700">{a.detail}</p>
                  <p className="text-xs text-neutral-500">{a.date}</p>
                  {a.name ? (
                    <Badge tone="success">{a.name}</Badge>
                  ) : (
                    <select className="mt-2 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs">
                      <option value="">Assign {a.type.toLowerCase()}…</option>
                      {(a.type === "Driver" ? availableDrivers : availableInterpreters).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              {opsCase.assignments.length === 0 ? (
                <p className="text-sm text-neutral-500">No transfers or interpreter sessions yet.</p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
