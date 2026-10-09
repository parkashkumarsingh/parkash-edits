"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const HeroFallback3D: React.FC<{ mousePosition: { x: number; y: number } }> = ({
  mousePosition,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center lg:justify-end lg:pr-[6vw] xl:pr-[9vw] 2xl:pr-[13vw]">
      <motion.div
        className="relative w-[340px] h-[460px] sm:w-[420px] sm:h-[570px] lg:w-[480px] lg:h-[650px] flex items-center justify-center"
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
          rotateY: mousePosition.x * 12,
          rotateX: -mousePosition.y * 12,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Soft volumetric glow backing */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cinema-red/25 via-transparent to-cinema-cyan/25 blur-3xl scale-110" />

        {/* Anamorphic Blue Flare Line */}
        <div className="absolute w-[160%] h-[2px] bg-gradient-to-r from-transparent via-cinema-cyan/60 to-transparent blur-[1px]" />

        {/* Person Cutout */}
        <div className="relative w-full h-full">
          <Image
            src="/photographer-hero.png"
            alt="Photographer with DSLR"
            fill
            priority
            className="object-contain drop-shadow-[0_20px_50px_rgba(0,229,255,0.25)]"
          />
        </div>

      </motion.div>
    </div>
  );
};
