import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHolidayPackages, saveConsultation } from '../services/firebaseService';
import { ArrowLeft, Send, Palmtree, Loader2 } from 'lucide-react';

const HolidayConsultationPage: React.FC = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const [holiday, setHoliday] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    useEffect(() => {
        window.scrollTo(0,0);
        const fetchPackage = async () => {
            try {
                const data = await getHolidayPackages();
                const found = data.find(p => p.id === id);
                setHoliday(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await saveConsultation({
                type: 'holiday',
                itemId: id,
                itemName: holiday.title,
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
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    if (!holiday) {
         return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-10 text-center pb-20">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Package Not Found</h2>
                <button onClick={() => navigate('/holidays')} className="text-primary hover:underline font-medium">Return to Holidays</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate(`/holidays/${id}`)} className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Package Details
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-green-600 text-white p-8 md:p-10 text-center relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                        <Palmtree className="w-12 h-12 mx-auto mb-4 text-green-100 relative z-10" />
                        <h1 className="text-3xl md:text-4xl font-extrabold font-serif mb-2 relative z-10">Request Booking</h1>
                        <p className="text-green-100 font-medium text-lg relative z-10">
                            {holiday.title}
                        </p>
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
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 outline-none transition" 
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
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 outline-none transition" 
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
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 outline-none transition" 
                                    placeholder="john@example.com" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Special Requirements / Travel Dates</label>
                                <textarea 
                                    rows={4} 
                                    maxLength={1000}
                                    value={formData.message} 
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-green-500 focus:border-green-500 block p-3.5 outline-none transition" 
                                    placeholder="Let us know your preferred dates and any special requirements..." 
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center shadow-lg shadow-green-500/30 text-lg">
                                <Send className="w-5 h-5 mr-2" /> Send Request
                            </button>
                            <p className="text-xs text-center text-slate-400 font-medium">Our travel expert will contact you shortly to confirm your booking.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolidayConsultationPage;
