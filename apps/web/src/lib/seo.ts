import type { Metadata } from "next";

export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
export const SITE_NAME = "Asia Health Link & Travel";
export const DEFAULT_DESCRIPTION =
  "Book world-class treatment at accredited hospitals in China, with visa support, hotel booking, and airport transfers coordinated in one place.";

/**
 * Shared metadata builder for every marketing page — one call site instead of
 * hand-rolling canonical/OpenGraph/Twitter tags per page. `title` stays a plain
 * string so the root layout's title template ("%s — Asia Health Link & Travel")
 * still applies to the <title> tag; OG/Twitter don't get that template, so this
 * appends the site name to those only when the caller hasn't already included it
 * (the homepage passes its own full title and shouldn't get it twice).
 */
/** File-based default OG image (apps/web/src/app/opengraph-image.tsx) — Next serves
 * it at this path, but doesn't auto-attach it to pages that set their own
 * `openGraph` object (as buildMetadata() does for every page), so it's referenced
 * explicitly here rather than relying on implicit file-convention inheritance. */
const DEFAULT_OG_IMAGE = "/opengraph-image";

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  noindex = false,
  absoluteTitle = false,
  ogImage = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description?: string;
  path: string;
  noindex?: boolean;
  /** Set when `title` already includes the site name (e.g. the homepage) — bypasses
   * the root layout's title template so it isn't appended a second time. */
  absoluteTitle?: boolean;
  /** Override the default site-wide OG image, e.g. once per-hospital photos exist. */
  ogImage?: string;
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
