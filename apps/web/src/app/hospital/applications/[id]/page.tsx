import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SlaChip } from "@/components/portal/SlaChip";
import { incomingApplications } from "@/data/hospitalStaff";

export function generateStaticParams() {
  return incomingApplications.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const app = incomingApplications.find((a) => a.id === id);
  return app ? { title: `${app.refNumber} — ${app.patientName}` } : {};
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = incomingApplications.find((a) => a.id === id);
  if (!application) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500">{application.refNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900">{application.patientName}</h1>
            <p className="text-sm text-neutral-500">
              {application.patientCountry} &middot; {application.specialty}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{application.status}</Badge>
            <SlaChip risk={application.slaRisk} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Medical summary</h2>
            <p className="mb-3 text-sm text-neutral-700">{application.conditionSummary}</p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-neutral-500 uppercase">Current medications</dt>
                <dd className="text-neutral-700">{application.medications}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-neutral-500 uppercase">Allergies</dt>
                <dd className="text-neutral-700">{application.allergies}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Documents</h2>
            <div className="flex flex-col gap-2">
              {application.documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-md border border-neutral-300 p-3 text-sm"
                >
                  {doc.name}
                  <Badge tone={doc.uploaded ? "success" : "neutral"}>
                    {doc.uploaded ? "Uploaded" : "Not uploaded"}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-neutral-900">Decision</h2>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="w-full">
              Accept &amp; Send Treatment Plan
            </Button>
            <Button size="sm" variant="secondary" className="w-full">
              Request More Info
            </Button>
            <Button size="sm" variant="secondary" className="w-full text-danger-600">
              Decline
            </Button>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            SLA target: respond within 3 business days of submission.
          </p>
        </aside>
      </div>
    </div>
  );
}
