import { SectionHeading } from "./SectionHeading";
import type { VisitorTip, VisitorTipIcon } from "@/lib/types";

const DEFAULT_TIPS: VisitorTip[] = [
  {
    icon: "time",
    title: "Best Time to Visit",
    description:
      "Quieter hours often make for a better experience — avoid peak tourist times.",
  },
  {
    icon: "privacy",
    title: "Privacy",
    description:
      "Standard public-toilet privacy. Lock the door when in use.",
  },
  {
    icon: "accessibility",
    title: "Accessibility",
    description:
      "Accessibility details will appear here when verified.",
  },
  {
    icon: "location",
    title: "Nearby Context",
    description:
      "Information about the surrounding neighborhood will appear here.",
  },
];

export function VisitorTips({ tips }: { tips?: VisitorTip[] }) {
  const list = tips && tips.length > 0 ? tips : DEFAULT_TIPS;

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] p-6 sm:p-8">
        <SectionHeading align="left">Visitor Tips</SectionHeading>
        <ul className="mt-6 space-y-5">
          {list.map((tip) => (
            <li key={tip.title} className="flex gap-4">
              <span className="mt-0.5 flex-none text-heading/70">
                <TipIcon name={tip.icon ?? "info"} />
              </span>
              <div>
                <h3 className="font-serif text-base text-heading">
                  {tip.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#243447]">
                  {tip.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TipIcon({ name }: { name: VisitorTipIcon }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };
  switch (name) {
    case "time":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "privacy":
      return (
        <svg {...props}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "accessibility":
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2" />
          <path d="M9 21l1.5-7H8l1.5-5h5l1 4 3 1" />
        </svg>
      );
    case "location":
      return (
        <svg {...props}>
          <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v.01" />
          <path d="M11 12h1v5h1" />
        </svg>
      );
  }
}
