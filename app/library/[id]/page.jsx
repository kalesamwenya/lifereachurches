'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Download, ShoppingBag, Star, BookOpen,
    CheckCircle, Lock, Loader2, Smartphone, CreditCard, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Book Data ---
const bookData = {
    id: 1,
    title: "Purpose Driven Life",
    author: "Rick Warren",
    price: 250.00,
    category: "Spiritual Growth",
    rating: 4.8,
    reviews: 124,
    pages: 368,
    language: "English",
    description: "You are not an accident. Even before the universe was created, God had you in mind, and he planned you for his purposes. These purposes will extend far beyond the few years you will spend on earth. You were made by God and for God, and until you understand that, life will never make sense.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
};

// --- Internal Components ---

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

// --- Payment Modal Component ---
const PaymentModal = ({ isOpen, onClose, item, onSuccess }) => {
    const [step, setStep] = useState('method'); // method, form, processing, success
    const [method, setMethod] = useState(null); // mobile_money, visa

    const handlePay = (e) => {
        e.preventDefault();
        setStep('processing');
        // Simulate API Payment Delay
        setTimeout(() => {
            setStep('success');
            if (onSuccess) onSuccess();
        }, 2500);
    };

    const reset = () => {
        setStep('method');
        setMethod(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Checkout</h3>
                            <p className="text-sm text-gray-500">{item.title}</p>
                        </div>
                        <button onClick={reset} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Step 1: Select Method */}
                        {step === 'method' && (
                            <div className="space-y-4">
                                <p className="font-bold text-gray-900 mb-4">Select Payment Method</p>

                                <button
                                    onClick={() => { setMethod('mobile_money'); setStep('form'); }}
                                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                                        <Smartphone size={24} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold text-gray-900">Mobile Money</span>
                                        <span className="text-xs text-gray-500">Airtel, MTN, Zamtel</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setMethod('visa'); setStep('form'); }}
                                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold text-gray-900">Credit / Debit Card</span>
                                        <span className="text-xs text-gray-500">Visa, Mastercard</span>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Input Details */}
                        {step === 'form' && (
                            <form onSubmit={handlePay} className="space-y-5">
                                <div className="flex items-center justify-between mb-2">
                                    <button type="button" onClick={() => setStep('method')} className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1"><ArrowLeft size={12}/> Change Method</button>
                                    <span className="text-sm font-black text-gray-900">ZMW {item.price.toFixed(2)}</span>
                                </div>

                                {method === 'mobile_money' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400 font-medium">+260</span>
                                            <input type="tel" required placeholder="97 123 4567" className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none font-bold text-gray-900" />
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            {['Airtel', 'MTN', 'Zamtel'].map(p => (
                                                <span key={p} className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Card Number</label>
                                            <input type="text" required placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-900" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Expiry</label>
                                                <input type="text" required placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-900" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">CVC</label>
                                                <input type="text" required placeholder="123" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-gray-900" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button className={`w-full ${method === 'mobile_money' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    Pay ZMW {item.price.toFixed(2)}
                                </Button>

                                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                                    <Lock size={10} /> Secure Encrypted Transaction
                                </p>
                            </form>
                        )}

                        {/* Step 3: Processing */}
                        {step === 'processing' && (
                            <div className="text-center py-10">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                                <p className="text-gray-500 text-sm max-w-[200px] mx-auto">
                                    {method === 'mobile_money' ? 'Please check your phone to confirm the transaction.' : 'Contacting your bank...'}
                                </p>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {step === 'success' && (
                            <div className="text-center py-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle size={48} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h3>
                                <p className="text-gray-500 mb-8">You now have full access to this book.</p>
                                <Button onClick={reset} className="w-full bg-gray-900 hover:bg-gray-800">
                                    Access My Book
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Main Page Component ---

export default function BookDetailPage({ params }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    // In a real app, you would fetch book data using params.id
    // const { id } = params;

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            {/* Back Navigation */}
            <div className="container mx-auto px-6 mb-8">
                <a href="/library" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold transition-colors">
                    <ArrowLeft size={20} /> Back to Library
                </a>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 relative group">
                            <img src={bookData.image} alt={bookData.title} className="w-full h-full object-cover" />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        </div>

                        {/* Quick Stats Overlay */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                            <div className="flex gap-8 text-center">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rating</p>
                                    <div className="flex items-center gap-1 font-black text-xl text-gray-900">
                                        <Star size={18} className="text-yellow-400 fill-yellow-400" /> {bookData.rating}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pages</p>
                                    <p className="font-black text-xl text-gray-900">{bookData.pages}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Language</p>
                                    <p className="font-black text-xl text-gray-900">{bookData.language}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-center"
                    >
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full w-fit mb-6">
              {bookData.category}
            </span>

                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{bookData.title}</h1>
                        <p className="text-xl text-gray-500 font-medium mb-8">By {bookData.author}</p>

                        <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
                            <h2 className="text-4xl font-black text-orange-600">ZMW {bookData.price.toFixed(2)}</h2>
                            <span className="text-gray-400 mb-2 line-through font-medium">ZMW 350.00</span>
                        </div>

                        <div className="mb-10">
                            <h3 className="font-bold text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{bookData.description}</p>
                        </div>

                        {hasPurchased ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8">
                                <div className="flex items-center gap-3 text-green-700 font-bold mb-4">
                                    <CheckCircle size={24} /> You own this book
                                </div>
                                <div className="flex gap-4">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                        <Download size={20} /> Download PDF
                                    </Button>
                                    <Button variant="secondary" className="flex-1">
                                        <BookOpen size={20} /> Read Online
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Button onClick={() => setIsModalOpen(true)} className="flex-1 py-4 text-lg">
                                        <ShoppingBag size={20} /> Buy Now
                                    </Button>
                                    <Button variant="secondary" className="flex-1 py-4 text-lg">
                                        <Download size={20} /> Free Sample
                                    </Button>
                                </div>
                                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-2">
                                    <Lock size={12} /> Secure Payment via Mobile Money or Visa
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={bookData}
                onSuccess={() => {
                    setHasPurchased(true);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}