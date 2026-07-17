import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Forgot Password",
  description: "Reset the password for your Asia Health Link & Travel account.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
