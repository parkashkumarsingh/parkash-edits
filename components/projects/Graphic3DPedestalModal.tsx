"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  RotateCw,
  Sun,
  Layers,
  ZoomIn,
  Download,
  Share2,
  CheckCircle2,
  Eye,
  Sparkles,
  Shirt,
  Box,
  Image as ImageIcon,
  ArrowLeft
} from "lucide-react";
import { Project } from "./ProjectsData";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

// 3D Pedestal and Graphic Display Canvas inside Modal
function PedestalShowcase3D({
  imageUrl,
  lightingPreset,
  mockupType,
  wireframe,
  autoRotate,
}: {
  imageUrl: string;
  lightingPreset: "cyber" | "studio" | "tungsten" | "dark";
  mockupType: "pedestal" | "apparel" | "packaging" | "sticker" | "print";
  wireframe: boolean;
  autoRotate: boolean;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const meshGroupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.generateMipmaps = true;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fallback placeholder
      }
    );
  }, [imageUrl]);

  useFrame((_, delta) => {
    if (autoRotate && meshGroupRef.current) {
      meshGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  // Lighting configurations
  const lightColors = {
    cyber: { key: "#ff3b1e", fill: "#00e5ff", rim: "#ffffff" },
    studio: { key: "#ffffff", fill: "#cbd5e1", rim: "#94a3b8" },
    tungsten: { key: "#ff9933", fill: "#3b82f6", rim: "#fcd34d" },
    dark: { key: "#6366f1", fill: "#06b6d4", rim: "#4338ca" },
  }[lightingPreset];

  return (
    <>
      <ambientLight intensity={lightingPreset === "studio" ? 0.9 : 0.4} />
      <pointLight position={[3, 4, 3]} intensity={2.5} color={lightColors.key} />
      <pointLight position={[-3, -2, -2]} intensity={2.2} color={lightColors.fill} />
      <spotLight position={[0, 6, 2]} intensity={2.0} color={lightColors.rim} angle={0.5} penumbra={0.7} />

      <group ref={meshGroupRef} position={[0, 0, 0]}>
        {/* 1. Cylindrical Illuminated Exhibition Pedestal Base */}
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[1.5, 1.6, 0.4, 48]} />
          <meshStandardMaterial
            color="#0d1017"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>

        {/* Glowing Pedestal Light Ring */}
        <mesh position={[0, -1.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.42, 0.04, 16, 48]} />
          <meshBasicMaterial color={lightColors.fill} />
        </mesh>

        {/* 2. Graphic Display Mesh based on Mockup Type */}
        <Float speed={autoRotate ? 2 : 0} rotationIntensity={0.2} floatIntensity={0.3}>
          {mockupType === "packaging" ? (
            // Cylindrical packaging canister render
            <group position={[0, 0.2, 0]}>
              <mesh>
                <cylinderGeometry args={[0.9, 0.9, 2.2, 48]} />
                {texture ? (
                  <meshStandardMaterial
                    map={texture}
                    metalness={0.4}
                    roughness={0.3}
                    wireframe={wireframe}
                  />
                ) : (
                  <meshStandardMaterial color="#1a1d26" wireframe={wireframe} />
                )}
              </mesh>
              {/* Canister Metallic Cap & Base */}
              <mesh position={[0, 1.15, 0]}>
                <cylinderGeometry args={[0.92, 0.92, 0.1, 48]} />
                <meshStandardMaterial color="#2d3345" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[0, -1.15, 0]}>
                <cylinderGeometry args={[0.92, 0.92, 0.1, 48]} />
                <meshStandardMaterial color="#2d3345" metalness={0.95} roughness={0.15} />
              </mesh>
            </group>
          ) : mockupType === "sticker" ? (
            // Holographic Die-Cut Pop Art Sticker Plate
            <group position={[0, 0.2, 0]}>
              <mesh>
                <boxGeometry args={[2.0, 2.0, 0.05]} />
                {texture ? (
                  <meshStandardMaterial
                    map={texture}
                    metalness={0.8}
                    roughness={0.1}
                    wireframe={wireframe}
                  />
                ) : (
                  <meshStandardMaterial color="#1f2433" wireframe={wireframe} />
                )}
              </mesh>
              {/* Die-Cut White Vinyl Edge Border */}
              <mesh position={[0, 0, -0.01]}>
                <boxGeometry args={[2.1, 2.1, 0.04]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
              </mesh>
            </group>
          ) : mockupType === "apparel" ? (
            // Streetwear Garment Fabric Display Board
            <group position={[0, 0.2, 0]}>
              <mesh>
                <boxGeometry args={[2.0, 2.4, 0.08]} />
                <meshStandardMaterial
                  color="#111319"
                  roughness={0.9}
                  metalness={0.05}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Printed Graphic Decal on Fabric */}
              <mesh position={[0, 0.1, 0.045]}>
                <planeGeometry args={[1.7, 2.0]} />
                {texture ? (
                  <meshBasicMaterial map={texture} transparent opacity={0.96} />
                ) : (
                  <meshBasicMaterial color="#ffffff" wireframe />
                )}
              </mesh>
            </group>
          ) : (
            // Monolith Exhibition Pedestal Art Display
            <group position={[0, 0.2, 0]}>
              {/* Back Monolith Bezel */}
              <mesh position={[0, 0, -0.04]}>
                <boxGeometry args={[2.2, 2.2, 0.08]} />
                <meshStandardMaterial
                  color="#0e111a"
                  metalness={0.9}
                  roughness={0.2}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Emissive Edge Rim */}
              <mesh position={[0, 0, -0.04]}>
                <boxGeometry args={[2.24, 2.24, 0.06]} />
                <meshBasicMaterial color={lightColors.key} wireframe transparent opacity={0.4} />
              </mesh>
              {/* High-Res Art Canvas */}
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[2.1, 2.1]} />
                {texture ? (
                  <meshBasicMaterial map={texture} />
                ) : (
                  <meshStandardMaterial color="#1a1f2e" wireframe={wireframe} />
                )}
              </mesh>
              {/* Glass Coating */}
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[2.1, 2.1]} />
                <meshPhysicalMaterial
                  transparent
                  opacity={0.12}
                  roughness={0.05}
                  metalness={0.1}
                  transmission={0.9}
                />
              </mesh>
            </group>
          )}
        </Float>
      </group>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={8}
      />
    </>
  );
}

