'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Mic, Clock, Calendar, Loader2, AlertCircle, ChevronDown, ChevronUp, X, Square } from 'lucide-react';

// --- Utility: Time Formatter ---
const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Fallback Data ---
const fallbackEpisodes = [
    {
        id: 101,
        title: "Welcome to Life Reach (Fallback)",
        desc: "We are having trouble connecting to the live feed. Please try again later.",
        date: new Date().toLocaleDateString(),
        url: "",
        duration: "00:00",
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?auto=format&fit=crop&q=80&w=400"
    }
];

export default function PodcastPage() {
    const [episodes, setEpisodes] = useState([]);
    const [currentEp, setCurrentEp] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Mobile Player State
    const [isFullPlayer, setIsFullPlayer] = useState(false);

    // Pagination State
    const [visibleCount, setVisibleCount] = useState(5);

    const audioRef = useRef(null);

    // --- 1. Fetch & Parse RSS Feed ---
    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                const RSS_URL = 'https://anchor.fm/s/128a41cc/podcast/rss';
                const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`);

                if (!response.ok) throw new Error("Network response was not ok");

                const xmlText = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, "text/xml");

                const parseError = xml.querySelector("parsererror");
                if (parseError) throw new Error("XML Parsing Error");

                const items = xml.querySelectorAll("item");

                const channelImage = xml.querySelector("image > url")?.textContent ||
                    xml.getElementsByTagName("itunes:image")[0]?.getAttribute("href");

                const parsedEpisodes = Array.from(items).map((item, index) => {
                    const title = item.querySelector("title")?.textContent;
                    const descRaw = item.querySelector("description")?.textContent;
                    const description = descRaw?.replace(/(<([^>]+)>)/gi, "").substring(0, 180) + "..." || "No description.";
                    const pubDate = new Date(item.querySelector("pubDate")?.textContent).toLocaleDateString();
                    const enclosure = item.querySelector("enclosure");
                    const audioUrl = enclosure?.getAttribute("url");

                    const durationTag = item.getElementsByTagName("itunes:duration")[0];
                    let durationDisplay = "00:00";
                    if (durationTag) {
                        const val = durationTag.textContent;
                        if (val.includes(':')) {
                            durationDisplay = val;
                        } else {
                            durationDisplay = formatTime(parseInt(val, 10));
                        }
                    }

                    const imageTag = item.getElementsByTagName("itunes:image")[0];
                    const image = imageTag ? imageTag.getAttribute("href") : channelImage;

                    return {
                        id: index,
                        title: title || `Episode ${index + 1}`,
                        desc: description,
                        date: pubDate,
                        url: audioUrl,
                        duration: durationDisplay,
                        image: image || "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?auto=format&fit=crop&q=80&w=400"
                    };
                });

                if (parsedEpisodes.length > 0) {
                    setEpisodes(parsedEpisodes);
                    setCurrentEp(parsedEpisodes[0]);
                } else {
                    throw new Error("No episodes found in feed.");
                }
                setLoading(false);

            } catch (err) {
                console.warn("RSS Fetch failed:", err);
                setEpisodes(fallbackEpisodes);
                setCurrentEp(fallbackEpisodes[0]);
                setError("Could not load latest episodes. Showing offline data.");
                setLoading(false);
            }
        };

        fetchPodcast();
    }, []);

    // --- 2. Audio Control Logic ---

    const togglePlay = (e) => {
        e?.stopPropagation();
        if (!audioRef.current || !currentEp?.url) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const stop = (e) => {
        e?.stopPropagation();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setProgress(0);
        }
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const playEpisode = (ep) => {
        if (!ep.url) return;
        setCurrentEp(ep);
        setIsPlaying(true);
        setProgress(0);
        setTimeout(() => {
            if(audioRef.current) {
                audioRef.current.load();
                audioRef.current.play().catch(e => console.error("Playback error:", e));
            }
        }, 50);
    };

    const skip = (seconds, e) => {
        e?.stopPropagation();
        if (audioRef.current) {
            audioRef.current.currentTime += seconds;
        }
    };

    const handleProgressChange = (e) => {
        e?.stopPropagation();
        const newTime = (e.target.value / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    // --- Mobile Player Logic ---
    const handlePlayerClick = () => {
        if (window.innerWidth < 1024 && !isFullPlayer) {
            setIsFullPlayer(true);
        }
    };

    const closeFullPlayer = (e) => {
        e.stopPropagation();
        setIsFullPlayer(false);
    };

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white pt-20">
                <Loader2 size={48} className="text-orange-500 animate-spin mb-4" />
                <p>Loading your podcast...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen pt-32 pb-48 lg:pb-24">
            <div className="container mx-auto px-6">
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 mb-8 flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* --- Main Player Area --- */}
                    <div
                        onClick={handlePlayerClick}
                        className={`
                lg:w-2/3 w-full transition-all duration-300 ease-in-out
                ${isFullPlayer
                            ? 'fixed inset-0 bg-gray-900 flex flex-col justify-center px-6 z-[100]'
                            : 'fixed bottom-0 left-0 lg:static lg:sticky lg:top-24 cursor-pointer lg:cursor-default z-50'
                        }
              `}
                    >
                        <div className={`
                  bg-gray-900 lg:bg-gradient-to-br lg:from-gray-800 lg:to-gray-900 
                  border-t border-gray-800 lg:border-none lg:p-8 lg:rounded-3xl lg:shadow-2xl 
                  relative overflow-hidden
                  ${isFullPlayer ? 'h-full flex flex-col justify-center border-none' : 'p-4 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)]'}
               `}>

                            {/* Close Button (Visible on Mobile Full Screen) */}
                            {isFullPlayer && (
                                <button
                                    onClick={closeFullPlayer}
                                    className="absolute top-8 right-6 p-3 bg-gray-800 text-white rounded-full z-[110] shadow-xl border border-gray-700 hover:bg-gray-700 transition-colors"
                                >
                                    <ChevronDown size={32} />
                                </button>
                            )}

                            <div className="hidden lg:block absolute top-0 right-0 p-12 opacity-5">
                                <Mic size={200} />
                            </div>

                            {/* Audio Element */}
                            <audio
                                ref={audioRef}
                                src={currentEp?.url}
                                onTimeUpdate={onTimeUpdate}
                                onEnded={() => setIsPlaying(false)}
                            />

                            <div className={`
                    flex items-center relative z-10
                    ${isFullPlayer ? 'flex-col text-center gap-8' : 'flex-row gap-4 lg:gap-8'}
                  `}>
                                {/* Artwork */}
                                <div
                                    className={`
                          bg-gray-700 shadow-xl flex-shrink-0 bg-cover bg-center border border-gray-600 transition-all
                          ${isFullPlayer
                                        ? 'w-64 h-64 rounded-3xl shadow-2xl mt-8'
                                        : 'w-14 h-14 rounded-lg lg:w-48 lg:h-48 lg:rounded-2xl'
                                    }
                        `}
                                    style={{backgroundImage: `url("${currentEp?.image}")`}}
                                ></div>

                                <div className="flex-1 w-full min-w-0">
                                    {/* Status Label */}
                                    <span className={`
                           text-orange-500 font-bold uppercase tracking-widest text-xs mb-2 animate-pulse
                           ${isFullPlayer ? 'block' : 'hidden lg:block'}
                        `}>
                            {isPlaying ? 'Now Playing' : 'Paused'}
                        </span>

                                    {/* Title */}
                                    <h2 className={`
                           font-bold truncate pr-2
                           ${isFullPlayer ? 'text-2xl md:text-3xl mb-4 whitespace-normal' : 'text-sm lg:text-3xl lg:font-black mb-1 lg:mb-2'}
                        `}>
                                        {currentEp?.title}
                                    </h2>

                                    {/* Description */}
                                    <p className={`
                           text-gray-400 mb-6 text-sm line-clamp-2
                           ${isFullPlayer ? 'block px-4' : 'hidden lg:block'}
                        `}>
                                        {currentEp?.desc}
                                    </p>

                                    {/* Mobile Mini Progress Bar */}
                                    {!isFullPlayer && (
                                        <div className="lg:hidden w-full mb-2">
                                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden w-full">
                                                <div className="h-full bg-orange-500" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Controls Container */}
                                    <div className={`
                           flex items-center 
                           ${isFullPlayer ? 'justify-center gap-8 mt-8' : 'justify-between lg:justify-start gap-4 lg:gap-8'}
                        `}>

                                        {/* Mini Time Display */}
                                        {!isFullPlayer && (
                                            <div className="lg:hidden text-[10px] text-gray-400 font-mono">
                                                {formatTime(progress)} / {formatTime(duration)}
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className={`flex items-center ${isFullPlayer ? 'gap-8' : 'gap-4 lg:gap-6'}`}>
                                            {/* Skip Back */}
                                            <button
                                                onClick={(e) => skip(-15, e)}
                                                className={`
                                    text-gray-400 hover:text-white transition-colors flex-col items-center gap-1
                                    ${isFullPlayer ? 'flex' : 'hidden lg:flex'}
                                 `}
                                            >
                                                <SkipBack size={isFullPlayer ? 32 : 24} />
                                                <span className="text-[10px]">-15s</span>
                                            </button>

                                            {/* Play/Pause */}
                                            <button
                                                onClick={togglePlay}
                                                disabled={!currentEp?.url}
                                                className={`
                                     rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg shadow-orange-900/50
                                     ${!currentEp?.url ? 'bg-gray-600 cursor-not-allowed' : 'bg-orange-600'}
                                     ${isFullPlayer ? 'w-20 h-20' : 'w-10 h-10 lg:w-20 lg:h-20'}
                                  `}
                                            >
                                                {isPlaying
                                                    ? <Pause size={isFullPlayer ? 32 : (window.innerWidth < 1024 ? 20 : 32)} fill="currentColor" />
                                                    : <Play size={isFullPlayer ? 32 : (window.innerWidth < 1024 ? 20 : 32)} fill="currentColor" className="ml-1" />
                                                }
                                            </button>

                                            {/* Stop Button */}
                                            <button
                                                onClick={(e) => stop(e)}
                                                className={`
                                    text-gray-400 hover:text-red-500 transition-colors flex-col items-center gap-1
                                    ${isFullPlayer ? 'flex' : 'hidden lg:flex'}
                                 `}
                                            >
                                                <Square size={isFullPlayer ? 28 : 20} fill="currentColor" />
                                                <span className="text-[10px]">Stop</span>
                                            </button>

                                            {/* Skip Forward */}
                                            <button
                                                onClick={(e) => skip(15, e)}
                                                className={`
                                    text-gray-400 hover:text-white transition-colors flex-col items-center gap-1
                                    ${isFullPlayer ? 'flex' : 'hidden lg:flex'}
                                 `}
                                            >
                                                <SkipForward size={isFullPlayer ? 32 : 24} />
                                                <span className="text-[10px]">+15s</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Progress Bar (Desktop & Mobile Full) */}
                            <div className={`
                     mt-8
                     ${isFullPlayer ? 'block w-full px-4' : 'hidden lg:block'}
                  `}>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={duration ? (progress / duration) * 100 : 0}
                                    onChange={handleProgressChange}
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={!duration}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 disabled:opacity-50"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                                    <span>{formatTime(progress)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description Box */}
                        <div className={`
                  mt-12
                  ${isFullPlayer ? 'block px-4 pb-8' : 'hidden lg:block'}
               `}>
                            <h3 className="text-2xl font-bold mb-4">About This Episode</h3>
                            <div className={`
                     text-gray-400 leading-relaxed text-lg rounded-2xl border border-gray-700
                     ${isFullPlayer ? 'bg-transparent border-none p-0' : 'p-6 bg-gray-800/50'}
                  `}>
                                <p>{currentEp?.desc}</p>
                                <div className="mt-4 flex items-center gap-2 text-sm text-orange-500 font-bold">
                                    <Calendar size={16} /> Published: {currentEp?.date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Playlist Sidebar --- */}
                    <div className="lg:w-1/3 w-full">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-orange-500" /> Recent Episodes
                        </h3>

                        <div className="space-y-3">
                            {episodes.slice(0, visibleCount).map((ep) => (
                                <div
                                    key={ep.id}
                                    onClick={() => playEpisode(ep)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border group ${
                                        currentEp?.id === ep.id
                                            ? 'bg-gray-800 border-orange-500/50 shadow-lg'
                                            : 'bg-transparent border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            <img src={ep.image} className="w-full h-full object-cover rounded-lg" alt="Thumbnail" />
                                            {currentEp?.id === ep.id && isPlaying && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`font-bold text-sm truncate pr-2 ${currentEp?.id === ep.id ? 'text-orange-500' : 'text-white group-hover:text-orange-400'}`}>
                                                    {ep.title}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2 mb-2">{ep.desc}</p>
                                            <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                                <span>{ep.date}</span>
                                                <span className="bg-gray-900 px-2 py-1 rounded border border-gray-700 flex items-center gap-1">
                                        <Clock size={10} /> Play
                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < episodes.length && (
                            <button
                                onClick={loadMore}
                                className="w-full mt-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Load More Episodes <ChevronDown size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}