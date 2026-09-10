import Link from 'next/link';
import { getRegionsWithAreas } from '@/lib/supabase';
import MapClientLoader from '@/components/MapClientLoader';
import type { MapMarker } from '@/components/MapView';

const REGION_COLOR: Record<string, string> = {
  'fort-lauderdale-area': '#12AA9C',
  miami: '#E67F5C',
  'florida-keys': '#0A5257',
};

export default async function HomePage() {
  const regions = await getRegionsWithAreas();
  const totalAreas = regions.reduce((n, r) => n + r.areas.length, 0);

  const markers: MapMarker[] = regions.flatMap((region) =>
    region.areas
      .filter((a) => a.latitude && a.longitude)
      .map((a) => ({
        id: a.id,
        name: a.name,
        lat: a.latitude as number,
        lng: a.longitude as number,
        href: `/areas/${a.slug}/`,
        color: REGION_COLOR[region.slug] ?? '#0E7C82',
        subtitle: region.name,
      }))
  );

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A5257] via-[#0B6E76] to-[#12AA9C] pb-20 pt-14 text-[#EAFBF8]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#BFF2E8]">
            Lauderdale-by-the-Sea &rarr; Islamorada
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Every real snorkeling spot on South Florida&rsquo;s reef line, <em className="italic text-[#FFD3BE]">mapped and compared.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#D6F2EC] sm:text-lg">
            {totalAreas} named beach areas, reef by reef -- shore trails you can walk into, boat-only ledges,
            and the protected park water in between. Access type, depth, and what you&rsquo;ll actually see,
            sourced from real dive and snorkel guides.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/compare/"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-[#241009] shadow-lg shadow-coral/30 transition hover:-translate-y-0.5"
            >
              Compare every spot
            </Link>
            <a
              href="#map"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F5FDFB] backdrop-blur"
            >
              Browse the map
            </a>
          </div>
        </div>
      </section>

      <section id="map" className="mx-auto -mt-10 max-w-6xl px-5 sm:px-8">
        <div className="rounded-3xl border border-lagoon-deep/10 bg-white p-4 shadow-xl shadow-lagoon-deep/10 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-ink">Click an area to explore it</h2>
            <div className="flex flex-wrap gap-3 text-xs font-bold">
              {regions.map((r) => (
                <span key={r.id} className="inline-flex items-center gap-1.5 text-ink/70">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: REGION_COLOR[r.slug] ?? '#0E7C82' }}
                  />
                  {r.name}
                </span>
              ))}
            </div>
          </div>
          <MapClientLoader markers={markers} center={[25.6, -80.35]} zoom={8} height={480} />
        </div>
      </section>

      {regions.map((region) => (
        <section key={region.id} className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="mb-6 max-w-2xl">
            <span className="eyebrow text-xs font-bold uppercase tracking-[0.14em] text-lagoon">
              {region.name}
            </span>
            <p className="mt-2 text-ink/70">{region.blurb}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {region.areas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.slug}/`}
                className="group flex flex-col justify-between rounded-2xl border border-lagoon-deep/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink group-hover:text-lagoon-deep">
                    {area.name}
                  </h3>
                  <p className="mt-2 text-sm text-ink/70">{area.blurb}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-lagoon-deep">
                  <span>{area.access_note}</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
