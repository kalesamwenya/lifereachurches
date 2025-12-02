'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '../../components/UIComponents';

export default function LivePage() {
    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Live Broadcast</span>
                        </div>
                        <h1 className="text-3xl font-bold">Life Reach Online</h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="dark" className="border border-gray-800 text-sm">Share Stream</Button>
                        <Button className="text-sm">Give Online</Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Video Area */}
                    <div className="lg:col-span-3">
                        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative mb-8 group">
                            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button className="!px-10 !py-5 text-xl scale-110 shadow-2xl shadow-orange-500/40">
                                    <Play fill="currentColor" className="mr-3"/> Join Service
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                            <h2 className="text-2xl font-bold mb-4">Reach Higher: Part 3</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Welcome to our online experience! Today we are continuing our series "Limitless" with a message about building your life on the rock.
                            </p>
                            <div className="flex gap-4">
                                <button className="text-orange-500 font-bold text-sm hover:text-white transition-colors">Download Notes</button>
                                <button className="text-orange-500 font-bold text-sm hover:text-white transition-colors">Connection Card</button>
                            </div>
                        </div>
                    </div>

                    {/* Chat / Sidebar */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 h-[600px] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-gray-800 font-bold flex justify-between items-center">
                            <span>Live Chat</span>
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">124 watching</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            <div className="text-sm"><span className="font-bold text-orange-500">Sarah J:</span> Good morning from Ohio! 👋</div>
                            <div className="text-sm"><span className="font-bold text-blue-400">Moderator:</span> Welcome Sarah! So glad you're here.</div>
                            <div className="text-sm"><span className="font-bold text-purple-400">Mike T:</span> Ready for worship!</div>
                            <div className="text-sm"><span className="font-bold text-orange-500">Pastor Dave:</span> Let's go church!!</div>
                        </div>
                        <div className="p-4 border-t border-gray-800 bg-gray-950/50 rounded-b-2xl">
                            <input type="text" placeholder="Type a message..." className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}