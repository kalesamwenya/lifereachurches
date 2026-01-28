'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, CreditCard, Smartphone, CheckCircle, Loader2, Lock, User,
    ArrowRight, ArrowLeft, Heart, Sprout, Globe, HandHeart,
    Coins, AlertCircle, Download
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/lib/api-config';

const GIVING_TYPES = [
    { id: 'tithe', label: 'Tithe', icon: <Coins size={20} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'offering', label: 'Offering', icon: <HandHeart size={20} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'seed', label: 'Seed', icon: <Sprout size={20} />, color: 'bg-green-100 text-green-600' },
    { id: 'partnership', label: 'Partnership', icon: <Heart size={20} />, color: 'bg-red-100 text-red-600' },
    { id: 'missions', label: 'Missions', icon: <Globe size={20} />, color: 'bg-purple-100 text-purple-600' },
];

function GiveModalContent({ isOpen, onClose }) {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        category: '',
        amount: '',
        method: 'mobile_money',
        momo_number: '', // Captured for the STK push/forwarding
        network: 'MTN'   // Default network for Zambia
    });

    // --- AUTO-VERIFY LOGIC ---
    useEffect(() => {
        const transactionId = searchParams.get('transaction_id');
        if (transactionId && isOpen && step !== 5) {
            verifyPayment(transactionId);
        }
    }, [searchParams, isOpen]);

    const verifyPayment = async (id) => {
        setStep(4);
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/giving/verify.php?transaction_id=${id}`);
            if (res.data.status === 'success') {
                setDetails(res.data.details);
                setStep(5);
            } else {
                setError("Payment verification failed.");
                setStep(3);
            }
        } catch (err) {
            setError("Could not verify payment.");
            setStep(3);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!isStep3Valid) return;

        setStep(4);
        setIsLoading(true);
        setError(null);

        try {
            // Forwarding all captured info to the backend
            const payload = {
                name: formData.name,
                contact: formData.contact,
                category: formData.category,
                amount: formData.amount,
                method: formData.method,
                momo_number: formData.momo_number,
                network: formData.network
            };

            const res = await axios.post(`${API_URL}/giving/initialize.php`, payload);
            const paymentLink = res.data?.link;

            if (paymentLink && typeof paymentLink === 'string') {
                window.location.href = paymentLink;
            } else {
                throw new Error("The server did not return a valid payment link.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to start payment process.");
            setStep(3);
        } finally {
            setIsLoading(false);
        }
    };

    const isStep1Valid = formData.name.length > 2 && formData.contact.length > 5;
    const isStep3Valid = formData.method === 'mobile_money'
        ? Number(formData.amount) > 0 && formData.momo_number.length >= 10
        : Number(formData.amount) > 0;

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (isStep1Valid) nextStep();
    };

    const handleCategorySelect = (categoryId) => {
        setFormData(prev => ({ ...prev, category: categoryId }));
        nextStep();
    };

    const reset = () => {
        setStep(1);
        setFormData({ name: '', contact: '', category: '', amount: '', method: 'mobile_money', momo_number: '', network: 'MTN' });
        setError(null);
        setDetails(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 z-20">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Give Online</h2>
                            <div className="flex gap-2 mt-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${step >= i ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                                ))}
                            </div>
                        </div>
                        <button onClick={reset} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-100">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        {step === 1 && (
                            <form onSubmit={handleStep1Submit} className="space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><User size={32} /></div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Your Details</h3>
                                    <p className="text-gray-500 text-sm">Let us know who is giving today.</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50 font-medium" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email or Phone Number</label>
                                    <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50 font-medium" placeholder="john@example.com or 097..." />
                                </div>
                                <button type="submit" disabled={!isStep1Valid} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">Next Step <ArrowRight size={18} /></button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">I am giving...</h3>
                                    <p className="text-gray-500 text-sm">Select the type of offering.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {GIVING_TYPES.map((type) => (
                                        <button key={type.id} onClick={() => handleCategorySelect(type.id)} className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${formData.category === type.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${type.color}`}>{type.icon}</div>
                                            <span className="font-bold text-gray-900 block">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button onClick={prevStep} className="w-full text-gray-500 font-bold py-3 text-sm flex items-center justify-center gap-2 hover:text-gray-900"><ArrowLeft size={16} /> Back</button>
                            </div>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Payment Details</h3>
                                    <p className="text-gray-500 text-sm">Secure offering for <span className="font-bold text-orange-600 capitalize">{GIVING_TYPES.find(t => t.id === formData.category)?.label}</span></p>
                                </div>

                                <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                                    <button type="button" onClick={() => setFormData({...formData, method: 'mobile_money'})} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.method === 'mobile_money' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}><Smartphone size={16} /> Mobile Money</button>
                                    <button type="button" onClick={() => setFormData({...formData, method: 'visa'})} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.method === 'visa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}><CreditCard size={16} /> Card</button>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Amount (ZMW)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">K</span>
                                        <input type="number" required min="1" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none text-2xl font-black text-gray-900" placeholder="0.00" />
                                    </div>
                                </div>

                                {formData.method === 'mobile_money' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Network</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['MTN', 'AIRTEL', 'ZAMTEL'].map(net => (
                                                    <button key={net} type="button" onClick={() => setFormData({...formData, network: net})} className={`py-3 rounded-xl border-2 font-bold transition-all ${formData.network === net ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-400'}`}>{net}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                                            <input type="tel" required value={formData.momo_number} onChange={(e) => setFormData({...formData, momo_number: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 font-mono text-lg" placeholder="097..." />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50">Back</button>
                                    <button type="submit" disabled={isLoading || !isStep3Valid} className="flex-1 bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-xl shadow-orange-600/20">
                                        {isLoading ? <Loader2 className="animate-spin" /> : <><Lock size={16} /> Authorize Payment</>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 4 && (
                            <div className="text-center py-12 animate-in zoom-in-95">
                                <Loader2 size={48} className="mx-auto text-orange-600 animate-spin mb-6" />
                                <h3 className="text-xl font-bold mb-2">Processing Donation...</h3>
                                <p className="text-gray-500 text-sm px-8">Please check your phone for the PIN prompt to complete the transaction.</p>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="text-center py-12 animate-in zoom-in-95">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></motion.div>
                                <h3 className="text-2xl font-bold mb-2 tracking-tight">Thank You, {details?.customer || formData.name.split(' ')[0]}!</h3>
                                <p className="text-gray-500 mb-8 px-6">Your giving of <span className="font-bold text-gray-900">ZMW {details?.amount || formData.amount}</span> has been received.</p>
                                <div className="space-y-4">
                                    {details?.pdf_url && (
                                        <a href={`${API_URL}/${details.pdf_url}`} target="_blank" className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-orange-600/20 uppercase text-xs tracking-widest"><Download size={18} /> Download Receipt</a>
                                    )}
                                    <button onClick={reset} className="w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-gray-800 transition-colors uppercase text-xs tracking-widest">Done</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 border-t border-gray-100 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                        <Lock size={10} /> Secured by LifePay • 256-bit SSL Encrypted
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
export default function GiveModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    
    return (
        <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-12 text-center">
                    <Loader2 size={48} className="mx-auto text-orange-600 animate-spin mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <GiveModalContent isOpen={isOpen} onClose={onClose} />
        </Suspense>
    );
}