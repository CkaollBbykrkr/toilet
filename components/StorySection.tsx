import { SectionHeading } from "./SectionHeading";

const PLACEHOLDER =
  "This story placeholder will be replaced with a researched editorial note about the toilet's design, cultural context, and visitor experience.";

export function StorySection({ description }: { description?: string }) {
  return (
    <section className="px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading>The Story</SectionHeading>
      <p className="mx-auto mt-8 max-w-[720px] text-center text-base leading-7 text-[#243447] sm:leading-8">
        {description ?? PLACEHOLDER}
      </p>
    </section>
  );
}
