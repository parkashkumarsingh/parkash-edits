"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowUpRight, Disc3, Sparkles, Sliders, ShieldCheck } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";
import { HeroFallback3D } from "./HeroFallback3D";

// Dynamically import Three.js 3D canvas with fallback
const DynamicHeroScene3D = dynamic(
  () => import("./HeroScene3D").then((mod) => mod.HeroScene3D),
  {
    ssr: false,
    loading: () => <HeroFallback3D mousePosition={{ x: 0, y: 0 }} />,
  }
);

// 2D Interactive Adobe Creative Cloud App Badges
const ADOBE_APPS = [
  {
    id: "ae",
    name: "After Effects",
    short: "Ae",
    color: "#9999FF",
    bg: "#00005B",
    glow: "rgba(153, 153, 255, 0.6)",
    icon: "/adobe/after-effects.png",
    pos: "-top-3 -left-4 sm:-left-10 lg:-left-16",
    repelX: -36,
    repelY: -28,
    tilt: -8,
  },
  {
    id: "ps",
    name: "Photoshop",
    short: "Ps",
    color: "#31A8FF",
    bg: "#001E36",
    glow: "rgba(49, 168, 255, 0.6)",
    icon: "/adobe/photoshop.png",
    pos: "-top-3 -right-4 sm:-right-10 lg:-right-16",
    repelX: -26,
    repelY: -34,
    tilt: 7,
  },
  {
    id: "pr",
    name: "Premiere Pro",
    short: "Pr",
    color: "#EA77FF",
    bg: "#2A004E",
    glow: "rgba(234, 119, 255, 0.6)",
    icon: "/adobe/premiere.png",
    pos: "bottom-10 -left-4 sm:-left-10 lg:-left-16",
    repelX: -32,
    repelY: -22,
    tilt: -6,
  },
  {
    id: "ai",
    name: "Illustrator",
    short: "Ai",
    color: "#FF9A00",
    bg: "#330000",
    glow: "rgba(255, 154, 0, 0.6)",
    icon: "/adobe/illustrator.png",
    pos: "bottom-10 -right-4 sm:-right-10 lg:-right-16",
    repelX: -24,
    repelY: -30,
    tilt: 8,
  },
];

