import type { ReactNode } from "react";

export type ChipVariant = "accent" | "accent-soft" | "muted";

const VARIANT_CLASSES: Record<ChipVariant, string> = {
  accent: "border-accent text-accent bg-white",
  "accent-soft":
    "border-accent-soft/60 text-foreground bg-accent-soft/15",
  muted: "border-foreground/15 text-muted bg-white",
};

export function Chip({
  variant = "muted",
  children,
}: {
  variant?: ChipVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
