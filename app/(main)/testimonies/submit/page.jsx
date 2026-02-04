'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, MessageCircle, Send, CheckCircle, ArrowLeft, X } from 'lucide-react';
import axios from "axios";
import { useAuth } from '@/context/AuthContext';

const API_URL = 'https://content.lifereachchurch.org';

// --- SweetAlert Style Modal ---
const SwalModal = ({ isOpen, onClose }) => {
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
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative text-center p-8"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle size={40} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 mb-8">
                        Your testimony has been submitted successfully. We can't wait to read how God is moving in your life!
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
                    >
                        Continue
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default function TestimonySubmitPage() {
    const { user, isAuthenticated } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
        source: '',
        testimony: '',
        memberType: 'visitor'
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            const fullName = `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim();
            setFormData((prev) => ({
                ...prev,
                name: fullName || prev.name,
                contact: user.email || user.phone || prev.contact,
                memberType: 'member'
            }));
        }
    }, [isAuthenticated, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name,
                contact: formData.contact,
                location: formData.location,
                source: formData.source,
                testimony: formData.testimony,
                is_member: formData.memberType === 'member' ? 1 : 0,
                member_id: formData.memberType === 'member' ? (user?.id || null) : null
            };
            // Real API call to your PHP backend
            const response = await axios.post(`${API_URL}/testimonies/submit.php`, payload);

            if (response.data.status === 'success') {
                setIsSubmitting(false);
                setShowSuccess(true);
                setFormData((prev) => ({
                    name: isAuthenticated ? prev.name : '',
                    contact: isAuthenticated ? prev.contact : '',
                    location: '',
                    source: '',
                    testimony: '',
                    memberType: isAuthenticated ? 'member' : 'visitor'
                })); // Reset form
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error("Submission error:", error);
            alert(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        window.location.href = '/'; // Redirect home after closing
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Back Link */}
                <a href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </a>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Improved Grid System: 2/5 Banner, 3/5 Form */}
                    <div className="grid lg:grid-cols-5">

                        {/* Header Banner - Centered Content */}
                        <div className="lg:col-span-2 bg-gray-900 text-white p-10 md:p-16 text-center relative overflow-hidden flex flex-col justify-center items-center h-full">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                            <div className="relative z-10">
                       <span className="inline-block py-1 px-3 rounded-full bg-orange-600/20 border border-orange-500/50 text-orange-300 font-bold uppercase tracking-widest text-xs mb-4">
                          Share Your Story
                       </span>
                                <h1 className="text-4xl md:text-5xl font-black mb-4">Testimony Submission</h1>
                                <p className="text-gray-300 text-lg max-w-xl mx-auto">
                                    "They triumphed over him by the blood of the Lamb and by the word of their testimony." - Rev 12:11
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-3 p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Personal Info Grid */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <User size={16} className="text-orange-500" /> Member or Visitor
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${formData.memberType === 'member' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'} cursor-pointer`}
                                                   aria-disabled={isAuthenticated}
                                            >
                                                <input
                                                    type="radio"
                                                    name="memberType"
                                                    value="member"
                                                    checked={formData.memberType === 'member'}
                                                    disabled={isAuthenticated}
                                                    onChange={(e) => setFormData({...formData, memberType: e.target.value})}
                                                    className="accent-orange-600"
                                                />
                                                <span className="text-sm font-bold text-gray-700">Member</span>
                                            </label>
                                            <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${formData.memberType === 'visitor' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'} cursor-pointer`}
                                                   aria-disabled={isAuthenticated}
                                            >
                                                <input
                                                    type="radio"
                                                    name="memberType"
                                                    value="visitor"
                                                    checked={formData.memberType === 'visitor'}
                                                    disabled={isAuthenticated}
                                                    onChange={(e) => setFormData({...formData, memberType: e.target.value})}
                                                    className="accent-orange-600"
                                                />
                                                <span className="text-sm font-bold text-gray-700">Visitor</span>
                                            </label>
                                            {isAuthenticated && (
                                                <span className="text-xs text-gray-500 self-center">Signed in members are recorded as members automatically.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <User size={16} className="text-orange-500" /> Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <Mail size={16} className="text-orange-500" /> Email or Phone
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <MapPin size={16} className="text-orange-500" /> Location / Address
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                            placeholder="Lusaka, Zambia"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <MessageCircle size={16} className="text-orange-500" /> Where did you hear about us?
                                        </label>
                                        <select
                                            value={formData.source}
                                            onChange={(e) => setFormData({...formData, source: e.target.value})}
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                                        >
                                            <option value="" disabled>Select an option (Optional)</option>
                                            <option value="Friend/Family">Friend or Family</option>
                                            <option value="Social Media">Social Media</option>
                                            <option value="Event">Church Event</option>
                                            <option value="Online Search">Online Search</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Testimony Area */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Your Testimony</label>
                                    <div className="relative">
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.testimony}
                                    onChange={(e) => setFormData({...formData, testimony: e.target.value})}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                    placeholder="Share what God has done..."
                                ></textarea>
                                        <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
                                            {formData.testimony.length} chars
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        * By submitting, you agree that we may share your story to encourage others.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-orange-600 text-white font-bold py-5 rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        'Submitting...'
                                    ) : (
                                        <>Submit Testimony <Send size={20} /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SwalModal isOpen={showSuccess} onClose={handleCloseSuccess} />
        </div>
    );
}
