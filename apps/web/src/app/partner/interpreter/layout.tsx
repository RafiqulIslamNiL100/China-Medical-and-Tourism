import { RequireRole } from "@/lib/portal";

export default function InterpreterPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole roles={["interpreter"]}>{children}</RequireRole>;
}
