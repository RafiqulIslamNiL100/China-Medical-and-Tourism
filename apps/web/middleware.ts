import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "bn"] as const;
const DEFAULT_LOCALE = "en";

/** Pick a locale from the Accept-Language header, only choosing `bn` when Bengali
 * is clearly preferred; anything else falls back to English. */
function detectLocale(request: NextRequest): (typeof LOCALES)[number] {
  const header = request.headers.get("accept-language");
  if (header) {
    // e.g. "bn-BD,bn;q=0.9,en;q=0.8" — take the highest-priority tag.
    const primary = header.split(",")[0]?.trim().toLowerCase() ?? "";
    if (primary.startsWith("bn")) return "bn";
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  // pathname is always absolute ("/", "/hospitals", ...) — prefix the locale.
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the API, and file-convention/static routes — everything
  // else (including a bare "/") gets locale-detected and redirected.
  matcher: [
    "/((?!_next|api|favicon.ico|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
