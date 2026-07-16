"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { SlaChip } from "@/components/portal/SlaChip";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, slaRiskFor } from "@/lib/portal";
import { getApplication, listDocuments, ApiError, type Application, type ChecklistItem } from "@/lib/api";

const docStatusTone = {
  NotUploaded: "neutral",
  Uploaded: "info",
  Verified: "success",
  Rejected: "danger",
} as const;

export default function HospitalApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const applicationId = params.id;
  const { accessToken } = useAuth();

  const [application, setApplication] = useState<Application | null | undefined>(undefined);
  const [documents, setDocuments] = useState<ChecklistItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([getApplication(accessToken, applicationId), listDocuments(accessToken, applicationId)])
      .then(([app, docs]) => {
        setApplication(app);
        setDocuments(docs);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setApplication(null);
        else setError(err instanceof ApiError ? err.message : "Could not load this application.");
      });
  }, [accessToken, applicationId]);

  if (application === undefined) return <p className="p-8 text-sm text-neutral-500">Loading…</p>;
  if (application === null) notFound();

  return (
    <div className="flex flex-col gap-6">
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500">{application.refNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900">{application.patientName ?? "Patient"}</h1>
            <p className="text-sm text-neutral-500">
              {application.patientCountry ?? "—"} &middot; {application.specialtySlug}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{statusLabel(application.status)}</Badge>
            <SlaChip risk={slaRiskFor(application.submittedAt, application.status)} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Medical summary</h2>
            <p className="mb-3 text-sm text-neutral-700">{application.conditionSummary ?? "Not provided."}</p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-neutral-500 uppercase">Current medications</dt>
                <dd className="text-neutral-700">{application.medications ?? "None reported"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-neutral-500 uppercase">Allergies</dt>
                <dd className="text-neutral-700">{application.allergies ?? "None reported"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-bold text-neutral-900">Documents</h2>
            <div className="flex flex-col gap-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-md border border-neutral-300 p-3 text-sm">
                  {doc.name}
                  <Badge tone={docStatusTone[doc.status]}>{statusLabel(doc.status)}</Badge>
                </div>
              ))}
              {documents.length === 0 ? (
                <p className="text-sm text-neutral-500">No documents requested yet — accept the case to generate a checklist.</p>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-neutral-900">Status</h2>
          <p className="text-sm text-neutral-700">{statusLabel(application.status)}</p>
          <p className="mt-3 text-xs text-neutral-500">
            The Asia Health Link case team reviews and decides on applications. You&apos;ll
            be notified here once a decision is made.
          </p>
        </aside>
      </div>
    </div>
  );
}
