import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { StoryCard, StoryCardPlaceholder } from "@/components/StoryCard";
import { getAllStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Stories · Toilet Atlas",
  description:
    "Themed walks through the catalog — the Tokyo Toilet Project, Norway's Scenic Routes, and other collections.",
};

export default function StoriesIndex() {
  const stories = getAllStories();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Stories
        </p>
        <h1 className="mt-5 font-serif text-[44px] leading-[1.02] text-heading sm:text-[56px]">
          Themed walks through the catalog.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#243447] sm:text-lg">
          Each story groups a handful of entries around a single idea — a city
          program, a landscape architecture tradition, or a reason a public
          loo became a destination.
        </p>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((s, i) => (
          <StoryCard key={s.slug} story={s} index={i} />
        ))}
        <StoryCardPlaceholder index={stories.length} />
      </div>

      <section className="mx-auto mt-24 max-w-2xl text-center">
        <SectionHeading>{"What's next"}</SectionHeading>
        <p className="mx-auto mt-6 text-base leading-relaxed text-[#243447] sm:text-lg">
          {"More collections are in progress — architects-you-wouldn't-expect, ancient sanitation, and a single-essay deep-dive on Cattelan's \"America\". Suggestions welcome."}
        </p>
      </section>
    </main>
  );
}
