import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getJobs } from '../services/firebaseService';
import { Loader2, Briefcase, MapPin, Clock } from 'lucide-react';

const CareersPage: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs().then(d => {
            if (d.length > 0) {
                setJobs(d);
            } else {
                setJobs([{id: '1', title: 'Senior Travel Consultant', location: 'Dhaka, Bangladesh', type: 'Full-time', description: 'We are looking for an experienced travel consultant to handle bespoke tour packages and VIP clients.', requirements: '5+ years experience in travel industry\nExcellent communication skills\nGDS knowledge'}])
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-slate-900 text-white py-20 px-4 mb-12">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-6">Join Our Team</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">Help us build the future of travel. Discover your next career move at HQ Travels.</p>
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
                                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-primary" /> {job.location}</span>
                                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-primary" /> {job.jobType}</span>
                                   </div>
                                   <p className="text-slate-600 line-clamp-2 md:line-clamp-none">{job.description}</p>
                               </div>
                               <button className="whitespace-nowrap bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shrink-0 w-full md:w-auto">Apply Now</button>
                           </motion.div>
                       ))}
                   </div>
               )}
            </div>
        </div>
    );
};

export default CareersPage;
