import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { searchHospitals, listSpecialties, listCities, listArticles } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

// Cache the sitemap's own response for an hour rather than recomputing it on every
// crawl hit — the underlying lib/api.ts calls below already carry their own
// revalidate windows, so this is mostly about not re-serializing the XML constantly.
export const revalidate = 3600;

function url(path: string): string {
  return new URL(path, SITE_URL).toString();
}

const staticRoutes: {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/hospitals", changeFrequency: "daily", priority: 0.9 },
  { path: "/specialties", changeFrequency: "daily", priority: 0.9 },
  { path: "/destinations", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.6 },
  { path: "/reviews", changeFrequency: "weekly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/partner-with-us", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.1 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Force this to render per-request rather than being attempted as a build-time
  // static route — same reasoning as the connection() calls in destinations/page.tsx
  // and blog/page.tsx: the fetches below are now cache-eligible, and Next tries to
  // fully prerender any route where that's true unless something opts it out, which
  // would require a live backend during `next build`/CI.
  await connection();

  // The API caps `limit` at 100 — fine today (4 hospitals), but once the network
  // grows past that this needs real pagination here rather than a single fetch.
  const [hospitalsRes, specialties, cities, articles] = await Promise.all([
    searchHospitals({ limit: 100 }),
    listSpecialties(),
    listCities(),
    listArticles(),
  ]);

  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: url(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const h of hospitalsRes.data) {
    entries.push({ url: url(`/hospitals/${h.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const s of specialties) {
    entries.push({ url: url(`/specialties/${s.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const c of cities) {
    entries.push({ url: url(`/destinations/${c.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }
  for (const a of articles) {
    entries.push({
      url: url(`/blog/${a.slug}`),
      lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
