"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { StatusChip } from "@/components/portal/StatusChip";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import type { CaseStatus } from "@/data/patient";
import { useAuth } from "@/lib/auth-client";
import { statusLabel, fmtDate, fmtDateTime, fmtMoney } from "@/lib/portal";
import {
  getApplication,
  getHospital,
  listDocuments,
  uploadDocument,
  listCaseMessages,
  sendCaseMessage,
  listInvoices,
  payInvoice,
  getInvitationLetter,
  listMyHotelBookings,
  listTransfers,
  requestTransfer,
  ApiError,
  absoluteFileUrl,
  type Application,
  type Hospital,
  type ChecklistItem,
  type CaseMessage,
  type Invoice,
  type InvitationLetter,
  type HotelBooking,
  type Transfer,
} from "@/lib/api";

const docStatusTone = {
  NotUploaded: "neutral",
  Uploaded: "info",
  Verified: "success",
  Rejected: "danger",
} as const;

const invoiceStatusTone = {
  Paid: "success",
  Due: "warning",
  Refunded: "info",
  Cancelled: "neutral",
} as const;

type StageState = "done" | "current" | "upcoming";

function deriveStages(application: Application, depositPaid: boolean, letterIssued: boolean) {
  if (application.status === "Declined") {
    return [
      { label: "Submitted", state: "done" as StageState },
      { label: "Reviewed", state: "done" as StageState },
      { label: "Declined", state: "current" as StageState },
    ];
  }

  const accepted = application.status === "Accepted" || application.status === "Completed";
  const completed = application.status === "Completed";

  const stages: { label: string; state: StageState }[] = [
    { label: "Submitted", state: "done" },
    { label: "Under Review", state: accepted ? "done" : "current" },
    { label: "Accepted", state: accepted ? "done" : "upcoming" },
    { label: "Deposit Paid", state: depositPaid ? "done" : accepted ? "current" : "upcoming" },
    { label: "Approval Letter Sent", state: letterIssued ? "done" : depositPaid ? "current" : "upcoming" },
    { label: "Visa Application", state: completed ? "done" : letterIssued ? "current" : "upcoming" },
    { label: "Completed", state: completed ? "done" : "upcoming" },
  ];
  return stages;
}

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const applicationId = params.id;
  const { accessToken, user } = useAuth();

  const [application, setApplication] = useState<Application | null | undefined>(undefined);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [documents, setDocuments] = useState<ChecklistItem[]>([]);
  const [messages, setMessages] = useState<CaseMessage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invitationLetter, setInvitationLetter] = useState<InvitationLetter | null>(null);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [messageText, setMessageText] = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!accessToken) return;
    try {
      const [app, docs, msgs, inv, letter, bookings, xfers] = await Promise.all([
        getApplication(accessToken, applicationId),
        listDocuments(accessToken, applicationId),
        listCaseMessages(accessToken, applicationId),
        listInvoices(accessToken, applicationId),
        getInvitationLetter(accessToken, applicationId),
        listMyHotelBookings(accessToken),
        listTransfers(accessToken, applicationId),
      ]);
      setApplication(app);
      setDocuments(docs);
      setMessages(msgs);
      setInvoices(inv);
      setInvitationLetter(letter);
      setHotelBookings(bookings.filter((b) => b.applicationId === applicationId));
      setTransfers(xfers);
      const h = await getHospital(app.hospitalId);
      setHospital(h);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setApplication(null);
      } else {
        setError(err instanceof ApiError ? err.message : "Could not load this case.");
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, applicationId]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !messageText.trim()) return;
    const sent = await sendCaseMessage(accessToken, applicationId, messageText.trim());
    setMessages((prev) => [...prev, sent]);
    setMessageText("");
  }

  async function handleUpload(doc: ChecklistItem, file: File) {
    if (!accessToken) return;
    setUploadingId(doc.id);
    setError(null);
    try {
      const updated = await uploadDocument(accessToken, applicationId, doc.id, file);
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  }

  async function handlePay(inv: Invoice) {
    if (!accessToken) return;
    setPayingId(inv.id);
    setError(null);
    try {
      await payInvoice(accessToken, inv.id, crypto.randomUUID());
      const refreshed = await listInvoices(accessToken, applicationId);
      setInvoices(refreshed);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed.");
    } finally {
      setPayingId(null);
    }
  }

  if (application === undefined) return <p className="p-8 text-sm text-neutral-500">Loading…</p>;
  if (application === null) notFound();

  const displayStatus = statusLabel(application.status) as CaseStatus;
  const depositPaid = invoices.some((inv) => inv.description === "Booking deposit" && inv.status === "Paid");
  const stages = deriveStages(application, depositPaid, invitationLetter !== null);

  return (
    <div className="flex flex-col gap-6">
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500">{application.refNumber}</p>
            <h1 className="text-xl font-bold text-neutral-900">{hospital?.name ?? "Hospital"}</h1>
            <p className="text-sm text-neutral-500">{application.specialtySlug}</p>
          </div>
          <StatusChip status={displayStatus} />
        </div>

        <div className="mt-5 flex items-start gap-1 overflow-x-auto pb-1">
          {stages.map((s, i) => (
            <div key={s.label} className="flex min-w-[92px] flex-1 flex-col items-center gap-1 text-center">
              <div className="flex w-full items-center">
                <span
                  className={`h-0.5 flex-1 ${i === 0 ? "invisible" : s.state === "upcoming" ? "bg-neutral-200" : "bg-primary-600"}`}
                />
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    s.state === "done"
                      ? "bg-primary-600 text-white"
                      : s.state === "current"
                        ? "border-2 border-primary-600 text-primary-700"
                        : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {s.state === "done" ? "✓" : i + 1}
                </span>
                <span
                  className={`h-0.5 flex-1 ${i === stages.length - 1 ? "invisible" : s.state === "done" ? "bg-primary-600" : "bg-neutral-200"}`}
                />
              </div>
              <p className={`text-xs font-semibold ${s.state === "upcoming" ? "text-neutral-400" : "text-neutral-800"}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
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
        {application.treatmentPlan ? (
          <>
            <p className="text-sm font-semibold text-neutral-900">Treatment plan</p>
            <p className="mb-3 text-sm text-neutral-700">{application.treatmentPlan}</p>
            {application.costEstimateMinUsd && application.costEstimateMaxUsd ? (
              <p className="mb-4 text-sm text-neutral-700">
                Estimated cost:{" "}
                <span className="font-bold text-primary-700">
                  {fmtMoney(application.costEstimateMinUsd)}–{fmtMoney(application.costEstimateMaxUsd)}
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
          {(application.statusHistory ?? []).map((t, i, arr) => (
            <div key={t.id} className="flex gap-3 pb-5 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-600" />
                {i < arr.length - 1 ? <span className="mt-1 w-0.5 flex-1 bg-neutral-300" /> : null}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{statusLabel(t.status)}</p>
                <p className="text-xs text-neutral-500">{fmtDateTime(t.createdAt)}</p>
                {t.note ? <p className="text-xs text-neutral-600">{t.note}</p> : null}
              </div>
            </div>
          ))}
          {(application.statusHistory ?? []).length === 0 ? (
            <p className="text-sm text-neutral-500">No status changes yet.</p>
          ) : null}
        </div>
      </section>

      <section id="documents" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Documents</h2>
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
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
                {doc.downloadUrl ? (
                  <a
                    href={absoluteFileUrl(doc.downloadUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-primary-700"
                  >
                    View file
                  </a>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={docStatusTone[doc.status]}>{statusLabel(doc.status)}</Badge>
                {doc.status !== "Verified" ? (
                  <label className="cursor-pointer text-xs font-semibold text-primary-700">
                    {uploadingId === doc.id ? "Uploading…" : "Upload"}
                    <input
                      type="file"
                      className="hidden"
                      disabled={uploadingId === doc.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(doc, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                ) : null}
              </div>
            </div>
          ))}
          {documents.length === 0 ? <p className="text-sm text-neutral-500">No documents requested yet.</p> : null}
        </div>
      </section>

      <section id="messages" className="scroll-mt-32 rounded-[10px] border border-neutral-300 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-bold text-neutral-900">Messages</h2>
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className={m.senderUserId === user?.id ? "self-end text-right" : ""}>
              <p className="text-xs font-semibold text-neutral-500">{fmtDateTime(m.createdAt)}</p>
              <p
                className={`mt-1 inline-block max-w-md rounded-[10px] px-3 py-2 text-sm ${
                  m.senderUserId === user?.id ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-800"
                }`}
              >
                {m.body}
              </p>
            </div>
          ))}
          {messages.length === 0 ? <p className="text-sm text-neutral-500">No messages yet.</p> : null}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
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
          {hotelBookings.map((b) => (
            <div key={b.id} className="rounded-md border border-neutral-300 p-3">
              <p className="text-xs font-semibold text-primary-700">Hotel Stay &middot; {b.status}</p>
              <p className="text-sm font-bold text-neutral-900">
                {b.hotel?.name ?? "Hotel"} — {b.roomType?.name ?? "Room"}
              </p>
              <p className="text-xs text-neutral-500">
                {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
              </p>
            </div>
          ))}
          {transfers.map((t) => (
            <div key={t.id} className="rounded-md border border-neutral-300 p-3">
              <p className="text-xs font-semibold text-primary-700">
                Airport {t.direction} &middot; {t.status}
              </p>
              <p className="text-sm font-bold text-neutral-900">{t.pickupLocation}</p>
              <p className="text-xs text-neutral-500">
                {fmtDateTime(t.scheduledAt)}
                {t.flightNumber ? ` · ${t.flightNumber}` : ""}
              </p>
            </div>
          ))}
          {hotelBookings.length === 0 && transfers.length === 0 ? (
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
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-neutral-300 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">{inv.description}</p>
                <p className="text-xs text-neutral-500">{fmtDate(inv.dueDate ?? inv.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-neutral-900">{fmtMoney(inv.amountUsd)}</span>
                <Badge tone={invoiceStatusTone[inv.status]}>{inv.status}</Badge>
                {inv.status === "Due" ? (
                  <Button size="sm" variant="accent" onClick={() => handlePay(inv)} disabled={payingId === inv.id}>
                    {payingId === inv.id ? "Paying…" : "Pay Now"}
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
          {invoices.length === 0 ? <p className="text-sm text-neutral-500">No invoices yet.</p> : null}
        </div>

        <h2 className="mt-6 mb-3 font-bold text-neutral-900">Invitation letter</h2>
        {invitationLetter ? (
          <a
            href={absoluteFileUrl(invitationLetter.downloadUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-md border border-success-200 bg-success-50 px-3 py-2 text-sm font-semibold text-success-700"
          >
            View your invitation letter
          </a>
        ) : (
          <p className="text-sm text-neutral-500">
            Issued once your case is accepted and the booking deposit is paid.
          </p>
        )}
      </section>
    </div>
  );
}
