import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { RequireRole } from "@/lib/portal";

export default function PatientPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireRole roles={["patient"]}>
      <div className="flex min-h-full flex-1 bg-neutral-100">
        <PortalSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <PortalTopBar />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
