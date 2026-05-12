import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllToilets } from "@/lib/toilets";

export const metadata: Metadata = {
  title: "About · Toilet Atlas",
  description:
    "A field guide to the loo — what this is, how entries get in, who to credit, and how to help fill the gaps.",
};

function computeStats() {
  const toilets = getAllToilets();
  const regions = new Set<string>();
  const countries = new Set<string>();
  const photographers = new Set<string>();
  let portraits = 0;
  let fullGallery = 0;

  for (const t of toilets) {
    if (t.region) regions.add(t.region);
    countries.add(t.location.country);
    if (t.designer?.portrait) portraits++;
    if (t.images.length >= 5) fullGallery++;
    for (const im of t.images) {
      if (im.photographer) photographers.add(im.photographer);
    }
  }
  return {
    total: toilets.length,
    regions: regions.size,
    countries: countries.size,
    photographers: photographers.size,
    portraits,
    fullGallery,
  };
}

export default function AboutPage() {
  const stats = computeStats();

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pb-2 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          About the Atlas
        </p>
        <h1 className="mt-5 font-serif text-[44px] leading-[1.02] text-heading sm:text-[60px] lg:text-[68px]">
          A field guide to the loo.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#243447] sm:text-lg">
          An editorial atlas of public toilets worth the detour — by architects,
          for travelers, in the most overlooked room in the building.
        </p>
      </section>

      {/* Section index */}
      <nav className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-xs uppercase tracking-wider text-muted sm:px-6 lg:px-8">
        {[
          ["#mission", "Mission"],
          ["#methodology", "Methodology"],
          ["#stats", "By the numbers"],
          ["#region-gaps", "What's missing"],
          ["#acknowledgements", "Credits"],
          ["#contribute", "Send us a toilet"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="transition-colors hover:text-heading"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="mx-auto max-w-3xl space-y-24 px-4 py-24 sm:px-6 lg:px-8">
        {/* Mission */}
        <section id="mission" className="scroll-mt-24">
          <SectionHeading align="left">What this is</SectionHeading>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
            <p>
              {`This started as a saved-search problem. A folder of bookmarks — a Kengo Kuma forest pavilion in Yoyogi, a Hundertwasser shrine in Kawakawa, a 2,000-year-old marble bench in Ephesus — that didn't belong to any one travel list. The common thread was the toilet. So we made the list.`}
            </p>
            <p>
              Toilet Atlas catalogues public toilets that earn the catalogue.
              Sometimes the reason is architectural — a named designer, a
              published commission, a building that critics took seriously.
              Sometimes it is civic, or historical, or simply strange. A gold
              one was bolted to a wall at the Guggenheim and later stolen in
              Oxfordshire. That counts.
            </p>
            <p>
              The project is for travelers, designers, and anyone who has ever
              paused outside a public restroom and thought: someone designed
              this on purpose. Yes, it is a website about toilets. The
              seriousness is the point.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="scroll-mt-24">
          <SectionHeading align="left">How entries get in</SectionHeading>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
            <p>
              An entry needs at least one of four things: a named designer with
              a defensible body of work, documented cultural or religious
              significance, a place in the history of sanitation, or coverage
              in credible press. Most entries clear two of those bars. A few —
              the older or more anonymous public conveniences — clear one and
              are noted as such. We would rather list a great loo with a thin
              paper trail than pretend the paper trail is thicker than it is.
            </p>
            <p>
              {`Photography is sourced from Wikimedia Commons under explicit Creative Commons licenses, from institutional press kits (the Tokyo Toilet Project, Nasjonale turistveger), from architects' and operators' official sites with attribution, and from editorial coverage with a clear `}
              <code className="rounded bg-[#1e3a5f]/[0.06] px-1.5 py-0.5 text-[0.9em] text-heading">
                sourceUrl
              </code>
              {` on every image. Where a designer portrait does not exist or cannot be cleanly licensed, the entry says so.`}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="scroll-mt-24">
          <SectionHeading align="left">By the numbers</SectionHeading>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
            <p>
              The catalogue grows in irregular bursts — a research afternoon
              yields three new Norwegian rest stops, or a single Shibuya
              weekend adds four Tokyo Toilet Project entries at once. The
              figures below are computed live from the dataset, so they update
              the moment a new toilet lands. Treat them as a snapshot, not a
              scoreboard. The more interesting number is always the next one.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat n={stats.total} label="Toilets catalogued" />
            <Stat n={stats.regions} label="Continents" />
            <Stat n={stats.countries} label="Countries" />
            <Stat n={stats.photographers} label="Photographers credited" />
            <Stat n={stats.portraits} label="Designer portraits" />
            <Stat n={stats.fullGallery} label="Galleries ≥5 photos" />
          </div>
        </section>

        {/* Region Gaps */}
        <section id="region-gaps" className="scroll-mt-24">
          <SectionHeading align="left">{`What's missing`}</SectionHeading>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
            <p>
              The current catalogue leans heavily on Asia and Europe, with a
              thin presence in North America and a single entry in Oceania.
              South America and Africa are not yet represented. That is a gap,
              not a position.
            </p>
            <p>
              {`Obvious candidates we have not yet been able to document properly: the public conveniences inside Cape Town's V&A Waterfront and the older Victorian-era loos of central Johannesburg; the modernist park toilets of Buenos Aires's Bosques de Palermo; Diébédo Francis Kéré's sanitation work in Burkina Faso; the increasingly photographed eco-toilets around Kigali's Nyandungu wetland; and São Paulo's MASP, which has hosted more interesting public-restroom design than its press has caught up with. If you live near one of these — or know a designer working on one — please write. This is the part where the atlas needs help.`}
            </p>
          </div>
        </section>

        {/* Acknowledgements */}
        <section id="acknowledgements" className="scroll-mt-24">
          <SectionHeading align="left">Credits and gratitude</SectionHeading>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
            <p>
              No catalogue of this kind is built alone. A handful of
              institutions, photographers, and open-license contributors are
              responsible for the bulk of what you see here, and the project
              would not exist in any honest form without them. Every image on
              every entry page carries a per-photo credit and source URL —
              what follows is the wider thank-you.
            </p>
            <ul className="space-y-3 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                <span>
                  The Tokyo Toilet Project and The Nippon Foundation, and
                  photographer Satoshi Nagare, whose press archive accounts
                  for roughly fifty images across more than a dozen Shibuya
                  entries.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                <span>
                  Nasjonale turistveger and Statens vegvesen in Norway — and
                  photographers Roger Ellingsen, Steinar Skaar, Jarle Wæhler
                  and Frid-Jorunn Stabell — for roughly twenty-five
                  photographs across the Norwegian Scenic Route rest stops.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                <span>
                  The Wikimedia Commons community, for openly licensed
                  portraits and site photography of Friedensreich
                  Hundertwasser, Marc Newson, Shigeru Ban, Sou Fujimoto, Tadao
                  Ando, Kengo Kuma, Toyo Ito, NIGO, Bindeshwar Pathak, and
                  Kjetil Trædal Thorsen.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                <span>
                  The Restroom Association of Singapore, for the Marina Bay
                  Sands six-star gallery.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                <span>
                  X+Living and SFAP, for documentation of the Deji Plaza
                  themed washrooms.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
                <span>
                  Architectural and design press — ArchDaily, Dezeen, IFDM,
                  and Hi设计, whose Chinese-language coverage of Deji Plaza
                  remains the most thorough on record.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted">
              For full per-image attribution, see the gallery captions on each entry.
            </p>
          </div>
        </section>

        {/* Contribute */}
        <section id="contribute" className="scroll-mt-24">
          <SectionHeading align="left">Send us a toilet</SectionHeading>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-[#243447] sm:text-[17px] sm:leading-[1.75]">
            <p>
              There is no submission form yet — that page is on the build
              list. Until it ships, the door is open by email or social:{" "}
              <a
                href="mailto:hello@toiletatlas.example"
                className="text-heading underline decoration-accent-soft underline-offset-4 transition-colors hover:decoration-heading"
              >
                hello@toiletatlas.example
              </a>
              , or @toiletatlas on the usual networks. Both are placeholders
              until the proper form lands, and both are read.
            </p>
            <p>
              A good submission is small and specific: one or two photographs
              you took or have rights to, a short note on where it is, and a
              sentence on why it matters. Design pedigree helps. So does a
              strange tile, a civic backstory, or a memorable view from the
              seat. For the technically inclined, the dataset lives in a
              public GitHub repo — issues and pull requests are welcome, and
              adding an entry is a single JSON object plus a folder of images.
            </p>
            <p className="font-serif text-lg italic text-heading">
              We read every one. Toilets are universal.
            </p>
          </div>
        </section>

        <div className="border-t border-[#1e3a5f]/10 pt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted transition-colors hover:text-heading"
          >
            Back to the atlas
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-2xl border border-[#1e3a5f]/10 bg-[#FFFDF8] p-5 text-center">
      <div className="font-serif text-4xl text-heading sm:text-5xl">{n}</div>
      <div className="mt-2 text-[11px] uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}
