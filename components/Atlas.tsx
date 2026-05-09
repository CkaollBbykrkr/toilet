"use client";

import { useRef } from "react";
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
    regions: uniqueSorted(toilets.map((t) => t.region).filter(isString)),
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

  function clearAll() {
    update({ regions: [], styles: [], features: [] });
    drawerRef.current?.close();
  }

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-foreground/10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => drawerRef.current?.showModal()}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-4 py-1.5 text-sm font-medium text-heading hover:border-heading"
            >
              Filters
              {activeCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-heading px-1.5 text-xs text-white">
                  {activeCount}
                </span>
              )}
            </button>
            <span className="text-xs text-foreground/60">
              {filtered.length} {filtered.length === 1 ? "place" : "places"}
            </span>
          </div>

          <div className="hidden sm:block">
            <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
              {(Object.keys(options) as FilterGroup[]).map((group) => (
                <FilterRow
                  key={group}
                  label={GROUP_LABEL[group]}
                  options={options[group]}
                  selected={filters[group]}
                  onToggle={(v) => toggle(group, v)}
                />
              ))}
              <div className="ml-auto flex items-center gap-4 self-end pb-1">
                <span className="text-xs text-foreground/60">
                  {filtered.length} {filtered.length === 1 ? "place" : "places"}
                </span>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs uppercase tracking-wider text-foreground/60 hover:text-heading"
                  >
                    Clear filters
                  </button>
                )}
              </div>
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
              className="text-2xl leading-none text-foreground/60 hover:text-heading"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">
            {(Object.keys(options) as FilterGroup[]).map((group) => (
              <FilterRow
                key={group}
                label={GROUP_LABEL[group]}
                options={options[group]}
                selected={filters[group]}
                onToggle={(v) => toggle(group, v)}
                vertical
              />
            ))}
          </div>
          <div className="border-t border-foreground/10 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">
                {filtered.length} {filtered.length === 1 ? "place" : "places"}
              </span>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs uppercase tracking-wider text-foreground/60 hover:text-heading"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </dialog>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10 sm:mb-14">
          <h1 className="font-serif text-4xl tracking-tight text-heading sm:text-5xl">
            Global Fun Toilet Atlas
          </h1>
          <p className="mt-3 text-base text-foreground/70 sm:text-lg">
            A visual atlas of unique public toilets around the world.
          </p>
        </header>

        {filtered.length > 0 ? (
          <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {filtered.map((toilet) => (
              <li key={toilet.slug} className="mb-6 break-inside-avoid">
                <ToiletCard toilet={toilet} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-foreground/20 bg-foreground/[0.02] py-16 text-center">
            <p className="font-serif text-xl text-heading">No matches</p>
            <p className="mt-2 text-sm text-foreground/60">
              No toilets match the current filters.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 text-xs uppercase tracking-wider text-heading hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onToggle,
  vertical = false,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  vertical?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div className={vertical ? "" : "flex items-baseline gap-3"}>
      <span
        className={`shrink-0 text-xs uppercase tracking-wider text-foreground/60 ${
          vertical ? "mb-2 block" : ""
        }`}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isOn = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={isOn}
              className={
                "rounded-full border px-3 py-1 text-xs transition-colors " +
                (isOn
                  ? "border-heading bg-heading text-white"
                  : "border-foreground/15 bg-white text-foreground/70 hover:border-heading hover:text-heading")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}
