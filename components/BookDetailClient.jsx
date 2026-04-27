'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
    ArrowLeft, Download, ShoppingBag, Star, BookOpen, 
    CheckCircle, Lock, Loader2, Smartphone, CreditCard, X, User, ArrowRight, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://content.lifereachchurch.org';

// --- UI Components ---

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);

const Button = ({ children, variant = 'primary', className = '', onClick, disabled, type = "button" }) => {
    const base = "px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50";
    const styles = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20",
        secondary: "bg-white text-gray-900 border-2 border-gray-100 hover:border-orange-600 hover:text-orange-600",
        outline: "bg-transparent border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
            {children}
        </button>
    );
};

// --- Payment Modal ---

const PaymentModal = ({ isOpen, onClose, item, onSuccess }) => {
    const [step, setStep] = useState('details');
    const [formData, setFormData] = useState({ name: '', email: '' });
    const isFree = !item.price || parseFloat(item.price) === 0;

    if (!isOpen) return null;

    const handleFinalize = async (e) => {
        e.preventDefault();
        setStep('processing');
        try {
            const res = await axios.post(`${API_URL}/library/purchase_book.php`, {
                book_id: item.id,
                email: formData.email,
                name: formData.name
            });
            if (res.data.success) {
                setStep('success');
                onSuccess(formData.email);
            }
        } catch (err) {
            alert("Error processing request");
            setStep('details');
        }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Checkout</h3>
                            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
                        </div>

                        {step === 'details' && (
                            <form onSubmit={handleFinalize} className="space-y-4">
                                <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
                                <input required type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
                                <Button type="submit" className="w-full py-5">{isFree ? 'Get Free Access' : 'Proceed to Pay'}</Button>
                            </form>
                        )}

                        {step === 'processing' && (
                            <div className="py-12 text-center">
                                <Loader2 className="animate-spin mx-auto text-orange-600 mb-4" size={40} />
                                <p className="font-bold text-gray-500">Securing your copy...</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="py-8 text-center">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40}/></div>
                                <h4 className="text-2xl font-black uppercase italic mb-2">Success!</h4>
                                <p className="text-gray-500 mb-8">Your book is ready for download.</p>
                                <Button onClick={onClose} className="w-full bg-gray-900">Finish</Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Main Client Component ---

export default function BookDetailClient({ id }) {
    const router = useRouter();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/library/get_one.php?id=${id}`)
            .then(res => setBook(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    const handleShare = async () => {
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: `Check out this book: ${book.title}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        </div>
    );

    const isFree = !book?.price || parseFloat(book.price) === 0;

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="container mx-auto px-6 mb-12 flex justify-between items-center">
                <button onClick={() => router.back()} className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-orange-600 transition-colors">
                    <ArrowLeft size={16} /> Back to Library
                </button>
                <button onClick={handleShare} className="p-4 bg-gray-50 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all border border-gray-100">
                    <Share2 size={20} />
                </button>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
                        <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 border-8 border-white">
                            <img src={`${API_URL}/${book.cover_url || book.image}`} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                        <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                            {book.category || 'Resource'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 mb-4 leading-[0.9]">
                            {book.title}
                        </h1>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs mb-10">By {book.author}</p>
                        
                        <div className="text-4xl font-black text-orange-600 mb-10 italic">
                            {isFree ? 'FREE' : `ZMW ${parseFloat(book.price).toFixed(2)}`}
                        </div>

                        <div className="prose prose-orange mb-12">
                            <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-900 mb-4">Synopsis</h4>
                            <p className="text-gray-500 leading-relaxed">{book.description}</p>
                        </div>

                        {hasPurchased ? (
                            <div className="flex gap-4">
                                <Button onClick={() => window.location.href = `${API_URL}/library/download_book.php?id=${id}&email=${userEmail}`} className="flex-1 py-6">
                                    <Download size={20}/> Download PDF
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={() => setIsModalOpen(true)} className="flex-1 py-6">
                                    {isFree ? 'Get for Free' : 'Purchase Book'}
                                </Button>
                                <Button variant="secondary" onClick={handleShare} className="flex-1 py-6">
                                    <Share2 size={20}/> Share Book
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={book} onSuccess={(email) => { setUserEmail(email); setHasPurchased(true); }} />
        </div>
    );
}