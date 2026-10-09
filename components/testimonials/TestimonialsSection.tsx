"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

const REVIEWS = [
  {
    quote: "Parkash completely transformed our YouTube channel's retention. His pacing, sound design, and animated hooks kept viewers glued from the first five seconds. Our average watch time shot up by 42% in just two months.",
    author: "MARCUS CHEN",
    role: "Lead Creator (650K Subs)",
    company: "TECH PULSE MEDIA",
    project: "YOUTUBE LONG FORM SERIES & SHORTS",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "Turnaround time was incredible. We sent over raw product footage with a tight 48-hour launch deadline, and Parkash delivered a punchy, high-converting ad with slick motion typography. The ad outperformed our target ROAS immediately.",
    author: "SARAH JENKINS",
    role: "Head of Performance Marketing",
    company: "LUMEN ATHLETICS",
    project: "COMMERCIAL PRODUCT LAUNCH REELS",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "Working with Parkash is seamless. He handles both video editing and graphic design — creating our video cuts, motion titles, and matching YouTube thumbnails in one go. That saves us so much time and keeps our brand look consistent.",
    author: "DANIEL VOGEL",
    role: "Podcast Host & Creative Director",
    company: "THE FOUNDER'S JOURNEY",
    project: "FULL EPISODE EDITS & VIRAL CLIPS",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export const TestimonialsSection: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => {
    playClick();
    setCurrentIdx((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const next = () => {
    playClick();
    setCurrentIdx((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const active = REVIEWS[currentIdx];

  return (
    <section id="reviews" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-white/[0.06]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-gold tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-gold animate-pulse" />
            <span>05 // CLIENT REVIEWS & FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            WHAT CLIENTS SAY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-gold via-white to-cinema-red">
              ABOUT WORKING WITH ME
            </span>
          </h2>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            onMouseEnter={playHover}
            className="w-12 h-12 rounded-full border border-white/10 bg-surface-200 flex items-center justify-center text-white hover:bg-cinema-red hover:border-cinema-red transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            onMouseEnter={playHover}
            className="w-12 h-12 rounded-full border border-white/10 bg-surface-200 flex items-center justify-center text-white hover:bg-cinema-red hover:border-cinema-red transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Testimonial Card */}
      <div className="relative max-w-5xl mx-auto rounded-2xl bg-surface-200/80 border border-white/10 p-8 sm:p-14 shadow-2xl overflow-hidden backdrop-blur-xl">
        <Quote className="w-16 h-16 text-cinema-red/20 absolute -top-2 -left-2 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 text-cinema-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-mono text-neutral-400 ml-2">VERIFIED CLIENT REVIEW</span>
            </div>

            <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed tracking-tight">
              "{active.quote}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <img
                  src={active.avatar}
                  alt={active.author}
                  className="w-12 h-12 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{active.author}</h4>
                  <p className="text-xs text-neutral-400 font-mono">{active.role} • <span className="text-cinema-cyan font-semibold">{active.company}</span></p>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-neutral-400">
                <span className="text-neutral-500 block">COMMISSIONED PROJECT:</span>
                <span className="text-cinema-red font-semibold">{active.project}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
