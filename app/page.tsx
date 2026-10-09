"use client";

import React, { useState } from "react";
import { SoundProvider } from "../components/audio/SoundContext";
import { CursorProvider } from "../components/cursor/CursorContext";
import { CustomCursor } from "../components/cursor/CustomCursor";
import { Navbar } from "../components/navigation/Navbar";
import { HeroSection } from "../components/hero/HeroSection";
import { ShowreelModal } from "../components/showreel/ShowreelModal";
import { VideoProjectsSection } from "../components/projects/VideoProjectsSection";
import { GraphicProjectsSection } from "../components/projects/GraphicProjectsSection";
import { ProjectDetailModal } from "../components/projects/ProjectDetailModal";
import { Graphic3DPedestalModal } from "../components/projects/Graphic3DPedestalModal";
import { CMSModal } from "../components/cms/CMSModal";
import { Project, ProjectType } from "../components/projects/ProjectsData";
import { ColorGradeSlider } from "../components/color-grade/ColorGradeSlider";
import { AwardsMarquee } from "../components/awards/AwardsMarquee";
import { AboutSection } from "../components/about/AboutSection";
import { TestimonialsSection } from "../components/testimonials/TestimonialsSection";
import { ContactSection } from "../components/contact/ContactSection";
import { Footer } from "../components/navigation/Footer";
import { Sliders, Sparkles } from "lucide-react";

export default function Home() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [cmsDefaultType, setCmsDefaultType] = useState<ProjectType>("video");
  const [selectedVideoProject, setSelectedVideoProject] = useState<Project | null>(null);
  const [selectedGraphicProject, setSelectedGraphicProject] = useState<Project | null>(null);

  const openContact = () => {
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenCMS = (type?: ProjectType) => {
    setCmsDefaultType(type || "video");
    setCmsOpen(true);
  };

  return (
    <SoundProvider>
      <CursorProvider>
        {/* Custom Glowing Cursor */}
        <CustomCursor />

        {/* Film Grain Texture Simulation */}
        <div className="film-grain" />

        {/* Subtle Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none scanline-grid opacity-15 z-30" />

        {/* Main App Container */}
        <main className="relative min-h-screen bg-[#050508] text-[#f3f3f6] overflow-x-hidden selection:bg-cinema-red selection:text-white">
          {/* Top Navbar */}
          <Navbar
            onOpenReel={() => setShowreelOpen(true)}
            onOpenContact={openContact}
            onOpenCMS={() => handleOpenCMS("video")}
          />

          {/* Hero Section with Centerpiece Selfie & Anti-Gravity 3D Physics */}
          <HeroSection
            onOpenReel={() => setShowreelOpen(true)}
            onOpenContact={openContact}
            onOpenCMS={() => handleOpenCMS("video")}
          />

          {/* Awards & Client Roster Marquee */}
          <AwardsMarquee />

          {/* SECTION 01: Commissioned Video Production & 3D Motion Showcase */}
          <VideoProjectsSection
            onSelectVideo={(p) => setSelectedVideoProject(p)}
            onOpenCMS={handleOpenCMS}
          />

          {/* SECTION 02: High-Res Graphic Design Showcase (Posts, Logos, Artwork) */}
          <GraphicProjectsSection
            onSelectGraphic={(p) => setSelectedGraphicProject(p)}
            onOpenCMS={handleOpenCMS}
          />

          {/* Before & After Color Grading & Correction */}
          <ColorGradeSlider />

          {/* About Me */}
          <AboutSection />

          {/* Client Reviews & Feedback */}
          <TestimonialsSection />

          {/* Get In Touch & Project Inquiry */}
          <ContactSection />

          {/* Studio Footer */}
          <Footer />

          {/* Floating Discreet CMS Launcher Dock (Quick Access for Artist) */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setCmsOpen(true)}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-200/90 border border-white/15 text-white backdrop-blur-xl shadow-2xl hover:border-cinema-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 active:scale-95"
              title="Open Native CMS Dashboard to Upload Videos & Graphics"
            >
              <div className="w-2 h-2 rounded-full bg-cinema-cyan animate-pulse" />
              <Sliders className="w-3.5 h-3.5 text-cinema-cyan group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-mono text-xs tracking-wider text-neutral-300 group-hover:text-white">
                CMS DASHBOARD
              </span>
            </button>
          </div>

          {/* Full-Screen Showreel Cinema Modal */}
          <ShowreelModal
            isOpen={showreelOpen}
            onClose={() => setShowreelOpen(false)}
          />

          {/* 3D Camera Zoom Full-Screen Video Player Modal */}
          <ProjectDetailModal
            project={selectedVideoProject}
            onClose={() => setSelectedVideoProject(null)}
          />

          {/* Sleek Immersive 3D Pedestal & Lightbox Modal for Graphics */}
          <Graphic3DPedestalModal
            project={selectedGraphicProject}
            onClose={() => setSelectedGraphicProject(null)}
          />

          {/* Custom Dual-Upload CMS Modal */}
          <CMSModal
            isOpen={cmsOpen}
            defaultType={cmsDefaultType}
            onClose={() => setCmsOpen(false)}
          />
        </main>
      </CursorProvider>
    </SoundProvider>
  );
}
