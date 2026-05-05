import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getJobs, saveConsultation } from '../services/firebaseService';
import { Loader2, Briefcase, MapPin, Clock, X, Send, CheckCircle } from 'lucide-react';

const CareersPage: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Application Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getJobs().then(d => {
            if (d.length > 0) {
                setJobs(d);
            } else {
                setJobs([{id: '1', title: 'Senior Travel Consultant', location: 'Dhaka, Bangladesh', jobType: 'Full-time', description: 'We are looking for an experienced travel consultant to handle bespoke tour packages and VIP clients.', requirements: '5+ years experience in travel industry\nExcellent communication skills\nGDS knowledge'}])
            }
            setLoading(false);
        });
    }, []);

    const handleApplyClick = (job: any) => {
        setSelectedJob(job);
        setSuccess(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setIsModalOpen(true);
    };

    const handleApplicationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await saveConsultation({
                type: 'Job Application',
                itemId: selectedJob?.id || 'general',
                itemName: selectedJob?.title || 'General Application',
                ...formData,
                status: 'pending'
            });
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit. Please try again later.");
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header with Background Image */}
            <div className="bg-slate-900 text-white py-24 px-4 mb-12 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay" 
                    style={{backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')"}}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-serif mb-6 tracking-tight drop-shadow-lg">Join Our Team</h1>
                    <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-medium drop-shadow-md">Help us build the future of travel. Discover your next career move at HQ Travels.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
               {loading ? (
                   <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-slate-900" /></div>
               ) : jobs.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                       <Briefcase className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                       <h2 className="text-2xl font-bold text-slate-800">No Open Positions</h2>
                       <p className="text-slate-500 mt-2">We are not actively hiring right now, but please check back later.</p>
                   </div>
               ) : (
                   <div className="grid grid-cols-1 gap-6">
                       {jobs.map((job, idx) => (
                           <motion.div key={job.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: idx * 0.1}} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                               <div>
                                   <h3 className="text-2xl font-bold text-slate-900 mb-3">{job.title}</h3>
                                   <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-primary" /> {job.location || 'Dhaka, BD'}</span>
                                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-primary" /> {job.jobType || 'Full-time'}</span>
                                   </div>
                                   <p className="text-slate-600 line-clamp-2 md:line-clamp-none">{job.description}</p>
                               </div>
                               <button 
                                   onClick={() => handleApplyClick(job)}
                                   className="whitespace-nowrap bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shrink-0 w-full md:w-auto"
                               >
                                   Apply Now
                               </button>
                           </motion.div>
                       ))}
                   </div>
               )}
            </div>

            {/* Application Form Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.95, y: 20 }} 
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg my-8"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
                                <h3 className="text-xl font-bold text-slate-800 font-serif">Apply for {selectedJob?.title}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-200 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 md:p-8">
                                {success ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h4>
                                        <p className="text-slate-600 mb-6 font-medium">Thank you for your interest. Our HR team will review your application and contact you soon.</p>
                                        <button 
                                            onClick={() => setIsModalOpen(false)}
                                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition"
                                        >
                                            Close
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplicationSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
                                                <input 
                                                    type="email" 
                                                    required 
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number *</label>
                                                <input 
                                                    type="tel" 
                                                    required 
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium"
                                                    placeholder="+880..."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Portfolio Link / Experience details *</label>
                                            <textarea 
                                                required 
                                                rows={4}
                                                value={formData.message}
                                                onChange={e => setFormData({...formData, message: e.target.value})}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium resize-none"
                                                placeholder="Link to your CV/Portfolio or tell us about your experience..."
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={submitting}
                                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-50"
                                        >
                                            {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                                            {submitting ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CareersPage;
