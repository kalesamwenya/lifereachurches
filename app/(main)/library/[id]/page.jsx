'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
    ArrowLeft, Download, ShoppingBag, Star, BookOpen,
    CheckCircle, Lock, Loader2, Smartphone, CreditCard, X, User, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api-config';

// --- Internal Components (Design Strictly Preserved) ---

const Button = ({ children, variant = 'primary', className = '', onClick, disabled }) => {
    const base = "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const styles = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900"
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
            {children}
        </button>
    );
};

// --- Payment Modal Component (Design Strictly Preserved) ---
const PaymentModal = ({ isOpen, onClose, item, onSuccess }) => {
    const [step, setStep] = useState('details');
    const [method, setMethod] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleDetailsSubmit = (e) => { e.preventDefault(); setStep('method'); };

    const handlePay = (e) => {
        e.preventDefault();
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            if (onSuccess) onSuccess();
        }, 2500);
    };

    const reset = () => {
        setStep('details');
        setMethod(null);
        setFormData({ name: '', email: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Checkout</h3>
                            <p className="text-sm text-gray-500">{item.title}</p>
                        </div>
                        <button onClick={reset} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                    </div>

                    <div className="p-8">
                        {step === 'details' && (
                            <form onSubmit={handleDetailsSubmit} className="space-y-5">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><User size={32} /></div>
                                    <h3 className="text-xl font-bold text-gray-900">Your Info</h3>
                                    <p className="text-gray-500 text-sm">Where should we send your receipt?</p>
                                </div>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                <Button className="w-full mt-4">Continue to Payment <ArrowRight size={18} /></Button>
                            </form>
                        )}

                        {step === 'method' && (
                            <div className="space-y-4">
                                <button onClick={() => { setMethod('mobile_money'); setStep('form'); }} className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-yellow-500 hover:bg-yellow-50 transition-all group">
                                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center"><Smartphone size={24} /></div>
                                    <div className="text-left"><span className="block font-bold text-gray-900">Mobile Money</span><span className="text-xs text-gray-500">Airtel, MTN, Zamtel</span></div>
                                </button>
                                <button onClick={() => { setMethod('visa'); setStep('form'); }} className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><CreditCard size={24} /></div>
                                    <div className="text-left"><span className="block font-bold text-gray-900">Credit / Debit Card</span><span className="text-xs text-gray-500">Visa, Mastercard</span></div>
                                </button>
                            </div>
                        )}

                        {step === 'form' && (
                            <form onSubmit={handlePay} className="space-y-5">
                                <div className="text-sm font-black text-gray-900 mb-4">ZMW {parseFloat(item.price).toFixed(2)}</div>
                                <input type="tel" required placeholder={method === 'mobile_money' ? "97 123 4567" : "Card Number"} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                                <Button className={`w-full ${method === 'mobile_money' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>Pay Now</Button>
                            </form>
                        )}

                        {step === 'processing' && (
                            <div className="text-center py-10">
                                <Loader2 className="animate-spin mx-auto mb-4 text-orange-500" size={40} />
                                <h3 className="font-bold text-gray-900">Processing...</h3>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-6">
                                <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-black">Success!</h3>
                                <Button onClick={reset} className="w-full mt-6 bg-gray-900">Access My Book</Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Main Page Component ---

export default function BookDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [bookData, setBookData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`${API_URL}/library/get_one.php?id=${id}`);
                setBookData(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBook();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 size={48} className="text-orange-600 animate-spin" />
        </div>
    );

    if (!bookData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-32 text-center">
            <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
            <Button onClick={() => router.push('/library')} variant="secondary">Return to Library</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            {/* Back Navigation */}
            <div className="container mx-auto px-6 mb-8">
                <button onClick={() => router.push('/library')} className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold transition-colors">
                    <ArrowLeft size={20} /> Back to Library
                </button>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left Column: Image */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 relative group">
                            {/* Uses cover_image from DB or image fallback */}
                            <img src={bookData.cover_image || bookData.image} alt={bookData.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        </div>

                        {/* Quick Stats Overlay */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                            <div className="flex gap-8 text-center">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rating</p>
                                    <div className="flex items-center gap-1 font-black text-xl text-gray-900">
                                        <Star size={18} className="text-yellow-400 fill-yellow-400" /> {bookData.rating || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pages</p>
                                    <p className="font-black text-xl text-gray-900">{bookData.pages || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Details */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full w-fit mb-6">
                            {bookData.category}
                        </span>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{bookData.title}</h1>
                        <p className="text-xl text-gray-500 font-medium mb-8">By {bookData.author}</p>

                        <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
                            <h2 className="text-4xl font-black text-orange-600">ZMW {parseFloat(bookData.price).toFixed(2)}</h2>
                        </div>

                        <div className="mb-10">
                            <h3 className="font-bold text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{bookData.description}</p>
                        </div>

                        {hasPurchased ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8">
                                <div className="flex items-center gap-3 text-green-700 font-bold mb-4"><CheckCircle size={24} /> You own this book</div>
                                <div className="flex gap-4">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"><Download size={20} /> Download PDF</Button>
                                    <Button variant="secondary" className="flex-1"><BookOpen size={20} /> Read Online</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Button onClick={() => setIsModalOpen(true)} className="flex-1 py-4 text-lg"><ShoppingBag size={20} /> Buy Now</Button>
                                    <Button variant="secondary" className="flex-1 py-4 text-lg">Free Sample</Button>
                                </div>
                                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-2"><Lock size={12} /> Secure Payment via Mobile Money or Visa</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {bookData && (
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={bookData}
                    onSuccess={() => { setHasPurchased(true); setIsModalOpen(false); }}
                />
            )}
        </div>
    );
}