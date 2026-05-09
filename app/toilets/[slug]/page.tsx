import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Gallery } from "./Gallery";
import { Chip } from "@/components/Chip";
import { getAllToilets, getRelated, getToiletBySlug } from "@/lib/toilets";
import type { Toilet } from "@/lib/types";

export async function generateStaticParams() {
  return getAllToilets().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const toilet = getToiletBySlug(slug);
  if (!toilet) return { title: "Not found" };
  return {
    title: `${toilet.name} — Global Fun Toilet Atlas`,
    description: toilet.tagline ?? toilet.description,
  };
}

export default async function ToiletPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const toilet = getToiletBySlug(slug);
  if (!toilet) notFound();
  const related = getRelated(toilet, 2);

  return (
    <article className="pb-24">
      <Hero toilet={toilet} />
      <div className="mx-auto max-w-[720px] px-4 sm:px-6">
        <HeroCaption toilet={toilet} />
        <BackLink />
        <InfoCard toilet={toilet} />
        <Story toilet={toilet} />
        <PhotoGallery toilet={toilet} />
        <DesignerSection toilet={toilet} />
        <VisitorTips toilet={toilet} />
        <MapPlaceholder toilet={toilet} />
        <RelatedToilets related={related} />
      </div>
    </article>
  );
}

function Hero({ toilet }: { toilet: Toilet }) {
  const cover = toilet.images[0];
  return (
    <section className="relative h-[60vh] w-full">
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[720px] px-4 pb-10 sm:px-6 sm:pb-14">
          <h1 className="font-serif text-4xl text-white sm:text-5xl">
            {toilet.name}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-wider text-white/80">
            {toilet.location.city}, {toilet.location.country}
          </p>
        </div>
      </div>
    </section>
  );
}

function HeroCaption({ toilet }: { toilet: Toilet }) {
  const cover = toilet.images[0];
  if (!cover.caption && !cover.photographer) return null;
  return (
    <p className="mt-4 font-serif text-sm italic text-muted">
      {cover.caption}
      {cover.caption && cover.photographer ? " " : ""}
      {cover.photographer && (
        <span className="not-italic uppercase tracking-wider text-xs text-muted">
          &nbsp;— {cover.photographer}
        </span>
      )}
    </p>
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="mt-8 inline-block text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
    >
      ← Back to atlas
    </Link>
  );
}

function InfoCard({ toilet }: { toilet: Toilet }) {
  const textRows: { label: string; value: string }[] = [
    {
      label: "Location",
      value: `${toilet.location.city}, ${toilet.location.country}`,
    },
  ];
  if (toilet.region) textRows.push({ label: "Region", value: toilet.region });
  if (toilet.year) textRows.push({ label: "Year", value: String(toilet.year) });
  if (toilet.architect)
    textRows.push({ label: "Architect", value: toilet.architect });

  const styles = toilet.styles ?? [];
  const features = toilet.features ?? [];
  const tags = toilet.tags ?? [];

  return (
    <section className="mt-8 rounded-md border border-foreground/10 bg-white p-6">
      <dl className="space-y-3 text-sm">
        {textRows.map((it) => (
          <div
            key={it.label}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-x-6"
          >
            <dt className="text-xs uppercase tracking-wider text-muted">
              {it.label}
            </dt>
            <dd className="text-foreground">{it.value}</dd>
          </div>
        ))}
        {styles.length > 0 && (
          <div className="grid grid-cols-[6rem_1fr] items-start gap-x-6">
            <dt className="pt-0.5 text-xs uppercase tracking-wider text-muted">
              Style
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {styles.map((s) => (
                <Chip key={s} variant="accent">
                  {s}
                </Chip>
              ))}
            </dd>
          </div>
        )}
        {features.length > 0 && (
          <div className="grid grid-cols-[6rem_1fr] items-start gap-x-6">
            <dt className="pt-0.5 text-xs uppercase tracking-wider text-muted">
              Features
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {features.map((f) => (
                <Chip key={f} variant="accent-soft">
                  {f}
                </Chip>
              ))}
            </dd>
          </div>
        )}
      </dl>
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-foreground/10 pt-5">
          {tags.map((t) => (
            <Chip key={t} variant="muted">
              {t}
            </Chip>
          ))}
        </div>
      )}
    </section>
  );
}

function Story({ toilet }: { toilet: Toilet }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-heading">The Story</h2>
      <p className="mt-4 text-base leading-relaxed text-foreground">
        {toilet.description}
      </p>
    </section>
  );
}

function PhotoGallery({ toilet }: { toilet: Toilet }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-heading">Photo Gallery</h2>
      <div className="mt-4">
        <Gallery images={toilet.images} />
      </div>
    </section>
  );
}

function DesignerSection({ toilet }: { toilet: Toilet }) {
  if (!toilet.architect) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-heading">Designer</h2>
      <p className="mt-4 text-base leading-relaxed text-foreground">
        Designed by{" "}
        <span className="font-medium text-heading">{toilet.architect}</span>
        {toilet.year ? ` in ${toilet.year}.` : "."}
      </p>
    </section>
  );
}

function VisitorTips({ toilet }: { toilet: Toilet }) {
  const tips = toilet.tips ?? [];
  if (tips.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-heading">Visitor Tips</h2>
      <ul className="mt-4 space-y-3">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-3">
            <CheckIcon />
            <span className="text-base text-foreground">{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-1 h-4 w-4 flex-none text-accent"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 8 7 12 13 4" />
    </svg>
  );
}

function MapPlaceholder({ toilet }: { toilet: Toilet }) {
  const c = toilet.location.coordinates;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-heading">Map</h2>
      <div className="mt-4 rounded-md border border-dashed border-foreground/20 bg-foreground/[0.02] p-6 text-center">
        <p className="text-xs uppercase tracking-wider text-muted">
          Map placeholder
        </p>
        <p className="mt-2 font-mono text-sm text-foreground">
          {c
            ? `Coordinates: ${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`
            : "Coordinates not available"}
        </p>
      </div>
    </section>
  );
}

function RelatedToilets({ related }: { related: Toilet[] }) {
  if (related.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl text-heading">Related Toilets</h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {related.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/toilets/${t.slug}`}
              className="group block overflow-hidden rounded-md bg-white ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="overflow-hidden">
                <Image
                  src={t.images[0].src}
                  alt={t.images[0].alt}
                  width={800}
                  height={600}
                  sizes="(min-width: 640px) 350px, 100vw"
                  className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base text-heading">{t.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {t.location.city}, {t.location.country}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
