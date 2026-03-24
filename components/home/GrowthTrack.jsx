'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, Users, Heart, Smartphone, Cross, Star } from 'lucide-react';
import { SectionTitle } from '@/components/ui/LocalComponents';
import React from "react";

export default function GrowthTrack() {
  const nextSteps = [
    { 
        title: "Receive Jesus Christ", 
        desc: "Begin your journey by grace through faith. — Ephesians 2:8", 
        icon: <Cross className="text-purple-600" /> 
    },
    { 
        title: "Discipleship", 
        desc: "Be transformed by the renewing of your mind. — Romans 12:2", 
        icon: <Star className="text-amber-500" /> 
    },
    { 
        title: "Get Baptized", 
        desc: "Publicly declare your new life in Him. — Acts 2:38", 
        icon: <CheckCircle className="text-blue-500" /> 
    },
    { 
        title: "Join a Group", 
        desc: "Do life together in true community. — Hebrews 10:24-25", 
        icon: <Users className="text-green-500" /> 
    },
    { 
        title: "Start Serving", 
        desc: "Use your God-given gifts for others. — 1 Peter 4:10", 
        icon: <Heart className="text-red-500" /> 
    },
    { 
        title: "Give Online", 
        desc: "Honoring God with our firstfruits. — Proverbs 3:9", 
        icon: <Smartphone className="text-orange-500" /> 
    },
];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle title="Take Your Next Step" subtitle="Growth Track" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                    {nextSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-gray-100 text-center group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-6 text-3xl group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-sm text-gray-500 mb-6">{step.desc}</p>
                            <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <ArrowUpRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}