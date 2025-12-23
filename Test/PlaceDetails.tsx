
import React from 'react';
import { Place, CrowdLevel, UserQueue } from './types';

interface PlaceDetailsProps {
  selectedPlace: Place | undefined;
  isOpenStatus: boolean;
  activeQueue: UserQueue | undefined;
  isJoiningQueue: boolean;
  onRemovePlace: (id: string) => void;
  onJoinQueue: () => void;
  onAddWaitTime: () => void;
  onLeaveQueue: (id: string) => void;
  getEstimatedServiceTime: (mins: number) => string;
}

export const PlaceDetails: React.FC<PlaceDetailsProps> = ({
  selectedPlace, isOpenStatus, activeQueue, isJoiningQueue,
  onRemovePlace, onJoinQueue, onAddWaitTime, onLeaveQueue, getEstimatedServiceTime
}) => {
  if (!selectedPlace) {
    return (
      <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-l border-gray-200 overflow-y-auto shadow-2xl md:shadow-none z-10 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Welcome to WAITLY</h3>
          <p className="text-sm text-gray-500">Tap on an existing marker to see wait times, or double-click anywhere on the map to add a new place.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-l border-gray-200 overflow-y-auto shadow-2xl md:shadow-none z-10 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedPlace.name}</h2>
              {selectedPlace.isApproved && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Partner</span>}
            </div>
            <p className="text-sm text-gray-500">{selectedPlace.address}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isOpenStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isOpenStatus ? 'Currently Open' : 'Closed Now'}
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                {selectedPlace.openingTime} - {selectedPlace.closingTime}
              </span>
            </div>
          </div>
        </div>

        <div className={`mb-6 rounded-2xl p-4 flex items-center justify-between border ${selectedPlace.crowdLevel === CrowdLevel.LOW ? 'bg-green-50 border-green-100' : selectedPlace.crowdLevel === CrowdLevel.MEDIUM ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full pulse ${selectedPlace.crowdLevel === CrowdLevel.LOW ? 'bg-green-500' : selectedPlace.crowdLevel === CrowdLevel.MEDIUM ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Crowd Status</p>
              <p className={`font-bold text-lg leading-none ${selectedPlace.crowdLevel === CrowdLevel.LOW ? 'text-green-700' : selectedPlace.crowdLevel === CrowdLevel.MEDIUM ? 'text-yellow-700' : 'text-red-700'}`}>{selectedPlace.crowdLevel}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Wait Data</h3>
          <div className="space-y-4">
            {selectedPlace.counters.map((counter, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${counter.color}`} />
                  <span className="text-sm font-medium text-gray-700">{counter.name}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{counter.waitTime}m</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button onClick={() => onRemovePlace(selectedPlace.id)} className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete this Location
          </button>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4 sticky bottom-0">
        {activeQueue ? (
          <div className="bg-blue-600 text-white rounded-3xl p-5 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white/20 px-3 py-1 rounded-full"><span className="text-[10px] font-bold uppercase tracking-widest">Token {activeQueue.tokenNumber}</span></div>
            </div>
            <div className="mb-6">
              <div className="flex items-end justify-between mb-1">
                 <p className="text-4xl font-bold">#{activeQueue.position}</p>
                 <div className="text-right">
                    <p className="text-xl font-bold">{getEstimatedServiceTime(activeQueue.estimatedWait)}</p>
                 </div>
              </div>
            </div>
            <button onClick={() => onLeaveQueue(selectedPlace.id)} className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition-all text-sm shadow-lg">Check Out</button>
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={onAddWaitTime} className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              Report Live Wait Time
            </button>
            {selectedPlace.isApproved ? (
              <button onClick={onJoinQueue} disabled={isJoiningQueue || !isOpenStatus} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex flex-col items-center justify-center shadow-lg disabled:opacity-50">
                {isJoiningQueue ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>Join Virtual Queue</span>}
              </button>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-4 text-center border border-dashed border-gray-300 font-bold text-xs text-gray-400">Virtual Queue Disabled</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
