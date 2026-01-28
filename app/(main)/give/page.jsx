'use client';

import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import GiveModal from '@/components/GiveModal';


const Button = ({ children, className = "", onClick }) => (
    <button onClick={onClick} className={`px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 bg-white text-gray-900 hover:bg-gray-100 ${className}`}>{children}</button>
);

const SectionTitle = ({ title, subtitle, centered = true }) => (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">{subtitle}</h3>
        <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </div>
);

export default function GivingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="py-24 bg-white pt-32">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionTitle title="Generosity" subtitle="Stewardship" centered />

                    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Gift size={150} />
                            </div>
                            <Gift size={56} className="mx-auto mb-8 text-orange-500 relative z-10" />
                            <h3 className="text-3xl font-bold mb-4 relative z-10">Give Online</h3>
                            <p className="text-gray-300 mb-10 relative z-10 text-lg">
                                Your generosity fuels the mission. Safe, secure, and simple.
                            </p>

                            <Button onClick={() => setIsModalOpen(true)} className="w-full relative z-10 text-lg shadow-xl">
                                Give Now
                            </Button>

                            <div className="text-xs text-gray-500 mt-6 relative z-10 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div> 256-bit SSL Secure Payment
                            </div>
                        </motion.div>

                        <div>
                            <h3 className="text-3xl font-bold mb-6 text-gray-900">Why We Give</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                                We believe that you can't outgive God. Giving is an act of worship, a way to demonstrate our trust in God and our commitment to His mission.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { id: 1, title: 'Tithe', desc: 'Honoring God with the first 10% of our income.' },
                                    { id: 2, title: 'Offerings', desc: 'Gifts given above the tithe to support specific needs.' },
                                    { id: 3, title: 'Legacy', desc: 'Long-term giving to build for the future generations.' },
                                ].map((item) => (
                                    <div key={item.id} className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-600 font-bold text-xl">{item.id}</div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}