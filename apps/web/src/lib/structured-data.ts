import { SITE_URL, SITE_NAME } from "./seo";
import type { Hospital, Article } from "./api";

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Site-wide Organization + WebSite schema — rendered once, in the root layout. */
export function buildOrganizationSchema() {
  const origin = SITE_URL.origin;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: origin,
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: SITE_NAME,
        publisher: { "@id": `${origin}/#organization` },
      },
    ],
  };
}

export function buildMedicalOrganizationSchema(hospital: Hospital, cityName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: hospital.name,
    description: hospital.description,
    url: absoluteUrl(`/hospitals/${hospital.slug}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: "CN",
    },
    // Freeform slugs rather than schema.org's closed MedicalSpecialty enum — search
    // engines accept text values here, and mapping to the enum isn't worth the extra
    // fetch this page doesn't otherwise need.
    medicalSpecialty: hospital.specialtySlugs,
    ...(hospital.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: hospital.rating,
            reviewCount: hospital.reviewCount,
          },
        }
      : {}),
  };
}

/** Only call this when `faqs` is non-empty — an empty FAQPage is against Google's
 * structured data guidelines and gets ignored or flagged, not just wasted. */
export function buildFAQPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export type BreadcrumbItem = { label: string; href?: string };

/** Shared by components/Breadcrumbs.tsx — one source of truth so the visible
 * breadcrumb trail and its schema can never drift apart. */
export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function buildArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.publishedAt ?? undefined,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
  };
}
