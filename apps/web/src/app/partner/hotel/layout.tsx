import { HotelPartnerSidebar } from "@/components/portal/HotelPartnerSidebar";
import { HotelPartnerTopBar } from "@/components/portal/HotelPartnerTopBar";

export default function HotelPartnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 bg-neutral-100">
      <HotelPartnerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HotelPartnerTopBar />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
