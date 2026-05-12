import Image from "next/image";
import Link from "next/link";
import { getToiletBySlug } from "@/lib/toilets";
import type { Story } from "@/lib/types";

export function StoryCard({
  story,
  index = 0,
}: {
  story: Story;
  index?: number;
}) {
  const heroToilet = getToiletBySlug(story.heroToiletSlug);
  const cover = heroToilet?.images[0];
  const count = story.relatedToiletSlugs.length;

  return (
    <Link
      href={`/stories/${story.slug}`}
      style={{ animationDelay: `${index * 80}ms` }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl animate-fade-in-up"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#dedbd3]">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Story · {count} toilets
        </p>
        <h2 className="mt-3 font-serif text-2xl leading-snug text-heading">
          {story.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#243447]">
          {story.tagline}
        </p>
        <p className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-heading/70 transition-colors group-hover:text-heading">
          Read the story
          <ArrowRight />
        </p>
      </div>
    </Link>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function StoryCardPlaceholder({ index = 0 }: { index?: number }) {
  return (
    <div
      style={{ animationDelay: `${index * 80}ms` }}
      className="flex flex-col overflow-hidden rounded-2xl border border-dashed border-[#1e3a5f]/20 bg-[#FFFDF8]/60 p-6 animate-fade-in-up"
    >
      <div className="aspect-[3/2] w-full rounded-xl bg-[#1e3a5f]/[0.04]" />
      <div className="mt-6 flex flex-1 flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Story
        </p>
        <h2 className="mt-3 font-serif text-2xl leading-snug text-heading/50">
          More stories soon
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#243447]/60">
          New collections land as the catalog grows — themed walks, regional
          deep-dives, and one-toilet essays in progress.
        </p>
      </div>
    </div>
  );
}
