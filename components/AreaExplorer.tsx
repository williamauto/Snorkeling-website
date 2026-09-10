'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Area, Region } from '@/lib/supabase';
import { ACCESS_GROUP_LABEL, REGION_GRADIENT } from './SpotVisuals';

export interface AreaCardData extends Area {
  regionSlug: string;
  regionName: string;
  spotCount: number;
  dominantAccess: string;
}

export default function AreaExplorer({
  regions,
  areas,
}: {
  regions: Region[];
  areas: AreaCardData[];
}) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () => (filter === 'all' ? areas : areas.filter((a) => a.regionSlug === filter)),
    [areas, filter]
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2.5" role="group" aria-label="Filter by region">
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
            filter === 'all'
              ? 'border-lagoon-deep bg-lagoon-deep text-[#EAFBF8]'
              : 'border-lagoon-deep/15 bg-white text-ink/70 hover:border-lagoon-deep hover:text-lagoon-deep'
          }`}
        >
          All regions
        </button>
        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setFilter(r.slug)}
            aria-pressed={filter === r.slug}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
              filter === r.slug
                ? 'border-lagoon-deep bg-lagoon-deep text-[#EAFBF8]'
                : 'border-lagoon-deep/15 bg-white text-ink/70 hover:border-lagoon-deep hover:text-lagoon-deep'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((area) => {
          const [c1, c2] = REGION_GRADIENT[area.regionSlug] ?? ['#0E7C82', '#0A5257'];
          return (
            <Link
              key={area.id}
              href={`/areas/${area.slug}/`}
              className="group flex flex-col overflow-hidden rounded-[18px] border border-lagoon-deep/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="relative flex h-[100px] items-end p-3.5"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#082a2d]/35 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-[#F5FDFB] backdrop-blur-sm">
                  {area.regionName}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-4.5 px-5 py-4">
                <h3 className="font-display text-lg font-semibold text-ink group-hover:text-lagoon-deep">
                  {area.name}
                </h3>
                <p className="text-sm text-ink/70">{area.blurb}</p>
                <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-bold text-lagoon-deep">
                  <span className="rounded-full bg-lagoon-deep/8 px-2.5 py-1">
                    {area.spotCount} spot{area.spotCount === 1 ? '' : 's'}
                  </span>
                  <span className="rounded-full bg-lagoon-deep/8 px-2.5 py-1">
                    {ACCESS_GROUP_LABEL[area.dominantAccess]?.split(':')[0] ?? area.dominantAccess}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-lagoon-deep/10 pt-3 text-xs font-bold text-ink/60">
                  <span>{area.entrance_fee_text ?? 'See area for fees'}</span>
                  <span aria-hidden="true" className="text-lagoon-deep">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
