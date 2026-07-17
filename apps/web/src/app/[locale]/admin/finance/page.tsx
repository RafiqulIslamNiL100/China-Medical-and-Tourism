"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { fmtDate, fmtMoney } from "@/lib/portal";
import { useAuth } from "@/lib/auth-client";
import {
  listCommissionRates,
  setCommissionRate,
  listTransactions,
  searchHospitals,
  searchHotels,
  ApiError,
  type CommissionRate,
  type Payment,
  type Hospital,
  type Hotel,
} from "@/lib/api";

export default function AdminFinancePage() {
  const { accessToken } = useAuth();
  const [rates, setRates] = useState<CommissionRate[]>([]);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rateInput, setRateInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!accessToken) return;
    const [ratesList, txList, hospitalsList, hotelsList] = await Promise.all([
      listCommissionRates(accessToken),
      listTransactions(accessToken),
      searchHospitals(),
      searchHotels(),
    ]);
    setRates(ratesList);
    setTransactions(txList.data);
    setHospitals(hospitalsList.data);
    setHotels(hotelsList);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  function partnerName(rate: CommissionRate): string {
    if (rate.hospitalId) return hospitals.find((h) => h.id === rate.hospitalId)?.name ?? "Hospital";
    if (rate.hotelId) return hotels.find((h) => h.id === rate.hotelId)?.name ?? "Hotel";
    return rate.partnerType;
  }

  async function handleUpdateRate(rate: CommissionRate) {
    if (!accessToken || !rateInput) return;
    setError(null);
    try {
      await setCommissionRate(accessToken, {
        partnerType: rate.partnerType,
        hospitalId: rate.hospitalId ?? undefined,
        hotelId: rate.hotelId ?? undefined,
        rate: Number(rateInput) / 100,
      });
      await load();
      setEditingId(null);
      setRateInput("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update rate.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-neutral-900">Finance</h1>
      {error ? <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{error}</p> : null}

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
              {rates.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-semibold text-neutral-900">{partnerName(c)}</td>
                  <td className="px-4 py-3 text-neutral-700">{c.partnerType}</td>
                  <td className="px-4 py-3 tabular-nums text-neutral-700">
                    {editingId === c.id ? (
                      <input
                        type="number"
                        autoFocus
                        value={rateInput}
                        onChange={(e) => setRateInput(e.target.value)}
                        className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm"
                      />
                    ) : (
                      `${Math.round(Number(c.rate) * 100)}%`
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingId === c.id ? (
                      <div className="flex justify-end gap-2">
                        <button className="text-xs font-semibold text-primary-700" onClick={() => handleUpdateRate(c)}>
                          Save
                        </button>
                        <button className="text-xs font-semibold text-neutral-500" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-xs font-semibold text-primary-700"
                        onClick={() => {
                          setEditingId(c.id);
                          setRateInput(String(Math.round(Number(c.rate) * 100)));
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    No commission rates configured yet.
                  </td>
                </tr>
              ) : null}
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
                <th className="px-4 py-3">Provider ref</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-neutral-500">{fmtDate(t.paidAt)}</td>
                  <td className="px-4 py-3 text-neutral-700">{t.providerRef}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-neutral-900">
                    {fmtMoney(t.amountUsd)}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-neutral-500">
                    No transactions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
