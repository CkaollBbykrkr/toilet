import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ToiletCard } from "@/components/ToiletCard";
import { getAllStories, getStoryBySlug } from "@/lib/stories";
import { getToiletBySlug } from "@/lib/toilets";

export async function generateStaticParams() {
  return getAllStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story · Toilet Atlas" };
  return {
    title: `${story.title} · Toilet Atlas`,
    description: story.tagline,
  };
}

export default async function StoryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const heroToilet = getToiletBySlug(story.heroToiletSlug);
  const heroImage = heroToilet?.images[0];
  const related = story.relatedToiletSlugs
    .map((s) => getToiletBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted transition-colors hover:text-heading"
        >
          <ArrowLeft />
          All stories
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Story · {story.relatedToiletSlugs.length} toilets
            </p>
            <h1 className="mt-5 font-serif text-[40px] leading-[1.04] text-heading sm:text-[56px] lg:text-[64px]">
              {story.title}
            </h1>
            <p className="mt-6 max-w-xl font-serif text-base italic leading-relaxed text-[#243447] sm:text-lg">
              {story.tagline}
            </p>
          </div>
          {heroImage && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#dedbd3]">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Intro + sections */}
      <article className="mx-auto mt-16 max-w-3xl px-4 pb-4 sm:px-6 lg:px-8">
        <Paragraphs text={story.intro} leading />
        {story.sections.map((section, i) => (
          <section key={`${section.heading}-${i}`} className="mt-14">
            <h2 className="font-serif text-3xl text-heading sm:text-[34px]">
              {section.heading}
            </h2>
            <div className="mt-2 h-px w-12 bg-accent-soft/70" />
            <div className="mt-6">
              <Paragraphs text={section.body} />
            </div>
          </section>
        ))}
      </article>

      {/* Related toilets */}
      <section className="mx-auto mt-24 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHeading>The toilets in this story</SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {related.map((t, i) => (
            <ToiletCard key={t.slug} toilet={t} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Paragraphs({ text, leading = false }: { text: string; leading?: boolean }) {
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={
            leading
              ? "font-serif text-lg leading-relaxed text-[#243447] sm:text-xl sm:leading-[1.7]"
              : "text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]"
          }
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function ArrowLeft() {
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
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
