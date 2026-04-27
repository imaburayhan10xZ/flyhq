import { Flight, FlightClass, Airport, Booking, Passenger, SearchParams } from '../types';

// Mock Data
export const AIRPORTS: Airport[] = [
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal Intl', country: 'Bangladesh' },
  { code: 'CXB', city: 'Cox\'s Bazar', name: 'Cox\'s Bazar Airport', country: 'Bangladesh' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl', country: 'USA' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl', country: 'UAE' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' },
];

const AIRLINES = [
  { name: 'Biman Bangladesh', logo: 'https://picsum.photos/id/1/40/40' },
  { name: 'US-Bangla', logo: 'https://picsum.photos/id/2/40/40' },
  { name: 'Emirates', logo: 'https://picsum.photos/id/3/40/40' },
  { name: 'Singapore Air', logo: 'https://picsum.photos/id/4/40/40' },
];

// Helper to generate mock flights
const generateFlights = (from: string, to: string, date: string): Flight[] => {
  const results: Flight[] = [];
  const numFlights = Math.floor(Math.random() * 5) + 3; // 3 to 7 flights

  for (let i = 0; i < numFlights; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const priceBase = 50 + Math.random() * 500;
    const hour = Math.floor(Math.random() * 24);
    const durationHours = Math.floor(Math.random() * 10) + 1;
    
    const dep = new Date(date);
    dep.setHours(hour, 0, 0);
    
    const arr = new Date(dep);
    arr.setHours(hour + durationHours);

    results.push({
      id: `FL-${Math.random().toString(36).substr(2, 9)}`,
      airline: airline.name,
      airlineLogo: airline.logo,
      flightNumber: `${airline.name.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 999)}`,
      departureTime: dep.toISOString(),
      arrivalTime: arr.toISOString(),
      origin: from,
      destination: to,
      price: Math.floor(priceBase * (from === 'DAC' ? 1 : 2.5)), // Simple pricing logic
      duration: `${durationHours}h 00m`,
      stops: Math.random() > 0.7 ? 1 : 0,
      class: FlightClass.ECONOMY,
    });
  }
  return results.sort((a, b) => a.price - b.price);
};

// Simulated API Calls
import { getAdminFlights } from './firebaseService';

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  return new Promise(async (resolve) => {
    let allFlights: Flight[] = [];
    try {
        const customFlights = await getAdminFlights();
        // Convert admin flights to Flight type if they match
        const matchingCustom = (customFlights || [])
            .filter((f: any) => f.origin === params.from && f.destination === params.to)
            .map((f: any) => {
                const hour = Math.floor(Math.random() * 24);
                const dep = new Date(params.date);
                dep.setHours(hour, 0, 0);
                
                const durH = parseInt(f.duration) || 2;
                const arr = new Date(dep);
                arr.setHours(hour + durH);

                return {
                    id: f.id,
                    airline: f.airline,
                    airlineLogo: 'https://picsum.photos/40/40',
                    flightNumber: f.flightNumber,
                    departureTime: dep.toISOString(),
                    arrivalTime: arr.toISOString(),
                    origin: f.origin,
                    destination: f.destination,
                    price: Number(f.price),
                    duration: f.duration || `${durH}h 00m`,
                    stops: Number(f.stops || 0),
                    class: FlightClass.ECONOMY,
                };
            });
        
        allFlights = [...matchingCustom];
    } catch(e) {
        console.error("Failed to load custom flights", e);
    }
    
    // Always append some random flights so it doesn't look empty for unconfigured routes
    const generated = generateFlights(params.from, params.to, params.date);
    allFlights = [...allFlights, ...generated];

    setTimeout(() => {
      resolve(allFlights);
    }, 800);
  });
};

export const createBooking = async (flight: Flight, passenger: Passenger): Promise<Booking> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booking: Booking = {
        id: `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        flightId: flight.id,
        flight: flight,
        passenger: passenger,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString(),
        pnr: Math.random().toString(36).substr(2, 6).toUpperCase(),
        totalAmount: flight.price
      };
      
      // Persist to local storage for "Admin" view
      const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
      localStorage.setItem('bookings', JSON.stringify([booking, ...existing]));
      
      resolve(booking);
    }, 1500);
  });
};

export const getBookings = async (): Promise<Booking[]> => {
  return new Promise((resolve) => {
    const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
    resolve(existing);
  });
};

export const getStats = async () => {
    const bookings = await getBookings();
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    return {
        totalBookings: bookings.length,
        revenue: totalRevenue,
        pending: bookings.filter(b => b.status === 'PENDING').length
    }
}
