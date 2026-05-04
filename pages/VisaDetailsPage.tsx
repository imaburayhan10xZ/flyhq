import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVisaServices } from '../services/firebaseService';
import { FileText, Clock, Globe, Loader2, ArrowLeft, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

const VisaDetailsPage: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [visa, setVisa] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0,0);
        const fetchVisa = async () => {
            try {
                const data = await getVisaServices();
                const found = data.find(v => v.id === id);
                setVisa(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVisa();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-20">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!visa) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center pb-20">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Visa Service Not Found</h2>
                <button onClick={() => navigate('/visa')} className="text-primary hover:underline font-medium">Return to Visa Services</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-orange-500 text-white pt-32 pb-24 px-4 relative">
                 <div className="absolute top-8 left-4 md:left-8 z-10">
                    <button onClick={() => navigate('/visa')} className="flex items-center text-white/90 hover:text-white hover:bg-orange-600 px-4 py-2 rounded-xl transition font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Visa
                    </button>
                </div>

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center text-orange-200 font-bold uppercase tracking-widest text-sm mb-3">
                            <Globe className="w-4 h-4 mr-1.5" /> Visa Processing
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-serif drop-shadow-lg mb-4">{visa.country} Visa</h1>
                        <p className="text-xl text-orange-50 opacity-90 max-w-2xl font-medium">Professional visa application and processing assistance for {visa.country}.</p>
                    </div>
                    {visa.imageUrl ? (
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden shrink-0">
                            <img src={visa.imageUrl} alt={visa.country} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                         <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl bg-orange-400 flex items-center justify-center text-white shrink-0">
                             <Globe size={64} />
                         </div>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 mb-12">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Details */}
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Service Description</h2>
                                <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600 text-lg leading-relaxed">
                                    {visa.description}
                                </div>
                            </section>
                            
                            {/* Requirements, if they existed, would go here. For now just generic info. */}
                            <section className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                                    <FileText className="w-5 h-5 text-orange-500 mr-2" /> Basic Requirements
                                </h3>
                                <ul className="list-disc list-inside space-y-2 text-slate-700">
                                    <li>Valid Passport (min. 6 months validity)</li>
                                    <li>Passport size photographs</li>
                                    <li>Completed application form</li>
                                    <li>Proof of financial means</li>
                                    <li>Flight itinerary or travel plan</li>
                                </ul>
                                <p className="text-sm text-slate-500 mt-4 italic">*Additional documents may be requested based on specific applicant profile.</p>
                            </section>
                        </div>

                        {/* Booking Card */}
                        <div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="text-sm font-bold uppercase text-slate-500 mb-1 tracking-wider">Processing Fee</div>
                                    <div className="text-4xl font-black text-orange-600 flex justify-center items-center">
                                        <DollarSign className="w-8 h-8" />{visa.price}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">Total inclusive fee</div>
                                </div>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                        <span className="text-slate-500 font-medium flex items-center"><Clock className="w-4 h-4 mr-2" /> Processing Time</span>
                                        <span className="font-bold text-slate-800">{visa.processingTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                        <span className="text-slate-500 font-medium flex items-center"><Globe className="w-4 h-4 mr-2" /> Destination</span>
                                        <span className="font-bold text-slate-800">{visa.country}</span>
                                    </div>
                                </div>

                                <button onClick={() => navigate(`/visa-consultation/${visa.id}`)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-slate-900/30">
                                    Get Consultation
                                </button>
                                <p className="text-xs text-center text-slate-400 mt-4 font-medium">Have questions? Contact our visa experts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisaDetailsPage;
