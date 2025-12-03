'use client';

import React, { useState, useEffect } from 'react';
import { Play, Mic, Calendar, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

// --- Fallback Data ---
const fallbackEpisodes = [
    {
        id: 101,
        title: "Welcome to Life Reach (Fallback)",
        desc: "We are having trouble connecting to the live feed. Please try again later.",
        date: new Date().toLocaleDateString(),
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "00:00",
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?auto=format&fit=crop&q=80&w=400"
    }
];

export default function PodcastPage() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);

    // Use Global Player Context
    const { playEpisode, currentEp, isPlaying } = usePlayer();

    useEffect(() => {
        const fetchPodcast = async () => {
            try {
                const RSS_URL = 'https://anchor.fm/s/128a41cc/podcast/rss';
                const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`);

                if (!response.ok) throw new Error("Network response was not ok");

                const xmlText = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, "text/xml");

                if (xml.querySelector("parsererror")) throw new Error("XML Parsing Error");

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
                    const imageTag = item.getElementsByTagName("itunes:image")[0];
                    const image = imageTag ? imageTag.getAttribute("href") : channelImage;

                    return {
                        id: index,
                        title: title || `Episode ${index + 1}`,
                        desc: description,
                        date: pubDate,
                        url: audioUrl,
                        image: image || "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?auto=format&fit=crop&q=80&w=400"
                    };
                });

                if (parsedEpisodes.length > 0) {
                    setEpisodes(parsedEpisodes);
                } else {
                    throw new Error("No episodes found.");
                }
                setLoading(false);

            } catch (err) {
                console.warn("RSS Fetch failed:", err);
                setEpisodes(fallbackEpisodes);
                setError("Could not load latest episodes. Showing offline data.");
                setLoading(false);
            }
        };

        fetchPodcast();
    }, []);

    const loadMore = () => {
        setVisibleCount(prev => prev + 5);
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
        <div className="bg-gray-900 text-white min-h-screen pt-32 pb-48">
            <div className="container mx-auto px-6">
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 mb-8 flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="lg:w-2/3 w-full">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700 shadow-2xl mb-8">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-orange-600 rounded-2xl text-white">
                                    <Mic size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black mb-2">The Life Reach Podcast</h1>
                                    <p className="text-gray-400">Weekly conversations on faith, culture, and leadership.</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-orange-500" /> Recent Episodes
                        </h3>

                        <div className="space-y-4">
                            {episodes.slice(0, visibleCount).map((ep) => (
                                <div
                                    key={ep.id}
                                    onClick={() => playEpisode(ep)}
                                    className={`p-6 rounded-2xl cursor-pointer transition-all border group flex flex-col md:flex-row gap-6 ${
                                        currentEp?.id === ep.id
                                            ? 'bg-gray-800 border-orange-500/50 shadow-lg'
                                            : 'bg-transparent border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                                    }`}
                                >
                                    <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                                        <img src={ep.image} className="w-full h-full object-cover rounded-xl" alt="Thumbnail" />
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl transition-opacity ${currentEp?.id === ep.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                                <Play size={18} fill="currentColor" className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className={`font-bold text-xl mb-2 ${currentEp?.id === ep.id ? 'text-orange-500' : 'text-white group-hover:text-orange-400'}`}>
                                            {ep.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{ep.desc}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 uppercase font-bold tracking-wider">
                                            <span className="flex items-center gap-1"><Calendar size={12}/> {ep.date}</span>
                                            <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700 hover:border-orange-500 hover:text-white transition-colors">
                                    Listen Now
                                </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < episodes.length && (
                            <button
                                onClick={loadMore}
                                className="w-full mt-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-2xl border border-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Load More Episodes <ChevronDown size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:w-1/3 w-full">
                        <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-white">Subscribe</h3>
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-gray-900 rounded-xl border border-gray-600 hover:border-white transition-colors text-sm font-bold">Apple Podcasts</button>
                                <button className="w-full py-3 bg-gray-900 rounded-xl border border-gray-600 hover:border-green-500 transition-colors text-sm font-bold">Spotify</button>
                                <button className="w-full py-3 bg-gray-900 rounded-xl border border-gray-600 hover:border-red-500 transition-colors text-sm font-bold">YouTube</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}