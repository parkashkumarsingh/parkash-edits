"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Trophy, Star, Sparkles } from "lucide-react";

const CLIENTS = [
  "YOUTUBE CREATORS",
  "INSTAGRAM REELS",
  "TIKTOK BRANDS",
  "TECH PODCASTS",
  "E-COMMERCE ADS",
  "FITNESS BRANDS",
  "FINANCE CHANNELS",
  "GAMING CREATORS",
  "EDUCATIONAL DOCUS",
  "STARTUP LAUNCHES",
  "MUSIC PROMOS",
  "LIFESTYLE VLOGS",
];

const CAPABILITIES = [
  { title: "HIGH AUDIENCE RETENTION", desc: "Dynamic pacing, visual pattern interrupts, and hook optimization", tag: "Retention Editing" },
  { title: "24-48H TURNAROUND", desc: "Fast draft delivery to keep your content calendar consistently ahead", tag: "Fast Delivery" },
  { title: "CUSTOM MOTION GRAPHICS", desc: "Kinetic typography, logo reveals, and custom animated lower thirds", tag: "After Effects" },
  { title: "CRISP SOUND DESIGN", desc: "High-impact whooshes, risers, pop-ups, and studio dialogue cleanup", tag: "Audio Mixing" },
  { title: "CINEMATIC COLOR GRADING", desc: "Balanced skin tones, rich contrast, and custom LUT color treatment", tag: "Color Balance" },
  { title: "COMPLETE THUMBNAILS & GRAPHICS", desc: "High-CTR YouTube thumbnails, social post banners, and vector assets", tag: "Photoshop & Illustrator" },
];

export const AwardsMarquee: React.FC = () => {
  return (
    <section className="relative w-full py-20 bg-[#06060a] border-t border-white/[0.06] overflow-hidden select-none">
      {/* Brand Logos Infinite Marquee Row */}
      <div className="mb-14">
        <p className="text-center text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-6">
          EDITING SPECIALIZED FOR CREATORS, CHANNELS & BRANDS
        </p>

        <div className="relative w-full overflow-hidden flex whitespace-nowrap">
          {/* Gradient Edge Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#06060a] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#06060a] to-transparent z-10 pointer-events-none" />

          {/* First loop */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex items-center gap-12 text-lg sm:text-2xl font-black font-sans tracking-widest text-neutral-400 hover:text-white"
          >
            {CLIENTS.concat(CLIENTS).map((client, i) => (
              <span key={i} className="flex items-center gap-12 transition-colors hover:text-white cursor-default">
                <span>{client}</span>
                <span className="text-cinema-red text-sm font-normal">✦</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Editor Capabilities & Standards Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-surface-200/50 border border-white/5 hover:border-cinema-red/30 transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-cinema-red/10 border border-cinema-red/20 flex items-center justify-center flex-shrink-0 text-cinema-red">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-white tracking-wide">{item.title}</h3>
                <p className="text-xs text-neutral-300">{item.desc}</p>
                <p className="text-[10px] font-mono text-neutral-500 uppercase">{item.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
