import data from "@/data/toilets.json";
import type { Toilet } from "@/lib/types";

const toilets = data as Toilet[];

export function getAllToilets(): Toilet[] {
  return toilets;
}

export function getToiletBySlug(slug: string): Toilet | undefined {
  return toilets.find((t) => t.slug === slug);
}

export function getRelated(toilet: Toilet, n = 2): Toilet[] {
  const others = toilets.filter((t) => t.slug !== toilet.slug);
  const sameRegion = toilet.region
    ? others.filter((t) => t.region === toilet.region)
    : [];
  const seen = new Set(sameRegion.map((t) => t.slug));
  const filler = others.filter((t) => !seen.has(t.slug));
  return [...sameRegion, ...filler].slice(0, n);
}
