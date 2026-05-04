import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getPressReleases } from '../services/firebaseService';
import { Loader2, ExternalLink, Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PressMediaPage: React.FC = () => {
    const [releases, setReleases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPressReleases().then(d => {
            if (d.length > 0) {
                setReleases(d.sort((a: any, b: any) => b.createdAt - a.createdAt)); // Basic sort by newest
            } else {
                setReleases([{id: '1', title: 'HQ Travels wins Best Travel Agency Award 2026', publishedAt: 'October 12, 2026', source: 'Travel Weekly', summary: 'We are thrilled to announce that HQ Travels & Tours has been recognized for outstanding services in the aviation and tourism sector.', link: '#'}])
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-slate-900 text-white py-20 px-4 mb-12 relative">
                <div className="absolute inset-0 bg-blue-900/20"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-6">Press & Media</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">Latest news, announcements, and coverage about HQ Travels.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               {loading ? (
                   <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-slate-900" /></div>
               ) : releases.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                       <Newspaper className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                       <h2 className="text-2xl font-bold text-slate-800">No Press Releases Yet</h2>
                   </div>
               ) : (
                   <div className="grid grid-cols-1 gap-6">
                        {releases.map((item, idx) => (
                            <motion.div 
                               key={item.id} 
                               initial={{opacity:0, y:20}} 
                               animate={{opacity:1, y:0}} 
                               transition={{delay: idx * 0.1}} 
                             >
                                <Link 
                                   to={`/press/post/${item.id}`} 
                                   onClick={() => window.scrollTo(0,0)} 
                                   className="bg-white p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group block w-full text-left"
                                 >
                                   <div>
                                       <div className="flex items-center text-sm font-bold text-slate-500 mb-3">
                                           <span className="bg-blue-50 text-primary px-3 py-1 rounded-full">{item.publisher || item.source || 'HQ Travels'}</span>
                                           <span className="mx-3 opacity-30">•</span>
                                           <Calendar className="w-4 h-4 mr-1.5" /> {item.date || item.publishedAt}
                                       </div>
                                       <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary transition mb-3">{item.title}</h3>
                                       <p className="text-sm font-bold text-primary flex items-center group-hover:underline">Read Release <ArrowRight className="w-4 h-4 ml-1" /></p>
                                   </div>
                                </Link>
                            </motion.div>
                        ))}
                   </div>
               )}
            </div>
        </div>
    );
};

export default PressMediaPage;
