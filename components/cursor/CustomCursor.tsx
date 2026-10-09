"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "./CursorContext";
import { Play } from "lucide-react";

export const CustomCursor: React.FC = () => {
  const { cursorMode, cursorText } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor trailing
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouch || cursorMode === "hidden") return null;

  const isExpanded = cursorMode === "play" || cursorMode === "view" || cursorMode === "drag" || cursorMode === "scrub";

  return (
    <>
      {/* High-speed central pinpoint dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isVisible ? (isExpanded ? 0 : 1) : 0,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-cinema-red shadow-[0_0_10px_#ff3b1e]" />
      </motion.div>

      {/* Trailing follower badge / target ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          x: smoothX,
          y: smoothY,
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isExpanded ? 88 : cursorMode === "pointer" ? 44 : 32,
          height: isExpanded ? 88 : cursorMode === "pointer" ? 44 : 32,
          scale: 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {isExpanded ? (
          <div
            className={`w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-md border shadow-2xl transition-colors duration-300 ${
              cursorMode === "play"
                ? "bg-cinema-red text-white border-cinema-red/80 shadow-[0_0_30px_rgba(255,59,30,0.6)]"
                : cursorMode === "drag" || cursorMode === "scrub"
                ? "bg-cinema-cyan/90 text-black border-cinema-cyan shadow-[0_0_30px_rgba(0,229,255,0.6)]"
                : "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            }`}
          >
            {cursorMode === "play" && <Play className="w-5 h-5 fill-current mb-0.5 ml-0.5" />}
            <span className="font-mono text-[11px] font-black tracking-widest uppercase">
              {cursorText || (cursorMode === "play" ? "PLAY" : cursorMode === "drag" ? "DRAG" : "VIEW")}
            </span>
          </div>
        ) : (
          <div
            className={`w-full h-full rounded-full border transition-all duration-200 ${
              cursorMode === "pointer"
                ? "border-cinema-red/80 bg-cinema-red/10 scale-110"
                : "border-white/30"
            }`}
          />
        )}
      </motion.div>
    </>
  );
};
