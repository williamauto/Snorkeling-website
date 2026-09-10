import { AccessBadge, DifficultyBadge } from './Badge';
import { REGION_GRADIENT, SPOT_TYPE_LABEL, spotTypeIconSvg } from './SpotVisuals';
import type { Source, Spot, SpotOperator } from '@/lib/supabase';

export default function SpotCard({
  spot,
  regionSlug,
}: {
  spot: Spot & { operators: SpotOperator[]; sources: Source[] };
  regionSlug: string;
}) {
  const [c1, c2] = REGION_GRADIENT[regionSlug] ?? ['#0E7C82', '#0A5257'];

  return (
    <article
      id={spot.slug}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-lagoon-deep/10 bg-white shadow-sm"
    >
      <div
        className="flex h-16 items-center justify-between px-6"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        <span className="inline-flex items-center gap-2 text-sm font-bold text-[#F5FDFB]">
          <svg width="20" height="20" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: spotTypeIconSvg(spot.spot_type) }} />
          {SPOT_TYPE_LABEL[spot.spot_type] ?? spot.spot_type}
        </span>
        <div className="flex flex-wrap gap-2">
          <AccessBadge type={spot.access_type} />
          <DifficultyBadge level={spot.difficulty} />
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{spot.name}</h3>
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

        {spot.tips && (
          <div className="mt-4 rounded-xl bg-sand/25 px-4 py-3 text-sm text-ink/80">
            <span className="font-bold text-lagoon-deep">Tip: </span>
            {spot.tips}
          </div>
        )}

        {spot.operators.length > 0 && (
          <div className="mt-5 border-t border-lagoon-deep/10 pt-4">
            <p className="text-xs font-bold uppercase text-ink/50">Book or rent gear</p>
            <ul className="mt-2 space-y-2">
              {spot.operators.map((so) => (
                <li key={so.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-ink">
                    {so.operator.name}
                    {so.tour_name ? `: ${so.tour_name}` : ''}
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
      </div>
    </article>
  );
}
