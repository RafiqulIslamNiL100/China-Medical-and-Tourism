import { notFound } from "next/navigation";
import { AuthProvider } from "@/lib/auth-client";
import { JsonLd } from "@/components/JsonLd";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { buildOrganizationSchema } from "@/lib/structured-data";

const LOCALES = ["en", "bn"];

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bn" }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();

  return (
    <>
      <JsonLd data={buildOrganizationSchema()} />
      <HtmlLangSync locale={locale} />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
