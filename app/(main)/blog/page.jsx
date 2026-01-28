'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Loader2, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { API_URL } from '@/lib/api-config';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // Share functionality
    const handleShare = async () => {
        const shareData = {
            title: 'The Reach Blog - Life Reach Church',
            text: 'Read the latest insights, stories, and devotionals from Life Reach Church',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            // Passing sortKey to match your PHP logic
            const res = await axios.get(`${API_URL}?sortKey=publishedAt&sortDir=DESC`);
            setPosts(res.data.rows || []);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filter Logic (Frontend Search)
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-orange-600" size={48} />
        </div>
    );

    return (
        <>
            <Head>
                <title>The Reach Blog - Life Reach Church | Insights, Stories & Devotionals</title>
                <meta name="description" content="Read the latest insights, stories, and devotionals from Life Reach Church. Explore faith-based articles, testimonies, and community updates." />
                <meta name="keywords" content="Life Reach Church, blog, devotionals, faith, Christian articles, church stories, testimonies, Zambia church" />
                <meta property="og:title" content="The Reach Blog - Life Reach Church" />
                <meta property="og:description" content="Read the latest insights, stories, and devotionals from Life Reach Church." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://lifereachurch.org/blog" />
                <meta property="og:image" content="https://lifereachurch.org/og-blog.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="The Reach Blog - Life Reach Church" />
                <meta name="twitter:description" content="Read the latest insights, stories, and devotionals from Life Reach Church." />
                <link rel="canonical" href="https://lifereachurch.org/blog" />
            </Head>
            <div className="py-24 bg-gray-50 pt-32 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">The Reach Blog</h1>
                            <button
                                onClick={handleShare}
                                className="p-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl"
                                title="Share this page"
                            >
                                <Share2 size={20} />
                            </button>
                        </div>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Insights, stories, and devotionals from our team.</p>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-md mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search articles or authors..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-bold"
                        />
                        <Search className="absolute right-4 top-4 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {currentPosts.map((post) => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                                onClick={() => window.location.href = `/blog/${post.id}`}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    {/* Using your database column: hero_image */}
                                    <img
                                        src={post.hero_image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg">
                                        {post.status || 'Published'}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                        <Calendar size={12} className="text-orange-500" />
                                        {/* Using your database column: published_at or created_at */}
                                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase leading-tight mb-4 group-hover:text-orange-600 transition-colors tracking-tighter">
                                        {post.title}
                                    </h3>

                                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <User size={14} className="text-gray-400" />
                                            </div>
                                            {/* Using your database column: author */}
                                            {post.author}
                                        </div>
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-30 hover:bg-orange-600 hover:text-white transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1 ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-30 hover:bg-orange-600 hover:text-white transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
