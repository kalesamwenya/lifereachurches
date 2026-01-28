'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/LocalComponents';
import { API_URL } from '@/lib/api-config';

export default function Hero() {
    // Standard high-quality fallback for Emit Photography
    const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1920");

    useEffect(() => {
        const fetchHero = async () => {
            try {
                // IMPORTANT: Ensure this path matches your folder exactly
                const res = await axios.get(`${API_URL}/gallery/get_featured.php`);

                if (res.data && res.data.image_url) {
                    setHeroImage(res.data.image_url);
                }
            } catch (err) {
                console.log("Using default hero background");
            }
        };
        fetchHero();
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
                        Welcome Home
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight uppercase">
                        REACHING<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">EVERY SOUL</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
                        We are a movement dedicated to showing the world that Jesus is alive, and He changes everything.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                        <a href="/live"><Button className="w-full sm:w-auto !px-8 !py-4 text-lg">Watch Online</Button></a>
                        <a href="/plan-visit"><Button variant="outline" className="w-full sm:w-auto !px-8 !py-4 text-lg">Plan A Visit</Button></a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}