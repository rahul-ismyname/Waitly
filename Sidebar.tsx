
import React from 'react';
import { Place } from './types';
import { PlaceIcon } from './PlaceIcon';

interface SidebarProps {
  places: Place[];
  selectedPlaceId: string;
  onSelectPlace: (id: string) => void;
  aiAdvice: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  places, selectedPlaceId, onSelectPlace, aiAdvice 
}) => {
  return (
    <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto hidden lg:block shadow-sm z-10">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Nearby Locations</h2>
          <div className="group relative">
            <svg className="w-5 h-5 text-blue-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute right-0 w-48 p-2 bg-gray-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              Double-click anywhere on the map to add a new place.
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {places.length === 0 ? (
            <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 font-medium">No locations yet. Double-click the map to add places!</p>
            </div>
          ) : (
            places.map(place => (
              <button
                key={place.id}
                onClick={() => onSelectPlace(place.id)}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                  selectedPlaceId === place.id ? 'bg-blue-50 border border-blue-100 shadow-sm' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <PlaceIcon type={place.type} active={selectedPlaceId === place.id} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`font-semibold truncate text-sm ${selectedPlaceId === place.id ? 'text-blue-900' : 'text-gray-900'}`}>{place.name}</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{place.distance}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">{place.address}</p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-indigo-900 text-sm">AI Crowd Advice</h3>
          </div>
          <ul className="space-y-3">
            {aiAdvice.map((advice, i) => (
              <li key={i} className="text-xs text-indigo-800 bg-white/50 p-2 rounded-lg leading-relaxed border border-indigo-50">
                {advice}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
