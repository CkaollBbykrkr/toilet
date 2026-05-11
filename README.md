# Global Fun Toilet Atlas

A visual atlas of unique public toilets around the world. Each entry showcases a single notable toilet — its location, design, and what makes it worth a detour.

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Google Fonts: **Playfair Display** (headings) and **Inter** (body), loaded via `next/font/google`

## Project layout

```
app/              Next.js routes (App Router)
components/       Reusable UI components
data/             toilets.json — the atlas dataset
public/images/    Per-toilet image folders
```

## Run locally

```bash
npm install      # first time only
npm run dev      # starts http://localhost:3000
```

Other scripts:

- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint

## Adding a toilet

1. Create a folder under `public/images/<slug>/` and drop image files in it.
2. Append an entry to `data/toilets.json` referencing those image paths.

The schema for `toilets.json` is defined in `lib/types.ts`. Keep new entries aligned with the `Toilet` type; `slug`, `name`, `location`, `description`, and `images` are the core fields the pages expect.
