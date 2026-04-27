import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { getFirebaseBookings } from '../services/firebaseService';
import { 
  LayoutDashboard, Ticket, DollarSign, Users, Upload, Image as ImageIcon, 
  Loader2, CheckCircle, Search, Menu, Settings, Plane, BedDouble, 
  Plus, Edit2, Trash2, Bell, ChevronRight, MoreVertical, X, LogIn, ShieldCheck,
  Palmtree, FileText, Phone, LogOut
} from 'lucide-react';
import { uploadImage } from '../services/cloudinaryService';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../components/AuthProvider';
import { getHotelOffers, saveHotelOffer, deleteHotelOffer, getHolidayPackages, saveHolidayPackage, deleteHolidayPackage, getVisaServices, saveVisaService, deleteVisaService, getPageData, savePageData, getJobs, saveJob, deleteJob, getPressReleases, savePressRelease, deletePressRelease, getBlogPosts, saveBlogPost, deleteBlogPost, getSupportChannels, saveSupportChannels, getDestinations, saveDestination, deleteDestination, getAdminFlights, saveAdminFlight, deleteAdminFlight, getUsers, updateUserRole } from '../services/firebaseService';

interface AdminDashboardProps {
    onLogoUpdate?: (url: string) => void;
    currentLogo?: string;
}

