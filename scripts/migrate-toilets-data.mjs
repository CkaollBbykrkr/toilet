#!/usr/bin/env node
// Migrate PRD-schema data/toilets_30.json + carry-over entries from current
// data/toilets.json into a single data/toilets.json (32 entries) that matches
// the current lib/types.ts schema.
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
  // The Haru-no-Ogawa Community Park toilet is the one we have local
  // editorial-*.jpg renderings + Wikimedia Shigeru Ban portrait for. PRD's
  // generic entry is enriched with these via `inlineOverride` so the script
  // is self-contained (doesn't depend on uncommitted state of data/toilets.json).
  "tokyo-haru-no-ogawa-transparent": {
    inlineOverride: {
      location: {
        place: "Haru-no-Ogawa Community Park",
        address: "5-68-1 Yoyogi, Shibuya City, Tokyo",
      },
      images: [
        {
          src: "/images/tokyo-transparent-toilet/editorial-hero.jpg",
          alt: "Editorial rendering of the Tokyo Transparent Toilet glowing under trees in Haru-no-Ogawa Community Park",
          caption: "A magazine-style view of the glass pavilion set beneath the park canopy.",
          photographer: "AI-generated editorial rendering",
          licenseStatus: "pending",
        },
        {
          src: "/images/tokyo-transparent-toilet/editorial-interior.jpg",
          alt: "Editorial rendering of a clean transparent glass restroom interior with park greenery outside",
          caption: "The transparent walls turn the usually hidden interior into part of the architecture.",
          photographer: "AI-generated editorial rendering",
          licenseStatus: "pending",
        },
        {
          src: "/images/tokyo-transparent-toilet/editorial-exterior.jpg",
          alt: "Editorial rendering of the colorful transparent public toilet from a three-quarter exterior angle",
          caption: "Color bands, reflections and tree shade soften the compact civic structure.",
          photographer: "AI-generated editorial rendering",
          licenseStatus: "pending",
        },
        {
          src: "/images/tokyo-transparent-toilet/editorial-evening.jpg",
          alt: "Editorial rendering of the transparent toilet glowing at blue hour in a quiet park",
          caption: "At dusk, the pavilion becomes a small lantern in the trees.",
          photographer: "AI-generated editorial rendering",
          licenseStatus: "pending",
        },
        {
          src: "/images/tokyo-transparent-toilet/editorial-detail.jpg",
          alt: "Editorial rendering of stainless steel lock hardware on colored transparent glass panels",
          caption: "The drama of the design lives in the small mechanics of glass, handle and lock.",
          photographer: "AI-generated editorial rendering",
          licenseStatus: "pending",
        },
        {
          src: "/images/tokyo-transparent-toilet/editorial-park.jpg",
          alt: "Editorial rendering of the Tokyo Transparent Toilet framed by park trees and warm afternoon light",
          caption: "Set back into greenery, the pavilion reads like a designed pause in the neighborhood.",
          photographer: "AI-generated editorial rendering",
          licenseStatus: "pending",
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
};

const CARRY_OVER = [
  "cliffside-toilet-at-cape-royal",
  "the-loo-at-trafalgar-square",
];

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
  return fixRegion(entry);
});

const final = [...migrated, ...carried];

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

console.log(`\n=== Region distribution (final 32) ===`);
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
