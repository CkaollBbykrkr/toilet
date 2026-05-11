import Image from "next/image";
import Link from "next/link";
import { Chip } from "./Chip";
import type { Toilet } from "@/lib/types";

export function ToiletCard({
  toilet,
  index = 0,
}: {
  toilet: Toilet;
  index?: number;
}) {
  const cover = toilet.images[0];
  const tagline = toilet.tagline ?? toilet.description;
  const tags = toilet.tags?.slice(0, 2) ?? [];

  return (
    <Link
      href={`/toilets/${toilet.slug}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl animate-fade-in-up"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#dedbd3]">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-heading backdrop-blur-sm"
        >
          <BookmarkIcon />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 min-h-[3.4rem] font-serif text-xl leading-snug text-heading">
          {toilet.name}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted">
          {toilet.location.city}, {toilet.location.country}
        </p>
        <p className="mt-3 line-clamp-2 min-h-[2.7rem] text-sm leading-relaxed text-[#243447]">
          {tagline}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {tags.map((tag) => (
            <Chip key={tag} variant="accent-soft">
              {tag}
            </Chip>
          ))}
        </div>
      </div>
    </Link>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
