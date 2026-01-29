'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Loader2 } from 'lucide-react';
import { SectionTitle } from '@/components/ui/LocalComponents';

const API_URL = 'https://content.lifereachchurch.org';

export default function GallerySnippet() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                // Fetching with 'newest' sort as default
                const res = await axios.get(`${API_URL}/gallery/list.php?sort=newest`);
                if (res.data && res.data.rows) {
                    // Limit to 6 items in the frontend
                    setImages(res.data.rows.slice(0, 6));
                }
            } catch (err) {
                console.error("Error fetching gallery:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGallery();
    }, []);

    if (isLoading) return (
        <div className="py-24 flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-orange-600" size={40} />
        </div>
    );

    // Don't render section if there are no images
    if (images.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle title="Life At Reach" subtitle="Gallery" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {images.map((img, idx) => (
                            <motion.div
                                key={img.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="rounded-[2.5rem] overflow-hidden shadow-2xl relative group h-80 cursor-pointer"
                                onClick={() => window.location.href = '/gallery'}
                            >
                                <img
                                    src={img.featured_image_url}
                                    alt={img.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                    <h4 className="text-white font-black italic uppercase text-lg leading-none mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {img.title}
                                    </h4>
                                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        {new Date(img.event_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-white font-black italic uppercase tracking-widest flex items-center gap-2 text-xs">
                                        <Instagram size={18} /> @LifeReachChurch
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Optional: View All Button */}
                <div className="mt-16 text-center" hidden>
                    <button
                        onClick={() => window.location.href = '/gallery'}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-orange-600 transition-colors border-b-2 border-transparent hover:border-orange-600 pb-2"
                    >
                        View Full Gallery
                    </button>
                </div>
            </div>
        </section>
    );
}