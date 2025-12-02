'use client';

import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';

export default function PlanVisitPage() {
    return (
        <div className="py-24 bg-gray-50 pt-32">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Plan Your Visit</h1>
                    <p className="text-xl text-gray-600">Let us know you're coming and we'll roll out the red carpet.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-5 h-full">
                        <div className="md:col-span-2 bg-orange-600 p-8 text-white flex flex-col justify-center">
                            <h3 className="text-2xl font-bold mb-6">What to expect:</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                                    <span>A reserved parking spot just for you.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                                    <span>A friendly host to show you around.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                                    <span>Fast-track check-in for your kids.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                                    <span>A free gift at the Connection Center.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="md:col-span-3 p-8 md:p-12">
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
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                        <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Visit</label>
                                        <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50" />
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />
                                        <span className="text-gray-800 font-medium">I'm bringing kids (Reach Kids Check-in)</span>
                                    </label>
                                </div>
                                <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                                    Confirm My Visit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}