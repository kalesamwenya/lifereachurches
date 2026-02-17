'use client';
import {ArrowRight, Sun, Users, Music, ChevronDown, BabyIcon} from 'lucide-react';
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





import { useEffect } from 'react';
import { fetchMinistries } from '@/utils/fetchMinistries';

export default function MinistryHighlights() {
    const [ministries, setMinistries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMinistries()
            .then(data => {
                setMinistries(data);
                setLoading(false);
            })
            .catch(() => {
                setMinistries([]);
                setLoading(false);
            });
    }, []);

    // Skeleton loader component
    const SkeletonCard = () => (
        <div className="animate-pulse bg-gray-100 rounded-3xl h-80 relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-200" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="w-8 h-8 bg-gray-300 rounded-full mb-4" />
                <div className="w-2/3 h-6 bg-gray-300 rounded mb-2" />
                <div className="w-1/3 h-4 bg-gray-200 rounded mb-4" />
                <div className="w-1/4 h-4 bg-gray-300 rounded" />
            </div>
        </div>
    );

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <SectionTitle title="Something For Everyone" subtitle="Connect & Grow" />
                <div className="grid md:grid-cols-3 gap-8">
                    {loading
                        ? [0,1,2].map(i => <SkeletonCard key={i} />)
                        : ministries.map((ministry, idx) => {
                            // Assign previous Unsplash images
                            // Assign specific images and icons
                            const name = (ministry.name || ministry.title || '').toLowerCase();
                            let img = "https://media.istockphoto.com/id/2201485102/photo/young-woman-student-walking-looking-around-on-a-public-park.webp?a=1&b=1&s=612x612&w=0&k=20&c=LJnbjhyQRjNKsB8T_7B4sUW3_bYIxGxGz8giW8RbILA=";
                            let Icon = Sun;
                            if (name.includes('campus')) {
                                img = "https://plus.unsplash.com/premium_photo-1733342472892-a877e65af289?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dW5pdmVyc2l0eSUyMHN0dWRlbnRzfGVufDB8fDB8fHww";
                                Icon = Users;
                            } else if (name.includes('cell')) {
                                img = "https://plus.unsplash.com/premium_photo-1714575080994-61d113cb183c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVlbiUyMHdvcnNoaXB8ZW58MHx8MHx8fDA%3D";
                                Icon = ChevronDown;
                            } else if (name.includes('children')) {
                                img = "https://images.unsplash.com/flagged/photo-1567116681178-c326fa4e2c8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbGRyZW4lMjBtaW5pc3RyeXxlbnwwfHwwfHx8MA%3D%3D";
                                Icon = BabyIcon;
                            }
                            if (ministry.img) img = ministry.img;

                            return (
                                <Card key={ministry.id || idx} className="relative h-80 group cursor-pointer">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${img}')` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8 text-white">
                                        <Icon className="text-orange-400 mb-4" size={32} />
                                        <h3 className="text-2xl font-bold mb-2">{ministry.name || ministry.title}</h3>
                                        <p className="text-gray-300 text-sm mb-4">{
                                            (ministry.description || ministry.sub)
                                                ? (ministry.description || ministry.sub).length > 40
                                                    ? (ministry.description || ministry.sub).slice(0, 40) + '...'
                                                    : (ministry.description || ministry.sub)
                                                : ''
                                        }</p>
                                        <span className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wide group-hover:gap-4 transition-all">Learn More <ArrowRight size={16} /></span>
                                    </div>
                                </Card>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}