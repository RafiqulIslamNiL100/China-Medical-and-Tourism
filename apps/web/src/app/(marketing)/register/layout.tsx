import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Register",
  description: "Create your Asia Health Link & Travel account and start your treatment application.",
  path: "/register",
  noindex: true,
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
