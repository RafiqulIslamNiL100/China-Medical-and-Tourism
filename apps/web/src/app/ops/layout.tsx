import { OpsSidebar } from "@/components/portal/OpsSidebar";
import { OpsTopBar } from "@/components/portal/OpsTopBar";
import { RequireRole } from "@/lib/portal";

export default function OpsPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireRole roles={["case_manager", "admin"]}>
      <div className="flex min-h-full flex-1 bg-neutral-100">
        <OpsSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <OpsTopBar />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
