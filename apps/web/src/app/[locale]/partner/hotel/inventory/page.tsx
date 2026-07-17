"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-client";
import { getMyHotels, listRoomTypes, addRoomType, ApiError, type RoomType } from "@/lib/api";

export default function HotelInventoryPage() {
  const { accessToken } = useAuth();
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", roomCount: "", baseRateUsd: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    getMyHotels(accessToken)
      .then(async (hotels) => {
        const hotel = hotels[0];
        if (!hotel) return;
        setHotelId(hotel.id);
        setRoomTypes(await listRoomTypes(hotel.id));
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !hotelId) return;
    setError(null);
    try {
      const created = await addRoomType(accessToken, hotelId, {
        name: form.name,
        roomCount: Number(form.roomCount),
        baseRateUsd: Number(form.baseRateUsd),
      });
      setRoomTypes((prev) => [...prev, created]);
      setForm({ name: "", roomCount: "", baseRateUsd: "" });
      setAdding(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add room type.");
    }
  }

  if (loading) return <p className="text-sm text-neutral-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Inventory &amp; Rates</h1>
        <Button size="sm" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add Room Type"}
        </Button>
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-[10px] border border-neutral-300 bg-white p-5 shadow-sm sm:grid-cols-3">
          {error ? <p className="text-sm text-danger-700 sm:col-span-3">{error}</p> : null}
          <input required placeholder="Room type name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Room count" value={form.roomCount} onChange={(e) => setForm((f) => ({ ...f, roomCount: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Base rate $/night" value={form.baseRateUsd} onChange={(e) => setForm((f) => ({ ...f, baseRateUsd: e.target.value }))} className="rounded-md border border-neutral-300 px-3 py-2 text-sm" />
          <Button type="submit" size="sm" className="w-fit sm:col-span-3">Save</Button>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-[10px] border border-neutral-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-300 bg-neutral-100 text-left text-xs font-semibold text-neutral-500 uppercase">
            <tr>
              <th className="px-4 py-3">Room Type</th>
              <th className="px-4 py-3">Available Rooms</th>
              <th className="px-4 py-3">Base Rate</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((rt) => (
              <tr key={rt.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-semibold text-neutral-900">{rt.name}</td>
                <td className="px-4 py-3 tabular-nums text-neutral-700">{rt.roomCount}</td>
                <td className="px-4 py-3 tabular-nums text-neutral-700">${rt.baseRateUsd}/night</td>
              </tr>
            ))}
            {roomTypes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-500">
                  No room types yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
