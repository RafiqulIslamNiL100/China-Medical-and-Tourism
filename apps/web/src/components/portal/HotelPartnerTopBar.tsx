import Link from "next/link";
import { currentHotelPartner, hotelBookings } from "@/data/partner";

const mobileNavItems = [
  { href: "/partner/hotel/dashboard", label: "Dashboard" },
  { href: "/partner/hotel/inventory", label: "Inventory" },
  { href: "/partner/hotel/bookings", label: "Bookings" },
];

export function HotelPartnerTopBar() {
  const pendingCount = hotelBookings.filter((b) => b.status === "Pending").length;

  return (
    <div className="sticky top-0 z-30 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div>
          <p className="text-sm font-bold text-neutral-900">{currentHotelPartner.hotelName}</p>
          <p className="text-xs text-neutral-500">{currentHotelPartner.contactName}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden rounded-full bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning-600 sm:inline-block">
            Demo mode — sample data
          </span>
          {pendingCount > 0 ? (
            <span className="rounded-full bg-info-100 px-2.5 py-1 text-xs font-semibold text-info-600">
              {pendingCount} pending booking{pendingCount === 1 ? "" : "s"}
            </span>
          ) : null}
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
