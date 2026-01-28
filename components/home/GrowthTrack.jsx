'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, Users, Heart, Smartphone } from 'lucide-react';
import { SectionTitle } from '@/components/ui/LocalComponents';
import React from "react";

export default function GrowthTrack() {
    const nextSteps = [
        { title: "Get Baptized", desc: "Publicly declare your faith in Jesus.", icon: <CheckCircle className="text-blue-500" /> },
        { title: "Join a Group", desc: "Find community and do life together.", icon: <Users className="text-green-500" /> },
        { title: "Start Serving", desc: "Use your gifts to make a difference.", icon: <Heart className="text-red-500" /> },
        { title: "Give Online", desc: "Support the mission of the church.", icon: <Smartphone className="text-orange-500" /> },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle title="Take Your Next Step" subtitle="Growth Track" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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