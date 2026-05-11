import { SectionHeading } from "./SectionHeading";
import type { Source } from "@/lib/types";

export function SourcesSection({ sources }: { sources?: Source[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading>Further Reading</SectionHeading>
      <ul className="mx-auto mt-8 max-w-[720px] space-y-3">
        {sources.map((s) => (
          <li key={s.url} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 inline-block h-1 w-1 flex-none rounded-full bg-accent-soft"
            />
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-baseline gap-1 text-sm leading-relaxed text-[#243447] transition-colors hover:text-accent"
            >
              <span className="underline decoration-[#1e3a5f]/20 underline-offset-2 group-hover:decoration-accent/40">
                {s.title}
              </span>
              <ExternalLinkIcon />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 flex-none translate-y-px"
      aria-hidden="true"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M20 14v6H4V4h6" />
    </svg>
  );
}
