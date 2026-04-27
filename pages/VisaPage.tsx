import React, { useEffect, useState } from 'react';
import { FileText, Clock, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getVisaServices } from '../services/firebaseService';

const VisaPage: React.FC = () => {
  const [visas, setVisas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const data = await getVisaServices();
        setVisas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisas();
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-orange-500 text-white py-20 px-4 mb-12" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'multiply' }}>
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-6 drop-shadow-lg">Global Visa Assistance</h1>
            <p className="text-xl text-orange-50 max-w-2xl mx-auto drop-shadow-md">Hassle-free visa processing for your next destination. Let our experts handle the paperwork.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
           <div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-orange-500" /></div>
        ) : visas.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                 <FileText className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No Visa Services Available</h2>
              <p className="text-slate-500">We are currently updating our visa service catalog. Please check back later.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visas.map((visa, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={visa.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition flex flex-col group relative p-6"
                  >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center">
                            {visa.imageUrl ? (
                                <img src={visa.imageUrl} alt={visa.country} className="w-12 h-12 rounded-full object-cover shadow-sm mr-4 border-2 border-white" />
                            ) : (
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4"><Globe className="w-6 h-6 text-slate-400" /></div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold font-serif text-slate-900">{visa.country}</h3>
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Visa Service</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-4">{visa.description}</p>
                    
                    <div className="bg-orange-50/50 rounded-2xl p-4 mb-6">
                        <div className="flex items-center text-sm font-medium text-slate-700 mb-2">
                            <Clock className="w-4 h-4 text-orange-500 mr-2 shrink-0" />
                            Processing Time: <span className="font-bold ml-1 text-slate-900">{visa.processingTime}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div>
                            <span className="text-sm text-slate-500 font-medium block">Processing Fee</span>
                            <span className="text-2xl font-black text-orange-600">${visa.price}</span>
                        </div>
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-md hover:shadow-lg">
                            Apply Now
                        </button>
                    </div>
                  </motion.div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};
export default VisaPage;
