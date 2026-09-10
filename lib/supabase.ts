import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing SUPABASE_URL / SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your project credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AccessType = 'shore' | 'boat' | 'tour_required' | 'permit_required' | 'mixed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type SpotType = 'reef' | 'wreck' | 'artificial_reef' | 'park' | 'ledge';

export interface Region {
  id: string;
  slug: string;
  name: string;
  blurb: string | null;
  sort_order: number;
}

export interface Area {
  id: string;
  region_id: string;
  slug: string;
  name: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  blurb: string | null;
  access_note: string | null;
  entrance_fee_text: string | null;
  sort_order: number;
}

export interface Spot {
  id: string;
  area_id: string;
  slug: string;
  name: string;
  spot_type: SpotType;
  access_type: AccessType;
  access_summary: string | null;
  difficulty: Difficulty | null;
  depth_min_ft: number | null;
  depth_max_ft: number | null;
  marine_life: string[] | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  coord_precision: 'exact' | 'approximate' | 'area_level';
  entrance_fee_text: string | null;
  sort_order: number;
}

export interface Operator {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  price_from: number | null;
  price_unit: string | null;
  notes: string | null;
}

export interface SpotOperator {
  id: string;
  spot_id: string;
  operator_id: string;
  tour_name: string | null;
  price: number | null;
  highlights: string | null;
  operator: Operator;
}

export interface Source {
  id: string;
  url: string;
  title: string | null;
  note: string | null;
}

export async function getRegionsWithAreas(): Promise<(Region & { areas: Area[] })[]> {
  const { data: regions, error: regionsError } = await supabase
    .from('regions')
    .select('*')
    .order('sort_order');
  if (regionsError) throw regionsError;

  const { data: areas, error: areasError } = await supabase
    .from('areas')
    .select('*')
    .order('sort_order');
  if (areasError) throw areasError;

  return (regions ?? []).map((region) => ({
    ...region,
    areas: (areas ?? []).filter((a) => a.region_id === region.id),
  }));
}

export async function getAllAreaSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from('areas').select('slug');
  if (error) throw error;
  return (data ?? []).map((a) => a.slug);
}

export interface AreaWithSpots extends Area {
  region: Region;
  spots: (Spot & { operators: SpotOperator[]; sources: Source[] })[];
  areaSources: Source[];
}

export async function getAreaBySlug(slug: string): Promise<AreaWithSpots | null> {
  const { data: area, error: areaError } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .single();
  if (areaError || !area) return null;

  const { data: region } = await supabase.from('regions').select('*').eq('id', area.region_id).single();

  const { data: spots, error: spotsError } = await supabase
    .from('spots')
    .select('*')
    .eq('area_id', area.id)
    .order('sort_order');
  if (spotsError) throw spotsError;

  const spotIds = (spots ?? []).map((s) => s.id);

  const { data: spotOperatorRows } = await supabase
    .from('spot_operators')
    .select('*, operator:operators(*)')
    .in('spot_id', spotIds.length ? spotIds : ['00000000-0000-0000-0000-000000000000']);

  const { data: sourceRows } = await supabase
    .from('sources')
    .select('*')
    .or(
      `area_id.eq.${area.id}${spotIds.length ? ',spot_id.in.(' + spotIds.join(',') + ')' : ''}`
    );

  const enrichedSpots = (spots ?? []).map((spot) => ({
    ...spot,
    operators: (spotOperatorRows ?? []).filter((so: any) => so.spot_id === spot.id) as SpotOperator[],
    sources: (sourceRows ?? []).filter((s: any) => s.spot_id === spot.id) as Source[],
  }));

  const areaSources = (sourceRows ?? []).filter((s: any) => s.area_id === area.id && !s.spot_id) as Source[];

  return {
    ...area,
    region: region as Region,
    spots: enrichedSpots,
    areaSources,
  };
}

export async function getAllSpotsForCompare(): Promise<
  (Spot & { area: Area; region: Region })[]
> {
  const { data: spots, error } = await supabase.from('spots').select('*').order('sort_order');
  if (error) throw error;

  const { data: areas } = await supabase.from('areas').select('*');
  const { data: regions } = await supabase.from('regions').select('*');

  return (spots ?? []).map((spot) => {
    const area = (areas ?? []).find((a) => a.id === spot.area_id) as Area;
    const region = (regions ?? []).find((r) => r.id === area?.region_id) as Region;
    return { ...spot, area, region };
  });
}
