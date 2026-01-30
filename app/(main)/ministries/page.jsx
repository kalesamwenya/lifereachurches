'use client';

import React, { useEffect, useState } from 'react';
import {User, Sun, Coffee, Music, Users, BookOpen, SchoolIcon, ChurchIcon, CrossIcon, ArrowRight} from 'lucide-react';
import { motion } from 'framer-motion';
import {BiChild, BiMask} from "react-icons/bi";
import axios from 'axios';
import Link from 'next/link';

const API_URL = 'https://content.lifereachchurch.org';

// --- Local Components & Data ---

const Card = ({ children, className = "" }) => (
    <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>{children}</motion.div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-16">
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">{subtitle}</h3>
        <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
        <div className="h-1.5 w-24 bg-orange-600 mt-6 rounded-full"></div>
    </div>
);

// Icon mapping based on ministry name
const getMinistryIcon = (name) => {
    const iconMap = {
        'campus': <SchoolIcon size={32} />,
        'cell': <Users size={32} />,
        'children': <BiChild size={32} />,
        'evangelism': <ChurchIcon size={32} />,
        'men': <Users size={32} />,
        "men's": <Users size={32} />,
        'prayer': <CrossIcon size={32} />,
        'stretch': <BiMask size={32} />,
        'women': <Users size={32} />,
        "women's": <Users size={32} />,
        'youth': <Users size={32} />,
        'worship': <Music size={32} />,
        'music': <Music size={32} />,
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    return <ChurchIcon size={32} />; // Default icon
};

// --------------------------------

export default function MinistriesPage() {
    const [ministries, setMinistries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMinistries();
    }, []);

    const fetchMinistries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/ministries/get_all.php?type=ministry&sortKey=name&sortDir=asc`);
            // API returns data directly as an array
            if (Array.isArray(response.data)) {
                setMinistries(response.data);
            } else {
                setMinistries([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching ministries:', err);
            setError('Failed to load ministries. Please try again later.');
            setMinistries([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-24 bg-white pt-32">
            <div className="container mx-auto px-6">
                <SectionTitle title="Ministries" subtitle="Connect & Grow" />
                
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-600">Loading ministries...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {!loading && !error && ministries.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No ministries found.</p>
                    </div>
                )}

                {!loading && !error && ministries.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ministries.map((ministry, index) => (
                            <motion.div
                                key={ministry.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link href={`/ministries/${ministry.id}`}>
                                    <Card className="border border-gray-100 hover:border-orange-200 h-full cursor-pointer transition-all hover:shadow-2xl">
                                        <div className="p-10">
                                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                                {getMinistryIcon(ministry.name)}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4">{ministry.name}</h3>
                                            <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">
                                                {ministry.description || 'No description available'}
                                            </p>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-gray-100 pt-6">
                                                <User size={16} className="text-orange-400" /> 
                                                Lead: <span className="text-gray-900 font-medium">
                                                    {ministry.leader_name || 'TBA'}
                                                </span>
                                            </div>
                                            {ministry.members_count > 0 && (
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                                                    <Users size={16} className="text-orange-400" /> 
                                                    Members: <span className="text-gray-900 font-medium">
                                                        {ministry.members_count}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm font-bold text-orange-600 mt-6 group-hover:gap-3 transition-all">
                                                Learn More <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}