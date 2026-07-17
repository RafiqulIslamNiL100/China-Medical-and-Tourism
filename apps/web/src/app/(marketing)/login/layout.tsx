import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Log In",
  description: "Log in to your Asia Health Link & Travel account.",
  path: "/login",
  noindex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
