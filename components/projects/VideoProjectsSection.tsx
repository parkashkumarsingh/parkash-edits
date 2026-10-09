"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Film,
  Sparkles,
  LayoutGrid,
  RotateCw,
  Video,
  Plus,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tv,
  Clapperboard,
  Sliders,
  ExternalLink
} from "lucide-react";
import {
  Project,
  VIDEO_CATEGORIES,
  INITIAL_PROJECTS
} from "./ProjectsData";
import { Carousel3DView } from "./Carousel3DView";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

interface VideoProjectsSectionProps {
  onSelectVideo: (project: Project) => void;
  onOpenCMS?: (defaultType?: "video" | "graphic") => void;
}

export const VideoProjectsSection: React.FC<VideoProjectsSectionProps> = ({
  onSelectVideo,
  onOpenCMS,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();

  // Section Open/Expand state (starts open so user sees videos immediately, can be toggled)
  const [isOpen, setIsOpen] = useState(true);

  // Display Mode: 3D Carousel Slider (default) vs Grid
  const [displayMode, setDisplayMode] = useState<"grid" | "carousel">("carousel");

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Format filter (ALL vs REEL 9:16 vs YOUTUBE 16:9)
  const [formatFilter, setFormatFilter] = useState<"all" | "reel" | "youtube">("all");

  // Video projects fetched from /api/projects with persistent storage
  const [videos, setVideos] = useState<Project[]>(
    INITIAL_PROJECTS.filter((p) => p.type === "video")
  );
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const fetchVideos = () => {
    fetch("/api/projects")
      .then((res) => {
        if (res.ok) return res.json();
        return INITIAL_PROJECTS;
      })
      .then((data: Project[]) => {
        if (Array.isArray(data)) {
          const videoList = data.filter((p) => p.type === "video");
          setVideos(videoList);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter videos based on category and aspect ratio format
  const filteredVideos = videos.filter((p) => {
    const matchesCategory =
      activeCategory === "ALL" || p.category === activeCategory;

    const isReel =
      p.aspectRatio?.includes("9:16") ||
      p.aspectRatio?.toLowerCase().includes("reel") ||
      p.aspectRatio?.toLowerCase().includes("vertical") ||
      p.title?.toLowerCase().includes("reel") ||
      p.title?.toLowerCase().includes("shorts");

    const matchesFormat =
      formatFilter === "all"
        ? true
        : formatFilter === "reel"
        ? isReel
        : !isReel;

    return matchesCategory && matchesFormat;
  });

  const handleVideoCardClick = (project: Project) => {
    playClick();
    onSelectVideo(project);
  };

  const isProjectReel = (p: Project) => {
    return (
      p.aspectRatio?.includes("9:16") ||
      p.aspectRatio?.toLowerCase().includes("reel") ||
      p.aspectRatio?.toLowerCase().includes("vertical") ||
      p.title?.toLowerCase().includes("reel") ||
      p.title?.toLowerCase().includes("shorts")
    );
  };

  return (
    <section
      id="video-work"
      className="relative w-full py-24 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-cinema-red/20 overflow-hidden"
    >
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cinema-red/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#ff6b3d]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header Banner with Clickable Open/Toggle Action */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinema-red opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cinema-red" />
            </span>
            <span className="text-xs font-mono text-cinema-red tracking-[0.25em] uppercase font-bold">
              SECTION 01 // VIDEO WORK SHOWCASE
            </span>
            <span className="px-2 py-0.5 rounded bg-cinema-red/15 text-cinema-red text-[10px] font-mono border border-cinema-red/30">
              {videos.length} VIDEOS HOSTED
            </span>
          </div>

          <h2
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={playHover}
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans cursor-pointer group flex items-center gap-4"
          >
            <span>FEATURED VIDEO &</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cinema-red via-[#ff7a59] to-white block sm:inline">
              MOTION GRAPHICS
            </span>
          </h2>

          <p className="text-xs md:text-sm font-mono text-neutral-400 max-w-2xl leading-relaxed">
            Browse through <strong>9:16 Vertical Reels & Shorts</strong> and <strong>16:9 YouTube Widescreen</strong> edits. Click any project to watch with high quality playback.
          </p>
        </div>

        {/* Section Actions & Quick Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Upload Video Button */}
          {onOpenCMS && (
            <button
              onClick={() => {
                playClick();
                onOpenCMS("video");
              }}
              onMouseEnter={playHover}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cinema-red text-white text-xs font-mono font-bold tracking-wider hover:bg-[#ff5537] transition-all shadow-[0_0_20px_rgba(255,59,30,0.4)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>UPLOAD VIDEO</span>
            </button>
          )}

          {/* View Mode Toggle: 3D Slider (Default) vs Grid */}
          <div className="flex items-center p-1 rounded-full bg-surface-200 border border-white/10 shadow-lg">
            <button
              onClick={() => {
                playClick();
                setDisplayMode("carousel");
              }}
              title="3D Slider View (Default)"
              className={`p-2.5 rounded-full transition-all ${
                displayMode === "carousel"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playClick();
                setDisplayMode("grid");
              }}
              title="Grid View (All Videos)"
              className={`p-2.5 rounded-full transition-all ${
                displayMode === "grid"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
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
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-cinema-red" /> : <ChevronDown className="w-3.5 h-3.5 text-cinema-red" />}
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
            {/* Filter Hub: Categories & Aspect Ratio Format Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
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
                  ALL VIDEOS
                  <span className="ml-2 text-[10px] opacity-60">({videos.length})</span>
                </button>

                {VIDEO_CATEGORIES.map((cat) => {
                  const count = videos.filter((p) => p.category === cat).length;
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
                          ? "bg-cinema-red text-white font-bold shadow-md shadow-cinema-red/30"
                          : "bg-surface-200/60 text-neutral-400 hover:text-white hover:bg-surface-100"
                      }`}
                    >
                      {cat}
                      <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Format Filter: ALL vs 9:16 REEL vs 16:9 YOUTUBE */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-200/80 border border-white/10 text-xs font-mono self-start lg:self-auto">
                <button
                  onClick={() => {
                    playClick();
                    setFormatFilter("all");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    formatFilter === "all"
                      ? "bg-white/15 text-white font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  ALL SIZES
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setFormatFilter("reel");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    formatFilter === "reel"
                      ? "bg-cinema-red text-white font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>9:16 REELS</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setFormatFilter("youtube");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    formatFilter === "youtube"
                      ? "bg-cinema-cyan text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>16:9 YOUTUBE</span>
                </button>
              </div>
            </div>

            {/* Display Viewport: 3D Carousel OR Responsive Dynamic Grid */}
            {displayMode === "carousel" ? (
              <Carousel3DView
                projects={filteredVideos}
                onSelectProject={handleVideoCardClick}
              />
            ) : (
              /* Dynamic Multi-Column Grid that Expands Automatically for Unlimited Videos */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredVideos.map((project, idx) => {
                    const isReel = isProjectReel(project);
                    return (
                      <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.45, delay: idx * 0.05 }}
                        onClick={() => handleVideoCardClick(project)}
                        onMouseEnter={() => {
                          setHoveredProjectId(project.id);
                          setCursor("view", isReel ? "9:16 REEL" : "16:9 CINEMA");
                        }}
                        onMouseLeave={() => {
                          setHoveredProjectId(null);
                          resetCursor();
                        }}
                        className={`group relative cursor-pointer rounded-2xl overflow-hidden bg-surface-200/50 border border-white/[0.08] hover:border-cinema-red/40 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(255,59,30,0.25)] flex flex-col justify-between`}
                      >
                        {/* Video Thumbnail / Preview Window */}
                        <div
                          className={`relative overflow-hidden bg-black ${
                            isReel ? "aspect-[9/12] sm:aspect-[9/13]" : "aspect-[16/10]"
                          }`}
                        >
                          {/* Poster Image */}
                          <img
                            src={project.poster || project.mediaUrl}
                            alt={project.title}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 ${
                              hoveredProjectId === project.id && project.videoUrl
                                ? "opacity-0"
                                : "opacity-100"
                            }`}
                          />

                          {/* Hover Video Preview */}
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

                          {/* Vignette Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-black/30 pointer-events-none" />

                          {/* Dynamic Aspect Ratio & Format Badges */}
                          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                            {isReel ? (
                              <span className="px-2.5 py-1 rounded bg-cinema-red text-white text-[10px] font-mono tracking-wider font-bold flex items-center gap-1 shadow-md">
                                <Smartphone className="w-2.5 h-2.5" />
                                9:16 REEL
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur border border-white/20 text-white text-[10px] font-mono tracking-wider flex items-center gap-1">
                                <Tv className="w-2.5 h-2.5 text-cinema-cyan" />
                                16:9 WIDESCREEN
                              </span>
                            )}
                            <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono text-neutral-300">
                              {project.duration || "01:00"}
                            </span>
                          </div>

                          {/* Center Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-cinema-red text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,59,30,0.6)] transform group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Bottom Action Badge */}
                          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur border border-white/15 text-white font-mono text-[10px] flex items-center gap-1.5 shadow-xl">
                            <Play className="w-2.5 h-2.5 fill-current text-cinema-red" />
                            <span>OPEN IN DYNAMIC FRAME →</span>
                          </div>
                        </div>

                        {/* Video Card Metadata */}
                        <div className="p-5 md:p-6 space-y-3 font-mono">
                          <div className="flex items-center justify-between text-xs text-neutral-400">
                            <span className="text-cinema-red font-bold tracking-wider uppercase">
                              {project.client}
                            </span>
                            <span>{project.year}</span>
                          </div>

                          <h3 className="text-lg font-sans font-black uppercase text-white group-hover:text-cinema-red transition-colors duration-300">
                            {project.title}
                          </h3>

                          <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>

                          {/* Software Pipeline Tags */}
                          <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06]">
                            {project.techSpecs.software.slice(0, 3).map((tool, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-neutral-300"
                              >
                                {tool}
                              </span>
                            ))}
                            <span className="ml-auto text-[10px] text-neutral-400 group-hover:text-cinema-red transition-colors">
                              AUTO-FRAME ADAPT
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {filteredVideos.length === 0 && (
              <div className="py-20 text-center space-y-3 border border-dashed border-white/10 rounded-2xl">
                <Video className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="font-mono text-sm text-neutral-400">
                  No videos found matching the current filter.
                </p>
                {onOpenCMS && (
                  <button
                    onClick={() => onOpenCMS("video")}
                    className="px-4 py-2 rounded-full bg-cinema-red text-white text-xs font-mono font-bold"
                  >
                    + UPLOAD FIRST VIDEO HERE
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
