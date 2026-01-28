'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Loader2, CheckCircle2, ArrowRight, Phone, Home, Bus, User, Mail, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/lib/api-config';

export default function EventRegistration() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" /></div>}>
            <RegistrationContent />
        </Suspense>
    );
}

function RegistrationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const eventId = searchParams.get('id');

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        has_transport: 'no',
        pickup_point: '',
        tickets: '1'
    });

    const totalSteps = 3;

    useEffect(() => {
        if (!eventId) {
            router.push('/events');
            return;
        }

        const fetchEventDetail = async () => {
            try {
                const res = await axios.get(`${API_URL}/engagements/events/get_public_event.php?id=${eventId}`);
                setEvent(res.data);
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error(err.response?.data?.message || "Event not found.");
                router.push('/events');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetail();
    }, [eventId, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // If not on last step, go to next step
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            return;
        }

        // Submit on last step
        setSubmitting(true);
        try {
            const payload = {
                event_id: eventId,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                has_transport: formData.has_transport,
                pickup_point: formData.has_transport === 'no' ? formData.pickup_point : null,
                tickets: parseInt(formData.tickets) || 1
            };

            await axios.post(`${API_URL}/engagements/events/registrations.php`, payload);

            setIsSuccess(true);
            toast.success("Registration Successful!");

            setTimeout(() => router.push('/events'), 5000);
        } catch (err) {
            console.error("Submission Error:", err);
            toast.error(err.response?.data?.message || "Connection error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="py-40 text-center"><Loader2 className="animate-spin mx-auto text-orange-600" size={40} /></div>;
    if (!event) return <div className="py-40 text-center font-bold text-gray-400 uppercase tracking-widest">Record Not Found</div>;

    return (
        <div className="py-24 bg-gray-50 pt-32 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">

                {/* Event Header - DESIGN PRESERVED */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="h-48 bg-orange-600 relative overflow-hidden">
                        <img
                            src={event.image_url || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200"}
                            className="w-full h-full object-cover opacity-50 mix-blend-multiply"
                            alt="Event Cover"
                        />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 inline-block">
                                {event.type || 'Conference'}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-black">{event.title}</h1>
                        </div>
                    </div>
                    <div className="p-8 flex flex-wrap gap-6 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <Calendar className="text-orange-500" size={20} />
                            {new Date(event.start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <Clock className="text-orange-500" size={20} />
                            {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <MapPin className="text-orange-500" size={20} /> {event.location}
                        </div>
                    </div>
                </div>

                <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-12 md:p-20 text-center flex flex-col items-center"
                            >
                                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h3>
                                <p className="text-gray-500 mb-2">You're all set for <span className="text-orange-600 font-bold">{event.title}</span></p>
                                <p className="text-sm text-gray-400">Check your email for confirmation and event details.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 md:p-12"
                            >
                                {/* Progress Indicator */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="flex items-center flex-1">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                                    currentStep >= step ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                    {step}
                                                </div>
                                                {step < 3 && (
                                                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                                                        currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
                                                    }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 px-2">
                                        <span className={currentStep === 1 ? 'text-orange-600' : ''}>Personal Info</span>
                                        <span className={currentStep === 2 ? 'text-orange-600' : ''}>Location & Transport</span>
                                        <span className={currentStep === 3 ? 'text-orange-600' : ''}>Review & Confirm</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <AnimatePresence mode="wait">
                                        {/* Step 1: Personal Information */}
                                        {currentStep === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                        <User className="text-orange-600" size={24} />
                                                        Personal Information
                                                    </h3>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.first_name}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none"
                                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.last_name}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none"
                                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            required
                                                            type="email"
                                                            value={formData.email}
                                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none"
                                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            required
                                                            type="tel"
                                                            value={formData.phone}
                                                            placeholder="+260 97 123 4567"
                                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none"
                                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Location & Transport */}
                                        {currentStep === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                        <MapPin className="text-orange-600" size={24} />
                                                        Location & Transport
                                                    </h3>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Area / Address</label>
                                                    <div className="relative">
                                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.address}
                                                            placeholder="e.g., Foxdale, Meanwood, CBD"
                                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none"
                                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Do you have transport?</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="transport"
                                                                value="yes"
                                                                checked={formData.has_transport === 'yes'}
                                                                onChange={(e) => setFormData({...formData, has_transport: e.target.value, pickup_point: ''})}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center font-bold text-gray-700 peer-checked:text-orange-700 transition-all">
                                                                Yes, I have transport
                                                            </div>
                                                        </label>
                                                        <label className="flex-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="transport"
                                                                value="no"
                                                                checked={formData.has_transport === 'no'}
                                                                onChange={(e) => setFormData({...formData, has_transport: e.target.value})}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 peer-checked:border-orange-500 peer-checked:bg-orange-50 text-center font-bold text-gray-700 peer-checked:text-orange-700 transition-all">
                                                                No, I need transport
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                                {formData.has_transport === 'no' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="bg-orange-50 border border-orange-100 rounded-xl p-4"
                                                    >
                                                        <label className="block text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                                                            <Bus size={18} />
                                                            Nearest Pickup Point
                                                        </label>
                                                        <select
                                                            required
                                                            className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-500 bg-white outline-none appearance-none cursor-pointer"
                                                            value={formData.pickup_point}
                                                            onChange={(e) => setFormData({...formData, pickup_point: e.target.value})}
                                                        >
                                                            <option value="">Select a pickup point...</option>
                                                            <option value="Church Main Gate">Church Main Gate</option>
                                                            <option value="Meanwood Roundabout">Meanwood Roundabout</option>
                                                            <option value="Arcades Shopping Mall">Arcades Shopping Mall</option>
                                                            <option value="Levy Junction">Levy Junction</option>
                                                            <option value="CBD - Cairo Road">CBD - Cairo Road</option>
                                                            <option value="Woodlands Shopping Centre">Woodlands Shopping Centre</option>
                                                            <option value="Northmead Shopping Centre">Northmead Shopping Centre</option>
                                                            <option value="Chelstone Market">Chelstone Market</option>
                                                            <option value="Kamwala Market">Kamwala Market</option>
                                                            <option value="Other - Will contact organizers">Other - Will contact organizers</option>
                                                        </select>
                                                        <p className="text-xs text-orange-700 mt-2">We'll arrange pickup from this location before the event.</p>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}

                                        {/* Step 3: Review & Confirm */}
                                        {currentStep === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                        <CheckCircle2 className="text-orange-600" size={24} />
                                                        Review Your Registration
                                                    </h3>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Name</div>
                                                            <div className="font-bold text-gray-900">{formData.first_name} {formData.last_name}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Email</div>
                                                            <div className="font-medium text-gray-700">{formData.email}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Phone</div>
                                                            <div className="font-medium text-gray-700">{formData.phone}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Area</div>
                                                            <div className="font-medium text-gray-700">{formData.address}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Transport</div>
                                                            <div className="font-medium text-gray-700">
                                                                {formData.has_transport === 'yes' ? 'Own transport' : 'Need pickup'}
                                                            </div>
                                                        </div>
                                                        {formData.has_transport === 'no' && formData.pickup_point && (
                                                            <div>
                                                                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Pickup Point</div>
                                                                <div className="font-medium text-gray-700">{formData.pickup_point}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Number of Tickets</label>
                                                    <select
                                                        value={formData.tickets}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50 outline-none appearance-none cursor-pointer"
                                                        onChange={(e) => setFormData({...formData, tickets: e.target.value})}
                                                    >
                                                        <option value="1">1 Ticket</option>
                                                        <option value="2">2 Tickets</option>
                                                        <option value="3">3 Tickets</option>
                                                        <option value="4">4+ Tickets</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Navigation Buttons */}
                                    <div className="flex items-center gap-4 pt-4">
                                        {currentStep > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={20} />
                                                Back
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className={`${currentStep === 1 ? 'w-full' : 'flex-1'} bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2`}
                                        >
                                            {submitting ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : currentStep === totalSteps ? (
                                                <>Complete Registration</>
                                            ) : (
                                                <>
                                                    Continue
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
