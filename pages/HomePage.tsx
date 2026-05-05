import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SearchParams, Airport, FlightClass, TripType, HotelSearchParams } from '../types';
import { Search, Calendar, MapPin, Sparkles, TrendingUp, ShieldCheck, Phone, BedDouble, Plane, Star, ArrowRight, Map, Globe2, Quote, AlertCircle, User } from 'lucide-react';
import { getDestinations, getBlogPosts } from '../services/firebaseService';
import { motion, AnimatePresence } from 'motion/react';
import { BlogReaderModal } from '../components/BlogReaderModal';
import { FeaturesContext } from '../context/FeaturesContext';

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

const AirportSelector = ({ label, value, onChange, placeholder, airports }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedAirport = airports.find((a: any) => a.code === value);
  const displayValue = selectedAirport ? `${selectedAirport.city} (${selectedAirport.code})` : value;

  const filtered = airports.filter((a: any) => 
    a.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.country.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 30); // limit for performance

  return (
    <div className="relative p-3 hover:bg-slate-50 transition-colors group bg-white h-[80px] flex flex-col justify-center cursor-pointer rounded-xl" onClick={() => setIsOpen(true)}>
      <label className="text-[12px] font-bold text-slate-500 block mb-1">{label}</label>
      <div className="flex items-center">
        <MapPin className="w-5 h-5 text-slate-400 mr-2" />
        <span className="font-bold text-lg md:text-xl text-slate-900 truncate">
          {displayValue || placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-full sm:w-[400px] mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-100">
               <input 
                  type="text"
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                  placeholder="Type airport name, code, city or country"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
               {filtered.length === 0 ? (
                 <div className="p-6 text-center text-slate-500 text-sm font-medium">No airports found.</div>
               ) : (
                 filtered.map((a: any) => (
                   <div 
                     key={a.code}
                     className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50/50 last:border-0 transition-colors"
                     onClick={() => {
                        onChange(a.code);
                        setIsOpen(false);
                        setSearchTerm('');
                     }}
                   >
                      <div className="flex items-center overflow-hidden pr-3">
                         <Plane className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                         <div className="overflow-hidden flex-1">
                           <p className="font-bold text-slate-800 text-sm truncate">{a.name || `${a.city} Airport`}</p>
                           <p className="text-[11px] text-slate-500 truncate mt-0.5">{a.city}, {a.country}</p>
                         </div>
                      </div>
                      <span className="font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs shrink-0">{a.code}</span>
                   </div>
                 ))
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background overlay to close */}
      {isOpen && (
         <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
      )}
    </div>
  );
};

const PassengerSelector = ({ adults, setAdults, child, setChild, infant, setInfant, flightClass, setFlightClass }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const total = adults + child + infant;

  return (
    <div className="relative border border-slate-300 rounded-xl p-3 hover:border-primary transition-colors group bg-white shadow-sm h-[80px] flex flex-col justify-center cursor-pointer" onClick={() => setIsOpen(true)}>
      <label className="text-[12px] font-bold text-slate-500 block mb-1">Passenger, Class</label>
      <div className="flex items-center">
        <User className="w-5 h-5 text-slate-400 mr-2" />
        <div className="flex flex-col">
          <span className="font-bold text-lg text-slate-900 truncate">
            {total} Traveler{total > 1 ? 's' : ''}
          </span>
          <span className="text-xs text-slate-500 font-medium">{flightClass}</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 w-[320px] mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 text-left p-5"
            onClick={e => e.stopPropagation()}
          >
            <h4 className="font-bold text-slate-700 pb-3 border-b border-slate-100 mb-4">Travelers</h4>
            
            <div className="space-y-4 mb-6">
               <div>
                 <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800">Adult</span>
                    <span className="text-xs text-slate-400">(12 Years And Above)</span>
                 </div>
                 <div className="flex gap-1 flex-wrap">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                        <button key={n} onClick={() => setAdults(n)} className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors ${adults === n ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-200'}`}>
                           {n}
                        </button>
                    ))}
                 </div>
               </div>

               <div>
                 <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800">Child</span>
                    <span className="text-xs text-slate-400">(2 Years - Under 12)</span>
                 </div>
                 <div className="flex gap-1 flex-wrap">
                    {[0,1,2,3,4,5,6].map(n => (
                        <button key={n} onClick={() => setChild(n)} className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors ${child === n ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-200'}`}>
                           {n}
                        </button>
                    ))}
                 </div>
               </div>

               <div>
                 <div className="flex justify-between mb-2">
                    <span className="font-bold text-sm text-slate-800">Infant</span>
                    <span className="text-xs text-slate-400">(Below 2 Years)</span>
                 </div>
                 <div className="flex gap-1 flex-wrap">
                    {[0,1].map(n => (
                        <button key={n} onClick={() => setInfant(n)} className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors ${infant === n ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-200'}`}>
                           {n}
                        </button>
                    ))}
                 </div>
               </div>
            </div>

            <h4 className="font-bold text-slate-700 pb-3 border-b border-slate-100 mb-3">Booking Class</h4>
            <div className="flex gap-2 flex-wrap mb-5">
                {[FlightClass.ECONOMY, FlightClass.PREMIUM_ECONOMY, FlightClass.BUSINESS, FlightClass.FIRST].map(cls => (
                   <button key={cls} onClick={() => setFlightClass(cls)} className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${flightClass === cls ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-200'}`}>
                      {cls}
                   </button>
                ))}
            </div>

            <button onClick={() => setIsOpen(false)} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors">
               Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background overlay to close */}
      {isOpen && (
         <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
      )}
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ onSearch, onHotelSearch }) => {
  const navigate = useNavigate();
  const features = useContext(FeaturesContext);
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>(features.flightsEnabled ? 'flights' : 'hotels');
  
  // Destinations State
  const [destinations, setDestinations] = useState<any[]>([]);
  
  // Blog State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  
  // Airports List State
  const [airportsList, setAirportsList] = useState<any[]>([]);

  useEffect(() => {
    // Use dynamic import instead of fetch
    import('../public/airports.json')
      .then(module => setAirportsList(module.default))
      .catch(err => console.error("Could not load airports list", err));

    getDestinations().then(data => {
      if (data) {
        setDestinations(data);
      }
    }).catch(err => console.error(err));

    getBlogPosts().then(data => {
      if (data && data.length > 0) {
        setBlogs(data.sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 3));
      } else {
        setBlogs([{id: '1', title: 'Top 10 Destinations for 2026', author: 'HQ Editors', publishedAt: 'January 1, 2026', excerpt: 'Discover the hidden gems and trending spots you must visit this year.', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'}]);
      }
    }).catch(err => console.error(err));
  }, []);
  
  // Flight State
  const [from, setFrom] = useState('DAC');
  const [to, setTo] = useState('CXB');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  
  const [adults, setAdults] = useState(1);
  const [child, setChild] = useState(0);
  const [infant, setInfant] = useState(0);
  
  const [tripType, setTripType] = useState<TripType>(TripType.ONE_WAY);
  const [flightClass, setFlightClass] = useState<FlightClass>(FlightClass.ECONOMY);
  const [fareType, setFareType] = useState('Regular Fare');
  const [comboFare, setComboFare] = useState(false);
  const [multiCityFlights, setMultiCityFlights] = useState([
    { from: 'DAC', to: 'CXB', date: new Date().toISOString().split('T')[0] },
    { from: 'CXB', to: 'DAC', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
  ]);

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };
  
  // Hotel State
  const [hotelCity, setHotelCity] = useState('Dhaka');
  const [hotelCheckIn, setHotelCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [hotelCheckOut, setHotelCheckOut] = useState('');
  const [hotelGuests, setHotelGuests] = useState(2);

  const handleFlightSearch = () => {
    onSearch({
      from,
      to,
      date,
      passengers: adults + child + infant,
      class: flightClass,
      tripType
    });
  };

  const handleHotelSearch = () => {
    onHotelSearch({
        city: hotelCity,
        checkIn: hotelCheckIn,
        guests: hotelGuests
    });
  };

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
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100">
            {/* Tabs */}
            <div className="flex border-b bg-slate-50 rounded-t-2xl overflow-hidden">
                {features.flightsEnabled && (
                    <button 
                        onClick={() => setActiveTab('flights')}
                        className={`flex-1 py-5 flex items-center justify-center text-lg font-bold transition-all duration-300 ${activeTab === 'flights' ? 'bg-white text-primary border-t-4 border-t-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-t-4 border-t-transparent'}`}
                    >
                        <Plane className="w-5 h-5 mr-3" /> Search Flights
                    </button>
                )}
                {features.hotelsEnabled && (
                    <button 
                        onClick={() => setActiveTab('hotels')}
                        className={`flex-1 py-5 flex items-center justify-center text-lg font-bold transition-all duration-300 ${activeTab === 'hotels' ? 'bg-white text-secondary border-t-4 border-t-secondary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-t-4 border-t-transparent'}`}
                    >
                        <BedDouble className="w-5 h-5 mr-3" /> Search Hotels
                    </button>
                )}
            </div>

            <div className="p-6 md:p-10">
            {activeTab === 'flights' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    {!features.flightsEnabled ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[150px]">
                            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Flight Booking Currently Unavailable</h3>
                            <p className="text-slate-500 max-w-md">We are currently updating our flight inventory systems to offer you better deals. Please check back later.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-center justify-between space-y-4 md:space-y-0 mb-6">
                                <div className="flex space-x-6">
                                    <div className={`flex items-center space-x-2 cursor-pointer font-bold transition ${tripType === TripType.ONE_WAY ? 'text-primary' : 'text-slate-500 hover:text-primary'}`} onClick={() => setTripType(TripType.ONE_WAY)}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tripType === TripType.ONE_WAY ? 'border-primary' : 'border-slate-300'}`}>
                                            {tripType === TripType.ONE_WAY && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span>One Way</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 cursor-pointer font-bold transition ${tripType === TripType.ROUND_TRIP ? 'text-primary' : 'text-slate-500 hover:text-primary'}`} onClick={() => setTripType(TripType.ROUND_TRIP)}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tripType === TripType.ROUND_TRIP ? 'border-primary' : 'border-slate-300'}`}>
                                            {tripType === TripType.ROUND_TRIP && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span>Round Trip</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 cursor-pointer font-bold transition ${tripType === TripType.MULTI_CITY ? 'text-primary' : 'text-slate-500 hover:text-primary'}`} onClick={() => setTripType(TripType.MULTI_CITY)}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tripType === TripType.MULTI_CITY ? 'border-primary' : 'border-slate-300'}`}>
                                            {tripType === TripType.MULTI_CITY && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span>Multi City</span>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="border border-slate-300 rounded-xl px-4 py-2 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-white shadow-sm flex flex-col justify-center min-w-[200px]">
                                        <label className="text-[12px] font-bold text-slate-700 block -mb-0.5">Preferred Airline</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent text-sm outline-none text-slate-500 placeholder:text-slate-400"
                                            placeholder="Example: BS, VQ, TK"
                                        />
                                    </div>
                                </div>
                            </div>

                            {tripType !== TripType.MULTI_CITY ? (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 relative mb-6">
                                    {/* Locations (From/To) */}
                                    <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-0 relative border border-slate-300 rounded-xl overflow-visible shadow-sm">
                                        <div className="flex-1 right-border md:border-r border-slate-300 last:border-0 relative">
                                            <AirportSelector 
                                                label="From" 
                                                value={from} 
                                                onChange={setFrom} 
                                                placeholder="Select Airport" 
                                                airports={airportsList} 
                                            />
                                        </div>
                                        
                                        {/* Swap Button */}
                                        <button 
                                            onClick={swapLocations}
                                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-10 hidden md:flex"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                                <path d="M17 4V14M17 14L13 10M17 14L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 20V10M7 10L3 14M7 10L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>

                                        <div className="flex-1">
                                            <AirportSelector 
                                                label="To" 
                                                value={to} 
                                                onChange={setTo} 
                                                placeholder="Select Airport" 
                                                airports={airportsList} 
                                            />
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className={`lg:col-span-4 flex rounded-xl border border-slate-300 shadow-sm ${tripType === TripType.ROUND_TRIP ? 'divide-x divide-slate-300' : ''}`}>
                                        <div className="flex-1 p-3 hover:bg-slate-50 transition-colors group cursor-pointer flex flex-col justify-center">
                                            <label className="text-[12px] font-bold text-slate-500 block mb-1">Journey</label>
                                            <div className="flex items-center">
                                                <input 
                                                  type="date" 
                                                  className="w-full bg-transparent font-bold text-sm md:text-base outline-none text-slate-900 cursor-pointer"
                                                  value={date}
                                                  min={new Date().toISOString().split('T')[0]}
                                                  onChange={(e) => {
                                                      setDate(e.target.value);
                                                      if(tripType === TripType.ROUND_TRIP && (!returnDate || e.target.value > returnDate)) {
                                                          setReturnDate(e.target.value);
                                                      }
                                                  }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {tripType === TripType.ROUND_TRIP && (
                                            <div className="flex-1 p-3 hover:bg-slate-50 transition-colors group cursor-pointer flex flex-col justify-center">
                                                <label className="text-[12px] font-bold text-slate-500 block mb-1">Return</label>
                                                <div className="flex items-center">
                                                    <input 
                                                    type="date" 
                                                    className="w-full bg-transparent font-bold text-sm md:text-base outline-none text-slate-900 cursor-pointer"
                                                    value={returnDate}
                                                    min={date}
                                                    onChange={(e) => setReturnDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {tripType === TripType.ONE_WAY && (
                                            <div className="flex-1 p-3 hover:bg-slate-50 transition-colors group cursor-pointer flex flex-col justify-center border-l border-slate-300 opacity-60" onClick={() => setTripType(TripType.ROUND_TRIP)}>
                                                <label className="text-[12px] font-bold text-slate-500 block mb-1">Return</label>
                                                <div className="text-sm text-slate-400">Tap to add a return date<br/>for good deal</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Guests */}
                                    <div className="lg:col-span-3">
                                        <PassengerSelector 
                                            adults={adults} setAdults={setAdults}
                                            child={child} setChild={setChild}
                                            infant={infant} setInfant={setInfant}
                                            flightClass={flightClass} setFlightClass={setFlightClass}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 mb-6">
                                    {multiCityFlights.map((flight, idx) => (
                                        <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-2 relative">
                                            {/* Locations (From/To) */}
                                            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-0 relative border border-slate-300 rounded-xl overflow-visible shadow-sm">
                                                <div className="flex-1 right-border md:border-r border-slate-300 last:border-0 relative">
                                                    <AirportSelector 
                                                        label="From" 
                                                        value={flight.from} 
                                                        onChange={(v: string) => {
                                                            const newFlights = [...multiCityFlights];
                                                            newFlights[idx].from = v;
                                                            setMultiCityFlights(newFlights);
                                                        }} 
                                                        placeholder="Select Airport" 
                                                        airports={airportsList} 
                                                    />
                                                </div>
                                                
                                                {/* Swap Button */}
                                                <button 
                                                    onClick={() => {
                                                        const newFlights = [...multiCityFlights];
                                                        const temp = newFlights[idx].from;
                                                        newFlights[idx].from = newFlights[idx].to;
                                                        newFlights[idx].to = temp;
                                                        setMultiCityFlights(newFlights);
                                                    }}
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-10 hidden md:flex"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                                        <path d="M17 4V14M17 14L13 10M17 14L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M7 20V10M7 10L3 14M7 10L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>

                                                <div className="flex-1">
                                                    <AirportSelector 
                                                        label="To" 
                                                        value={flight.to} 
                                                        onChange={(v: string) => {
                                                            const newFlights = [...multiCityFlights];
                                                            newFlights[idx].to = v;
                                                            setMultiCityFlights(newFlights);
                                                        }} 
                                                        placeholder="Select Airport" 
                                                        airports={airportsList} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className="lg:col-span-4 flex rounded-xl border border-slate-300 shadow-sm">
                                                <div className="flex-1 p-3 hover:bg-slate-50 transition-colors group cursor-pointer flex flex-col justify-center">
                                                    <label className="text-[12px] font-bold text-slate-500 block mb-1">Departure Date</label>
                                                    <div className="flex items-center">
                                                        <input 
                                                          type="date" 
                                                          className="w-full bg-transparent font-bold text-sm md:text-base outline-none text-slate-900 cursor-pointer"
                                                          value={flight.date}
                                                          min={idx === 0 ? new Date().toISOString().split('T')[0] : multiCityFlights[idx-1].date}
                                                          onChange={(e) => {
                                                              const newFlights = [...multiCityFlights];
                                                              newFlights[idx].date = e.target.value;
                                                              setMultiCityFlights(newFlights);
                                                          }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Guests or Add button */}
                                            <div className="lg:col-span-3">
                                                {idx === 0 ? (
                                                    <PassengerSelector 
                                                        adults={adults} setAdults={setAdults}
                                                        child={child} setChild={setChild}
                                                        infant={infant} setInfant={setInfant}
                                                        flightClass={flightClass} setFlightClass={setFlightClass}
                                                    />
                                                ) : idx === multiCityFlights.length - 1 ? (
                                                    <div className="flex h-full gap-2">
                                                        {multiCityFlights.length > 2 && (
                                                            <button 
                                                                onClick={() => {
                                                                    setMultiCityFlights(multiCityFlights.filter((_, i) => i !== idx));
                                                                }}
                                                                className="flex-1 border border-rose-300 rounded-xl hover:bg-rose-50 hover:border-rose-400 text-rose-500 transition-colors bg-white font-bold h-[80px]"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => {
                                                                setMultiCityFlights([...multiCityFlights, {
                                                                    from: flight.to,
                                                                    to: '',
                                                                    date: flight.date
                                                                }]);
                                                            }}
                                                            className="flex-1 border border-amber-400 rounded-xl hover:bg-amber-50 hover:border-amber-500 text-amber-500 transition-colors bg-white font-bold h-[80px] flex items-center justify-center flex-col"
                                                        >
                                                            <div className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center mb-1">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                            </div>
                                                            Add
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="h-full">
                                                        <button 
                                                            onClick={() => {
                                                                setMultiCityFlights(multiCityFlights.filter((_, i) => i !== idx));
                                                            }}
                                                            className="w-full border border-rose-300 rounded-xl hover:bg-rose-50 hover:border-rose-400 text-rose-500 transition-colors bg-white font-bold h-[80px]"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between mt-4">
                                <div className="flex space-x-6 items-center">
                                    <div className={`flex items-center space-x-2 cursor-pointer font-bold transition ${fareType === 'Regular Fare' ? 'text-primary' : 'text-slate-500 hover:text-primary'}`} onClick={() => setFareType('Regular Fare')}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${fareType === 'Regular Fare' ? 'border-primary' : 'border-slate-300'}`}>
                                            {fareType === 'Regular Fare' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span>Regular Fare</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 cursor-pointer font-bold transition ${fareType === 'Student Fare' ? 'text-primary' : 'text-slate-500 hover:text-primary'}`} onClick={() => setFareType('Student Fare')}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${fareType === 'Student Fare' ? 'border-primary' : 'border-slate-300'}`}>
                                            {fareType === 'Student Fare' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <span>Student Fare</span>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700 transition" onClick={() => setComboFare(!comboFare)}>
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${comboFare ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                                            {comboFare && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>Combo Fare <span className="font-normal">(Domestic Round Trip)</span></span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleFlightSearch}
                                    className="bg-amber-400 hover:bg-amber-500 text-white font-bold text-lg rounded-xl px-12 py-3 shadow-lg shadow-amber-400/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-w-[150px]"
                                >
                                    Search
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    {!features.hotelsEnabled ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[150px]">
                            <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Hotel Booking Currently Unavailable</h3>
                            <p className="text-slate-500 max-w-md">We are currently upgrading our hotel partners network. Please check back later for exciting new stays and offers.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 relative">
                            <div className="lg:col-span-4 relative border border-slate-300 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-secondary">Destination or Property</label>
                                <div className="flex items-center">
                                    <input 
                                        type="text"
                                        className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                                        value={hotelCity}
                                        onChange={(e) => setHotelCity(e.target.value)}
                                        placeholder="e.g. Dubai"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-4 grid grid-cols-2 gap-2">
                                <div className="border border-slate-300 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-secondary">Check-In</label>
                                <div className="flex items-center">
                                    <input 
                                    type="date" 
                                    className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 cursor-pointer"
                                    value={hotelCheckIn}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setHotelCheckIn(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="border border-slate-300 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-secondary">Check-Out</label>
                                <div className="flex items-center">
                                    <input 
                                    type="date" 
                                    className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 cursor-pointer"
                                    value={hotelCheckOut}
                                    min={hotelCheckIn}
                                    onChange={(e) => setHotelCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 border border-slate-300 rounded-xl p-3 hover:border-secondary transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-secondary">Guests</label>
                            <div className="flex items-center">
                                <select 
                                    className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 cursor-pointer appearance-none"
                                    value={hotelGuests}
                                    onChange={(e) => setHotelGuests(Number(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex items-center">
                            <button 
                                onClick={handleHotelSearch}
                                className="w-full h-full bg-secondary hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-h-[72px]"
                            >
                                <Search className="w-6 h-6 mr-2" />
                                Search
                            </button>
                        </div>
                    </div>
                    )}
                </motion.div>
            )}
            </div>
        </div>
      </motion.div>



      {/* Blog */}
      {features.blogEnabled && (
      <div className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif mb-4 flex items-center">
                         Blog
                    </h2>
                    <p className="text-lg text-slate-500">Read our latest blog entries, guides, and inspiration for your next big adventure.</p>
                  </div>
                  <Link to="/blog" className="flex text-primary font-bold items-center hover:text-blue-800 transition-colors mt-4 md:mt-0">
                      View all stories <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((post, idx) => (
                      <motion.article 
                         key={post.id || idx} 
                         onClick={() => { window.scrollTo(0, 0); navigate(`/blogs/post/${post.id}`); }}
                         initial={{opacity:0, y:20}} 
                         whileInView={{opacity:1, y:0}}
                         viewport={{once: true}}
                         transition={{delay: idx * 0.1}} 
                         className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-100 flex flex-col group cursor-pointer"
                       >
                          <div className="h-48 md:h-56 w-full bg-slate-200 relative overflow-hidden">
                              {post.imageUrl ? (
                                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                              ) : (
                                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50 font-serif text-2xl px-6 text-center">{post.title}</div>
                              )}
                          </div>
                          <div className="p-6 flex-1 flex flex-col bg-white relative z-10 -mt-6 rounded-t-3xl border-t border-white/50">
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition font-serif mb-3 line-clamp-2">{post.title}</h3>
                              <p className="text-slate-600 line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">{post.excerpt}</p>
                              <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-wide">
                                  Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" />
                              </div>
                          </div>
                      </motion.article>
                  ))}
              </div>
          </div>
      </div>
      )}

      {/* Popular Destinations Grid */}
      {features.destinationsEnabled && (
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
                      <div key={dest.id || idx} className="group rounded-2xl overflow-hidden relative h-96 block">
                          <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" onClick={() => navigate('/destinations')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>
                          
                          <div className="absolute bottom-0 left-0 p-6 w-full pointer-events-none">
                              <span className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1 block">{dest.country}</span>
                              <h3 className="text-2xl font-bold text-white mb-2 font-serif">{dest.city}</h3>
                              <div className="flex justify-between items-center mt-4 pointer-events-auto">
                                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">{dest.price}</span>
                                  <Link to={`/destination-consultation/${dest.id}`} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer" title="Request Booking">
                                      <ArrowRight className="w-5 h-5" />
                                  </Link>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      )}

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
