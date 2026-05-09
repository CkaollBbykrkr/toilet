import { Atlas, type FilterState } from "@/components/Atlas";
import { getAllToilets } from "@/lib/toilets";
import type { Toilet } from "@/lib/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    region?: string;
    style?: string;
    feature?: string;
  }>;
}) {
  const sp = await searchParams;
  const filters: FilterState = {
    regions: parseList(sp.region),
    styles: parseList(sp.style),
    features: parseList(sp.feature),
  };
  const toilets = getAllToilets();
  const filtered = applyFilters(toilets, filters);

  return <Atlas toilets={toilets} filtered={filtered} filters={filters} />;
}

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function applyFilters(toilets: Toilet[], filters: FilterState): Toilet[] {
  return toilets.filter((t) => {
    if (filters.regions.length > 0) {
      if (!t.region || !filters.regions.includes(t.region)) return false;
    }
    if (filters.styles.length > 0) {
      const tStyles = t.styles ?? [];
      if (!filters.styles.some((s) => tStyles.includes(s))) return false;
    }
    if (filters.features.length > 0) {
      const tFeatures = t.features ?? [];
      if (!filters.features.some((f) => tFeatures.includes(f))) return false;
    }
    return true;
  });
}
