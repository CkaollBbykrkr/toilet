export function SectionHeading({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="font-serif text-3xl text-heading sm:text-4xl">
        {children}
      </h2>
      <StarDivider align={align} />
    </div>
  );
}

function StarDivider({ align }: { align: "center" | "left" }) {
  return (
    <div
      aria-hidden="true"
      className={`mt-3 flex items-center gap-2 text-accent-soft ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-6 bg-accent-soft/60" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
        <path d="M12 2 14.39 8.26 21 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.61-1.01L12 2z" />
      </svg>
      <span className="h-px w-6 bg-accent-soft/60" />
    </div>
  );
}
