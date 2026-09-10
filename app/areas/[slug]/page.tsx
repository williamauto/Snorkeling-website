import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllAreaSlugs, getAreaBySlug } from '@/lib/supabase';
import MapClientLoader from '@/components/MapClientLoader';
import type { MapMarker } from '@/components/MapView';
import SpotCard from '@/components/SpotCard';
import { ACCESS_GROUP_HINT, ACCESS_GROUP_LABEL } from '@/components/SpotVisuals';

export async function generateStaticParams() {
  const slugs = await getAllAreaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const area = await getAreaBySlug(params.slug);
  if (!area) return {};
  return {
    title: `${area.name} Snorkeling: Spots, Access & Depth | Snorkeling Miami`,
    description: area.blurb ?? undefined,
  };
}

const ACCESS_ORDER = ['shore', 'mixed', 'boat', 'tour_required', 'permit_required'];

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

  const groups = ACCESS_ORDER.map((accessType) => ({
    accessType,
    spots: area.spots.filter((s) => s.access_type === accessType),
  })).filter((g) => g.spots.length > 0);

  return (
    <div>
      <section className="bg-[#F4EAD2] py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.1em] text-lagoon-deep">
            &larr; All areas
          </Link>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{area.name}</h1>
          <p className="mt-3 max-w-2xl text-ink/75">{area.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-ink/80">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">{area.access_note}</span>
            {area.entrance_fee_text && (
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">{area.entrance_fee_text}</span>
            )}
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              {area.spots.length} named spot{area.spots.length === 1 ? '' : 's'}
            </span>
          </div>

          {(area.best_time_text || area.getting_there) && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {area.best_time_text && (
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-lagoon-deep">
                    Best time to go
                  </p>
                  <p className="mt-1.5 text-sm text-ink/75">{area.best_time_text}</p>
                </div>
              )}
              {area.getting_there && (
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-lagoon-deep">
                    Getting there
                  </p>
                  <p className="mt-1.5 text-sm text-ink/75">{area.getting_there}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <MapClientLoader markers={markers} center={center} zoom={12} height={380} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <h2 className="font-display text-xl font-semibold text-ink">Ways to snorkel in {area.name}</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-ink/70">
          Spots are grouped by how you actually reach them, so you know what to plan for before you
          pick one.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {groups.map((g) => (
            <a
              key={g.accessType}
              href={`#group-${g.accessType}`}
              className="rounded-full border border-lagoon-deep/15 bg-white px-4 py-2 text-xs font-bold text-lagoon-deep hover:border-lagoon-deep"
            >
              {ACCESS_GROUP_LABEL[g.accessType]?.split(':')[0] ?? g.accessType} ({g.spots.length})
            </a>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-5 pb-20 sm:px-8">
        {groups.map((g) => (
          <section key={g.accessType} id={`group-${g.accessType}`} className="scroll-mt-24">
            <div className="mb-5 border-l-4 border-lagoon-deep/40 pl-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                {ACCESS_GROUP_LABEL[g.accessType] ?? g.accessType}
              </h3>
              <p className="mt-1 text-sm text-ink/60">{ACCESS_GROUP_HINT[g.accessType]}</p>
            </div>
            <div className="space-y-6">
              {g.spots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} regionSlug={area.region.slug} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {area.areaSources.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="rounded-2xl border border-lagoon-deep/10 bg-white p-5 text-xs text-ink/50">
            Area sources:{' '}
            {area.areaSources.map((s, i) => (
              <span key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                  {s.title ?? s.url}
                </a>
                {i < area.areaSources.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
