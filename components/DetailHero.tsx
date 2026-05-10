import Image from "next/image";
import Link from "next/link";
import type { Toilet } from "@/lib/types";

export function DetailHero({ toilet }: { toilet: Toilet }) {
  const cover = toilet.images[0];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderCover />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-24 sm:px-10 sm:pb-28 lg:pb-32">
          <Breadcrumb toilet={toilet} />
          <h1 className="mt-3 font-serif text-[36px] leading-[0.96] text-white sm:text-5xl lg:text-[64px] lg:leading-[0.95]">
            {toilet.name}
          </h1>
          <p className="mt-2 text-sm text-white/85 sm:text-base">
            {toilet.location.city}, {toilet.location.country}
          </p>
        </div>
      </div>
    </section>
  );
}

function Breadcrumb({ toilet }: { toilet: Toilet }) {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
  ];
  if (toilet.region)
    crumbs.push({
      label: toilet.region,
      href: `/?region=${encodeURIComponent(toilet.region)}`,
    });
  crumbs.push({ label: toilet.location.country });
  crumbs.push({ label: toilet.name });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 text-xs uppercase tracking-wider text-white/75">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {c.href ? (
              <Link href={c.href} className="hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span className={i === crumbs.length - 1 ? "text-white" : ""}>
                {c.label}
              </span>
            )}
            {i < crumbs.length - 1 && (
              <span className="text-white/40">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PlaceholderCover() {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#1e3a5f]/15 to-[#1e3a5f]/5">
      <p className="font-serif italic text-base text-muted">
        Cover image placeholder
      </p>
    </div>
  );
}
