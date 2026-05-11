import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BasicInfoCard } from "@/components/BasicInfoCard";
import { DesignerSection } from "@/components/DesignerSection";
import { DetailHero } from "@/components/DetailHero";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RelatedToilets } from "@/components/RelatedToilets";
import { SourcesSection } from "@/components/SourcesSection";
import { StorySection } from "@/components/StorySection";
import { VisitorTips } from "@/components/VisitorTips";
import { getAllToilets, getRelated, getToiletBySlug } from "@/lib/toilets";

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
  if (!toilet) return { title: "Not found — Toilet Atlas" };
  return {
    title: `${toilet.name} — Toilet Atlas`,
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
    <article className="pb-16">
      <DetailHero toilet={toilet} />
      <BasicInfoCard toilet={toilet} />
      <StorySection description={toilet.description} />
      <PhotoGallery images={toilet.images} />

      {toilet.designer ? (
        <div className="mx-auto mt-20 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <DesignerSection designer={toilet.designer} />
          <VisitorTips tips={toilet.visitorTips} />
        </div>
      ) : (
        <div className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
          <VisitorTips tips={toilet.visitorTips} />
        </div>
      )}

      <MapPlaceholder coordinates={toilet.location.coordinates} />
      <SourcesSection sources={toilet.sources} />
      <RelatedToilets related={related} region={toilet.region} />
    </article>
  );
}
