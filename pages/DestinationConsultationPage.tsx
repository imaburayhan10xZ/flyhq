import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDestinations, saveConsultation } from '../services/firebaseService';
import { ArrowLeft, Send, MapPin, Loader2 } from 'lucide-react';

const DestinationConsultationPage: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [destination, setDestination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    useEffect(() => {
        window.scrollTo(0,0);
        const fetchDest = async () => {
            try {
                const data = await getDestinations();
                const found = data.find(d => d.id === id);
                setDestination(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDest();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await saveConsultation({
                type: 'destination',
                itemId: id,
                itemName: `${destination.city}, ${destination.country}`,
                ...formData
            });
            navigate('/success');
        } catch (error) {
            console.error('Failed to submit consultation request', error);
            alert('Failed to submit consultation request. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!destination) {
         return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center pb-20">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Destination Not Found</h2>
                <button onClick={() => navigate('/destinations')} className="text-primary hover:underline font-medium">Return</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="h-64 relative overflow-hidden">
                         <img src={destination.image} className="w-full h-full object-cover" alt={destination.city} />
                         <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
                            <MapPin className="w-12 h-12 mb-4 text-white relative z-10" />
                            <h1 className="text-3xl md:text-4xl font-extrabold font-serif mb-2 text-white relative z-10">Consult for {destination.city}</h1>
                            <p className="text-white/80 font-medium text-lg relative z-10">
                                {destination.country}
                            </p>
                         </div>
                    </div>
                
                    <div className="p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required 
                                        maxLength={100}
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition" 
                                        placeholder="John Doe" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                                    <input 
                                        type="tel" 
                                        required 
                                        maxLength={20}
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition" 
                                        placeholder="+1 234 567 890" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                <input 
                                    type="email" 
                                    required
                                    maxLength={100}
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition" 
                                    placeholder="john@example.com" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Your Expected Dates & Notes</label>
                                <textarea 
                                    rows={4} 
                                    maxLength={1000}
                                    value={formData.message} 
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition" 
                                    placeholder="Please provide your expected dates, passenger count, and any other requests..." 
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center shadow-lg shadow-blue-500/30 text-lg">
                                <Send className="w-5 h-5 mr-2" /> Request Consultation
                            </button>
                            <p className="text-xs text-center text-slate-400 font-medium">Our travel expert will contact you shortly.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationConsultationPage;
