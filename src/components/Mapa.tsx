'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Ponto = {
  lat: number;
  lon: number;
  bairro: string;
};

export default function Mapa({ pontos }: { pontos: Ponto[] }) {
  return (
    <MapContainer
      center={[-23.55, -46.63]}
      zoom={11}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {pontos.map((ponto, idx) => (
        <Marker key={idx} position={[ponto.lat, ponto.lon]}>
          <Popup>{ponto.bairro}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}