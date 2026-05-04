import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHolidayPackages } from '../services/firebaseService';
import { Palmtree, MapPin, Calendar, Loader2, DollarSign, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const HolidayDetailsPage: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0,0);
        const fetchPackage = async () => {
            try {
                const data = await getHolidayPackages();
                const found = data.find(p => p.id === id);
                setPkg(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-20">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center pb-20">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <Palmtree className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Package Not Found</h2>
                <button onClick={() => navigate('/holidays')} className="text-primary hover:underline font-medium">Return to Holidays</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero */}
            <div className="w-full h-[50vh] relative bg-slate-900 border-b border-white">
                {pkg.imageUrl ? (
                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-200">
                        <Palmtree size={64} />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="absolute top-8 left-4 md:left-8">
                    <button onClick={() => navigate('/holidays')} className="flex items-center text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm transition">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Holidays
                    </button>
                </div>

                <div className="absolute bottom-10 left-0 w-full px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center text-green-400 font-bold uppercase tracking-widest text-sm mb-3">
                            <MapPin className="w-4 h-4 mr-1.5" /> {pkg.location}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-serif drop-shadow-lg mb-4">{pkg.title}</h1>
                        <div className="flex items-center text-slate-300 font-medium text-lg">
                            <Calendar className="w-5 h-5 mr-2 text-green-400" /> {pkg.duration}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Details */}
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Package Details</h2>
                            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 leading-relaxed">
                                {pkg.description}
                            </div>
                        </div>

                        {/* Booking Card */}
                        <div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="text-sm font-bold uppercase text-slate-500 mb-1 tracking-wider">Starting from</div>
                                    <div className="text-4xl font-black text-green-600 flex justify-center items-center">
                                        <DollarSign className="w-8 h-8" />{pkg.price}
                                    </div>
                                    <div className="text-sm text-slate-500">per person</div>
                                </div>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                        <span className="text-slate-500 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2" /> Duration</span>
                                        <span className="font-bold text-slate-800">{pkg.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                        <span className="text-slate-500 font-medium flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location</span>
                                        <span className="font-bold text-slate-800">{pkg.location}</span>
                                    </div>
                                </div>

                                <button onClick={() => navigate(`/holiday-consultation/${pkg.id}`)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-green-500/30">
                                    Request Booking
                                </button>
                                <p className="text-xs text-center text-slate-400 mt-4 font-medium">By requesting, you agree to our terms and conditions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolidayDetailsPage;
