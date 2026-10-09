"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Scissors,
  Magnet,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles
} from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface TimelineClip {
  id: string;
  name: string;
  start: number; // percentage 0 to 100
  width: number; // percentage
  color: string;
  codec: string;
  type: "video" | "audio" | "vfx" | "title";
  previewImg: string;
}

const TRACKS_DATA = [
  {
    trackId: "V3",
    name: "V3 / MGFX & TITLES",
    clips: [
      { id: "c1", name: "01_INTRO_KINETIC_TITLE.mogrt", start: 2, width: 22, color: "bg-purple-900/60 border-purple-500/60", codec: "Vector / After Effects", type: "title", previewImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80" },
      { id: "c2", name: "HUD_TELEMETRY_OVERLAY.aep", start: 40, width: 30, color: "bg-purple-900/60 border-purple-500/60", codec: "ProRes 4444 Alpha", type: "title", previewImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" },
      { id: "c3", name: "OUTRO_CREDITS_ROLL.mov", start: 78, width: 20, color: "bg-purple-900/60 border-purple-500/60", codec: "ProRes 4444 Alpha", type: "title", previewImg: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" },
    ] as TimelineClip[],
  },
  {
    trackId: "V2",
    name: "V2 / VFX & CGI COMPOSITES",
    clips: [
      { id: "c4", name: "HOUDINI_PARTICLE_BURST.exr", start: 10, width: 25, color: "bg-amber-900/50 border-amber-500/60", codec: "ACEScg 32-bit Float", type: "vfx", previewImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" },
      { id: "c5", name: "CYBERPUNK_HOLOGRAM_PASS.exr", start: 45, width: 35, color: "bg-amber-900/50 border-amber-500/60", codec: "ACEScg 32-bit Float", type: "vfx", previewImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80" },
    ] as TimelineClip[],
  },
  {
    trackId: "V1",
    name: "V1 / MASTER A-ROLL (4K RAW)",
    clips: [
      { id: "c6", name: "A001_C004_HERO_RUN.braw", start: 0, width: 28, color: "bg-blue-950/60 border-blue-500/60", codec: "BRAW 5:1 • 4K DCI", type: "video", previewImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" },
      { id: "c7", name: "A002_C012_CLOSEUP_DRIFT.mxf", start: 29, width: 32, color: "bg-blue-950/60 border-blue-500/60", codec: "ARRI RAW • 4.5K", type: "video", previewImg: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80" },
      { id: "c8", name: "A003_C009_NEON_ALLEY.braw", start: 62, width: 38, color: "bg-blue-950/60 border-blue-500/60", codec: "BRAW 5:1 • 4K DCI", type: "video", previewImg: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80" },
    ] as TimelineClip[],
  },
  {
    trackId: "A1",
    name: "A1 / FOLEY & SOUND DESIGN",
    clips: [
      { id: "c9", name: "WHOOSH_SUB_DROP_CINEMATIC.wav", start: 0, width: 20, color: "bg-emerald-950/50 border-emerald-500/50", codec: "96kHz 24-bit WAV", type: "audio", previewImg: "" },
      { id: "c10", name: "TURBO_ENGINE_REV_PORSCHE.wav", start: 30, width: 30, color: "bg-emerald-950/50 border-emerald-500/50", codec: "96kHz 24-bit WAV", type: "audio", previewImg: "" },
      { id: "c11", name: "CYBER_GLITCH_RISER_04.wav", start: 65, width: 35, color: "bg-emerald-950/50 border-emerald-500/50", codec: "96kHz 24-bit WAV", type: "audio", previewImg: "" },
    ] as TimelineClip[],
  },
  {
    trackId: "A2",
    name: "A2 / MASTER ORCHESTRAL SCORE",
    clips: [
      { id: "c12", name: "MASTER_THEME_STEM_STRINGS_SYNTH.wav", start: 0, width: 100, color: "bg-teal-950/50 border-teal-500/50", codec: "96kHz 24-bit Master Stem", type: "audio", previewImg: "" },
    ] as TimelineClip[],
  },
];

export const TimelineSuite: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick, playTick } = useSound();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(18); // 0 to 100%
  const [selectedClip, setSelectedClip] = useState<TimelineClip | null>(TRACKS_DATA[2].clips[0]);
  const [mutedTracks, setMutedTracks] = useState<Record<string, boolean>>({});

  const timelineRef = useRef<HTMLDivElement>(null);

  // Playhead animation loop when playing
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setPlayheadPos((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.12;
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const togglePlay = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setPlayheadPos(pct);
    playTick();
  };

  const toggleMute = (trackId: string) => {
    playClick();
    setMutedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  // Convert playhead % to timecode
  const totalSeconds = (playheadPos / 100) * 90; // 90 second sequence
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  const ff = String(Math.floor((totalSeconds % 1) * 24)).padStart(2, "0");
  const timecode = `01:${mm}:${ss}:${ff}`;

  return (
    <section id="timeline" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-white/[0.06]">
      {/* Atmosphere Glow */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-cinema-red/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-red tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <span>03 // NON-LINEAR EDITING SUITE SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            INSIDE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-red via-[#ff8266] to-cinema-gold">
              NLE TIMELINE
            </span>
          </h2>
        </div>

        <p className="max-w-md text-sm text-neutral-400 font-normal leading-relaxed">
          Interactive simulation of our multi-track editorial pipeline. Click anywhere on the ruler or clips to scrub the playhead, inspect video codecs, and preview live render frames.
        </p>
      </div>

      {/* The NLE Suite Container */}
      <div className="rounded-2xl border border-white/10 bg-surface-300 overflow-hidden shadow-2xl">
        {/* NLE Window Titlebar */}
        <div className="flex items-center justify-between px-6 py-3 bg-surface-200 border-b border-white/10 select-none text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-neutral-400 pl-2">DAVINCI RESOLVE STUDIO // TIMELINE: MASTER_COMMERCIAL_CUT_4K</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="text-cinema-red font-bold">{timecode}</span>
            <span>24.000 FPS</span>
            <span className="hidden sm:inline text-neutral-500">|</span>
            <span className="hidden sm:inline text-white">DROP FRAME: OFF</span>
          </div>
        </div>

        {/* Top Split: Program Monitor + Selected Clip Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          {/* Program Monitor (Simulated Output) */}
          <div className="lg:col-span-7 bg-black p-4 flex flex-col justify-between aspect-video relative overflow-hidden group">
            {selectedClip && selectedClip.previewImg ? (
              <img
                src={selectedClip.previewImg}
                alt="Program Frame"
                className="w-full h-full object-cover rounded border border-white/10"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-200/50 rounded border border-white/5 text-neutral-500 font-mono text-xs">
                <Volume2 className="w-8 h-8 text-neutral-600 mb-2" />
                <span>AUDIO STEM MONITOR [ACTIVE]</span>
              </div>
            )}

            {/* Timecode overlay on monitor */}
            <div className="absolute top-8 left-8 bg-black/70 backdrop-blur px-3 py-1 rounded border border-white/10 text-xs font-mono text-cinema-red font-bold">
              REC ● {timecode}
            </div>

            <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur px-3 py-1 rounded border border-white/10 text-[10px] font-mono text-neutral-300">
              4K DCI (4096 x 2160) • ACEScg
            </div>
          </div>

          {/* Clip Inspector Metadata Panel */}
          <div className="lg:col-span-5 p-6 bg-surface-100 flex flex-col justify-between font-mono text-xs border-t lg:border-t-0 lg:border-l border-white/10">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <span className="text-neutral-400">INSPECTOR: ACTIVE CLIP</span>
                <span className="px-2 py-0.5 rounded bg-cinema-red/10 text-cinema-red border border-cinema-red/20 font-bold uppercase text-[10px]">
                  {selectedClip?.type || "VIDEO"}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 break-all">
                {selectedClip?.name || "Select any clip on the timeline"}
              </h4>

              <div className="space-y-2.5 pt-2 text-neutral-400">
                <div className="flex justify-between">
                  <span>FORMAT / CODEC:</span>
                  <span className="text-white font-semibold">{selectedClip?.codec || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLIP DURATION:</span>
                  <span className="text-cinema-cyan">{selectedClip ? `${selectedClip.width.toFixed(1)}s` : "--"}</span>
                </div>
                <div className="flex justify-between">
                  <span>COLOR MANAGEMENT:</span>
                  <span className="text-white">ACES 1.3 / Davinci YRGB</span>
                </div>
                <div className="flex justify-between">
                  <span>AUDIO CHANNELS:</span>
                  <span className="text-white">Stereo 48kHz 24-bit</span>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-lg bg-cinema-red text-white font-bold flex items-center gap-2 hover:bg-[#ff4d30] transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? "PAUSE PLAYHEAD" : "PLAY TIMELINE"}</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setPlayheadPos(0);
                }}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>TO START</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Tracks Section */}
        <div className="p-6 bg-[#08080d] select-none">
          {/* Timeline Toolbar */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 text-neutral-400 text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center hover:bg-cinema-red transition-colors"
              >
                {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              </button>
              <div className="flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px]">RAZOR [C]</span>
              </div>
              <div className="flex items-center gap-1">
                <Magnet className="w-3.5 h-3.5 text-cinema-red" />
                <span className="text-[11px] text-cinema-red">SNAP [N]</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ZoomOut className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
              <div className="w-20 h-1 bg-white/20 rounded-full" />
              <ZoomIn className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Time Ruler */}
          <div
            onClick={handleTimelineClick}
            className="relative h-6 border-b border-white/10 cursor-pointer ml-32"
          >
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
              <div
                key={tick}
                className="absolute top-0 bottom-0 border-l border-white/20 text-[9px] font-mono text-neutral-500 pl-1"
                style={{ left: `${tick}%` }}
              >
                00:{String(Math.floor((tick / 100) * 90)).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Tracks Area with Scrub Area and Playhead */}
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            className="relative mt-2 space-y-2 cursor-pointer"
          >
            {/* The Red Vertical Playhead */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-cinema-red z-30 pointer-events-none shadow-[0_0_12px_#ff3b1e]"
              style={{ left: `calc(8rem + (100% - 8rem) * ${playheadPos / 100})` }}
            >
              {/* Playhead Handle Triangle */}
              <div className="w-3 h-3 bg-cinema-red rotate-45 -translate-x-1.5 -translate-y-1.5 shadow-[0_0_10px_#ff3b1e]" />
            </div>

            {/* Individual Track Rows */}
            {TRACKS_DATA.map((track) => (
              <div key={track.trackId} className="flex items-center gap-2 h-11">
                {/* Track Header / Name / Controls */}
                <div className="w-32 flex-shrink-0 flex items-center justify-between px-2.5 py-1.5 rounded bg-surface-200 border border-white/5 text-[10px] font-mono">
                  <span className="font-bold text-neutral-300 truncate">{track.name.split("/")[0]}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute(track.trackId);
                      }}
                      className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold transition-colors ${
                        mutedTracks[track.trackId] ? "bg-cinema-red text-white" : "bg-white/10 text-neutral-400 hover:text-white"
                      }`}
                    >
                      M
                    </button>
                    <span className="w-4 h-4 rounded text-[9px] bg-white/10 text-neutral-400 flex items-center justify-center font-bold">
                      S
                    </span>
                  </div>
                </div>

                {/* Track Clips Lane */}
                <div className="relative flex-1 h-full bg-surface-200/40 rounded border border-white/5 overflow-hidden">
                  {track.clips.map((clip) => {
                    const isSelected = selectedClip?.id === clip.id;
                    return (
                      <div
                        key={clip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          setSelectedClip(clip);
                        }}
                        onMouseEnter={() => {
                          playHover();
                          setCursor("pointer");
                        }}
                        onMouseLeave={resetCursor}
                        style={{
                          left: `${clip.start}%`,
                          width: `${clip.width}%`,
                        }}
                        className={`absolute top-1 bottom-1 rounded border px-2 flex items-center overflow-hidden transition-all duration-200 cursor-pointer ${
                          clip.color
                        } ${
                          isSelected ? "ring-2 ring-white shadow-lg" : "hover:brightness-125"
                        }`}
                      >
                        <span className="text-[10px] font-mono text-white/90 truncate font-semibold">
                          {clip.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
