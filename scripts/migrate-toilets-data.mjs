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
// Extras: entries authored outside the PRD source (already in final Toilet
// shape). Optional — missing file is treated as empty.
let EXTRAS = [];
try {
  EXTRAS = JSON.parse(
    readFileSync(resolve(ROOT, "data/toilets-extras.json"), "utf-8"),
  );
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}

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
          designer: {
        portrait: "/images/norway-ureddplassen/hza-cofounder.jpg",
        portraitCredit: "Haugen/Zohar Arkitekter (studio page)",
        portraitSourceUrl: "https://www.hza.no/studio",
      },
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
          designer: {
        portrait: "/images/tokyo-transparent-toilet/shigeru-ban.jpg",
        portraitCredit: "準建築人手札網站 Forgemind ArchiMedia via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Shigeru_Ban_(3x4_cropped).jpg",
        portraitLicense: "CC BY 2.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by/2.0/deed.en",
      },
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
          designer: {
        portrait: "/images/tokyo-urasando-marc-newson/marc-newson.jpg",
        portraitCredit: "Financial Times via Flickr / Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Marc_Newson_(cropped).jpg",
        portraitLicense: "CC BY 2.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      },
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
          designer: {
        portrait: "/images/ichihara-toilet-in-nature/sou-fujimoto.jpg",
        portraitCredit: "j.tobias / sumikaproject via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Sou_Fujimoto_2009.jpg",
        portraitLicense: "CC BY 2.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      },
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
          designer: {
        portrait: "/images/nyc-bryant-park-restroom/jennifer-nitzky.jpg",
        portraitCredit: "Studio HIP (headshot)",
        portraitSourceUrl: "https://www.studiohip.nyc/jennifer-nitzky",
      },
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
          designer: {
        portrait: "/images/london-sketch-egg-pods/india-mahdavi.jpg",
        portraitCredit: "Noor Chalhoub via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:India_Mahdavi-7033.jpg",
        portraitLicense: "CC BY-SA 4.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
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
          designer: {
        portrait: "/images/kawakawa-hundertwasser-toilets/friedensreich-hundertwasser.jpg",
        portraitCredit: "Hannes Grobe via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Hundertwasser_nz_1998_hg.jpg",
        portraitLicense: "CC BY-SA 2.5",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
      },
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
  "tokyo-yoyogi-hachiman-mushrooms": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-yoyogi-hachiman-mushrooms/cover.jpg",
          alt: "Three mushroom-shaped concrete toilet volumes by Toyo Ito at Yoyogi-Hachiman, each topped with a dome roof",
          caption: "Toyo Ito's three cylindrical volumes sprout from the grove behind the Yoyogi-Hachiman shrine — one central accessible stall, two flanking.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/yoyogi_hachiman/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-hachiman-mushrooms/universal-stall.jpg",
          alt: "Inside the universal accessible stall with toilet, grab rails and washbasin under the curved dome roof",
          caption: "Inside the universal toilet, the dome roof curves over the white fixtures and the clerestory band of frosted glass.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/yoyogi_hachiman/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-hachiman-mushrooms/tile-detail.jpg",
          alt: "Close-up of the gradated round-tile mosaic wrapping the mushroom volumes",
          caption: "Hand-cut round tiles, applied in a soft gradient, give the cylindrical walls a mushroom-cap texture.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/yoyogi_hachiman/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-hachiman-mushrooms/dome-detail.jpg",
          alt: "The dome roof floating over the cylindrical stall on a continuous frosted-glass clerestory",
          caption: "The dome appears to hover, separated from the cylinder by a continuous ribbon of frosted glass.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/yoyogi_hachiman/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-yoyogi-hachiman-mushrooms/night.jpg",
          alt: "The three mushroom volumes illuminated at night within the wooded grove",
          caption: "After dark, the three mushrooms glow softly within the Yoyogi-Hachiman grove.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/yoyogi_hachiman/",
          licenseStatus: "unknown",
        },
      ],
      designer: {
        portrait: "/images/tokyo-yoyogi-hachiman-mushrooms/toyo-ito.jpg",
        portraitCredit: "Jerome Tobias via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Toyo_Ito_2009.jpg",
        portraitLicense: "CC BY 2.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      },
    },
  },
  "tokyo-jingu-dori-amayadori": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-jingu-dori-amayadori/cover.jpg",
          alt: "Tadao Ando's Amayadori cylindrical louvered concrete structure with circular roof at Jingu-Dori Park",
          caption: "Tadao Ando's 'Amayadori' (rain shelter) — a cylindrical louvered concrete drum capped by a thin floating disc.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/jingu-dori_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-jingu-dori-amayadori/interior-detail.jpg",
          alt: "Inside the accessible stall: white toilet with grab rails, washbasin, mirror and child fixtures",
          caption: "Inside the universal stall — fixtures arrayed around the perimeter of the cylinder.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/jingu-dori_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-jingu-dori-amayadori/cylinder-exterior.jpg",
          alt: "Vertical view of the cylindrical louvered concrete drum among the park trees",
          caption: "From the side, the vertical concrete louvers become the building's full envelope.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/jingu-dori_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-jingu-dori-amayadori/engawa-walkway.jpg",
          alt: "The engawa perimeter walkway between the outer louvers and the inner stall volumes",
          caption: "The engawa — a traditional Japanese veranda — wraps between louvered shell and inner stalls.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/jingu-dori_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-jingu-dori-amayadori/roof-detail.jpg",
          alt: "Detail of the circular cantilevered roof above the vertical concrete louvers",
          caption: "The roof reads as a thin circular disc cantilevered over the louvered cylinder below.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/jingu-dori_park/",
          licenseStatus: "unknown",
        },
      ],
      designer: {
        portrait: "/images/tokyo-jingu-dori-amayadori/tadao-ando.jpg",
        portraitCredit: "Christopher Schriner via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Tadao_Ando_2004.jpg",
        portraitLicense: "CC BY-SA 2.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      },
    },
  },
  "tokyo-nabeshima-walk-in-the-woods": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-nabeshima-walk-in-the-woods/cover.jpg",
          alt: "Kengo Kuma's five cedar-louvre clad huts connected by a stepped walkway through Nabeshima Shoto Park",
          caption: "Kuma's 'A Walk in the Woods' — five cedar-louvre huts threaded together by a stepped walkway through the park.",
          photographer: "Satoshi Nagare via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nabesima_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nabeshima-walk-in-the-woods/interior-stall.jpg",
          alt: "Hut interior with toilet, washbasin and live-edge cedar mirror frames; window opens onto park trees",
          caption: "Inside one of the huts: white toilet, washbasin and live-edge cedar mirror frames, with the park trees framed in the window.",
          photographer: "Satoshi Nagare via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nabesima_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nabeshima-walk-in-the-woods/accessible-interior.jpg",
          alt: "Accessible hut interior with a wall of cedar log-slice rounds, toilet and washbasin",
          caption: "The accessible hut features a wall of cedar log-slice rounds behind the toilet and basin.",
          photographer: "Satoshi Nagare via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nabesima_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nabeshima-walk-in-the-woods/huts-path.jpg",
          alt: "Cedar-clad huts glimpsed through the surrounding park trees",
          caption: "The five huts surface and recede among the trees of Nabeshima Shoto Park.",
          photographer: "Satoshi Nagare via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nabesima_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nabeshima-walk-in-the-woods/path-night.jpg",
          alt: "The illuminated cedar-louvre walkway between the five huts at dusk",
          caption: "After dark, the cedar walkway between the huts glows softly between the trees.",
          photographer: "Satoshi Nagare via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nabesima_park/",
          licenseStatus: "unknown",
        },
      ],
      designer: {
        portrait: "/images/tokyo-nabeshima-walk-in-the-woods/kengo-kuma.jpg",
        portraitCredit: "MEXT Japan via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Kengo_Kuma_20190530.jpg",
        portraitLicense: "CC BY 4.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      },
    },
  },
  "nyc-america-cattelan-gold-toilet": {
    inlineOverride: {
      images: [
        {
          src: "/images/nyc-america-cattelan-gold-toilet/cover.jpg",
          alt: "Top-down view of Maurizio Cattelan's 'America' (2016) — the fully functioning 18-karat gold toilet at the Guggenheim Museum",
          caption: "Top-down view of 'America' (2016) — a fully functioning 18-karat gold toilet, installed at the Guggenheim Museum's fifth-floor restroom.",
          photographer: "MossAlbatross via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:America_(Cattelan)_top_view.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/nyc-america-cattelan-gold-toilet/gold-bowl-detail.jpg",
          alt: "Side view of the 18-karat gold toilet bowl in its plain bathroom enclosure at the Guggenheim",
          caption: "Cattelan installed the gold toilet in a working public restroom, not on a plinth — visitors used it.",
          photographer: "MossAlbatross via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:America_(Cattelan)_side_view.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/nyc-america-cattelan-gold-toilet/guggenheim-installation.jpg",
          alt: "Installation view inside the Guggenheim restroom that housed 'America'",
          caption: "The gold toilet in its working bathroom setting at the Guggenheim, September 2016.",
          photographer: "Benjamin Sutton / Hyperallergic",
          sourceUrl: "https://hyperallergic.com/waiting-to-pee-in-america-the-gold-toilet-at-the-guggenheim/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/nyc-america-cattelan-gold-toilet/queueing-visitors.jpg",
          alt: "Visitors queueing on the Guggenheim's fifth floor to use 'America'",
          caption: "Over 100,000 people lined up to use the gold toilet during its year-long Guggenheim installation.",
          photographer: "Benjamin Sutton / Hyperallergic",
          sourceUrl: "https://hyperallergic.com/waiting-to-pee-in-america-the-gold-toilet-at-the-guggenheim/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/nyc-america-cattelan-gold-toilet/blenheim-palace.jpg",
          alt: "'America' installed in a water closet at Blenheim Palace, September 2019",
          caption: "Installed at Blenheim Palace in September 2019 — stolen five days after the opening and never recovered.",
          photographer: "Tom Lindboe / Blenheim Art Foundation",
          sourceUrl: "https://www.wallpaper.com/art/maurizio-cattelan-blenheim-palace-oxfordshire",
          licenseStatus: "unknown",
        },
      ],
      // designer: portrait skipped — no CC/non-commercial portrait of Cattelan exists
      // (he is known to be camera-averse and uses body doubles).
    },
  },
  "kyoto-tofukuji-tosu": {
    inlineOverride: {
      images: [
        {
          src: "/images/kyoto-tofukuji-tosu/cover.jpg",
          alt: "The long wooden Tōsu lavatory hall at Tofuku-ji, Kyoto, with vertical wooden lattice facade",
          caption: "The Tōsu (東司) at Tofuku-ji — Japan's oldest extant Zen monastic lavatory, designated an Important Cultural Property.",
          photographer: "Zairon via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Kyoto_Tofuku-ji_Tosu_1.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/kyoto-tofukuji-tosu/interior-holes.jpg",
          alt: "Interior of the Tōsu showing a long row of evenly-spaced pit holes in the clay floor",
          caption: "The interior reveals the long row of pit holes that gave the hall its nickname 'hyakusecchin' — the hundred-person toilet.",
          photographer: "Nippon.com",
          sourceUrl: "https://www.nippon.com/en/guide-to-japan/gu006001/the-tosu-of-tofukuji-japan%E2%80%99s-oldest-toilet.html",
          licenseStatus: "unknown",
        },
        {
          src: "/images/kyoto-tofukuji-tosu/exterior-2.jpg",
          alt: "Side elevation of the Tōsu showing the wooden lattice façade",
          caption: "From the side, the lattice façade lets visitors view the interior from outside without entering.",
          photographer: "Zairon via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Kyoto_Tofuku-ji_Tosu_2.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/kyoto-tofukuji-tosu/lattice-view.jpg",
          alt: "Another view of the Tōsu among the temple buildings of Tofuku-ji",
          caption: "The Tōsu sits within Tofuku-ji's wider monastic precinct, alongside the temple's other Important Cultural Properties.",
          photographer: "Hiro2006 via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:%E6%9D%B1%E7%A6%8F%E5%AF%BA8.JPG",
          licenseStatus: "cc",
          license: "CC BY-SA 3.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
        },
      ],
      // No designer — Muromachi-era anonymous craftsmen.
    },
  },


  "tokyo-higashi-sanchome-origata": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-higashi-sanchome-origata/cover.jpg",
          alt: "A bright red angular toilet structure with three folded volumes sits on a triangular plot, its sloped roof folding over each enclosure like wrapping paper.",
          caption: "Nao Tamura's 'Origata' reframes the public toilet as a wrapped gift — three vermilion volumes folded onto a triangular Shibuya plot.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/higashi_sanchome/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-higashi-sanchome-origata/oblique-corner.jpg",
          alt: "Sunlit corner view of the red toilet showing three deep recesses cut into the volumes, with frosted-glass stall doors set back from the bright red facade.",
          caption: "From the street corner, the three folded recesses register as urgent red flags amid Shibuya's grey backdrop.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/higashi_sanchome/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-higashi-sanchome-origata/exterior-night.jpg",
          alt: "The red structure photographed from down the street with the rail line and graffiti-covered retaining wall to its right.",
          caption: "A red marker for the neighbourhood, the toilet asserts itself against the messy backdrop of Tokyo's rail infrastructure.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/higashi_sanchome/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-higashi-sanchome-origata/interior-stall.jpg",
          alt: "Interior of one stall: a white sink with chrome tap mounted on a concrete-and-white wall, mirror above, and a TOTO toilet bowl visible through an open door.",
          caption: "Inside, the red shell gives way to a calm white cell with a TOTO bowl, exposed concrete and a single washbasin.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/higashi_sanchome/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-higashi-sanchome-origata/interior-bowl.jpg",
          alt: "A close view through the white stall doorway of a wall-mounted TOTO washlet toilet bowl, raw concrete to one side and a frosted red panel diffusing light to the other.",
          caption: "A single washlet sits in a tight white cell, framed by raw concrete and the red glow filtered through frosted glass.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/higashi_sanchome/",
          licenseStatus: "unknown",
        },
      ],
      designer: {
        portrait: "/images/tokyo-higashi-sanchome-origata/nao-tamura.jpg",
        portraitCredit: "via The Tokyo Toilet / The Nippon Foundation",
        portraitSourceUrl: "https://tokyotoilet.jp/en/higashi_sanchome/",
      },
    },
  },
  "tokyo-ebisu-station-white": {
    inlineOverride: {
      images: [
        {
          src: "/images/tokyo-ebisu-station-white/cover.jpg",
          alt: "At dusk a glowing white louvered box sits in the plaza outside Ebisu Station's west exit, framed by the station's diamond-grid canopy overhead and blurred commuters streaming past.",
          caption: "Kashiwa Sato's pure-white slatted volume at Ebisu Station glows softly into the evening commute.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/ebisu_station_west_exit/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-ebisu-station-white/exterior-front.jpg",
          alt: "Daytime front elevation of the toilet, a square box wrapped in horizontal white slats with a faint V-shaped pattern, set on a low white plinth between two concrete buildings.",
          caption: "By day the slatted skin reads as a quiet white ledger panel, deliberately recessive against the city's grain.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/ebisu_station_west_exit/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-ebisu-station-white/dusk-glow.jpg",
          alt: "The white box at blue hour, light bleeding through its horizontal louvers from inside, with the green JR East logo on the station building visible behind.",
          caption: "Designed as a 'neighbourhood symbol that should not be overly conspicuous,' the box becomes a soft lantern only after dark.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/ebisu_station_west_exit/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-ebisu-station-white/pictogram-detail.jpg",
          alt: "A tight detail of six brushed-steel pictograms (man, woman, wheelchair, ostomate, baby-change, multi-purpose) standing proud of the white horizontal slats.",
          caption: "Sato's signage system, lifted off the louvered skin in brushed steel, treats inclusion as graphic identity.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/ebisu_station_west_exit/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-ebisu-station-white/interior-stall.jpg",
          alt: "Interior of an accessible cubicle: white TOTO washlet bowl against a white wall, compact ceramic washbasin to the left, grab bar to the right, recessed lighting above.",
          caption: "A pristine all-white cell, every fixture set into the wall — Sato's 'clean and safe' stripped to bright graphic abstraction.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/ebisu_station_west_exit/",
          licenseStatus: "unknown",
        },
      ],
      designer: {
        portrait: "/images/tokyo-ebisu-station-white/kashiwa-sato.jpg",
        portraitCredit: "via The Tokyo Toilet / The Nippon Foundation",
        portraitSourceUrl: "https://tokyotoilet.jp/en/ebisu_station_west_exit/",
      },
    },
  },
  "tokyo-nishihara-itchome-andon": {
    inlineOverride: {
      designer: {
        name: "Takenosuke Sakakura",
        firm: "Sakakura Associates",
        portrait: "/images/tokyo-nishihara-itchome-andon/takenosuke-sakakura.jpg",
        portraitCredit: "via The Tokyo Toilet / The Nippon Foundation",
        portraitSourceUrl: "https://tokyotoilet.jp/en/nishihara_itchome_park/",
      },
      images: [
        {
          src: "/images/tokyo-nishihara-itchome-andon/cover.jpg",
          alt: "Night view of the toilet building glowing warmly from within, like a paper lantern set in a small Tokyo park; a silhouetted figure stands at the entrance.",
          caption: "After dark the mint-green box dissolves into an 'andon' — a lantern that gives the cramped Nishihara block a soft, civic light.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nishihara_itchome_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nishihara-itchome-andon/facade-day.jpg",
          alt: "Daytime frontal view of the pale-mint rectangular facade with three green-painted entry recesses, signage cut directly into the panels.",
          caption: "By day the lantern reads as a calm, restrained civic object — three doors, three pictograms, no fuss.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nishihara_itchome_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nishihara-itchome-andon/interior-accessible-wc.jpg",
          alt: "Accessible restroom interior showing a wall-mounted urinal with white grab bars, a small basin, and a wall of frosted glass softly printed with a forest silhouette pattern.",
          caption: "Inside the multipurpose stall, frosted glass printed with a forest motif lets daylight wash over white fittings and chrome.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nishihara_itchome_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nishihara-itchome-andon/interior-stall-andon.jpg",
          alt: "View looking into a single toilet stall through a tall frosted-glass door, with the white WC visible behind the panel which is printed with a delicate woodland scene.",
          caption: "Each stall reads from the park as a glowing lantern — the printed woodland on the glass keeps the user private but never sealed in.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nishihara_itchome_park/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/tokyo-nishihara-itchome-andon/interior-washbasin-frosted.jpg",
          alt: "A square washbasin and mirror stand in front of a full-height panel of frosted glass printed with a soft tree silhouette, painted dark green wall at left.",
          caption: "A washbasin set against a printed glass screen turns the wall itself into the park's borrowed scenery.",
          photographer: "Satoshi Nagare / The Nippon Foundation via tokyotoilet.jp",
          sourceUrl: "https://tokyotoilet.jp/en/nishihara_itchome_park/",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "norway-eggum-lofoten": {
    inlineOverride: {
      year: 2007,
      designer: {
        name: "Snøhetta",
        portrait: "/images/norway-eggum-lofoten/kjetil-traedal-thorsen.jpg",
        portraitCredit: "Birgit Fostervold, via Wikimedia Commons (Kjetil Trædal Thorsen, Snøhetta co-founder)",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:KjetilTr%C3%A6dalThorsen.jpg",
        portraitLicense: "CC BY-SA 4.0",
        portraitLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      },
      images: [
        {
          src: "/images/norway-eggum-lofoten/cover.jpg",
          alt: "Wide view of the Eggum rest stop's grass-edged gravel amphitheatre, ringed by tiered gabion walls, with a small dark-wood service building set into the embankment.",
          caption: "Snøhetta's amphitheatre at Eggum dishes a service building — kiosk and toilet — straight into the gabion wall, sharing a hilltop with a German radar ruin.",
          photographer: "Jarle Wæhler / Statens vegvesen (via Nasjonale turistveger)",
          sourceUrl: "https://www.nasjonaleturistveger.no/en/routes/lofoten/eggum/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-eggum-lofoten/context-village.jpg",
          alt: "A scatter of red wooden fishing huts strung along the Eggum shoreline under a heavy bank of cloud, with mountains and open sea behind.",
          caption: "The rest stop sits at the edge of an active fishing hamlet — its restraint is a deliberate answer to those red sheds.",
          photographer: "Steinar Skaar / Statens vegvesen (via Nasjonale turistveger)",
          sourceUrl: "https://www.nasjonaleturistveger.no/en/routes/lofoten/eggum/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-eggum-lofoten/detail-sculpture-hode.jpg",
          alt: "A small rust-red anthropomorphic head sculpture by Markus Raetz sits atop a rough granite column overlooking the Norwegian Sea.",
          caption: "Markus Raetz's bronze 'Hode' stares out from a granite pillar — the rest stop doubles as an open-air sculpture room.",
          photographer: "Steinar Skaar / Statens vegvesen (via Nasjonale turistveger)",
          sourceUrl: "https://www.nasjonaleturistveger.no/en/routes/lofoten/eggum/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-eggum-lofoten/context-borga-ruin.jpg",
          alt: "Four hikers in bright jackets walk a gravel path up a green hill toward 'Borga', a circular dry-stone ruin of a German WWII radar station.",
          caption: "The footpath from the rest stop climbs to Borga, the stone-walled WWII radar ruin that informed Snøhetta's gabion language.",
          photographer: "Steinar Skaar / Statens vegvesen (via Nasjonale turistveger)",
          sourceUrl: "https://www.nasjonaleturistveger.no/en/routes/lofoten/eggum/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-eggum-lofoten/visitors-shore.jpg",
          alt: "Two visitors take a break at a small wooden picnic table on a grassy bluff above a white-pebble boulder beach, looking out over the calm North Atlantic.",
          caption: "A picnic stop on the bluff makes the toilet stop feel less like a service yard and more like a place to linger.",
          photographer: "Frid-Jorunn Stabell / Statens vegvesen (via Nasjonale turistveger)",
          sourceUrl: "https://www.nasjonaleturistveger.no/en/routes/lofoten/eggum/",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "norway-selvika-havoysund": {
    inlineOverride: {
      designer: {
        portrait: "/images/norway-selvika-havoysund/reiulf-ramstad.jpg",
        portraitCredit: "Reiulf Ramstad Arkitekter (studio portrait; RRA portraits typically by Ivar Kvaal)",
        portraitSourceUrl: "https://www.reiulframstadarkitekter.com/person/reiulf-ramstad",
      },
      images: [
        {
          src: "/images/norway-selvika-havoysund/01_kitchen_pavilion.jpg",
          alt: "A curved concrete shelter at the Selvika rest stop holds a small dining table and bench under a sweeping cantilevered roof punched with circular portholes.",
          caption: "Reiulf Ramstad's open-air kitchen pavilion, part of the same monolithic concrete composition as the toilet building.",
          photographer: "Reiulf Ramstad Arkitekter",
          sourceUrl: "https://www.archdaily.com/251346/selvika-reiulf-ramstad-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-selvika-havoysund/02_ramp_beach.jpg",
          alt: "The signature sinuous concrete ribbon ramp coils across the sandy bay at Selvika, sea on the right and the coastal road just visible behind.",
          caption: "The serpentine concrete ramp choreographs the descent from car park to sand and sea.",
          photographer: "Reiulf Ramstad Arkitekter",
          sourceUrl: "https://www.archdaily.com/251346/selvika-reiulf-ramstad-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-selvika-havoysund/03_overview_sea.jpg",
          alt: "Looking from atop one of the curving concrete walls across a small bay toward distant Finnmark headlands and a blue summer sky.",
          caption: "From the rest stop's upper wall, the structure opens onto the Barents-facing coast.",
          photographer: "Reiulf Ramstad Arkitekter",
          sourceUrl: "https://www.archdaily.com/251346/selvika-reiulf-ramstad-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-selvika-havoysund/04_toilet_building.jpg",
          alt: "A compact board-formed concrete volume — the actual public toilet at Selvika — sits low against the moss-covered ground, its blank wall pierced by three circular portholes of different sizes.",
          caption: "The toilet itself: a small concrete chamber punched with portholes, lodged inside the sweeping ribbon wall.",
          photographer: "Reiulf Ramstad Arkitekter",
          sourceUrl: "https://www.archdaily.com/251346/selvika-reiulf-ramstad-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-selvika-havoysund/05_structure_landscape.jpg",
          alt: "The entire Selvika rest stop seen from the beach side as a single sculpture of board-formed concrete coiling into the rocky hillside.",
          caption: "The whole ensemble reads as one monolithic concrete creature settled into the rock.",
          photographer: "Reiulf Ramstad Arkitekter",
          sourceUrl: "https://www.archdaily.com/251346/selvika-reiulf-ramstad-arkitekter",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "norway-bukkekjerka-andoya": {
    inlineOverride: {
      designer: {
        name: "Morfeus Arkitekter",
        bio: "Oslo studio founded 2007 by Caroline Støvring and Cecilie Wille; the Bukkekjerka project team also included Margrethe Rosenlund and Mari Høstmælingen Grennæs.",
      },
      images: [
        {
          src: "/images/norway-bukkekjerka-andoya/01_interior_view.jpg",
          alt: "Inside the Bukkekjerka toilet — a polished stainless-steel basin with black tap-handles hovers in front of a glass wall that frames the bare Andøya coastline.",
          caption: "From inside, the one-way mirror glass becomes a private cinema of the Norwegian Sea.",
          photographer: "MORFEUS arkitekter (Caroline Støvring)",
          sourceUrl: "https://www.archdaily.com/896606/bukkekjerka-morfeus-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-bukkekjerka-andoya/02_interior_sink.jpg",
          alt: "A closer view of the stainless-steel washbasin and matte-black mixer tap inside the cubicle, with rocky moss-covered terrain and a horizon of mountains beyond the floor-to-ceiling mirrored glass.",
          caption: "Black VOLA fittings and a steel basin face the unbroken Vesterålen horizon.",
          photographer: "MORFEUS arkitekter (Caroline Støvring)",
          sourceUrl: "https://www.archdaily.com/896606/bukkekjerka-morfeus-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-bukkekjerka-andoya/03_exterior_mirror.jpg",
          alt: "The angular Bukkekjerka pavilion seen from the parking platform — a folded concrete roof bridges between rocks above a mirror-clad cubicle that reflects the landscape.",
          caption: "A folded concrete slab steps between rocks; the toilet cubicle disappears into a reflection of its own ground.",
          photographer: "MORFEUS arkitekter (Caroline Støvring)",
          sourceUrl: "https://www.archdaily.com/896606/bukkekjerka-morfeus-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-bukkekjerka-andoya/04_exterior_close.jpg",
          alt: "A close view of the mirror-clad toilet box from outside — the wall reflects orange and grey lichen-covered rocks, while a sliver of concrete soffit overhead reveals the building's geometry.",
          caption: "From outside, the cubicle camouflages itself in lichen-orange rock.",
          photographer: "MORFEUS arkitekter (Caroline Støvring)",
          sourceUrl: "https://www.archdaily.com/896606/bukkekjerka-morfeus-arkitekter",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-bukkekjerka-andoya/05_landscape_mountain.jpg",
          alt: "A wide landscape view of the Bukkekjerka site — the low concrete rest-stop snakes along at the foot of a towering Sámi sacred rock formation, dwarfed by mountain and moss.",
          caption: "Bukkekjerka in context: a quiet sliver of concrete at the foot of Andøya's sacred peak.",
          photographer: "MORFEUS arkitekter (Caroline Støvring)",
          sourceUrl: "https://www.archdaily.com/896606/bukkekjerka-morfeus-arkitekter",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "london-dont-miss-a-sec": {
    inlineOverride: {
      designer: {
        portrait: "/images/london-dont-miss-a-sec/monica-bonvicini.jpg",
        portraitCredit: "Martin Bahler, via AWARE — Archives of Women Artists, Research and Exhibitions",
        portraitSourceUrl: "https://awarewomenartists.com/en/artiste/monica-bonvicini/",
      },
      images: [
        {
          src: "/images/london-dont-miss-a-sec/cover.jpg",
          alt: "A mirrored-glass cube sits in an open plaza, its one-way reflective walls catching the sky and surrounding architecture so passersby see only themselves.",
          caption: "From the outside, Monica Bonvicini's 'Don't Miss a Sec'.' is a sealed mirrored cube — the joke (and the toilet) hidden behind the reflection.",
          photographer: "Jannes Linders",
          sourceUrl: "https://monicabonvicini.net/dont-miss-a-sec-2/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/london-dont-miss-a-sec/interior-toilet-bowl.jpg",
          alt: "Interior view of the cube — a single stainless-steel toilet bowl sits on a fluorescent-lit milk-glass plinth, and through the one-way mirrored walls you can see pedestrians and traffic outside, completely unaware they are being watched from the loo.",
          caption: "The iconic view from the seat — Bonvicini hands the all-seeing gaze to whoever is on the bowl.",
          photographer: "Jannes Linders",
          sourceUrl: "https://monicabonvicini.net/dont-miss-a-sec-2/",
          licenseStatus: "unknown",
        },
        {
          src: "/images/london-dont-miss-a-sec/rotterdam-coolsingel.jpg",
          alt: "The cube installed on Coolsingel in central Rotterdam, surrounded by tram tracks, leafless trees and weekday foot traffic. Its mirrored skin warps the surrounding buildings into a slightly fish-eye reflection.",
          caption: "'Don't Miss a Sec'.' on Coolsingel, Rotterdam — disguised as urban sculpture in plain sight.",
          photographer: "FaceMePLS via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Don%27t_Miss_A_Sec_(2004)_(1710210866).jpg",
          licenseStatus: "cc",
          license: "CC BY 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
        },
        {
          src: "/images/london-dont-miss-a-sec/rotterdam-alt-angle.jpg",
          alt: "A second view of the Rotterdam installation, photographed from a different angle on the same day. A pedestrian crosses behind the cube; the mirrored walls show no hint of the toilet inside.",
          caption: "Same cube, second pass — the work refuses to reveal itself from any angle outside.",
          photographer: "FaceMePLS via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Don%27t_Miss_A_Sec_(2004)_(1710211846).jpg",
          licenseStatus: "cc",
          license: "CC BY 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
        },
      ],
    },
  },
  "paris-uritrottoir": {
    inlineOverride: {
      designer: {
        portrait: "/images/paris-uritrottoir/faltazi.jpg",
        portraitCredit: "© Faltazi (studio-supplied portrait of Laurent Lebot and Victor Massip, via Urbanisme magazine)",
        portraitSourceUrl: "https://www.urbanisme.fr/invite/victor-massip-et-laurent-lebot-cofondateurs-de-lagence-faltazi/",
      },
      images: [
        {
          src: "/images/paris-uritrottoir/cover.jpg",
          alt: "A red Uritrottoir STOUT model on a narrow Nantes sidewalk: a chest-high metal box with a planter on top of grasses and flowers, and an inclined urinal opening on its front face.",
          caption: "A Faltazi Uritrottoir on rue Montaudouine in Nantes — planter on top, dry composting urinal below.",
          photographer: "Roland Belote via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Uritrottoir.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/paris-uritrottoir/close-up-opening.jpg",
          alt: "Tight framing of a green Uritrottoir against a stone-wall alley, showing the angled urinal slot at standing height with a Faltazi/Ekovore decal.",
          caption: "Close-up — the opening at standing-male height makes the function unmistakable.",
          photographer: "Benoît Prieur via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Uritrottoir_Rue_de_la_Bl%C3%A9terie_(Nantes)_en_mars_2023.JPG",
          licenseStatus: "cc",
          license: "CC0 1.0",
          licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        },
        {
          src: "/images/paris-uritrottoir/street-context.jpg",
          alt: "The larger STOUT XL variant installed on rue de la Bléterie, Nantes — wider, taller, and slotted between traditional shopfronts.",
          caption: "The STOUT XL variant in Nantes — sized up for higher-traffic spots like Paris's Gare de Lyon.",
          photographer: "Roland Belote via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Uritrottoir_STOUT_XL.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/paris-uritrottoir/cross-section.jpg",
          alt: "A schematic diagram showing the Uritrottoir's internal logic: urine plus straw drops into a sealed compost tray, which is later harvested as fertilizer.",
          caption: "How it works — urine plus straw becomes compost, the loop the design is built to close.",
          photographer: "Roland Belote / Faltazi via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Compostage-uritrottoir.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
        {
          src: "/images/paris-uritrottoir/planter-detail.jpg",
          alt: "Faltazi's own product photograph of a Uritrottoir in golden afternoon light, with the top planter spilling over with grasses and red flowers.",
          caption: "Faltazi's studio shot — the design's pitch in a single image: a garden that absorbs the pee problem.",
          photographer: "Faltazi (studio)",
          sourceUrl: "https://www.faltazi.com/portfolio/uritrottoir-urinoir-sec-public/",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "norway-utsikten-gaularfjellet": {
    inlineOverride: {
      designer: {
        bio: "Oslo studio founded in 1997 by Bjarne Ringstad, Julian Lynghjem, Gaute Stensrud and Henning Kaland (joined by Ole Einejord in 1999).",
        portrait: "/images/norway-utsikten-gaularfjellet/code-arkitektur.jpg",
        portraitCredit: "Code Arkitektur studio group photo, via Norwegian Architects' Association (Arkitektur N)",
        portraitSourceUrl: "https://www.arkitektur.no/folk/selvangivelsen/code-arkitektur/",
      },
      images: [
        {
          src: "/images/norway-utsikten-gaularfjellet/cover.jpg",
          alt: "A vast triangular concrete platform, its tips rising up like wings, perched at the edge of a Norwegian mountain ridge under a moody grey sky.",
          caption: "Code Arkitektur's 80-centimetre-thin concrete deck floats above the Gaular plateau like a tectonic plate.",
          photographer: "Jiri Havran",
          sourceUrl: "https://www.archdaily.com/793615/utsikten-viewpoint-code-arkitektur",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-utsikten-gaularfjellet/aerial.jpg",
          alt: "Drone view straight down on the triangular concrete platform, its three corners flared upward like origami folds, surrounded by mossy rock and gravel.",
          caption: "From above, the platform reads as a paper aeroplane snipped from the mountainside.",
          photographer: "Jiri Havran",
          sourceUrl: "https://www.archdaily.com/793615/utsikten-viewpoint-code-arkitektur",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-utsikten-gaularfjellet/corner-aperture.jpg",
          alt: "Close detail of one raised concrete wing, a rectangular cut-out forming the doorway to the small restroom embedded inside the structure.",
          caption: "Each upturned corner conceals a function — seating, terrain access, or, here, the entrance to the solar-powered toilet.",
          photographer: "Jiri Havran",
          sourceUrl: "https://www.archdaily.com/793615/utsikten-viewpoint-code-arkitektur",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-utsikten-gaularfjellet/platform-toilet-entry.jpg",
          alt: "Side-on ground-level view of the platform with a raised wing-corner in profile, showing the dark slot of the toilet doorway carved into the concrete.",
          caption: "The restroom hides in plain sight — the building IS the platform.",
          photographer: "Jiri Havran",
          sourceUrl: "https://www.archdaily.com/793615/utsikten-viewpoint-code-arkitektur",
          licenseStatus: "unknown",
        },
        {
          src: "/images/norway-utsikten-gaularfjellet/restroom-access.jpg",
          alt: "Visitors approaching the corner aperture of the platform that leads into the solar-powered toilet block, scale humans against the heroic concrete.",
          caption: "A toilet break with a 700-metre view down the fjord.",
          photographer: "Jiri Havran",
          sourceUrl: "https://www.archdaily.com/793615/utsikten-viewpoint-code-arkitektur",
          licenseStatus: "unknown",
        },
      ],
    },
  },
  "delhi-sulabh-toilet-museum": {
    inlineOverride: {
      designer: {
        portrait: "/images/delhi-sulabh-toilet-museum/bindeshwar-pathak.jpg",
        portraitCredit: "Government of India / Photo Division (Prime Minister's Office), via Wikimedia Commons",
        portraitSourceUrl: "https://commons.wikimedia.org/wiki/File:Bindeshwar_Pathak.jpg",
        portraitLicense: "GODL-India",
        portraitLicenseUrl: "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
      },
      images: [
        {
          src: "/images/delhi-sulabh-toilet-museum/museum-entrance.jpg",
          alt: "The exterior sign and entrance of Sulabh International Museum of Toilets, a modest single-storey building in Mahavir Enclave, Delhi.",
          caption: "A quietly extraordinary museum tucked into Sulabh International's Delhi campus.",
          photographer: "FLUSH (blog)",
          sourceUrl: "https://www.itsflush.com/post/sulabh-museum",
          licenseStatus: "unknown",
        },
        {
          src: "/images/delhi-sulabh-toilet-museum/interior-view.jpg",
          alt: "Wide shot of the museum's main gallery: bright fluorescent lighting, glass vitrines lining a long room, illustrated wall panels tracing the history of sanitation chronologically.",
          caption: "Five thousand years of plumbing arranged like a school corridor.",
          photographer: "FLUSH (blog)",
          sourceUrl: "https://www.itsflush.com/post/sulabh-museum",
          licenseStatus: "unknown",
        },
        {
          src: "/images/delhi-sulabh-toilet-museum/toilet-display.jpg",
          alt: "Vitrine packed with antique commodes, chamber pots and decorated Victorian toilet seats, each labelled with handwritten cards.",
          caption: "A study collection of privies, chamber pots and ornate water closets spanning 1145 CE to the late 20th century.",
          photographer: "FLUSH (blog)",
          sourceUrl: "https://www.itsflush.com/post/sulabh-museum",
          licenseStatus: "unknown",
        },
        {
          src: "/images/delhi-sulabh-toilet-museum/chinese-dung-bucket.jpg",
          alt: "A glass case displaying a tall wooden Chinese dung-collection bucket from the Qing era, set against an explanatory wall panel.",
          caption: "Curated alongside Mughal commodes and Roman gold pots, the everyday tools of historical sanitation.",
          photographer: "FLUSH (blog)",
          sourceUrl: "https://www.itsflush.com/post/sulabh-museum",
          licenseStatus: "unknown",
        },
        {
          src: "/images/delhi-sulabh-toilet-museum/ecosan-toilet.jpg",
          alt: "Concrete floor with two side-by-side ecosan squat pans, each with separate apertures for urine and faeces, set into a tiled cubicle of a Sulabh complex.",
          caption: "The dry twin-pit ecosan technology Sulabh propagated nationwide — the live counterpart to the museum's historical displays.",
          photographer: "Ajay Tallam via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Sulabh_ecosan_toilet.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
        },
      ],
    },
  },

  "singapore-marina-bay-sands-six-star": {
    inlineOverride: {
      year: 2018,
      designer: {
        name: "Marina Bay Sands facilities team",
        bio: "The Shoppes at Marina Bay Sands was master-planned by Moshe Safdie; the six 6-star Happy Toilet restrooms inside it were certified by Jack Sim's Restroom Association of Singapore in April 2018, marking the first time the 6-star tier (introduced 2014) was ever awarded. The certification rewards 'smart restroom' features including an ammonia sensor that alerts cleaners when air-quality thresholds are crossed, and a tablet-based user-feedback loop modelled on ride-share apps.",
      },
      images: [
        {
          src: "/images/singapore-marina-bay-sands-six-star/cover.jpg",
          alt: "Restroom interior at The Shoppes at Marina Bay Sands — black-framed mirrors over a dark-veined marble vanity with twin basins, framed by marble walls and dark-wood stall doors.",
          caption: "One of the six 6-star Happy Toilet restrooms at The Shoppes at Marina Bay Sands, finished in book-matched marble and black-framed mirrors.",
          photographer: "Restroom Association (Singapore)",
          sourceUrl: "https://www.toilet.org.sg/gallery/207/6-star-toilet-the-shoppes-at-marina-bay-sands",
          licenseStatus: "unknown",
        },
        {
          src: "/images/singapore-marina-bay-sands-six-star/washbasin-row.jpg",
          alt: "Wide view of the double-basin vanity counter in dark marble, with a cluster of black-framed mirrors and recessed sanitary-bin alcoves clad in the same marble.",
          caption: "The washbasin row uses the same dark marble found throughout the MBS retail interiors, a hallmark of the 6-star fitout.",
          photographer: "Restroom Association (Singapore)",
          sourceUrl: "https://www.toilet.org.sg/gallery/207/6-star-toilet-the-shoppes-at-marina-bay-sands",
          licenseStatus: "unknown",
        },
        {
          src: "/images/singapore-marina-bay-sands-six-star/stall-corridor.jpg",
          alt: "Marble-clad stall corridor with floor-to-ceiling dark-wood doors lined up against a back wall of figured stone.",
          caption: "Stall doors run from floor to ceiling — a detail RAS auditors flag as a 6-star feature for privacy and acoustics.",
          photographer: "Restroom Association (Singapore)",
          sourceUrl: "https://www.toilet.org.sg/gallery/207/6-star-toilet-the-shoppes-at-marina-bay-sands",
          licenseStatus: "unknown",
        },
        {
          src: "/images/singapore-marina-bay-sands-six-star/urinal-wall.jpg",
          alt: "Two wall-hung urinals separated by a dark-wood privacy divider, set against marble walls.",
          caption: "The men's room pairs marble cladding with full-height privacy dividers between urinals.",
          photographer: "Restroom Association (Singapore)",
          sourceUrl: "https://www.toilet.org.sg/gallery/207/6-star-toilet-the-shoppes-at-marina-bay-sands",
          licenseStatus: "unknown",
        },
        {
          src: "/images/singapore-marina-bay-sands-six-star/mall-atrium.jpg",
          alt: "Wide establishing shot of The Shoppes at Marina Bay Sands interior — vaulted glass roof and gleaming escalators rising through a multi-level retail atrium.",
          caption: "The Shoppes at Marina Bay Sands — the Moshe Safdie-master-planned retail complex inside which the 6-star restrooms are tucked.",
          photographer: "Basile Morin via Wikimedia Commons",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:Interior_of_The_Shoppes_at_Marina_Bay_Sands,_Singapore.jpg",
          licenseStatus: "cc",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
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

const combined = [...migrated, ...carried, ...EXTRAS];
const final = shuffleByRegion(combined, SHUFFLE_SEED);

// =============================================================================
// REPORT
// =============================================================================

console.log(`\n=== Migration summary ===`);
console.log(`Migrated entries:    ${migrated.length}`);
console.log(`Carried-over:        ${carried.length}`);
console.log(`Extras:              ${EXTRAS.length}`);
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
