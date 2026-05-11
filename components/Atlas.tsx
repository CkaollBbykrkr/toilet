"use client";

import { useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ToiletCard } from "./ToiletCard";
import type { Toilet } from "@/lib/types";

export type FilterState = {
  regions: string[];
  styles: string[];
  features: string[];
};

type FilterGroup = keyof FilterState;

const PARAM_KEY: Record<FilterGroup, string> = {
  regions: "region",
  styles: "style",
  features: "feature",
};

const GROUP_LABEL: Record<FilterGroup, string> = {
  regions: "Region",
  styles: "Design Style",
  features: "Feature",
};

const ALL_LABEL: Record<FilterGroup, string> = {
  regions: "All Regions",
  styles: "All Styles",
  features: "All Features",
};

export function Atlas({
  toilets,
  filtered,
  filters,
}: {
  toilets: Toilet[];
  filtered: Toilet[];
  filters: FilterState;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDialogElement>(null);

  const options: Record<FilterGroup, string[]> = {
    regions: uniqueSorted(
      toilets.map((t) => t.region as string | undefined).filter(isString),
    ),
    styles: uniqueSorted(toilets.flatMap((t) => t.styles ?? [])),
    features: uniqueSorted(toilets.flatMap((t) => t.features ?? [])),
  };

  const activeCount =
    filters.regions.length + filters.styles.length + filters.features.length;

  function update(next: FilterState) {
    const sp = new URLSearchParams();
    (Object.keys(PARAM_KEY) as FilterGroup[]).forEach((group) => {
      if (next[group].length > 0) {
        sp.set(PARAM_KEY[group], next[group].join(","));
      }
    });
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggle(group: FilterGroup, value: string) {
    const cur = filters[group];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    update({ ...filters, [group]: next });
  }

  function clearGroup(group: FilterGroup) {
    update({ ...filters, [group]: [] });
  }

  function clearAll() {
    update({ regions: [], styles: [], features: [] });
    drawerRef.current?.close();
  }

  return (
    <section id="atlas" aria-label="Toilet atlas">
      <div className="sticky top-0 z-30">
        <div className="bg-[#FAF7F2]/95 pb-4 backdrop-blur supports-[backdrop-filter]:bg-[#FAF7F2]/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => drawerRef.current?.showModal()}
                className="inline-flex items-center gap-2 rounded-full bg-heading px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-heading/90"
              >
                <FilterIcon /> Filters
                {activeCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-heading">
                    {activeCount}
                  </span>
                )}
              </button>
              <span className="text-xs text-muted">
                <strong className="font-semibold text-heading">
                  {filtered.length}
                </strong>{" "}
                toilets found
              </span>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] divide-x divide-[#1e3a5f]/10 rounded-2xl border border-[#1e3a5f]/10 bg-white shadow-sm">
                {(Object.keys(options) as FilterGroup[]).map((group) => (
                  <FilterSection
                    key={group}
                    icon={ICONS[group]}
                    label={GROUP_LABEL[group]}
                    allLabel={ALL_LABEL[group]}
                    options={options[group]}
                    selected={filters[group]}
                    onToggle={(v) => toggle(group, v)}
                    onClearGroup={() => clearGroup(group)}
                  />
                ))}
                <div className="flex items-center px-5">
                  <button
                    type="button"
                    onClick={clearAll}
                    disabled={activeCount === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-[#1e3a5f]/20 bg-white px-4 py-1.5 text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40 disabled:hover:border-[#1e3a5f]/20 disabled:hover:text-muted"
                  >
                    Clear filters
                  </button>
                </div>
              </div>

              <p className="mt-3 px-1 text-xs text-muted">
                <strong className="font-semibold text-heading">
                  {activeCount}
                </strong>{" "}
                {activeCount === 1 ? "filter" : "filters"} active
                <span className="px-2">·</span>
                <strong className="font-semibold text-heading">
                  {filtered.length}
                </strong>{" "}
                {filtered.length === 1 ? "toilet" : "toilets"} found
              </p>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={drawerRef}
        className="m-0 ml-auto h-screen max-h-none w-80 max-w-[90vw] bg-background p-0 backdrop:bg-black/50"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
            <h2 className="font-serif text-xl text-heading">Filters</h2>
            <button
              type="button"
              onClick={() => drawerRef.current?.close()}
              aria-label="Close filters"
              className="text-2xl leading-none text-muted transition-colors hover:text-accent"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
            {(Object.keys(options) as FilterGroup[]).map((group) => (
              <DrawerGroup
                key={group}
                icon={ICONS[group]}
                label={GROUP_LABEL[group]}
                options={options[group]}
                selected={filters[group]}
                onToggle={(v) => toggle(group, v)}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 border-t border-foreground/10 px-5 py-4">
            <button
              type="button"
              onClick={clearAll}
              className="text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => drawerRef.current?.close()}
              className="ml-auto rounded-full bg-heading px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-heading/90"
            >
              Apply filters
              {filtered.length > 0 && (
                <span className="ml-1 text-white/70">
                  · {filtered.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </dialog>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {filtered.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((toilet, i) => (
              <li key={toilet.slug}>
                <ToiletCard toilet={toilet} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState onClear={clearAll} />
        )}
      </main>
    </section>
  );
}

function FilterSection({
  icon,
  label,
  allLabel,
  options,
  selected,
  onToggle,
  onClearGroup,
}: {
  icon: ReactNode;
  label: string;
  allLabel: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClearGroup: () => void;
}) {
  if (options.length === 0) return null;
  const allActive = selected.length === 0;
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
        <span className="text-heading/70">{icon}</span>
        {label}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <ChipButton active={allActive} onClick={onClearGroup}>
          {allLabel}
        </ChipButton>
        {options.map((opt) => (
          <ChipButton
            key={opt}
            active={selected.includes(opt)}
            onClick={() => onToggle(opt)}
          >
            {opt}
          </ChipButton>
        ))}
      </div>
    </div>
  );
}

function DrawerGroup({
  icon,
  label,
  options,
  selected,
  onToggle,
}: {
  icon: ReactNode;
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heading">
        <span className="text-heading/70">{icon}</span>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <ChipButton
            key={opt}
            active={selected.includes(opt)}
            onClick={() => onToggle(opt)}
          >
            {opt}
          </ChipButton>
        ))}
      </div>
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "rounded-full border px-3 py-1 text-xs transition-colors " +
        (active
          ? "border-heading bg-heading text-white"
          : "border-[#1e3a5f]/20 bg-white text-foreground/80 hover:border-accent hover:text-accent")
      }
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#1e3a5f]/20 bg-[#FFFDF8] py-20 text-center">
      <h2 className="font-serif text-2xl text-heading">No toilets found</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-[#243447]">
        Try clearing a few filters or exploring another region.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        Clear filters
      </button>
    </div>
  );
}

const ICONS: Record<FilterGroup, ReactNode> = {
  regions: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
    </svg>
  ),
  styles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M12 19l9-7-9-7-9 7 9 7z" />
      <path d="M12 12V5" />
    </svg>
  ),
  features: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M12 2 14.39 8.26 21 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.61-1.01L12 2z" />
    </svg>
  ),
};

function FilterIcon() {
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
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function uniqueSorted<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}
