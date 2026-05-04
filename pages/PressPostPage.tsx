import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPressReleases } from '../services/firebaseService';
import { Loader2, Calendar, Newspaper, ArrowLeft, ExternalLink } from 'lucide-react';

const PressPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPressReleases().then(posts => {
            const currentPost = posts.find((p: any) => p.id === id);
            if (currentPost) {
                setPost(currentPost);
            } else if (id === '1') {
                setPost({
                    id: '1', title: 'HQ Travels wins Best Travel Agency Award 2026', publishedAt: 'October 12, 2026', source: 'Travel Weekly', summary: 'We are thrilled to announce that HQ Travels & Tours has been recognized for outstanding services in the aviation and tourism sector.', link: '#', publisher: 'Travel Weekly', description: 'Detailed full story about winning the Best Travel Agency Award...'
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
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Press Release not found</h2>
                <button onClick={() => navigate('/press')} className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Press Area
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <button 
                    onClick={() => navigate('/press')}
                    className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Press & Media
                </button>
                
                <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-8 md:p-12">
                    <div className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex-wrap gap-4">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {post.date ? post.date.split('T')[0] : post.publishedAt || ''}</span>
                        <span className="flex items-center"><Newspaper className="w-4 h-4 mr-1.5" /> {post.publisher || post.source}</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-serif mb-8 leading-tight">{post.title}</h1>
                    
                    {post.link && post.link !== '#' && (
                        <a href={post.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold mb-8">
                            <ExternalLink className="w-4 h-4 mr-2" /> View Original Published Article
                        </a>
                    )}

                    <div className="prose prose-lg prose-slate max-w-none font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: post.description?.replace(/\n/g, '<br />') || post.summary }}></div>
                </article>
            </div>
        </div>
    );
};

export default PressPostPage;
