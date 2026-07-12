import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { roomTypes } from "@/data/partner";

export const metadata: Metadata = { title: "Inventory & Rates" };

export default function HotelInventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Inventory &amp; Rates</h1>
        <Button size="sm">Add Room Type</Button>
      </div>

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Room Type</th>
              <th className="px-4 py-3">Available Rooms</th>
              <th className="px-4 py-3">Base Rate</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((rt) => (
              <tr key={rt.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-neutral-900">{rt.name}</td>
                <td className="px-4 py-3 tabular-nums text-neutral-700">{rt.count}</td>
                <td className="px-4 py-3 tabular-nums text-neutral-700">${rt.baseRateUsd}/night</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold text-primary-700">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
