'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/LocalComponents';
import axios from 'axios';
import React from "react";

const API_URL = 'https://content.lifereachchurch.org';

export default function IntroSnippet() {
    const [introContent, setIntroContent] = useState({
        badge_text: 'Hello & Welcome',
        title: 'We Are Life Reach Church.',
        description: 'Whether you\'ve been a believer for decades or you\'re just starting to ask questions about God, you have a place here. We are an imperfect family striving to love a perfect God and serve our city with everything we have.',
        button_text: 'Read Our Story',
        button_link: '/about'
    });

    useEffect(() => {
        const fetchIntroContent = async () => {
            try {
                const res = await axios.get(`${API_URL}/intro/get_intro_content.php`);
                if (res.data && res.data.success && res.data.data) {
                    setIntroContent(res.data.data);
                }
            } catch (err) {
                console.log("Using default intro content");
            }
        };
        fetchIntroContent();
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-50 rounded-tr-full opacity-50"></div>

            <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h5 className="text-orange-600 font-bold uppercase tracking-widest mb-4">{introContent.badge_text}</h5>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">{introContent.title}</h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12">
                        {introContent.description}
                    </p>
                    <a href={introContent.button_link}><Button variant="secondary" className="mx-auto">{introContent.button_text}</Button></a>
                </motion.div>
            </div>
        </section>
    );
}