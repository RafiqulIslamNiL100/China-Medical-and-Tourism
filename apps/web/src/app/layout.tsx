import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-client";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "China Medical and Tourism — Coordinated Treatment in China",
    template: "%s — China Medical and Tourism",
  },
  description:
    "Book world-class treatment at accredited hospitals in China, with visa support, hotel booking, and airport transfers coordinated in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
