import Image from "next/image";
import Link from "next/link";
import { Chip } from "./Chip";
import { SectionHeading } from "./SectionHeading";
import type { Toilet } from "@/lib/types";

export function RelatedToilets({
  related,
  region,
}: {
  related: Toilet[];
  region?: string;
}) {
  if (related.length === 0) return null;
  const heading = region ? `Related Toilets in ${region}` : "Related Toilets";

  return (
    <section className="px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading>{heading}</SectionHeading>
      <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
        {related.map((t) => (
          <li key={t.slug}>
            <RelatedCard toilet={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedCard({ toilet }: { toilet: Toilet }) {
  const cover = toilet.images[0];
  const tags = toilet.tags?.slice(0, 2) ?? [];
  return (
    <Link
      href={`/toilets/${toilet.slug}`}
      className="group flex overflow-hidden rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-32 flex-none overflow-hidden sm:w-40">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 640px) 160px, 128px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[#1e3a5f]/5 text-[10px] uppercase tracking-wider text-muted">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-base leading-snug text-heading sm:text-lg">
          {toilet.name}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
          {toilet.location.city}, {toilet.location.country}
        </p>
        {toilet.tagline && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#243447]">
            {toilet.tagline}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {tags.map((tag) => (
              <Chip key={tag} variant="accent-soft">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
