'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button' }) => {
    const baseStyle = "px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95";
    const variants = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30",
        secondary: "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900",
        dark: "bg-gray-900 text-white hover:bg-gray-800"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export const SectionTitle = ({ title, subtitle, centered = true, dark = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
        <h3 className={`font-bold uppercase tracking-widest text-sm mb-3 ${dark ? 'text-orange-400' : 'text-orange-600'}`}>{subtitle}</h3>
        <h2 className={`text-4xl md:text-5xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

export const Card = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);