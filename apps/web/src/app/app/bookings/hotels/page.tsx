import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Stars } from "@/components/Stars";
import { cities } from "@/data/hospitals";

export const metadata: Metadata = { title: "Hotel Bookings" };

const mockHotels = [
  { name: "Beijing Riverside Suites", city: "beijing", distance: "0.4 km from hospital", rating: 4.6, priceUsd: 120 },
  { name: "Beijing Central Comfort Inn", city: "beijing", distance: "0.9 km from hospital", rating: 4.3, priceUsd: 85 },
  { name: "Shanghai Harbor View Hotel", city: "shanghai", distance: "0.6 km from hospital", rating: 4.7, priceUsd: 140 },
  { name: "Guangzhou Garden Residence", city: "guangzhou", distance: "1.1 km from hospital", rating: 4.4, priceUsd: 95 },
];

export default function HotelBookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Hotel Bookings</h1>
      <p className="text-sm text-neutral-500">
        Book a hotel near your hospital for your treatment stay.
      </p>

      <div className="rounded-[10px] border border-neutral-300 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <select className="rounded-md border border-neutral-300 px-3 py-2 text-sm">
            {cities.map((c) => (
              <option key={c.slug}>{c.name}</option>
            ))}
          </select>
          <input type="date" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input type="date" className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <Button size="sm">Search</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockHotels.map((h) => (
          <div key={h.name} className="flex flex-col gap-2 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm">
            <p className="font-bold text-neutral-900">{h.name}</p>
            <p className="text-sm text-neutral-500">{h.distance}</p>
            <div className="flex items-center justify-between">
              <Stars rating={h.rating} />
              <span className="font-semibold text-primary-700">${h.priceUsd}/night</span>
            </div>
            <Button size="sm" className="mt-2">
              Book
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
