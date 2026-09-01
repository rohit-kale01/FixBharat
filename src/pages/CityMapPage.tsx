import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Filter, MapPin, AlertTriangle, Construction, Trash2, Lightbulb, Droplets, TreePine } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import type { Complaint, IssueCategory, Priority } from '@/types';

// Fix default marker icons for Leaflet in bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeMarker(priority: Priority, status: string): L.DivIcon {
  const isResolved = status === 'RESOLVED';
  const colorClass = isResolved ? 'resolved' : priority === 'HIGH' ? 'high' : priority === 'MEDIUM' ? 'medium' : 'low';
  return L.divIcon({
    className: 'custom-marker-wrapper',
    html: `<div style="position:relative;"><div class="marker-pulse" style="background:${isResolved ? '#22c55e' : priority === 'HIGH' ? '#ef4444' : '#f59e0b'};"></div><div class="custom-marker ${colorClass}"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

const filterOptions: { label: string; value: IssueCategory | 'ALL'; icon: typeof Filter }[] = [
  { label: 'All', value: 'ALL', icon: Filter },
  { label: 'Potholes', value: 'Pothole', icon: Construction },
  { label: 'Garbage', value: 'Garbage', icon: Trash2 },
  { label: 'Streetlights', value: 'Broken Streetlight', icon: Lightbulb },
  { label: 'Water', value: 'Water Leakage', icon: Droplets },
  { label: 'Road Damage', value: 'Road Damage', icon: Construction },
  { label: 'Fallen Trees', value: 'Fallen Tree', icon: TreePine },
];

function MapBounds({ complaints }: { complaints: Complaint[] }) {
  const map = useMap();
  useEffect(() => {
    if (complaints.length > 0) {
      const bounds = L.latLngBounds(complaints.map((c) => [c.location.latitude, c.location.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, complaints]);
  return null;
}

export default function CityMapPage() {
  const { complaints } = useApp();
  const [filter, setFilter] = useState<IssueCategory | 'ALL'>('ALL');
  const [mapLoaded, setMapLoaded] = useState(false);

  const filtered = filter === 'ALL' ? complaints : complaints.filter((c) => c.issue === filter);

  const stats = {
    high: complaints.filter((c) => c.priority === 'HIGH' && c.status !== 'RESOLVED').length,
    medium: complaints.filter((c) => c.priority === 'MEDIUM' && c.status !== 'RESOLVED').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
  };

  return (
    <div className="section-container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">City Map</h1>
          <p className="text-sm text-navy-500">Real-time civic complaint locations across the city</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /> <span className="text-navy-600">High ({stats.high})</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500" /> <span className="text-navy-600">Medium ({stats.medium})</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /> <span className="text-navy-600">Resolved ({stats.resolved})</span></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <span className="text-sm text-navy-500 font-medium shrink-0 flex items-center gap-1.5"><Filter className="w-4 h-4" /> Filter:</span>
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
              filter === opt.value ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
            }`}
          >
            <opt.icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="card overflow-hidden p-0 h-[600px] relative">
        {!mapLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-navy-50">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-navy-200 border-t-saffron-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-navy-500">Loading map...</p>
            </div>
          </div>
        )}
        <MapContainer
          center={[28.7460, 77.1310]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapLoaded(true)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapBounds complaints={filtered} />
          {filtered.map((c) => (
            <Marker key={c.id} position={[c.location.latitude, c.location.longitude]} icon={makeMarker(c.priority, c.status)}>
              <Popup>
                <div className="p-2 min-w-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-navy-400">#{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="font-semibold text-navy-900 text-sm mb-1">{c.issue}</p>
                  <p className="text-xs text-navy-500 mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location.nearbyRoad}, {c.location.area}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <PriorityBadge priority={c.priority} />
                    <span className="text-xs text-navy-500">{c.department}</span>
                  </div>
                  <Link to={`/complaint/${c.id}`} className="text-xs text-saffron-600 font-semibold hover:underline">
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* List below map */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Link key={c.id} to={`/complaint/${c.id}`} className="card-hover p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-navy-400">{c.id}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="font-semibold text-navy-900 text-sm">{c.issue}</p>
            <p className="text-xs text-navy-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location.area}</p>
            <div className="mt-2"><PriorityBadge priority={c.priority} /></div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-10 h-10 text-navy-300 mx-auto mb-3" />
          <p className="text-navy-500">No complaints found for this filter.</p>
        </div>
      )}
    </div>
  );
}
