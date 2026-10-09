"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  Film,
  Sparkles,
  Layers,
  Box,
  LayoutGrid,
  RotateCw,
  Video,
  Palette,
  ExternalLink
} from "lucide-react";
import {
  Project,
  ProjectType,
  VIDEO_CATEGORIES,
  GRAPHIC_CATEGORIES,
  INITIAL_PROJECTS
} from "./ProjectsData";
import { Carousel3DView } from "./Carousel3DView";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface ProjectsSectionProps {
  onSelectProject: (project: Project) => void;
  onSelectGraphic?: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  onSelectGraphic,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();

  // Primary Environment Toggle: Video Work vs Graphics
  const [activeEnvironment, setActiveEnvironment] = useState<ProjectType>("video");

  // Display Mode: 3D Carousel vs 3D Floating Grid
  const [displayMode, setDisplayMode] = useState<"carousel" | "grid">("grid");

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Projects list (fetched from persistent /api/projects with fallback)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (res.ok) return res.json();
        return INITIAL_PROJECTS;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // Fallback to initial projects
      });
  }, []);

  // Filter projects by environment first
  const environmentProjects = projects.filter((p) => p.type === activeEnvironment);

  // Available categories based on active environment
  const currentCategoryList =
    activeEnvironment === "video" ? VIDEO_CATEGORIES : GRAPHIC_CATEGORIES;

  // Filtered projects
  const filteredProjects =
    activeCategory === "ALL"
      ? environmentProjects
      : environmentProjects.filter((p) => p.category === activeCategory);

  const handleCardClick = (project: Project) => {
    playClick();
    if (project.type === "video") {
      onSelectProject(project);
    } else {
      if (onSelectGraphic) {
        onSelectGraphic(project);
      } else {
        onSelectProject(project);
      }
    }
  };

  return (
    <section id="work" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-white/[0.06]">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cinema-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cinema-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-red tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <span>01 // SHOWCASE & GALLERY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            {activeEnvironment === "video" ? "COMMISSIONED VIDEO &" : "HIGH-RES GRAPHICS &"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
              {activeEnvironment === "video" ? "3D MOTION TRACKS" : "BRAND ARCHITECTURE"}
            </span>
          </h2>
        </div>

        {/* View Mode & Environment Control Hub */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Main Environment Switcher: Video Work vs Graphics */}
          <div className="flex items-center p-1.5 rounded-full bg-surface-200 border border-white/10 shadow-xl">
            <button
              onClick={() => {
                playClick();
                setActiveEnvironment("video");
                setActiveCategory("ALL");
              }}
              onMouseEnter={playHover}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider transition-all duration-300 ${
                activeEnvironment === "video"
                  ? "bg-cinema-red text-white shadow-[0_0_20px_rgba(255,59,30,0.4)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>VIDEO WORK</span>
            </button>

            <button
              onClick={() => {
                playClick();
                setActiveEnvironment("graphic");
                setActiveCategory("ALL");
              }}
              onMouseEnter={playHover}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider transition-all duration-300 ${
                activeEnvironment === "graphic"
                  ? "bg-cinema-cyan text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>GRAPHICS & 3D</span>
            </button>
          </div>

          {/* View Mode Toggle: 3D Carousel vs 3D Floating Grid */}
          <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => {
                playClick();
                setDisplayMode("grid");
              }}
              title="3D Floating Grid View"
              className={`p-2 rounded-full transition-all ${
                displayMode === "grid"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playClick();
                setDisplayMode("carousel");
              }}
              title="3D Dynamic Carousel View"
              className={`p-2 rounded-full transition-all ${
                displayMode === "carousel"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-white/[0.08] pb-4">
        {/* All Tab */}
        <button
          onClick={() => {
            playClick();
            setActiveCategory("ALL");
          }}
          onMouseEnter={playHover}
          className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
            activeCategory === "ALL"
              ? "bg-white text-black font-bold shadow-lg"
              : "bg-surface-200/50 text-neutral-400 hover:text-white hover:bg-surface-100"
          }`}
        >
          ALL {activeEnvironment === "video" ? "VIDEOS" : "GRAPHICS"}
          <span className="ml-2 text-[10px] opacity-60">({environmentProjects.length})</span>
        </button>

        {/* Specific Category Tabs */}
        {currentCategoryList.map((cat) => {
          const count = environmentProjects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => {
                playClick();
                setActiveCategory(cat);
              }}
              onMouseEnter={playHover}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? activeEnvironment === "video"
                    ? "bg-cinema-red text-white font-bold shadow-md"
                    : "bg-cinema-cyan text-black font-bold shadow-md"
                  : "bg-surface-200/50 text-neutral-400 hover:text-white hover:bg-surface-100"
              }`}
            >
              {cat}
              <span className="ml-2 text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Viewport Content: 3D Carousel OR Floating 3D Grid */}
      {displayMode === "carousel" ? (
        <Carousel3DView
          projects={filteredProjects}
          onSelectProject={handleCardClick}
        />
      ) : (
        /* Floating 3D Grid */
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                onClick={() => handleCardClick(project)}
                onMouseEnter={() => {
                  setHoveredProjectId(project.id);
                  setCursor("view", project.type === "video" ? "CINEMA" : "3D PEDESTAL");
                }}
                onMouseLeave={() => {
                  setHoveredProjectId(null);
                  resetCursor();
                }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden bg-surface-200/50 border border-white/[0.08] hover:border-white/25 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(255,59,30,0.18)] flex flex-col justify-between"
              >
                {/* Media Container with 3D zoom trigger */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  {/* Poster / High-res media */}
                  <img
                    src={project.poster || project.mediaUrl}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 ${
                      hoveredProjectId === project.id && project.videoUrl ? "opacity-0" : "opacity-100"
                    }`}
                  />

                  {/* Looping video preview on hover if video work */}
                  {hoveredProjectId === project.id && project.videoUrl && (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/35 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
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
                      {project.type === "video" ? "VIDEO CUT" : "GRAPHIC 3D"}
                    </span>
                  </div>

                  {/* Hover Action Badge */}
                  <div className="absolute bottom-3.5 right-3.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white font-mono text-[11px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-xl">
                    {project.type === "video" ? (
                      <>
                        <Play className="w-3 h-3 fill-current text-cinema-red" />
                        <span>3D ZOOM PLAYER</span>
                      </>
                    ) : (
                      <>
                        <Box className="w-3 h-3 text-cinema-cyan" />
                        <span>3D PEDESTAL</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Info Content */}
                <div className="p-5 md:p-6 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="text-cinema-cyan font-bold tracking-wider">{project.client}</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="text-lg font-sans font-black uppercase text-white group-hover:text-cinema-red transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Software Tags */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06]">
                    {project.techSpecs.software.slice(0, 3).map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] text-neutral-500 group-hover:text-white transition-colors">
                      {project.type === "video" ? "PLAY VIDEO →" : "INSPECT 3D →"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
