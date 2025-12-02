'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, CheckCircle, Loader2, Lock } from 'lucide-react';

export default function GiveModal({ isOpen, onClose }) {
    const [step, setStep] = useState('select'); // select, form, processing, success
    const [method, setMethod] = useState(null); // mobile_money, visa
    const [amount, setAmount] = useState('');

    const handlePayment = (e) => {
        e.preventDefault();
        setStep('processing');
        // Simulate API call
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const reset = () => {
        setStep('select');
        setMethod(null);
        setAmount('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
                >
                    <button onClick={reset} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>

                    <div className="p-8">
                        <h2 className="text-2xl font-black text-center mb-2">Give Online</h2>
                        <p className="text-gray-500 text-center mb-8 text-sm">Secure 256-bit encrypted donation</p>

                        {step === 'select' && (
                            <div className="grid gap-4">
                                <button
                                    onClick={() => { setMethod('mobile_money'); setStep('form'); }}
                                    className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Smartphone size={24} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold text-gray-900">Mobile Money</span>
                                        <span className="text-xs text-gray-500">Airtel, MTN, Zamtel</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setMethod('visa'); setStep('form'); }}
                                    className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold text-gray-900">Card Payment</span>
                                        <span className="text-xs text-gray-500">Visa, Mastercard</span>
                                    </div>
                                </button>
                            </div>
                        )}

                        {step === 'form' && (
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Amount (ZMW)</label>
                                    <input
                                        type="number"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none text-lg font-bold"
                                        placeholder="0.00"
                                    />
                                </div>

                                {method === 'mobile_money' ? (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" required placeholder="097xxxxxxx" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
                                            <input type="text" required placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" required placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                            <input type="text" required placeholder="CVC" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 mt-4">
                                    <Lock size={16} /> Donate Now
                                </button>
                                <button type="button" onClick={() => setStep('select')} className="w-full text-gray-500 text-sm py-2 hover:text-gray-900">Back to options</button>
                            </form>
                        )}

                        {step === 'processing' && (
                            <div className="text-center py-8">
                                <Loader2 size={48} className="mx-auto text-orange-600 animate-spin mb-4" />
                                <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
                                <p className="text-gray-500 text-sm">Please check your phone for the prompt.</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                                <p className="text-gray-500 mb-6">Your generosity is changing lives.</p>
                                <button onClick={reset} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl">Close</button>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                        Powered by LifePay Secure System
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}