import { Chip } from "./Chip";
import type { Toilet } from "@/lib/types";

export function BasicInfoCard({ toilet }: { toilet: Toilet }) {
  const styleSummary =
    toilet.styles && toilet.styles.length > 0 ? toilet.styles.join(" / ") : "—";

  const rows: { icon: React.ReactNode; label: string; value: React.ReactNode }[] =
    [
      {
        icon: <GlobeIcon />,
        label: "Country",
        value: toilet.location.country,
      },
      {
        icon: <PinIcon />,
        label: "Region",
        value: toilet.region ?? "—",
      },
      {
        icon: <CalendarIcon />,
        label: "Year",
        value: toilet.year ? String(toilet.year) : "—",
      },
      {
        icon: <PersonIcon />,
        label: "Designer",
        value: toilet.designer?.name ?? "—",
      },
      {
        icon: <DiamondIcon />,
        label: "Design Style",
        value: styleSummary,
      },
    ];

  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] p-6 shadow-lg sm:p-8">
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start gap-3">
              <span className="mt-0.5 text-heading/70">{r.icon}</span>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {r.label}
                </dt>
                <dd className="mt-1 text-base text-foreground">{r.value}</dd>
              </div>
            </div>
          ))}
          {toilet.features && toilet.features.length > 0 && (
            <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
              <span className="mt-0.5 text-heading/70">
                <StarIcon />
              </span>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Features
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {toilet.features.map((f) => (
                    <Chip key={f} variant="accent-soft">
                      {f}
                    </Chip>
                  ))}
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 3 22 12 12 21 2 12 z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2 14.39 8.26 21 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.61-1.01L12 2z" />
    </svg>
  );
}
