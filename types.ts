
export enum CrowdLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum PlaceType {
  BANK = 'Bank',
  CLINIC = 'Clinic',
  LIBRARY = 'Library',
  RESTAURANT = 'Restaurant',
  GOVT_OFFICE = 'Govt Office'
}

export interface CounterInfo {
  name: string;
  waitTime: number; // in minutes
  color: string;
}

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  address: string;
  rating: number;
  distance: string;
  crowdLevel: CrowdLevel;
  isApproved: boolean;
  counters: CounterInfo[];
  lastUpdated: string;
  accuracyScore: number;
  coordinates: { x: number; y: number }; // Simulated map coords
  openingTime: string; // HH:mm format
  closingTime: string; // HH:mm format
}

export interface UserQueue {
  placeId: string;
  placeName: string;
  tokenNumber: string;
  position: number;
  estimatedWait: number;
  status: 'waiting' | 'called' | 'finished';
}
