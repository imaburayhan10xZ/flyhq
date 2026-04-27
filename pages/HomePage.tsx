import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SearchParams, Airport, FlightClass, TripType, AIRecommendation, HotelSearchParams } from '../types';
import { AIRPORTS } from '../services/mockApi';
import { Search, Calendar, MapPin, Sparkles, TrendingUp, ShieldCheck, Phone, BedDouble, Plane, Star, ArrowRight, Map, Globe2, Quote } from 'lucide-react';
import { getDestinationRecommendations } from '../services/geminiService';
import { getDestinations } from '../services/firebaseService';
import { motion } from 'motion/react';

interface HomePageProps {
  onSearch: (params: SearchParams) => void;
  onHotelSearch: (params: HotelSearchParams) => void;
}

const TESTIMONIALS = [
  { name: "Rafiqul Islam", role: "Frequent Traveler", text: "HQ Travels made my Dubai trip so effortless. Best prices and amazing customer service 24/7!", rating: 5 },
  { name: "Nusrat Jahan", role: "Business Executive", text: "I book all my corporate flights through them. Real-time availability and a tremendously smooth booking process every time.", rating: 5 },
  { name: "Ahmed Hasan", role: "Honeymooner", text: "Thanks to their brilliant destination insights, we found the perfect stay in the Maldives. Highly recommended travel partner.", rating: 5 }
];

const PARTNERS = [
  { name: "Emirates", logo: "EK" }, { name: "Qatar Airways", logo: "QR" }, { name: "Singapore Airlines", logo: "SQ" }, 
  { name: "Biman Bangladesh", logo: "BG" }, { name: "US-Bangla", logo: "BS" }, { name: "Novoair", logo: "VQ" }
];

