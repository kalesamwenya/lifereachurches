'use client';

import React, {useState, useEffect} from 'react';
import { Facebook, Instagram, Youtube, ChevronRight, Clock, MapPin, Phone, Heart, Mic, BookOpen, Mail, GraduationCap } from 'lucide-react';
import Image from "next/image";
import {usePathname} from "next/navigation";
import {BsTiktok} from "react-icons/bs";
import {MdEmail} from "react-icons/md";
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [churchSettings, setChurchSettings] = useState(null);

    const pathname = usePathname();
    const transparentPages = ['/', '/about', '/events', '/podcast','/contact', '/sermons', '/blog', '/library', '/education', '/plan-visit'];
    const isTransparentPage = transparentPages.includes(pathname);

    useEffect(() => {
        fetchChurchSettings();
    }, []);

    const fetchChurchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/settings/get.php`);
            setChurchSettings(response.data);
        } catch (error) {
            console.error('Error fetching church settings:', error);
        }
    };

    // Get contact info from DB or use defaults
    const churchName = churchSettings?.name || 'Life Reach Church';
    const churchAddress = churchSettings?.address || 'Zamise Theater Hall, Kamwala, Lusaka';
    const churchPhone = churchSettings?.phone || '762585742';
    const churchEmail = churchSettings?.email || 'lifereachchurch@gmail.com';
    
    // Social media links from DB
    const socialLinks = [
        { 
            Icon: Facebook, 
            url: churchSettings?.facebook_url || '#',
            name: 'Facebook'
        },
        { 
            Icon: Instagram, 
            url: churchSettings?.instagram_url || '#',
            name: 'Instagram'
        },
        { 
            Icon: Youtube, 
            url: churchSettings?.youtube_url || '#',
            name: 'YouTube'
        },
        { 
            Icon: BsTiktok, 
            url: churchSettings?.tiktok_url || '#',
            name: 'TikTok'
        }
    ];

    // Update: Navbar becomes solid if scrolled, OR not a transparent page, OR if the menu is open
    // This ensures text/buttons are always visible (dark) when the white mobile menu is active.
    const isSolid = isScrolled || !isTransparentPage || isOpen;
    return (
        <footer className="bg-gray-950 text-gray-300 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div>
                        {/*Logo*/}
                        <div className={`text-2xl font-black cursor-pointer flex items-center gap-2 tracking-tight ${isSolid ? 'text-gray-900' : 'text-white'}`}>
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white shadow-lg relative">
                                <Image
                                    src={`/logo.png`}
                                    fill={true}
                                    className={`w-5 h-5 object-contain`}
                                    alt={`life reach church logo`}
                                />
                            </div>
                            {churchName}
                        </div>
                        <p className="mb-8 leading-relaxed text-gray-400">
                            Reaching the lost, Raising disciples, and Releasing leaders. Join the movement.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.url} 
                                    target={social.url !== '#' ? '_blank' : '_self'}
                                    rel={social.url !== '#' ? 'noopener noreferrer' : ''}
                                    className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center hover:bg-orange-600 transition-colors group"
                                    aria-label={social.name}
                                >
                                    <social.Icon size={20} className="group-hover:text-white transition-colors text-gray-400" />
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
                            <li>
                                <a href="/education" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                                    <GraduationCap size={16} className="text-orange-600" /> Education
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
                                <span>{churchAddress}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg text-orange-500">
                                    <Phone size={20} />
                                </div>
                                <span>{churchPhone}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg text-orange-500">
                                    <MdEmail size={20} />
                                </div>
                                <span>{churchEmail}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2 bg-gray-900 rounded-lg text-orange-500">
                                    <Clock size={20} />
                                </div>
                               <div className="">
                                   <div>Sun: 9:00 AM & 13:00 PM</div>
                                   <div>Thur: 17:00 PM & 19:00 PM</div>
                               </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {churchName}. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/contact" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}