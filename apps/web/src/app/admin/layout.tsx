import { AdminSidebar } from "@/components/portal/AdminSidebar";
import { AdminTopBar } from "@/components/portal/AdminTopBar";

export default function AdminPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 bg-neutral-100">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
