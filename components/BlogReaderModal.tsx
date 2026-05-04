import React from 'react';
import { X, Calendar, User, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogReaderModalProps {
    post: any;
    onClose: () => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({ post, onClose }) => {
    if (!post) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full md:max-w-4xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
                
                {/* Header (Sticky) */}
                <div className="flex-none p-4 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md z-10 sticky top-0">
                    <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition flex items-center hover:bg-slate-200">
                        <ArrowLeft className="w-5 h-5 md:mr-2" />
                        <span className="hidden md:block font-bold text-sm uppercase tracking-wide">Back</span>
                    </button>
                    <div className="font-serif font-bold text-slate-900 hidden md:block">Blog</div>
                    <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition md:hidden">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {post.imageUrl && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        </div>
                    )}

                    <div className="p-6 md:p-12 max-w-3xl mx-auto -mt-16 md:-mt-32 relative z-10">
                        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                            <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-slate-900 mb-6">{post.title}</h1>
                            
                            <div className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-8 pb-8 border-b border-slate-100 gap-6">
                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.date ? post.date.split('T')[0] : post.publishedAt || ''}</span>
                                <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</span>
                            </div>

                            {post.excerpt && !post.content && (
                                <p className="text-xl text-slate-600 leading-relaxed font-serif italic mb-8 border-l-4 border-primary pl-6">"{post.excerpt}"</p>
                            )}

                            <div className="markdown-body text-slate-600 leading-relaxed 
                                [&>h1]:font-serif [&>h1]:font-bold [&>h1]:text-3xl [&>h1]:text-slate-900 [&>h1]:mt-8 [&>h1]:mb-4
                                [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:text-slate-900 [&>h2]:mt-8 [&>h2]:mb-4
                                [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-xl [&>h3]:text-slate-900 [&>h3]:mt-6 [&>h3]:mb-3
                                [&>p]:mb-6
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                                [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-500
                                [&_a]:text-primary [&_a]:font-bold [&_a]:hover:text-blue-800
                                [&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-8">
                                <ReactMarkdown>{post.content || post.excerpt || 'No content available for this post.'}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
