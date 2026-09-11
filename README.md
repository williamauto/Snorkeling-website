# Snorkeling Miami

A reef-by-reef snorkeling guide covering the South Florida coast from Lauderdale-by-the-Sea down to
Islamorada. Every named spot is grouped by area and by how you actually reach it (shore, boat, tour,
or permit), with depth, difficulty, marine life, a practical planning tip, and a clickable map.

## Stack

- **Next.js 14** (App Router, static export via `output: 'export'`)
- **Tailwind CSS** for styling
- **Leaflet / react-leaflet** for the interactive map (OpenStreetMap tiles, no API key required)
- **Supabase** (Postgres) as the content database, read at build time via the anon/publishable key,
  so the deployed site is fully static

## Content

- 3 regions: Fort Lauderdale Area, Miami, Florida Keys
- 10 named beach areas (sub-destination pages), each with a best-time-to-go note and a getting-there
  summary, e.g. Lauderdale-by-the-Sea, Key Biscayne, Islamorada
- 45 named snorkeling spots (reefs, wrecks, artificial reefs, and parks), grouped within each area by
  access type, with depth range, difficulty, marine life, a planning tip, and a cited source
- 6 real, verified operators (dive shops / rental shops) linked to the spots they actually serve; no
  placeholder businesses or invented pricing

Research sources are cited per area on each area page and stored in the `sources` table.

## Database schema

```
regions (state / region grouping along the coast)
  └─ areas (a named beach town or beach area, e.g. Key Biscayne)
       ├─ best_time_text, getting_there (trip-planning fields)
       └─ spots (a named reef, wreck, or park within an area)
            ├─ tips (a practical planning tip per spot)
            ├─ spot_operators → operators (real dive shops / rental shops, many-to-many)
            └─ sources (citation trail per spot or per area)
```

Row-level security is enabled on every table with a public `select` policy; the site reads with the
anon/publishable key. All writes go through the Supabase dashboard or the service-role key; this repo
never ships a service-role key.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project URL and anon/publishable key
npm run dev
```

## Build (static export)

```bash
npm run build
```

Output lands in `out/` and can be deployed to any static host.

## Deploying to GitHub Pages

This repo ships a workflow at `.github/workflows/deploy.yml` that builds the static export and
publishes it to GitHub Pages on every push to `main`.

1. In the repo's Settings > Pages, set Source to "GitHub Actions".
2. In Settings > Secrets and variables > Actions, add two repository secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

   (the same values from your local `.env.local`)
3. Push to `main`. The site will be live at `https://<your-username>.github.io/Snorkeling-website/`.

The build sets `GITHUB_PAGES=true`, which tells `next.config.js` to prefix all routes and assets with
the `/Snorkeling-website` base path so the project pages URL resolves correctly. Local `npm run dev`
and `npm run build` are unaffected.

## Adding a new spot or area

Content lives in Supabase, not in this repo. Add or edit rows in the `regions` / `areas` / `spots` /
`operators` / `spot_operators` / `sources` tables, then re-run `npm run build` to regenerate the
static pages. Only add an `operators` row for a real, currently-operating business, never a
placeholder name or an estimated price/rating.
