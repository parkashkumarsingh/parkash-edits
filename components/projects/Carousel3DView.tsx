"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Box, ArrowUpRight } from "lucide-react";
import { Project } from "./ProjectsData";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface Carousel3DViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const Carousel3DView: React.FC<Carousel3DViewProps> = ({
  projects,
  onSelectProject,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handlePrev = () => {
    playClick();
    setActiveIndex((prev) => (prev === 0 ? Math.max(0, projects.length - 1) : prev - 1));
  };

  const handleNext = () => {
    playClick();
    setActiveIndex((prev) => (prev >= projects.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!projects || projects.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [projects]);

  if (!projects || projects.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-500 font-mono text-sm">
        No projects available in this category.
      </div>
    );
  }

  // Touch and mouse drag gestures for 3D rotation
  const onPointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX !== null) {
      const diff = e.clientX - dragStartX;
      if (diff > 50) {
        handlePrev();
      } else if (diff < -50) {
        handleNext();
      }
      setDragStartX(null);
    }
  };

  return (
    <div
      className="relative w-full py-12 flex flex-col items-center justify-center overflow-hidden select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-[480px] md:h-[560px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {projects.map((project, idx) => {
          // Calculate offset relative to activeIndex with wrap-around
          const total = projects.length;
          let offset = idx - activeIndex;

          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Compute 3D Cylindrical transformation
          const rotateY = offset * 28; // degrees
          const translateX = offset * 280; // px
          const translateZ = -Math.abs(offset) * 160; // px depth
          const scale = 1 - Math.abs(offset) * 0.14;
          const opacity = 1 - Math.abs(offset) * 0.32;
          const zIndex = 50 - Math.abs(offset) * 10;

          return (
            <motion.div
              key={project.id}
              onClick={() => {
                if (isCenter) {
                  playClick();
                  onSelectProject(project);
                } else {
                  playClick();
                  setActiveIndex(idx);
                }
              }}
              onMouseEnter={() => {
                playHover();
                setCursor(isCenter ? "view" : "pointer");
              }}
              onMouseLeave={resetCursor}
              animate={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              style={{
                zIndex,
                position: "absolute",
              }}
              className={`w-[320px] sm:w-[420px] md:w-[480px] rounded-2xl overflow-hidden bg-surface-200 border transition-colors duration-300 shadow-2xl cursor-pointer ${
                isCenter
                  ? "border-cinema-red shadow-[0_20px_70px_rgba(255,59,30,0.25)] ring-1 ring-cinema-red/40"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {/* Media Preview */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden group">
                <img
                  src={project.poster || project.mediaUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Looping video teaser if center card and video available */}
                {isCenter && project.videoUrl && (
                  <video
                    src={project.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/40 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono tracking-wider text-white">
                    {project.aspectRatio}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded bg-black/60 backdrop-blur border text-[10px] font-mono tracking-wider font-bold ${
                      project.type === "video"
                        ? "border-cinema-red/40 text-cinema-red"
                        : "border-cinema-cyan/40 text-cinema-cyan"
                    }`}
                  >
                    {project.type === "video" ? "VIDEO" : "GRAPHIC"}
                  </span>
                </div>

                {/* Center Action Overlay */}
                {isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <div className="px-5 py-2.5 rounded-full bg-cinema-red text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-xl">
                      {project.type === "video" ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>WATCH VIDEO</span>
                        </>
                      ) : (
                        <>
                          <Box className="w-3.5 h-3.5" />
                          <span>VIEW DESIGN</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-5 md:p-6 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="text-cinema-cyan font-bold tracking-wider">{project.client}</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="text-lg md:text-xl font-sans font-black uppercase text-white truncate">
                  {project.title}
                </h3>

                <p className="text-xs text-neutral-400 font-sans line-clamp-2">
                  {project.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[11px]">
                  <span className="text-neutral-400 truncate max-w-[200px]">
                    {project.category}
                  </span>
                  <span className="text-cinema-red flex items-center gap-1 font-bold">
                    <span>LAUNCH</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Carousel Navigation Transport Controls */}
      <div className="flex items-center gap-4 mt-8 z-30">
        <button
          onClick={handlePrev}
          onMouseEnter={playHover}
          className="w-12 h-12 rounded-full border border-white/15 bg-surface-200/90 text-white flex items-center justify-center hover:bg-cinema-red hover:border-cinema-red transition-all shadow-lg active:scale-95"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Progress Dots */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-200/80 border border-white/10">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                playClick();
                setActiveIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex
                  ? "w-6 bg-cinema-red shadow-[0_0_8px_#ff3b1e]"
                  : "w-2 bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          onMouseEnter={playHover}
          className="w-12 h-12 rounded-full border border-white/15 bg-surface-200/90 text-white flex items-center justify-center hover:bg-cinema-red hover:border-cinema-red transition-all shadow-lg active:scale-95"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
