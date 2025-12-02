'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../utils/mockData';

// --- Local Components ---

const Button = ({ children, variant = 'primary', className = '' }) => {
    const styles = variant === 'secondary' ? "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50" : "bg-orange-600 text-white hover:bg-orange-700";
    return <button className={`px-6 py-3 rounded-full font-bold transition-all ${styles} ${className}`}>{children}</button>;
};

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

// -----------------------

export default function LibraryPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        api.getBooks().then(setBooks);
    }, []);

    return (
        <div className="py-24 bg-gray-50 pt-32">
            <div className="container mx-auto px-6">
                <SectionTitle title="Book Library" subtitle="Recommended Resources" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book, index) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="flex flex-col h-full border border-gray-100">
                                <div className="h-48 overflow-hidden bg-gray-200 relative group cursor-pointer" onClick={() => window.location.href = `/library/${book.id}`}>
                                    <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 uppercase">
                                        {book.category}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                                    <p className="text-gray-500 mb-4 text-sm font-medium">By {book.author}</p>

                                    <div className="flex items-center gap-1 text-yellow-400 mb-6">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} size={14} fill={i <= Math.round(book.rating) ? "currentColor" : "none"} className={i > Math.round(book.rating) ? "text-gray-300" : ""} />
                                        ))}
                                        <span className="text-gray-400 text-xs ml-2">({book.rating})</span>
                                    </div>

                                    <div className="mt-auto">
                                        <a href={`/library/${book.id}`} className="block w-full">
                                            <Button variant="secondary" className="w-full text-sm">View Details</Button>
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 bg-orange-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <BookOpen size={200} className="absolute -bottom-10 -left-10 text-orange-500 opacity-20" />
                    <h3 className="text-3xl font-bold mb-4 relative z-10">Visit Our Bookstore</h3>
                    <p className="text-orange-100 max-w-2xl mx-auto mb-8 relative z-10">
                        Stop by the lobby before or after service to browse our full collection of books, bibles, and study guides.
                    </p>
                    <Button variant="secondary" className="relative z-10 !text-orange-600">Get Directions</Button>
                </div>
            </div>
        </div>
    );
}