'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentEp, setCurrentEp] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullPlayer, setIsFullPlayer] = useState(false);

    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current || !currentEp) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setProgress(0);
        }
    };

    const playEpisode = (ep) => {
        setCurrentEp(ep);
        setIsPlaying(true);
        // Reset state for new track
        setProgress(0);
        // Expand player on mobile when starting a new track
        if (window.innerWidth < 1024) setIsFullPlayer(true);

        setTimeout(() => {
            if(audioRef.current) {
                audioRef.current.load();
                audioRef.current.play().catch(e => console.error("Playback error:", e));
            }
        }, 50);
    };

    const skip = (seconds) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds;
        }
    };

    const handleProgressChange = (val) => {
        const newTime = (val / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentEp, setCurrentEp,
            isPlaying, setIsPlaying,
            progress, duration,
            isFullPlayer, setIsFullPlayer,
            togglePlay, stop, playEpisode, skip,
            handleProgressChange,
            audioRef, onTimeUpdate
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    return useContext(PlayerContext);
}