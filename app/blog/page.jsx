'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
    { id: 1, title: "Finding Peace in a Chaotic World", category: "Devotional", author: "Sarah Jenkins", date: "Oct 24, 2023", excerpt: "In the midst of noise, how do we find the stillness that God promises? It starts with a posture of surrender.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "Why Community Matters", category: "Life Groups", author: "Pastor Michael", date: "Oct 18, 2023", excerpt: "We were never meant to do life alone. Discover the biblical foundation for community and why it's vital for your growth.", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" },
    { id: 3, title: "The Power of Generosity", category: "Stewardship", author: "Finance Team", date: "Oct 10, 2023", excerpt: "Generosity isn't just about money; it's about the condition of our hearts. Learn how giving breaks the grip of materialism.", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800" },
];

export default function BlogPage() {
    return (
        <div className="py-24 bg-gray-50 pt-32">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">The Reach Blog</h1>
                    <p className="text-xl text-gray-500">Insights, stories, and devotionals from our team.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <motion.div
                            key={post.id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                            onClick={() => window.location.href = `/blog/read`} // Static link for preview
                        >
                            <div className="h-64 overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">
                                    <span className="text-orange-600">{post.category}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-600 transition-colors">{post.title}</h3>
                                <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                        <User size={16} className="text-gray-400" /> {post.author}
                                    </div>
                                    <ArrowRight size={20} className="text-orange-500" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}