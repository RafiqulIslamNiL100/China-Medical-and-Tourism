import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusChip } from "@/components/portal/StatusChip";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { patientCases } from "@/data/patient";

export function generateStaticParams() {
  return patientCases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = patientCases.find((x) => x.id === id);
  return c ? { title: `${c.refNumber} — ${c.hospitalName}` } : {};
}

const docStatusTone = {
  "Not Uploaded": "neutral",
  Uploaded: "info",
  Verified: "success",
  Rejected: "danger",
} as const;

const invoiceStatusTone = {
  Paid: "success",
  Due: "warning",
  Refunded: "info",
} as const;

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patientCase = patientCases.find((c) => c.id === id);
  if (!patientCase) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500">{patientCase.refNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900">{patientCase.hospitalName}</h1>
            <p className="text-sm text-neutral-500">
              {patientCase.specialty} &middot; {patientCase.doctorName}
            </p>
          </div>
          <StatusChip status={patientCase.status} />
        </div>
        {patientCase.caseManager ? (
          <div className="mt-4 flex items-center gap-3 rounded-md bg-primary-100 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              {patientCase.caseManager.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">{patientCase.caseManager.name}</p>
              <p className="text-xs text-neutral-600">{patientCase.caseManager.title}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="sticky top-[57px] z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-neutral-300/70 bg-neutral-100 px-4 py-1 lg:top-0 lg:mx-0 lg:px-0">
        {[
          ["#overview", "Overview"],
          ["#documents", "Documents"],
          ["#messages", "Messages"],
          ["#itinerary", "Itinerary"],
          ["#payments", "Payments"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-white"
          >
            {label}
          </a>
        ))}
      </div>

      <section id="overview" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Overview</h2>
        {patientCase.treatmentPlan ? (
          <>
            <p className="text-sm font-semibold text-neutral-900">Treatment plan</p>
            <p className="mb-3 text-sm text-neutral-700">{patientCase.treatmentPlan}</p>
            {patientCase.costEstimateUsd ? (
              <p className="mb-4 text-sm text-neutral-700">
                Estimated cost:{" "}
                <span className="font-bold text-primary-700">
                  ${patientCase.costEstimateUsd[0].toLocaleString()}–$
                  {patientCase.costEstimateUsd[1].toLocaleString()}
                </span>
              </p>
            ) : null}
          </>
        ) : (
          <p className="mb-4 text-sm text-neutral-500">
            Treatment plan will appear here once the hospital reviews your case.
          </p>
        )}
        <p className="mb-3 text-sm font-semibold text-neutral-900">Status timeline</p>
        <div className="flex flex-col">
          {patientCase.timeline.map((t, i) => (
            <div key={t.label} className="flex gap-3 pb-5 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    t.pending ? "bg-neutral-300" : "bg-primary-600"
                  }`}
                />
                {i < patientCase.timeline.length - 1 ? (
                  <span className="mt-1 w-0.5 flex-1 bg-neutral-300" />
                ) : null}
              </div>
              <div>
                <p className={`text-sm font-semibold ${t.pending ? "text-neutral-500" : "text-neutral-900"}`}>
                  {t.label}
                </p>
                <p className="text-xs text-neutral-500">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="documents" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Documents</h2>
        <div className="flex flex-col gap-2">
          {patientCase.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-neutral-300 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">{doc.name}</p>
                <p className="text-xs text-neutral-500">
                  {doc.category}
                  {doc.note ? ` — ${doc.note}` : ""}
                </p>
              </div>
              <Badge tone={docStatusTone[doc.status]}>{doc.status}</Badge>
            </div>
          ))}
          {patientCase.documents.length === 0 ? (
            <p className="text-sm text-neutral-500">No documents requested yet.</p>
          ) : null}
        </div>
      </section>

      <section id="messages" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Messages</h2>
        <div className="flex flex-col gap-4">
          {patientCase.messages.map((m) => (
            <div key={m.id} className={m.role === "Patient" ? "self-end text-right" : ""}>
              <p className="text-xs font-semibold text-neutral-500">
                {m.sender} &middot; {m.role}
              </p>
              <p
                className={`mt-1 inline-block max-w-md rounded-[10px] px-3 py-2 text-sm ${
                  m.role === "Patient"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 text-neutral-800"
                }`}
              >
                {m.body}
              </p>
            </div>
          ))}
          {patientCase.messages.length === 0 ? (
            <p className="text-sm text-neutral-500">No messages yet.</p>
          ) : null}
        </div>
        <form className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Write a message…"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-2 focus:outline-primary-600"
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </section>

      <section id="itinerary" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Itinerary</h2>
        <div className="flex flex-col gap-3">
          {patientCase.itinerary.map((ev) => (
            <div key={ev.id} className="rounded-md border border-neutral-300 p-3">
              <p className="text-xs font-semibold text-primary-700">{ev.type}</p>
              <p className="text-sm font-bold text-neutral-900">{ev.title}</p>
              <p className="text-xs text-neutral-500">{ev.date}</p>
              <p className="mt-1 text-sm text-neutral-600">{ev.detail}</p>
            </div>
          ))}
          {patientCase.itinerary.length === 0 ? (
            <p className="text-sm text-neutral-500">Nothing scheduled yet.</p>
          ) : null}
        </div>
        <div className="mt-4 flex gap-2">
          <Button href="/app/bookings/hotels" variant="secondary" size="sm">
            Add Hotel Booking
          </Button>
          <Button href="/app/bookings/transfers" variant="secondary" size="sm">
            Request Airport Transfer
          </Button>
        </div>
      </section>

      <section id="payments" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Payments</h2>
        <div className="flex flex-col gap-2">
          {patientCase.invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-neutral-300 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">{inv.description}</p>
                <p className="text-xs text-neutral-500">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-neutral-900">
                  ${inv.amountUsd.toLocaleString()}
                </span>
                <Badge tone={invoiceStatusTone[inv.status]}>{inv.status}</Badge>
                {inv.status === "Due" ? (
                  <Button size="sm" variant="accent">
                    Pay Now
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
          {patientCase.invoices.length === 0 ? (
            <p className="text-sm text-neutral-500">No invoices yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
