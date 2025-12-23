
import { Place, PlaceType, CrowdLevel } from './types';

export const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'SBI Bank',
    type: PlaceType.BANK,
    address: 'Connaught Place, Delhi',
    rating: 4.2,
    distance: '400m',
    crowdLevel: CrowdLevel.HIGH,
    isApproved: true,
    lastUpdated: '5 mins ago',
    accuracyScore: 94,
    coordinates: { x: 28.6315, y: 77.2167 },
    openingTime: "09:00",
    closingTime: "17:00",
    counters: [
      { name: 'Cash Counter', waitTime: 40, color: 'bg-yellow-500' },
      { name: 'Loan Desk', waitTime: 25, color: 'bg-red-500' },
      { name: 'Document Desk', waitTime: 10, color: 'bg-green-500' },
      { name: 'Account Opening', waitTime: 15, color: 'bg-yellow-500' }
    ]
  },
  {
    id: '2',
    name: 'Apollo Clinic',
    type: PlaceType.CLINIC,
    address: 'Saket, New Delhi',
    rating: 4.5,
    distance: '1.2km',
    crowdLevel: CrowdLevel.MEDIUM,
    isApproved: true,
    lastUpdated: '12 mins ago',
    accuracyScore: 88,
    coordinates: { x: 28.5245, y: 77.2100 },
    openingTime: "08:00",
    closingTime: "22:00",
    counters: [
      { name: 'General OPD', waitTime: 20, color: 'bg-yellow-500' },
      { name: 'Pharmacy', waitTime: 5, color: 'bg-green-500' }
    ]
  },
  {
    id: '3',
    name: 'Central Library',
    type: PlaceType.LIBRARY,
    address: 'Barakhamba Road',
    rating: 4.8,
    distance: '800m',
    crowdLevel: CrowdLevel.LOW,
    isApproved: false,
    lastUpdated: '30 mins ago',
    accuracyScore: 75,
    coordinates: { x: 28.6310, y: 77.2250 },
    openingTime: "10:00",
    closingTime: "19:00",
    counters: [
      { name: 'Main Reading Room', waitTime: 5, color: 'bg-green-500' }
    ]
  }
];
