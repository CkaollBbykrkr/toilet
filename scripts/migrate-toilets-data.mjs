#!/usr/bin/env node
// Migrate PRD-schema data/toilets_30.json + optional carry-over entries from
// current data/toilets.json into a single data/toilets.json that matches the
// current lib/types.ts schema.
//
// Default behaviour: dry-run (prints stats, writes nothing).
// To commit: node scripts/migrate-toilets-data.mjs --write

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const NEW = JSON.parse(
  readFileSync(resolve(ROOT, "data/toilets_30.json"), "utf-8"),
);
const CURRENT = JSON.parse(
  readFileSync(resolve(ROOT, "data/toilets.json"), "utf-8"),
);

// =============================================================================
// CONFIG
// =============================================================================

const MERGE_RULES = {
  // Image overrides are curated local galleries with source attribution.
  // They keep the migration self-contained and avoid reverting back to
  // placeholders when data/toilets.json is regenerated from PRD data.
  "tokyo-haru-no-ogawa-transparent": {
    inlineOverride: {
      location: {
        place: "Haru-no-Ogawa Community Park",
        address: "5-68-1 Yoyogi, Shibuya City, Tokyo",
      },
      images: [
        {
          src: "/images/tokyo-transparent-toilet/cover.jpg",
          alt: "Night exterior of the transparent glass toilet glowing under trees in Haru-no-Ogawa Community Park",
          caption: "The colored glass restroom becomes a small lantern beneath the park canopy.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946442/haru-no-ogawa-community-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-transparent-toilet/interior-toilet.jpg",
          alt: "Toilet and sink visible through the transparent glass wall at Haru-no-Ogawa Community Park",
          caption: "A close view makes the restroom fixtures unmistakable inside the glass cube.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946442/haru-no-ogawa-community-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-transparent-toilet/day-glass-toilet.jpg",
          alt: "Daytime transparent glass pavilion with the toilet visible inside",
          caption: "In daylight, the transparent wall reveals the toilet and hand-wash fixtures before the door is locked.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946442/haru-no-ogawa-community-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-transparent-toilet/opaque-night.jpg",
          alt: "The glass walls of the transparent toilet turned opaque at night",
          caption: "When occupied, the glass switches from transparent to opaque for privacy.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946442/haru-no-ogawa-community-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-transparent-toilet/transparent-exterior.jpg",
          alt: "Transparent glass toilet pavilion in the park with fixtures visible through colored panels",
          caption: "The park-facing elevation keeps the restroom visually light while the fixtures remain legible.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946442/haru-no-ogawa-community-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
      ],
      designer: {
        portrait: "/images/tokyo-transparent-toilet/shigeru-ban.jpg",
        portraitCredit:
          "準建築人手札網站 Forgemind ArchiMedia / Wikimedia Commons",
        portraitSourceUrl:
          "https://commons.wikimedia.org/wiki/File:Shigeru_Ban_(3x4_cropped).jpg",
        portraitLicense: "CC BY 2.0",
        portraitLicenseUrl:
          "https://creativecommons.org/licenses/by/2.0/deed.en",
      },
      tags: ["Transparent", "Urban"],
    },
  },
  "norway-ureddplassen": {
    inlineOverride: {
      images: [
        {
          src: "/images/norway-ureddplassen/cover.jpg",
          alt: "Ureddplassen restroom pavilion glowing against snowy mountains",
          caption: "The wave-shaped public restroom sits at the Arctic coastal rest area.",
          photographer: "Steinar Skaar / Statens vegvesen via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/925879/uredd-rest-area-haugen-zohar-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-ureddplassen/twilight-building.jpg",
          alt: "Twilight view of the Ureddplassen restroom building below the mountains",
          caption: "Frosted glass and warm interior light make the service building part of the landscape.",
          photographer: "Steinar Skaar / Statens vegvesen via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/925879/uredd-rest-area-haugen-zohar-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-ureddplassen/coastal-restroom.jpg",
          alt: "Frosted-glass Ureddplassen public restroom beside the fjord",
          caption: "The restroom volume is framed by the fjord, mountains and concrete terrace.",
          photographer: "Steinar Skaar / Statens vegvesen via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/925879/uredd-rest-area-haugen-zohar-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-ureddplassen/wc-plan.jpg",
          alt: "Architectural floor plan of Ureddplassen showing the accessible toilet and service room",
          caption: "HZA's plan drawing identifies the WC layout and toilet fixture inside the wave-shaped building.",
          photographer: "Haugen/Zohar Arkitekter project drawing",
          sourceUrl: "https://www.hza.no/uredd",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-ureddplassen/memorial-benches.jpg",
          alt: "Marble memorial benches and sea view at Ureddplassen",
          caption: "The rest area pairs the restroom with a memorial terrace facing the sea.",
          photographer: "Steinar Skaar / Statens vegvesen via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/925879/uredd-rest-area-haugen-zohar-arkitekter",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "tokyo-yoyogi-fukamachi-transparent": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-yoyogi-fukamachi-transparent/cover.jpg",
          alt: "Transparent colored glass public toilet in Yoyogi Fukamachi Mini Park with fixtures visible inside",
          caption: "The three colored glass rooms reveal the toilets before the doors are locked.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946426/yoyogi-fukamachi-mini-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-fukamachi-transparent/interior-toilet.jpg",
          alt: "Close view of the Yoyogi Fukamachi transparent restroom with toilet and sink visible",
          caption: "The fixture layout is visible through the glass before the privacy mode activates.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946426/yoyogi-fukamachi-mini-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-fukamachi-transparent/night-transparent.jpg",
          alt: "Night view of Yoyogi Fukamachi transparent toilets glowing with visible toilet fixtures",
          caption: "At night, the transparent rooms read as lit objects in the park.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946426/yoyogi-fukamachi-mini-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-fukamachi-transparent/toilet-close.jpg",
          alt: "Open transparent restroom door showing a toilet and urinal inside",
          caption: "The open door gives a direct view of the urinal and toilet bay.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946426/yoyogi-fukamachi-mini-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-fukamachi-transparent/park-context.jpg",
          alt: "Transparent restroom pavilion set in Yoyogi Fukamachi Mini Park",
          caption: "The small pavilion sits beside play equipment and mature trees.",
          photographer: "Satoshi Nagare / The Nippon Foundation via ArchDaily",
          sourceUrl:
            "https://www.archdaily.com/946426/yoyogi-fukamachi-mini-park-toilet-shigeru-ban-architects",
          licenseStatus: "unknown",
        },
      ],
      tags: ["Transparent", "Urban"],
    },
  },
  "tokyo-urasando-marc-newson": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-urasando-marc-newson/cover.jpg",
          alt: "Urasando public toilet with copper roof and pale green door beneath an expressway",
          caption: "Marc Newson's compact restroom borrows from a traditional Japanese hut silhouette.",
          photographer: "Satoshi Nagare / The Nippon Foundation via Marc Newson Ltd",
          sourceUrl: "https://marc-newson.com/urasando-public-toilet/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-urasando-marc-newson/underpass-exterior.jpg",
          alt: "Three-quarter exterior view of the Urasando public toilet under the elevated road",
          caption: "Concrete walls, stone base and copper roof soften the awkward underpass site.",
          photographer: "Satoshi Nagare / The Nippon Foundation via Marc Newson Ltd",
          sourceUrl: "https://marc-newson.com/urasando-public-toilet/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-urasando-marc-newson/interior-urinals.jpg",
          alt: "Mint green interior corridor at Urasando with urinals and sink visible",
          caption: "The mint interior turns fixtures and circulation into one continuous molded surface.",
          photographer: "Satoshi Nagare / The Nippon Foundation via Marc Newson Ltd",
          sourceUrl: "https://marc-newson.com/urasando-public-toilet/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-urasando-marc-newson/access-room.jpg",
          alt: "Accessible toilet room at Urasando with toilet, sink and support rails visible",
          caption: "A direct view into the accessible room shows the toilet, sink and support rails.",
          photographer: "Satoshi Nagare / The Nippon Foundation via Marc Newson Ltd",
          sourceUrl: "https://marc-newson.com/urasando-public-toilet/",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "ichihara-toilet-in-nature": {
    inlineOverride: {
      images: [
        {
          src: "/images/ichihara-toilet-in-nature/cover.jpg",
          alt: "Glass-walled toilet cubicle in Ichihara with toilet and sink visible",
          caption: "The transparent cubicle places the toilet fixture inside a private fenced garden.",
          photographer: "Oona McGee / SoraNews24",
          sourceUrl:
            "https://soranews24.com/2021/08/10/worlds-most-spacious-public-toilet-baffles-the-mind-in-japan/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/ichihara-toilet-in-nature/glass-cubicle-path.jpg",
          alt: "Garden path leading to the glass toilet cubicle in Ichihara",
          caption: "A path through the garden leads to the single glass-walled toilet room.",
          photographer: "Oona McGee / SoraNews24",
          sourceUrl:
            "https://soranews24.com/2021/08/10/worlds-most-spacious-public-toilet-baffles-the-mind-in-japan/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/ichihara-toilet-in-nature/garden-entrance.jpg",
          alt: "Entrance gate framing the garden toilet enclosure in Ichihara",
          caption: "The enclosure turns a functional stop into a tiny landscape sequence.",
          photographer: "Oona McGee / SoraNews24",
          sourceUrl:
            "https://soranews24.com/2021/08/10/worlds-most-spacious-public-toilet-baffles-the-mind-in-japan/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/ichihara-toilet-in-nature/garden-wide.jpg",
          alt: "Wide view of the Ichihara garden enclosure and glass toilet cubicle",
          caption: "From farther back, the scale of the fenced private garden becomes clear.",
          photographer: "Oona McGee / SoraNews24",
          sourceUrl:
            "https://soranews24.com/2021/08/10/worlds-most-spacious-public-toilet-baffles-the-mind-in-japan/",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "nyc-bryant-park-restroom": {
    inlineOverride: {
      images: [
        {
          src: "/images/nyc-bryant-park-restroom/exterior-women-men.jpg",
          alt: "Beaux-Arts granite façade of the Bryant Park public restrooms with carved 'Women Men' inscription and visitors lined up at the entrance",
          caption: "The 1911 Carrère & Hastings restroom pavilion at Bryant Park's 42nd Street edge.",
          photographer: "Jane Kratochvil / Bryant Park Corporation",
          sourceUrl: "https://bryantpark.org",
          licenseStatus: "unknown",
        },
        {
          src: "/images/nyc-bryant-park-restroom/entry-foyer.jpg",
          alt: "Renovated entry foyer with men's and women's doorways flanking a tall mosaic-tiled niche that holds a vase of peonies",
          caption: "The 2017 renovation made the entry feel like a small flower-and-art lobby between the two restrooms.",
          photographer: "Jane Kratochvil / Bryant Park Corporation",
          sourceUrl: "https://bryantpark.org",
          licenseStatus: "unknown",
        },
        {
          src: "/images/nyc-bryant-park-restroom/urinals-interior.jpg",
          alt: "Interior of the men's restroom with wood-panelled urinal partitions, a vessel sink, framed watercolor and floral arrangement",
          caption: "Wood partitions screen the urinals; framed Bryant Park watercolours and fresh flowers complete the hospitality.",
          photographer: "Jane Kratochvil / Bryant Park Corporation",
          sourceUrl: "https://bryantpark.org",
          licenseStatus: "unknown",
        },
        {
          src: "/images/nyc-bryant-park-restroom/sink-detail.jpg",
          alt: "Close-up of a white vessel sink with a tall vase of pink lilies on a stone countertop",
          caption: "Vessel sinks, glass tile, and a single seasonal flower arrangement — staples of the renovated look.",
          photographer: "Jane Kratochvil / Bryant Park Corporation",
          sourceUrl: "https://bryantpark.org",
          licenseStatus: "unknown",
        },
        {
          src: "/images/nyc-bryant-park-restroom/twin-sinks-arched-window.jpg",
          alt: "Two vessel sinks under an arched fanlight window, mirror-symmetric beneath a vase of tulips",
          caption: "The arched window over twin sinks echoes the building's Beaux-Arts proportions.",
          photographer: "Jane Kratochvil / Bryant Park Corporation",
          sourceUrl: "https://bryantpark.org",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "london-sketch-egg-pods": {
    inlineOverride: {
      images: [
        {
          src: "/images/london-sketch-egg-pods/egg-pods.jpg",
          alt: "Five large white egg-shaped pod toilets lined up under a rainbow grid skylight at Sketch London",
          caption: "India Mahdavi's pods stand beneath the building's stained-glass dome — possibly the most-photographed bathroom in London.",
          photographer: "TheSmartLocal (editorial)",
          sourceUrl: "https://thesmartlocal.com",
          licenseStatus: "unknown",
        },
        {
          src: "/images/london-sketch-egg-pods/sink-pods.jpg",
          alt: "Soft-pink Sketch restroom interior with two pedestal sinks, round mirrors, and the egg pod entrances visible to either side",
          caption: "In front of the pods, Victorian-style pedestal sinks sit against the futuristic capsule walls.",
          photographer: "TheSmartLocal (editorial)",
          sourceUrl: "https://thesmartlocal.com",
          licenseStatus: "unknown",
        },
        {
          src: "/images/london-sketch-egg-pods/entrance.jpg",
          alt: "Approach to the Sketch pod restroom area, framed by the white capsule wall with a view back into the East Bar",
          caption: "The white capsule entrance frames a glimpse back into Sketch's East Bar.",
          photographer: "Sketch London (press)",
          sourceUrl: "https://sketch.london",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "kawakawa-hundertwasser-toilets": {
    inlineOverride: {
      images: [
        {
          src: "/images/kawakawa-hundertwasser-toilets/mosaic-exterior.jpg",
          alt: "The vivid mosaic and undulating tiled facade of the Hundertwasser Toilets on Gillies Street, Kawakawa",
          caption: "Hundertwasser's final completed work — the most photographed public toilet in New Zealand.",
          photographer: "Petr Kraus",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Friedensreich_Hundertwasser%27s_public_toilets_in_Kawakawa_1.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/kawakawa-hundertwasser-toilets/mens-urinals.jpg",
          alt: "Curved corridor with mosaic-tiled walls leading into the men's urinal area with embedded coloured glass",
          caption: "The men's wing curves through a tiled corridor toward urinals lined with hand-cut ceramic and glass.",
          photographer: "Andy king50",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Kawakawa_mens_toilet_12_12_2011.JPG",
          licenseStatus: "cc",
          license: "CC BY-SA 3.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        },
        {
          src: "/images/kawakawa-hundertwasser-toilets/interior-womens.jpg",
          alt: "Interior of the women's restroom with cubicle doors, mosaic-clad columns and irregular tilework",
          caption: "Inside the women's wing — cubicle doors framed by Hundertwasser's irregular mosaic columns.",
          photographer: "Pseudopanax",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Inside_women%27s_toilet.jpg",
          licenseStatus: "cc",
          license: "CC0",
          licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        },
        {
          src: "/images/kawakawa-hundertwasser-toilets/interior-sink.jpg",
          alt: "Interior view showing the basin and mosaic-tiled wash area lit by a coloured skylight",
          caption: "A wash basin under one of Hundertwasser's signature coloured-glass skylights.",
          photographer: "Andrew Turner",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Hundertwasser_Toilets,_Kawakawa_-_interior.jpg",
          licenseStatus: "cc",
          license: "CC BY 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
        },
        {
          src: "/images/kawakawa-hundertwasser-toilets/bottle-wall.jpg",
          alt: "Recycled glass bottles embedded into a tiled wall — one of Hundertwasser's signature flourishes",
          caption: "The community's spent glass bottles, embedded into the walls as decorative detail.",
          photographer: "Andrew Turner",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Hundertwasser_Toilets,_Kawakawa_-_Bottle_Wall.jpg",
          licenseStatus: "cc",
          license: "CC BY 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
        },
      ],
    },
  },
  "turkey-ephesus-latrines": {
    inlineOverride: {
      images: [
        {
          src: "/images/turkey-ephesus-latrines/marble-bench-panorama.jpg",
          alt: "Panoramic view of the long marble bench of the Ephesus public latrine, with rows of keyhole openings running along the wall",
          caption: "The signature marble bench wraps three sides of the latrine's courtyard, near the Scholastica Baths.",
          photographer: "Carole Raddato",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Latrines,_Ephesus,_Turkey_(22517022264).jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        },
        {
          src: "/images/turkey-ephesus-latrines/keyhole-seats-detail.jpg",
          alt: "Close-up of the marble bench showing the distinctive keyhole-shaped seat openings cut into the stone",
          caption: "The keyhole openings, cut at roughly hip height, are the latrine's signature detail.",
          photographer: "Yair Haklai",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Latrinae_in_Ephesus.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/turkey-ephesus-latrines/drainage-channel.jpg",
          alt: "Detail of the marble bench and the running-water drainage channel beneath, which carried waste and provided water for cleaning",
          caption: "Below the seats, a continuous water channel carried waste away — a hallmark of Roman sanitary engineering.",
          photographer: "Carole Raddato",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Latrines,_Ephesus,_Turkey_(23151316351).jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        },
        {
          src: "/images/turkey-ephesus-latrines/bench-corner.jpg",
          alt: "Corner of the U-shaped marble bench at the Ephesus latrines, near the Scholastica Baths",
          caption: "Two arms of the U-shaped bench meet at the corner of the courtyard.",
          photographer: "Dick Osseman",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Ephesus_Latrines_at_Scholastica_Baths_iin_2011_3803.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/turkey-ephesus-latrines/seats-context.jpg",
          alt: "The latrine seats arranged around three sides of the colonnaded courtyard, with the fresh-water channel visible in front",
          caption: "The colonnaded courtyard once held a central pool — the latrine was a social space, not a private one.",
          photographer: "Aleksandr Kucherov",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Latrineephesus2.jpg",
          licenseStatus: "cc",
          license: "CC BY 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        },
      ],
    },
  },
  "uk-hampton-court-great-house-of-easement": {
    inlineOverride: {
      images: [
        {
          src: "/images/uk-hampton-court-great-house-of-easement/garderobe-extant.jpg",
          alt: "Surviving Tudor garderobe at Hampton Court Palace: a small wooden toilet seat with a circular hole, beside a wall plaque about Henry VIII's conversion of the space",
          caption: "A surviving single garderobe at Hampton Court, converted from a Wolsey-era staircase under Henry VIII. The Great House of Easement itself — a much larger communal version — no longer survives above ground.",
          photographer: "Robin Sones / Geograph",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Garderobe,_Hampton_Court_Palace_-_geograph.org.uk_-_3775486.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        },
        {
          src: "/images/uk-hampton-court-great-house-of-easement/gatehouse-context.jpg",
          alt: "The Tudor Great Gatehouse of Hampton Court Palace and the moat bridge with King's Beasts statues",
          caption: "The Great Gatehouse and moat at Hampton Court — the Great House of Easement once stood to the right, extending over the moat itself.",
          photographer: "James Park-Watt",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Hampton_Court_Palace_20120224.JPG",
          licenseStatus: "cc",
          license: "CC BY-SA 3.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        },
        {
          src: "/images/uk-hampton-court-great-house-of-easement/close-stool.jpg",
          alt: "Royal upholstered close stool of King William III on display at Hampton Court, showing the velvet-and-sheepskin lid raised",
          caption: "A later William III close stool displayed at the palace — illustrative of royal-toilet furniture, contrasting with the communal benches of the Great House of Easement.",
          photographer: "Diagram Lajard",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Klo_Hampton_Court.JPG",
          licenseStatus: "cc",
          license: "CC0",
          licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        },
      ],
    },
  },
};

const CARRY_OVER = [];

// Patches for carried-over entries — kept as a hook for future manually curated
// records that should survive a migration.
const CARRY_OVER_PATCH = {};

const REGION_REMAP = {
  Americas: "North America",
};

// First-match-wins. Order matters: more specific / dominant topics first.
// "accessibility" wins over "cost" when both keywords appear (e.g.
// "Free, fully wheelchair accessible" → Accessibility, not Cost).
// "photo" wins over "timing" when both appear ("Photographs best mid-morning"
// → Photo Tips, not Best Time).
const TIP_RULES = [
  [
    "accessibility",
    /\b(wheelchair|accessible|step.?free|ostomate|stoma|disabled|barrier.?free|ramp)\b/i,
    "Accessibility",
    "accessibility",
  ],
  [
    "photo",
    /\b(photo(?:s|graph(?:ed|s|er|ing|ic)?)?|instagram|viral|angle|composition|filmed|filming|film|movie|featured in|appears in|cinema|photogenic)\b/i,
    "Photo Tips",
    "camera",
  ],
  [
    "cost",
    /\b(free|admission|tickets?|fee|book(?:ing)?|reserve|paid entry|customer|charge|members?|visiting hours|opening hours)\b/i,
    "Cost & Booking",
    "ticket",
  ],
  [
    "getting-there",
    /\b(walk(?:ing)? from|minutes? walk|short walk|walk to|station|metro|tube|driving|drive|train|bus|flight|airport|highway|reach|access by|by car|by train|by foot|exit|Fv\d+|Address(?=:)|Located (?:in|on|at))\b/i,
    "Getting There",
    "location",
  ],
  [
    "timing",
    /\b(mornings?|afternoons?|midday|sunrise|sunset|dusk|dawn|evenings?|nights?|nighttime|midnight|noon|daylight|after dark|golden hour|spring|summer|autumn|fall|winter|seasons?|seasonally|cherry blossom|aurora|northern lights|midnight sun|year-round)\b/i,
    "Best Time",
    "time",
  ],
  [
    "privacy",
    /\b(opaque|private|privacy|frosted|when locked|locked stall)\b/i,
    "Privacy",
    "privacy",
  ],
];

const TIP_FALLBACK = { title: "Good to Know", icon: "info" };

// =============================================================================
// TRANSFORMS
// =============================================================================

function classifyTip(text) {
  for (const [, regex, title, icon] of TIP_RULES) {
    if (regex.test(text)) return { title, description: text, icon };
  }
  return { title: TIP_FALLBACK.title, description: text, icon: TIP_FALLBACK.icon };
}

// Deterministic PRNG (mulberry32) — same seed → same shuffle every migration.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Region-interleaved shuffle:
//   1. Group entries by region
//   2. Shuffle each group internally (Fisher-Yates, seeded)
//   3. Round-robin: each round picks one from each non-empty region,
//      sorted by remaining count desc — so the biggest region spreads
//      evenly across the whole array instead of clustering at the end.
function shuffleByRegion(entries, seed) {
  const rng = mulberry32(seed);
  const groups = {};
  for (const t of entries) {
    const r = t.region ?? "_other";
    (groups[r] ??= []).push(t);
  }
  for (const r of Object.keys(groups)) {
    const arr = groups[r];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  const order = [];
  while (Object.values(groups).some((a) => a.length > 0)) {
    const active = Object.keys(groups)
      .filter((r) => groups[r].length > 0)
      .sort((a, b) => groups[b].length - groups[a].length || a.localeCompare(b));
    for (const r of active) order.push(groups[r].shift());
  }
  return order;
}

const SHUFFLE_SEED = 42;

function parseCredit(credit) {
  if (!credit) return {};
  const stripped = String(credit).replace(/^Photo:\s*/i, "").trim();
  if (!stripped) return {};
  return { photographer: stripped };
}

function transform(prdEntry) {
  const out = {
    slug: prdEntry.id,
    name: prdEntry.name,
    region: prdEntry.region,
    location: {
      country: prdEntry.country,
      city: prdEntry.city,
      coordinates: prdEntry.coordinates,
    },
    year: prdEntry.yearBuilt,
    tagline: prdEntry.tagline,
    description: prdEntry.story,
    styles: prdEntry.designStyles,
    features: prdEntry.features,
    visitorTips: (prdEntry.visitorTips ?? []).map(classifyTip),
    images: (prdEntry.images ?? []).map((img) => ({
      src: img.src,
      alt: img.alt,
      ...parseCredit(img.credit),
      licenseStatus: "pending",
    })),
    sources: prdEntry.sources,
  };

  if (prdEntry.nameLocal) out.nameLocal = prdEntry.nameLocal;

  const designerObj = {};
  if (prdEntry.designer) designerObj.name = prdEntry.designer;
  if (prdEntry.architectFirm) designerObj.firm = prdEntry.architectFirm;
  if (Object.keys(designerObj).length > 0) out.designer = designerObj;

  const practical = {};
  if (prdEntry.openingHours) practical.openingHours = prdEntry.openingHours;
  if (prdEntry.fee) practical.fee = prdEntry.fee;
  // PRD stores accessibility as boolean (true/false). Convert to a short
  // human-readable string so PracticalInfo.accessibility stays `string`.
  if (typeof prdEntry.accessibility === "boolean") {
    practical.accessibility = prdEntry.accessibility
      ? "Wheelchair accessible"
      : "Not wheelchair accessible";
  } else if (prdEntry.accessibility) {
    practical.accessibility = prdEntry.accessibility;
  }
  if (Object.keys(practical).length > 0) out.practical = practical;

  const derivedTags = [out.styles?.[0], out.features?.[0]]
    .filter(Boolean)
    .slice(0, 2);
  if (derivedTags.length > 0) out.tags = derivedTags;

  // Ensure images[0] is the cover (PRD has a separate coverImage pointer)
  if (prdEntry.coverImage && out.images.length > 0) {
    const idx = out.images.findIndex((i) => i.src === prdEntry.coverImage);
    if (idx > 0) {
      const [c] = out.images.splice(idx, 1);
      out.images.unshift(c);
    }
  }

  return out;
}

function applyMergeRules(entry, rule, currentBySlug) {
  if (!rule) return entry;
  let merged = { ...entry };

  // (1) Pull fields from a current entry by slug (used when there's
  // committed data we want to preserve verbatim).
  const sourceSlug =
    rule.preserveImagesFromCurrent ??
    rule.preserveDesignerPortraitFromCurrent ??
    rule.preserveTagsFromCurrent;
  if (sourceSlug) {
    const src = currentBySlug[sourceSlug];
    if (!src) {
      console.warn(
        `MERGE_RULES: source slug "${sourceSlug}" not in current data`,
      );
    } else {
      if (rule.preserveImagesFromCurrent && src.images) {
        merged.images = src.images;
      }
      if (rule.preserveDesignerPortraitFromCurrent && src.designer) {
        merged.designer = {
          ...merged.designer,
          ...(src.designer.portrait && { portrait: src.designer.portrait }),
          ...(src.designer.portraitCredit && {
            portraitCredit: src.designer.portraitCredit,
          }),
          ...(src.designer.portraitSourceUrl && {
            portraitSourceUrl: src.designer.portraitSourceUrl,
          }),
          ...(src.designer.portraitLicense && {
            portraitLicense: src.designer.portraitLicense,
          }),
          ...(src.designer.portraitLicenseUrl && {
            portraitLicenseUrl: src.designer.portraitLicenseUrl,
          }),
          bio: merged.designer?.bio ?? src.designer.bio,
        };
      }
      if (rule.preserveTagsFromCurrent && src.tags) merged.tags = src.tags;
    }
  }

  // (2) Apply hard-coded inline overrides (self-contained, doesn't depend
  // on the current data file's state — safer for re-runs).
  if (rule.inlineOverride) {
    const o = rule.inlineOverride;
    if (o.location) {
      merged.location = { ...merged.location, ...o.location };
    }
    if (o.designer) {
      merged.designer = { ...merged.designer, ...o.designer };
    }
    for (const k of Object.keys(o)) {
      if (k !== "location" && k !== "designer") {
        merged[k] = o[k];
      }
    }
  }

  return merged;
}

function fixRegion(entry) {
  if (REGION_REMAP[entry.region]) {
    return { ...entry, region: REGION_REMAP[entry.region] };
  }
  return entry;
}

// =============================================================================
// MAIN
// =============================================================================

const currentBySlug = Object.fromEntries(CURRENT.map((t) => [t.slug, t]));

const migrated = NEW.map((prdEntry) => {
  const transformed = transform(prdEntry);
  return applyMergeRules(
    transformed,
    MERGE_RULES[transformed.slug],
    currentBySlug,
  );
});

const carried = CARRY_OVER.map((slug) => {
  const entry = currentBySlug[slug];
  if (!entry) throw new Error(`CARRY_OVER slug not in current data: ${slug}`);
  const regionFixed = fixRegion(entry);
  const patch = CARRY_OVER_PATCH[slug];
  return patch ? { ...regionFixed, ...patch } : regionFixed;
});

const combined = [...migrated, ...carried];
const final = shuffleByRegion(combined, SHUFFLE_SEED);

// =============================================================================
// REPORT
// =============================================================================

console.log(`\n=== Migration summary ===`);
console.log(`Migrated entries:    ${migrated.length}`);
console.log(`Carried-over:        ${carried.length}`);
console.log(`Total:               ${final.length}`);
console.log(`Merge rules applied: ${Object.keys(MERGE_RULES).length}`);

console.log(`\n=== Tip classification (migrated entries only) ===`);
const tipStats = {};
let totalTips = 0;
migrated.forEach((t) =>
  (t.visitorTips ?? []).forEach((tip) => {
    tipStats[tip.title] = (tipStats[tip.title] ?? 0) + 1;
    totalTips++;
  }),
);
Object.entries(tipStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) =>
    console.log(
      `  ${k.padEnd(20)} ${String(v).padStart(3)}  (${((v / totalTips) * 100).toFixed(0)}%)`,
    ),
  );
console.log(`  ${"TOTAL".padEnd(20)} ${String(totalTips).padStart(3)}`);

console.log(`\n=== Region distribution (final dataset) ===`);
const regionStats = {};
final.forEach((t) => {
  regionStats[t.region] = (regionStats[t.region] ?? 0) + 1;
});
Object.entries(regionStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k.padEnd(18)} ${v}`));

console.log(`\n=== Tips that fell to "Good to Know" (review for missed categories) ===`);
let fallbackCount = 0;
migrated.forEach((t) =>
  (t.visitorTips ?? []).forEach((tip) => {
    if (tip.title === "Good to Know") {
      fallbackCount++;
      console.log(`  [${t.slug}] "${tip.description}"`);
    }
  }),
);
console.log(`Total fallback: ${fallbackCount} / ${totalTips} (${((fallbackCount / totalTips) * 100).toFixed(0)}%)`);

if (WRITE) {
  const outPath = resolve(ROOT, "data/toilets.json");
  writeFileSync(outPath, JSON.stringify(final, null, 2) + "\n", "utf-8");
  console.log(`\n✅ Wrote ${outPath}`);
} else {
  console.log(`\n[dry-run] Re-run with --write to commit changes to data/toilets.json`);
}
