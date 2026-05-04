export enum FlightClass {
  ECONOMY = 'Economy',
  BUSINESS = 'Business',
  FIRST = 'First'
}

export enum TripType {
  ONE_WAY = 'One Way',
  ROUND_TRIP = 'Round Trip',
  MULTI_CITY = 'Multi-City'
}

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  origin: string; // Airport code
  destination: string; // Airport code
  price: number;
  duration: string;
  stops: number;
  class: FlightClass;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  passportNumber?: string;
  nationality?: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  flightId: string;
  flight: Flight;
  passenger: Passenger;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  bookingDate: string;
  pnr: string;
  totalAmount: number;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
  class: FlightClass;
  tripType: TripType;
}

export interface HotelSearchParams {
  city: string;
  checkIn: string;
  guests: number;
}

export interface AIRecommendation {
  destination: string;
  description: string;
  attractions: string[];
  food: string;
}

export interface GroundingSource {
    title: string;
    uri: string;
}

export interface AILiveInsight {
    text: string;
    sources: GroundingSource[];
}

// Hotelbeds Types
export interface Hotel {
  code: number;
  name: string;
  description?: string;
  categoryName?: string; // e.g., "5 STARS"
  zoneName?: string;
  latitude?: number;
  longitude?: number;
  minRate?: number;
  currency?: string;
  imageUrl?: string; // Custom field for frontend display
  address?: string;
  facilities?: string[];
  reviewScore?: number;
}
