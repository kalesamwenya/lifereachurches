'use client';

import React from 'react';
import { Facebook, Instagram, Youtube, ChevronRight, Clock, MapPin, Phone, Heart, Mic, BookOpen, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-3 text-white font-bold text-2xl mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                                <Heart size={20} fill="currentColor" />
                            </div>
                            Life Reach Church
                        </div>
                        <p className="mb-8 leading-relaxed text-gray-400">
                            Reaching the lost, Raising disciples, and Releasing leaders. Join the movement.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center hover:bg-orange-600 transition-colors group">
                                    <Icon size={20} className="group-hover:text-white transition-colors text-gray-400" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-xl mb-8">Discover</h4>
                        <ul className="space-y-3">
                            {['About', 'Ministries', 'Events', 'Plan-Visit'].map(item => (
                                <li key={item}>
                                    <a href={`/${item.toLowerCase()}`} className="hover:text-orange-500 transition-colors flex items-center gap-2">
                                        <ChevronRight size={16} className="text-orange-600" /> {item.replace('-', ' ')}
                                    </a>
                                </li>
                            ))}
                            <li className="pt-4 mt-4 border-t border-gray-900">
                                <a href="/give" className="font-bold text-white hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <Heart size={16} className="text-orange-600" /> Give Online
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-xl mb-8">Media & Resources</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="/sermons" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <ChevronRight size={16} className="text-orange-600" /> Sermons
                                </a>
                            </li>
                            <li>
                                <a href="/podcast" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <Mic size={16} className="text-orange-600" /> Podcast
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <BookOpen size={16} className="text-orange-600" /> Blog
                                </a>
                            </li>
                            <li>
                                <a href="/library" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <BookOpen size={16} className="text-orange-600" /> Library
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-xl mb-8">Visit Us</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg text-orange-500">
                                    <MapPin size={20} />
                                </div>
                                <span>123 Life Reach Blvd<br/>Springfield, ST 12345</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg text-orange-500">
                                    <Phone size={20} />
                                </div>
                                <span>(555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg text-orange-500">
                                    <Clock size={20} />
                                </div>
                                <span>Sun: 9:00 AM & 11:00 AM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2023 Life Reach Church. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/contact" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}