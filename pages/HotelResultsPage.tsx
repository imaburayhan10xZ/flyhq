import React, { useEffect, useState } from 'react';
import { HotelSearchParams, Hotel } from '../types';
import { searchHotelbeds } from '../services/hotelbedsService';
import { ArrowRight, Calendar, Users, MapPin, Loader2, Star, BedDouble, Check, Search } from 'lucide-react';

interface HotelResultsPageProps {
  params: HotelSearchParams;
  onBack: () => void;
}

const HotelResultsPage: React.FC<HotelResultsPageProps> = ({ params, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      const results = await searchHotelbeds(params);
      setHotels(results);
      setLoading(false);
    };
    fetchHotels();
  }, [params]);

  // Helper to render stars
  const renderStars = (category: string | undefined) => {
      if (!category) return null;
      const numStars = parseInt(category.charAt(0)) || 3; // Extract "5" from "5 STARS"
      return (
          <div className="flex text-yellow-400">
              {[...Array(numStars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
          </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex justify-between items-center border border-gray-100">
        <div>
            <div className="flex items-center text-lg font-bold text-gray-800">
                <BedDouble className="w-5 h-5 mr-2 text-secondary" />
                <span>Stays in {params.city}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
               <Calendar className="w-3 h-3 mr-1" /> {params.checkIn} 
               <span className="mx-2">•</span> 
               <Users className="w-3 h-3 mr-1" /> {params.guests} Guests
            </div>
        </div>
        <button onClick={onBack} className="text-primary font-medium hover:underline text-sm flex items-center">
            <Search className="w-3 h-3 mr-1" /> Modify Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar (Static for demo) */}
        <div className="hidden lg:block lg:col-span-1">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Filter By</h3>
                
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Budget</h4>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded text-primary" /> <span>Less than $100</span>
                        </label>
                         <label className="flex items-center space-x-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded text-primary" /> <span>$100 - $200</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded text-primary" /> <span>$200+</span>
                        </label>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Star Rating</h4>
                    <div className="space-y-2">
                         <label className="flex items-center space-x-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded text-primary" /> <span>5 Stars</span>
                        </label>
                         <label className="flex items-center space-x-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded text-primary" /> <span>4 Stars</span>
                        </label>
                         <label className="flex items-center space-x-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded text-primary" /> <span>3 Stars</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-200">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Connecting to Hotelbeds...</p>
                    <p className="text-xs text-gray-400 mt-2">Checking real-time availability</p>
                </div>
            ) : hotels.length > 0 ? (
                <div className="space-y-6">
                   {hotels.map((hotel) => (
                       <div key={hotel.code} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden flex flex-col md:flex-row h-auto md:h-56 group">
                           {/* Image */}
                           <div className="w-full md:w-64 h-48 md:h-full relative overflow-hidden bg-gray-100 shrink-0">
                               <img 
                                    src={hotel.imageUrl} 
                                    alt={hotel.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    onError={(e) => {
                                        // Fallback if hotelbeds image fails
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                                    }}
                               />
                               {hotel.categoryName && (
                                   <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                       {hotel.categoryName}
                                   </div>
                               )}
                           </div>
                           
                           {/* Content */}
                           <div className="p-5 flex-grow flex flex-col justify-between">
                               <div>
                                   <div className="flex justify-between items-start">
                                       <div>
                                           <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{hotel.name}</h3>
                                           <div className="flex items-center text-sm text-gray-500 mb-2">
                                               <MapPin className="w-3 h-3 mr-1" />
                                               {hotel.zoneName || params.city} • {hotel.address || "City Center"}
                                           </div>
                                       </div>
                                       {hotel.reviewScore && (
                                           <div className="flex flex-col items-end">
                                               <div className="bg-blue-900 text-white font-bold px-2 py-1 rounded text-sm">
                                                   {hotel.reviewScore}
                                               </div>
                                               <span className="text-[10px] text-gray-500 mt-1">Excellent</span>
                                           </div>
                                       )}
                                   </div>
                                   
                                   <div className="flex items-center space-x-2 mt-2">
                                       {renderStars(hotel.categoryName)}
                                   </div>

                                   {hotel.facilities && (
                                       <div className="flex gap-2 mt-3 flex-wrap">
                                           {hotel.facilities.slice(0, 3).map((fac, i) => (
                                               <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 flex items-center">
                                                   <Check className="w-3 h-3 mr-1 text-green-500" /> {fac}
                                               </span>
                                           ))}
                                       </div>
                                   )}
                               </div>

                               <div className="flex items-end justify-between mt-4 md:mt-0 pt-4 border-t border-gray-50 md:border-0 md:pt-0">
                                   <div className="text-xs text-green-600 font-medium flex items-center bg-green-50 px-2 py-1 rounded">
                                       Free Cancellation available
                                   </div>
                                   <div className="text-right">
                                       <div className="text-xs text-gray-400">Price per night</div>
                                       <div className="text-2xl font-bold text-primary">
                                           {hotel.currency === 'EUR' ? '€' : '$'}{hotel.minRate?.toFixed(2)}
                                       </div>
                                       <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition mt-1">
                                           Select Room
                                       </button>
                                   </div>
                               </div>
                           </div>
                       </div>
                   ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BedDouble className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No hotels found</h3>
                    <p className="text-gray-500">Try changing your dates or destination.</p>
                    <button onClick={onBack} className="mt-4 text-primary font-medium hover:underline">
                        Go back to search
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HotelResultsPage;