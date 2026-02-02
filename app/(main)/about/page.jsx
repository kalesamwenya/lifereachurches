
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, MapPin, Users, BookOpen, Shield, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

// --- Carousel for Core Values ---
function CoreValuesCarousel({ values }) {
    const [start, setStart] = React.useState(0);
    const cardsPerSlide = 4;
    const total = values.length;
    const canPrev = start > 0;
    const canNext = start + cardsPerSlide < total;

    // Responsive: 1 on mobile, 2 on md, 4 on lg+
    React.useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setStart(0);
            } else if (window.innerWidth < 1024 && start > total - 2) {
                setStart(Math.max(0, total - 2));
            } else if (window.innerWidth >= 1024 && start > total - 4) {
                setStart(Math.max(0, total - 4));
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [start, total]);

    // Determine cards per slide based on screen size
    let visible = cardsPerSlide;
    if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) visible = 1;
        else if (window.innerWidth < 1024) visible = 2;
    }
    const end = Math.min(start + visible, total);
    const shown = values.slice(start, end);

    return (
        <div className="relative mb-32">
            <div className="flex items-center justify-between mb-6">
                <button
                    className={`p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition disabled:opacity-30 disabled:cursor-not-allowed`}
                    onClick={() => setStart(s => Math.max(0, s - visible))}
                    disabled={!canPrev}
                    aria-label="Previous"
                >
                    <ChevronLeft size={28} />
                </button>
                <button
                    className={`p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition disabled:opacity-30 disabled:cursor-not-allowed`}
                    onClick={() => setStart(s => Math.min(total - visible, s + visible))}
                    disabled={!canNext}
                    aria-label="Next"
                >
                    <ChevronRight size={28} />
                </button>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar">
                {shown.map((val, idx) => (
                    <Card key={idx + start} className="p-8 text-center h-full min-w-[220px] flex-1">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            {val.icon}
                        </div>
                        <h4 className="text-xl font-bold mb-3">{val.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- Local Components (Inlined for consistency) ---

const SectionTitle = ({ title, subtitle, centered = true }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
        <h3 className="font-bold uppercase tracking-widest text-sm mb-3 text-orange-600">{subtitle}</h3>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900">{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

const Card = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

// --- Mock Data ---

const defaultValues = [
    { title: "Biblical Authority", desc: "We believe the Bible is the inspired Word of God and our final authority.", icon: <BookOpen className="text-orange-600" size={32} /> },
    { title: "Authentic Community", desc: "We are better together. We prioritize real relationships over religious performance.", icon: <Users className="text-orange-600" size={32} /> },
    { title: "Extravagant Generosity", desc: "We give because He gave. Generosity is our privilege, not just our duty.", icon: <Gift className="text-orange-600" size={32} /> },
    { title: "Servant Leadership", desc: "We lead by serving others, just as Jesus washed the feet of His disciples.", icon: <Shield className="text-orange-600" size={32} /> },
];

const team = [
    { name: "Mary Poppins", role: "Reach Kids Director", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
    { name: "Mike Chang", role: "Apex Youth Pastor", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
    { name: "David Psalm", role: "Worship Pastor", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { name: "Sarah Connect", role: "Groups Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
];

export default function AboutPage() {
    const [churchSettings, setChurchSettings] = useState(null);
    const [pastor, setPastor] = useState(null);
    const [ministryLeaders, setMinistryLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChurchSettings();
        fetchPastor();
        fetchMinistryLeaders();
    }, []);

    const fetchChurchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/settings/get.php`);
            setChurchSettings(response.data);
        } catch (error) {
            console.error('Error fetching church settings:', error);
        }
    };

    const fetchPastor = async () => {
        try {
            const response = await axios.get(`${API_URL}/leadership/get.php?type=senior_pastor`);
            if (response.data.success && response.data.data) {
                setPastor(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pastor:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMinistryLeaders = async () => {
        try {
            const response = await axios.get(`${API_URL}/leadership/get.php?type=ministry_leaders`);
            if (response.data.success && response.data.data) {
                setMinistryLeaders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching ministry leaders:', error);
        }
    };

    // Get values from DB or use defaults
    const values = churchSettings?.coreValues?.length > 0 
        ? churchSettings.coreValues.map(val => ({
            title: val.title || val,
            desc: val.desc || val.description || '',
            icon: <BookOpen className="text-orange-600" size={32} />
        }))
        : defaultValues;

    const churchName = churchSettings?.name || 'Life Reach Church';
    const aboutText = churchSettings?.about || 'Life Reach Church started in a living room with 12 people and a dream to reach our city. We realized that church wasn\'t about a building, but about a people passionate for God.';
    const visionText = churchSettings?.vision || '"To be a beacon of hope, reaching every soul with the transformative love of Christ, creating a city where no one walks alone."';
    const missionText = churchSettings?.mission || 'We exist to Reach the lost, Raise disciples, and Release leaders into their God-given destiny.';
    const churchAddress = churchSettings?.address || '';
    const churchEmail = churchSettings?.email || '';
    const churchPhone = churchSettings?.phone || '';

    // Use ministry leaders from DB or fallback to mock data
    const team = ministryLeaders.length > 0 ? ministryLeaders : [
        { name: "Mary Poppins", role: "Reach Kids Director", image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
        { name: "Mike Chang", role: "Apex Youth Pastor", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
        { name: "David Psalm", role: "Worship Pastor", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
        { name: "Sarah Connect", role: "Groups Director", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="bg-white">
            {/* Header / Hero */}
            <div className="relative h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 text-center text-white px-6 mt-16">
                    <h1 className="text-5xl md:text-7xl font-black mb-4">Our Story</h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                        Discover the heart, history, and vision behind {churchName}.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-24 bg-gray-50">
                    <div className="container mx-auto px-6 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-600">Loading church information...</p>
                    </div>
                </div>
            ) : (
                <div className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    {/* About Section */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-orange-600 font-bold uppercase tracking-widest mb-2">Since 2018</h3>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">More Than Just Sunday</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                {aboutText}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Today, we are a diverse family of believers united by one mission: to know Jesus and make Him known. Whether you are young or old, single or married, there is a place for you here.
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-32">
                                    <div className="text-3xl font-black text-orange-600 mb-1">6+</div>
                                    <div className="text-xs uppercase font-bold text-gray-400">Years</div>
                                </div>
                                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-32">
                                    <div className="text-3xl font-black text-orange-600 mb-1">500+</div>
                                    <div className="text-xs uppercase font-bold text-gray-400">Members</div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-orange-500/20 rounded-3xl transform rotate-3"></div>
                            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800" alt="Community" className="rounded-3xl shadow-2xl relative z-10 w-full" />
                        </motion.div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-32">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-12 rounded-3xl shadow-xl border-l-8 border-orange-500"
                        >
                            <Sun className="text-orange-500 mb-6" size={48} />
                            <h3 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h3>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {visionText}
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gray-900 p-12 rounded-3xl shadow-xl border-r-8 border-orange-500 text-white"
                        >
                            <MapPin className="text-orange-500 mb-6" size={48} />
                            <h3 className="text-3xl font-bold mb-4 text-white">Our Mission</h3>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                {missionText}
                            </p>
                        </motion.div>
                    </div>

                    {/* Core Values */}

                    {/* Senior Pastor Section */}
                    {pastor && (
                        <div className="mb-32">
                        <SectionTitle title="Our Leadership" subtitle="Senior Pastor" />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
                            <div className="grid md:grid-cols-2">
                                <div className="h-[500px] md:h-auto relative">
                                    <img
                                        src={pastor.image_url || "/imgs/pastor.png"}
                                        alt={pastor.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:hidden"></div>
                                </div>
                                <div className="p-12 md:p-20 flex flex-col justify-center text-white">
                                    <h3 className="text-orange-500 font-bold uppercase tracking-widest mb-2">{pastor.title || "Senior Pastor"}</h3>
                                    <h2 className="text-4xl md:text-5xl font-black mb-6">{pastor.name}</h2>
                                    
                                    {pastor.bio_paragraph_1 && (
                                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                            {pastor.bio_paragraph_1}
                                        </p>
                                    )}
                                    
                                    {pastor.bio_paragraph_2 && (
                                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                            {pastor.bio_paragraph_2}
                                        </p>
                                    )}
                                    
                                    {pastor.bio_paragraph_3 && (
                                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                            {pastor.bio_paragraph_3}
                                        </p>
                                    )}
                                    
                                    {pastor.bio_paragraph_4 && (
                                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                            {pastor.bio_paragraph_4}
                                        </p>
                                    )}
                                    
                                    <div className="flex gap-4">
                                        {pastor.instagram_url && (
                                            <a 
                                                href={pastor.instagram_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-orange-500 font-bold hover:text-white transition-colors"
                                            >
                                                Follow on Instagram
                                            </a>
                                        )}
                                        {pastor.podcast_url && (
                                            <a 
                                                href={pastor.podcast_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-orange-500 font-bold hover:text-white transition-colors"
                                            >
                                                Listen to Podcast
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* Department Heads */}
                    <SectionTitle title="Ministry Directors" subtitle="Our Team" />
                    <div className="grid md:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group text-center"
                            >
                                <div className="relative mb-6 mx-auto w-48 h-48">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                        <img 
                                            src={member.image_url || member.img || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"} 
                                            alt={member.name} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                                <p className="text-orange-600 font-semibold text-sm uppercase tracking-wider">{member.title || member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}
