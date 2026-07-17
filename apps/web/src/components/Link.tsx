"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "@/lib/i18n";

/**
 * Locale-aware wrapper around next/link. Internal string hrefs that start with "/"
 * and aren't already locale-prefixed get the current locale prepended, so callers
 * keep writing `<Link href="/hospitals">` and the URL becomes `/en/hospitals` (or
 * `/bn/...`). External links, hashes, and hrefs that already carry a locale pass
 * through untouched.
 */
export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const localizedHref =
    typeof href === "string" && href.startsWith("/") && !/^\/(en|bn)(\/|$)/.test(href)
      ? `/${locale}${href}`
      : href;
  return <NextLink href={localizedHref} {...rest} />;
}
