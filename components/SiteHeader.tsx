import Link from "next/link";

const NAV = [
  { href: "/", label: "Explore", active: true },
  { href: "/map", label: "Map" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/submit", label: "Submit a Toilet" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[#1e3a5f]/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-serif text-[28px] leading-none text-heading sm:text-[34px]"
        >
          Toilet Atlas
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.active
                  ? "border-b-2 border-heading pb-0.5 font-medium text-heading"
                  : "text-foreground/80 transition-colors hover:text-heading"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="hidden text-xs uppercase tracking-wider text-muted transition-colors hover:text-heading sm:inline"
          >
            About the Atlas
          </Link>
          <button
            type="button"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full bg-heading text-white transition-colors hover:bg-heading/90"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
