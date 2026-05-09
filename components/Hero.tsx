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
          <SketchPlaceholder />
        </div>
      </div>
    </section>
  );
}

function SketchPlaceholder() {
  return (
    <div className="relative aspect-[4/3] w-full">
      <div className="absolute inset-y-0 right-0 left-0 overflow-hidden rounded-2xl border-2 border-dashed border-[#1e3a5f]/20 bg-[#FFFDF8] lg:left-[15%]">
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <div>
            <SketchHint />
            <p className="mt-4 font-serif italic text-base text-muted">
              Placeholder: hand-drawn toilet sketch
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted/80">
              Replace at /images/placeholders/header-sketch-toilet.svg
            </p>
          </div>
        </div>
      </div>
    </div>
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

function SketchHint() {
  return (
    <svg
      viewBox="0 0 240 160"
      className="mx-auto h-24 w-32 text-[#1e3a5f]/40 sm:h-28 sm:w-40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 140 L60 110 L110 122 L160 96 L210 116 L230 130" />
      <path d="M120 100 L120 78 L138 60 L156 78 L156 100 Z" />
      <path d="M120 78 L156 78" />
      <rect x="128" y="86" width="6" height="10" />
      <path d="M146 89 L150 89" />
      <path d="M30 140 L230 140" />
      <path d="M40 145 L60 145" strokeDasharray="2 4" />
      <path d="M180 145 L210 145" strokeDasharray="2 4" />
    </svg>
  );
}
