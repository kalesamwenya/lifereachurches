"use client";

import { useRef, useState, useEffect } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from "lucide-react";

export default function VideoPlayerModal({ sermon, onClose }) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Sync internal player state if video ends naturally
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);
    video.addEventListener("ended", handleEnded);
    
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((err) => console.log("Playback interrupted:", err));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  }

  function handleLoaded() {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    setIsVideoLoaded(true);
  }

  function seek(e) {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const newTime = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(e.target.value);
  }

  function skip(seconds) {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime += seconds;
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.muted) {
      setVolume(0);
    } else {
      setVolume(video.volume || 1);
    }
  }

  function changeVolume(e) {
    const video = videoRef.current;
    if (!video) return;

    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    setMuted(val === 0);
    video.muted = val === 0;
  }

  function formatTime(time) {
    if (isNaN(time) || time === Infinity) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function fullscreen() {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE11 */
      video.msRequestFullscreen();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in">
      {/* BACKGROUND DISMISSAL LAYER */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-5xl bg-zinc-950 rounded-2xl overflow-hidden relative shadow-2xl border border-zinc-800/50 z-10">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white/70 hover:text-white p-2 rounded-full bg-black/40 backdrop-blur-sm transition-colors shadow"
          aria-label="Close Player"
        >
          <X size={22} />
        </button>

        {/* VIDEO FRAME PANEL */}
        <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
          
          {/* STATIC PRE-LOAD POSTER THUMBNAIL BACKDROP */}
          {!isPlaying && sermon.image && (
            <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500">
              {/* Blurred Ambient Glow Layer */}
              <img 
                src={sermon.image} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
              />
              {/* Sharp Center Thumbnail Image */}
              <img 
                src={sermon.image} 
                alt={sermon.title} 
                className={`w-full h-full object-contain relative z-10 transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-90'}`}
              />
              {/* Soft Gradient Mask overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-20" />
            </div>
          )}

          <video
            ref={videoRef}
            src={sermon.video_url}
            className="w-full h-full max-h-[75vh] cursor-pointer relative z-10 object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoaded}
            onClick={togglePlay}
            playsInline
          />
          
          {/* MIDDLE HUD OVERLAY STATE ICON */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 cursor-pointer transition-all z-30"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600/95 text-white rounded-full flex items-center justify-center pl-1.5 shadow-xl transform scale-100 hover:scale-105 transition-transform duration-200">
                <Play size={36} className="sm:w-10 sm:h-10" fill="currentColor" />
              </div>
              
              {/* Embedded Mini Title Content Info Banner */}
              <div className="mt-4 px-4 text-center max-w-xl hidden sm:block">
                <span className="text-xs font-black uppercase tracking-widest text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-900/40">
                  {sermon.series_name || "Special Sermon"}
                </span>
                <h2 className="text-white font-black text-xl lg:text-2xl mt-2 drop-shadow-md line-clamp-1 italic uppercase">
                  {sermon.title}
                </h2>
                <p className="text-zinc-300 text-xs font-semibold mt-1 drop-shadow">
                  {sermon.preacher}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS HUB BOX */}
        <div className="bg-zinc-900 text-zinc-100 p-3 sm:p-4 space-y-3 selection:bg-transparent relative z-40 border-t border-zinc-800">

          {/* TIMELINE RANGE SLIDER */}
          <div className="flex items-center gap-3 group/timeline">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress || 0}
              onChange={seek}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-orange-600 bg-zinc-700/60 focus:outline-none transition-all group-hover/timeline:h-2"
            />
          </div>

          {/* ACTION TOOLBAR BUTTONS */}
          <div className="flex items-center justify-between gap-4">

            {/* LEFT CONTROLS CONTAINER */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={togglePlay} 
                className="hover:text-orange-500 text-zinc-200 transition-colors focus:outline-none"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>

              <button 
                onClick={() => skip(-10)} 
                className="hover:text-orange-500 text-zinc-400 transition-colors focus:outline-none"
                title="Rewind 10s"
              >
                <RotateCcw size={18} />
              </button>

              <button 
                onClick={() => skip(10)} 
                className="hover:text-orange-500 text-zinc-400 transition-colors focus:outline-none"
                title="Fast Forward 10s"
              >
                <RotateCw size={18} />
              </button>

              <span className="text-xs font-mono font-medium text-zinc-400 select-none ml-1">
                {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration)}
              </span>
            </div>

            {/* RIGHT CONTROLS CONTAINER */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 group/volume">
                <button 
                  onClick={toggleMute} 
                  className="hover:text-orange-500 text-zinc-400 transition-colors focus:outline-none"
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={changeVolume}
                  className="w-0 overflow-hidden opacity-0 group-hover/volume:w-16 sm:group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 h-1 rounded-lg appearance-none cursor-pointer accent-orange-600 bg-zinc-700 focus:outline-none"
                />
              </div>

              <button 
                onClick={fullscreen} 
                className="hover:text-orange-500 text-zinc-400 transition-colors focus:outline-none p-1"
                title="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}