import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palmtree, MapPin, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getHolidayPackages } from '../services/firebaseService';

const HolidaysPage: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getHolidayPackages();
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-green-700 text-white py-20 px-4 mb-12" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-6 drop-shadow-lg">Amazing Holiday Packages</h1>
            <p className="text-xl text-green-50 max-w-2xl mx-auto drop-shadow-md">Curated experiences that create memories for a lifetime. Choose your next adventure.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
           <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>
        ) : packages.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                 <Palmtree className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No Packages Available</h2>
              <p className="text-slate-500">We are currently crafting new exciting holiday packages. Please check back later.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={pkg.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition flex flex-col group relative"
                  >
                    <div className="h-56 w-full bg-slate-200 relative overflow-hidden">
                        {pkg.imageUrl ? (
                           <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-400"><Palmtree size={48} /></div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pb-2">
                           <div className="flex items-center text-white/90 text-sm font-medium">
                                <Calendar className="w-4 h-4 mr-1 shrink-0" />
                                <span>{pkg.duration}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-slate-500 text-xs mb-2 font-bold uppercase tracking-wider">
                            <MapPin className="w-4 h-4 mr-1 shrink-0 text-green-600" />
                            <span className="truncate">{pkg.location}</span>
                        </div>
                        <h3 className="text-xl font-bold font-serif text-slate-900 mb-3 line-clamp-2">{pkg.title}</h3>
                        <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">{pkg.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <div>
                                <span className="text-2xl font-black text-green-700">${pkg.price}</span>
                                <span className="text-sm text-slate-500 font-medium whitespace-nowrap ml-1 block sm:inline">/person</span>
                            </div>
                            <button onClick={() => { window.scrollTo(0,0); navigate(`/holidays/${pkg.id}`); }} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg">
                                View Details
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
export default HolidaysPage;
