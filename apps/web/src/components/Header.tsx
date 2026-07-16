import Link from "next/link";
import { Button } from "./Button";

const navLinks = [
  { href: "/hospitals", label: "Hospitals" },
  { href: "/specialties", label: "Specialties" },
  { href: "/destinations", label: "Destinations" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
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
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-semibold text-neutral-700 hover:text-primary-700 sm:inline-block"
          >
            Log In
          </Link>
          <Button href="/register" size="sm">
            Get Started
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
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
