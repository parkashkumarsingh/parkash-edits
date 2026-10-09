"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Box,
  Layers,
  Sparkles,
  LayoutGrid,
  RotateCw,
  Plus,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Tag,
  ExternalLink
} from "lucide-react";
import {
  Project,
  GRAPHIC_CATEGORIES,
  INITIAL_PROJECTS
} from "./ProjectsData";
import { Carousel3DView } from "./Carousel3DView";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface GraphicProjectsSectionProps {
  onSelectGraphic: (project: Project) => void;
  onOpenCMS?: (defaultType?: "video" | "graphic") => void;
}

export const GraphicProjectsSection: React.FC<GraphicProjectsSectionProps> = ({
  onSelectGraphic,
  onOpenCMS,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();

  // Section Open/Expand state (starts open so user sees graphics immediately, can be toggled)
  const [isOpen, setIsOpen] = useState(true);

  // Display Mode: Grid vs 3D Carousel
  const [displayMode, setDisplayMode] = useState<"grid" | "carousel">("grid");

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Graphic projects fetched from /api/projects with persistent storage
  const [graphics, setGraphics] = useState<Project[]>(
    INITIAL_PROJECTS.filter((p) => p.type === "graphic")
  );
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const fetchGraphics = () => {
    fetch("/api/projects")
      .then((res) => {
        if (res.ok) return res.json();
        return INITIAL_PROJECTS;
      })
      .then((data: Project[]) => {
        if (Array.isArray(data)) {
          const graphicList = data.filter((p) => p.type === "graphic");
          setGraphics(graphicList);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchGraphics();
    const interval = setInterval(fetchGraphics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter graphics based on category
  const filteredGraphics =
    activeCategory === "ALL"
      ? graphics
      : graphics.filter((p) => p.category === activeCategory);

  const handleCardClick = (project: Project) => {
    playClick();
    onSelectGraphic(project);
  };

  return (
    <section
      id="graphics-work"
      className="relative w-full py-24 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-cinema-cyan/20 overflow-hidden"
    >
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cinema-cyan/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#a359ff]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header Banner with Clickable Open/Toggle Action */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinema-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cinema-cyan" />
            </span>
            <span className="text-xs font-mono text-cinema-cyan tracking-[0.25em] uppercase font-bold">
              SECTION 02 // SOCIAL MEDIA POSTS, LOGOS & ARTWORK
            </span>
            <span className="px-2 py-0.5 rounded bg-cinema-cyan/15 text-cinema-cyan text-[10px] font-mono border border-cinema-cyan/30">
              {graphics.length} GRAPHICS HOSTED
            </span>
          </div>

          <h2
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={playHover}
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans cursor-pointer group flex items-center gap-4"
          >
            <span>SOCIAL POSTS, LOGOS &</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-cyan via-white to-neutral-400 block sm:inline">
              CREATIVE ARTWORK
            </span>
          </h2>

          <p className="text-xs md:text-sm font-mono text-neutral-400 max-w-2xl leading-relaxed">
            Showcase of <strong>social media posts & banners</strong>, <strong>vector brand logos</strong>, and <strong>high-CTR YouTube thumbnails</strong> designed in Photoshop and Illustrator.
          </p>
        </div>

        {/* Section Actions & Quick Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Upload Graphic Button */}
          {onOpenCMS && (
            <button
              onClick={() => {
                playClick();
                onOpenCMS("graphic");
              }}
              onMouseEnter={playHover}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cinema-cyan text-black text-xs font-mono font-bold tracking-wider hover:bg-[#38eeff] transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>UPLOAD POST / LOGO / ART</span>
            </button>
          )}

          {/* View Mode Toggle: Grid vs 3D Carousel */}
          <div className="flex items-center p-1 rounded-full bg-surface-200 border border-white/10 shadow-lg">
            <button
              onClick={() => {
                playClick();
                setDisplayMode("grid");
              }}
              title="Graphic Grid View"
              className={`p-2.5 rounded-full transition-all ${
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
              title="Carousel Slider View"
              className={`p-2.5 rounded-full transition-all ${
                displayMode === "carousel"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Section Expand / Collapse Toggle Button */}
          <button
            onClick={() => {
              playClick();
              setIsOpen(!isOpen);
            }}
            onMouseEnter={playHover}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-200 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:border-white/20 transition-all"
          >
            <span>{isOpen ? "COLLAPSE SECTION" : "OPEN SECTION"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-cinema-cyan" /> : <ChevronDown className="w-3.5 h-3.5 text-cinema-cyan" />}
          </button>
        </div>
      </div>

      {/* Expandable Section Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-5">
              <button
                onClick={() => {
                  playClick();
                  setActiveCategory("ALL");
                }}
                onMouseEnter={playHover}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                  activeCategory === "ALL"
                    ? "bg-white text-black font-bold shadow-lg"
                    : "bg-surface-200/60 text-neutral-400 hover:text-white hover:bg-surface-100"
                }`}
              >
                ALL GRAPHICS
                <span className="ml-2 text-[10px] opacity-60">({graphics.length})</span>
              </button>

              {GRAPHIC_CATEGORIES.map((cat) => {
                const count = graphics.filter((p) => p.category === cat).length;
                const icon =
                  cat === "Social Media Posts & Banners"
                    ? "📱 "
                    : cat === "Brand Identity & Logos"
                    ? "✨ "
                    : cat === "YouTube Thumbnails"
                    ? "🖼️ "
                    : cat === "Other Creative Artwork"
                    ? "🎨 "
                    : "";
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playClick();
                      setActiveCategory(cat);
                    }}
                    onMouseEnter={playHover}
                    className={`px-3.5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-cinema-cyan text-black font-bold shadow-md shadow-cinema-cyan/30"
                        : "bg-surface-200/60 text-neutral-400 hover:text-white hover:bg-surface-100"
                    }`}
                  >
                    <span>{icon}{cat}</span>
                    <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Display Viewport: 3D Carousel OR Responsive Dynamic Grid */}
            {displayMode === "carousel" ? (
              <Carousel3DView
                projects={filteredGraphics}
                onSelectProject={handleCardClick}
              />
            ) : (
              /* Dynamic Multi-Column Grid that Expands Automatically for Unlimited Graphics */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredGraphics.map((project, idx) => (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                      onClick={() => handleCardClick(project)}
                      onMouseEnter={() => {
                        setHoveredProjectId(project.id);
                        setCursor("view", "3D PEDESTAL");
                      }}
                      onMouseLeave={() => {
                        setHoveredProjectId(null);
                        resetCursor();
                      }}
                      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-surface-200/50 border border-white/[0.08] hover:border-cinema-cyan/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(0,229,255,0.25)] flex flex-col justify-between"
                    >
                      {/* High-Res Graphic Preview Window */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0c12] flex items-center justify-center p-4">
                        {/* Background Subtle Grid Pattern */}
                        <div className="absolute inset-0 scanline-grid opacity-20 pointer-events-none" />

                        {/* Graphic Artwork */}
                        <img
                          src={project.poster || project.mediaUrl}
                          alt={project.title}
                          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-108 z-10 filter drop-shadow-2xl"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-20">
                          <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-white/10 text-white text-[10px] font-mono tracking-wider">
                            {project.aspectRatio || "1:1 / 4:5"}
                          </span>
                          <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-cinema-cyan/30 text-cinema-cyan text-[10px] font-mono tracking-wider font-bold">
                            {project.category === "Social Media Posts & Banners"
                              ? "📱 SOCIAL POST"
                              : project.category === "Brand Identity & Logos"
                              ? "✨ BRAND LOGO"
                              : project.category === "YouTube Thumbnails"
                              ? "🖼️ THUMBNAIL"
                              : project.category === "Other Creative Artwork"
                              ? "🎨 CREATIVE ART"
                              : project.category}
                          </span>
                        </div>

                        {/* Hover Action Badge */}
                        <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur border border-cinema-cyan/30 text-white font-mono text-[11px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-xl z-20">
                          <Box className="w-3.5 h-3.5 text-cinema-cyan" />
                          <span>VIEW DESIGN →</span>
                        </div>
                      </div>

                      {/* Graphic Metadata Content */}
                      <div className="p-5 md:p-6 space-y-3 font-mono">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span className="text-cinema-cyan font-bold tracking-wider uppercase">
                            {project.client}
                          </span>
                          <span>{project.year}</span>
                        </div>

                        <h3 className="text-lg font-sans font-black uppercase text-white group-hover:text-cinema-cyan transition-colors duration-300">
                          {project.title}
                        </h3>

                        <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Deliverables / Tools Tags */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06]">
                          {project.techSpecs.software.slice(0, 3).map((tool, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-neutral-300"
                            >
                              {tool}
                            </span>
                          ))}
                          <span className="ml-auto text-[10px] text-neutral-400 group-hover:text-cinema-cyan transition-colors">
                            3D EXHIBITION →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {filteredGraphics.length === 0 && (
              <div className="py-20 text-center space-y-3 border border-dashed border-white/10 rounded-2xl">
                <Palette className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="font-mono text-sm text-neutral-400">
                  No graphics found matching the current filter.
                </p>
                {onOpenCMS && (
                  <button
                    onClick={() => onOpenCMS("graphic")}
                    className="px-4 py-2 rounded-full bg-cinema-cyan text-black text-xs font-mono font-bold"
                  >
                    + UPLOAD FIRST GRAPHIC HERE
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
