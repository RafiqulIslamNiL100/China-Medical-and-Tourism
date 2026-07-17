"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { fmtDate, fmtMoney } from "@/lib/portal";
import { listApplications, listInvoices, payInvoice, ApiError, type Application, type Invoice } from "@/lib/api";

const statusTone = { Paid: "success", Due: "warning", Refunded: "info", Cancelled: "neutral" } as const;

type Row = Invoice & { hospitalId: string; caseRef: string; caseId: string };

export default function PaymentsPage() {
  const { accessToken } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!accessToken) return;
    const apps = await listApplications(accessToken);
    const perCase = await Promise.all(
      apps.data.map(async (a: Application) => {
        const invoices = await listInvoices(accessToken, a.id);
        return invoices.map((inv) => ({ ...inv, hospitalId: a.hospitalId, caseRef: a.refNumber, caseId: a.id }));
      }),
    );
    setRows(perCase.flat());
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function handlePay(row: Row) {
    if (!accessToken) return;
    setError(null);
    setPayingId(row.id);
    try {
      await payInvoice(accessToken, row.id, crypto.randomUUID());
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed.");
    } finally {
      setPayingId(null);
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Payments</h1>
      <p className="text-sm text-neutral-500">All transactions across your applications.</p>
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((inv) => (
              <tr key={inv.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{fmtDate(inv.dueDate ?? inv.createdAt)}</td>
                <td className="px-4 py-3">
                  <p className="text-xs text-neutral-500">{inv.caseRef}</p>
                </td>
                <td className="px-4 py-3 text-neutral-700">{inv.description}</td>
                <td className="px-4 py-3 text-right font-semibold text-neutral-900 tabular-nums">
                  {fmtMoney(inv.amountUsd)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[inv.status]}>{inv.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {inv.status === "Due" ? (
                    <Button size="sm" onClick={() => handlePay(inv)} disabled={payingId === inv.id}>
                      {payingId === inv.id ? "Paying…" : "Pay now"}
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No transactions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
