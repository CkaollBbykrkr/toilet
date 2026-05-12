import data from "@/data/stories.json";
import type { Story } from "@/lib/types";

const stories = data as Story[];

export function getAllStories(): Story[] {
  return stories;
}

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}
