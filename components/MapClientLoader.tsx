'use client';

import dynamic from 'next/dynamic';
import type { MapMarker } from './MapView';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-lagoon-deep/15 bg-lagoon-deep/5 text-sm font-semibold text-lagoon-deep">
      Loading map…
    </div>
  ),
});

export default function MapClientLoader(props: {
  markers: MapMarker[];
  center: [number, number];
  zoom: number;
  height?: number;
}) {
  return <MapView {...props} />;
}
