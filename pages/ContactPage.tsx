import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Link } from 'lucide-react';
import { getSupportChannels } from '../services/firebaseService';

const ContactPage: React.FC = () => {
    const [supportData, setSupportData] = useState<any>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        getSupportChannels().then(data => {
            if(data) setSupportData(data);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 font-serif mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-600">We'd love to hear from you. Get in touch with our team.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 font-serif text-center border-b border-slate-200 pb-6">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <ul className="space-y-8 text-slate-700">
                                <li className="flex items-start">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">Our Location</h3>
                                        <span className="leading-relaxed whitespace-pre-line text-slate-600">
                                            {supportData?.address || "37/2 Fayenaz Tower, 4th Floor, Suite # (4-D)\nBox Culvert Road, Purana Paltan\nDhaka-1000, Bangladesh"}
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">Phone Number</h3>
                                        <span className="text-slate-600 font-medium tracking-wide">
                                            {supportData?.phone || "01748-116167"}
                                        </span>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4 shrink-0">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1">Email Address</h3>
                                        <a href={`mailto:${supportData?.email || "zohir.hqtravels01@gmail.com"}`} className="text-primary hover:underline font-medium">
                                            {supportData?.email || "zohir.hqtravels01@gmail.com"}
                                        </a>
                                    </div>
                                </li>
                            </ul>
                            
                            {(supportData?.socials && supportData.socials.length > 0) && (
                                <div className="mt-12 pt-8 border-t border-slate-100">
                                    <h3 className="font-bold text-lg text-slate-900 mb-4">Follow Us on Social Media</h3>
                                    <div className="flex flex-wrap items-center gap-4">
                                        {supportData.socials.map((social: any, index: number) => {
                                            if (!social.link) return null;
                                            const p = social.platform;
                                            const url = social.link.startsWith('http') ? social.link : 
                                                        (p === 'whatsapp' ? `https://wa.me/${social.link.replace(/[^0-9]/g, '')}` : 
                                                        (p === 'telegram' ? `https://t.me/${social.link.replace('@', '')}` : `https://${p}.com/${social.link}`));
                                            
                                            // Platform colors and icons mapping
                                            const platformConfig: any = {
                                                'facebook': { icon: <Facebook className="w-5 h-5" />, bg: 'bg-blue-50 hover:bg-[#1877F2]', text: 'text-[#1877F2] hover:text-white' },
                                                'instagram': { icon: <Instagram className="w-5 h-5" />, bg: 'bg-pink-50 hover:bg-[#E4405F]', text: 'text-[#E4405F] hover:text-white' },
                                                'twitter': { icon: <Twitter className="w-5 h-5" />, bg: 'bg-sky-50 hover:bg-[#1DA1F2]', text: 'text-[#1DA1F2] hover:text-white' },
                                                'linkedin': { icon: <Linkedin className="w-5 h-5" />, bg: 'bg-blue-50 hover:bg-[#0A66C2]', text: 'text-[#0A66C2] hover:text-white' },
                                                'youtube': { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, bg: 'bg-red-50 hover:bg-[#FF0000]', text: 'text-[#FF0000] hover:text-white' },
                                                'whatsapp': { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>, bg: 'bg-green-50 hover:bg-[#25D366]', text: 'text-[#25D366] hover:text-white' },
                                                'telegram': { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.666 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>, bg: 'bg-blue-50 hover:bg-[#2AABEE]', text: 'text-[#2AABEE] hover:text-white' },
                                                'tiktok': { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.014 3.91-.015.082 1.5.556 3.013 1.636 4.148 1.1 1.155 2.651 1.7 4.185 1.884v3.832c-1.317-.008-2.627-.271-3.835-.8-1.148-.5-2.181-1.253-2.946-2.22l-.019 6.574c-.005 2.127-.723 4.2-2.025 5.836-1.294 1.616-3.155 2.637-5.187 2.87-2.112.23-4.269-.262-6.002-1.378-1.67-1.077-2.903-2.73-3.376-4.646-.46-1.874-.19-3.874.757-5.52a8.539 8.539 0 0 1 3.553-3.3m0 0v4.06c-1.713-.013-3.37.669-4.57 1.888-1.168 1.189-1.815 2.825-1.785 4.493.033 1.69 1.107 3.342 2.623 4.2C8.75 23.36 10.97 23.47 12.82 22.42c1.86-1.047 3.047-3.003 3.023-5.132l-.014-17.272z"/></svg>, bg: 'bg-black hover:bg-black', text: 'text-black hover:text-white' }
                                            };
                                            const config = platformConfig[p] || { icon: <Link className="w-5 h-5" />, bg: 'bg-slate-100 hover:bg-slate-800', text: 'text-slate-600 hover:text-white' };

                                            return (
                                                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${config.bg} ${config.text}`}>
                                                    {config.icon}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                            <h3 className="font-bold text-xl text-slate-900 mb-4">Why Book With Us?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center text-slate-700">
                                    <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                                    Guaranteed best pricing
                                </li>
                                <li className="flex items-center text-slate-700">
                                    <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                                    24/7 dedicated customer support
                                </li>
                                <li className="flex items-center text-slate-700">
                                    <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                                    Secure and reliable transactions
                                </li>
                                <li className="flex items-center text-slate-700">
                                    <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                                    Expert travel consultants
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
