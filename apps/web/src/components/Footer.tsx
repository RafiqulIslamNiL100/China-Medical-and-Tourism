import Link from "next/link";

const columns = [
  {
    title: "Discover",
    links: [
      { href: "/hospitals", label: "Hospitals" },
      { href: "/specialties", label: "Specialties" },
      { href: "/destinations", label: "Destinations" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/partner-with-us", label: "Partner With Us" },
      { href: "/blog", label: "Blog" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-300/70 bg-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-bold tracking-wide text-neutral-500 uppercase">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-700 hover:text-primary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-neutral-300/70 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} Asia Health Link &amp; Travel. All rights
            reserved.
          </p>
          <p>Medical treatment is provided solely by independent, licensed partner hospitals.</p>
        </div>
      </div>
    </footer>
  );
}
