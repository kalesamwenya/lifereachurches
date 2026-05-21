'use client';

import React, { useEffect, useState } from 'react';
import { Share2, ChevronRight, Radio } from 'lucide-react';
import { Button } from '@/components/UIComponents';
import axios from 'axios';
import LiveChat from '@/components/LiveChat';

const API_URL = 'https://content.lifereachchurch.org';

export default function LivePage() {
    const [activeStream, setActiveStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStreamOnline, setIsStreamOnline] = useState(false);

    // Fetch active stream metadata loop (Runs silently every 30 seconds)
    useEffect(() => {
        fetchActiveStream(true); // pass true to indicate this is our initial boot fetch
    }, []);

    async function fetchActiveStream(isInitialLoad = false) {
        try {
            const response = await axios.get(`${API_URL}/streams/get_active.php`);
            
            if (response.data.success && response.data.stream) {
                setActiveStream(response.data.stream);
                setIsStreamOnline(true);
                setError(null);
            } else {
                setActiveStream(null);
                setIsStreamOnline(false);
                setError(response.data.message || "No live stream is currently active");
            }
        } catch (err) {
            setActiveStream(null);
            setIsStreamOnline(false);
            setError("Unable to connect to stream server");
        } finally {
            if (isInitialLoad) {
                setLoading(false);
            }
        }
    }

    const getEmbedUrl = () => {
        if (!activeStream) return '';
        
        const cloudName = "dj3u4klst";
        const profile = "cld-live-streaming";
        
        let targetPublicId = activeStream.hls_public_id || activeStream.public_id || "";

        if (!targetPublicId && activeStream.playback_url) {
            if (activeStream.playback_url.includes('live_streams/')) {
                const parts = activeStream.playback_url.split('live_streams/');
                if (parts[1]) targetPublicId = parts[1].split('.')[0];
            } else if (activeStream.playback_url.includes('/live/')) {
                const parts = activeStream.playback_url.split('/live/');
                if (parts[1]) targetPublicId = parts[1].split('.')[0];
            }
        }

        if (!targetPublicId) {
            targetPublicId = activeStream.stream_key || "";
        }

        targetPublicId = targetPublicId.replace('.m3u8', '').trim();

        return `https://player.cloudinary.com/embed/?cloud_name=${cloudName}&public_id=${targetPublicId}&profile=${profile}&autoplay=true`;
    };

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white pt-32 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading live experience...</p>
                </div>
            </div>
        );
    }

    if (!activeStream) {
        return (
            <div className="bg-black min-h-screen text-white pt-32 pb-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Radio size={40} className="text-gray-600 animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">No Live Stream</h1>
                        <p className="text-gray-400 text-lg mb-8">We are currently preparing for our next session. Check back during service times!</p>
                        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                            <h3 className="font-bold text-xl mb-4">Service Times</h3>
                            <div className="space-y-3 text-left max-w-md mx-auto">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Sunday Service</span>
                                    <span className="font-bold text-orange-500">9:00 AM - 1:00 AM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Thursday Midweek Service</span>
                                    <span className="font-bold text-orange-500">5:00 PM - 7:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pt-24 md:pt-32 pb-6 md:pb-12 flex flex-col h-screen md:h-auto overflow-hidden md:overflow-visible">
            <div className="container mx-auto px-4 md:px-6 flex-1 flex flex-col md:block min-h-0">
                
                {/* Meta Header Bar - Hidden on small mobile to maximize video and chat viewport estate */}
                <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/40 border border-red-800/60 shadow-[0_0_15px_rgba(220,38,38,0.15)] animate-pulse">
                                <Radio className="w-3.5 h-3.5 text-red-500" />
                                <span className="text-red-500 font-bold uppercase tracking-widest text-[11px]">Live Broadcast</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="dark" 
                            className="border border-gray-800 text-sm flex items-center gap-2"
                            onClick={() => navigator.share?.({ title: activeStream.title, url: window.location.href })}
                        >
                            <Share2 size={16} /> Share Stream
                        </Button>
                        <Button className="text-sm" onClick={() => window.location.href = '/give'}>
                            Give Online
                        </Button>
                    </div>
                </div>

                {/* Primary Screen Framework Mesh */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 flex-1 min-h-0 h-full md:h-auto items-start">
                    
                    {/* Media Display & Metadata Column Section */}
                    <div className="lg:col-span-3 flex flex-col h-full overflow-y-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
                        
                        {/* Video Frame Wrapper - Portrait by default on mobile, Landscape on desktop */}
                        <div className="sticky top-0 z-50 md:relative w-full aspect-[3/4] md:aspect-video bg-gray-950 rounded-b-2xl md:rounded-2xl overflow-hidden shadow-2xl border-b md:border border-gray-800 shrink-0">
                            <iframe
                                src={getEmbedUrl()}
                                className="w-full h-full absolute inset-0 border-0"
                                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                allowFullScreen
                                sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                            />
                        </div>

                        {/* Stream Context Details Panel */}
                        <div className="bg-gray-900 p-5 md:p-8 rounded-2xl border border-gray-800 mt-4 md:mt-8 mx-2 md:mx-0 shrink-0">
                            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{activeStream.title}</h2>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                {activeStream.description || "Welcome to our live service! We're glad you're here with us today."}
                            </p>
                            
                            <div className="flex gap-4 flex-wrap">
                                <button className="text-orange-500 font-bold text-xs md:text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Connection Card <ChevronRight size={16} />
                                </button>
                                <button className="text-orange-500 font-bold text-xs md:text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Prayer Request <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Isolated Independent Live Chat Module Column */}
                    <div className="h-[38vh] md:h-[600px] lg:h-[700px] min-h-0 flex flex-col px-2 md:px-0 pb-4 md:pb-0">
                        <LiveChat streamId={activeStream.id} />
                    </div>

                </div>
            </div>
        </div>
    );
}