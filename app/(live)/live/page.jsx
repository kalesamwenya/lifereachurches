'use client';

import React, { useEffect, useState } from 'react';
import { Share2, ChevronRight, Radio, Loader2 } from 'lucide-react';
import { Button } from '@/components/UIComponents';
import axios from 'axios';
import LiveChat from '@/components/LiveChat';
import Link from 'next/link';
import CustomPlayer from '@/components/streams/CustomPlayer';

const API_URL = 'https://content.lifereachchurch.org';

export default function LivePage() {
    const [activeStream, setActiveStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isStreamOnline, setIsStreamOnline] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        fetchActiveStream(true);
    }, []);

    async function fetchActiveStream(isInitialLoad = false) {
        try {
            const response = await axios.get(`${API_URL}/streams/get_active.php`);
            
            if (response.data.success && response.data.stream) {
                setActiveStream(response.data.stream);
                setIsStreamOnline(true);
                setError(null);
                
                // CRITICAL FOR CLIENT SIDE METRICS: 
                document.title = response.data.stream.title;
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

    const handleShareStream = async () => {
        if (!activeStream) return;
        setIsSharing(true);
        
        const absoluteThumbnailUrl = activeStream.thumbnail_url 
            ? (activeStream.thumbnail_url.startsWith('http') ? activeStream.thumbnail_url : `${API_URL}${activeStream.thumbnail_url}`)
            : '';
        
        const shareTitle = activeStream.title;
        const shareText = activeStream.description || "Join our Live Broadcast experience!";
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                const shareData = {
                    title: shareTitle,
                    text: `${shareText}\n\n`,
                    url: shareUrl,
                };

                if (absoluteThumbnailUrl && navigator.canShare) {
                    try {
                        const response = await fetch(absoluteThumbnailUrl, { mode: 'cors' });
                        const blob = await response.blob();
                        const extension = absoluteThumbnailUrl.split('.').pop().split(/\#|\?/)[0] || 'png';
                        const file = new File([blob], `stream_preview.${extension}`, { type: blob.type });

                        if (navigator.canShare({ files: [file] })) {
                            shareData.files = [file];
                        }
                    } catch (imageErr) {
                        console.warn("Could not attach thumbnail blob to share payload:", imageErr);
                    }
                }

                await navigator.share(shareData);
            } else {
                const structuralText = `✨ *${shareTitle}* ✨\n\n📝 ${shareText}\n\n📺 Watch Live Here: ${shareUrl}`;
                await navigator.clipboard.writeText(structuralText);
                alert("Stream connection data and links copied to clipboard!");
            }
        } catch (err) {
            console.error("Share canceled or failed:", err);
        } finally {
            setIsSharing(false);
        }
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
                                    <span className="font-bold text-orange-500">9:00 AM - 1:00 PM</span>
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
        /* - Mobile/Tablet (< 1024px): strict h-screen and overflow-hidden to freeze viewport and lock components.
           - Desktop (>= 1024px): returns cleanly to auto dimensions and standard document scrolling behavior.
        */
        <div className="bg-black h-screen lg:h-auto min-h-screen text-white pt-0 lg:pt-32 pb-0 lg:pb-12 flex flex-col overflow-hidden lg:overflow-visible">
            <div className="w-full flex-1 flex flex-col lg:container lg:mx-auto lg:px-6 min-h-0">
                
                {/* Meta Header Bar - Safely removed from cluttered mobile views */}
                <div className="hidden lg:flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 shrink-0">
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
                            onClick={handleShareStream}
                            disabled={isSharing}
                        >
                            {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />} 
                            {isSharing ? "Processing..." : "Share Stream"}
                        </Button>
                        <Button className="text-sm" onClick={() => window.location.href = '/give'}>
                            Give Online
                        </Button>
                    </div>
                </div>

                {/* Main Container Layout Split:
                    - Mobile/Tablet: Stacked via vertical flex column container bounds.
                    - Desktop: Restored back to the rigid 4-column wide grid mesh system.
                */}
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-0 lg:gap-8 flex-1 min-h-0 h-full lg:h-auto items-stretch lg:items-start">
                    
                    {/* Media Display Column */}
                    <div className="lg:col-span-3 flex flex-col shrink-0 lg:h-full lg:overflow-visible relative">
                        
                        {/* Video Frame */}
                        <div className="w-full bg-black relative z-10">
                            <CustomPlayer 
                                streamUrl={activeStream.playback_url} 
                                thumbnailUrl={activeStream.thumbnail_url ? (activeStream.thumbnail_url.startsWith('http') ? activeStream.thumbnail_url : `${API_URL}${activeStream.thumbnail_url}`) : null} 
                            />
                            
                            {/* Live HUD Pill - Renders floating context explicitly over small mobile players */}
                            <div className="lg:hidden absolute top-3 left-3 flex items-center gap-2 z-20 pointer-events-none">
                                <span className="bg-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 shadow-lg">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                    Live
                                </span>
                            </div>
                        </div>

                        {/* Stream Context Meta Panel - Hidden on small/medium configurations to optimize screen real-estate */}
                        <div className="hidden lg:block bg-gray-900 p-5 lg:p-8 rounded-2xl border border-gray-800 mt-8 mx-0 shrink-0">
                            <h2 className="text-xl lg:text-2xl font-bold mb-4">{activeStream.title}</h2>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                {activeStream.description || "Welcome to our live service! We're glad you're here with us today."}
                            </p>
                            
                            <div className="flex gap-4 flex-wrap">
                                <Link href="/testimonies/submit" className="text-orange-500 font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Give a Testimony <ChevronRight size={16} />
                                </Link>
                                <Link href="/contact" className="text-orange-500 font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Prayer Request <ChevronRight size={16} />
                                </Link>
                                <Link href="/plan-visit" className="text-orange-500 font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Plan visit <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Live Chat Stream Framework Section:
                        - Mobile/Tablet: Fills all remaining pixels precisely via `flex-1 min-h-0`.
                        - Desktop: Regains structural layout bounds (`lg:h-[700px]`).
                    */}
                    <div className="flex-1 lg:flex-none lg:h-[700px] min-h-0 flex flex-col relative bg-zinc-950 lg:bg-transparent">
                        <LiveChat streamId={activeStream.id} />
                    </div>

                </div>
            </div>
        </div>
    );
}