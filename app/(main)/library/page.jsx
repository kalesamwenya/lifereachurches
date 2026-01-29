'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Star, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://content.lifereachchurch.org';

// --- Local Components (Design Preserved) ---

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const styles = variant === 'secondary' ? "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50" : "bg-orange-600 text-white hover:bg-orange-700";
    return <button onClick={onClick} className={`px-6 py-3 rounded-full font-bold transition-all ${styles} ${className}`}>{children}</button>;
};

const Card = ({ children, className = "" }) => (
    <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 ${className}`}>{children}</motion.div>
);

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-12">
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-3">{subtitle}</h3>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">{title}</h2>
        <div className="h-1.5 w-24 bg-orange-600 mt-6 rounded-full"></div>
    </div>
);

// -----------------------

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination & Meta State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const pageSize = 9;

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/library/list.php`, {
                params: {
                    q: searchQuery,
                    page: currentPage,
                    pageSize: pageSize,
                    sort: 'title-asc'
                }
            });
            setBooks(res.data.rows || []);
            setTotalBooks(res.data.total || 0);
        } catch (err) {
            console.error("Error fetching library:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [currentPage, searchQuery]);

    const totalPages = Math.ceil(totalBooks / pageSize);

    return (
        <div className="py-24 bg-gray-50 pt-32 min-h-screen">
            <div className="container mx-auto px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <SectionTitle title="Book Library" subtitle="Recommended Resources" />

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search by title, author, or ISBN..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                        />
                        <Search className="absolute right-4 top-4 text-gray-400" size={20} />
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-orange-600" size={48} />
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <AnimatePresence mode="popLayout">
                                {books.map((book, index) => (
                                    <motion.div
                                        key={book.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="flex flex-col h-full group">
                                            <div
                                                className="h-72 overflow-hidden bg-gray-200 relative cursor-pointer"
                                                onClick={() => window.location.href = `/library/${book.id}`}
                                            >
                                                <img
                                                    src={book.cover_image || book.image}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                    {book.category || 'Resources'}
                                                </div>
                                            </div>

                                            <div className="p-8 flex flex-col flex-grow">
                                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                                                    {book.title}
                                                </h3>
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">By {book.author}</p>

                                                <div className="flex items-center gap-1 text-yellow-400 mb-8">
                                                    {[1,2,3,4,5].map(i => (
                                                        <Star key={i} size={14} fill={i <= Math.round(book.rating || 5) ? "currentColor" : "none"} className={i > Math.round(book.rating || 5) ? "text-gray-200" : ""} />
                                                    ))}
                                                    <span className="text-gray-400 text-[10px] font-bold ml-2">({book.rating || '5.0'})</span>
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-gray-50">
                                                    <Button
                                                        onClick={() => window.location.href = `/library/${book.id}`}
                                                        variant="secondary"
                                                        className="w-full text-[10px] font-black uppercase tracking-widest border-2 hover:border-orange-600 hover:text-orange-600"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center items-center gap-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-20 hover:text-orange-600 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1 ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-20 hover:text-orange-600 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Footer CTA */}
                <div className="mt-24 bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <BookOpen size={300} className="absolute -bottom-20 -left-20 text-white/5" />
                    <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 relative z-10">Visit Our Bookstore</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-10 relative z-10 font-medium text-lg">
                        Stop by the lobby before or after service to browse our full collection of books, bibles, and study guides.
                    </p>
                    <Button variant="primary" className="relative z-10 !px-12 py-5 shadow-2xl shadow-orange-600/40">Get Directions</Button>
                </div>
            </div>
        </div>
    );
}
