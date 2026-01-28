'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, PenTool, Loader2 } from 'lucide-react';
import { SectionTitle, Button } from '@/components/ui/LocalComponents';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';

const Card = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Fetch testimonies from DB
   useEffect(() => {
    const fetchTestimonies = async () => {
        try {
            const res = await axios.get(`${API_URL}/testimonies/get.php`);

            const formatted = res.data
                .filter(t => t.status === 'approved') // only show approved on frontend
                .map(t => ({
                    id: t.id,
                    name: t.full_name,
                    quote: t.testimony,
                    role: t.location || 'Church Member',
                }));

            setTestimonials(formatted);
        } catch (err) {
            console.error("Failed to load testimonies", err);
        } finally {
            setLoading(false);
        }
    };

    fetchTestimonies();
}, []);


    // 2. Auto-advance carousel
   useEffect(() => {
    if (!testimonials.length) return;

    const timer = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(timer);
}, [testimonials]);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (loading) return (
        <div className="py-24 flex justify-center items-center bg-gray-50">
            <Loader2 className="animate-spin text-orange-600" size={40} />
        </div>
    );

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="Stories of Change" subtitle="Real People. Real God." />

                <div className="max-w-4xl mx-auto relative">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentTestimonial}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <Card className="p-10 md:p-16 border border-gray-100 flex flex-col md:flex-row gap-8 items-center text-center md:text-left shadow-2xl relative min-h-[400px]">
                                <Quote className="absolute top-8 right-8 text-orange-100 w-24 h-24 rotate-12 opacity-50" fill="currentColor" />

                                <div className="flex-shrink-0 relative">
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-2 border-2 border-dashed border-orange-200 flex items-center justify-center bg-orange-50">
                                        {/* Since DB doesn't have images yet, we use a styled initial or placeholder */}
                                        <span className="text-5xl font-black text-orange-200 uppercase">
                                            {testimonials[currentTestimonial]?.name?.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative z-10 flex-1">
                                    <Quote className="text-orange-500 mb-6 mx-auto md:mx-0 w-8 h-8" fill="currentColor" />
                                    <p className="text-xl md:text-2xl font-medium text-gray-800 mb-8 italic leading-relaxed">
                                        "{testimonials[currentTestimonial]?.quote}"
                                    </p>
                                    <div>
                                        <h4 className="text-2xl font-bold text-gray-900 mb-1">{testimonials[currentTestimonial]?.name}</h4>
                                        <span className="text-sm text-orange-600 font-bold uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full">
                                            {testimonials[currentTestimonial]?.role}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex justify-center items-center gap-4 mt-8" hidden>
                        <button onClick={prevTestimonial} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentTestimonial(idx)}
                                    className={`h-2 rounded-full transition-all ${idx === currentTestimonial ? 'w-8 bg-orange-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                        <button onClick={nextTestimonial} className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-500 mb-4 font-medium">Has God done something amazing in your life?</p>
                        <a href="/testimonies/submit">
                            <Button variant="secondary" className="mx-auto !border-orange-200 text-orange-600 hover:!bg-orange-50 shadow-md py-6 px-8 rounded-2xl font-black uppercase tracking-widest text-xs">
                                <PenTool size={16} /> Share Your Story
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}