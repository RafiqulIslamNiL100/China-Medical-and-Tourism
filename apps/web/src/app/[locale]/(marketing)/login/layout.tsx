import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Log In",
    description: "Log in to your Asia Health Link & Travel account.",
    path: "/login",
    noindex: true,
    locale,
  });
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