const HomePage: React.FC<HomePageProps> = ({ onSearch, onHotelSearch }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  
  // Destinations State
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    getDestinations().then(data => {
      if (data) {
        setDestinations(data);
      }
    }).catch(err => console.error(err));
  }, []);
  
  // Flight State
  const [from, setFrom] = useState('DAC');
  const [to, setTo] = useState('CXB');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  
  // Hotel State
  const [hotelCity, setHotelCity] = useState('Dhaka');
  const [hotelCheckIn, setHotelCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [hotelGuests, setHotelGuests] = useState(2);

  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleFlightSearch = () => {
    onSearch({
      from,
      to,
      date,
      passengers,
      class: FlightClass.ECONOMY,
      tripType: TripType.ONE_WAY
    });
  };

  const handleHotelSearch = () => {
    onHotelSearch({
        city: hotelCity,
        checkIn: hotelCheckIn,
        guests: hotelGuests
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAi = async () => {
        const destAirport = AIRPORTS.find(a => a.code === to);
        if (destAirport) {
            setLoadingAi(true);
            const rec = await getDestinationRecommendations(destAirport.city);
            if (isMounted) {
                setAiRec(rec);
                setLoadingAi(false);
            }
        }
    };
    const timer = setTimeout(fetchAi, 1000);
    return () => {
        isMounted = false;
        clearTimeout(timer);
    };
  }, [to]);

  return (
    <div className="relative bg-white">
      {/* Hero Section */}
      <div className="relative h-[650px] w-full bg-cover bg-center overflow-hidden transition-all duration-1000" 
           style={{ backgroundImage: activeTab === 'flights' 
             ? 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' 
             : 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' 
           }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/30"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl mb-32"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-blue-100 text-sm font-semibold mb-6 uppercase tracking-wider">
              {activeTab === 'flights' ? 'Premium Flight Booking' : 'Luxury Hotel Reservations'}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-xl font-serif">
                {activeTab === 'flights' ? (
                  <>Explore the World<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-primary">With HQ Travels</span></>
                ) : (
                  <>Find Your Perfect<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-secondary">Dream Stay</span></>
                )}
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 drop-shadow-md font-light max-w-2xl">
                {activeTab === 'flights' ? 'Let\'s Fly Higher. Best prices on global flights, guaranteed.' : 'Discover and book luxury hotels at unbeatable prices worldwide.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Box - Sticky/Floating */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 -mt-40 relative z-20"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Tabs */}
            <div className="flex border-b bg-slate-50">
                <button 
                    onClick={() => setActiveTab('flights')}
                    className={`flex-1 py-5 flex items-center justify-center text-lg font-bold transition-all duration-300 ${activeTab === 'flights' ? 'bg-white text-primary border-t-4 border-t-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-t-4 border-t-transparent'}`}
                >
                    <Plane className="w-5 h-5 mr-3" /> Search Flights
                </button>
                <button 
                    onClick={() => setActiveTab('hotels')}
                    className={`flex-1 py-5 flex items-center justify-center text-lg font-bold transition-all duration-300 ${activeTab === 'hotels' ? 'bg-white text-secondary border-t-4 border-t-secondary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-t-4 border-t-transparent'}`}
                >
                    <BedDouble className="w-5 h-5 mr-3" /> Search Hotels
                </button>
            </div>

            <div className="p-6 md:p-10">
            {activeTab === 'flights' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <div className="flex flex-wrap space-x-6 mb-8 border-b pb-4">
                        <label className="flex items-center space-x-2 cursor-pointer text-primary font-bold">
                            <input type="radio" name="trip" defaultChecked className="text-primary w-4 h-4" />
                            <span>One Way</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer text-slate-500 hover:text-primary transition font-medium">
                            <input type="radio" name="trip" className="text-primary w-4 h-4" />
                            <span>Round Trip</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer text-slate-500 hover:text-primary transition font-medium">
                            <input type="radio" name="trip" className="text-primary w-4 h-4" />
                            <span>Multi-City</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-3 relative border-2 border-slate-200 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-50 group bg-white">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1 group-focus-within:text-primary">Leaving From</label>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-slate-400 mr-2 group-focus-within:text-primary" />
                                <select 
                                  className="w-full bg-transparent font-bold text-lg outline-none text-slate-800 appearance-none cursor-pointer"
                                  value={from}
                                  onChange={(e) => setFrom(e.target.value)}
                                >
                                {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-3 relative border-2 border-slate-200 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-50 group bg-white">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1 group-focus-within:text-primary">Going To</label>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-slate-400 mr-2 group-focus-within:text-primary" />
                                <select 
                                  className="w-full bg-transparent font-bold text-lg outline-none text-slate-800 appearance-none cursor-pointer"
                                  value={to}
                                  onChange={(e) => setTo(e.target.value)}
                                >
                                {AIRPORTS.filter(a => a.code !== from).map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-3 border-2 border-slate-200 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-50 group bg-white">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1 group-focus-within:text-primary">Journey Date</label>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 text-slate-400 mr-2 group-focus-within:text-primary" />
                                <input 
                                  type="date" 
                                  className="w-full bg-transparent font-bold text-lg outline-none text-slate-800 cursor-pointer"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3 flex items-center">
                            <button 
                                onClick={handleFlightSearch}
                                className="w-full h-full bg-primary hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-[0_8px_20px_-6px_rgba(0,108,228,0.5)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-h-[72px]"
                            >
                                <Search className="w-6 h-6 mr-2" />
                                Find Flights
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2">
                        <div className="md:col-span-4 relative border-2 border-slate-200 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-4 focus-within:ring-orange-50 group bg-white">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1 group-focus-within:text-secondary">Destination</label>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 text-slate-400 mr-2 group-focus-within:text-secondary" />
                                <input 
                                    type="text"
                                    className="w-full bg-transparent font-bold text-lg outline-none text-slate-800"
                                    value={hotelCity}
                                    onChange={(e) => setHotelCity(e.target.value)}
                                    placeholder="Where are you going?"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3 border-2 border-slate-200 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-4 focus-within:ring-orange-50 group bg-white">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1 group-focus-within:text-secondary">Check-In</label>
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 text-slate-400 mr-2 group-focus-within:text-secondary" />
                                <input 
                                  type="date" 
                                  className="w-full bg-transparent font-bold text-lg outline-none text-slate-800 cursor-pointer"
                                  value={hotelCheckIn}
                                  onChange={(e) => setHotelCheckIn(e.target.value)}
                                />
                            </div>
                        </div>

                         <div className="md:col-span-2 border-2 border-slate-200 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-4 focus-within:ring-orange-50 group bg-white">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1 group-focus-within:text-secondary">Guests</label>
                            <div className="flex items-center">
                                <BedDouble className="w-5 h-5 text-slate-400 mr-2 group-focus-within:text-secondary" />
                                <select 
                                    className="w-full bg-transparent font-bold text-lg outline-none text-slate-800 cursor-pointer appearance-none"
                                    value={hotelGuests}
                                    onChange={(e) => setHotelGuests(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-3 flex items-center">
                            <button 
                                onClick={handleHotelSearch}
                                className="w-full h-full bg-secondary hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-[0_8px_20px_-6px_rgba(234,88,12,0.5)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-h-[72px]"
                            >
                                <Search className="w-6 h-6 mr-2" />
                                Find Stay
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
            </div>
        </div>
      </motion.div>

      {/* Trust & Partners Strip */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pb-8 border-b border-slate-100 hidden md:block">
          <p className="text-center text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Trusted by Leading Airlines worldwide</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               {PARTNERS.map((partner, idx) => (
                   <div key={idx} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                       <Plane className="w-5 h-5" />
                       <span className="font-bold text-lg font-serif">{partner.name}</span>
                   </div>
               ))}
          </div>
      </div>

      {/* AI Recommendations Section */}
      {activeTab === 'flights' && (
      <div className="bg-slate-50 py-20 mt-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                        <Sparkles className="w-8 h-8 text-secondary mr-3" /> AI Trip Intelligence
                    </h2>
                    <p className="text-slate-500 mt-2 text-lg">Smart insights for your selected destination, powered by Gemini.</p>
                </div>
            </div>

            {loadingAi ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                         <div key={i} className="animate-pulse bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64">
                             <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
                             <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                             <div className="h-4 bg-slate-200 rounded w-5/6 mb-6"></div>
                             <div className="h-8 bg-blue-50 rounded w-1/3"></div>
                         </div>
                    ))}
                </div>
            ) : aiRec ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-8 md:p-12 flex flex-col lg:flex-row gap-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-16 -mr-8 -mt-8 bg-gradient-to-bl from-indigo-50 to-transparent rounded-full opacity-50"></div>
                    
                    <div className="flex-1 relative z-10">
                        <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-full mb-6">Destination Spotlight</span>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-6 font-serif">Why visit {aiRec.destination}?</h3>
                        <p className="text-slate-600 leading-relaxed text-lg mb-8">{aiRec.description}</p>
                        
                        <div className="bg-orange-50 border border-secondary/20 p-5 rounded-xl flex items-start group hover:bg-orange-100 transition-colors cursor-pointer">
                            <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">🍜</span>
                            <div>
                                <h4 className="font-bold text-orange-900 flex items-center text-sm uppercase tracking-wider mb-1">Must Try Local Food</h4>
                                <p className="text-orange-800 font-medium">{aiRec.food}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 lg:pl-12 lg:border-l border-slate-100 relative z-10">
                        <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <Map className="w-5 h-5 mr-2 text-primary" /> Top Attractions
                        </h4>
                        <div className="grid gap-4">
                            {(aiRec.attractions || []).map((attr: string, idx: number) => (
                                <div key={idx} className="flex items-center p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all bg-white group cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">{attr}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <Globe2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">Select a destination above</h3>
                    <p className="text-slate-500">Our AI will generate custom insights, food recommendations and attractions for your trip.</p>
                </div>
            )}
          </div>
      </div>
      )}

      {/* Popular Destinations Grid */}
      <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif mb-4">Trending Destinations</h2>
                    <p className="text-lg text-slate-500">Explore the most popular spots and unbeatable exclusive deals hand-picked for you.</p>
                  </div>
                  <Link to="/destinations" className="flex text-primary font-bold items-center hover:text-blue-800 transition-colors mt-4 md:mt-0">
                      View all destinations <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {destinations.slice(0, 4).map((dest, idx) => (
                      <Link to={`/destinations`} key={dest.id || idx} className="group rounded-2xl overflow-hidden cursor-pointer relative h-96 block">
                          <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                          
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                              <span className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1 block">{dest.country}</span>
                              <h3 className="text-2xl font-bold text-white mb-2 font-serif">{dest.city}</h3>
                              <div className="flex justify-between items-center mt-4">
                                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">{dest.price}</span>
                                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                                      <ArrowRight className="w-5 h-5" />
                                  </div>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </div>

      {/* Why Choose Us Features */}
      <div className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Why Book With HQ Travels?</h2>
                <p className="text-lg text-slate-400">We don't just book tickets; we craft experiences. Discover why thousands choose us.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-secondary transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-secondary text-white">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4">Secure & Reliable</h3>
                    <p className="text-slate-400 leading-relaxed text-lg">Your bookings are guaranteed secure. We use bank-level encryption and trusted global partners to ensure absolute safety.</p>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-primary transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-primary text-white">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4">Unbeatable Fares</h3>
                    <p className="text-slate-400 leading-relaxed text-lg">Our dynamic pricing engine continuously compares thousands of flights to guarantee you never overpay for a journey.</p>
                </div>
                 <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-green-500 transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-green-500 text-white">
                        <Phone className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-2xl mb-4">24/7 Dedicated Support</h3>
                    <p className="text-slate-400 leading-relaxed text-lg">Plans change? Flight delayed? Our expert local team is available around the clock to support you every step of the way.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 mb-6">What Our Travelers Say</h2>
                  <p className="text-lg text-slate-500">Real experiences from our valued customers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {TESTIMONIALS.map((t, i) => (
                      <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                          <div className="flex items-center space-x-1 mb-6 text-yellow-500">
                              {[...Array(t.rating)].map((_, idx) => <Star key={idx} fill="currentColor" className="w-5 h-5"/>)}
                          </div>
                          <Quote className="w-10 h-10 text-slate-200 mb-4" />
                          <p className="text-slate-700 text-lg italic mb-8 relative z-10 leading-relaxed">"{t.text}"</p>
                          <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                                  {t.name.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                                  <span className="text-sm text-slate-500 font-medium">{t.role}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

    </div>
  );
};

export default HomePage;
