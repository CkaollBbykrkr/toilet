import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import type { Designer } from "@/lib/types";

const PLACEHOLDER_BIO =
  "Designer biography placeholder — a short editorial profile of the architect or studio behind this project will go here.";

export function DesignerSection({ designer }: { designer?: Designer }) {
  if (!designer) return null;
  const bio = designer.bio ?? PLACEHOLDER_BIO;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] p-6 sm:p-8">
        <SectionHeading align="left">Designer</SectionHeading>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
          <Portrait designer={designer} />
          <div className="flex-1">
            <h3 className="font-serif text-xl text-heading">{designer.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#243447]">{bio}</p>
            {(designer.portraitCredit || designer.portraitLicense) && (
              <p className="mt-3 text-[11px] uppercase tracking-wider text-muted">
                Portrait:{" "}
                {designer.portraitSourceUrl ? (
                  <a
                    href={designer.portraitSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {designer.portraitCredit ?? "Source"}
                  </a>
                ) : (
                  designer.portraitCredit
                )}
                {designer.portraitLicense && (
                  <>
                    {" "}
                    ·{" "}
                    {designer.portraitLicenseUrl ? (
                      <a
                        href={designer.portraitLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {designer.portraitLicense}
                      </a>
                    ) : (
                      designer.portraitLicense
                    )}
                  </>
                )}
              </p>
            )}
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1e3a5f]/20 px-4 py-1.5 text-xs uppercase tracking-wider text-heading transition-colors hover:border-accent hover:text-accent"
            >
              Learn more about {designer.name}
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Portrait({ designer }: { designer: Designer }) {
  if (designer.portrait) {
    return (
      <div className="relative h-24 w-24 flex-none overflow-hidden rounded-full border border-[#1e3a5f]/10 sm:h-28 sm:w-28">
        <Image
          src={designer.portrait}
          alt={`Portrait of ${designer.name}`}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div className="grid h-24 w-24 flex-none place-items-center rounded-full border border-dashed border-[#1e3a5f]/20 bg-foreground/[0.03] text-center sm:h-28 sm:w-28">
      <p className="px-2 text-[10px] uppercase tracking-wider text-muted">
        Designer portrait placeholder
      </p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
