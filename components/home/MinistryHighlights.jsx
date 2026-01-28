'use client';
import {ArrowRight, Sun, Users, Music, ChevronDown} from 'lucide-react';
import { SectionTitle } from '@/components/ui/LocalComponents';
import {AnimatePresence, motion} from 'framer-motion';
import React, {useState} from "react";

const Card = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);




export default function MinistryHighlights() {
    const ministries = [
        { title: "Reach Kids", sub: "Infants - 5th Grade", icon: Sun, img: "https://images.unsplash.com/photo-1502086223501-68119136a60b?auto=format&fit=crop&q=80&w=600" },
        { title: "Life Groups", sub: "Community", icon: Users, img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=600" },
        { title: "Worship", sub: "Join the Team", icon: Music, img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600" }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle title="Something For Everyone" subtitle="Connect & Grow" />
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="relative h-80 group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502086223501-68119136a60b?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <Sun className="text-orange-400 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Reach Kids</h3>
                            <p className="text-gray-300 text-sm mb-4">Infants - 5th Grade</p>
                            <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Learn More <ArrowRight size={16} /></span>
                        </div>
                    </Card>

                    <Card className="relative h-80 group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <Users className="text-orange-400 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Life Groups</h3>
                            <p className="text-gray-300 text-sm mb-4">Community & Discipleship</p>
                            <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Find A Group <ArrowRight size={16} /></span>
                        </div>
                    </Card>

                    <Card className="relative h-80 group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <Music className="text-orange-400 mb-4" size={32} />
                            <h3 className="text-2xl font-bold mb-2">Worship</h3>
                            <p className="text-gray-300 text-sm mb-4">Join the Team</p>
                            <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Audition <ArrowRight size={16} /></span>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}