type TabType = 'overview' | 'bookings' | 'flights' | 'destinations' | 'hotels' | 'holidays' | 'visa' | 'pages' | 'careers' | 'press' | 'blog' | 'users' | 'settings' | 'support_channels';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogoUpdate, currentLogo }) => {
  const { user, isAdmin, loading, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          await logout();
          navigate('/');
      } catch(e) {}
  };
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, pending: 0 });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [visas, setVisas] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [adminFlights, setAdminFlights] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('about');
  const [aboutUsData, setAboutUsData] = useState<any>({title: '', content: '', imageUrl: ''});
  const [supportData, setSupportData] = useState<any>({ address: '', phone: '', email: '', socials: [] });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Settings Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [siteName, setSiteName] = useState('HQ Travels & Tours');

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'hotel'|'holiday'|'visa'|'career'|'press'|'blog'|'destination'|'flight'|null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
      if (!isAdmin) return;
      getPageData(selectedPageId).then(p => {
          if (p) setAboutUsData(p);
          else setAboutUsData({title: '', content: '', imageUrl: ''});
      });
  }, [selectedPageId, isAdmin]);

  useEffect(() => {
      if (!isAdmin) return;
      getSupportChannels().then(data => {
          if (data) setSupportData(data);
      });
  }, [isAdmin]);

  const openModal = (type: 'hotel'|'holiday'|'visa'|'career'|'press'|'blog'|'destination'|'flight', data?: any) => {
      setModalType(type);
      setFormData(data || {});
      setModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
        const id = formData.id || Date.now().toString();
        const isEdit = !!formData.id;
        
        if(modalType === 'hotel') {
            const data = {
                title: formData.title || 'New Hotel',
                description: formData.description || 'Description',
                location: formData.location || 'Location',
                price: Number(formData.price) || 100,
                stars: Number(formData.stars) || 5,
                imageUrl: formData.imageUrl || ''
            };
            await saveHotelOffer(id, data);
            setHotels(isEdit ? hotels.map(h => h.id === id ? {id, ...data} : h) : [...hotels, {id, ...data}]);
        } else if(modalType === 'holiday') {
             const data = {
                title: formData.title || 'New Package',
                description: formData.description || 'Description',
                location: formData.location || 'Location',
                price: Number(formData.price) || 500,
                duration: formData.duration || '3 Days, 2 Nights',
                imageUrl: formData.imageUrl || ''
            };
            await saveHolidayPackage(id, data);
            setHolidays(isEdit ? holidays.map(h => h.id === id ? {id, ...data} : h) : [...holidays, {id, ...data}]);
        } else if(modalType === 'visa') {
             const data = {
                country: formData.country || 'Country',
                description: formData.description || 'Description',
                processingTime: formData.processingTime || '5 Days',
                price: Number(formData.price) || 50,
                imageUrl: formData.imageUrl || ''
            };
            await saveVisaService(id, data);
            setVisas(isEdit ? visas.map(v => v.id === id ? {id, ...data} : v) : [...visas, {id, ...data}]);
        } else if(modalType === 'career') {
            const data = {
                title: formData.title || 'New Job',
                location: formData.location || 'Location',
                jobType: formData.jobType || 'Full-time',
                description: formData.description || 'Description'
            };
            await saveJob(id, data);
            setJobs(isEdit ? jobs.map(j => j.id === id ? {id, ...data} : j) : [...jobs, {id, ...data}]);
        } else if(modalType === 'press') {
            const data = {
                title: formData.title || 'Press Release',
                date: formData.date || 'Today',
                link: formData.link || '#',
                publisher: formData.publisher || 'HQ Travels'
            };
            await savePressRelease(id, data);
            setPressReleases(isEdit ? pressReleases.map(pr => pr.id === id ? {id, ...data} : pr) : [...pressReleases, {id, ...data}]);
        } else if(modalType === 'blog') {
            const data = {
                title: formData.title || 'Blog Post',
                author: formData.author || 'Author',
                excerpt: formData.excerpt || 'Excerpt',
                content: formData.content || 'Content',
                imageUrl: formData.imageUrl || '',
                date: formData.date || new Date().toISOString()
            };
            await saveBlogPost(id, data);
            setBlogPosts(isEdit ? blogPosts.map(bp => bp.id === id ? {id, ...data} : bp) : [...blogPosts, {id, ...data}]);
        } else if (modalType === 'destination') {
            const data = {
                city: formData.city || 'City',
                country: formData.country || 'Country',
                price: formData.price || 'Starts from ৳0',
                image: formData.image || ''
            };
            await saveDestination(id, data);
            setDestinations(isEdit ? destinations.map(d => d.id === id ? {id, ...data} : d) : [...destinations, {id, ...data}]);
        } else if (modalType === 'flight') {
            const data = {
                origin: formData.origin || 'DAC',
                destination: formData.destination || 'DXB',
                airline: formData.airline || 'Biman',
                flightNumber: formData.flightNumber || 'BG-101',
                price: Number(formData.price) || 5000,
                duration: formData.duration || '2h',
                stops: Number(formData.stops) || 0
            };
            await saveAdminFlight(id, data);
            setAdminFlights(isEdit ? adminFlights.map(f => f.id === id ? {id, ...data} : f) : [...adminFlights, {id, ...data}]);
        }
        setModalOpen(false);
    } catch(err) {
        console.error(err);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      try {
        const [b, h, hol, v, p, j, pr, bl, dests, flights, usersData] = await Promise.all([
            getFirebaseBookings(),
            getHotelOffers(),
            getHolidayPackages(),
            getVisaServices(),
            getPageData('about'),
            getJobs(),
            getPressReleases(),
            getBlogPosts(),
            getDestinations(),
            getAdminFlights(),
            getUsers()
        ]);
        setBookings(b || []);
        setHotels(h || []);
        setHolidays(hol || []);
        setVisas(v || []);
        if(p) setAboutUsData(p);
        setJobs(j || []);
        setPressReleases(pr || []);
        setBlogPosts(bl || []);
        setDestinations(dests || []);
        setAdminFlights(flights || []);
        setUsersList(usersData || []);
        const validBookings = b || [];
        const totalRevenue = validBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        setStats({
          totalBookings: validBookings.length,
          revenue: totalRevenue,
          pending: validBookings.filter(booking => booking.status === 'PENDING').length
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Admin Portal</h1>
            <p className="text-slate-500 text-center mb-8 font-medium">
              {user ? "You don't have admin privileges." : "Sign in to access the control panel."}
            </p>
            {user ? (
               <button onClick={handleLogout} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition">Sign Out</button>
            ) : (
               <button onClick={signInWithGoogle} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <LogIn className="w-5 h-5 mr-2" /> Sign In with Google
               </button>
            )}
        </div>
      </div>
    );
  }

  const handleDeleteHotel = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this hotel?')) {
          await deleteHotelOffer(id);
          setHotels(hotels.filter(h => h.id !== id));
      }
  }
  
  const handleDeleteHoliday = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this holiday?')) {
          await deleteHolidayPackage(id);
          setHolidays(holidays.filter(h => h.id !== id));
      }
  }

  const handleDeleteVisa = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this visa service?')) {
          await deleteVisaService(id);
          setVisas(visas.filter(v => v.id !== id));
      }
  }

  const handleDeleteDestination = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this destination?')) {
          await deleteDestination(id);
          setDestinations(destinations.filter(d => d.id !== id));
      }
  }

  const handleDeleteFlight = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this flight?')) {
          await deleteAdminFlight(id);
          setAdminFlights(adminFlights.filter(f => f.id !== id));
      }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setUploadSuccess(false);
      try {
          const url = await uploadImage(file);
          if (onLogoUpdate) {
              onLogoUpdate(url);
          }
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
          alert("Failed to upload image. Please try again.");
      } finally {
          setUploading(false);
      }
  };

  const salesData = [
    { name: 'Mon', revenue: 4000, bookings: 24 },
    { name: 'Tue', revenue: 3000, bookings: 18 },
    { name: 'Wed', revenue: 5000, bookings: 32 },
    { name: 'Thu', revenue: 2780, bookings: 15 },
    { name: 'Fri', revenue: 6890, bookings: 45 },
    { name: 'Sat', revenue: 8390, bookings: 55 },
    { name: 'Sun', revenue: 7490, bookings: 48 },
  ];

  const mockFlights = [
      { id: 'FL-101', route: 'DAC - DXB', airline: 'Emirates', price: '$450', status: 'Active', capacity: '85%' },
      { id: 'FL-205', route: 'DAC - LHR', airline: 'Biman', price: '$850', status: 'Active', capacity: '92%' },
      { id: 'FL-309', route: 'CXB - DAC', airline: 'US-Bangla', price: '$50', status: 'Delayed', capacity: '100%' },
      { id: 'FL-412', route: 'DAC - SIN', airline: 'Singapore Air', price: '$350', status: 'Active', capacity: '78%' },
  ];

  const TABS = [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'bookings', label: 'All Bookings', icon: Ticket },
      { id: 'flights', label: 'Flight Inventory', icon: Plane },
      { id: 'destinations', label: 'Destinations', icon: ImageIcon },
      { id: 'hotels', label: 'Hotel Partners', icon: BedDouble },
      { id: 'holidays', label: 'Holiday Packages', icon: Palmtree },
      { id: 'visa', label: 'Visa Services', icon: FileText },
      { id: 'pages', label: 'Dynamic Pages', icon: FileText },
      { id: 'careers', label: 'Careers', icon: FileText },
      { id: 'press', label: 'Press & Media', icon: FileText },
      { id: 'blog', label: 'Travel Blog', icon: FileText },
      { id: 'support_channels', label: 'Support Channels', icon: Phone },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const renderContent = () => {
      switch(activeTab) {
          case 'overview':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-24 h-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-slate-500 font-medium tracking-wide text-sm uppercase">Total Revenue</span>
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                            </div>
                            <div className="text-4xl font-bold text-slate-900 relative z-10 font-serif">${stats.revenue.toLocaleString()}</div>
                            <div className="mt-3 text-sm font-bold text-green-600 flex items-center bg-green-50 w-fit px-2 py-1 rounded-md"><ChevronRight className="w-4 h-4 mr-0.5 -rotate-45" /> +14.5%</div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Ticket className="w-24 h-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-slate-500 font-medium tracking-wide text-sm uppercase">Total Bookings</span>
                                <div className="p-2 bg-blue-50 text-primary rounded-lg"><Ticket className="w-5 h-5" /></div>
                            </div>
                            <div className="text-4xl font-bold text-slate-900 relative z-10 font-serif">{stats.totalBookings}</div>
                            <div className="mt-3 text-sm font-bold text-green-600 flex items-center bg-green-50 w-fit px-2 py-1 rounded-md"><ChevronRight className="w-4 h-4 mr-0.5 -rotate-45" /> +5.2%</div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Users className="w-24 h-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-slate-500 font-medium tracking-wide text-sm uppercase">Active Users</span>
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Users className="w-5 h-5" /></div>
                            </div>
                            <div className="text-4xl font-bold text-slate-900 relative z-10 font-serif">1,204</div>
                            <div className="mt-3 text-sm font-bold text-slate-500 flex items-center bg-slate-50 w-fit px-2 py-1 rounded-md text-nowrap">Across all platforms</div>
                        </div>

                        <div onClick={() => setActiveTab('bookings')} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <span className="text-slate-500 font-medium tracking-wide text-sm uppercase">Pending Approvals</span>
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Loader2 className="w-5 h-5 animate-spin" /></div>
                            </div>
                            <div className="text-4xl font-bold text-slate-900 relative z-10 font-serif">{stats.pending || 3}</div>
                            <div className="mt-3 text-sm font-bold text-red-600 flex items-center bg-red-50 w-fit px-2 py-1 rounded-md text-nowrap">Requires attention</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Revenue Overview</h3>
                                    <p className="text-sm text-slate-500">Weekly breakdown of generated sales.</p>
                                </div>
                                <select className="text-sm border border-slate-200 rounded-lg text-slate-600 outline-none font-bold bg-slate-50 px-3 py-2 mt-4 md:mt-0 focus:ring-2 focus:ring-primary/20">
                                    <option>Last 7 Days</option>
                                    <option>This Month</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#006CE4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#006CE4" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                                        <Area type="monotone" dataKey="revenue" stroke="#006CE4" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                            </div>
                            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                                {[1,2,3,4,5].map((_, i) => (
                                    <div key={i} className="flex items-start group">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0 mr-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <Ticket className="w-5 h-5" />
                                        </div>
                                        <div className="pb-4 border-b border-slate-50 w-full group-last:border-0 group-last:pb-0">
                                            <p className="text-sm font-bold text-slate-900 leading-tight">New Booking <span className="text-primary cursor-pointer hover:underline">#BK-{2049 + i}</span></p>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">Flight from DAC to DXB passenger added.</p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{i * 2 + 1} hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                  </motion.div>
              );
          case 'settings':
              return (
                  <motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} className="max-w-4xl">
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                          <div className="p-6 md:p-8 border-b border-slate-100">
                              <h2 className="text-2xl font-bold text-slate-900">Platform Settings</h2>
                              <p className="text-slate-500 mt-1 font-medium">Manage your agency's branding and core configurations.</p>
                          </div>
                          
                          <div className="p-6 md:p-8 space-y-10">
                              {/* Branding */}
                              <section>
                                  <h3 className="text-lg font-bold text-slate-900 flex items-center mb-6">
                                      <ImageIcon className="w-5 h-5 mr-2 text-primary" /> Global Branding
                                  </h3>
                                  <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-40 h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative shrink-0 shadow-inner">
                                        {currentLogo ? (
                                            <img src={currentLogo} alt="Current Logo" className="w-full h-full object-contain p-4 drop-shadow-md" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">No Logo</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="cursor-pointer bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center transition shadow-lg shadow-blue-500/30 mb-4 min-w-[220px] justify-center">
                                            {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                                            {uploading ? "Uploading to Cloud..." : "Upload New Logo"}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                        </label>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-sm font-semibold text-slate-700 mb-1">Upload Guidelines</p>
                                            <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4 font-medium">
                                                <li>Maximum file size: 5MB.</li>
                                                <li>Recommended dimensions: 400x120px.</li>
                                                <li>Allowed formats: PNG (Transparent), WEBP, SVG.</li>
                                            </ul>
                                        </div>
                                        
                                        <AnimatePresence>
                                            {uploadSuccess && (
                                                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center text-sm font-bold border border-green-200">
                                                    <CheckCircle className="w-5 h-5 mr-2" /> Logo updated successfully across all platforms.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                  </div>
                              </section>

                              <hr className="border-slate-100" />

                              {/* General Config */}
                              <section>
                                  <h3 className="text-lg font-bold text-slate-900 flex items-center mb-6">
                                      <Settings className="w-5 h-5 mr-2 text-primary" /> General Configuration
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                      <div>
                                          <label className="block text-sm font-bold text-slate-700 mb-2">Agency Name</label>
                                          <input 
                                            type="text" 
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                                          <input 
                                            type="email" 
                                            defaultValue="admin@hqtravels.com"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-bold text-slate-700 mb-2">Support Phone Line</label>
                                          <input 
                                            type="text" 
                                            defaultValue="01748-116167"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
                                          <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition cursor-pointer">
                                              <option>BDT (৳)</option>
                                              <option>USD ($)</option>
                                          </select>
                                      </div>
                                  </div>
                                  <div className="mt-8 flex justify-end">
                                      <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-slate-900/20 active:translate-y-0.5 transform">Save Global Changes</button>
                                  </div>
                              </section>
                          </div>
                      </div>
                  </motion.div>
              );
          case 'flights':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Flight Inventory Management</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Control available routes, airlines, and markups.</p>
                          </div>
                          <button onClick={() => openModal('flight')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add New Flight
                          </button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                  <tr>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Route Info</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Airline</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Base Price</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Duration/Stops</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {adminFlights.map((flight, idx) => (
                                      <tr key={flight.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                                          <td className="px-6 py-5">
                                              <div className="font-bold text-slate-900 text-base">{flight.origin} - {flight.destination}</div>
                                              <div className="text-xs text-slate-400 font-mono font-bold mt-1 uppercase tracking-wider">{flight.flightNumber}</div>
                                          </td>
                                          <td className="px-6 py-5 font-bold text-slate-700">
                                              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">{flight.airline}</span>
                                          </td>
                                          <td className="px-6 py-5 font-extrabold text-primary text-base">৳{flight.price}</td>
                                          <td className="px-6 py-5">
                                              <div className="font-medium text-slate-700">{flight.duration}</div>
                                              <div className="text-xs text-slate-500 mt-1">{flight.stops} stop(s)</div>
                                          </td>
                                          <td className="px-6 py-5 text-right">
                                              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => openModal('flight', flight)} className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2.5 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                                  <button onClick={() => handleDeleteFlight(flight.id)} className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2.5 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                                  {adminFlights.length === 0 && (
                                     <tr>
                                         <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium">No flights added yet. Add one to see it here.</td>
                                     </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </motion.div>
              );
          case 'destinations':
            return (
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Destinations Management</h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">Manage trending destinations shown on the homepage.</p>
                        </div>
                        <button onClick={() => openModal('destination')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                            <Plus className="w-4 h-4 mr-2" /> Add Destination
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Image</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">City & Country</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Price Label</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {destinations.map((dest, idx) => (
                                    <tr key={dest.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            {dest.image ? <img src={dest.image} alt={dest.city} className="w-16 h-12 rounded object-cover" /> : <div className="w-16 h-12 bg-slate-100 rounded"></div>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 text-base">{dest.city}</div>
                                            <div className="text-xs text-slate-500">{dest.country}</div>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-primary">{dest.price}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal('destination', dest)} className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2.5 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteDestination(dest.id)} className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2.5 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {destinations.length === 0 && (
                                   <tr>
                                       <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">No destinations added yet. Add one to see it here.</td>
                                   </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            );
          case 'bookings':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                       <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">All Bookings</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">View and manage customer reservations in real-time.</p>
                          </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Reference</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Customer</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Type</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Net Revenue</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <span className="text-slate-500 font-bold text-base block">No bookings found in the system.</span>
                                            <span className="text-slate-400 font-medium text-sm mt-1">When users book flights or hotels, they will appear here.</span>
                                        </td>
                                    </tr>
                                ) : bookings.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 font-mono tracking-wide">{b.id}</div>
                                            <div className="text-xs font-bold text-slate-400 mt-1">{new Date(b.bookingDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900">{b.passenger.firstName} {b.passenger.lastName}</div>
                                            <div className="text-xs font-medium text-slate-500 mt-1">{b.passenger.email}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center font-bold text-slate-700 bg-slate-100 w-fit px-3 py-1.5 rounded-lg border border-slate-200">
                                                <Plane className="w-4 h-4 mr-2 text-primary" /> Flight
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-extrabold text-slate-900 text-base">${b.totalAmount}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200 inline-flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-primary bg-blue-50 hover:bg-primary hover:text-white border border-blue-100 hover:border-primary px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm opacity-0 group-hover:opacity-100">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  </motion.div>
              );
          case 'hotels':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Hotel Partners Management</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage partner hotels, room availability, and pricing.</p>
                          </div>
                          <button onClick={() => openModal('hotel')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add New Hotel
                          </button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                  <tr>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Hotel Details</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Stars</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Base Price</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {hotels.map((hotel: any) => (
                                      <tr key={hotel.id} className="hover:bg-slate-50/80 transition-colors group">
                                          <td className="px-6 py-5">
                                              <div className="font-bold text-slate-900 text-base">{hotel.title}</div>
                                              <div className="text-xs text-slate-400 font-mono font-bold mt-1 uppercase tracking-wider">{hotel.location}</div>
                                          </td>
                                          <td className="px-6 py-5 font-bold text-slate-700">{hotel.stars} Stars</td>
                                          <td className="px-6 py-5 font-extrabold text-primary text-base">${hotel.price}</td>
                                          <td className="px-6 py-5 text-right">
                                              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => openModal('hotel', hotel)} className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2.5 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                                  <button className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2.5 rounded-lg transition" onClick={() => handleDeleteHotel(hotel.id)}><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </motion.div>
              );
          case 'holidays':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Holiday Packages Management</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Design and oversee holiday packages across the globe.</p>
                          </div>
                          <button onClick={() => openModal('holiday')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add New Package
                          </button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                  <tr>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Package Details</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Duration</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Price</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {holidays.map((pkg: any) => (
                                      <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors group">
                                          <td className="px-6 py-5">
                                              <div className="font-bold text-slate-900 text-base">{pkg.title}</div>
                                              <div className="text-xs text-slate-400 font-mono font-bold mt-1 uppercase tracking-wider">{pkg.location}</div>
                                          </td>
                                          <td className="px-6 py-5 font-bold text-slate-700">{pkg.duration}</td>
                                          <td className="px-6 py-5 font-extrabold text-primary text-base">${pkg.price}</td>
                                          <td className="px-6 py-5 text-right">
                                              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => openModal('holiday', pkg)} className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2.5 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                                  <button className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2.5 rounded-lg transition" onClick={() => handleDeleteHoliday(pkg.id)}><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </motion.div>
              );
          case 'visa':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Visa Services Management</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Configure processing requirements, fees, and standard visa services.</p>
                          </div>
                          <button onClick={() => openModal('visa')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add New Service
                          </button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                  <tr>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Country</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Processing Time</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Fee</th>
                                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {visas.map((visa: any) => (
                                      <tr key={visa.id} className="hover:bg-slate-50/80 transition-colors group">
                                          <td className="px-6 py-5">
                                              <div className="font-bold text-slate-900 text-base">{visa.country}</div>
                                          </td>
                                          <td className="px-6 py-5 font-bold text-slate-700">{visa.processingTime}</td>
                                          <td className="px-6 py-5 font-extrabold text-primary text-base">${visa.price}</td>
                                          <td className="px-6 py-5 text-right">
                                              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => openModal('visa', visa)} className="text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-2.5 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                                  <button className="text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-2.5 rounded-lg transition" onClick={() => handleDeleteVisa(visa.id)}><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </motion.div>
              );
          case 'pages':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Dynamic Pages</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage content for static website pages.</p>
                          </div>
                          <div className="flex gap-4 w-full md:w-auto">
                              <select 
                                  value={selectedPageId}
                                  onChange={(e) => setSelectedPageId(e.target.value)}
                                  className="w-full md:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none"
                              >
                                  <option value="about">About Us</option>
                                  <option value="help">Help Center</option>
                                  <option value="privacy">Privacy Policy</option>
                                  <option value="terms">Terms of Service</option>
                                  <option value="refund">Refund Rules</option>
                              </select>
                              <button onClick={() => {
                                  savePageData(selectedPageId, aboutUsData).then(() => alert('Saved!')).catch(e => alert(e.message));
                              }} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 whitespace-nowrap">
                                  Save Changes
                              </button>
                          </div>
                      </div>
                      <div className="p-6 space-y-4">
                          <div>
                              <label className="text-sm font-bold text-slate-700 block mb-1">Page Title</label>
                              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" value={aboutUsData.title || ''} onChange={e => setAboutUsData({...aboutUsData, title: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-sm font-bold text-slate-700 block mb-1">Image URL (Optional header image)</label>
                              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" value={aboutUsData.imageUrl || ''} onChange={e => setAboutUsData({...aboutUsData, imageUrl: e.target.value})} />
                          </div>
                          <div>
                              <label className="text-sm font-bold text-slate-700 block mb-1">Page Content (Markdown/Text)</label>
                              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium h-64 resize-none" value={aboutUsData.content || ''} onChange={e => setAboutUsData({...aboutUsData, content: e.target.value})}></textarea>
                          </div>
                      </div>
                  </motion.div>
              );
          case 'careers':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Careers</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage job postings.</p>
                          </div>
                          <button onClick={() => openModal('career')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add Job
                          </button>
                      </div>
                      <div className="p-6">
                            {jobs.map(j => (
                                <div key={j.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{j.title}</h4>
                                        <p className="text-sm text-slate-500">{j.location} • {j.jobType}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openModal('career', j)} className="text-blue-500 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">Edit</button>
                                        <button onClick={async () => {
                                            if(window.confirm('Delete?')) {
                                                await deleteJob(j.id);
                                                setJobs(jobs.filter(job => job.id !== j.id));
                                            }
                                        }} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">Delete</button>
                                    </div>
                                </div>
                            ))}
                      </div>
                  </motion.div>
              );
          case 'press':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Press & Media</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage press releases.</p>
                          </div>
                          <button onClick={() => openModal('press')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add Press Release
                          </button>
                      </div>
                      <div className="p-6">
                            {pressReleases.map(pr => (
                                <div key={pr.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{pr.title}</h4>
                                        <p className="text-sm text-slate-500">{pr.date} • {pr.publisher}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openModal('press', pr)} className="text-blue-500 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">Edit</button>
                                        <button onClick={async () => {
                                            if(window.confirm('Delete?')) {
                                                await deletePressRelease(pr.id);
                                                setPressReleases(pressReleases.filter(p => p.id !== pr.id));
                                            }
                                        }} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">Delete</button>
                                    </div>
                                </div>
                            ))}
                      </div>
                  </motion.div>
              );
          case 'blog':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Travel Blog</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage blog posts.</p>
                          </div>
                          <button onClick={() => openModal('blog')} className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-blue-500/20 w-full md:w-auto justify-center">
                              <Plus className="w-4 h-4 mr-2" /> Add Post
                          </button>
                      </div>
                      <div className="p-6">
                            {blogPosts.map(bp => (
                                <div key={bp.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{bp.title}</h4>
                                        <p className="text-sm text-slate-500">{bp.date} • By {bp.author}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openModal('blog', bp)} className="text-blue-500 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">Edit</button>
                                        <button onClick={async () => {
                                            if(window.confirm('Delete?')) {
                                                await deleteBlogPost(bp.id);
                                                setBlogPosts(blogPosts.filter(b => b.id !== bp.id));
                                            }
                                        }} className="text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">Delete</button>
                                    </div>
                                </div>
                            ))}
                      </div>
                  </motion.div>
              );
          case 'users':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">User & Admin Management</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage users and grant admin privileges. To add a new admin, ask them to sign in first, then grant them Admin here.</p>
                          </div>
                      </div>
                      <div className="p-6">
                            {usersList.map((u: any) => (
                                <div key={u.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{u.email}</h4>
                                        <p className="text-sm text-slate-500 capitalize">Role: <span className={u.role === 'admin' ? 'text-green-600 font-bold' : ''}>{u.role || 'user'}</span></p>
                                    </div>
                                    <div className="flex gap-2">
                                        {u.role !== 'admin' && (
                                            <button onClick={async () => {
                                                if(window.confirm(`Make ${u.email} an admin?`)) {
                                                    await updateUserRole(u.id, 'admin');
                                                    setUsersList(usersList.map(usr => usr.id === u.id ? {...usr, role: 'admin'} : usr));
                                                }
                                            }} className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">Make Admin</button>
                                        )}
                                        {u.role === 'admin' && u.email !== user?.email && (
                                            <button onClick={async () => {
                                                if(window.confirm(`Remove admin privileges for ${u.email}?`)) {
                                                    await updateUserRole(u.id, 'user');
                                                    setUsersList(usersList.map(usr => usr.id === u.id ? {...usr, role: 'user'} : usr));
                                                }
                                            }} className="text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100">Revoke Admin</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                      </div>
                  </motion.div>
              );
          case 'support_channels':
              return (
                  <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-50/50">
                          <div>
                              <h2 className="text-xl font-bold text-slate-900">Support Channels</h2>
                              <p className="text-sm font-medium text-slate-500 mt-1">Manage contact information and social links.</p>
                          </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1">Company Address</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" value={supportData.address || ''} onChange={e => setSupportData({...supportData, address: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1">Phone Number</label>
                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" value={supportData.phone || ''} onChange={e => setSupportData({...supportData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1">Email Address</label>
                                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" value={supportData.email || ''} onChange={e => setSupportData({...supportData, email: e.target.value})} />
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Social Channels</h3>
                                <button
                                    onClick={() => setSupportData({
                                        ...supportData,
                                        socials: [...(supportData.socials || []), { platform: 'facebook', link: '' }]
                                    })}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center transition"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Channel
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {(supportData.socials || []).map((social: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="w-1/3">
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                value={social.platform}
                                                onChange={(e) => {
                                                    const newSocials = [...supportData.socials];
                                                    newSocials[index].platform = e.target.value;
                                                    setSupportData({ ...supportData, socials: newSocials });
                                                }}
                                            >
                                                <option value="facebook">Facebook</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="twitter">Twitter</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="youtube">YouTube</option>
                                                <option value="whatsapp">WhatsApp</option>
                                                <option value="telegram">Telegram</option>
                                                <option value="tiktok">TikTok</option>
                                            </select>
                                        </div>
                                        <div className="flex-1 flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Username or URL"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                value={social.link}
                                                onChange={(e) => {
                                                    const newSocials = [...supportData.socials];
                                                    newSocials[index].link = e.target.value;
                                                    setSupportData({ ...supportData, socials: newSocials });
                                                }}
                                            />
                                            <button 
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                                onClick={() => {
                                                    const newSocials = supportData.socials.filter((_: any, i: number) => i !== index);
                                                    setSupportData({ ...supportData, socials: newSocials });
                                                }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!supportData.socials || supportData.socials.length === 0) && (
                                    <p className="text-slate-500 text-sm py-4 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                        No social channels added. Click "Add Channel" to create one.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => {
                                saveSupportChannels(supportData).then(() => alert('Saved successfully!')).catch(e => alert(e.message));
                            }} className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/20">
                                Save Settings
                            </button>
                        </div>
                      </div>
                  </motion.div>
              );
          default:
              return (
                  <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="flex flex-col items-center justify-center p-24 bg-white rounded-2xl border border-dashed border-slate-300">
                      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                          <LayoutDashboard className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 font-serif">Module Coming Soon</h3>
                      <p className="text-slate-500 mt-2 text-center max-w-md font-medium">This section is currently under development by our engineering team. Stay tuned for advanced management capabilities.</p>
                      <button className="mt-8 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20" onClick={() => setActiveTab('overview')}>Back to Dashboard</button>
                  </motion.div>
              );
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
      {!isSidebarOpen && (
         <motion.div 
            initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(true)}
         />
      )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 z-40 w-72 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col shadow-2xl border-r border-slate-800`}>
          <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900 justify-between">
              <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mr-3 shrink-0 shadow-lg shadow-primary/30">
                      <Plane className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-bold text-xl tracking-wide font-serif truncate">Admin Pro</span>
              </div>
              <button className="lg:hidden text-slate-400 hover:text-white transition" onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6" />
              </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1 custom-scrollbar">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">Core System</div>
              {TABS.slice(0, 4).map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as TabType); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                 >
                     <tab.icon className={`w-5 h-5 mr-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                     <span className="font-bold text-sm">{tab.label}</span>
                     {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
                 </button> 
              ))}

              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-4 mt-10">Configuration</div>
              {TABS.slice(4).map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as TabType); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                 >
                     <tab.icon className={`w-5 h-5 mr-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                     <span className="font-bold text-sm">{tab.label}</span>
                     {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
                 </button> 
              ))}
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-auto">
              <div className="flex items-center p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50 hover:bg-slate-800 cursor-pointer transition-colors group relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="overflow-hidden flex-1">
                      <div className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">Admin</div>
                      <div className="text-[11px] font-medium text-slate-400 truncate mt-0.5" title={user?.email || ''}>{user?.email || 'admin@hqtravels.com'}</div>
                  </div>
                  <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-white transition-colors" title="Sign Out">
                      <LogOut className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'} flex flex-col min-h-screen bg-slate-50`}>
          {/* Top Navbar */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 shadow-sm">
              <div className="flex items-center">
                  <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-primary rounded-xl mr-4 transition-colors">
                      <Menu className="w-6 h-6" />
                  </button>
                  <div className="hidden md:flex items-center bg-slate-100/80 rounded-2xl px-4 py-2.5 border border-slate-200 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all w-96 shadow-sm">
                      <Search className="w-5 h-5 text-slate-400 mr-2" />
                      <input type="text" placeholder="Search bookings, flights, users..." className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-700 placeholder-slate-400" />
                  </div>
              </div>
              <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center text-xs font-bold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                      System Operational
                  </div>
                  <div className="h-8 w-px bg-slate-200 hidden sm:block mx-2"></div>
                  <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-primary rounded-xl transition-colors">
                      <Bell className="w-6 h-6" />
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                  </button>
                  <button onClick={handleLogout} className="bg-slate-900 border border-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10 hidden sm:block">Log Out</button>
              </div>
          </header>

          {/* Main Area */}
          <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
              <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-serif tracking-tight">
                      {TABS.find(t => t.id === activeTab)?.label}
                  </h1>
                  <p className="text-slate-500 text-base font-medium">Manage your {siteName} operations and settings smoothly.</p>
              </div>

              {renderContent()}
          </main>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && modalType && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 className="text-xl font-bold font-serif text-slate-800 capitalize">Add New {modalType}</h3>
                        <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        {modalType === 'hotel' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Hotel Title</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. Grand Plaza" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Location</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. Dubai, UAE" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Price per night</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="100" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Stars</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="5" value={formData.stars} onChange={e=>setFormData({...formData, stars: e.target.value})} /></div>
                            </>
                        )}
                        {modalType === 'holiday' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Package Title</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. Alpine Adventure" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Location</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. Swiss Alps" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Price</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="500" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Duration</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="3 Days, 2 Nights" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} /></div>
                            </>
                        )}
                        {modalType === 'visa' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Country</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. USA" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Processing Time</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. 5 Business Days" value={formData.processingTime} onChange={e=>setFormData({...formData, processingTime: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Processing Fee</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="150" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /></div>
                            </>
                        )}
                        {modalType === 'career' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Job Title</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Software Engineer" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Location</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Remote" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Job Type</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Full-time" value={formData.jobType} onChange={e=>setFormData({...formData, jobType: e.target.value})} /></div>
                            </>
                        )}
                        {modalType === 'press' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Title</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="New Partnership" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Date</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Oct 20, 2026" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Link</label><input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="https://" value={formData.link} onChange={e=>setFormData({...formData, link: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Publisher</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="CNN" value={formData.publisher} onChange={e=>setFormData({...formData, publisher: e.target.value})} /></div>
                            </>
                        )}
                        {modalType === 'blog' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Post Title</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Top 10 Beaches" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Author</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Jane Doe" value={formData.author} onChange={e=>setFormData({...formData, author: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Excerpt</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="A short summary..." value={formData.excerpt} onChange={e=>setFormData({...formData, excerpt: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Content (Markdown)</label><textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium h-32 resize-none" placeholder="Blog content..." value={formData.content || ''} onChange={e=>setFormData({...formData, content: e.target.value})}></textarea></div>
                            </>
                        )}
                        {modalType === 'destination' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">City</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. Cox's Bazar" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Country</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. Bangladesh" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Price Label</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Starts from ৳4,500" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Image URL</label><input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="https://" value={formData.image || ''} onChange={e=>setFormData({...formData, image: e.target.value})} /></div>
                            </>
                        )}
                        {modalType === 'flight' && (
                            <>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Origin Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. DAC" value={formData.origin} onChange={e=>setFormData({...formData, origin: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Destination Code</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="E.g. DXB" value={formData.destination} onChange={e=>setFormData({...formData, destination: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Airline</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="Emirates" value={formData.airline} onChange={e=>setFormData({...formData, airline: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Flight Number</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="EK-101" value={formData.flightNumber} onChange={e=>setFormData({...formData, flightNumber: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Price (৳)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="50000" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Duration</label><input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="2h 30m" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} /></div>
                                <div><label className="text-sm font-bold text-slate-700 block mb-1">Stops</label><input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="0" value={formData.stops} onChange={e=>setFormData({...formData, stops: e.target.value})} /></div>
                            </>
                        )}
                        {!['career', 'press', 'destination', 'flight'].includes(modalType) && (
                            <div><label className="text-sm font-bold text-slate-700 block mb-1">Image URL</label><input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium" placeholder="https://" value={formData.imageUrl || ''} onChange={e=>setFormData({...formData, imageUrl: e.target.value})} /></div>
                        )}
                        {!['blog', 'press', 'destination', 'flight'].includes(modalType) && (
                            <div><label className="text-sm font-bold text-slate-700 block mb-1">Description</label><textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-medium h-24 resize-none" placeholder="Enter details..." value={formData.description || ''} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea></div>
                        )}
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition">Cancel</button>
                        <button onClick={handleCreateSubmit} className="px-5 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition">Create {modalType}</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
