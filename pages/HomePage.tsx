import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SearchParams, Airport, FlightClass, TripType, HotelSearchParams } from '../types';
import { AIRPORTS } from '../services/mockApi';
import { Search, Calendar, MapPin, Sparkles, TrendingUp, ShieldCheck, Phone, BedDouble, Plane, Star, ArrowRight, Map, Globe2, Quote, AlertCircle } from 'lucide-react';
import { getDestinations, getBlogPosts } from '../services/firebaseService';
import { motion } from 'motion/react';
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

const HomePage: React.FC<HomePageProps> = ({ onSearch, onHotelSearch }) => {
  const navigate = useNavigate();
  const features = useContext(FeaturesContext);
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>(features.flightsEnabled ? 'flights' : 'hotels');
  
  // Destinations State
  const [destinations, setDestinations] = useState<any[]>([]);
  
  // Blog State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  useEffect(() => {
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
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<TripType>(TripType.ONE_WAY);
  const [flightClass, setFlightClass] = useState<FlightClass>(FlightClass.ECONOMY);

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
      passengers,
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
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Tabs */}
            <div className="flex border-b bg-slate-50">
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
                            <div className="flex flex-wrap items-center justify-between space-y-4 md:space-y-0 mb-8 border-b pb-4">
                                <div className="flex space-x-6">
                                    <label className={`flex items-center space-x-2 cursor-pointer font-bold transition ${tripType === TripType.ONE_WAY ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}>
                                        <input type="radio" name="trip" checked={tripType === TripType.ONE_WAY} onChange={() => setTripType(TripType.ONE_WAY)} className="text-primary w-4 h-4" />
                                        <span>One Way</span>
                                    </label>
                                    <label className={`flex items-center space-x-2 cursor-pointer font-bold transition ${tripType === TripType.ROUND_TRIP ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}>
                                        <input type="radio" name="trip" checked={tripType === TripType.ROUND_TRIP} onChange={() => setTripType(TripType.ROUND_TRIP)} className="text-primary w-4 h-4" />
                                        <span>Round Trip</span>
                                    </label>
                                    <label className={`flex items-center space-x-2 cursor-pointer font-bold transition ${tripType === TripType.MULTI_CITY ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}>
                                        <input type="radio" name="trip" checked={tripType === TripType.MULTI_CITY} onChange={() => setTripType(TripType.MULTI_CITY)} className="text-primary w-4 h-4" />
                                        <span>Multi-City</span>
                                    </label>
                                </div>
                        <div className="flex space-x-4">
                            <select 
                                value={passengers} 
                                onChange={e => setPassengers(Number(e.target.value))}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium cursor-pointer"
                            >
                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                            </select>
                            <select 
                                value={flightClass} 
                                onChange={e => setFlightClass(e.target.value as FlightClass)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium cursor-pointer"
                            >
                                <option value={FlightClass.ECONOMY}>Economy</option>
                                <option value={FlightClass.BUSINESS}>Business</option>
                                <option value={FlightClass.FIRST}>First Class</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 relative">
                        {/* Locations (From/To) */}
                        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-2 relative">
                            <div className="relative border border-slate-300 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-primary">Leaving From</label>
                                <div className="flex items-center">
                                    <select 
                                      className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 appearance-none cursor-pointer truncate"
                                      value={from}
                                      onChange={(e) => setFrom(e.target.value)}
                                    >
                                    {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Swap Button */}
                            <button 
                                onClick={swapLocations}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-primary shadow-md hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all z-10 hidden md:flex"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <path d="M17 4V14M17 14L13 10M17 14L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 20V10M7 10L3 14M7 10L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            <div className="relative border border-slate-300 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-primary">Going To</label>
                                <div className="flex items-center">
                                    <select 
                                      className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 appearance-none cursor-pointer truncate"
                                      value={to}
                                      onChange={(e) => setTo(e.target.value)}
                                    >
                                    {AIRPORTS.filter(a => a.code !== from).map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className={`lg:col-span-5 grid grid-cols-1 ${tripType === TripType.ROUND_TRIP ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-2`}>
                            <div className="border border-slate-300 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-primary">Journey Date</label>
                                <div className="flex items-center">
                                    <input 
                                      type="date" 
                                      className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 cursor-pointer"
                                      value={date}
                                      min={new Date().toISOString().split('T')[0]}
                                      onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {tripType === TripType.ROUND_TRIP && (
                                <div className="border border-slate-300 rounded-xl p-3 hover:border-primary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 group bg-white shadow-sm h-[72px] flex flex-col justify-center">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-primary">Return Date</label>
                                    <div className="flex items-center">
                                        <input 
                                        type="date" 
                                        className="w-full bg-transparent font-bold text-lg md:text-xl outline-none text-slate-900 cursor-pointer"
                                        value={returnDate}
                                        min={date}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Button */}
                        <div className="lg:col-span-2">
                            <button 
                                onClick={handleFlightSearch}
                                className="w-full h-full bg-primary hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center min-h-[72px]"
                            >
                                <Search className="w-6 h-6 mr-2" />
                                Search
                            </button>
                        </div>
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
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block group-focus-within:text-secondary">Guests & Rooms</label>
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
