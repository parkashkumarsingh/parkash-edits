"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sliders, Sparkles, Layers, Eye, RefreshCw } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface ComparePreset {
  id: string;
  title: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  lut: string;
  iso: string;
  kelvin: string;
  pipeline: string;
  description: string;
}

const PRESETS: ComparePreset[] = [
  {
    id: "cinematic",
    title: "FLAT CAMERA LOG → CINEMATIC FILM GRADE",
    beforeLabel: "FLAT LOG PROFILE (UNGRADED)",
    afterLabel: "FINAL CINEMATIC GRADE",
    beforeImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80&sat=-100&con=-50",
    afterImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
    lut: "Warm Film LUT + Custom Curve",
    iso: "800 ISO",
    kelvin: "5600K Daylight",
    pipeline: "DaVinci Resolve / Premiere Lumetri",
    description: "Converting flat, washed-out camera footage into rich, cinematic color with balanced skin tones and gentle shadow rolloff.",
  },
  {
    id: "commercial",
    title: "RAW STUDIO FOOTAGE → VIBRANT COMMERCIAL AD",
    beforeLabel: "RAW DULL FOOTAGE",
    afterLabel: "POLISHED AD COLOR",
    beforeImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80&sat=-60&con=-30",
    afterImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80",
    lut: "Commercial Clean Pop",
    iso: "400 ISO",
    kelvin: "5000K Clean White",
    pipeline: "Color Correction & Exposure Balance",
    description: "Correcting exposure, matching camera shots, and making product colors look sharp, vibrant, and clean across all screens.",
  },
  {
    id: "moody",
    title: "NIGHT STREET FOOTAGE → MOODY TEAL & ORANGE",
    beforeLabel: "MUTED FLAT CAPTURE",
    afterLabel: "STYLIZED MOODY LOOK",
    beforeImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80&sat=-80&con=-40",
    afterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    lut: "Moody Teal & Orange Matrix",
    iso: "1600 ISO",
    kelvin: "3800K Tungsten",
    pipeline: "Secondary Color Curves & Highlights",
    description: "Adding depth to night footage by separating cool blue shadows from warm practical lights, giving the video a punchy modern aesthetic.",
  },
];

export const ColorGradeSlider: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick, playTick } = useSound();

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePreset = PRESETS[activePresetIndex];

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pct);
      playTick();
    },
    [playTick]
  );

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="color-lab" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#07080c] border-t border-white/[0.06]">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cinema-cyan/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-cyan tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-cyan animate-pulse" />
            <span>03 // BEFORE & AFTER COLOR GRADING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            BEFORE & AFTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-cyan via-white to-cinema-red">
              COLOR CORRECTION & GRADING
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm text-neutral-400 font-normal leading-relaxed">
          Drag the interactive slider to see how raw, flat camera footage is transformed into rich, vibrant color with crisp contrast and natural skin tones.
        </p>
      </div>

      {/* Preset Selector Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => {
              playClick();
              setActivePresetIndex(idx);
              setSliderPosition(50);
            }}
            onMouseEnter={playHover}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-2 ${
              idx === activePresetIndex
                ? "bg-white text-black font-bold shadow-lg"
                : "bg-surface-200/60 text-neutral-400 hover:text-white border border-white/5 hover:border-white/20"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{preset.title.split("→")[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Comparison Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
        {/* Top HUD Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-surface-300/90 border-b border-white/10 text-xs font-mono select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cinema-red" />
              <span className="text-neutral-400">PIPELINE:</span>
              <span className="text-white font-semibold">{activePreset.pipeline}</span>
            </div>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-neutral-400">LUT:</span>
              <span className="text-cinema-cyan">{activePreset.lut}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>ISO {activePreset.iso}</span>
            <span>•</span>
            <span>{activePreset.kelvin}</span>
            <span>•</span>
            <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
              SPLIT: {Math.round(sliderPosition)}%
            </span>
          </div>
        </div>

        {/* Drag Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            resetCursor();
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseEnter={() => setCursor("drag", "⇄")}
          className="relative aspect-video sm:aspect-[2.2/1] w-full select-none cursor-ew-resize overflow-hidden"
        >
          {/* AFTER Image (Full width background) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={activePreset.afterImage}
              alt={activePreset.afterLabel}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* After Label Pill */}
            <div className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {activePreset.afterLabel}
            </div>
          </div>

          {/* BEFORE Image (Clipped overlay) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="relative h-full"
              style={{
                width: containerRef.current
                  ? `${containerRef.current.clientWidth}px`
                  : "100vw",
              }}
            >
              <img
                src={activePreset.beforeImage}
                alt={activePreset.beforeLabel}
                className="w-full h-full object-cover filter brightness-95"
                draggable={false}
              />
              {/* Before Label Pill */}
              <div className="absolute bottom-6 left-6 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-neutral-300 flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {activePreset.beforeLabel}
              </div>
            </div>
          </div>

          {/* Draggable Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center Handle Button */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl flex items-center justify-center border-2 border-black/20">
              <span className="text-xs font-black tracking-tighter">⇄</span>
            </div>
          </div>
        </div>

        {/* Bottom Description info */}
        <div className="p-6 bg-surface-200/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <p className="text-neutral-400 leading-relaxed max-w-3xl">
            <span className="text-cinema-red font-bold mr-2">TECHNICAL BREAKDOWN:</span>
            {activePreset.description}
          </p>

          <button
            onClick={() => {
              playClick();
              setSliderPosition(sliderPosition === 50 ? 80 : 50);
            }}
            className="self-start sm:self-auto px-3 py-1.5 rounded bg-white/5 border border-white/10 text-neutral-300 hover:text-white flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET TO 50/50</span>
          </button>
        </div>
      </div>
    </section>
  );
};
