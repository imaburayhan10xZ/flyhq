import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getPageData } from '../services/firebaseService';
import { Loader2 } from 'lucide-react';

const AboutUsPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPageData('about').then(d => {
            setData(d || { title: 'About Us', content: 'Content coming soon...' });
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-primary text-white py-20 px-4 mb-12 relative overflow-hidden">
                {data?.imageUrl && (
                    <div className="absolute inset-0 z-0">
                        <img src={data.imageUrl} className="w-full h-full object-cover opacity-30" alt="About Us" />
                    </div>
                )}
                <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-serif mb-6">{data?.title}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                   {data?.content}
               </motion.div>
            </div>
        </div>
    );
};

export default AboutUsPage;
