'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, PenTool, Loader2 } from 'lucide-react';
import { SectionTitle, Button } from '@/components/ui/LocalComponents';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

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
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size for responsive logic
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    const itemsPerPage = isMobile ? 1 : 3;

    useEffect(() => {
        const fetchTestimonies = async () => {
            try {
                const res = await axios.get(`${API_URL}/testimonies/get.php`);
                const formatted = res.data
                    .filter(t => t.status === 'approved')
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

    // Create pages based on the current itemsPerPage
    const pages = testimonials.reduce((acc, t, idx) => {
        const pageIndex = Math.floor(idx / itemsPerPage);
        if (!acc[pageIndex]) acc[pageIndex] = [];
        acc[pageIndex].push(t);
        return acc;
    }, []);

    // Auto-advance
    useEffect(() => {
        if (pages.length === 0) return;
        const timer = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % pages.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [pages.length]);

    const nextSlide = () => setCurrentPage((prev) => (prev + 1) % pages.length);
    const prevSlide = () => setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);

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

                <div className="max-w-7xl mx-auto relative">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`${currentPage}-${itemsPerPage}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {(pages[currentPage] || []).map((item) => (
                                    <Card key={item.id} className="p-8 border border-gray-100 flex flex-col items-center text-center shadow-xl relative min-h-[420px]">
                                        <Quote className="absolute top-4 right-4 text-orange-100 w-16 h-16 opacity-50" fill="currentColor" />
                                        
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-orange-200 flex items-center justify-center bg-orange-50 mb-6 shrink-0">
                                            <span className="text-3xl font-black text-orange-200 uppercase">
                                                {item?.name?.charAt(0)}
                                            </span>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center">
                                            <Quote className="text-orange-500 mb-4 mx-auto w-6 h-6" fill="currentColor" />
                                            <p className="text-md font-medium text-gray-800 mb-6 italic leading-relaxed line-clamp-6">
                                                "{item?.quote}"
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{item?.name}</h4>
                                            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                                                {item?.role}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots & Arrows */}
                    {pages.length > 1 && (
                        <div className="flex justify-center items-center gap-6 mt-12">
                            <button onClick={prevSlide} className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                                <ChevronLeft size={20} />
                            </button>
                            
                            <div className="flex gap-2">
                                {pages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentPage ? 'w-8 bg-orange-600' : 'w-2 bg-gray-300'}`}
                                    />
                                ))}
                            </div>

                            <button onClick={nextSlide} className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 mb-6 font-medium">Has God done something amazing in your life?</p>
                    <a href="/testimonies/submit" className="inline-block">
                        <Button variant="secondary" className="!border-orange-200 text-orange-600 hover:!bg-orange-50 shadow-md py-6 px-10 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3">
                            <PenTool size={16} /> Share Your Story
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}