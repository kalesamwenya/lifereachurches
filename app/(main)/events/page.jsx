'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import { API_URL } from '@/lib/api-config';

// --- Design System Components (Preserved) ---

const Card = ({ children, className = "" }) => (
    <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden ${className}`}>{children}</motion.div>
);

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const base = "px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 active:scale-95 z-10 relative";
    const styles = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-600/20",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900"
    };
    return <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-12">
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">{subtitle}</h3>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">{title}</h2>
        <div className="h-1.5 w-24 bg-orange-600 mt-6 rounded-full"></div>
    </div>
);

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) return;
        timerComponents.push(
            <div key={interval} className="text-center mx-2 md:mx-4">
                <div className="text-3xl md:text-5xl font-black text-white bg-white/20 backdrop-blur-md rounded-xl p-3 md:p-4 min-w-[70px] md:min-w-[100px] border border-white/20">
                    {timeLeft[interval]}
                </div>
                <span className="text-xs md:text-sm uppercase font-bold tracking-widest text-orange-200 mt-2 block">{interval}</span>
            </div>
        );
    });

    return (
        <div className="flex justify-center flex-wrap gap-y-4">
            {timerComponents.length ? timerComponents : <span className="text-2xl font-bold text-white uppercase tracking-widest">Happening Now!</span>}
        </div>
    );
};

// --- Main Page Component ---

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetching from your event API
                const res = await axios.get(`${API_URL}/engagements/events/list.php`);
                const allEvents = res.data.rows || [];

                // Filter for Public/Outreach only (ministry_id is null)
                const publicEvents = allEvents.filter(e => e.ministry_id === null);
                setEvents(publicEvents);
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Separation Logic
    const now = new Date();
    const sorted = [...events].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    const upcoming = sorted.filter(e => new Date(e.start_time) >= now);
    const past = sorted.filter(e => new Date(e.start_time) < now).reverse();

    const featuredEvent = upcoming[0]; // The nearest public event
    const otherUpcoming = upcoming.slice(1);

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-gray-900">
            <Loader2 className="animate-spin text-orange-600" size={48} />
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 1. HERO SECTION (Nearest Event) */}
            {featuredEvent && (
                <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${featuredEvent.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1920'}")` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-6 text-center mt-16">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <span className="inline-block py-2 px-4 rounded-full bg-orange-600 text-white font-bold uppercase tracking-widest text-xs mb-6 shadow-lg shadow-orange-600/30">Featured Event</span>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight uppercase">{featuredEvent.title}</h1>
                            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed line-clamp-2">{featuredEvent.description}</p>

                            <div className="mb-12"><Countdown targetDate={featuredEvent.start_time} /></div>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link href={`/events/register?id=${featuredEvent.id}`}><Button className="!px-10 !py-4 text-lg uppercase tracking-widest">Get Tickets</Button></Link>
                                <div className="flex items-center gap-6 text-white text-sm font-bold uppercase tracking-wide">
                                    <span className="flex items-center gap-2"><Calendar className="text-orange-500" /> {new Date(featuredEvent.start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                    <span className="flex items-center gap-2"><MapPin className="text-orange-500" /> {featuredEvent.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            <div className="py-24">
                <div className="container mx-auto px-6">
                    {/* 2. UPCOMING EVENTS GRID */}
                    <SectionTitle title="Upcoming Events" subtitle="Mark Your Calendar" />
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        {otherUpcoming.map((event, index) => (
                            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <Card className="h-full group hover:-translate-y-2 transition-transform duration-300 border border-gray-100 flex flex-col">
                                    <div className="bg-gray-900 text-white p-3 text-center text-[10px] font-black uppercase tracking-[0.2em] flex justify-between px-6">
                                        <span>Upcoming</span>
                                        <ArrowUpRight size={16} className="text-orange-500" />
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <div className="text-[10px] font-black text-orange-600 mb-3 uppercase tracking-[0.2em] bg-orange-50 w-fit px-3 py-1 rounded-full">{event.type || 'General'}</div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter leading-none">{event.title}</h3>
                                        <div className="mt-auto space-y-4 text-gray-500 border-t border-gray-100 pt-6 font-bold text-xs uppercase tracking-widest">
                                            <div className="flex items-center gap-3"><Calendar size={18} className="text-orange-400" /> {new Date(event.start_time).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-3"><MapPin size={18} className="text-orange-400" /> {event.location}</div>
                                        </div>
                                        <Link href={`/events/register?id=${event.id}`} className="mt-6 block w-full"><button className="w-full py-4 rounded-xl border-2 border-gray-100 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:border-orange-500 hover:text-orange-600 transition-all">Register</button></Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* 3. PAST EVENTS HIGHLIGHTS */}
                    <SectionTitle title="Event Highlights" subtitle="Look Back" />
                    <div className="grid md:grid-cols-3 gap-8">
                        {past.slice(0, 6).map((event, idx) => (
                            <motion.div key={idx} whileHover={{ scale: 1.02 }} className="relative rounded-3xl overflow-hidden shadow-md cursor-pointer group h-64">
                                <img src={event.image_url || "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=600"} alt={event.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-8">
                                    <span className="text-orange-400 font-black text-[10px] uppercase tracking-widest mb-1">{new Date(event.start_time).toLocaleDateString()}</span>
                                    <h4 className="text-white text-xl font-black uppercase italic tracking-tighter">{event.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
