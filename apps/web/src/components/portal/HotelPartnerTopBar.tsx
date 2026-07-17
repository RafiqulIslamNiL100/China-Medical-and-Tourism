"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import { useLocale } from "@/lib/i18n";
import { getMyHotels, listHotelBookings } from "@/lib/api";

const mobileNavItems = [
  { href: "/partner/hotel/dashboard", label: "Dashboard" },
  { href: "/partner/hotel/inventory", label: "Inventory" },
  { href: "/partner/hotel/bookings", label: "Bookings" },
];

export function HotelPartnerTopBar() {
  const router = useRouter();
  const locale = useLocale();
  const { accessToken, user, logout } = useAuth();
  const [hotelName, setHotelName] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    getMyHotels(accessToken).then(async (hotels) => {
      const hotel = hotels[0];
      if (!hotel) return;
      setHotelName(hotel.name);
      const bookings = await listHotelBookings(accessToken, hotel.id);
      setPendingCount(bookings.filter((b) => b.status === "Pending").length);
    });
  }, [accessToken]);

  function handleLogout() {
    logout();
    router.push(`/${locale}/login`);
  }

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div>
          <p className="text-sm font-bold text-neutral-900">{hotelName || "Hotel Partner"}</p>
          <p className="text-xs text-neutral-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-4">
          {pendingCount > 0 ? (
            <span className="rounded-full bg-info-100 px-2.5 py-1 text-xs font-semibold text-info-600">
              {pendingCount} pending booking{pendingCount === 1 ? "" : "s"}
            </span>
          ) : null}
          <button
            onClick={handleLogout}
            className="rounded-md px-2 py-1.5 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Log out
          </button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-neutral-300/70 px-3 py-2 lg:hidden">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-neutral-700 hover:bg-primary-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
