'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Head from 'next/head';
import {
    Calendar, User, Share2, Facebook, Twitter,
    ArrowLeft, Loader2, Eye, Tag, Hash, Link as LinkIcon, Check
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import BlogComments from '@/components/BlogComments';
import { API_URL } from '@/lib/api-config';

export default function BlogPost() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Reading progress bar logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Share functions
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post?.title || 'Blog Post';
    const shareText = post?.excerpt || post?.title || 'Read this article from Life Reach Church';

    const handleFacebookShare = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${API_URL}/blog/get_one.php?id=${id}`);
                setPost(res.data);
            } catch (err) {
                console.error("Post not found:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchPost();
    }, [id]);

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-orange-600" size={48} />
        </div>
    );

    if (!post) return (
        <div className="h-screen flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-4xl font-black uppercase italic">Post Not Found</h2>
            <button onClick={() => router.push('/blog')} className="mt-6 text-orange-600 font-bold uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={20} /> Back to Blog
            </button>
        </div>
    );

    return (
        <>
            <Head>
                <title>{post.title} | Life Reach Church Blog</title>
                <meta name="description" content={post.excerpt || post.content?.substring(0, 160) || `Read ${post.title} on Life Reach Church blog`} />
                <meta name="keywords" content={`Life Reach Church, ${post.category || 'blog'}, ${post.tags?.join(', ') || ''}, Christian, faith, Zambia`} />
                <meta name="author" content={post.author} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || post.content?.substring(0, 160)} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:image" content={post.hero_image || 'https://lifereachurch.org/og-default.jpg'} />
                <meta property="og:site_name" content="Life Reach Church" />
                <meta property="article:published_time" content={post.published_at || post.created_at} />
                <meta property="article:author" content={post.author} />
                <meta property="article:section" content={post.category} />
                {post.tags?.map((tag, i) => <meta key={i} property="article:tag" content={tag} />)}
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt || post.content?.substring(0, 160)} />
                <meta name="twitter:image" content={post.hero_image} />
                <meta name="twitter:creator" content="@LifeReachChurch" />
                
                {/* Additional SEO */}
                <link rel="canonical" href={shareUrl} />
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Language" content="en" />
            </Head>
            
            {/* JSON-LD Structured Data for better SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "image": post.hero_image || "https://lifereachurch.org/og-default.jpg",
                        "author": {
                            "@type": "Person",
                            "name": post.author
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Life Reach Church",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://lifereachurch.org/logo.png"
                            }
                        },
                        "datePublished": post.published_at || post.created_at,
                        "dateModified": post.updated_at || post.published_at || post.created_at,
                        "description": post.excerpt || post.content?.substring(0, 160),
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": shareUrl
                        },
                        "keywords": post.tags?.join(', ') || post.category,
                        "articleSection": post.category,
                        "wordCount": post.content?.split(' ').length || 0
                    })
                }}
            />
            
            <div className="bg-white min-h-screen">
            {/* Reading Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-2 bg-orange-600 z-[100] origin-left" style={{ scaleX }} />

            {/* Hero Image */}
            <div className="h-[500px] md:h-[650px] w-full relative">
                <img
                    src={post.hero_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920"}
                    className="w-full h-full object-cover"
                    alt={post.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-end pb-24">
                    <div className="container mx-auto px-6 text-white">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-orange-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block"
                        >
                            {post.category || 'Article'}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                            className="text-5xl md:text-8xl font-black mb-8 max-w-5xl leading-[0.9] italic uppercase tracking-tighter"
                        >
                            {post.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2 } }}
                            className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-orange-400"
                        >
                            <span className="flex items-center gap-2 text-white"><User size={16} /> {post.author}</span>
                            <span className="flex items-center gap-2 text-white"><Calendar size={16} /> {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md"><Eye size={16} /> {post.views} Views</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container mx-auto px-6 max-w-4xl -mt-20 relative z-10">
                <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100">
                    <article className="prose prose-xl prose-orange mx-auto text-gray-700 leading-relaxed font-medium">
                        {/* Rendering content with dangerouslySetInnerHTML in case you use a rich text editor */}
                        <div
                            className="whitespace-pre-wrap selection:bg-orange-200"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </article>

                    {/* Tags Section */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 flex flex-wrap gap-3">
                            {post.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 text-[10px] font-black uppercase bg-gray-50 px-4 py-2 rounded-xl text-gray-400 hover:text-orange-600 transition-colors">
                                    <Hash size={12} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer / Share */}
                    <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <button
                            onClick={() => router.push('/blog')}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-all"
                        >
                            <ArrowLeft size={20} /> Back to feed
                        </button>

                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Share Story:</span>
                            <div className="flex gap-3">
                                <ShareButton 
                                    icon={<Facebook size={18} />} 
                                    color="hover:bg-blue-600" 
                                    onClick={handleFacebookShare}
                                    label="Share on Facebook"
                                />
                                <ShareButton 
                                    icon={<Twitter size={18} />} 
                                    color="hover:bg-sky-500"
                                    onClick={handleTwitterShare}
                                    label="Share on Twitter"
                                />
                                <ShareButton 
                                    icon={<Share2 size={18} />} 
                                    color="hover:bg-orange-600"
                                    onClick={handleNativeShare}
                                    label="Share"
                                />
                                <ShareButton 
                                    icon={copied ? <Check size={18} /> : <LinkIcon size={18} />} 
                                    color={copied ? "bg-green-500 text-white" : "hover:bg-gray-700"}
                                    onClick={handleCopyLink}
                                    label={copied ? "Copied!" : "Copy link"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog Comments Section */}
                <div className="bg-white border-t border-gray-100 mt-16">
                    <BlogComments blogId={parseInt(id)} />
                </div>
            </div>
            </div>
        </>
    );
}

function ShareButton({ icon, color, onClick, label }) {
    return (
        <button 
            onClick={onClick}
            title={label}
            className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 transition-all ${color} hover:text-white hover:shadow-lg`}
        >
            {icon}
        </button>
    );
}