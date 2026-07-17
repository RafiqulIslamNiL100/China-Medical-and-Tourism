import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Authenticated portal trees — no public content to index, and every route
        // under them redirects anonymous visitors to /login anyway. The `/*/` wildcard
        // matches the locale prefix (/en/admin, /bn/admin, …) that every route now
        // carries.
        "/*/admin",
        "/*/app",
        "/*/hospital",
        "/*/ops",
        "/*/partner",
        // Auth forms — already noindex via <meta robots>, disallowed here too so
        // crawlers don't spend budget on them at all.
        "/*/login",
        "/*/register",
        "/*/forgot-password",
        "/*/reset-password",
      ],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
