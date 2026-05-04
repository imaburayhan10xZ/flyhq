import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const SuccessPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 text-center"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 font-serif mb-3">Request Confirmed!</h1>
                <p className="text-slate-600 mb-8 font-medium">
                    Thank you for providing your information. Our team has received your request and will contact you shortly.
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-slate-900/30 flex items-center justify-center"
                    >
                        Return to Homepage <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button 
                        onClick={() => navigate('/contact')} 
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-4 rounded-xl transition border border-slate-200"
                    >
                        View Contact Info
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SuccessPage;
