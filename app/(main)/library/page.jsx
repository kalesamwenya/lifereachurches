'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Star, Search, Loader2, ChevronLeft, ChevronRight, Phone, MessageSquare, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://content.lifereachchurch.org';

// --- UI Components ---

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);

const LibrarySkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm flex flex-col h-full">
                <Skeleton className="h-48 sm:h-72 w-full rounded-none" />
                <div className="p-3 sm:p-8 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="hidden sm:block pt-4">
                        <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const styles = variant === 'secondary' 
        ? "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50" 
        : "bg-orange-600 text-white hover:bg-orange-700";
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

export default function LibraryPage() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
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
            // Adding a tiny delay so the transition isn't instant/jittery
            setTimeout(() => setIsLoading(false), 400);
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

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm transition-all"
                        />
                        <Search className="absolute right-4 top-4 text-gray-400" size={20} />
                    </div>
                </div>

                {isLoading ? (
                    <LibrarySkeleton />
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                            <AnimatePresence mode="popLayout">
                                {books.map((book, index) => (
                                    <motion.div
                                        key={book.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <Card className="flex flex-col h-full group border-none sm:border-solid shadow-md sm:shadow-xl">
                                            <div
                                                className="h-48 sm:h-72 overflow-hidden bg-gray-200 relative cursor-pointer rounded-2xl sm:rounded-none"
                                                onClick={() => window.location.href = `/library/${book.id}`}
                                            >
                                                <img
                                                    src={`${API_URL}/${book.cover_url || book.image}`}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="hidden sm:block absolute top-4 left-4 bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                    {book.category || 'Resources'}
                                                </div>
                                            </div>

                                            <div className="p-3 sm:p-8 flex flex-col flex-grow">
                                                <h3 className="text-sm sm:text-xl font-black uppercase tracking-tighter text-gray-900 mb-1 sm:mb-2 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2 italic">
                                                    {book.title}
                                                </h3>
                                                <p className="text-gray-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-2 sm:mb-4">
                                                    By {book.author}
                                                </p>

                                                <div className="hidden sm:block">
                                                    <div className="flex items-center gap-1 text-yellow-400 mb-8">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} size={14} fill={i <= Math.round(book.rating || 5) ? "currentColor" : "none"} className={i > Math.round(book.rating || 5) ? "text-gray-200" : ""} />
                                                        ))}
                                                        <span className="text-gray-400 text-[10px] font-bold ml-2">({book.rating || '5.0'})</span>
                                                    </div>

                                                    <div className="mt-auto pt-6 border-t border-gray-50">
                                                        <Button
                                                            onClick={() => window.location.href = `/library/${book.id}`}
                                                            variant="secondary"
                                                            className="w-full text-[10px] font-black uppercase tracking-widest border-2 hover:border-orange-600 hover:text-orange-600 rounded-xl"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => window.location.href = `/library/${book.id}`}
                                                    className="sm:hidden text-[9px] font-bold text-orange-600 uppercase tracking-tighter text-left"
                                                >
                                                    View Details →
                                                </button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center items-center gap-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                                    className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-20 hover:text-orange-600 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="hidden sm:flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setCurrentPage(i + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                                            className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1 ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                                    className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-20 hover:text-orange-600 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-24 container mx-auto px-6">
                <div className="bg-gray-900 p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Can't find a specific book?</h3>
                        <p className="text-gray-400 mb-10 text-lg">Our library team is ready to assist you in finding the right spiritual resources for your journey.</p>
                        
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <a href="tel:+260972933416" className="w-full sm:w-auto">
                                <Button className="w-full py-5 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                                    <Phone size={16} /> Call Library Desk
                                </Button>
                            </a>
                            <a href="https://wa.me/260972933416" className="w-full sm:w-auto">
                                <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-5 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all">
                                    <MessageSquare size={16} /> WhatsApp Inquiry
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}