'use client';
import { motion } from 'framer-motion';
import { Play, Quote } from 'lucide-react';
import React from "react";

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const base = "px-6 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 active:scale-95 z-10 relative text-sm md:text-base";
    const styles = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-600/20",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-orange-200",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900",
        dark: "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
    };
    return <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};

export default function LatestSermon() {
    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=1920")' }}
            ></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Latest Message</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            The Art of <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Neighboring</span>
                        </h2>

                        <div className="bg-gray-800/50 border-l-4 border-orange-500 p-6 rounded-r-xl backdrop-blur-sm mb-8">
                            <Quote className="text-orange-500 mb-2 opacity-50" size={24} />
                            <p className="text-gray-300 text-lg italic leading-relaxed">
                                "Who is my neighbor? It's not just the person who looks like you or lives next door. Jesus challenges us to expand our circle and love without agenda."
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <img
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                                alt="Pastor"
                                className="w-14 h-14 rounded-full border-2 border-orange-500 object-cover"
                            />
                            <div>
                                <p className="text-white font-bold">Pastor Michael Ford</p>
                                <p className="text-gray-400 text-sm">Lead Pastor</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="/sermons"><Button className="!bg-white !text-gray-900 hover:!bg-gray-100"><Play size={18} fill="currentColor" /> Watch Full Sermon</Button></a>
                            <a href="/sermons"><Button variant="outline">Sermon Archive</Button></a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 w-full"
                    >
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-700 group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sermon Thumbnail" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                <div className="w-20 h-20 bg-orange-600/90 rounded-full flex items-center justify-center pl-1 text-white shadow-xl shadow-orange-900/40 transform group-hover:scale-110 transition-transform">
                                    <Play size={32} fill="currentColor" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 text-white text-xs font-bold rounded-lg backdrop-blur-md">
                                38:24
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}