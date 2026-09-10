'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  href?: string;
  color?: string;
  subtitle?: string;
}

function pinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div class="wfc-marker-pin" style="background:${color}"><span>🤿</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

export default function MapView({
  markers,
  center,
  zoom,
  height = 420,
}: {
  markers: MapMarker[];
  center: [number, number];
  zoom: number;
  height?: number;
}) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-lagoon-deep/15 shadow-sm">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={pinIcon(m.color ?? '#0E7C82')}>
            <Popup>
              <div className="font-body text-sm">
                <p className="font-semibold text-ink">{m.name}</p>
                {m.subtitle && <p className="text-ink/70">{m.subtitle}</p>}
                {m.href && (
                  <Link href={m.href} className="mt-1 inline-block font-semibold text-lagoon-deep underline">
                    View spots &rarr;
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
