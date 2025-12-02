'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Timer, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Local Components ---

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

// --- Countdown Component ---
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
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }
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
            {timerComponents.length ? timerComponents : <span className="text-2xl font-bold text-white">Event Started!</span>}
        </div>
    );
};

// --- Mock Data ---

const featuredEvent = {
    id: 99,
    title: "Worship Night: Unbroken",
    date: "2023-11-15T19:00:00", // ISO format for countdown
    displayDate: "Nov 15, 2023",
    time: "7:00 PM",
    location: "Main Sanctuary",
    desc: "A night of powerful worship, prayer, and encounter. Join us as we lift up the name of Jesus and break every chain.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1920"
};

const upcomingEvents = [
    { id: 1, title: "City Outreach", date: "Nov 12, 2023", time: "10:00 AM", location: "Downtown Plaza", category: "Outreach" },
    { id: 3, title: "Youth Camp 2023", date: "Dec 10, 2023", time: "All Day", location: "Pine Lake Retreat", category: "Youth" },
    { id: 4, title: "Christmas Eve Service", date: "Dec 24, 2023", time: "5:00 PM", location: "Main Sanctuary", category: "Holiday" },
];

const pastEvents = [
    { id: 101, title: "Summer Baptism", date: "Aug 15, 2023", image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=600" },
    { id: 102, title: "Men's Breakfast", date: "Sep 02, 2023", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=600" },
    { id: 103, title: "Back to School Bash", date: "Sep 10, 2023", image: "https://images.unsplash.com/photo-1502086223501-68119136a60b?auto=format&fit=crop&q=80&w=600" },
];

// --------------------------------

export default function EventsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* 1. HERO / FEATURED EVENT with COUNTDOWN */}
            <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${featuredEvent.image}")` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-2 px-4 rounded-full bg-orange-600 text-white font-bold uppercase tracking-widest text-xs mb-6 shadow-lg shadow-orange-600/30">
                            Featured Event
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                            {featuredEvent.title}
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {featuredEvent.desc}
                        </p>

                        {/* Countdown Timer */}
                        <div className="mb-12">
                            <Countdown targetDate={featuredEvent.date} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a href="/events/register"><Button className="!px-10 !py-4 text-lg">Get Tickets</Button></a>
                            <div className="flex items-center gap-6 text-white text-sm font-bold uppercase tracking-wide">
                                <span className="flex items-center gap-2"><Calendar className="text-orange-500" /> {featuredEvent.displayDate}</span>
                                <span className="hidden md:inline w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="flex items-center gap-2"><MapPin className="text-orange-500" /> {featuredEvent.location}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="py-24">
                <div className="container mx-auto px-6">

                    {/* 2. UPCOMING EVENTS GRID */}
                    <SectionTitle title="Upcoming Events" subtitle="Mark Your Calendar" />
                    <div className="grid md:grid-cols-3 gap-8 mb-32">
                        {upcomingEvents.map((event, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={event.id}
                            >
                                <Card className="h-full group hover:-translate-y-2 transition-transform duration-300 border border-gray-100 flex flex-col">
                                    <div className="bg-gray-900 text-white p-3 text-center text-xs font-bold uppercase tracking-widest flex justify-between items-center px-6">
                                        <span>Upcoming</span>
                                        <ArrowUpRight size={16} className="text-orange-500" />
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <div className="text-sm font-bold text-orange-600 mb-3 uppercase tracking-wide bg-orange-50 w-fit px-2 py-1 rounded">{event.category}</div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">{event.title}</h3>

                                        <div className="mt-auto space-y-4 text-gray-500 border-t border-gray-100 pt-6">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={18} className="text-orange-400" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-orange-400" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={18} className="text-orange-400" />
                                                {event.location}
                                            </div>
                                        </div>

                                        <a href="/events/register" className="mt-6 block w-full">
                                            <button className="w-full py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-all">
                                                Register
                                            </button>
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* 3. PAST EVENTS SECTION */}
                    <SectionTitle title="Event Highlights" subtitle="Look Back" />
                    <div className="grid md:grid-cols-3 gap-8">
                        {pastEvents.map((event, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                className="relative rounded-3xl overflow-hidden shadow-md cursor-pointer group h-64"
                            >
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-8">
                                    <span className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-1">{event.date}</span>
                                    <h4 className="text-white text-xl font-bold">{event.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}