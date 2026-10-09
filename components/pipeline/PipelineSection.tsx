"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Film, Cpu, Sliders, ArrowRight } from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

const STAGES = [
  {
    step: "01",
    title: "BRIEF, STYLEFRAMES & ANIMATICS",
    subtitle: "Narrative Architecture & Rhythm Planning",
    icon: Film,
    accent: "border-cinema-red text-cinema-red",
    desc: "Every legendary visual begins with meticulous structural planning. We sculpt treatment styleframes, 3D animatic pre-visualizations, and temp musical tempo mapping to guarantee narrative momentum before the first camera roll or render engine sparks.",
    deliverables: ["Visual Styleframes", "3D Animatic Previzes", "Audio Tempo Guides", "Shot List Breakdowns"],
    software: ["Photoshop", "Cinema 4D", "Figma", "Premiere Pro"],
  },
  {
    step: "02",
    title: "EDITORIAL RHYTHM & PACING",
    subtitle: "The Kinetic Chemistry of Time",
    icon: Layers,
    accent: "border-cinema-cyan text-cinema-cyan",
    desc: "Editing is not just trimming clips—it is composing emotional tension and kinetic flow. We dissect hundreds of hours of raw footage to find the micro-moments of electricity, syncing hard cuts, invisible wipes, and match-cuts to elevate visceral impact.",
    deliverables: ["Assembly Cuts", "Director's Rough Cut", "Invisible Match Cuts", "Pacing Fine-Tune"],
    software: ["DaVinci Resolve Studio", "Adobe Premiere Pro", "Avid Media Composer"],
  },
  {
    step: "03",
    title: "3D MOTION & PROCEDURAL VFX",
    subtitle: "Mathematical Chaos & Photorealism",
    icon: Cpu,
    accent: "border-purple-400 text-purple-400",
    desc: "From fluid simulations and shattering geometry to photorealistic raytraced automotive reflections, we deploy GPU path-traced rendering and procedural nodal networks in Houdini to manifest visuals that defy natural physics.",
    deliverables: ["Houdini Particle Sims", "Redshift 8K Render Passes", "Kinetic 3D Typography", "Chroma Key Composites"],
    software: ["Houdini 20", "Cinema 4D", "Redshift", "Octane Render", "Nuke Studio"],
  },
  {
    step: "04",
    title: "ACES COLOR & SOUND FINISHING",
    subtitle: "Photochemical Soul & Acoustic Sub-Bass",
    icon: Sliders,
    accent: "border-cinema-gold text-cinema-gold",
    desc: "The final polish that separates amateur edits from cinematic masterworks. We run full ACEScg color management with custom Kodak 2383 35mm film print emulations, paired with modular synth sound design and Dolby Atmos delivery.",
    deliverables: ["4K DCI Masters", "Dolby Vision HDR Grade", "5.1 / Atmos Sound Stems", "Custom Film Halation"],
    software: ["DaVinci Resolve Studio", "ACEScg 1.3", "Ableton Live 12", "iZotope RX"],
  },
];

export const PipelineSection: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="pipeline" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#07080c] border-t border-white/[0.06]">
      {/* Background Lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cinema-red/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-red tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <span>04 // CREATIVE DIRECTION & PRODUCTION PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            FROM TREATMENT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-600">
              TO MASTER DCP
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm text-neutral-400 font-normal leading-relaxed">
          A battle-tested production methodology engineered to handle multi-million view commercial campaigns and complex studio visual effects under intense deadlines.
        </p>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStep;
          return (
            <button
              key={stage.step}
              onClick={() => {
                playClick();
                setActiveStep(idx);
              }}
              onMouseEnter={() => {
                playHover();
                setCursor("pointer");
              }}
              onMouseLeave={resetCursor}
              className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-surface-200 border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                  : "bg-surface-300/40 border-white/5 hover:border-white/15 hover:bg-surface-200/50"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cinema-red to-cinema-cyan" />
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-neutral-500">STAGE {stage.step}</span>
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-neutral-500"}`} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-white line-clamp-1">
                {stage.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Spotlight */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/10 bg-surface-200/80 p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-cinema-red/10 border border-cinema-red/30 text-cinema-red text-xs font-mono font-bold">
                PHASE {STAGES[activeStep].step}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {STAGES[activeStep].subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              {STAGES[activeStep].title}
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              {STAGES[activeStep].desc}
            </p>

            {/* Deliverables list */}
            <div className="pt-4">
              <span className="text-xs font-mono text-neutral-400 block mb-3">KEY DELIVERABLES:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STAGES[activeStep].deliverables.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono text-neutral-200 bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cinema-cyan" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Software arsenal for stage */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-surface-300 border border-white/10 space-y-4 font-mono text-xs">
            <span className="text-neutral-400 uppercase tracking-wider block">STAGE TOOLKIT:</span>
            <div className="flex flex-col gap-2">
              {STAGES[activeStep].software.map((sw, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded bg-surface-200 border border-white/5 text-white">
                  <span>{sw}</span>
                  <span className="text-[10px] text-cinema-red">ENTERPRISE PRO</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-neutral-400 leading-relaxed">
              * Fully integrated with ACES color space and 10Gbps fiber storage pipelines for real-time collaboration.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
