'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api-config';

export default function PlanVisitPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        visit_date: '',
        bringing_kids: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post(`${API_URL}/inbox/messages.php`, {
                type: 'visit',
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                subject: `New Visit Planned`,
                visit_date: formData.visit_date,
                message: `Bringing Kids: ${formData.bringing_kids ? 'Yes' : 'No'}`
            });

            setIsSuccess(true);
        } catch (err) {
            alert("Connection error. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setIsSuccess(false);
        setFormData({ first_name: '', last_name: '', email: '', phone: '', visit_date: '', bringing_kids: false });
    };

    return (
        <div className="py-24 bg-gray-50 pt-32 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter">Plan Your Visit</h1>
                    <p className="text-xl text-gray-600">Let us know you're coming and we'll roll out the red carpet.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-5 min-h-[500px]">
                        {/* Info Sidebar */}
                        <div className="md:col-span-2 bg-orange-600 p-8 text-white flex flex-col justify-center">
                            <h3 className="text-2xl font-black uppercase italic mb-6">What to expect:</h3>
                            <ul className="space-y-6">
                                <ExpectationItem text="A reserved parking spot just for you." />
                                <ExpectationItem text="A friendly host to show you around." />
                                <ExpectationItem text="Fast-track check-in for your kids." />
                                <ExpectationItem text="A free gift at the Connection Center." />
                            </ul>
                        </div>

                        {/* Form Area with Success Animation */}
                        <div className="md:col-span-3 p-8 md:p-12 relative flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {!isSuccess ? (
                                    <motion.form
                                        key="visit-form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormInput label="First Name" value={formData.first_name} onChange={(v) => setFormData({...formData, first_name: v})} required />
                                            <FormInput label="Last Name" value={formData.last_name} onChange={(v) => setFormData({...formData, last_name: v})} required />
                                        </div>
                                        <FormInput label="Email" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} required />

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormInput label="Phone" type="tel" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} required />
                                            <FormInput label="Date of Visit" type="date" value={formData.visit_date} onChange={(v) => setFormData({...formData, visit_date: v})} required />
                                        </div>

                                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bringing_kids}
                                                    onChange={(e) => setFormData({...formData, bringing_kids: e.target.checked})}
                                                    className="w-6 h-6 text-orange-600 rounded-lg border-gray-300 focus:ring-orange-500"
                                                />
                                                <span className="text-gray-800 font-bold uppercase text-[10px] tracking-tight">I'm bringing kids (Reach Kids Check-in)</span>
                                            </label>
                                        </div>

                                        <button
                                            disabled={isLoading}
                                            className="w-full bg-gray-900 text-white font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : "Confirm My Visit"}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success-message"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 size={40} className="animate-pulse" />
                                        </div>
                                        <h2 className="text-3xl font-black uppercase italic text-gray-900 leading-none">You're All Set!</h2>
                                        <p className="text-gray-500 mt-4 font-bold uppercase text-xs tracking-widest leading-relaxed">
                                            We've received your plan. A host will reach out to <span className="text-orange-600">{formData.phone}</span> shortly.
                                        </p>
                                        <button
                                            onClick={resetForm}
                                            className="mt-8 flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-600 transition-colors"
                                        >
                                            <ArrowLeft size={14} /> Plan another visit
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable Components
function FormInput({ label, type = "text", value, onChange, required = false }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">{label}</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none transition-all font-bold"
            />
        </div>
    );
}

function ExpectationItem({ text }) {
    return (
        <li className="flex items-start gap-3">
            <CheckCircle className="flex-shrink-0 mt-0.5 text-orange-200" size={18} />
            <span className="text-sm font-bold tracking-tight">{text}</span>
        </li>
    );
}
