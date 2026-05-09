# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Global Fun Toilet Atlas** — a static, content-driven Next.js site that showcases unique public toilets around the world. The dataset (`data/toilets.json`) is the source of truth; pages render from it.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

No test runner is configured yet.

## Stack pinning — read before upgrading

- **Next.js is deliberately pinned to `^15.5`**, not the latest. The default `create-next-app` installs Next 16; this project explicitly downgraded. Do not run `npm install next@latest` or accept a Next 16 upgrade without confirming with the user.
- React 19, Tailwind CSS **v4**, TypeScript 5, ESLint 9 (flat config).

## Tailwind v4 — CSS-first, no JS config

There is **no `tailwind.config.js`**. All theme configuration lives in `app/globals.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
}
```

When extending the theme (colors, fonts, spacing tokens), edit the `@theme inline` block — do not create a `tailwind.config.js`. PostCSS plugin is `@tailwindcss/postcss` (see `postcss.config.mjs`).

## Font contract

Fonts are loaded **once**, in `app/layout.tsx`, via `next/font/google`:

- `Inter` → CSS var `--font-inter` → Tailwind `font-sans` (body default)
- `Playfair Display` → CSS var `--font-playfair` → Tailwind `font-serif` (headings)

Use the Tailwind utilities `font-sans` / `font-serif` in components. Do not import Google Fonts elsewhere or via `<link>` tags — adding a second loader bypasses Next's font optimization and breaks self-hosting.

## Path alias

`@/*` resolves to the repo root (there is no `src/` directory). Examples:

```ts
import { ToiletCard } from "@/components/ToiletCard";
import toilets from "@/data/toilets.json";
```

## Data model

The TypeScript shape of an entry lives in `lib/types.ts` (`Toilet`, `ToiletImage`). Import the JSON via `resolveJsonModule` (already enabled in `tsconfig.json`) and cast/assert against `Toilet[]`.

Image convention: each toilet's images live under `public/images/<slug>/`, referenced from the JSON entry with paths like `/images/<slug>/hero.jpg`.

## Project structure

- `app/` — Next.js App Router routes (no `src/`)
- `components/` — reusable UI components
- `data/` — `toilets.json` dataset
- `public/images/<slug>/` — per-toilet image folders
