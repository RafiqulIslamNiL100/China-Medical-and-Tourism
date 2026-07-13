import { HospitalSidebar } from "@/components/portal/HospitalSidebar";
import { HospitalTopBar } from "@/components/portal/HospitalTopBar";
import { RequireRole } from "@/lib/portal";

export default function HospitalPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireRole roles={["hospital_staff"]}>
      <div className="flex min-h-full flex-1 bg-neutral-100">
        <HospitalSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <HospitalTopBar />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
