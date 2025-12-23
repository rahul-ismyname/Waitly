
import React from 'react';
import { Place, PlaceType, UserQueue } from './types';

interface AddPlaceModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newPlace: Partial<Place>;
  setNewPlace: (p: Partial<Place>) => void;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ onClose, onSubmit, newPlace, setNewPlace }) => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="bg-white rounded-3xl w-full max-w-lg relative p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
      <h3 className="text-2xl font-bold mb-1">Add Location</h3>
      <p className="text-xs text-gray-400 mb-6 font-medium">Capture details for the double-clicked point.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Place Name</label>
          <input required type="text" value={newPlace.name} onChange={e => setNewPlace({...newPlace, name: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 border outline-none" placeholder="e.g. My Neighborhood Cafe" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Category</label>
            <select value={newPlace.type} onChange={e => setNewPlace({...newPlace, type: e.target.value as PlaceType})} className="w-full border-gray-200 rounded-xl px-4 py-3 border outline-none bg-white">
              {Object.values(PlaceType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Virtual Queue?</label>
            <div className="flex items-center h-full px-2">
              <input type="checkbox" checked={newPlace.isApproved} onChange={e => setNewPlace({...newPlace, isApproved: e.target.checked})} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-xs text-gray-600 font-medium">Enable</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Operating Hours</label>
          <div className="flex items-center gap-3">
            <input type="time" value={newPlace.openingTime} onChange={e => setNewPlace({...newPlace, openingTime: e.target.value})} className="flex-1 border-gray-200 rounded-xl px-4 py-3 border outline-none" />
            <span className="text-gray-400 text-xs">to</span>
            <input type="time" value={newPlace.closingTime} onChange={e => setNewPlace({...newPlace, closingTime: e.target.value})} className="flex-1 border-gray-200 rounded-xl px-4 py-3 border outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Address</label>
          <textarea required value={newPlace.address} onChange={e => setNewPlace({...newPlace, address: e.target.value})} className="w-full border-gray-200 rounded-xl px-4 py-3 border h-20 outline-none resize-none" placeholder="Street, Sector, City" />
        </div>
        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm transition-colors hover:bg-gray-200">Cancel</button>
          <button type="submit" className="flex-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 text-sm transition-all hover:bg-blue-700">Save Location</button>
        </div>
      </form>
    </div>
  </div>
);

interface AddWaitTimeModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedPlace: Place;
  formWaitTimes: Record<string, number>;
  setFormWaitTimes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const AddWaitTimeModal: React.FC<AddWaitTimeModalProps> = ({ 
  onClose, onSubmit, selectedPlace, formWaitTimes, setFormWaitTimes 
}) => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="bg-white rounded-3xl w-full max-w-md relative p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      <h3 className="text-xl font-bold mb-2">Crowdsource Report</h3>
      <p className="text-xs text-gray-400 mb-6">How long did you wait at {selectedPlace.name}?</p>
      <form onSubmit={onSubmit} className="space-y-6">
        {selectedPlace.counters.map((counter, i) => (
          <div key={i}>
            <label className="block text-sm font-semibold mb-2">{counter.name}</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="0" max="120" 
                value={formWaitTimes[counter.name] ?? counter.waitTime} 
                onChange={(e) => setFormWaitTimes(prev => ({...prev, [counter.name]: parseInt(e.target.value)}))} 
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
              <span className="text-sm font-bold w-12 text-right">{formWaitTimes[counter.name] ?? counter.waitTime}m</span>
            </div>
          </div>
        ))}
        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm transition-colors hover:bg-gray-200">Cancel</button>
          <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg text-sm transition-all hover:bg-blue-700">Submit Report</button>
        </div>
      </form>
    </div>
  </div>
);

interface TicketsModalProps {
  onClose: () => void;
  userQueues: UserQueue[];
  onLeaveQueue: (id: string) => void;
}

export const TicketsModal: React.FC<TicketsModalProps> = ({ onClose, userQueues, onLeaveQueue }) => (
  <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="bg-white rounded-3xl w-full max-w-lg relative p-6 shadow-2xl max-h-[80vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">My Active Tickets</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {userQueues.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-500 font-medium italic">No active queue entries found.</p></div>
        ) : (
          userQueues.map(ticket => (
            <div key={ticket.placeId} className="border border-gray-100 rounded-2xl p-4 bg-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{ticket.placeName}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Token ID: {ticket.tokenNumber}</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">POS #{ticket.position}</div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Wait: {ticket.estimatedWait}m</p>
                <button onClick={() => onLeaveQueue(ticket.placeId)} className="text-red-500 font-bold text-xs hover:underline">Leave Queue</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
