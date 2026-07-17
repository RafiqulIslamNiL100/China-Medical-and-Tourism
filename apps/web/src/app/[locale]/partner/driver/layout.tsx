import { RequireRole } from "@/lib/portal";

export default function DriverPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole roles={["driver"]}>{children}</RequireRole>;
}
