import React, { useState, useEffect, useContext } from 'react';
import { Plane, User, Phone, ShieldCheck, MapPin, Mail, Navigation, Facebook, Instagram, Twitter, Linkedin, Send, Youtube, MessageCircle, Video, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { getSupportChannels } from '../services/firebaseService';
import { FeaturesContext } from '../context/FeaturesContext';

interface LayoutProps {
  children: React.ReactNode;
  customLogo?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, customLogo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [supportData, setSupportData] = useState<any>(null);
  const location = useLocation();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.substring(1);
  const features = useContext(FeaturesContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getSupportChannels().then(data => {
        if(data) setSupportData(data);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b border-slate-100 py-2' : 'bg-white shadow-sm py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 transition-all"> 
            
            <Link to="/" className="flex items-center cursor-pointer group gap-3">
              <img 
                  src={customLogo || "/favicon.png"}
                  alt={features.brandName || "HQ Travels"} 
                  className="h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                       // Try .ico if .png fails
                       if (e.currentTarget.src.includes('favicon.png')) {
                           e.currentTarget.src = customLogo || "/favicon.ico";
                       } else {
                           e.currentTarget.style.display = 'none';
                       }
                  }}
              />
              {(features.showBrandName ?? true) && (
                  <span className="text-xl md:text-2xl font-black tracking-tight text-[#0f172a]">
                      {features.brandName || "HQ TRAVELS"}
                  </span>
              )}
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                  { id: 'home', label: 'Home', show: features.topNavHomeEnabled !== false }, 
                  { id: 'hotels', label: 'Hotels', show: features.topNavHotelsEnabled !== false && features.hotelsEnabled !== false }, 
                  { id: 'holidays', label: 'Holidays', show: features.topNavHolidaysEnabled !== false && features.holidaysEnabled !== false }, 
                  { id: 'visa', label: 'Visa', show: features.topNavVisaEnabled !== false && features.visaEnabled !== false },
                  { id: 'about', label: 'About', show: features.topNavAboutEnabled === true },
                  { id: 'careers', label: 'Careers', show: features.topNavCareersEnabled === true && features.careersEnabled !== false },
                  { id: 'press', label: 'Press', show: features.topNavPressEnabled === true && features.pressEnabled !== false },
                  { id: 'blog', label: 'Blog', show: features.topNavBlogEnabled === true && features.blogEnabled !== false },
                  { id: 'help', label: 'Help', show: features.topNavHelpEnabled === true },
                  { id: 'privacy', label: 'Privacy', show: features.topNavPrivacyEnabled === true },
                  { id: 'terms', label: 'Terms', show: features.topNavTermsEnabled === true },
                  { id: 'refund', label: 'Refund', show: features.topNavRefundEnabled === true },
              ].filter(item => item.show).map(({ id: item, label }) => {
                  const targetPath = item === 'home' ? '/' : `/${item}`;
                  const isActive = currentPage === item || (item === 'home' && currentPage === '');
                  return (
                    <Link 
                      key={item}
                      to={targetPath}
                      className={`relative px-5 py-2 text-sm font-bold transition-colors rounded-full
                        ${isActive 
                            ? 'text-primary bg-blue-50/80' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                      {label}
                    </Link>
                  );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/contact" className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 group ring-1 ring-white/20">
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                    <Headphones className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-white tracking-wide">Contact Us</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area w/ Top Padding for Fixed Header */}
      <main className="flex-grow bg-white pt-[80px] md:pt-[96px]">
        {children}
      </main>

      {/* Newsletter Section */}
      <section className="bg-primary border-b border-blue-600">
          <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 max-w-lg text-white">
                  <h3 className="text-3xl font-bold font-serif mb-3">Get Exclusive Travel Deals</h3>
                  <p className="text-blue-100 text-lg">Subscribe to our newsletter for insider discounts, destination guides, and more.</p>
              </div>
              <div className="w-full md:w-auto flex-1 max-w-md relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email address..." 
                    className="w-full pl-6 pr-32 py-4 rounded-full bg-blue-800/30 border border-blue-400 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white focus:bg-blue-800/50 transition-all font-medium"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-white text-primary px-6 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-md flex items-center whitespace-nowrap">
                      Subscribe
                  </button>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="md:col-span-4">
              <div className="flex items-center mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center mr-3 relative overflow-hidden group">
                      <div className="absolute inset-0 border-[1.5px] border-white/20 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      <Plane className="h-5 w-5 md:h-6 md:w-6 text-white transform -rotate-45 relative z-10 group-hover:text-secondary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xl md:text-2xl font-bold tracking-widest font-sans text-white uppercase" style={{fontFamily: "'Space Grotesk', sans-serif"}}>{features.brandName || "HQ TRAVELS"}</span>
                      <span className="text-[9px] md:text-[10px] text-secondary font-extrabold tracking-[0.3em] uppercase mt-0.5">Let's Fly Higher</span>
                  </div>
              </div>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                Your trusted partner for hassle-free travel, real-time booking, and unforgettable journeys across the globe. We make every trip a masterpiece.
              </p>
              
              <div className="flex space-x-4">
                  {(supportData?.socials || []).map((social: any, idx: number) => {
                      let Icon = Navigation;
                      let hoverColor = "hover:bg-primary";
                      switch(social.platform) {
                          case 'facebook': Icon = Facebook; hoverColor = "hover:bg-[#1877F2]"; break;
                          case 'instagram': Icon = Instagram; hoverColor = "hover:bg-[#E4405F]"; break;
                          case 'twitter': Icon = Twitter; hoverColor = "hover:bg-[#1DA1F2]"; break;
                          case 'linkedin': Icon = Linkedin; hoverColor = "hover:bg-[#0A66C2]"; break;
                          case 'youtube': Icon = Youtube; hoverColor = "hover:bg-[#FF0000]"; break;
                          case 'whatsapp': Icon = MessageCircle; hoverColor = "hover:bg-[#25D366]"; break;
                          case 'telegram': Icon = Send; hoverColor = "hover:bg-[#0088cc]"; break;
                          case 'tiktok': Icon = Video; hoverColor = "hover:bg-[#000000]"; break;
                      }
                      
                      const p = social.platform;
                      const url = social.link.startsWith('http') ? social.link : 
                          (p === 'whatsapp' ? `https://wa.me/${social.link.replace(/[^0-9]/g, '')}` : 
                          (p === 'telegram' ? `https://t.me/${social.link.replace('@', '')}` : `https://${p}.com/${social.link}`));
                      
                      return (
                          <a key={idx} href={url} target="_blank" rel="noreferrer" className={`w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center ${hoverColor} hover:-translate-y-1 transition-all duration-300 group`}>
                              <Icon className="w-4 h-4 text-slate-300 group-hover:text-white" />
                          </a>
                      )
                  })}
              </div>
            </div>

            {/* Links Column 1 */}
            <div className="md:col-span-2 md:col-start-6">
              <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Company</h3>
              <ul className="space-y-4 text-slate-400 font-medium">
                {features.navAboutEnabled !== false && <li><Link to="/about" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">About Us</Link></li>}
                {features.navCareersEnabled !== false && features.careersEnabled !== false && <li><Link to="/careers" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Careers</Link></li>}
                {features.navPressEnabled !== false && features.pressEnabled !== false && <li><Link to="/press" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Press & Media</Link></li>}
                {features.navBlogEnabled !== false && features.blogEnabled !== false && <li><Link to="/blog" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Travel Blog</Link></li>}
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Support</h3>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link to="/contact" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Contact Us</Link></li>
                {features.navHelpEnabled !== false && <li><Link to="/help" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Help Center</Link></li>}
                {features.navPrivacyEnabled !== false && <li><Link to="/privacy" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Privacy Policy</Link></li>}
                {features.navTermsEnabled !== false && <li><Link to="/terms" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Terms of Service</Link></li>}
                {features.navRefundEnabled !== false && <li><Link to="/refund" onClick={() => window.scrollTo(0,0)} className="hover:text-secondary hover:translate-x-1 transition-transform inline-block">Refund Rules</Link></li>}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="md:col-span-3">
                <h3 className="font-bold text-lg mb-6 text-white tracking-wide">Contact Us</h3>
                <ul className="space-y-5 text-slate-300">
                    <li className="flex items-start">
                        <MapPin className="w-5 h-5 text-secondary mr-3 shrink-0 mt-0.5" />
                        <span className="leading-relaxed whitespace-pre-line">
                            {supportData?.address || "37/2 Fayenaz Tower, 4th Floor, Suite # (4-D)\nBox Culvert Road, Purana Paltan\nDhaka-1000, Bangladesh"}
                        </span>
                    </li>
                    <li className="flex items-center">
                        <Phone className="w-5 h-5 text-secondary mr-3 shrink-0" />
                        <span className="font-bold text-white tracking-wider">{supportData?.phone || "01748-116167"}</span>
                    </li>
                    <li className="flex items-center hover:text-white transition-colors cursor-pointer">
                        <Mail className="w-5 h-5 text-secondary mr-3 shrink-0" />
                        <a href={`mailto:${supportData?.email || "zohir.hqtravels01@gmail.com"}`}>{supportData?.email || "zohir.hqtravels01@gmail.com"}</a>
                    </li>
                </ul>
            </div>

          </div>
          
          <div className="border-t border-slate-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 font-medium text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} HQ Travels & Tours. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-slate-500 font-medium text-sm">
                <span>Designed for Excellence.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
