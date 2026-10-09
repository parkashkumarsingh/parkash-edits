"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Volume2, VolumeX, Menu, X, Disc3, Sliders } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface NavbarProps {
  onOpenReel: () => void;
  onOpenContact: () => void;
  onOpenCMS?: () => void;
}

const NAV_LINKS = [
  { name: "VIDEO WORK", href: "#video-work" },
  { name: "GRAPHICS & LOGOS", href: "#graphics-work" },
  { name: "COLOR GRADING", href: "#color-lab" },
  { name: "ABOUT", href: "#about" },
  { name: "REVIEWS", href: "#reviews" },
  { name: "CONTACT", href: "#contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenReel, onOpenContact, onOpenCMS }) => {
  const { setCursor, resetCursor } = useCursor();
  const { isMuted, toggleMute, playHover, playClick } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-4 ${
        scrolled
          ? "bg-[#050508]/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onMouseEnter={() => {
            playHover();
            setCursor("pointer");
          }}
          onMouseLeave={resetCursor}
          className="flex items-center gap-3 select-none group"
        >
          <div className="w-8 h-8 rounded-full bg-surface-200 border border-white/20 flex items-center justify-center text-white group-hover:border-cinema-red transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-cinema-red animate-pulse" />
          </div>
          <div>
            <span className="font-sans font-black tracking-widest uppercase text-sm sm:text-base text-white block">
              PARKASH EDITS
            </span>
            <span className="font-mono text-[9px] text-neutral-400 tracking-[0.25em] uppercase block -mt-1">
              VIDEO & MOTION DESIGN
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-wider text-neutral-400">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={playClick}
              onMouseEnter={() => {
                playHover();
                setCursor("pointer");
              }}
              onMouseLeave={resetCursor}
              className="hover:text-white transition-colors relative py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA & Sound Controls */}
        <div className="flex items-center gap-2.5">
          {/* Ambient Sound Controller */}
          <button
            onClick={toggleMute}
            onMouseEnter={() => {
              playHover();
              setCursor("pointer");
            }}
            onMouseLeave={resetCursor}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono flex items-center gap-2 transition-all ${
              !isMuted
                ? "bg-cinema-red/10 border-cinema-red text-cinema-red shadow-[0_0_15px_rgba(255,59,30,0.3)]"
                : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cinema-red animate-pulse" />}
            <span className="hidden sm:inline text-[10px] font-bold">
              {isMuted ? "MUTE" : "AUDIO"}
            </span>
          </button>

          {/* CMS Admin Button */}
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
              title="Open Native CMS Dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-cinema-cyan text-xs font-mono hover:bg-cinema-cyan hover:text-black transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">CMS</span>
            </button>
          )}

          {/* Watch Reel Quick Trigger */}
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
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-xs font-black tracking-widest uppercase hover:bg-cinema-red hover:text-white transition-all shadow-md active:scale-95"
          >
            <Play className="w-3 h-3 fill-current ml-0.5" />
            <span>REEL</span>
          </button>

          {/* Contact Trigger */}
          <button
            onClick={() => {
              playClick();
              onOpenContact();
            }}
            onMouseEnter={() => {
              playHover();
              setCursor("pointer");
            }}
            onMouseLeave={resetCursor}
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cinema-red text-white font-mono text-xs font-black tracking-widest uppercase hover:bg-[#ff4d30] transition-all shadow-md active:scale-95"
          >
            <span>INQUIRE</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-3 p-6 rounded-2xl bg-surface-200 border border-white/10 shadow-2xl flex flex-col gap-4 font-mono text-sm"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
              }}
              className="text-neutral-300 hover:text-white py-1"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {onOpenCMS && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCMS();
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 text-cinema-cyan font-bold uppercase text-xs text-center flex items-center justify-center gap-2 border border-cinema-cyan/30"
              >
                <Sliders className="w-3.5 h-3.5" />
                CMS DASHBOARD
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReel();
              }}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold uppercase text-xs text-center flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              WATCH SHOWREEL
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-2.5 rounded-xl bg-cinema-red text-white font-bold uppercase text-xs text-center"
            >
              COMMISSION INQUIRY
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
