"use client";

import { useEffect } from "react";

/**
 * Keeps the real <html lang> attribute in sync with the active locale. The root
 * layout owns the <html> tag but can't know the locale (it's outside the [locale]
 * segment), so this small client island updates it from inside the segment.
 */
export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
