import { getAllSpotsForCompare } from '@/lib/supabase';
import CompareTable, { type CompareRow } from '@/components/CompareTable';

export const metadata = {
  title: 'Compare Every Snorkeling Spot | Snorkeling Miami',
  description:
    'Every named snorkeling spot from Lauderdale-by-the-Sea to Islamorada in one table -- access type, depth, difficulty, and marine life.',
};

export default async function ComparePage() {
  const spots = await getAllSpotsForCompare();

  const rows: CompareRow[] = spots.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    areaName: s.area?.name ?? '',
    areaSlug: s.area?.slug ?? '',
    regionName: s.region?.name ?? '',
    accessType: s.access_type,
    difficulty: s.difficulty,
    depthMin: s.depth_min_ft,
    depthMax: s.depth_max_ft,
    marineLife: s.marine_life ?? [],
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-lagoon">The full corridor</span>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Compare every spot, Lauderdale-by-the-Sea to Islamorada
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Filter by region or access type to find a spot that matches how you want to snorkel -- walk-in and free,
        or a booked boat trip to a protected reef.
      </p>
      <div className="mt-8">
        <CompareTable rows={rows} />
      </div>
    </div>
  );
}
