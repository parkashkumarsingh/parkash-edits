"use client";

import React from "react";
import { ArrowUp, Film, Sparkles } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

const SOCIALS = [
  { name: "VIMEO PRO", href: "https://vimeo.com" },
  { name: "BEHANCE", href: "https://behance.net" },
  { name: "ARTSTATION", href: "https://artstation.com" },
  { name: "INSTAGRAM", href: "https://instagram.com" },
  { name: "LINKEDIN", href: "https://linkedin.com" },
  { name: "YOUTUBE", href: "https://youtube.com" },
];

export const Footer: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#030305] border-t border-white/[0.08] px-6 md:px-12 lg:px-20 py-16 text-neutral-400 select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cinema-red" />
              <h2 className="text-xl font-black font-sans uppercase tracking-widest text-white">
                PARKASH EDITS
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-500 max-w-sm">
              Video Editor & Motion Graphics Designer. Transforming raw footage into engaging, high-retention videos that captivate audiences.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {SOCIALS.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => {
                  playHover();
                  setCursor("pointer");
                }}
                onMouseLeave={resetCursor}
                className="px-3 py-1.5 rounded-lg bg-surface-200 border border-white/5 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
              >
                {soc.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Metadata & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 PARKASH EDITS</span>
            <span>•</span>
            <span className="text-cinema-red font-semibold">ALL RIGHTS RESERVED</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-neutral-600">PREMIERE PRO • AFTER EFFECTS • PHOTOSHOP • ILLUSTRATOR</span>
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => {
              playHover();
              setCursor("pointer");
            }}
            onMouseLeave={resetCursor}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
