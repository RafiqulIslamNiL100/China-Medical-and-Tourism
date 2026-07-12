import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { patientCases } from "@/data/patient";

export const metadata: Metadata = { title: "Payments" };

const statusTone = { Paid: "success", Due: "warning", Refunded: "info" } as const;

export default function PaymentsPage() {
  const allInvoices = patientCases.flatMap((c) =>
    c.invoices.map((inv) => ({ ...inv, caseName: c.hospitalName, caseRef: c.refNumber, caseId: c.id }))
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Payments</h1>
      <p className="text-sm text-neutral-500">All transactions across your applications.</p>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {allInvoices.map((inv) => (
              <tr key={inv.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{inv.date}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-neutral-900">{inv.caseName}</p>
                  <p className="text-xs text-neutral-500">{inv.caseRef}</p>
                </td>
                <td className="px-4 py-3 text-neutral-700">{inv.description}</td>
                <td className="px-4 py-3 text-right font-semibold text-neutral-900 tabular-nums">
                  ${inv.amountUsd.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[inv.status]}>{inv.status}</Badge>
                </td>
              </tr>
            ))}
            {allInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
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
