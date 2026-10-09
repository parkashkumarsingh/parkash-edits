"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Film, Compass, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

const STATS = [
  { value: "250+", label: "VIDEOS & GRAPHICS EDITED", sub: "YouTube, Reels, ads & social posts" },
  { value: "15M+", label: "TOTAL VIEWS GENERATED", sub: "Across client YouTube & Instagram channels" },
  { value: "48H", label: "AVERAGE FIRST DRAFT", sub: "Fast turnaround without sacrificing quality" },
  { value: "100%", label: "CLIENT SATISFACTION", sub: "Dedicated communication & quick revisions" },
];

export const AboutSection: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover } = useSound();

  return (
    <section id="about" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#07080c] border-t border-white/[0.06]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-cinema-red/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-red tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <span>04 // ABOUT THE EDITOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            CRAFTING VIDEOS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-red via-white to-cinema-cyan">
              THAT KEEP ATTENTION
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm text-neutral-400 font-normal leading-relaxed">
          Specializing in high-energy video editing, smooth motion graphics, and punchy visual storytelling that elevates your brand and keeps viewers hooked.
        </p>
      </div>

      {/* Main Grid: Portrait & Bio Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        {/* Left: Editor Portrait Frame */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-surface-200 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80"
              alt="Parkash - Video Editor & Motion Designer"
              className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

            {/* Corner Technical Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono">
              <p className="text-cinema-red font-bold uppercase tracking-wider">PARKASH</p>
              <p className="text-neutral-300">VIDEO EDITOR & MOTION GRAPHICS DESIGNER</p>
              <p className="text-[10px] text-neutral-500 mt-1">AVAILABLE WORLDWIDE • REMOTE FREELANCE</p>
            </div>
          </div>
        </div>

        {/* Right: Editorial Narrative Bio */}
        <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
            "GREAT EDITING ISN'T JUST CUTTING CLIPS — IT'S CONTROLLING THE VIEWER'S ATTENTION EVERY SECOND."
          </h3>

          <p>
            Hi, I'm Parkash. I help YouTubers, brands, and content creators turn raw footage into engaging videos that hold viewer attention and drive real results.
          </p>

          <p>
            Whether it's fast-paced Instagram Reels, high-retention YouTube long-form videos, or polished commercial brand promos, I focus on tight pacing, clean jump cuts, beat-synced sound effects, and custom <strong className="text-white">After Effects</strong> motion graphics.
          </p>

          <p className="text-neutral-400 text-sm">
            I also design high-CTR YouTube thumbnails, social media graphics, and brand logos in <strong className="text-white">Photoshop & Illustrator</strong> — giving you a complete creative package ready to publish.
          </p>

          {/* Core Strengths Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 font-mono text-xs text-neutral-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cinema-red" />
              <span>Fast Pacing & High Viewer Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cinema-cyan" />
              <span>Clean Color Correction & Grading</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cinema-gold" />
              <span>Custom Motion Graphics & Lower Thirds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Punchy Sound Design & Audio Mixing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/[0.08]">
        {STATS.map((stat, i) => (
          <div key={i} className="p-6 rounded-xl bg-surface-200/40 border border-white/5 space-y-1">
            <p className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-white">
              {stat.value}
            </p>
            <p className="text-xs font-mono font-bold text-cinema-red tracking-wider uppercase pt-2">
              {stat.label}
            </p>
            <p className="text-[11px] text-neutral-400 font-mono">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
