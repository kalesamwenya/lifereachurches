'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, Users, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/UIComponents';
import axios from 'axios';

const API_URL = 'https://content.lifereachchurch.org';

export default function LivePage() {
    const [activeStream, setActiveStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const videoRef = useRef(null);
    const hlsRef = useRef(null);

    // Fetch active stream
    useEffect(() => {
        fetchActiveStream();
        // Poll for stream updates every 30 seconds
        const interval = setInterval(fetchActiveStream, 30000);
        return () => clearInterval(interval);
    }, []);

    async function fetchActiveStream() {
        try {
            const response = await axios.get(`${API_URL}/get_active.php`);
            if (response.data.success) {
                setActiveStream(response.data.stream);
                setError(null);
            } else {
                setActiveStream(null);
                setError("No live stream is currently active");
            }
        } catch (err) {
            setActiveStream(null);
            setError("Unable to connect to stream server");
        } finally {
            setLoading(false);
        }
    }

    // Initialize HLS player
    async function playStream() {
        if (!activeStream || !videoRef.current) return;

        try {
            setVideoLoading(true);
            setIsPlaying(true);

            // Check if HLS.js is supported
            if (typeof window !== 'undefined') {
                const Hls = (await import('hls.js')).default;
                
                if (Hls.isSupported()) {
                    // Clean up previous instance if exists
                    if (hlsRef.current) {
                        hlsRef.current.destroy();
                    }

                    const hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });

                    hls.loadSource(activeStream.playback_url);
                    hls.attachMedia(videoRef.current);
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        setVideoLoading(false);
                        videoRef.current?.play().catch(err => {
                            setError('Unable to start playback. Please try again.');
                        });
                    });

                    hls.on(Hls.Events.ERROR, (event, data) => {
                        if (data.fatal) {
                            let errorMessage = 'Unable to connect to the live stream.';
                            switch (data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    // Don't try to recover on manifest load error (404)
                                    if (data.details === 'manifestLoadError') {
                                        errorMessage = 'The stream is currently unavailable. Please try again later.';
                                        setIsPlaying(false);
                                        setVideoLoading(false);
                                    } else {
                                        errorMessage = 'Connection error. Attempting to reconnect...';
                                        setTimeout(() => hls.startLoad(), 2000);
                                    }
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    errorMessage = 'Stream interrupted. Attempting to recover...';
                                    hls.recoverMediaError();
                                    break;
                                default:
                                    errorMessage = 'Stream unavailable. Please refresh the page.';
                                    setIsPlaying(false);
                                    setVideoLoading(false);
                                    break;
                            }
                            setError(errorMessage);
                        }
                    });

                    hlsRef.current = hls;
                }
                // For Safari (native HLS support)
                else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                    videoRef.current.src = activeStream.playback_url;
                    videoRef.current.addEventListener('loadedmetadata', () => {
                        setVideoLoading(false);
                    });
                    videoRef.current.addEventListener('error', (e) => {
                        setError('Unable to load stream. Please try again later.');
                        setIsPlaying(false);
                        setVideoLoading(false);
                    });
                    videoRef.current.play().catch(err => {
                        setError('Unable to start playback. Please try again.');
                        setIsPlaying(false);
                        setVideoLoading(false);
                    });
                }
            }
        } catch (err) {
            setError('Unable to start video player. Please refresh the page.');
            setIsPlaying(false);
            setVideoLoading(false);
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white pt-32 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading stream...</p>
                </div>
            </div>
        );
    }

    // No active stream
    if (!activeStream) {
        return (
            <div className="bg-black min-h-screen text-white pt-32 pb-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Play size={40} className="text-gray-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">No Live Stream</h1>
                        <p className="text-gray-400 text-lg mb-8">
                            {error || "We're not currently live. Check back during our service times!"}
                        </p>
                        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                            <h3 className="font-bold text-xl mb-4">Service Times</h3>
                            <div className="space-y-3 text-left max-w-md mx-auto">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Sunday Service</span>
                                    <span className="font-bold text-orange-500">9:00 AM - 11:00 AM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Wednesday Bible Study</span>
                                    <span className="font-bold text-orange-500">6:00 PM - 8:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-12">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Live Now</span>
                        </div>
                        <h1 className="text-3xl font-bold">{activeStream.title}</h1>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="dark" 
                            className="border border-gray-800 text-sm flex items-center gap-2"
                            onClick={() => {
                                navigator.share?.({
                                    title: activeStream.title,
                                    text: 'Join us live!',
                                    url: window.location.href
                                });
                            }}
                        >
                            <Share2 size={16} />
                            Share Stream
                        </Button>
                        <Button className="text-sm" onClick={() => window.location.href = '/give'}>
                            Give Online
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Video Area */}
                    <div className="lg:col-span-3">
                        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative mb-8">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain bg-black"
                                controls
                                autoPlay
                                playsInline
                                style={{ display: isPlaying ? 'block' : 'none' }}
                            />
                            {videoLoading && (
                                <div className="absolute inset-0 bg-black flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-400">Loading stream...</p>
                                    </div>
                                </div>
                            )}
                            {!isPlaying && (
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-black flex items-center justify-center">
                                    <Button 
                                        className="!px-10 !py-5 text-xl scale-110 shadow-2xl shadow-orange-500/40"
                                        onClick={playStream}
                                    >
                                        <Play fill="currentColor" className="mr-3" /> Join Service
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                            <h2 className="text-2xl font-bold mb-4">{activeStream.title}</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {activeStream.description || "Welcome to our live service! We're glad you're here with us today."}
                            </p>
                            
                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-orange-900/20 border border-orange-700 rounded-xl">
                                    <p className="text-orange-300 text-sm">{error}</p>
                                </div>
                            )}
                            
                            <div className="flex gap-4 flex-wrap">
                                <button className="text-orange-500 font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Connection Card <ChevronRight size={16} />
                                </button>
                                <button className="text-orange-500 font-bold text-sm hover:text-white transition-colors flex items-center gap-2">
                                    Prayer Request <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat / Sidebar */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 h-[600px] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-gray-800 font-bold flex justify-between items-center">
                            <span>Live Chat</span>
                            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-400 flex items-center gap-2">
                                <Users size={14} />
                                <span>Live</span>
                            </span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            <div className="text-center text-gray-500 text-sm py-8">
                                Chat will be available soon
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-800 bg-gray-950/50 rounded-b-2xl">
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 text-sm" 
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
