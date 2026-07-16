"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { getMyHotels } from "@/lib/api";

const navItems = [
  { href: "/partner/hotel/dashboard", label: "Dashboard" },
  { href: "/partner/hotel/inventory", label: "Inventory & Rates" },
  { href: "/partner/hotel/bookings", label: "Bookings" },
];

export function HotelPartnerSidebar() {
  const pathname = usePathname();
  const { accessToken } = useAuth();
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    getMyHotels(accessToken).then((hotels) => setHotelName(hotels[0]?.name ?? ""));
  }, [accessToken]);

  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-300/70 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col gap-1 overflow-y-auto p-4">
        <Link href="/" className="mb-1 flex items-center gap-2 px-2 font-bold text-neutral-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-600 text-xs text-white">
            AHL
          </span>
          Hotel Partner
        </Link>
        {hotelName ? <p className="mb-3 px-2 text-xs text-neutral-500">{hotelName}</p> : null}
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-primary-100 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
