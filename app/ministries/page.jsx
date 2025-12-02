'use client';

import React from 'react';
import { User, Sun, Coffee, Music, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Local Components & Data ---

const Card = ({ children, className = "" }) => (
    <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}>{children}</motion.div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-16">
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">{subtitle}</h3>
        <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
        <div className="h-1.5 w-24 bg-orange-600 mt-6 rounded-full"></div>
    </div>
);

const mockDepts = [
    { id: 'kids', name: "Reach Kids", icon: <Sun size={32} />, description: "Fun, safe, and faith-filled environments for ages 0-11.", head: "Mary Poppins" },
    { id: 'youth', name: "Apex Youth", icon: <Coffee size={32} />, description: "Empowering teens to own their faith and change the world.", head: "Mike Chang" },
    { id: 'worship', name: "Worship Creative", icon: <Music size={32} />, description: "Leading the congregation in spirit and truth through music.", head: "David Psalm" },
    { id: 'groups', name: "Life Groups", icon: <Users size={32} />, description: "Small groups meeting in homes to do life together.", head: "Sarah Connect" },
    { id: 'library', name: "Book Library", icon: <BookOpen size={32} />, description: "Resources to help you grow in your walk with Christ.", head: "Resource Team" },
];

// --------------------------------

export default function MinistriesPage() {
    return (
        <div className="py-24 bg-white pt-32">
            <div className="container mx-auto px-6">
                <SectionTitle title="Ministries" subtitle="Connect & Grow" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockDepts.map((dept, index) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="border border-gray-100 hover:border-orange-200 h-full">
                                <div className="p-10">
                                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                        {dept.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{dept.name}</h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">{dept.description}</p>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-gray-100 pt-6">
                                        <User size={16} className="text-orange-400" /> Lead: <span className="text-gray-900 font-medium">{dept.head}</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}