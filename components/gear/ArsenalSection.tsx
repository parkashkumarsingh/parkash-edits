"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Monitor, Sliders, Zap, CheckCircle2 } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

const SOFTWARE_LIST = [
  { name: "DaVinci Resolve Studio 19", role: "Primary NLE, ACES Color Grading & Fairlight Audio", level: "Master", icon: "🔴" },
  { name: "SideFX Houdini 20", role: "Procedural Simulations, Particles, Vellum & Pyro", level: "Expert", icon: "🟠" },
  { name: "Cinema 4D + Redshift", role: "3D Product Animation, Mograph & Raytraced Renders", level: "Master", icon: "🔵" },
  { name: "Adobe After Effects", role: "Compositing, Kinetic Typography, Vector Tracking", level: "Master", icon: "🟣" },
  { name: "Octane Render", role: "GPU Spectral Path-Tracing & Photoreal Shaders", level: "Expert", icon: "🟡" },
  { name: "Unreal Engine 5.4", role: "Virtual Production, Real-Time Environments & Nanite", level: "Advanced", icon: "⚪" },
  { name: "Adobe Premiere Pro", role: "Rapid Long-Form Commercial Assembly & Beat Edits", level: "Master", icon: "🟣" },
  { name: "Nuke Studio", role: "Deep Compositing, 32-bit Float EXR Multi-Pass", level: "Advanced", icon: "🟢" },
];

const HARDWARE_SPECS = [
  {
    category: "COMPUTE ENGINE",
    title: "Apple Mac Studio M2 Ultra",
    spec: "24-Core CPU • 76-Core GPU • 192GB Unified Memory • 800GB/s Bandwidth",
    detail: "Capable of playback for up to 22 streams of 8K ProRes 422 video simultaneously with zero dropped frames.",
  },
  {
    category: "REFERENCE MASTERING DISPLAY",
    title: "Flanders Scientific XMP310 HDR OLED",
    spec: "31-inch QD-OLED • 3,000 Nits Peak Luminance • 100% DCI-P3 Color Gamut",
    detail: "Calibrated quarterly with Klein K10-A spectroradiometer for precise Dolby Vision & Netflix HDR delivery.",
  },
  {
    category: "TACTILE COLOR CONTROL",
    title: "Blackmagic DaVinci Mini & Loupedeck CT",
    spec: "High-resolution optical trackballs • Precision optical encoders",
    detail: "Enables simultaneous 3-way color balance and secondary qualifier micro-adjustments in real time.",
  },
  {
    category: "STORAGE INFRASTRUCTURE",
    title: "128TB NVMe High-Speed RAID Array",
    spec: "PCIe Gen 4 • 7,200 MB/s sustained throughput • 10GbE Fiber SAN",
    detail: "Instant scrubbing through multi-camera uncompressed 8K RAW footage without intermediate proxies.",
  },
];

export const ArsenalSection: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover } = useSound();

  return (
    <section id="arsenal" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-white/[0.06]">
      {/* Background Lighting */}
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cinema-cyan/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-cyan tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-cyan animate-pulse" />
            <span>05 // STUDIO ARSENAL & SUITE GEAR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            POST-PRODUCTION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-cyan via-white to-cinema-red">
              HARDWARE & TOOLKIT
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm text-neutral-400 font-normal leading-relaxed">
          Uncompromising technical infrastructure built to ingest 8K camera RAW formats, execute complex GPU physics simulations, and master in true HDR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Software Stack Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
            <Sliders className="w-4 h-4 text-cinema-red" />
            <span>PROFESSIONAL SOFTWARE ECOSYSTEM</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {SOFTWARE_LIST.map((sw, i) => (
              <div
                key={i}
                onMouseEnter={() => {
                  playHover();
                  setCursor("pointer");
                }}
                onMouseLeave={resetCursor}
                className="p-4 rounded-xl bg-surface-200/60 border border-white/5 hover:border-white/20 transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-lg">{sw.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">{sw.name}</h3>
                    <p className="text-[11px] text-neutral-400">{sw.role}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-cinema-cyan font-semibold">
                  {sw.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: High-End Hardware Specifications */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4 text-cinema-cyan" />
            <span>STUDIO MONITORING & HARDWARE RIG</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {HARDWARE_SPECS.map((hw, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-surface-200/60 border border-white/5 hover:border-white/20 transition-all duration-300 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cinema-red font-semibold">{hw.category}</span>
                  <span className="text-neutral-500">SYSTEM VERIFIED</span>
                </div>
                <h3 className="text-base font-bold text-white">{hw.title}</h3>
                <p className="text-xs font-mono text-cinema-cyan bg-white/5 px-2.5 py-1 rounded border border-white/5 inline-block">
                  {hw.spec}
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                  {hw.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
