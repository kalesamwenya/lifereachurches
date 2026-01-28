'use client';
import { Coffee, Baby, Car } from 'lucide-react';
import { Button } from '@/components/ui/LocalComponents';
import {motion} from "framer-motion";
import React from "react";

const SectionTitle = ({ title, subtitle, centered = true, dark = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
        <h3 className={`font-bold uppercase tracking-widest text-xs md:text-sm mb-3 ${dark ? 'text-orange-400' : 'text-orange-600'}`}>{subtitle}</h3>
        <h2 className={`text-3xl md:text-5xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

export default function PlanVisitCTA() {
    const steps = [
        { icon: Coffee, title: "Coffee's On Us", desc: "Grab a free hot coffee or tea at our Reach Café in the lobby." },
        { icon: Baby, title: "Safe for Kids", desc: "Our Reach Kids environment is safe, secure, and fun." },
        { icon: Car, title: "Easy Parking", desc: "Look for the 'First Time Guest' signs for a spot close to the entrance." }
    ];

    return (
        <section className="py-20 bg-orange-600 text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Planning Your First Visit?</h2>
                    <p className="text-orange-100 text-lg">Here is what you can expect when you join us this Sunday.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                            <Coffee size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Coffee's On Us</h3>
                        <p className="text-orange-100 leading-relaxed">Arrive a few minutes early and grab a free hot coffee or tea at our Reach Café in the lobby.</p>
                    </div>
                    <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl -rotate-2">
                            <Baby size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Safe for Kids</h3>
                        <p className="text-orange-100 leading-relaxed">Our Reach Kids environment is safe, secure, and fun. Check-in is quick and easy.</p>
                    </div>
                    <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-1">
                            <Car size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Easy Parking</h3>
                        <p className="text-orange-100 leading-relaxed">Our parking team will direct you to a spot close to the entrance. Look for the "First Time Guest" signs.</p>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <a href="/plan-visit"><Button variant="secondary" className="mx-auto text-orange-600 shadow-xl">Plan A Visit</Button></a>
                </div>
            </div>
        </section>
    );
}