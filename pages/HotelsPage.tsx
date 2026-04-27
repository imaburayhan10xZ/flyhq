import React, { useEffect, useState } from 'react';
import { BedDouble, MapPin, Star, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getHotelOffers } from '../services/firebaseService';

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotelOffers();
        setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-primary text-white py-20 px-4 mb-12">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-6">Exclusive Hotel Offers</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Discover the perfect stay anywhere in the world. Enjoy unbeatable prices and luxury accommodations.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
           <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : hotels.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                 <BedDouble className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No Hotels Available</h2>
              <p className="text-slate-500">We are currently updating our hotel inventory. Please check back soon.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={hotel.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition flex flex-col group"
                  >
                    <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                        {hotel.imageUrl ? (
                           <img src={hotel.imageUrl} alt={hotel.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-400"><BedDouble size={48} /></div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg text-slate-900 gap-1">
                            {hotel.stars} <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-slate-500 text-sm mb-2 font-medium">
                            <MapPin className="w-4 h-4 mr-1 shrink-0" />
                            <span className="truncate">{hotel.location}</span>
                        </div>
                        <h3 className="text-xl font-bold font-serif text-slate-900 mb-3 line-clamp-2">{hotel.title}</h3>
                        <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">{hotel.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <div>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Starting From</span>
                                <span className="text-2xl font-black text-primary">${hotel.price}</span>
                                <span className="text-sm text-slate-500 font-medium">/night</span>
                            </div>
                            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary transition shadow-md hover:shadow-lg">
                                View Deal
                            </button>
                        </div>
                    </div>
                  </motion.div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};
export default HotelsPage;
