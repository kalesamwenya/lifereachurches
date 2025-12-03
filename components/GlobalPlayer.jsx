'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Mic, ChevronDown, Square } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function GlobalPlayer() {
    const {
        currentEp, isPlaying, progress, duration, isFullPlayer,
        togglePlay, stop, skip, handleProgressChange,
        audioRef, onTimeUpdate, setIsFullPlayer
    } = usePlayer();

    if (!currentEp) return null;

    const handlePlayerClick = () => {
        if (window.innerWidth < 1024 && !isFullPlayer) {
            setIsFullPlayer(true);
        }
    };

    return (
        <div
            onClick={handlePlayerClick}
            className={`
        transition-all duration-300 ease-in-out z-[100]
        ${isFullPlayer
                ? 'fixed inset-0 bg-gray-900 flex flex-col justify-center px-6'
                : 'fixed bottom-0 left-0 w-full cursor-pointer lg:cursor-default'
            }
      `}
        >
            <div className={`
          bg-gray-900 lg:bg-gradient-to-br lg:from-gray-800 lg:to-gray-900 
          border-t border-gray-800 lg:border-none 
          relative overflow-hidden mx-auto
          ${isFullPlayer ? 'h-full flex flex-col justify-center border-none w-full' : 'p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] w-full lg:w-2/3 lg:rounded-t-3xl lg:mb-0'}
       `}>

                {/* Close Button (Mobile Full Only) */}
                {isFullPlayer && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsFullPlayer(false); }}
                        className="absolute top-8 right-6 p-3 bg-gray-800 text-white rounded-full z-[110] shadow-xl border border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                        <ChevronDown size={32} />
                    </button>
                )}

                {/* Hidden Audio Element */}
                <audio
                    ref={audioRef}
                    src={currentEp?.url}
                    onTimeUpdate={onTimeUpdate}
                    onEnded={() => togglePlay()}
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
                            : 'w-14 h-14 rounded-lg lg:w-20 lg:h-20 lg:rounded-xl'
                        }
                `}
                        style={{backgroundImage: `url("${currentEp?.image}")`}}
                    ></div>

                    <div className="flex-1 w-full min-w-0">
                        {/* Title */}
                        <h2 className={`
                   font-bold text-white truncate pr-2
                   ${isFullPlayer ? 'text-2xl md:text-3xl mb-2 whitespace-normal' : 'text-sm lg:text-xl lg:font-bold mb-1'}
                `}>
                            {currentEp?.title}
                        </h2>

                        {/* Description (Mobile Full Only) */}
                        <p className={`
                   text-gray-400 mb-6 text-sm line-clamp-2
                   ${isFullPlayer ? 'block px-4' : 'hidden'}
                `}>
                            {currentEp?.desc}
                        </p>

                        {/* Mobile Mini Progress Bar */}
                        {!isFullPlayer && (
                            <div className="lg:hidden w-full mb-2 mt-1">
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
                                    onClick={(e) => { e.stopPropagation(); skip(-15); }}
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
                                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                                    className={`
                             rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg shadow-orange-900/50 bg-orange-600
                             ${isFullPlayer ? 'w-20 h-20' : 'w-10 h-10 lg:w-14 lg:h-14'}
                          `}
                                >
                                    {isPlaying
                                        ? <Pause size={isFullPlayer ? 32 : (window.innerWidth < 1024 ? 20 : 24)} fill="currentColor" />
                                        : <Play size={isFullPlayer ? 32 : (window.innerWidth < 1024 ? 20 : 24)} fill="currentColor" className="ml-1" />
                                    }
                                </button>

                                {/* Stop Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); stop(); }}
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
                                    onClick={(e) => { e.stopPropagation(); skip(15); }}
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
             mt-4 lg:mt-6
             ${isFullPlayer ? 'block w-full px-4' : 'hidden lg:block'}
          `}>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 font-mono w-10 text-right">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={duration ? (progress / duration) * 100 : 0}
                            onChange={(e) => handleProgressChange(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 disabled:opacity-50"
                        />
                        <span className="text-xs text-gray-500 font-mono w-10">{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}