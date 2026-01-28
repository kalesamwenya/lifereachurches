'use client';
import { motion } from 'framer-motion';
import { Sun, MapPin } from 'lucide-react';
import React from "react";

export default function VisionMission() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-12 rounded-3xl shadow-xl border-l-8 border-orange-500 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                            <Sun size={200} />
                        </div>
                        <h3 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h3>
                        <p className="text-xl text-gray-600 leading-relaxed relative z-10">
                            "To be a beacon of hope, reaching every soul with the transformative love of Christ, creating a city where no one walks alone."
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-900 p-12 rounded-3xl shadow-xl border-r-8 border-orange-500 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700 text-white">
                            <MapPin size={200} />
                        </div>
                        <h3 className="text-3xl font-bold mb-6 text-white">Our Mission</h3>
                        <p className="text-xl text-gray-300 leading-relaxed relative z-10">
                            "We exist to <span className="text-orange-500 font-bold">Reach</span> the lost, <span className="text-orange-500 font-bold">Raise</span> disciples, and <span className="text-orange-500 font-bold">Release</span> leaders into their God-given destiny."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}