'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, Settings } from 'lucide-react';

export default function CustomPlayer({ streamUrl, thumbnailUrl }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isBuffering, setIsBuffering] = useState(true);
    const [showPosterOverlay, setShowPosterOverlay] = useState(true);
    
    // Quality Selection States
    const [qualities, setQualities] = useState([]);
    const [currentQuality, setCurrentQuality] = useState('Auto');
    const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);

    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        if (!streamUrl || !videoRef.current) return;

        const video = videoRef.current;
        setIsBuffering(true);

        const initPlayer = () => {
            if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls({
                    maxMaxBufferLength: 8,
                    liveSyncDurationCount: 2.5,
                    enableWorker: true
                });
                hlsRef.current = hls;
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                
                hls.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
                    const availableQualities = data.levels.map((level, index) => ({
                        index,
                        height: level.height,
                        bitrate: level.bitrate
                    })).sort((a, b) => b.height - a.height);

                    setQualities(availableQualities);
                    setIsBuffering(false);
                });

                hls.on(window.Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case window.Hls.ErrorTypes.NETWORK_ERROR:
                                hls.startLoad();
                                break;
                            case window.Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    setIsBuffering(false);
                });
            }
        };

        if (typeof window !== 'undefined' && window.Hls) {
            initPlayer();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.0/dist/hls.min.js';
            script.async = true;
            script.onload = initPlayer;
            document.body.appendChild(script);
            return () => {
                if (document.body.contains(script)) document.body.removeChild(script);
                if (hlsRef.current) hlsRef.current.destroy();
            };
        }
    }, [streamUrl]);

    // UI Interactive Auto-hide Controllers
    const resetControlsTimeout = () => {
        setIsControlsVisible(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying && !isQualityMenuOpen) setIsControlsVisible(false);
        }, 3000);
    };

    useEffect(() => {
        resetControlsTimeout();
        return () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); };
    }, [isPlaying, isQualityMenuOpen]);

    const togglePlayback = (e) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        setIsQualityMenuOpen(false);

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            setShowPosterOverlay(true); // Pull poster framework back up immediately on pause
        } else {
            setShowPosterOverlay(false);
            videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                    // Fallback configuration if context blocking blocks playback init
                    setShowPosterOverlay(true);
                });
        }
    };

    const handleVolumeChange = (e) => {
        e.stopPropagation();
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        const currentMute = !isMuted;
        videoRef.current.muted = currentMute;
        setIsMuted(currentMute);
        if (currentMute) {
            setVolume(0);
        } else {
            videoRef.current.volume = 1;
            setVolume(1);
        }
    };

    const changeQuality = (index, height) => {
        if (!hlsRef.current) return;
        hlsRef.current.currentLevel = index;
        setCurrentQuality(index === -1 ? 'Auto' : `${height}p`);
        setIsQualityMenuOpen(false);
    };

    const toggleFullscreen = (e) => {
        e.stopPropagation();
        setIsQualityMenuOpen(false);
        if (!playerContainerRef.current) return;
        const container = playerContainerRef.current;
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) container.requestFullscreen();
            else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    return (
        <div 
            ref={playerContainerRef}
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => isPlaying && !isQualityMenuOpen && setIsControlsVisible(false)}
            onClick={togglePlayback}
            onDoubleClick={toggleFullscreen}
            className="sticky top-0 z-50 md:relative w-full md:aspect-video bg-gray-950 rounded-b-2xl md:rounded-2xl overflow-hidden shadow-2xl border-b md:border border-gray-800 shrink-0 group select-none"
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover bg-black cursor-pointer"
                playsInline
                poster={thumbnailUrl}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => {
                    setIsBuffering(false);
                    setShowPosterOverlay(false);
                }}
            />

            {/* Pre-play & Paused State Thumbnail Cover Overlay */}
            {showPosterOverlay && thumbnailUrl && !isBuffering && (
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-300 pointer-events-none flex items-center justify-center"
                    style={{ backgroundImage: `url(${thumbnailUrl})` }}
                >
                    {/* Blurred Background Matting */}
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                    
                    {/* Stylized Big Floating Central Play Action Trigger */}
                    <button  onClick={togglePlayback} className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform duration-300 z-10">
                        <Play size={28} fill="currentColor" className="ml-1" />
                    </button>
                </div>
            )}

            {/* Loading/Buffering Layer */}
            {isBuffering && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none z-20">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                </div>
            )}

            {/* Custom System Controller Interface Display */}
            <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40 flex flex-col justify-between p-4 z-10 transition-opacity duration-300 ${
                    isControlsVisible ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Upper Deck Meta strip */}
                <div className="flex items-center justify-between w-full pointer-events-none">
                    <span className="bg-red-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        Live
                    </span>
                </div>

                {/* Lower Action Matrix Controls */}
                <div className="flex items-center justify-between w-full gap-4 pt-4 relative">
                    <div className="flex items-center gap-4">
                        {/* Play/Pause Button */}
                        <button onClick={togglePlayback} className="text-white hover:text-orange-500 transition-colors transform active:scale-95 duration-150">
                            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                        </button>

                        {/* Audio Core Control Housing */}
                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={toggleMute} className="text-white hover:text-orange-500 transition-colors">
                                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                            </button>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        {/* Resolution Quality Control Gear Menu Button */}
                        {qualities.length > 0 && (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                                    className="text-white hover:text-orange-500 flex items-center gap-1 text-xs font-bold bg-white/10 px-2 py-1 rounded-md border border-white/10 transition-colors"
                                >
                                    <Settings size={14} className={isQualityMenuOpen ? "animate-spin" : ""} />
                                    {currentQuality}
                                </button>

                                {/* Dropdown Menu Selection Box */}
                                {isQualityMenuOpen && (
                                    <div className="absolute bottom-full right-0 mb-2 w-28 bg-gray-900/95 border border-gray-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md z-30 py-1">
                                        <button 
                                            onClick={() => changeQuality(-1, 'Auto')}
                                            className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-orange-500 hover:text-white transition-colors ${currentQuality === 'Auto' ? 'text-orange-500' : 'text-gray-300'}`}
                                        >
                                            Auto
                                        </button>
                                        {qualities.map((q) => (
                                            <button
                                                key={q.index}
                                                onClick={() => changeQuality(q.index, q.height)}
                                                className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-orange-500 hover:text-white transition-colors ${currentQuality === `${q.height}p` ? 'text-orange-500' : 'text-gray-300'}`}
                                            >
                                                {q.height}p
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Full Screen Switch */}
                        <button onClick={toggleFullscreen} className="text-white hover:text-orange-500 transition-colors transform active:scale-95 duration-150">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}