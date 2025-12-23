
import React from 'react';

interface HeaderProps {
  onHome: () => void;
  onJoinQueue: () => void;
  onAddWaitTime: () => void;
  onShowTickets: () => void;
  ticketCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onHome, onJoinQueue, onAddWaitTime, onShowTickets, ticketCount 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-[1100] shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">WAITLY</h1>
      </div>
      
      <nav className="flex items-center gap-4 md:gap-8 text-sm font-semibold">
        <button onClick={onHome} className="text-gray-500 hover:text-blue-600 transition-colors">Home</button>
        <button onClick={onJoinQueue} className="text-gray-500 hover:text-blue-600 transition-colors">Join Queue</button>
        <button onClick={onAddWaitTime} className="text-gray-500 hover:text-blue-600 transition-colors">Add Wait Time</button>
        <button onClick={onShowTickets} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors relative">
          My Ticket
          {ticketCount > 0 && (
            <span className="w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full absolute -top-1 -right-4 animate-pulse">
              {ticketCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};
