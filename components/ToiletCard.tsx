import Image from "next/image";
import Link from "next/link";
import type { Toilet } from "@/lib/types";

export function ToiletCard({ toilet }: { toilet: Toilet }) {
  const cover = toilet.images[0];
  const tagline = toilet.tagline ?? toilet.description;
  const tags = toilet.tags?.slice(0, 2) ?? [];

  return (
    <Link
      href={`/toilets/${toilet.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="overflow-hidden">
        <Image
          src={cover.src}
          alt={cover.alt}
          width={1200}
          height={800}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h2 className="font-serif text-xl leading-snug text-heading">
          {toilet.name}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wider text-foreground/50">
          {toilet.location.city}, {toilet.location.country}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/70">
          {tagline}
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-foreground/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
