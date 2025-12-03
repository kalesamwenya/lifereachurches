'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Camera, Mic, Music, Coffee, Baby,
    Shield, Send, CheckCircle, User, Mail, Phone, Hand,
    X, ArrowRight, ArrowLeft
} from 'lucide-react';

// --- Local Components ---

const SectionTitle = ({ title, subtitle, centered = true }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
        <h3 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-3">{subtitle}</h3>
        <h2 className="text-4xl font-extrabold text-gray-900">{title}</h2>
        <div className={`h-1.5 w-24 bg-orange-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
    </motion.div>
);

const Card = ({ children, className = "", onClick }) => (
    <motion.div
        whileHover={{ y: -5 }}
        onClick={onClick}
        className={`bg-white rounded-3xl shadow-xl shadow-gray-100 overflow-hidden border border-gray-100 ${className}`}
    >
        {children}
    </motion.div>
);

// --- Volunteer Wizard Modal ---

const VolunteerModal = ({ isOpen, onClose, initialDept }) => {
    const [step, setStep] = useState(1); // 1: Contact, 2: Details, 3: Success
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dept: initialDept || '',
        experience: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update formData when initialDept changes
    useEffect(() => {
        if (initialDept) {
            setFormData(prev => ({ ...prev, dept: initialDept }));
        }
    }, [initialDept]);

    const handleNext = (e) => {
        e.preventDefault();
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3);
        }, 2000);
    };

    const reset = () => {
        setStep(1);
        setFormData({ name: '', email: '', phone: '', dept: '', experience: '' });
        setIsSubmitting(false);
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
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Join the Team</h2>
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
                        {/* Step 1: Contact Info */}
                        {step === 1 && (
                            <form onSubmit={handleNext} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Let's Get Started</h3>
                                    <p className="text-gray-500">First, tell us a little about yourself.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <User size={16} className="text-orange-500" /> Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail size={16} className="text-orange-500" /> Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone size={16} className="text-orange-500" /> Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                        placeholder="097..."
                                    />
                                </div>

                                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {/* Step 2: Service Details */}
                        {step === 2 && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Your Interest</h3>
                                    <p className="text-gray-500">Where would you like to serve?</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Heart size={16} className="text-orange-500" /> Department
                                    </label>
                                    <select
                                        required
                                        value={formData.dept}
                                        onChange={(e) => setFormData({...formData, dept: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 appearance-none"
                                    >
                                        <option value="" disabled>Select a department...</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Experience / Notes (Optional)</label>
                                    <textarea
                                        rows="4"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                        placeholder="I have experience with..."
                                    ></textarea>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="px-6 py-4 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50">
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Sending...' : <><Send size={18} /> Submit Application</>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <div className="text-center py-8">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h3>
                                <p className="text-gray-600 text-lg mb-8">
                                    Thanks for signing up, {formData.name.split(' ')[0]}! A team leader from <span className="font-bold text-orange-600">{departments.find(d => d.id === formData.dept)?.title}</span> will contact you shortly.
                                </p>
                                <button onClick={reset} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800">
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Mock Data ---

const departments = [
    { id: 'worship', title: "Worship & Creative", desc: "Musicians, vocalists, and artists who lead us into God's presence.", icon: <Music size={32} /> },
    { id: 'media', title: "Media & Tech", desc: "Camera operators, sound engineers, and lighting technicians.", icon: <Camera size={32} /> },
    { id: 'kids', title: "Reach Kids", desc: "Teachers and helpers raising up the next generation.", icon: <Baby size={32} /> },
    { id: 'hospitality', title: "Hospitality", desc: "Ushers, greeters, and café team making everyone feel at home.", icon: <Coffee size={32} /> },
    { id: 'security', title: "Security", desc: "Keeping our environments safe and secure for everyone.", icon: <Shield size={32} /> },
    { id: 'outreach', title: "Outreach", desc: "Serving our city and community through practical love.", icon: <Hand size={32} /> },
];

export default function VolunteerPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');

    const handleDeptClick = (id) => {
        setSelectedDept(id);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">

            {/* Hero Section */}
            <div className="container mx-auto px-6 mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
          <span className="inline-block py-2 px-4 rounded-full bg-orange-100 text-orange-600 font-bold uppercase tracking-widest text-xs mb-6">
            Join the Team
          </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8">Serve With Us</h1>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        We believe that saved people serve people. Whether you're great with kids, tech-savvy, or just love making coffee, there's a place for you to make a difference.
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-6">
                {/* Departments Grid */}
                <SectionTitle title="Find Your Fit" subtitle="Opportunities" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {departments.map((dept, idx) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => handleDeptClick(dept.id)}
                            className="cursor-pointer group"
                        >
                            <Card className="p-8 h-full transition-all group-hover:border-orange-200 group-hover:shadow-2xl hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    {dept.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{dept.title}</h3>
                                <p className="text-gray-500 mb-6">{dept.desc}</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all">
                                    Join Team <ArrowRight size={16} />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* General Application CTA */}
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Don't see a specific fit?</p>
                    <button
                        onClick={() => handleDeptClick('')}
                        className="text-gray-900 font-bold border-b-2 border-orange-500 hover:text-orange-600 transition-colors"
                    >
                        Complete a General Application
                    </button>
                </div>
            </div>

            {/* Volunteer Wizard Modal */}
            <VolunteerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialDept={selectedDept}
            />
        </div>
    );
}