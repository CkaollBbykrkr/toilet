import Image from "next/image";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-14 lg:px-8 lg:pb-8 lg:pt-16">
      <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-4">
        <div className="lg:relative lg:z-10">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            <StarIcon />
            Remarkable places to relieve
          </p>
          <h1 className="mt-5 font-serif text-[44px] leading-[0.96] text-heading sm:text-[60px] lg:text-[80px] lg:leading-[0.94]">
            Extraordinary
            <br />
            toilets. <span className="italic">Real places.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#243447] sm:text-lg">
            A global guide to public loos with story, design and seriously good
            views.
          </p>
        </div>
        <div className="lg:-ml-12 xl:-ml-20">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src="/images/placeholders/header-sketch-toilet.png"
              alt="Hand-drawn sketch of a small concrete public toilet perched on a cliffside with mountains in the distance"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5 text-accent-soft"
      aria-hidden="true"
    >
      <path d="M12 2 14.39 8.26 21 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.61-1.01L12 2z" />
    </svg>
  );
}
