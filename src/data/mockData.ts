// Mock data for ski destinations and initial setup
import { SkiDestination, Hotel, Participant } from '@/types';

export const mockDestinations: SkiDestination[] = [
  {
    id: 'aspen',
    name: 'Aspen Snowmass',
    location: 'Aspen, Colorado',
    description: 'World-class skiing with luxury amenities and stunning mountain views.',
    imageUrl: '/images/aspen.jpg',
    basePricePerPerson: 450,
  },
  {
    id: 'whistler',
    name: 'Whistler Blackcomb',
    location: 'Whistler, BC',
    description: 'Iconic Canadian resort with diverse terrain and vibrant village life.',
    imageUrl: '/images/whistler.jpg',
    basePricePerPerson: 380,
  },
  {
    id: 'vail',
    name: 'Vail Ski Resort',
    location: 'Vail, Colorado',
    description: 'Expansive terrain with European-style village charm.',
    imageUrl: '/images/vail.jpg',
    basePricePerPerson: 420,
  },
];

export const mockHotels: Hotel[] = [
  // Aspen Hotels
  {
    id: 'aspen-lodge',
    name: 'The Aspen Mountain Lodge',
    pricePerNight: 320,
    rating: 4.5,
    amenities: ['Ski-in/Ski-out', 'Spa', 'Restaurant', 'Pool'],
    imageUrl: '/images/aspen-lodge.jpg',
    destinationId: 'aspen',
  },
  {
    id: 'aspen-inn',
    name: 'Snowmass Inn & Suites',
    pricePerNight: 180,
    rating: 4.0,
    amenities: ['Free Breakfast', 'Shuttle', 'Fitness Center'],
    imageUrl: '/images/aspen-inn.jpg',
    destinationId: 'aspen',
  },
  // Whistler Hotels
  {
    id: 'whistler-village',
    name: 'Whistler Village Hotel',
    pricePerNight: 280,
    rating: 4.3,
    amenities: ['Village Location', 'Ski Storage', 'Restaurant'],
    imageUrl: '/images/whistler-village.jpg',
    destinationId: 'whistler',
  },
  {
    id: 'whistler-peak',
    name: 'Peak Mountain Resort',
    pricePerNight: 220,
    rating: 4.1,
    amenities: ['Mountain View', 'Hot Tub', 'Free WiFi'],
    imageUrl: '/images/whistler-peak.jpg',
    destinationId: 'whistler',
  },
  // Vail Hotels
  {
    id: 'vail-cascade',
    name: 'Vail Cascade Resort',
    pricePerNight: 350,
    rating: 4.6,
    amenities: ['Luxury Spa', 'Multiple Restaurants', 'Ski Concierge'],
    imageUrl: '/images/vail-cascade.jpg',
    destinationId: 'vail',
  },
  {
    id: 'vail-inn',
    name: 'Mountain View Inn',
    pricePerNight: 190,
    rating: 3.9,
    amenities: ['Budget Friendly', 'Continental Breakfast', 'Parking'],
    imageUrl: '/images/vail-inn.jpg',
    destinationId: 'vail',
  },
];

export const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '/avatars/alex.jpg',
    hasVoted: false,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: '/avatars/sarah.jpg',
    hasVoted: false,
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    avatar: '/avatars/mike.jpg',
    hasVoted: false,
  },
  {
    id: '4',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    avatar: '/avatars/emma.jpg',
    hasVoted: false,
  },
];
