import { getRegionsWithAreas, getAllSpotsForCompare, getSiteStats, getAllOperatorsWithSpots } from '@/lib/supabase';
import MapClientLoader from '@/components/MapClientLoader';
import type { MapMarker } from '@/components/MapView';
import Bubbles from '@/components/Bubbles';
import WaveDivider from '@/components/WaveDivider';
import HeroPlanner from '@/components/HeroPlanner';
import AreaExplorer, { type AreaCardData } from '@/components/AreaExplorer';
import { REGION_COLOR } from '@/components/SpotVisuals';

export default async function HomePage() {
  const [regions, spots, stats, operators] = await Promise.all([
    getRegionsWithAreas(),
    getAllSpotsForCompare(),
    getSiteStats(),
    getAllOperatorsWithSpots(),
  ]);

  const allAreas = regions.flatMap((r) => r.areas.map((a) => ({ ...a, region: r })));

  const areaCards: AreaCardData[] = allAreas.map((area) => {
    const areaSpots = spots.filter((s) => s.area_id === area.id);
    const counts: Record<string, number> = {};
    areaSpots.forEach((s) => {
      counts[s.access_type] = (counts[s.access_type] ?? 0) + 1;
    });
    const dominantAccess =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'mixed';
    return {
      ...area,
      regionSlug: area.region.slug,
      regionName: area.region.name,
      spotCount: areaSpots.length,
      dominantAccess,
    };
  });

  const markers: MapMarker[] = allAreas
    .filter((a) => a.latitude && a.longitude)
    .map((a) => ({
      id: a.id,
      name: a.name,
      lat: a.latitude as number,
      lng: a.longitude as number,
      href: `/areas/${a.slug}/`,
      color: REGION_COLOR[a.region.slug] ?? '#0E7C82',
      subtitle: a.region.name,
    }));

  const regionNames = regions.map((r) => r.name);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A5257] via-[#0B6E76] to-[#12AA9C] pb-28 pt-4">
        <Bubbles />
        <div className="relative z-[3] mx-auto max-w-6xl px-5 pb-8 pt-10 text-[#EAFBF8] sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#BFF2E8]">
            Lauderdale-by-the-Sea to Islamorada
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Every real snorkeling spot on South Florida&rsquo;s reef line,{' '}
            <em className="italic text-[#FFD3BE]">mapped and grouped by reef.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#D6F2EC] sm:text-lg">
            {stats.totalSpots} named spots across {stats.totalAreas} beach areas, sorted into shore
            trails you can walk into, boat-only ledges, and the tour-only water in between. Access
            type, depth, and what you will actually see, grouped so you can plan the day before you
            pack the car.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#explore"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-[#241009] shadow-lg shadow-coral/30 transition hover:-translate-y-0.5"
            >
              Explore areas
            </a>
            <a
              href="#map"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-[#F5FDFB] backdrop-blur"
            >
              Browse the map
            </a>
          </div>
          <HeroPlanner regionNames={regionNames} />
        </div>
        <WaveDivider />
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative z-[3] -mt-16 grid grid-cols-2 gap-4 rounded-[20px] border border-lagoon-deep/10 bg-white p-6 shadow-xl shadow-lagoon-deep/10 sm:grid-cols-4">
          <div>
            <b className="block font-display text-2xl font-semibold text-lagoon-deep">
              {stats.totalSpots}
            </b>
            <span className="text-xs font-semibold text-ink/60">Named spots</span>
          </div>
          <div>
            <b className="block font-display text-2xl font-semibold text-lagoon-deep">
              {stats.totalAreas}
            </b>
            <span className="text-xs font-semibold text-ink/60">Beach areas</span>
          </div>
          <div>
            <b className="block font-display text-2xl font-semibold text-lagoon-deep">
              {stats.totalRegions}
            </b>
            <span className="text-xs font-semibold text-ink/60">Coastal regions</span>
          </div>
          <div>
            <b className="block font-display text-2xl font-semibold text-lagoon-deep">
              {stats.totalOperators}
            </b>
            <span className="text-xs font-semibold text-ink/60">Local operators</span>
          </div>
        </div>
      </div>

      <section id="explore" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-lagoon">Explore</span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Pick a beach area, then see exactly how to get in the water.
          </h2>
          <p className="mt-2 text-ink/70">
            Each area groups its named spots by how you actually reach them: shore, boat, or a booked
            tour, so you know what to plan for before you go.
          </p>
        </div>
        <AreaExplorer regions={regions} areas={areaCards} />
      </section>

      <section id="map" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-lagoon-deep/10 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-ink">See it on the map</h2>
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

      <section className="bg-[#F4EAD2] py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-9 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-lagoon">
              How it works
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
              Three steps between you and the reef.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <span className="font-display text-2xl font-semibold italic text-coral-deep">01</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                Pick an area or a reef
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                Browse by region, then by beach area. Each one lists its named spots grouped by
                access, so you can see your options at a glance.
              </p>
            </div>
            <div>
              <span className="font-display text-2xl font-semibold italic text-coral-deep">02</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                Check depth, access, and conditions
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                Every spot lists its depth range, difficulty, and a practical tip on timing or
                current, plus the full compare table if you want to filter every spot at once.
              </p>
            </div>
            <div>
              <span className="font-display text-2xl font-semibold italic text-coral-deep">03</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                Rent gear or book a boat
              </h3>
              <p className="mt-2 text-sm text-ink/70">
                For spots that need a boat or a tour, we link the real local operators who run
                there, with pricing where it is publicly listed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-[24px] bg-gradient-to-br from-lagoon-deep to-lagoon p-9 text-[#EAFBF8] sm:p-14">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#BFF2E8]">
            Good to know before you go
          </span>
          <p className="mt-4 max-w-2xl font-display text-xl font-medium italic leading-relaxed sm:text-2xl">
            Wind and swell affect visibility more than sunshine does. Check the marine forecast for
            wave height and wind direction, not just the weather app, and favor a calm, outgoing tide
            over a sunny sky.
          </p>
          <cite className="mt-5 block text-sm font-bold not-italic text-[#BFF2E8]">
            A habit worth building before any shore or boat snorkel trip
          </cite>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="mb-8 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-lagoon">
            Local operators
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Real shops renting gear and running trips
          </h2>
          <p className="mt-2 text-ink/70">
            Every operator here is a currently-operating business tied to spots in this guide. No
            placeholder listings and no estimated prices.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {operators.map((op) => (
            <div key={op.id} className="rounded-2xl border border-lagoon-deep/10 bg-white p-5 shadow-sm">
              <h3 className="font-display text-base font-semibold text-ink">{op.name}</h3>
              <p className="mt-2 text-sm text-ink/70">{op.notes}</p>
              {op.listings.length > 0 && (
                <p className="mt-3 text-xs font-bold text-lagoon-deep">
                  Serves: {op.listings.map((l) => l.spot?.name).filter(Boolean).join(', ')}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-ink/60">
                <span>
                  {op.price_from ? `From $${op.price_from} ${op.price_unit ?? ''}` : 'Contact for pricing'}
                </span>
                {op.website_url && (
                  <a href={op.website_url} target="_blank" rel="noreferrer" className="text-lagoon-deep underline">
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="flex flex-col gap-5 rounded-[24px] bg-coral p-9 text-[#241009] sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="max-w-md font-display text-2xl font-semibold sm:text-3xl">
              Know a spot or a shop we&rsquo;re missing?
            </h2>
            <p className="mt-2 max-w-md text-[#3A1A0F]">
              This guide only lists spots and operators we could verify. Flag a correction or a
              business we should add and we will check it out.
            </p>
          </div>
          <a
            href="https://github.com/williamauto/Snorkeling-website/issues/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-none items-center gap-2 rounded-full bg-[#241009] px-6 py-3.5 text-sm font-bold text-[#FFE9E2]"
          >
            Suggest an update
          </a>
        </div>
      </section>
    </div>
  );
}
