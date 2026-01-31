'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, MapPin } from 'lucide-react';
import axios from 'axios';
import React from "react";

const API_URL = 'https://content.lifereachchurch.org';

export default function VisionMission() {
    const [visionMission, setVisionMission] = useState({
        vision: 'To be a beacon of hope, reaching every soul with the transformative love of Christ, creating a city where no one walks alone.',
        mission: 'We exist to Reach the lost, Raise disciples, and Release leaders into their God-given destiny.'
    });

    useEffect(() => {
        const fetchChurchSettings = async () => {
            try {
                const res = await axios.get(`${API_URL}/settings/get.php`);
                if (res.data) {
                    setVisionMission({
                        vision: res.data.vision || visionMission.vision,
                        mission: res.data.mission || visionMission.mission
                    });
                }
            } catch (err) {
                console.log("Using default vision and mission");
            }
        };
        fetchChurchSettings();
    }, []);

    // Function to highlight "Reach", "Raise", "Release" in mission text
    const formatMission = (text) => {
        const words = ['Reach', 'Raise', 'Release'];
        let formattedText = text;
        
        words.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            formattedText = formattedText.replace(regex, '<span class="text-orange-500 font-bold">$1</span>');
        });
        
        return formattedText;
    };

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
                            "{visionMission.vision}"
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
                        <p 
                            className="text-xl text-gray-300 leading-relaxed relative z-10"
                            dangerouslySetInnerHTML={{ __html: `"${formatMission(visionMission.mission)}"` }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}