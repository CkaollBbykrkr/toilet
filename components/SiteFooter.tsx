import Link from "next/link";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] =
  [
    {
      heading: "Explore",
      links: [
        { href: "/map", label: "Map" },
        { href: "/?region=All", label: "Regions" },
        { href: "/?style=All", label: "Design Styles" },
      ],
    },
    {
      heading: "About",
      links: [
        { href: "/about", label: "About the Atlas" },
        { href: "/mission", label: "Our Mission" },
        { href: "/editorial-policy", label: "Editorial Policy" },
      ],
    },
    {
      heading: "Contribute",
      links: [
        { href: "/submit", label: "Submit a Toilet" },
        { href: "/community", label: "Community" },
      ],
    },
  ];

const SOCIALS: { label: string; href: string; letter: string }[] = [
  { label: "Instagram", href: "https://instagram.com", letter: "ig" },
  { label: "X", href: "https://x.com", letter: "x" },
  { label: "Facebook", href: "https://facebook.com", letter: "fb" },
  { label: "Pinterest", href: "https://pinterest.com", letter: "pt" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#1e3a5f]/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <Link
            href="/"
            className="font-serif text-2xl text-heading sm:text-[28px]"
          >
            Toilet Atlas
          </Link>
          <p className="mt-3 text-sm text-muted">
            Extraordinary toilets. Real places.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 sm:gap-10">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-heading">
                {col.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-heading">
            Follow
          </h3>
          <ul className="mt-3 flex gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-8 w-8 place-items-center rounded-full border border-[#1e3a5f]/20 text-[10px] font-semibold uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {s.letter}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1e3a5f]/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted sm:px-6 lg:px-8">
          © 2026 Toilet Atlas. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
