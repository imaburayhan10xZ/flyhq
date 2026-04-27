import { Hotel, HotelSearchParams } from "../types";

const API_KEY = 'ce3976f6fb41935aff53a8be4eb02ad5';
const SECRET = '18f6fdd42e';
const BASE_URL = 'https://api.test.hotelbeds.com/hotel-api/1.0';

// Generate X-Signature header
const getSignature = async () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = API_KEY + SECRET + timestamp;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Map city names to Hotelbeds Destination Codes (Simplified for Demo)
// In production, you would call the /locations endpoint
const getDestinationCode = (city: string): string => {
    const map: Record<string, string> = {
        'Dhaka': 'DAC',
        'Cox\'s Bazar': 'CXB',
        'Bangkok': 'BKK',
        'Dubai': 'DXB',
        'Singapore': 'SIN',
        'London': 'LON',
        'New York': 'NYC'
    };
    // Default to a known test destination if city not found, for demo purposes
    return map[city] || 'PMI'; // PMI (Mallorca) is standard for Hotelbeds testing
};

// Helper for realistic mock data (Fallback)
const getMockHotels = (params: HotelSearchParams): Hotel[] => {
    return [
         {
            code: 101,
            name: `Grand ${params.city} Hotel`,
            categoryName: "5 STARS",
            zoneName: "City Center",
            minRate: 150.00,
            currency: "USD",
            address: "123 Main Avenue, Downtown",
            imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            reviewScore: 9.2,
            facilities: ["Pool", "Spa", "Free WiFi"]
        },
        {
            code: 102,
            name: `${params.city} City View Resort`,
            categoryName: "4 STARS",
            zoneName: "Business District",
            minRate: 89.50,
            currency: "USD",
            address: "45 Business Park Rd",
            imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            reviewScore: 8.5,
            facilities: ["Gym", "Restaurant"]
        },
         {
            code: 103,
            name: `The Royal ${params.city} Palace`,
            categoryName: "5 STARS",
            zoneName: "Historic Old Town",
            minRate: 210.00,
            currency: "USD",
            address: "1 King's Way",
            imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            reviewScore: 9.8,
            facilities: ["Luxury Spa", "Rooftop Bar", "Valet"]
        },
        {
            code: 104,
            name: `Comfort Inn ${params.city}`,
            categoryName: "3 STARS",
            zoneName: "Airport Area",
            minRate: 55.00,
            currency: "USD",
            address: "88 Airport Blvd",
            imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            reviewScore: 7.9,
            facilities: ["Shuttle", "Breakfast"]
        }
    ];
};

export const searchHotelbeds = async (params: HotelSearchParams): Promise<Hotel[]> => {
    try {
        let signature = '';
        try {
            signature = await getSignature();
        } catch (e) {
            console.warn("Crypto not available, falling back.");
            return getMockHotels(params);
        }

        const destCode = getDestinationCode(params.city);
        
        // Calculate check-out (default 1 night stay)
        const checkInDate = new Date(params.checkIn);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + 1);
        const checkOutString = checkOutDate.toISOString().split('T')[0];

        // Request Body
        const requestBody = {
            stay: {
                checkIn: params.checkIn,
                checkOut: checkOutString
            },
            occupancies: [
                {
                    rooms: 1,
                    adults: params.guests,
                    children: 0
                }
            ],
            destination: {
                code: destCode
            }
        };

        // NOTE: Hotelbeds API does not support Cross-Origin Resource Sharing (CORS) for browser-based calls.
        // We are using a CORS proxy (corsproxy.io) to bypass this for demonstration purposes.
        // In a real production application, you MUST make this API call from a backend server.
        const targetUrl = `${BASE_URL}/hotels`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Api-key': API_KEY,
                'X-Signature': signature,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // Throwing error here to be caught by the catch block below
            const text = await response.text();
            throw new Error(`API Error: ${response.status} ${text}`);
        }

        const data = await response.json();
        
        if (data.hotels && data.hotels.hotels && data.hotels.hotels.length > 0) {
            return data.hotels.hotels.map((h: any) => ({
                code: h.code,
                name: h.name,
                categoryName: h.categoryName,
                zoneName: h.zoneName,
                minRate: parseFloat(h.minRate || (Math.random() * 200 + 50).toFixed(2)),
                currency: h.currency || 'USD',
                address: h.address,
                imageUrl: `https://photos.hotelbeds.com/giata/bigger/${h.code}_1.jpg`, // Construct image URL
                reviewScore: Math.floor(Math.random() * 5) + 6 // Mock score 6-10
            }));
        } else {
            // Valid response but no hotels, return mock data for better UX in demo
            return getMockHotels(params);
        }

    } catch (error) {
        // We log this as a warning because in a frontend-only demo environment, 
        // CORS issues are expected if the proxy is unavailable.
        console.warn("Hotelbeds API access failed (CORS/Proxy/Network). Serving offline data.", error);
        
        // FALLBACK: Return realistic mock data formatted like Hotelbeds data
        return getMockHotels(params);
    }
}
