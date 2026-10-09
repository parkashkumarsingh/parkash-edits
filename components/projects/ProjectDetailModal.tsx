"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Award,
  Cpu,
  Layers,
  Camera,
  Sliders,
  CheckCircle2,
  Share2,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tv,
  Film,
  Square,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Project } from "./ProjectsData";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

type FrameFormat = "reel" | "youtube" | "cinemascope" | "square";

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick, playTick } = useSound();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(90);
  const [specsOpen, setSpecsOpen] = useState(false);

  // Video resolution auto-detection
  const [videoDims, setVideoDims] = useState<{ width: number; height: number } | null>(null);

  // Detected or selected frame format
  const [frameFormat, setFrameFormat] = useState<FrameFormat>("youtube");
  const [isAutoDetected, setIsAutoDetected] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize frame format based on project data as fast fallback
  useEffect(() => {
    if (!project) return;

    document.body.style.overflow = "hidden";
    setIsPlaying(true);
    setVideoDims(null);
    setIsAutoDetected(true);

    const ratioStr = (project.aspectRatio || "").toLowerCase();
    const titleStr = (project.title || "").toLowerCase();

    if (
      ratioStr.includes("9:16") ||
      ratioStr.includes("reel") ||
      ratioStr.includes("vertical") ||
      titleStr.includes("reel") ||
      titleStr.includes("shorts")
    ) {
      setFrameFormat("reel");
    } else if (ratioStr.includes("2.39:1") || ratioStr.includes("cinemascope")) {
      setFrameFormat("cinemascope");
    } else if (ratioStr.includes("1:1") || ratioStr.includes("square")) {
      setFrameFormat("square");
    } else {
      setFrameFormat("youtube");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Handle keyboard shortcuts: ESC to close
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playClick();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, playClick]);

  if (!project) return null;

  // Auto-detect resolution and aspect ratio directly from loaded video stream
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const w = video.videoWidth;
    const h = video.videoHeight;

    if (w > 0 && h > 0) {
      setVideoDims({ width: w, height: h });
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }

      // Automatically determine frame format from actual video dimensions
      const ratio = w / h;

      if (ratio < 0.85) {
        // Vertical video (e.g. 9:16 Reel 1080x1920 or 4:5 1080x1350)
        setFrameFormat("reel");
      } else if (ratio >= 0.85 && ratio <= 1.25) {
        // Square video (e.g. 1:1 1080x1080)
        setFrameFormat("square");
      } else if (ratio >= 2.0) {
        // Anamorphic Cinemascope (e.g. 2.39:1 3840x1600)
        setFrameFormat("cinemascope");
      } else {
        // Standard Widescreen (e.g. 16:9 YouTube 1920x1080 or 3840x2160)
        setFrameFormat("youtube");
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
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
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime + frames * frameDuration
      );
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleShare = () => {
    playClick();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimecode = (seconds: number) => {
    const s = Math.floor(seconds);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    const ff = String(Math.floor((seconds % 1) * 24)).padStart(2, "0");
    return `00:${mm}:${ss}:${ff}`;
  };

  // Determine dynamic container sizing classes based on frame format
  const getContainerClasses = () => {
    switch (frameFormat) {
      case "reel":
        return "max-w-[420px] w-[92vw] rounded-[36px] border-2 border-neutral-700/70 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_60px_rgba(255,59,30,0.3)]";
      case "cinemascope":
        return "max-w-6xl w-full rounded-2xl border border-white/10 shadow-2xl";
      case "square":
        return "max-w-xl w-full rounded-2xl border border-white/10 shadow-2xl";
      case "youtube":
      default:
        return "max-w-5xl md:max-w-6xl w-full rounded-2xl border border-white/10 shadow-2xl";
    }
  };

  // Determine dynamic video viewport aspect ratio classes
  const getVideoAspectClasses = () => {
    switch (frameFormat) {
      case "reel":
        return "aspect-[9/16] max-h-[70vh] rounded-[24px]";
      case "cinemascope":
        return "aspect-[2.39/1] max-h-[75vh] rounded-none";
      case "square":
        return "aspect-square max-h-[68vh] rounded-none";
      case "youtube":
      default:
        return "aspect-video max-h-[75vh] rounded-none";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ perspective: "1400px" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            playClick();
            onClose();
          }
        }}
        className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-2xl overflow-y-auto flex items-center justify-center p-3 sm:p-6"
      >
        {/* Viewport Floating "Go Back" Navigation Controls */}
        <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[10002] flex items-center gap-2">
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/85 hover:bg-cinema-red border border-white/20 hover:border-cinema-red text-white text-xs font-mono font-bold tracking-wider transition-all shadow-[0_8px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl group cursor-pointer"
            title="Go back (Escape)"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>GO BACK</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-neutral-400 font-mono">
              ESC
            </span>
          </button>
        </div>

        {/* Viewport Floating Close Button on Top Right */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10002]">
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
            aria-label="Close modal"
            className="w-10 h-10 rounded-full bg-black/85 hover:bg-cinema-red border border-white/20 hover:border-cinema-red text-white flex items-center justify-center transition-all shadow-[0_8px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl group cursor-pointer"
            title="Close (Escape)"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Dynamic Auto-Adjusting Frame Container with Smooth Spring Resizing */}
        <motion.div
          layout
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className={`relative bg-surface-200 overflow-hidden flex flex-col my-auto transition-all duration-500 ease-out ${getContainerClasses()}`}
        >
          {/* Smartphone Dynamic Island Notch & Mobile Top Bar (Only shown in Reel size) */}
          {frameFormat === "reel" && (
            <div className="pt-3 pb-2 px-4 flex items-center justify-between bg-black/95 relative border-b border-white/10 select-none">
              {/* Native Phone Back Button */}
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
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-cinema-red text-white text-[11px] font-mono font-bold transition-all border border-white/10 cursor-pointer shadow-sm group"
                title="Go back to showcase"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>BACK</span>
              </button>

              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-black rounded-full border border-white/15 flex items-center justify-between px-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-cinema-red animate-pulse" />
              </div>

              {/* Top Bar Quick Close */}
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
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-cinema-red text-white flex items-center justify-center transition-all border border-white/15 cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 border-b border-white/10 bg-surface-300/90 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              {/* Clear Go Back Button on the header */}
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-cinema-red text-white text-xs font-mono font-bold transition-all border border-white/15 cursor-pointer shadow-sm group"
                title="Go back to showcase"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>BACK</span>
              </button>

              <div className="hidden xs:block">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cinema-red uppercase tracking-wider font-bold">
                    {frameFormat === "reel" ? "📱 REEL FRAME (9:16)" : "📺 YOUTUBE FRAME (16:9)"}
                  </span>
                  {videoDims && (
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono text-neutral-300">
                      {videoDims.width} × {videoDims.height}
                    </span>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[140px] sm:max-w-md">
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Header Right Controls: Frame Switcher & Close */}
            <div className="flex items-center gap-2">
              {/* Frame Format Override Selector */}
              <div className="hidden sm:flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10 text-[10px] font-mono">
                <button
                  onClick={() => {
                    playClick();
                    setFrameFormat("reel");
                    setIsAutoDetected(false);
                  }}
                  title="Force 9:16 Reel Phone Frame"
                  className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                    frameFormat === "reel"
                      ? "bg-cinema-red text-white font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>9:16</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setFrameFormat("youtube");
                    setIsAutoDetected(false);
                  }}
                  title="Force 16:9 YouTube Widescreen Frame"
                  className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                    frameFormat === "youtube"
                      ? "bg-cinema-cyan text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>16:9</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setFrameFormat("cinemascope");
                    setIsAutoDetected(false);
                  }}
                  title="Force 2.39:1 Cinemascope Frame"
                  className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                    frameFormat === "cinemascope"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>2.39:1</span>
                </button>
              </div>

              {/* Close Button */}
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
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-cinema-red hover:border-cinema-red transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Video Viewport Frame */}
          <div
            className={`relative bg-black overflow-hidden group flex items-center justify-center select-none ${getVideoAspectClasses()}`}
          >
            <video
              ref={videoRef}
              src={project.videoUrl || project.mediaUrl}
              poster={project.poster}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Play Overlay Button if paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-black/45 flex items-center justify-center cursor-pointer z-20 backdrop-blur-[2px]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cinema-red flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,59,30,0.7)] transform hover:scale-105 transition-transform">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Live Aspect Ratio Auto-Detected HUD Tag */}
            <div className="absolute top-3 right-3 pointer-events-none px-2.5 py-1 rounded-full bg-black/75 backdrop-blur border border-white/15 font-mono text-[9px] text-white flex items-center gap-1.5 shadow-lg z-20">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  frameFormat === "reel" ? "bg-cinema-red" : "bg-cinema-cyan"
                }`}
              />
              <span>
                {frameFormat === "reel" ? "AUTO REEL FRAME" : "AUTO YOUTUBE FRAME"}
              </span>
              <span>•</span>
              <span className="text-neutral-300">{formatTimecode(currentTime)}</span>
            </div>

            {/* Reel In-Video Mobile Back Button */}
            {frameFormat === "reel" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClick();
                  onClose();
                }}
                onMouseEnter={() => {
                  playHover();
                  setCursor("pointer");
                }}
                onMouseLeave={resetCursor}
                className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-cinema-red border border-white/20 text-white font-mono text-xs font-bold transition-all backdrop-blur-md shadow-xl group cursor-pointer"
                title="Go back to showcase"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>BACK</span>
              </button>
            )}

            {/* Reel Quick Sound Toggle Overlay for mobile feel */}
            {frameFormat === "reel" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute bottom-3 right-3 p-2 rounded-full bg-black/75 backdrop-blur border border-white/20 text-white z-20 hover:bg-cinema-red transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-cinema-red" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Player Transport & Timecode Bar */}
          <div className="px-4 sm:px-6 py-3 bg-surface-300 border-b border-white/10 space-y-2">
            {/* Interactive Scrubber */}
            <div
              onClick={handleScrub}
              className="relative w-full h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden group"
            >
              <div
                className="h-full bg-gradient-to-r from-cinema-red to-[#ff7a59] rounded-full relative"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>

            {/* Transport Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-cinema-red hover:text-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => stepFrame(-1)}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
                  title="-1 frame (24fps)"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => stepFrame(1)}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
                  title="+1 frame (24fps)"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>

                <div className="text-cinema-red font-bold text-[11px] pl-1">
                  {formatTimecode(currentTime)} / {formatTimecode(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-cinema-red" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white text-[10px]"
                >
                  {copied ? "COPIED" : "SHARE"}
                </button>

                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1 text-[10px]"
                  >
                    <Download className="w-3 h-3" />
                    <span>RAW</span>
                  </a>
                )}

                {/* Specs Drawer Toggle Button */}
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 text-white text-[10px] font-bold"
                >
                  <Info className="w-3 h-3" />
                  <span>SPECS</span>
                  {specsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Project Details & Pipeline Specs Drawer */}
          <AnimatePresence>
            {specsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 md:p-6 bg-surface-100/90 border-t border-white/10 space-y-5 max-h-[35vh] overflow-y-auto font-mono text-xs"
              >
                {/* Meta Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">CLIENT</span>
                    <span className="text-white font-bold">{project.client}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">ROLE</span>
                    <span className="text-cinema-red font-bold">{project.role}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">YEAR / TIME</span>
                    <span className="text-white font-bold">{project.year} • {project.duration || "01:00"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">FORMAT</span>
                    <span className="text-cinema-cyan font-bold">{project.aspectRatio}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 font-sans">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider block">
                    PROJECT OVERVIEW
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Software tags */}
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
                  {project.techSpecs.software.map((sw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 text-[10px]"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom "Go Back to Showcase" Action Bar */}
          <div className="p-3 bg-surface-300/95 border-t border-white/10 flex items-center justify-between">
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-cinema-red text-white text-xs font-mono font-bold tracking-wider transition-all shadow-md group cursor-pointer border border-white/10 hover:border-cinema-red"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>← GO BACK TO SHOWCASE</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
