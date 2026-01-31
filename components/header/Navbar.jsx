'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Mic, BookOpen, PlayCircle, User, LogOut, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const usePathname = () => {
    const [pathname, setPathname] = useState('/');
    useEffect(() => {
        if (typeof window !== 'undefined') setPathname(window.location.pathname);
    }, []);
    return pathname;
};

const Button = ({ children, variant = 'primary', className = '', onClick }) => {
    const baseStyle = "px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95";
    const variants = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30",
        secondary: "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm",
        outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900",
        // Added a minimal variant for the close button inside the menu
        ghost: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    };
    return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [deptDropdown, setDeptDropdown] = useState(false);
    const [mediaDropdown, setMediaDropdown] = useState(false);
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth');
    };

    const transparentPages = ['/', '/about', '/events', '/podcast', '/live', '/education'];
    const isTransparentPage = transparentPages.includes(pathname);

    // Update: Navbar becomes solid if scrolled, OR not a transparent page, OR if the menu is open
    // This ensures text/buttons are always visible (dark) when the white mobile menu is active.
    const isSolid = isScrolled || !isTransparentPage || isOpen;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const departments = [
        { name: 'Ministries', path: '/ministries' },
        { name: 'Book Library', path: '/library' },
        { name: 'Volunteer', path: '/volunteer' },
    ];

    const media = [
        { name: 'Sermons', path: '/sermons', icon: <PlayCircle size={14} /> },
        { name: 'Podcast', path: '/podcast', icon: <Mic size={14} /> },
        { name: 'Blog', path: '/blog', icon: <BookOpen size={14} /> },
        { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={14} /> },
    ];

    return (
        <nav className={`fixed w-full z-[9999] transition-all duration-500 ${isSolid ? 'bg-white shadow-lg py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/*Logo*/}
                <a href="/" className={`text-2xl font-black cursor-pointer flex items-center gap-2 tracking-tight ${isSolid ? 'text-gray-900' : 'text-white'}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white shadow-lg relative">
                        <Image
                            src={`/logo.png`}
                            fill={true}
                            className={`w-5 h-5 object-contain`}
                            alt={`life reach church logo`}
                        />
                    </div>
                    Life Reach Church
                </a>

                <div className="hidden lg:flex items-center gap-6">
                    <a href="/" className={`font-semibold text-sm uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>Home</a>
                    <a href="/about" className={`font-semibold text-sm uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/about' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>About</a>

                    <div className="relative group" onMouseEnter={() => setMediaDropdown(true)} onMouseLeave={() => setMediaDropdown(false)}>
                        <button className={`font-semibold text-sm uppercase tracking-wide transition-colors flex items-center gap-1 hover:text-orange-500 ${media.some(m => pathname.includes(m.path)) ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>
                            Media <ChevronDown size={14} />
                        </button>
                        <AnimatePresence>
                            {mediaDropdown && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden py-2 border border-gray-100">
                                    {media.map((item) => (
                                        <a key={item.path} href={item.path} className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                            {item.icon} {item.name}
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative group" onMouseEnter={() => setDeptDropdown(true)} onMouseLeave={() => setDeptDropdown(false)}>
                        <button className={`font-semibold text-sm uppercase tracking-wide transition-colors flex items-center gap-1 hover:text-orange-500 ${departments.some(d => pathname.includes(d.path)) ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>
                            Connect <ChevronDown size={14} />
                        </button>
                        <AnimatePresence>
                            {deptDropdown && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden py-2 border border-gray-100">
                                    {departments.map((dept) => (
                                        <a key={dept.path} href={dept.path} className="block px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                            {dept.name}
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <a href="/events" className={`font-semibold text-sm uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/events' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>Events</a>
                    <a href="/live" className={`font-semibold text-sm uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/live' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>Live</a>
                    <a href="/contact" className={`font-semibold text-sm uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/contact' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>Contact</a>
                    <a href="/education" className={`font-semibold text-sm uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/education' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>Learn</a>

                    <div className="flex items-center gap-3 ml-2">
                        <a href="/plan-visit">
                            <Button variant={isSolid ? 'secondary' : 'outline'} className={`py-2 px-4 text-xs`}>Plan Visit</Button>
                        </a>
                        <a href="/give">
                            <Button variant="primary" className="py-2 px-6 text-xs shadow-none">Give</Button>
                        </a>
                        
                        {/* Auth Section */}
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => router.push('/member')}
                                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-all"
                                    title="Go to Member Portal"
                                >
                                    <img 
                                        src={user.avatar_url || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                                        alt={`${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-orange-600"
                                    />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden xl:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <a href="/auth">
                                    <Button variant={isSolid ? 'secondary' : 'outline'} className="py-2 px-4 text-xs">
                                        <User size={16} />
                                        Login
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Toggle Button: Swaps between Menu and X */}
                <button className={`lg:hidden ${isSolid ? 'text-gray-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100vh' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden absolute top-0 left-0 w-full bg-white z-40 overflow-y-auto pt-24 pb-12">
                        <div className="container mx-auto px-6 flex flex-col gap-6">

                            {/* Added explicit internal Close Button */}
                            <div className="flex justify-end w-full pb-2">
                                <Button variant="ghost" onClick={() => setIsOpen(false)} className="!px-4 !py-2 text-sm">
                                    Close Menu <X size={16} />
                                </Button>
                            </div>

                            <a href="/" className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">Home</a>
                            <a href="/about" className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">About</a>

                            <div className="border-b border-gray-100 pb-4">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-4">Media</p>

                            {/* Mobile Auth Section */}
                            {isAuthenticated && user ? (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push('/member');
                                        }}
                                        className="flex items-center gap-4 w-full p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all"
                                    >
                                        <img 
                                            src={user.avatar_url || user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                                            alt={`${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-600"
                                        />
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">{user.first_name || user.firstName} {user.last_name || user.lastName}</p>
                                            <p className="text-sm text-orange-600">Go to Member Portal</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center justify-center gap-2 w-full p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all text-red-600 font-bold"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <a href="/auth">
                                        <Button className="w-full justify-center">
                                            <User size={20} />
                                            Login / Sign Up
                                        </Button>
                                    </a>
                                </div>
                            )}
                                <div className="flex flex-col gap-4 pl-4">
                                    <a href="/sermons" className="text-lg font-medium text-gray-700">Sermons</a>
                                    <a href="/podcast" className="text-lg font-medium text-gray-700">Podcast</a>
                                    <a href="/blog" className="text-lg font-medium text-gray-700">Blog</a>
                                </div>
                            </div>

                            <div className="border-b border-gray-100 pb-4">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-4">Connect</p>
                                <div className="flex flex-col gap-4 pl-4">
                                    <a href="/ministries" className="text-lg font-medium text-gray-700">Ministries</a>
                                    <a href="/library" className="text-lg font-medium text-gray-700">Book Library</a>
                                    <a href="/events" className="text-lg font-medium text-gray-700">Events</a>
                                    <a href="/volunteer" className="text-lg font-medium text-gray-700">Volunteer</a>
                                </div>
                            </div>

                            <a href="/contact" className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">Contact</a>
                            <a href="/education" className={`text-2xl font-bold uppercase tracking-wide transition-colors hover:text-orange-500 ${pathname === '/education' ? 'text-orange-500' : (isSolid ? 'text-gray-600' : 'text-gray-200')}`}>Learn</a>
                            <a href="/plan-visit" className="text-2xl font-bold text-orange-600">Plan A Visit</a>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <a href="/give"><Button className="w-full">Give</Button></a>
                                <a href="/live"><Button variant="outline" className="w-full !text-gray-900 !border-gray-900">Live Stream</Button></a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}