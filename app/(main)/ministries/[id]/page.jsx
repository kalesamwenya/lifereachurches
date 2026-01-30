'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User, Users, Calendar, MapPin, Clock, ArrowLeft, Mail, Phone,
    ChurchIcon, SchoolIcon, CrossIcon, Shield, Music
} from 'lucide-react';
import { BiChild, BiMask } from "react-icons/bi";
import axios from 'axios';
import Link from 'next/link';

const API_URL = 'https://content.lifereachchurch.org';

// Icon mapping based on ministry name
const getMinistryIcon = (name) => {
    const iconMap = {
        'campus': <SchoolIcon size={48} />,
        'cell': <Users size={48} />,
        'children': <BiChild size={48} />,
        'evangelism': <ChurchIcon size={48} />,
        'men': <Users size={48} />,
        "men's": <Users size={48} />,
        'prayer': <CrossIcon size={48} />,
        'stretch': <BiMask size={48} />,
        'women': <Users size={48} />,
        "women's": <Users size={48} />,
        'youth': <Users size={48} />,
        'worship': <Music size={48} />,
        'music': <Music size={48} />,
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    return <ChurchIcon size={48} />; // Default icon
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ icon, label, value }) => (
    <Card className="p-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </Card>
);

export default function MinistryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ministry, setMinistry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (params.id) {
            fetchMinistryDetail();
        }
    }, [params.id]);

    const fetchMinistryDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/ministries/get_one.php?id=${params.id}`);
            
            if (response.data) {
                setMinistry(response.data);
            } else {
                setError('Ministry not found');
            }
        } catch (err) {
            console.error('Error fetching ministry details:', err);
            setError('Failed to load ministry details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-600">Loading ministry details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !ministry) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error || 'Ministry not found'}</p>
                        <Link href="/ministries" className="text-orange-600 hover:text-orange-700 font-semibold">
                            ← Back to Ministries
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link 
                        href="/ministries" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-semibold">Back to Ministries</span>
                    </Link>
                </motion.div>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Card className="p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                                {getMinistryIcon(ministry.name)}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                    {ministry.name}
                                </h1>
                                {ministry.leader_name && (
                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <User size={20} className="text-orange-600" />
                                        <span className="font-semibold">Led by {ministry.leader_name}</span>
                                    </div>
                                )}
                                {ministry.meeting_time && (
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Clock size={18} className="text-orange-600" />
                                        <span>{ministry.meeting_time}</span>
                                    </div>
                                )}
                                {ministry.meeting_location && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={18} className="text-orange-600" />
                                        <span>{ministry.meeting_location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-3 gap-6 mb-12"
                >
                    <StatCard
                        icon={<Users size={24} />}
                        label="Members"
                        value={ministry.membersCount || 0}
                    />
                    <StatCard
                        icon={<Calendar size={24} />}
                        label="Upcoming Events"
                        value={ministry.upcomingEvents || 0}
                    />
                    <StatCard
                        icon={<ChurchIcon size={24} />}
                        label="Type"
                        value={ministry.type?.charAt(0).toUpperCase() + ministry.type?.slice(1) || 'Ministry'}
                    />
                </motion.div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
                            <h2 className="text-3xl font-bold text-gray-900">About</h2>
                        </div>
                        <div className="prose max-w-none">
                            {ministry.description ? (
                                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                                    {ministry.description}
                                </p>
                            ) : (
                                <p className="text-gray-400 text-lg italic">
                                    No description available for this ministry yet.
                                </p>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Get Involved Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-8 bg-gradient-to-br from-orange-50 to-white border-orange-100">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Get Involved
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Interested in joining {ministry.name}? We'd love to have you! 
                                Contact us to learn more about how you can serve.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                                >
                                    <Mail size={20} />
                                    Contact Us
                                </Link>
                                <Link
                                    href="/ministries"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold border-2 border-gray-200 hover:border-orange-600 hover:text-orange-600 transition-colors"
                                >
                                    Explore More Ministries
                                </Link>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
