import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPosts } from '../services/firebaseService';
import { Loader2, Calendar, User, ArrowLeft } from 'lucide-react';

const BlogPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogPosts().then(posts => {
            const currentPost = posts.find((p: any) => p.id === id);
            if (currentPost) {
                setPost(currentPost);
            } else if (id === '1') {
                setPost({
                    id: '1', title: 'Top 10 Destinations for 2026', author: 'HQ Editors', publishedAt: 'January 1, 2026', excerpt: 'Discover the hidden gems and trending spots you must visit this year.', content: 'Detailed content for the top 10 destinations...', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'
                });
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Post not found</h2>
                <button onClick={() => navigate('/blog')} className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <button 
                    onClick={() => navigate('/blog')}
                    className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Travel Blog
                </button>
                
                <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                    <div className="h-64 md:h-96 w-full bg-slate-200 relative">
                        {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50 font-serif text-2xl px-6 text-center">{post.title}</div>
                        )}
                    </div>
                    
                    <div className="p-8 md:p-12">
                        <div className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex-wrap gap-4">
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {post.date ? post.date.split('T')[0] : post.publishedAt || ''}</span>
                            <span className="flex items-center"><User className="w-4 h-4 mr-1.5" /> {post.author}</span>
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-serif mb-8 leading-tight">{post.title}</h1>
                        
                        <div className="prose prose-lg prose-slate max-w-none font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || post.excerpt }}></div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