interface HeroSectionProps {
  onOpenReel: () => void;
  onOpenContact: () => void;
  onOpenCMS?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenReel, onOpenContact, onOpenCMS }) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [isClient, setIsClient] = useState(false);

  // Parallax scroll hooks
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, 160]);
  const titleOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);
  const sceneScale = useTransform(scrollY, [0, 700], [1, 0.85]);

  useEffect(() => {
    setIsClient(true);

    // Live 24fps Timecode Generator
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const fps = 24;
      const totalSeconds = Math.floor(frame / fps);
      const ff = String(frame % fps).padStart(2, "0");
      const ss = String(totalSeconds % 60).padStart(2, "0");
      const mm = String(Math.floor((totalSeconds / 60) % 60)).padStart(2, "0");
      const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      setTimecode(`${hh}:${mm}:${ss}:${ff}`);
    }, 1000 / 24);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = -(e.clientY / innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const { innerWidth, innerHeight } = window;
        const x = (touch.clientX / innerWidth) * 2 - 1;
        const y = -(touch.clientY / innerHeight) * 2 + 1;
        setMousePos({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-between overflow-hidden bg-[#050508] px-6 md:px-12 lg:px-20 pt-28 pb-16">
      {/* Background Volumetric Lighting & Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cinema-red/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cinema-cyan/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050508]/60 to-[#050508] pointer-events-none" />

      {/* 3D Interactive Environment Canvas */}
      <motion.div style={{ scale: sceneScale }} className="absolute inset-0 pointer-events-none">
        {isClient && <DynamicHeroScene3D mousePosition={mousePos} />}
      </motion.div>

      {/* 2D Interactive Floating Adobe Logos - Shifted to Right Side to Orbit Around Photographer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 flex items-center justify-center lg:justify-end lg:pr-[6vw] xl:pr-[9vw] 2xl:pr-[13vw] overflow-hidden">
        <div className="relative w-[320px] h-[460px] sm:w-[400px] sm:h-[560px] lg:w-[440px] lg:h-[620px] pointer-events-none flex items-center justify-center">
          {ADOBE_APPS.map((app) => (
            <motion.div
              key={app.id}
              animate={{
                x: mousePos.x * app.repelX,
                y: mousePos.y * app.repelY,
                rotate: mousePos.x * app.tilt,
              }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 180,
              }}
              whileHover={{ scale: 1.15, zIndex: 30 }}
              onMouseEnter={playHover}
              style={{
                boxShadow: `0 0 35px ${app.glow}`,
              }}
              className={`absolute ${app.pos} pointer-events-auto cursor-pointer group flex items-center justify-center rounded-2xl border-2 transition-all duration-300 backdrop-blur-xl p-2 sm:p-2.5`}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: app.bg,
                  borderColor: app.color,
                }}
              >
                {/* Stylized fallback glyph */}
                <span
                  className="absolute font-sans font-black text-xl sm:text-2xl lg:text-3xl select-none"
                  style={{ color: app.color }}
                >
                  {app.short}
                </span>

                {/* High-res PNG logo overlay */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={app.icon}
                  alt={app.name}
                  className="relative z-10 w-full h-full object-contain rounded-xl drop-shadow-md"
                />
              </div>

              {/* Tooltip on Hover */}
              <div
                className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-2.5 py-1 rounded bg-black/95 border border-white/20 text-[10px] font-mono font-bold tracking-wider whitespace-nowrap shadow-xl"
                style={{ color: app.color }}
              >
                {app.name.toUpperCase()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full flex flex-col justify-between h-full min-h-[calc(100vh-11rem)]">
        {/* Top Production Slate Metadata Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] font-mono tracking-wider text-neutral-400 mb-6 select-none"
        >
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <span className="text-white font-bold">REC</span>
            <span className="text-neutral-500">|</span>
            <span className="text-cinema-red font-mono font-semibold">{timecode}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08]">
            <span className="text-neutral-400">TOOLS:</span>
            <span className="text-cinema-cyan font-semibold">PREMIERE & AFTER EFFECTS</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08]">
            <span className="text-neutral-400">AVAILABILITY:</span>
            <span className="text-white font-semibold">OPEN FOR PROJECTS</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-neutral-300">STUDIO ACTIVE</span>
          </div>
        </motion.div>

        {/* Huge Editorial Typography introducing expertise */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="space-y-4 select-none max-w-xl xl:max-w-2xl my-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2.5"
          >
            <span className="h-[2px] w-6 sm:w-10 bg-cinema-red" />
            <p className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase text-cinema-red font-bold">
              Video Editor • Motion Graphics Designer
            </p>
          </motion.div>

          {/* Primary Expertise Typography - Punchy 3-line poster lockup */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.4rem] 2xl:text-[4rem] font-black tracking-tight leading-[0.98] uppercase text-white font-sans"
          >
            <span className="block hover:text-white/80 transition-colors whitespace-nowrap">
              ENGAGING VIDEO EDITS
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cinema-cyan via-white to-neutral-400 whitespace-nowrap">
              MOTION GRAPHICS
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cinema-red via-[#ff7a59] to-cinema-gold whitespace-nowrap">
              THAT HOOK VIEWERS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="pt-2 max-w-lg lg:max-w-xl text-xs sm:text-sm lg:text-base text-neutral-300/90 font-normal leading-relaxed tracking-wide font-sans"
          >
            I craft high-retention YouTube edits, viral social media reels, commercial brand videos, and dynamic motion graphics with clean pacing, sound design, and color grading.
          </motion.p>

          {/* Adobe Creative Suite Active Toolkit Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="pt-2 flex flex-wrap items-center gap-2 select-none max-w-xl"
          >
            <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase pr-1 font-semibold">
              Active Toolkit:
            </span>
            {ADOBE_APPS.map((app) => (
              <div
                key={app.id}
                onMouseEnter={playHover}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold tracking-wider backdrop-blur-md transition-all hover:scale-105 cursor-default"
                style={{
                  backgroundColor: `${app.bg}99`,
                  borderColor: `${app.color}80`,
                  color: app.color,
                  boxShadow: `0 0 12px ${app.glow}`,
                }}
              >
                <span>{app.short}</span>
                <span className="text-[10px] text-white/80 font-normal">
                  {app.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Primary Interactive Actions */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="pt-6 sm:pt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 max-w-xl"
          >
            {/* Watch Showreel Button */}
            <button
              onClick={() => {
                playClick();
                onOpenReel();
              }}
              onMouseEnter={() => {
                playHover();
                setCursor("play", "REEL");
              }}
              onMouseLeave={resetCursor}
              className="group relative inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-cinema-red text-white font-mono text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 hover:bg-[#ff4d30] hover:shadow-[0_0_35px_rgba(255,59,30,0.5)] active:scale-95 cursor-pointer shadow-lg"
            >
              <div className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center transition-transform group-hover:scale-110">
                <Play className="w-3 h-3 fill-current text-white translate-x-0.5" />
              </div>
              <span>WATCH 2026 REEL</span>
              <span className="text-[10px] text-white/70 font-normal tracking-normal border-l border-white/30 pl-2.5">
                02:18 • 4K
              </span>
            </button>

            {/* Explore Gallery Button */}
            <a
              href="#video-work"
              onClick={playClick}
              onMouseEnter={() => {
                playHover();
                setCursor("pointer");
              }}
              onMouseLeave={resetCursor}
              className="group relative inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-surface-100/80 border border-white/10 text-white font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-surface-50 active:scale-95 cursor-pointer"
            >
              <span>EXPLORE SHOWCASE</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Quick CMS Dashboard Link */}
            {onOpenCMS && (
              <button
                onClick={() => {
                  playClick();
                  onOpenCMS();
                }}
                onMouseEnter={() => {
                  playHover();
                  setCursor("pointer");
                }}
                onMouseLeave={resetCursor}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-cinema-cyan text-xs font-mono transition-all cursor-pointer"
                title="Open CMS Studio"
              >
                <Sliders className="w-3.5 h-3.5 text-cinema-cyan" />
                <span>CMS STUDIO</span>
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom Editorial Specs Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="pt-8 sm:pt-10 flex flex-wrap items-center justify-between border-t border-white/[0.08] text-[11px] sm:text-xs font-mono text-neutral-400 select-none gap-4"
        >
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cinema-red" />
              <span>REELS & SHORTS</span>
            </div>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <div className="hidden sm:flex items-center gap-2">
              <span>YOUTUBE LONG FORM</span>
            </div>
            <span className="hidden md:inline text-neutral-600">•</span>
            <div className="hidden md:flex items-center gap-2">
              <span>MOTION GRAPHICS & TITLES</span>
            </div>
            <span className="hidden lg:inline text-neutral-600">•</span>
            <div className="hidden lg:flex items-center gap-2">
              <span>SOUND DESIGN & COLOR</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-neutral-400">
            <span className="text-[10px] sm:text-[11px] tracking-wider uppercase">SCROLL FOR SHOWCASE</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="text-cinema-red text-sm"
            >
              ↓
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
