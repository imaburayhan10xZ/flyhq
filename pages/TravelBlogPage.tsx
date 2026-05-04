import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getBlogPosts } from '../services/firebaseService';
import { Loader2, Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TravelBlogPage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getBlogPosts().then(d => {
            if (d.length > 0) {
                setPosts(d.sort((a: any, b: any) => b.createdAt - a.createdAt));
            } else {
                setPosts([{id: '1', title: 'Top 10 Destinations for 2026', author: 'HQ Editors', publishedAt: 'January 1, 2026', excerpt: 'Discover the hidden gems and trending spots you must visit this year.', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'}])
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-200 py-20 px-4 mb-12">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-serif mb-6 text-slate-900">Blog</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">Stories, guides, and inspiration for your next big adventure.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
               {loading ? (
                   <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
               ) : posts.length === 0 ? (
                   <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                       <h2 className="text-2xl font-bold text-slate-800">No blog posts found</h2>
                   </div>
               ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {posts.map((post, idx) => (
                           <motion.article 
                              key={post.id} 
                              onClick={() => { window.scrollTo(0, 0); navigate(`/blogs/post/${post.id}`); }}
                              initial={{opacity:0, y:20}} 
                              animate={{opacity:1, y:0}} 
                              transition={{delay: idx * 0.1}} 
                              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-100 flex flex-col group cursor-pointer"
                            >
                               <div className="h-48 md:h-56 w-full bg-slate-200 relative overflow-hidden">
                                   {post.imageUrl ? (
                                       <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                   ) : (
                                       <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50 font-serif text-2xl px-6 text-center">{post.title}</div>
                                   )}
                               </div>
                               <div className="p-6 md:p-8 flex-1 flex flex-col bg-white relative z-10 -mt-6 rounded-t-3xl border-t border-white/50">
                                   <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 gap-4">
                                       <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" /> {post.date ? post.date.split('T')[0] : post.publishedAt || ''}</span>
                                       <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1.5" /> {post.author}</span>
                                   </div>
                                   <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary transition font-serif mb-3 line-clamp-2">{post.title}</h3>
                                   <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">{post.excerpt}</p>
                                   
                                   <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-wide">
                                       Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" />
                                   </div>
                               </div>
                           </motion.article>
                       ))}
                   </div>
               )}
            </div>

        </div>
    );
};

export default TravelBlogPage;
