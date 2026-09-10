import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllAreaSlugs, getAreaBySlug } from '@/lib/supabase';
import MapClientLoader from '@/components/MapClientLoader';
import type { MapMarker } from '@/components/MapView';
import { AccessBadge, DifficultyBadge } from '@/components/Badge';

export async function generateStaticParams() {
  const slugs = await getAllAreaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const area = await getAreaBySlug(params.slug);
  if (!area) return {};
  return {
    title: `${area.name} Snorkeling -- Spots, Access & Depth | Snorkeling Miami`,
    description: area.blurb ?? undefined,
  };
}

export default async function AreaPage({ params }: { params: { slug: string } }) {
  const area = await getAreaBySlug(params.slug);
  if (!area) notFound();

  const markers: MapMarker[] = area.spots
    .filter((s) => s.latitude && s.longitude)
    .map((s) => ({
      id: s.id,
      name: s.name,
      lat: s.latitude as number,
      lng: s.longitude as number,
      color: '#0A5257',
      subtitle: `${s.access_type.replace('_', ' ')} · ${s.depth_min_ft ?? '?'}-${s.depth_max_ft ?? '?'} ft`,
    }));

  const center: [number, number] =
    markers.length > 0
      ? [markers[0].lat, markers[0].lng]
      : [area.latitude ?? 25.77, area.longitude ?? -80.19];

  return (
    <div>
      <section className="bg-bg-alt bg-[#F4EAD2] py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.1em] text-lagoon-deep">
            &larr; All areas
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{area.name}</h1>
          <p className="mt-3 max-w-2xl text-ink/75">{area.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-ink/80">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">{area.access_note}</span>
            {area.entrance_fee_text && (
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">{area.entrance_fee_text}</span>
            )}
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              {area.spots.length} named spot{area.spots.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <MapClientLoader markers={markers} center={center} zoom={12} height={380} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <h2 className="font-display text-xl font-semibold text-ink">Compare the spots in {area.name}</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-lagoon-deep/10">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-lagoon-deep/5 text-left text-xs font-bold uppercase tracking-wide text-ink/60">
                <th className="px-4 py-3">Spot</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Depth</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody>
              {area.spots.map((spot) => (
                <tr key={spot.id} className="border-t border-lagoon-deep/10">
                  <td className="px-4 py-3 font-semibold text-ink">
                    <a href={`#${spot.slug}`} className="hover:text-lagoon-deep">
                      {spot.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <AccessBadge type={spot.access_type} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink/80">
                    {spot.depth_min_ft ?? '?'}&ndash;{spot.depth_max_ft ?? '?'} ft
                  </td>
                  <td className="px-4 py-3">
                    <DifficultyBadge level={spot.difficulty} />
                  </td>
                  <td className="px-4 py-3 text-ink/70">{(spot.marine_life ?? []).slice(0, 2).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-5 pb-16 sm:px-8">
        {area.spots.map((spot) => (
          <article
            key={spot.id}
            id={spot.slug}
            className="scroll-mt-24 rounded-2xl border border-lagoon-deep/10 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-ink">{spot.name}</h3>
              <div className="flex flex-wrap gap-2">
                <AccessBadge type={spot.access_type} />
                <DifficultyBadge level={spot.difficulty} />
              </div>
            </div>
            <p className="mt-3 text-ink/80">{spot.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs font-bold uppercase text-ink/50">Depth</dt>
                <dd className="tabular-nums text-ink/80">
                  {spot.depth_min_ft ?? '?'}&ndash;{spot.depth_max_ft ?? '?'} ft
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-ink/50">Getting there</dt>
                <dd className="text-ink/80">{spot.access_summary}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-ink/50">Fee</dt>
                <dd className="text-ink/80">{spot.entrance_fee_text ?? 'None noted'}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-ink/50">Marine life</dt>
                <dd className="text-ink/80">{(spot.marine_life ?? []).join(', ') || 'Not documented'}</dd>
              </div>
            </dl>

            {spot.operators.length > 0 && (
              <div className="mt-5 border-t border-lagoon-deep/10 pt-4">
                <p className="text-xs font-bold uppercase text-ink/50">Book or rent gear</p>
                <ul className="mt-2 space-y-2">
                  {spot.operators.map((so) => (
                    <li key={so.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-ink">
                        {so.operator.name}
                        {so.tour_name ? ` -- ${so.tour_name}` : ''}
                      </span>
                      <span className="text-ink/70">
                        {so.price ? `$${so.price}${so.operator.price_unit ? ' ' + so.operator.price_unit : ''}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {spot.sources.length > 0 && (
              <div className="mt-4 border-t border-lagoon-deep/10 pt-3 text-xs text-ink/50">
                Source:{' '}
                {spot.sources.map((s, i) => (
                  <span key={s.id}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                      {s.title ?? s.url}
                    </a>
                    {i < spot.sources.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