interface Graphic3DPedestalModalProps {
  project: Project | null;
  onClose: () => void;
}

export const Graphic3DPedestalModal: React.FC<Graphic3DPedestalModalProps> = ({
  project,
  onClose,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();

  const [lightingPreset, setLightingPreset] = useState<"cyber" | "studio" | "tungsten" | "dark">("cyber");
  const [mockupType, setMockupType] = useState<"pedestal" | "apparel" | "packaging" | "sticker" | "print">("pedestal");
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<"3d" | "flat">("3d");
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      if (project.mockupType) {
        setMockupType(project.mockupType as any);
      } else {
        setMockupType("pedestal");
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Handle ESC key to go back / close
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose, playClick]);

  if (!project) return null;

  const handleShare = () => {
    playClick();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            playClick();
            onClose();
          }
        }}
        className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 overflow-hidden select-none"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {/* Prominent Go Back button */}
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              onMouseEnter={() => {
                playHover();
                setCursor("pointer");
              }}
              onMouseLeave={resetCursor}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-cinema-red text-white text-xs font-mono font-bold transition-all border border-white/15 cursor-pointer shadow-md group"
              title="Go back (Escape)"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>GO BACK</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-neutral-400 font-mono">
                ESC
              </span>
            </button>

            <span className="w-2.5 h-2.5 rounded-full bg-cinema-cyan animate-pulse hidden xs:inline-block" />
            <div>
              <p className="text-[11px] font-mono uppercase text-cinema-cyan tracking-widest">
                INTERACTIVE MOCKUP & LIGHTBOX // {project.category}
              </p>
              <h3 className="text-base md:text-xl font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-md">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Mode Switcher: 3D Mockup vs Flat High-Res Lightbox */}
          <div className="hidden sm:flex items-center gap-2 bg-surface-200/80 p-1 rounded-full border border-white/10 text-xs font-mono">
            <button
              onClick={() => {
                playClick();
                setViewMode("3d");
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                viewMode === "3d" ? "bg-cinema-cyan text-black font-bold shadow-md" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D MOCKUP</span>
            </button>
            <button
              onClick={() => {
                playClick();
                setViewMode("flat");
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                viewMode === "flat" ? "bg-cinema-cyan text-black font-bold shadow-md" : "text-neutral-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>HIGH-RES LIGHTBOX</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            onMouseEnter={() => {
              playHover();
              setCursor("pointer");
            }}
            onMouseLeave={resetCursor}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-cinema-red hover:border-cinema-red transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Stage: 3D Pedestal or Flat Lightbox */}
        <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-2xl bg-[#07090e] border border-white/10 shadow-2xl">
          {viewMode === "3d" ? (
            <>
              {/* 3D WebGL Canvas */}
              <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
                <PedestalShowcase3D
                  imageUrl={project.mediaUrl || project.poster}
                  lightingPreset={lightingPreset}
                  mockupType={mockupType}
                  wireframe={wireframe}
                  autoRotate={autoRotate}
                />
              </Canvas>

              {/* Floating 3D Tool Overlay Controls */}
              <div className="absolute bottom-6 left-6 flex flex-wrap items-center gap-3 font-mono text-xs">
                {/* Lighting Rig Presets */}
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/15">
                  <span className="text-[10px] text-neutral-400 px-2">LIGHT:</span>
                  {(["cyber", "studio", "tungsten", "dark"] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        playClick();
                        setLightingPreset(preset);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                        lightingPreset === preset
                          ? "bg-cinema-cyan text-black"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Mockup Type Switcher */}
                <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/15">
                  <span className="text-[10px] text-neutral-400 px-2">MOCKUP:</span>
                  {(["pedestal", "apparel", "packaging", "sticker"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        playClick();
                        setMockupType(type);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold transition-all ${
                        mockupType === type
                          ? "bg-cinema-red text-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Turntable Auto-Rotate Toggle */}
                <button
                  onClick={() => {
                    playClick();
                    setAutoRotate(!autoRotate);
                  }}
                  className={`px-3 py-1.5 rounded-xl border backdrop-blur-md text-[11px] flex items-center gap-1.5 transition-all ${
                    autoRotate
                      ? "bg-white/15 border-white/30 text-white"
                      : "bg-black/60 border-white/10 text-neutral-400"
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin-slow" : ""}`} />
                  <span>360° SPIN</span>
                </button>

                {/* Wireframe toggle */}
                <button
                  onClick={() => {
                    playClick();
                    setWireframe(!wireframe);
                  }}
                  className={`px-3 py-1.5 rounded-xl border backdrop-blur-md text-[11px] flex items-center gap-1.5 transition-all ${
                    wireframe
                      ? "bg-cinema-cyan/20 border-cinema-cyan text-cinema-cyan"
                      : "bg-black/60 border-white/10 text-neutral-400"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>WIREFRAME</span>
                </button>
              </div>

              {/* Orbit Instructions Badge */}
              <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono text-neutral-300">
                DRAG TO ORBIT // SCROLL TO ZOOM
              </div>
            </>
          ) : (
            // Flat Ultra-Res Lightbox View
            <div className="relative w-full h-full flex items-center justify-center p-8 overflow-auto">
              <img
                src={project.mediaUrl || project.poster}
                alt={project.title}
                className={`max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 ${
                  isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in shadow-2xl"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="px-4 py-2 rounded-full bg-black/70 backdrop-blur border border-white/20 text-xs font-mono text-white flex items-center gap-2"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>{isZoomed ? "ZOOM OUT (100%)" : "ZOOM IN (150%)"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Metadata & Production Brief Drawer */}
        <div className="bg-surface-200/90 border border-white/10 rounded-xl p-4 md:p-6 backdrop-blur-xl font-mono text-xs max-h-44 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase">CLIENT / BRAND</span>
              <p className="text-white font-bold text-sm">{project.client}</p>
              <p className="text-cinema-cyan text-[11px]">{project.year} • {project.role}</p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <span className="text-[10px] text-neutral-400 uppercase">DESIGN BRIEF & EXECUTION</span>
              <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techSpecs.software.map((sw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300"
                  >
                    {sw}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between items-start md:items-end gap-2">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-neutral-400 uppercase">MASTER RESOLUTION</span>
                <p className="text-white font-semibold">{project.dimensions || project.techSpecs.resolution || "300 DPI // Vector"}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5 text-[11px]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? "COPIED" : "SHARE"}</span>
                </button>

                <a
                  href={project.mediaUrl || project.poster}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1.5 rounded-lg bg-cinema-cyan text-black font-bold flex items-center gap-1.5 text-[11px] hover:bg-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>RAW ASSET</span>
                </a>

                <button
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-cinema-red text-white font-bold flex items-center gap-1.5 text-[11px] transition-colors border border-white/15 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>GO BACK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
