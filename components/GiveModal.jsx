'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, CheckCircle, Loader2, Lock, User, ArrowRight, ArrowLeft, Heart, Sprout, Globe, HandHeart, Coins } from 'lucide-react';

const GIVING_TYPES = [
    { id: 'tithe', label: 'Tithe', icon: <Coins size={20} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'offering', label: 'Offering', icon: <HandHeart size={20} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'seed', label: 'Seed', icon: <Sprout size={20} />, color: 'bg-green-100 text-green-600' },
    { id: 'partnership', label: 'Partnership', icon: <Heart size={20} />, color: 'bg-red-100 text-red-600' },
    { id: 'missions', label: 'Missions', icon: <Globe size={20} />, color: 'bg-purple-100 text-purple-600' },
];

export default function GiveModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1); // 1: Details, 2: Category, 3: Payment, 4: Processing, 5: Success
    const [formData, setFormData] = useState({
        name: '',
        contact: '', // Email or Phone
        category: '',
        amount: '',
        method: 'mobile_money' // mobile_money or visa
    });

    const handleNext = (e) => {
        e.preventDefault();
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(4); // Processing

        // Simulate API call
        setTimeout(() => {
            setStep(5); // Success
        }, 2000);
    };

    const reset = () => {
        setStep(1);
        setFormData({ name: '', contact: '', category: '', amount: '', method: 'mobile_money' });
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
                    className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Give Online</h2>
                            <div className="flex gap-2 mt-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                                ))}
                            </div>
                        </div>
                        <button onClick={reset} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto">

                        {/* STEP 1: Personal Details */}
                        {step === 1 && (
                            <form onSubmit={handleNext} className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Your Details</h3>
                                    <p className="text-gray-500 text-sm">Let us know who is giving today.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email or Phone Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contact}
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50"
                                        placeholder="john@example.com or 097..."
                                    />
                                </div>

                                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {/* STEP 2: Category Selection */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">I am giving...</h3>
                                    <p className="text-gray-500 text-sm">Select the type of offering.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {GIVING_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setFormData({...formData, category: type.id});
                                                handleNext({ preventDefault: () => {} });
                                            }}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${formData.category === type.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${type.color}`}>
                                                {type.icon}
                                            </div>
                                            <span className="font-bold text-gray-900 block">{type.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button onClick={handleBack} className="w-full text-gray-500 font-bold py-3 text-sm flex items-center justify-center gap-2 hover:text-gray-900">
                                    <ArrowLeft size={16} /> Back
                                </button>
                            </div>
                        )}

                        {/* STEP 3: Payment Details */}
                        {step === 3 && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Payment</h3>
                                    <p className="text-gray-500 text-sm">Secure transaction for <span className="font-bold text-orange-600 capitalize">{formData.category}</span></p>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Amount (ZMW)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">K</span>
                                        <input
                                            type="number"
                                            required
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none text-2xl font-black text-gray-900"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Payment Method Tabs */}
                                <div className="bg-gray-100 p-1 rounded-xl flex">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, method: 'mobile_money'})}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.method === 'mobile_money' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <Smartphone size={16} /> Mobile Money
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, method: 'visa'})}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.method === 'visa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <CreditCard size={16} /> Card
                                    </button>
                                </div>

                                {/* Method Specific Inputs */}
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    {formData.method === 'mobile_money' ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mobile Number</label>
                                                <div className="flex">
                                                    <span className="bg-white border border-r-0 border-gray-200 rounded-l-xl px-3 flex items-center text-gray-500 font-bold text-sm">+260</span>
                                                    <input type="tel" required placeholder="97 123 4567" className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-center">
                                                <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">MTN</span>
                                                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded">Airtel</span>
                                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Zamtel</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Card Number</label>
                                                <input type="text" required placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="text" required placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                                <input type="text" required placeholder="CVC" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="px-6 py-4 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50">
                                        Back
                                    </button>
                                    <button type="submit" className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                                        <Lock size={16} /> Give Now
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* STEP 4: Processing */}
                        {step === 4 && (
                            <div className="text-center py-12">
                                <Loader2 size={48} className="mx-auto text-orange-600 animate-spin mb-6" />
                                <h3 className="text-xl font-bold mb-2">Processing Donation...</h3>
                                <p className="text-gray-500 text-sm">Please follow the instructions on your device.</p>
                            </div>
                        )}

                        {/* STEP 5: Success */}
                        {step === 5 && (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-2">Thank You, {formData.name}!</h3>
                                <p className="text-gray-500 mb-8">Your {formData.category} of ZMW {formData.amount} has been received.</p>
                                <button onClick={reset} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl">Done</button>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t border-gray-100">
                        Secured by LifePay • SSL Encrypted
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}