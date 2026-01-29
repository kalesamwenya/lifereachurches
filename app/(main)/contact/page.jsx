'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://content.lifereachchurch.org';

export default function ContactPage() {
    const [activeTab, setActiveTab] = useState('general'); // general or prayer
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        is_confidential: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/messages/send.php`, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                type: activeTab, // 'general' or 'prayer'
                is_confidential: formData.is_confidential ? 1 : 0
            });
            setIsSuccess(true);
            // Clear form
            setFormData({ first_name: '', last_name: '', email: '', phone: '', message: '', is_confidential: false });
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err) {
            alert("Error sending message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-24 bg-white pt-32">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
                    <p className="text-xl text-gray-500">We'd love to hear from you. How can we help?</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Visit Us</h4>
                                        <p className="text-gray-600">123 Life Reach Blvd<br/>Lusaka, Zambia</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Call Us</h4>
                                        <p className="text-gray-600">0972338115</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email Us</h4>
                                        <p className="text-gray-600">hello@lifereach.church</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Forms */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => { setActiveTab('general'); setIsSuccess(false); }}
                                    className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'general' ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    General Inquiry
                                </button>
                                <button
                                    onClick={() => { setActiveTab('prayer'); setIsSuccess(false); }}
                                    className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'prayer' ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    Prayer Request
                                </button>
                            </div>

                            <div className="p-8 md:p-12 relative">
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-12 text-center"
                                        >
                                            <CheckCircle size={64} className="text-green-500 mb-4" />
                                            <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                                            <p className="text-gray-500">Thank you for reaching out to Life Reach Church.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key={activeTab}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            {activeTab === 'prayer' && (
                                                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6 flex gap-4">
                                                    <MessageSquare className="text-orange-600 flex-shrink-0" />
                                                    <p className="text-sm text-gray-700">Our team prays over every request every week. You are not alone.</p>
                                                </div>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                                    <input required type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                                    <input required type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    {activeTab === 'general' ? 'Message' : 'How can we pray for you?'}
                                                </label>
                                                <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" placeholder={activeTab === 'prayer' ? "Share your request..." : ""}></textarea>
                                            </div>

                                            {activeTab === 'prayer' && (
                                                <div className="flex items-center gap-3">
                                                    <input type="checkbox" id="confidential" checked={formData.is_confidential} onChange={(e) => setFormData({...formData, is_confidential: e.target.checked})} className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                                                    <label htmlFor="confidential" className="text-sm text-gray-600">Keep confidential (Pastors only)</label>
                                                </div>
                                            )}

                                            <button
                                                disabled={isLoading}
                                                className={`w-full text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${activeTab === 'general' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-orange-600 hover:bg-orange-700'}`}
                                            >
                                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> {activeTab === 'general' ? 'Send Message' : 'Submit Prayer Request'}</>}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}