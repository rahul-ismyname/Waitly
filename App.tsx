
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Place, CrowdLevel, PlaceType, UserQueue, CounterInfo } from './types';
import { MOCK_PLACES } from './constants';
import { getCrowdAdvice } from './geminiService';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';
import { PlaceDetails } from './PlaceDetails';
import { AddPlaceModal, AddWaitTimeModal, TicketsModal } from './Modals';

declare const L: any;

const STORAGE_KEY = 'waitly_places_db';
const INITIAL_CENTER: [number, number] = [28.6139, 77.2090];

const App: React.FC = () => {
  // --- State ---
  const [places, setPlaces] = useState<Place[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : MOCK_PLACES;
  });
  
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(places[0]?.id || '');
  const [userQueues, setUserQueues] = useState<UserQueue[]>([]);
  const [showAddWaitModal, setShowAddWaitModal] = useState(false);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string[]>([]);
  const [isJoiningQueue, setIsJoiningQueue] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [formWaitTimes, setFormWaitTimes] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{lat: number, lng: number} | null>(null);
  const mapInstance = useRef<any>(null);

  // New Place Form State
  const [newPlace, setNewPlace] = useState<Partial<Place>>({
    name: '',
    type: PlaceType.BANK,
    address: '',
    openingTime: '09:00',
    closingTime: '18:00',
    isApproved: false
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  }, [places]);

  // --- Derived State ---
  const selectedPlace = useMemo(() => 
    places.find(p => p.id === selectedPlaceId)
  , [selectedPlaceId, places]);

  const activeQueueForSelected = useMemo(() => 
    userQueues.find(q => q.placeId === selectedPlaceId)
  , [userQueues, selectedPlaceId]);

  const isOpenStatus = useMemo(() => {
    if (!selectedPlace) return false;
    const now = new Date();
    const [openH, openM] = selectedPlace.openingTime.split(':').map(Number);
    const [closeH, closeM] = selectedPlace.closingTime.split(':').map(Number);
    const openDate = new Date(); openDate.setHours(openH, openM, 0);
    const closeDate = new Date(); closeDate.setHours(closeH, closeM, 0);
    return now >= openDate && now <= closeDate;
  }, [selectedPlace]);

  // --- Helpers ---
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getEstimatedServiceTime = (waitMins: number) => {
    const now = new Date();
    return new Date(now.getTime() + waitMins * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLocateUser = (map: any) => {
    if (!map) { showNotification("Map is still loading.", "error"); return; }
    setIsLocating(true);
    if (!navigator.geolocation) { showNotification("Geolocation not supported.", "error"); setIsLocating(false); return; }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const userIcon = L.divIcon({ className: 'user-location-marker', html: `<div class="relative flex items-center justify-center"><div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-ping"></div><div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl"></div></div>`, iconSize: [32, 32], iconAnchor: [16, 16] });
        L.marker([latitude, longitude], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        L.circle([latitude, longitude], { radius: accuracy, color: '#3b82f6', fillOpacity: 0.15, weight: 1 }).addTo(map);
        map.flyTo([latitude, longitude], 15, { duration: 1.5 });
        showNotification("Location found!");
        setIsLocating(false);
      },
      () => { showNotification("Unable to retrieve location.", "error"); setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // --- Handlers ---
  const handleAddPlaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapInstance.current) return;
    const coords = pendingCoords || { lat: mapInstance.current.getCenter().lat, lng: mapInstance.current.getCenter().lng };
    const id = Date.now().toString();
    
    let defaultCounters: CounterInfo[] = [{ name: 'Main Desk', waitTime: 10, color: 'bg-green-500' }];
    const newPlaceObj: Place = {
      ...newPlace as Place,
      id, rating: 4.5, distance: 'Just added', crowdLevel: CrowdLevel.LOW,
      counters: defaultCounters, lastUpdated: 'Just now', accuracyScore: 100,
      coordinates: { x: coords.lat, y: coords.lng }
    };

    setPlaces(prev => [...prev, newPlaceObj]);
    setSelectedPlaceId(id);
    setShowAddPlaceModal(false);
    setPendingCoords(null);
    showNotification(`Successfully added ${newPlaceObj.name}!`);
  };

  const handleRemovePlace = (id: string) => {
    if (window.confirm("Delete this location?")) {
      const filtered = places.filter(p => p.id !== id);
      setPlaces(filtered);
      setSelectedPlaceId(filtered[0]?.id || '');
      showNotification("Location removed.");
    }
  };

  const handleJoinQueue = () => {
    if (!selectedPlace) { showNotification("Select a location first.", "error"); return; }
    if (!selectedPlace.isApproved) { showNotification("Queue not enabled.", "error"); return; }
    if (!isOpenStatus) { showNotification("Store is closed.", "error"); return; }
    
    setIsJoiningQueue(true);
    setTimeout(() => {
      const waitTime = selectedPlace.counters[0]?.waitTime || 30;
      const newQueue: UserQueue = {
        placeId: selectedPlace.id, placeName: selectedPlace.name,
        tokenNumber: `W-${Math.floor(Math.random() * 900) + 100}`,
        position: Math.floor(waitTime / 4) + 1, estimatedWait: waitTime, status: 'waiting'
      };
      setUserQueues(prev => [...prev, newQueue]);
      setIsJoiningQueue(false);
      showNotification(`Joined queue for ${selectedPlace.name}!`);
    }, 1200);
  };

  const handleLeaveQueue = (placeId: string) => {
    setUserQueues(prev => prev.filter(q => q.placeId !== placeId));
    showNotification("Left the queue.");
  };

  const handleAddWaitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) return;
    setPlaces(prev => prev.map(p => {
      if (p.id === selectedPlaceId) {
        const updatedCounters = p.counters.map(c => ({
          ...c, waitTime: formWaitTimes[c.name] ?? c.waitTime,
          color: (formWaitTimes[c.name] ?? c.waitTime) < 15 ? 'bg-green-500' : (formWaitTimes[c.name] ?? c.waitTime) < 30 ? 'bg-yellow-500' : 'bg-red-500'
        }));
        return { ...p, counters: updatedCounters, lastUpdated: 'Just now' };
      }
      return p;
    }));
    setShowAddWaitModal(false);
    showNotification("Data updated.");
  };

  useEffect(() => {
    getCrowdAdvice(places).then(setAiAdvice);
  }, [places]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[2000] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-in ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <Header 
        onHome={() => { setSelectedPlaceId(''); if (mapInstance.current) mapInstance.current.flyTo(INITIAL_CENTER, 13); }}
        onJoinQueue={handleJoinQueue}
        onAddWaitTime={() => selectedPlace ? setShowAddWaitModal(true) : showNotification("Select a place first", "error")}
        onShowTickets={() => setShowTicketsModal(true)}
        ticketCount={userQueues.length}
      />

      <main className="flex-1 flex overflow-hidden">
        <Sidebar 
          places={places} 
          selectedPlaceId={selectedPlaceId} 
          onSelectPlace={setSelectedPlaceId} 
          aiAdvice={aiAdvice} 
        />

        <div className="flex-1 flex flex-col md:flex-row relative">
          <MapView 
            places={places} 
            selectedPlaceId={selectedPlaceId} 
            onSelectPlace={setSelectedPlaceId}
            onDblClick={(lat, lng) => { setPendingCoords({ lat, lng }); setShowAddPlaceModal(true); }}
            onLocate={handleLocateUser}
            isLocating={isLocating}
            initialCenter={INITIAL_CENTER}
            onMapInit={(map) => { mapInstance.current = map; }}
          />

          <PlaceDetails 
            selectedPlace={selectedPlace}
            isOpenStatus={isOpenStatus}
            activeQueue={activeQueueForSelected}
            isJoiningQueue={isJoiningQueue}
            onRemovePlace={handleRemovePlace}
            onJoinQueue={handleJoinQueue}
            onAddWaitTime={() => setShowAddWaitModal(true)}
            onLeaveQueue={handleLeaveQueue}
            getEstimatedServiceTime={getEstimatedServiceTime}
          />
        </div>
      </main>

      {showAddPlaceModal && (
        <AddPlaceModal 
          onClose={() => { setShowAddPlaceModal(false); setPendingCoords(null); }}
          onSubmit={handleAddPlaceSubmit}
          newPlace={newPlace}
          setNewPlace={setNewPlace}
        />
      )}

      {showAddWaitModal && selectedPlace && (
        <AddWaitTimeModal 
          onClose={() => setShowAddWaitModal(false)}
          onSubmit={handleAddWaitSubmit}
          selectedPlace={selectedPlace}
          formWaitTimes={formWaitTimes}
          setFormWaitTimes={setFormWaitTimes}
        />
      )}

      {showTicketsModal && (
        <TicketsModal 
          onClose={() => setShowTicketsModal(false)}
          userQueues={userQueues}
          onLeaveQueue={handleLeaveQueue}
        />
      )}
    </div>
  );
};

export default App;
