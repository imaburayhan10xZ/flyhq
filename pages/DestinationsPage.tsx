import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getDestinations } from '../services/firebaseService';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DestinationsPage: React.FC = () => {
    const [destinations, setDestinations] = useState<any[]>([]);

    useEffect(() => {
        getDestinations().then(data => {
            if (data) {
                setDestinations(data);
            }
        });
    }, []);

    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif mb-6">Explore Destinations</h1>
                    <p className="text-xl text-slate-500 max-w-3xl mb-12">Discover our handpicked selection of incredible destinations. Whether you're looking for a relaxing beach holiday or an exciting city break, we have you covered.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, idx) => (
                        <motion.div 
                            key={dest.id || idx} 
                            initial={{opacity: 0, y: 20}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{delay: idx * 0.1}}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-primary" /> {dest.country}
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif">{dest.city}</h2>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                                    <div>
                                        <div className="text-sm font-medium text-slate-500">Starting from</div>
                                        <div className="text-lg font-bold text-primary">{dest.price}</div>
                                    </div>
                                    <Link to={`/destination-consultation/${dest.id}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors" title="Request Booking">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {destinations.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Loading amazing destinations...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DestinationsPage;
