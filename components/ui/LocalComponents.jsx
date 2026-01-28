'use client';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const base = "px-6 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 active:scale-95 z-10 relative text-sm md:text-base";
    const styles = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-600/20",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900",
    };
    return <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};

export const SectionTitle = ({ title, subtitle, centered = true, dark = false }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`mb-16 ${centered ? 'text-center' : ''}`}>
        <h3 className={`font-bold uppercase tracking-widest text-xs mb-3 ${dark ? 'text-orange-400' : 'text-orange-600'}`}>{subtitle}</h3>
        <h2 className={`text-3xl md:text-5xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);