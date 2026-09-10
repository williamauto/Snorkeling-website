'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AccessBadge, DifficultyBadge } from './Badge';
import { ACCESS_GROUP_LABEL } from './SpotVisuals';

export interface CompareRow {
  id: string;
  slug: string;
  name: string;
  areaName: string;
  areaSlug: string;
  regionName: string;
  accessType: string;
  difficulty: string | null;
  depthMin: number | null;
  depthMax: number | null;
  marineLife: string[];
}

export default function CompareTable({ rows }: { rows: CompareRow[] }) {
  const searchParams = useSearchParams();
  const [region, setRegion] = useState(searchParams.get('region') ?? 'all');
  const [access, setAccess] = useState(searchParams.get('access') ?? 'all');
  const [query, setQuery] = useState('');

  const regions = useMemo(() => Array.from(new Set(rows.map((r) => r.regionName))), [rows]);
  const accessTypes = useMemo(() => Array.from(new Set(rows.map((r) => r.accessType))), [rows]);

  const filtered = rows.filter((r) => {
    if (region !== 'all' && r.regionName !== region) return false;
    if (access !== 'all' && r.accessType !== access) return false;
    if (query && !r.name.toLowerCase().includes(query.toLowerCase()) && !r.areaName.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a spot or area..."
          className="rounded-full border border-lagoon-deep/20 px-4 py-2 text-sm"
        />
        <span className="ml-auto self-center text-sm font-semibold text-ink/60">
          {filtered.length} of {rows.length} spots
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter by region">
        <button
          type="button"
          onClick={() => setRegion('all')}
          aria-pressed={region === 'all'}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${
            region === 'all'
              ? 'border-lagoon-deep bg-lagoon-deep text-[#EAFBF8]'
              : 'border-lagoon-deep/15 bg-white text-ink/70'
          }`}
        >
          All regions
        </button>
        {regions.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegion(r)}
            aria-pressed={region === r}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${
              region === r
                ? 'border-lagoon-deep bg-lagoon-deep text-[#EAFBF8]'
                : 'border-lagoon-deep/15 bg-white text-ink/70'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by access type">
        <button
          type="button"
          onClick={() => setAccess('all')}
          aria-pressed={access === 'all'}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${
            access === 'all'
              ? 'border-coral-deep bg-coral text-[#241009]'
              : 'border-lagoon-deep/15 bg-white text-ink/70'
          }`}
        >
          Any access type
        </button>
        {accessTypes.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAccess(a)}
            aria-pressed={access === a}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold ${
              access === a
                ? 'border-coral-deep bg-coral text-[#241009]'
                : 'border-lagoon-deep/15 bg-white text-ink/70'
            }`}
          >
            {ACCESS_GROUP_LABEL[a]?.split(':')[0] ?? a.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-lagoon-deep/10">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="bg-lagoon-deep/5 text-left text-xs font-bold uppercase tracking-wide text-ink/60">
              <th className="px-4 py-3">Spot</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Depth</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Marine life</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-lagoon-deep/10 hover:bg-foam">
                <td className="px-4 py-3 font-semibold text-ink">
                  <Link href={`/areas/${row.areaSlug}/#${row.slug}`} className="hover:text-lagoon-deep">
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/areas/${row.areaSlug}/`} className="text-lagoon-deep hover:underline">
                    {row.areaName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/70">{row.regionName}</td>
                <td className="px-4 py-3">
                  <AccessBadge type={row.accessType} />
                </td>
                <td className="px-4 py-3 tabular-nums text-ink/80">
                  {row.depthMin ?? '?'}&ndash;{row.depthMax ?? '?'} ft
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge level={row.difficulty} />
                </td>
                <td className="px-4 py-3 text-ink/70">{row.marineLife.slice(0, 3).join(', ')}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                  No spots match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
