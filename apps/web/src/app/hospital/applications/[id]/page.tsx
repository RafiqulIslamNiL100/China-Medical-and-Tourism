"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SlaChip } from "@/components/portal/SlaChip";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, slaRiskFor } from "@/lib/portal";
import { getApplication, listDocuments, decideApplication, ApiError, type Application, type ChecklistItem } from "@/lib/api";

const docStatusTone = {
  NotUploaded: "neutral",
  Uploaded: "info",
  Verified: "success",
  Rejected: "danger",
} as const;

type DecisionMode = "Accept" | "RequestInfo" | "Decline" | null;

export default function HospitalApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const applicationId = params.id;
  const router = useRouter();
  const { accessToken } = useAuth();

  const [application, setApplication] = useState<Application | null | undefined>(undefined);
  const [documents, setDocuments] = useState<ChecklistItem[]>([]);
  const [mode, setMode] = useState<DecisionMode>(null);
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [costMin, setCostMin] = useState("");
  const [costMax, setCostMax] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  async function handleDecision(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !mode) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await decideApplication(accessToken, applicationId, {
        decision: mode,
        treatmentPlan: mode === "Accept" ? treatmentPlan : undefined,
        costEstimateMinUsd: mode === "Accept" ? Number(costMin) : undefined,
        costEstimateMaxUsd: mode === "Accept" ? Number(costMax) : undefined,
        message: mode !== "Accept" ? message : undefined,
      });
      setApplication((prev) => (prev ? { ...prev, ...updated } : updated));
      setMode(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit decision.");
    } finally {
      setSubmitting(false);
    }
  }

  if (application === undefined) return <p className="p-8 text-sm text-neutral-500">Loading…</p>;
  if (application === null) notFound();

  const canDecide = application.status === "Submitted" || application.status === "UnderReview" || application.status === "InfoRequested";

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
          <h2 className="mb-3 font-bold text-neutral-900">Decision</h2>
          {canDecide ? (
            <>
              {mode === null ? (
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="w-full" onClick={() => setMode("Accept")}>
                    Accept &amp; Send Treatment Plan
                  </Button>
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => setMode("RequestInfo")}>
                    Request More Info
                  </Button>
                  <Button size="sm" variant="secondary" className="w-full text-danger-600" onClick={() => setMode("Decline")}>
                    Decline
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleDecision} className="flex flex-col gap-3">
                  {mode === "Accept" ? (
                    <>
                      <textarea
                        required
                        rows={3}
                        placeholder="Treatment plan summary"
                        value={treatmentPlan}
                        onChange={(e) => setTreatmentPlan(e.target.value)}
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          required
                          type="number"
                          placeholder="Min cost $"
                          value={costMin}
                          onChange={(e) => setCostMin(e.target.value)}
                          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                        />
                        <input
                          required
                          type="number"
                          placeholder="Max cost $"
                          value={costMax}
                          onChange={(e) => setCostMax(e.target.value)}
                          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <textarea
                      required
                      rows={3}
                      placeholder={mode === "Decline" ? "Reason for declining" : "What information is needed?"}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
                    />
                  )}
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1" disabled={submitting}>
                      {submitting ? "Submitting…" : "Confirm"}
                    </Button>
                    <Button type="button" size="sm" variant="secondary" onClick={() => setMode(null)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
              <p className="mt-3 text-xs text-neutral-500">SLA target: respond within 3 business days of submission.</p>
            </>
          ) : (
            <p className="text-sm text-neutral-500">This case has already been decided ({statusLabel(application.status)}).</p>
          )}
        </aside>
      </div>
    </div>
  );
}
