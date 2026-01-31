'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/LocalComponents';

const API_URL = 'https://content.lifereachchurch.org';

export default function Hero() {
    // Hero content state
    const [heroContent, setHeroContent] = useState({
        title_line1: 'REACHING',
        title_line2: 'EVERY SOUL',
        subtitle: 'We are a movement dedicated to showing the world that Jesus is alive, and He changes everything.',
        badge_text: 'Welcome Home',
        button1_text: 'Watch Online',
        button1_link: '/live',
        button2_text: 'Plan A Visit',
        button2_link: '/plan-visit',
        background_image_url: null
    });
    
    // Standard high-quality fallback for background
    const [heroImage, setHeroImage] = useState("/imgs/SHIFT2025-212.jpg");

    const getImageUrl = (path) => {
        if (!path) return null;
        // If path already includes http/https, return as is
        if (path.startsWith('http')) return path;
        // Otherwise prepend the base URL
        return `${API_URL}${path}`;
    };

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                const res = await axios.get(`${API_URL}/hero/get_hero_content.php`);

                if (res.data && res.data.success && res.data.data) {
                    const data = res.data.data;
                    setHeroContent(data);
                    
                    // Set background image if available
                    if (data.background_image_url) {
                        setHeroImage(getImageUrl(data.background_image_url));
                    }
                }
            } catch (err) {
                console.log("Using default hero content and background");
            }
        };
        fetchHeroContent();
    }, []);

    return (
        <div className="relative h-screen min-h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
            <motion.div
                key={heroImage} // Key ensures smooth fade transition when live image loads
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url("${heroImage}")` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/30"></div>
            </motion.div>

            <div className="relative z-10 px-6 max-w-5xl mx-auto mt-16">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className="inline-block py-2 px-4 rounded-full bg-orange-500/20 border border-orange-400/50 backdrop-blur-md text-orange-100 font-bold uppercase tracking-widest text-xs mb-8">
                        {heroContent.badge_text}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight uppercase">
                        {heroContent.title_line1}<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{heroContent.title_line2}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
                        {heroContent.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                        <a href={heroContent.button1_link}><Button className="w-full sm:w-auto !px-8 !py-4 text-lg">{heroContent.button1_text}</Button></a>
                        <a href={heroContent.button2_link}><Button variant="outline" className="w-full sm:w-auto !px-8 !py-4 text-lg">{heroContent.button2_text}</Button></a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}