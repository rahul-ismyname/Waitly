
import React, { useEffect, useRef } from 'react';
import { Place, CrowdLevel } from './types';

declare const L: any;

interface MapViewProps {
  places: Place[];
  selectedPlaceId: string;
  onSelectPlace: (id: string) => void;
  onDblClick: (lat: number, lng: number) => void;
  onLocate: (map: any) => void;
  isLocating: boolean;
  initialCenter: [number, number];
  onMapInit: (map: any) => void;
}

export const MapView: React.FC<MapViewProps> = ({ 
  places, selectedPlaceId, onSelectPlace, onDblClick, onLocate, isLocating, initialCenter, onMapInit 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const leafletMap = L.map(mapRef.current, {
        center: initialCenter,
        zoom: 13,
        zoomControl: false,
        doubleClickZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(leafletMap);

      L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

      leafletMap.on('dblclick', (e: any) => {
        const { lat, lng } = e.latlng;
        onDblClick(lat, lng);
      });

      mapInstance.current = leafletMap;
      onMapInit(leafletMap);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('dblclick');
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Sync Markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    places.forEach(place => {
      const lat = place.coordinates.x;
      const lng = place.coordinates.y;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const isSelected = place.id === selectedPlaceId;
      const colorClass = place.crowdLevel === CrowdLevel.LOW ? '#10b981' : 
                         place.crowdLevel === CrowdLevel.MEDIUM ? '#f59e0b' : '#ef4444';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="custom-marker ${isSelected ? 'selected-marker' : ''}">
                <div class="marker-pin" style="background-color: ${colorClass};"></div>
                <div class="marker-label">${place.name} • ${place.counters[0]?.waitTime || 0}m</div>
               </div>`,
        iconSize: [40, 60],
        iconAnchor: [20, 50]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map).on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        onSelectPlace(place.id);
      });
      markersRef.current[place.id] = marker;
    });
  }, [places, selectedPlaceId]);

  return (
    <div className="flex-1 relative bg-gray-100 z-0 overflow-hidden">
      <div ref={mapRef} className="w-full h-full z-0 cursor-crosshair" />
      <div className="absolute top-4 right-4 z-[1001]">
        <button 
          onClick={() => onLocate(mapInstance.current)} 
          disabled={isLocating} 
          className="bg-white p-3.5 rounded-2xl shadow-2xl border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-blue-600 disabled:opacity-50"
        >
          {isLocating ? (
            <div className="w-6 h-6 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
