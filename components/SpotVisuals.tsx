export const REGION_GRADIENT: Record<string, [string, string]> = {
  'fort-lauderdale-area': ['#12AA9C', '#0A5257'],
  miami: ['#FF9E7F', '#0A5257'],
  'florida-keys': ['#0B6E76', '#0A5257'],
};

export const REGION_COLOR: Record<string, string> = {
  'fort-lauderdale-area': '#12AA9C',
  miami: '#E67F5C',
  'florida-keys': '#0A5257',
};

export const ACCESS_GROUP_LABEL: Record<string, string> = {
  shore: 'Shore access: walk right in',
  boat: 'Boat access',
  tour_required: 'Tour required',
  permit_required: 'Permit required',
  mixed: 'Mixed access',
};

export const ACCESS_GROUP_HINT: Record<string, string> = {
  shore: 'No boat or tour needed. Park, walk to the water, and swim out.',
  boat: 'Reachable by private boat or a charter that will run you out and back.',
  tour_required: 'Booked through a licensed operator; usually not open to private boats.',
  permit_required: 'Open water, but a park entrance fee or permit applies before you get in.',
  mixed: 'Reachable more than one way, by tour, private boat, or kayak depending on conditions.',
};

const ICON_PATHS: Record<string, string> = {
  reef: '<path d="M4 20c8-2 14-8 16-16-8 2-14 8-16 16Z" fill="#fff" fill-opacity=".92"/>',
  wreck:
    '<path d="M4 15h16l-2 5H6l-2-5Z" fill="#fff" fill-opacity=".92"/><path d="M12 3v10M8 8l4-5 4 5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  artificial_reef:
    '<circle cx="12" cy="8" r="3" fill="#fff" fill-opacity=".92"/><path d="M12 11v10M8 21h8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
  park: '<path d="M12 3 6 13h3l-3 8h12l-3-8h3L12 3Z" fill="#fff" fill-opacity=".92"/>',
  ledge: '<path d="M3 18h4l3-8 3 5 3-9 5 12H3Z" fill="#fff" fill-opacity=".92"/>',
};

export function spotTypeIconSvg(spotType: string) {
  return ICON_PATHS[spotType] ?? ICON_PATHS.reef;
}

export const SPOT_TYPE_LABEL: Record<string, string> = {
  reef: 'Reef',
  wreck: 'Wreck',
  artificial_reef: 'Artificial reef',
  park: 'Park',
  ledge: 'Ledge',
};
