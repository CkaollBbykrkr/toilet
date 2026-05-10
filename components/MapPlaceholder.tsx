import { SectionHeading } from "./SectionHeading";

export function MapPlaceholder({
  coordinates,
}: {
  coordinates?: { lat: number; lng: number };
}) {
  const coordsText = coordinates
    ? `Coordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
    : "Coordinates: lat, lng";

  return (
    <section className="px-4 pt-20 sm:px-6 lg:px-8">
      <SectionHeading>Map</SectionHeading>
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="grid h-40 w-full place-items-center rounded-2xl border-2 border-dashed border-[#1e3a5f]/20 bg-[#FFFDF8] sm:h-48">
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <PinIcon />
            <span className="font-mono">{coordsText}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-accent-soft"
      aria-hidden="true"
    >
      <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
