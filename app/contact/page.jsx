'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [activeTab, setActiveTab] = useState('general'); // general or prayer

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
                                        <p className="text-gray-600">123 Life Reach Blvd<br/>Springfield, ST 12345</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Call Us</h4>
                                        <p className="text-gray-600">(555) 123-4567</p>
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
                                    onClick={() => setActiveTab('general')}
                                    className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'general' ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    General Inquiry
                                </button>
                                <button
                                    onClick={() => setActiveTab('prayer')}
                                    className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'prayer' ? 'bg-orange-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    Prayer Request
                                </button>
                            </div>

                            <div className="p-8 md:p-12">
                                {activeTab === 'general' ? (
                                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                            <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50"></textarea>
                                        </div>
                                        <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                            <Send size={18} /> Send Message
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6 flex gap-4">
                                            <MessageSquare className="text-orange-600 flex-shrink-0" />
                                            <p className="text-sm text-gray-700">Our team prays over every request every week. You are not alone.</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name (Optional)</label>
                                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone (Optional)</label>
                                                <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">How can we pray for you?</label>
                                            <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50" placeholder="Share your request..."></textarea>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="confidential" className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                                            <label htmlFor="confidential" className="text-sm text-gray-600">Keep confidential (Pastors only)</label>
                                        </div>
                                        <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                                            <Send size={18} /> Submit Prayer Request
                                        </button>
                                    </motion.form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}