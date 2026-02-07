'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, MapPin, Users, BookOpen, Shield, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

// --- Local Components ---

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

// --- Redesigned Multi-Card Carousel Component ---

const ValuesCarousel = ({ values }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group px-4 md:px-0 mb-32">
            {/* Desktop Navigation Arrows */}
            <button 
                onClick={() => scroll('left')}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl text-orange-600 hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:block"
            >
                <ChevronLeft size={28} />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl text-orange-600 hover:bg-orange-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:block"
            >
                <ChevronRight size={28} />
            </button>

            {/* Carousel Container */}
            <div 
                ref={scrollRef}
                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {values.map((val, idx) => (
                    <motion.div
                        key={idx}
                        className="min-w-[calc(50%-8px)] lg:min-w-[calc(25%-18px)] snap-start"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <div className="bg-white h-full p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 group/card">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover/card:bg-orange-600 group-hover/card:text-white transition-colors duration-300">
                                {React.cloneElement(val.icon, { 
                                    className: "group-hover/card:text-white transition-colors text-orange-600" 
                                })}
                            </div>
                            <h4 className="text-lg md:text-xl font-black text-gray-900 mb-3">{val.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {val.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Scroll Hint */}
            <div className="flex justify-center lg:hidden mt-4">
                <div className="flex gap-1">
                    <div className="h-1 w-8 bg-orange-600 rounded-full"></div>
                    <div className="h-1 w-2 bg-gray-200 rounded-full"></div>
                    <div className="h-1 w-2 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

// --- Mock Data ---

const defaultValues = [
    { title: "Biblical Authority", desc: "The inspired Word of God as our final authority.", icon: <BookOpen size={32} /> },
    { title: "Authentic Community", desc: "Prioritizing real relationships over religious performance.", icon: <Users size={32} /> },
    { title: "Extravagant Generosity", desc: "Giving is our privilege, not just our duty.", icon: <Gift size={32} /> },
    { title: "Servant Leadership", desc: "We lead by serving others, just as Jesus did.", icon: <Shield size={32} /> },
    { title: "Spirit Led", desc: "We move at the speed of the Holy Spirit's guidance.", icon: <Sun size={32} /> },
];

export default function AboutPage() {
    const [churchSettings, setChurchSettings] = useState(null);
    const [pastor, setPastor] = useState(null);
    const [ministryLeaders, setMinistryLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Faith statements from churchSettings.beliefs
    const faithStatements = Array.isArray(churchSettings?.beliefs) && churchSettings.beliefs.length > 0
        ? churchSettings.beliefs
        : [
            "We believe in one true God, existing as eternally in three persons, Father, Son and Holy Spirit.",
            "The power of the word of God. We believe the bible is the word of God and was an inspired by the holy spirit.",
            "Salvation through Jesus Christ, by grace through faith alone.",
            "The work of the holy spirit. He renews and empowers believers and He convicts the world of sin.",
            "The universal church. we believe the church is the body Jesus Christ and He is the head.",
            "We believe in Holy living. Christ must reflect in character and conduct."
        ];


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, pastorRes, leadersRes] = await Promise.all([
                    axios.get(`${API_URL}/settings/get.php`),
                    axios.get(`${API_URL}/leadership/get.php?type=senior_pastor`),
                    axios.get(`${API_URL}/leadership/get.php?type=ministry_leaders`)
                ]);

                setChurchSettings(settingsRes.data);
                if (pastorRes.data.success) setPastor(pastorRes.data.data);
                if (leadersRes.data.success) setMinistryLeaders(leadersRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

        // Icon mapping for core values
        const iconMap = {
            "Everything we do is God centered": <Sun className="text-orange-600" size={32} />,
            "Governed by the word of God": <BookOpen className="text-orange-600" size={32} />,
            "Integrity": <Shield className="text-orange-600" size={32} />,
            "Prayer": <Users className="text-orange-600" size={32} />,
            "Holiness": <Shield className="text-orange-600" size={32} />,
            "Love": <Gift className="text-orange-600" size={32} />,
            "Respect": <Users className="text-orange-600" size={32} />,
            "Loyalty": <Shield className="text-orange-600" size={32} />,
            "Unity": <Users className="text-orange-600" size={32} />,
            "Excellency": <Sun className="text-orange-600" size={32} />,
            "Empowerment": <Gift className="text-orange-600" size={32} />,
            "Giving": <Gift className="text-orange-600" size={32} />,
            "Education": <BookOpen className="text-orange-600" size={32} />,
            "Service unto The Lord": <Shield className="text-orange-600" size={32} />,
        };

        const values = churchSettings?.coreValues?.length > 0 
            ? churchSettings.coreValues.map(val => {
                const title = val.title || val;
                return {
                    title,
                    desc: val.desc || val.description || '',
                    icon: iconMap[title] || <BookOpen className="text-orange-600" size={32} />
                };
            })
            : defaultValues;

    const churchName = churchSettings?.name || 'Life Reach Church';
    const visionText = churchSettings?.vision && churchSettings.vision.trim().length > 0
        ? churchSettings.vision
        : '"To be a beacon of hope, reaching every soul with the transformative love of Christ, creating a city where no one walks alone."';
    const missionText = churchSettings?.mission && churchSettings.mission.trim().length > 0
        ? churchSettings.mission
        : 'We exist to Reach the lost, Raise disciples, and Release leaders into their God-given destiny.';

    const team = ministryLeaders.length > 0 ? ministryLeaders : [
        { name: "Mary Poppins", role: "Reach Kids Director", image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
        { name: "Mike Chang", role: "Apex Youth Pastor", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
        { name: "David Psalm", role: "Worship Pastor", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
        { name: "Sarah Connect", role: "Groups Director", image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="bg-white">
            {/* Header / Hero */}
            <div className="relative h-[450px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 text-center text-white px-6 mt-16">
                    <h1 className="text-5xl md:text-7xl font-black mb-4">Our Story</h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">Discover the heart and vision behind {churchName}.</p>
                </div>
            </div>

            {loading ? (
                <div className="py-24 bg-gray-50 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <div className="py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        
                        {/* Mission & Vision Section */}
                        <div className="grid md:grid-cols-2 gap-8 mb-32">
                            <motion.div whileHover={{ y: -5 }} className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl border-l-8 border-orange-500">
                                <Sun className="text-orange-500 mb-6" size={48} />
                                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                                <p className="text-xl text-gray-600 leading-relaxed italic">{visionText}</p>
                            </motion.div>
                            <motion.div whileHover={{ y: -5 }} className="bg-gray-900 p-10 md:p-14 rounded-[2.5rem] shadow-xl border-r-8 border-orange-500 text-white">
                                <MapPin className="text-orange-500 mb-6" size={48} />
                                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                                <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-line">{missionText}</p>
                            </motion.div>
                        </div>

                        {/* Core Values Section (New Multi-Card Design) */}
                        <SectionTitle title="What We Believe" subtitle="Our Core Values" />
                        <ValuesCarousel values={values} />

                        {/* Faith Statements Section */}
                        <SectionTitle title="Faith Statements" subtitle="What We Believe" />
                        <div className="grid md:grid-cols-2 gap-8 mb-32">
                            {faithStatements.map((statement, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl shadow-xl p-8 text-gray-800 text-lg font-medium flex items-center"
                                >
                                    <span className="text-orange-500 font-bold mr-4">{idx + 1}.</span>
                                    <span>{statement}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Senior Pastor Section */}
{pastor && (
    <div className="mb-32">
        <SectionTitle title="Our Leadership" subtitle="Senior Pastor" />
        <div className="relative rounded-[3rem] shadow-2xl bg-gray-900 grid md:grid-cols-2 min-h-[650px] overflow-hidden">
            
            {/* Image Container - Strictly no padding or margin */}
            <div className="h-full min-h-[650px] relative bg-gray-900 p-0 m-0">
                <img 
                    src={pastor.image_url || "/imgs/pastor.png"} 
                    alt={pastor.name} 
                    className="absolute inset-0 w-full h-full object-contain object-bottom" 
                />

                {/* Mobile/Tablet: Bottom-to-Top Fade */}
                <div className="absolute inset-0 md:hidden pointer-events-none" 
                    style={{
                        background: `linear-gradient(to top, 
                            rgba(17, 24, 39, 1) 0%, 
                            rgba(17, 24, 39, 0.8) 15%, 
                            rgba(17, 24, 39, 0) 40%)`
                    }} 
                />

                {/* Desktop: Right-to-Left (side) and Bottom Fade */}
                <div className="absolute inset-0 hidden md:block pointer-events-none" 
                    style={{
                        background: `linear-gradient(to right, 
                            rgba(17, 24, 39, 1) 0%, 
                            rgba(17, 24, 39, 0.4) 20%, 
                            transparent 50%),
                            linear-gradient(to top, 
                            rgba(17, 24, 39, 0.8) 0%, 
                            transparent 15%)`
                    }} 
                />
            </div>

            {/* Content Side */}
            <div className="p-12 md:p-20 text-white flex flex-col justify-center min-h-[650px]">
                <h3 className="text-orange-500 font-bold uppercase tracking-widest mb-2">{pastor.title || "Senior Pastor"}</h3>
                <h2 className="text-4xl md:text-5xl max-sm:text-[1.5rem] font-black mb-6">{pastor.name}</h2>
                {[1,2,3,4].map(i => pastor[`bio_paragraph_${i}`] && (
                    <p key={i} className="text-gray-300 text-lg leading-relaxed mb-4">{pastor[`bio_paragraph_${i}`]}</p>
                ))}
                <div className="flex gap-4 mt-4">
                    {pastor.instagram_url && (
                        <a href={pastor.instagram_url} target="_blank" rel="noopener noreferrer" className="text-orange-500 font-bold hover:text-white transition-colors">Instagram</a>
                    )}
                    {pastor.podcast_url && (
                        <a href={pastor.podcast_url} target="_blank" rel="noopener noreferrer" className="text-orange-500 font-bold hover:text-white transition-colors">Podcast</a>
                    )}
                </div>
            </div>
        </div>
    </div>
)}

                        {/* Team Section */}
                        <SectionTitle title="Ministry Directors" subtitle="Our Team" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {team.map((member, idx) => (
                                <div key={idx} className="text-center group">
                                    <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-all duration-300">
                                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">{member.name}</h4>
                                    <p className="text-orange-600 text-sm font-semibold uppercase tracking-tighter">{member.title && member.position}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}