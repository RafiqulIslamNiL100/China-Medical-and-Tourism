"use client";

import { Link } from "@/components/Link";
import { Button } from "./Button";
import { useLanguage, type DictKey } from "@/lib/i18n";

const navLinks: { href: string; key: DictKey }[] = [
  { href: "/specialties", key: "nav.treatments" },
  { href: "/hospitals", key: "nav.hospitals" },
  { href: "/destinations", key: "nav.destinations" },
  { href: "/how-it-works", key: "nav.howItWorks" },
  { href: "/blog", key: "nav.blog" },
];

function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-md border border-neutral-300 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "en" ? "bg-primary-600 text-white" : "text-neutral-600 hover:bg-primary-100"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        aria-pressed={lang === "bn"}
        className={`rounded px-2 py-1 transition-colors ${
          lang === "bn" ? "bg-primary-600 text-white" : "text-neutral-600 hover:bg-primary-100"
        }`}
      >
        বাং
      </button>
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-300/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm text-white">
            AHL
          </span>
          <span className="hidden sm:inline">Asia Health Link &amp; Travel</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-primary-100 hover:text-primary-700"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:text-primary-700 sm:inline-block"
          >
            {t("nav.login")}
          </Link>
          <Button href="/register" size="sm">
            {t("nav.getStarted")}
          </Button>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-neutral-300/70 px-4 py-2 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-primary-100"
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
