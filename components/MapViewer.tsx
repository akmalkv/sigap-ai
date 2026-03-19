'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface Report {
  id: string;
  latitude: number;
  longitude: number;
  damageClass?: string;
  damage_class?: string;
  address: string;
  confidence: number;
  photo_url?: string;     
  heatmap_url?: string;   
}

export default function MapViewer({ reports }: { reports: Report[] }) {
  const iconBerat = L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-md"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const iconSedang = L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow-md"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const iconRingan = L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-6 h-6 rounded-full bg-green-600 border-2 border-white shadow-md"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const getIcon = (damageClass: string) => {
    if (damageClass === 'RUSAK_BERAT') return iconBerat;
    if (damageClass === 'RUSAK_SEDANG') return iconSedang;
    return iconRingan;
  };

  const centerLat = reports.length > 0 ? reports[0].latitude : -6.200000;
  const centerLng = reports.length > 0 ? reports[0].longitude : 106.816666;

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px', position: 'relative', zIndex: 0 }}>
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map((report) => {
          if (!report.latitude || !report.longitude) return null;

          const damageClass = report.damageClass || report.damage_class || 'RUSAK_RINGAN';
          const confPercent = Math.round((report.confidence || 0) * 100);

          const imageUrl = report.heatmap_url || report.photo_url;

          return (
            <Marker 
              key={report.id} 
              position={[report.latitude, report.longitude]} 
              icon={getIcon(damageClass)}
            >
              <Popup className="rounded-xl overflow-hidden p-0">
                <div className="w-[200px] flex flex-col">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Heatmap/Foto Laporan" 
                      className="w-full h-28 object-cover rounded-t-lg bg-gray-200"
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-100 flex items-center justify-center rounded-t-lg">
                      <span className="text-xs text-gray-400">Tidak ada gambar</span>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <p className={`font-bold text-sm mb-1 ${
                      damageClass === 'RUSAK_BERAT' ? 'text-red-700' : 
                      damageClass === 'RUSAK_SEDANG' ? 'text-orange-600' : 'text-green-700'
                    }`}>
                      {damageClass.replace('_', ' ')}
                    </p>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-snug">
                      {report.address}
                    </p>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold inline-block border border-gray-200">
                        AI Confidence: {confPercent}%
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  )
}