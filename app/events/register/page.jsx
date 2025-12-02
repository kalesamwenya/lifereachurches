'use client';

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function EventRegistration() {
    return (
        <div className="py-24 bg-gray-50 pt-32">
            <div className="container mx-auto px-6 max-w-3xl">
                {/* Event Header */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="h-48 bg-orange-600 relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 inline-block">Conference</span>
                            <h1 className="text-3xl md:text-4xl font-black">Worship Night: Unbroken</h1>
                        </div>
                    </div>
                    <div className="p-8 flex flex-wrap gap-6 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <Calendar className="text-orange-500" size={20} /> Nov 15, 2023
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <Clock className="text-orange-500" size={20} /> 7:00 PM
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                            <MapPin className="text-orange-500" size={20} /> Main Sanctuary
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
                    <h3 className="text-2xl font-bold mb-6">Register Now</h3>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Number of Tickets</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50">
                                <option>1 Ticket</option>
                                <option>2 Tickets</option>
                                <option>3 Tickets</option>
                                <option>4+ Tickets</option>
                            </select>
                        </div>
                        <div className="pt-4">
                            <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors shadow-lg">
                                Complete Registration
                            </button>
                            <p className="text-center text-sm text-gray-400 mt-4">You will receive a confirmation email shortly.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}