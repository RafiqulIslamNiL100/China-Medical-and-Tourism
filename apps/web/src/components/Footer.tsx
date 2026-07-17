"use client";

import { Link } from "@/components/Link";
import { useLanguage, type DictKey } from "@/lib/i18n";

const columns: { titleKey: DictKey; links: { href: string; key: DictKey }[] }[] = [
  {
    titleKey: "footer.discover",
    links: [
      { href: "/specialties", key: "nav.treatments" },
      { href: "/hospitals", key: "nav.hospitals" },
      { href: "/destinations", key: "nav.destinations" },
    ],
  },
  {
    titleKey: "footer.company",
    links: [
      { href: "/about", key: "footer.aboutUs" },
      { href: "/partner-with-us", key: "footer.partnerWithUs" },
      { href: "/blog", key: "nav.blog" },
      { href: "/reviews", key: "footer.reviews" },
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      { href: "/how-it-works", key: "nav.howItWorks" },
      { href: "/faq", key: "footer.faq" },
      { href: "/contact", key: "footer.contact" },
    ],
  },
  {
    titleKey: "footer.legal",
    links: [
      { href: "/privacy-policy", key: "footer.privacyPolicy" },
      { href: "/terms-of-service", key: "footer.termsOfService" },
    ],
  },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-neutral-300/70 bg-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.titleKey}>
              <h3 className="mb-3 text-xs font-bold tracking-wide text-neutral-500 uppercase">
                {t(col.titleKey)}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-700 hover:text-primary-700"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-300/70 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} Asia Health Link &amp; Travel. {t("footer.rights")}
          </p>
          <p>{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
