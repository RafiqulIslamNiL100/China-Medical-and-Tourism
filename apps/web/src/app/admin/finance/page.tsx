import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { commissionRates, transactions } from "@/data/admin";

export const metadata: Metadata = { title: "Finance" };

const statusTone = { Paid: "success", Refunded: "info", Pending: "warning" } as const;

export default function AdminFinancePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-neutral-900">Finance</h1>

      <section>
        <h2 className="mb-3 font-bold text-neutral-900">Commission rates</h2>
        <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {commissionRates.map((c) => (
                <tr key={c.partnerName} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-semibold text-neutral-900">{c.partnerName}</td>
                  <td className="px-4 py-3 text-neutral-700">{c.partnerType}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-700">{Math.round(c.rate * 100)}%</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-semibold text-primary-700">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-neutral-900">Transaction ledger</h2>
        <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-neutral-500">{t.date}</td>
                  <td className="px-4 py-3 text-neutral-900">{t.patientName}</td>
                  <td className="px-4 py-3 text-neutral-700">{t.description}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-neutral-900">
                    ${t.amountUsd.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[t.status]}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
