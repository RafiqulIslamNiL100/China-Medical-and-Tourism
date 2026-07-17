import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reset Password",
  description: "Set a new password for your Asia Health Link & Travel account.",
  path: "/reset-password",
  noindex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
