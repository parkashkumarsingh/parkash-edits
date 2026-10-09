"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Film,
  Layers,
  ChevronLeft,
  ChevronRight,
  Monitor
} from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REELS = [
  {
    id: "master",
    title: "2026 EDITING & MOTION SHOWREEL",
    category: "Best Work Showcase",
    duration: "02:18",
    aspectRatio: "cinemascope",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80",
    specs: "4K 60FPS • PREMIERE PRO & AFTER EFFECTS",
  },
  {
    id: "reels",
    title: "HIGH-RETENTION REELS & SHORTS COMPILATION",
    category: "Vertical Content",
    duration: "01:30",
    aspectRatio: "16:9",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80",
    specs: "9:16 VERTICAL • ANIMATED HOOKS & SFX",
  },
  {
    id: "commercial",
    title: "BRAND COMMERCIALS & PRODUCT PROMOS",
    category: "Commercial Editing",
    duration: "01:52",
    aspectRatio: "16:9",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80",
    specs: "COMMERCIAL PACING • COLOR GRADED",
  },
  {
    id: "motion",
    title: "MOTION GRAPHICS & KINETIC TYPOGRAPHY",
    category: "After Effects Motion",
    duration: "01:45",
    aspectRatio: "cinemascope",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    specs: "AFTER EFFECTS • TITLE ANIMATIONS • SOUND DESIGN",
  },
];

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose }) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick, playTick } = useSound();

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(138);
  const [aspectRatioMode, setAspectRatioMode] = useState<"cinemascope" | "16:9" | "9:16">("cinemascope");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeReel = REELS[activeReelIndex];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsPlaying(true);
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const togglePlay = () => {
    playClick();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    playClick();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    playTick();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = pct * duration;
      setCurrentTime(pct * duration);
    }
  };

  const stepFrame = (frames: number) => {
    playTick();
    if (videoRef.current) {
      const frameDuration = 1 / 24;
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + frames * frameDuration);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const changeSpeed = () => {
    playClick();
    const speeds = [0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const toggleFullscreen = () => {
    playClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimecode = (seconds: number) => {
    const s = Math.floor(seconds);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    const ff = String(Math.floor((seconds % 1) * 24)).padStart(2, "0");
    return `00:${mm}:${ss}:${ff}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8"
        >
          {/* Top Cinema Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 select-none">
            <div className="flex items-center gap-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cinema-red animate-pulse" />
              <div>
                <p className="text-[11px] font-mono uppercase text-cinema-red tracking-widest">
                  CINEMA SCREENING ROOM • {activeReel.category}
                </p>
                <h3 className="text-sm md:text-base font-bold text-white tracking-wide">
                  {activeReel.title}
                </h3>
              </div>
            </div>

            {/* Reel switcher tabs */}
            <div className="hidden lg:flex items-center gap-2 bg-surface-200/80 p-1 rounded-full border border-white/10">
              {REELS.map((reel, idx) => (
                <button
                  key={reel.id}
                  onClick={() => {
                    playClick();
                    setActiveReelIndex(idx);
                  }}
                  onMouseEnter={playHover}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                    idx === activeReelIndex
                      ? "bg-cinema-red text-white font-bold shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  REEL 0{idx + 1}
                </button>
              ))}
            </div>

            {/* Close modal button */}
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              onMouseEnter={() => {
                playHover();
                setCursor("pointer");
              }}
              onMouseLeave={resetCursor}
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-cinema-red hover:border-cinema-red transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Video Viewport */}
          <div
            ref={containerRef}
            className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-xl bg-black border border-white/5 shadow-2xl"
          >
            {/* The Video Element */}
            <div
              className={`relative transition-all duration-500 overflow-hidden shadow-2xl ${
                aspectRatioMode === "cinemascope"
                  ? "w-full max-w-6xl aspect-[2.39/1]"
                  : aspectRatioMode === "16:9"
                  ? "w-full max-w-5xl aspect-video"
                  : "h-full aspect-[9/16] max-h-[80vh]"
              }`}
            >
              <video
                ref={videoRef}
                src={activeReel.videoUrl}
                poster={activeReel.poster}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Watermark Slate Overlay */}
              <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono tracking-widest text-white/50 bg-black/40 backdrop-blur px-2.5 py-1 rounded border border-white/10">
                PRORES 4444 XQ // {activeReel.specs}
              </div>

              {/* Centered Play overlay when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-cinema-red/90 flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,59,30,0.6)]">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Player Control Suite */}
          <div className="bg-surface-200/90 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-xl">
            {/* Scrub Bar */}
            <div
              onClick={handleScrub}
              onMouseEnter={() => setCursor("scrub")}
              onMouseLeave={resetCursor}
              className="relative w-full h-3 bg-white/10 rounded-full cursor-pointer overflow-hidden group py-1"
            >
              <div
                className="h-full bg-gradient-to-r from-cinema-red to-[#ff6b4a] rounded-full relative"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] scale-0 group-hover:scale-100 transition-transform" />
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              {/* Play / Frame / Timecode */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-cinema-red hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                {/* Frame backward */}
                <button
                  onClick={() => stepFrame(-1)}
                  title="-1 Frame (24fps)"
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Frame forward */}
                <button
                  onClick={() => stepFrame(1)}
                  title="+1 Frame (24fps)"
                  className="px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Running Timecode */}
                <div className="px-3 py-1 bg-black/60 rounded border border-white/10 text-cinema-red font-bold">
                  {formatTimecode(currentTime)}
                  <span className="text-neutral-500 font-normal ml-2">/ {formatTimecode(duration)}</span>
                </div>
              </div>

              {/* Aspect Ratio & Speed Selectors */}
              <div className="flex items-center gap-3">
                {/* Aspect ratio */}
                <div className="flex items-center gap-1 bg-black/40 rounded p-1 border border-white/10">
                  <button
                    onClick={() => {
                      playClick();
                      setAspectRatioMode("cinemascope");
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      aspectRatioMode === "cinemascope" ? "bg-cinema-red text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    2.39:1
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      setAspectRatioMode("16:9");
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      aspectRatioMode === "16:9" ? "bg-cinema-red text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    16:9
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      setAspectRatioMode("9:16");
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      aspectRatioMode === "9:16" ? "bg-cinema-red text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    9:16
                  </button>
                </div>

                {/* Playback speed */}
                <button
                  onClick={changeSpeed}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
                >
                  {playbackSpeed}x
                </button>

                {/* Audio mute */}
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-cinema-red" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
