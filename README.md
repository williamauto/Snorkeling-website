# Snorkeling Miami

A reef-by-reef snorkeling guide covering the South Florida coast from Lauderdale-by-the-Sea down to
Islamorada -- every named spot, its access type (shore / boat / tour / permit), depth, difficulty, and
marine life, with a clickable map and a full comparison table.

## Stack

- **Next.js 14** (App Router, static export via `output: 'export'`)
- **Tailwind CSS** for styling
- **Leaflet / react-leaflet** for the interactive map (OpenStreetMap tiles, no API key required)
- **Supabase** (Postgres) as the content database -- read at build time via the anon/publishable key,
  so the deployed site is fully static

## Content

- 3 regions: Fort Lauderdale Area, Miami, Florida Keys
- 11 named beach areas (sub-destination pages), e.g. Lauderdale-by-the-Sea, Key Biscayne, Islamorada
- 32 named snorkeling spots (reefs, wrecks, artificial reefs, and parks) with access type, depth range,
  difficulty, marine life, and a cited source for every area
- 6 real, verified operators (dive shops / rental shops) linked to the spots they actually serve --
  no placeholder businesses or invented pricing

Research sources are cited per area on each area page and stored in the `sources` table. Primary
sources used for the initial build: divein.com's Best Snorkeling in Miami, divemiamibeach.com's dive
site list, thecastlebythesea.com and snorkelaroundtheworld.com for the Fort Lauderdale area, and
funinkeywest.com / adventuresbylana.com for Islamorada and Key Largo.

## Database schema

```
regions (state → region grouping along the coast)
  └─ areas (a named beach town / beach area, e.g. Key Biscayne)
       └─ spots (a named reef, wreck, or park within an area)
            ├─ spot_operators → operators (real dive shops / rental shops, many-to-many)
            └─ sources (citation trail per spot or per area)
```

Row-level security is enabled on every table with a public `select` policy -- the site reads with the
anon/publishable key. All writes go through the Supabase dashboard or the service-role key; this repo
never ships a service-role key.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project URL + anon/publishable key
npm run dev
```

## Build (static export)

```bash
npm run build
```

Output lands in `out/` and can be deployed to any static host (GitHub Pages, Netlify, Vercel, S3 +
CloudFront, etc.) -- there's no server runtime required since all data is fetched at build time.

## Adding a new spot or area

Content lives in Supabase, not in this repo. Add or edit rows in the `regions` / `areas` / `spots` /
`operators` / `spot_operators` / `sources` tables, then re-run `npm run build` to regenerate the static
pages. Only add an `operators` row for a real, currently-operating business -- never a placeholder name
or an estimated price/rating.
