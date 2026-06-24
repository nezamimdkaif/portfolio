"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Cpu, Lock, ToggleLeft, ToggleRight } from "lucide-react";
import { getAssetPath } from "@/utils";

export default function CyberneticPortrait() {
  const [isArmed, setIsArmed] = useState(false);

  return (
    <div 
      className="relative w-full max-w-sm sm:max-w-md group"
      onMouseEnter={() => setIsArmed(true)}
      onMouseLeave={() => setIsArmed(false)}
    >
      {/* Outer futuristic background glow */}
      <motion.div 
        className="absolute inset-0 bg-accent-coral/10 rounded-2xl blur-2xl transition-all duration-700"
        animate={{
          backgroundColor: isArmed ? "rgba(251, 58, 93, 0.25)" : "rgba(251, 58, 93, 0.08)",
          scale: isArmed ? 1.05 : 1.0,
        }}
      />

      {/* Frame Container */}
      <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-[#0d0d0d] p-2 shadow-2xl transition-all duration-500">
        
        {/* Base Photo Layer */}
        <div className="relative overflow-hidden rounded-xl aspect-square w-full">
          <motion.img 
            src={getAssetPath("/moody_portrait.png")} 
            alt="Md Kaif Nezami portrait" 
            className="w-full h-full object-cover select-none pointer-events-none"
            animate={{
              scale: isArmed ? 1.03 : 1.0,
              filter: isArmed ? "brightness(0.7) contrast(1.1)" : "brightness(0.9) contrast(1.0)",
            }}
            transition={{ duration: 0.5 }}
          />

          {/* ================================================== */}
          {/* CYBERNETIC MASK OVERLAY & HUD DRAWINGS             */}
          {/* ================================================== */}
          <svg
            viewBox="0 0 1000 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none select-none mix-blend-screen"
          >
            <defs>
              {/* Cyan laser glow */}
              <filter id="hud-cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur1" />
                <feGaussianBlur stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Red glow for warning indicators */}
              <filter id="hud-red-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Carbon tech plate fill */}
              <linearGradient id="mask-plate-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e222b" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#0f1115" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#050608" stopOpacity="0.95" />
              </linearGradient>

              {/* Metallic highlight */}
              <linearGradient id="metal-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f5768" />
                <stop offset="100%" stopColor="#111317" />
              </linearGradient>
            </defs>

            {/* A. STANDBY HUD GRID (Shown at low opacity, gets active when armed) */}
            <g opacity={isArmed ? 0.9 : 0.25} className="transition-opacity duration-500">
              {/* Circular scan reticle around target */}
              <motion.circle
                cx="500"
                cy="460"
                r="380"
                stroke="#00f0ff"
                strokeWidth="0.75"
                strokeDasharray="6 20 120 40"
                animate={isArmed ? { rotate: 360 } : { rotate: 0 }}
                transition={isArmed ? { repeat: Infinity, duration: 25, ease: "linear" } : undefined}
                style={{ originX: "500px", originY: "460px" }}
              />
              <motion.circle
                cx="500"
                cy="460"
                r="395"
                stroke="#fb3a5d"
                strokeWidth="0.5"
                strokeDasharray="40 10 10 10"
                animate={isArmed ? { rotate: -360 } : { rotate: 0 }}
                transition={isArmed ? { repeat: Infinity, duration: 35, ease: "linear" } : undefined}
                style={{ originX: "500px", originY: "460px" }}
              />

              {/* Corner tech target brackets */}
              <path d="M 80 120 L 80 80 L 120 80 M 880 120 L 880 80 L 840 80 M 80 800 L 80 840 L 120 840 M 880 800 L 880 840 L 840 840" stroke="#00f0ff" strokeWidth="1.5" />
            </g>

            {/* B. DYNAMIC ACTIVE GLASSES VISOR OVERLAY */}
            <g className="eyewear-hud">
              {/* Main Visor Bar (Draws on activation) */}
              <motion.path
                d="M 310 390 L 690 390"
                stroke="#00f0ff"
                strokeWidth="2"
                filter="url(#hud-cyan-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isArmed ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* Left Eye Reticle Scanner (glowing concentric rings over left lens) */}
              <g transform="translate(425, 390)">
                <motion.circle
                  r="45"
                  stroke="#00f0ff"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: isArmed ? 0.8 : 0, scale: isArmed ? 1 : 0.5 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle
                  r="52"
                  stroke="#fb3a5d"
                  strokeWidth="0.75"
                  strokeDasharray="20 40"
                  animate={isArmed ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                {/* Horizontal lock line */}
                <motion.line
                  x1="-65"
                  y1="0"
                  x2="65"
                  y2="0"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                  opacity={isArmed ? 0.7 : 0}
                />
              </g>

              {/* Right Eye Reticle Scanner */}
              <g transform="translate(575, 390)">
                <motion.circle
                  r="45"
                  stroke="#00f0ff"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: isArmed ? 0.8 : 0, scale: isArmed ? 1 : 0.5 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                />
                <motion.circle
                  r="52"
                  stroke="#fb3a5d"
                  strokeWidth="0.75"
                  strokeDasharray="20 40"
                  animate={isArmed ? { rotate: -360 } : { rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                {/* Horizontal lock line */}
                <motion.line
                  x1="-65"
                  y1="0"
                  x2="65"
                  y2="0"
                  stroke="#00f0ff"
                  strokeWidth="0.5"
                  opacity={isArmed ? 0.7 : 0}
                />
              </g>
            </g>

            {/* C. SLIDING RESPIRATOR MASK PLATES (Nose, Mouth, and Jawline) */}
            <g className="mouth-respirator">
              {/* Left Cheek Plate: slides in from bottom-left */}
              <motion.g
                initial={{ x: -160, y: 100, opacity: 0 }}
                animate={{ 
                  x: isArmed ? 0 : -160, 
                  y: isArmed ? 0 : 100, 
                  opacity: isArmed ? 1 : 0 
                }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              >
                {/* Plate base polygon */}
                <path
                  d="M 320 540 L 460 520 L 490 570 L 450 670 L 330 630 Z"
                  fill="url(#mask-plate-grad)"
                  stroke="url(#metal-edge)"
                  strokeWidth="2.5"
                />
                {/* Cyan Neon Light Trim */}
                <path
                  d="M 335 550 L 452 533 L 480 575"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  filter="url(#hud-cyan-glow)"
                />
                {/* Ventilation slots */}
                <line x1="360" y1="580" x2="410" y2="575" stroke="#121519" strokeWidth="4" strokeLinecap="round" />
                <line x1="365" y1="600" x2="415" y2="595" stroke="#121519" strokeWidth="4" strokeLinecap="round" />
              </motion.g>

              {/* Right Cheek Plate: slides in from bottom-right */}
              <motion.g
                initial={{ x: 160, y: 100, opacity: 0 }}
                animate={{ 
                  x: isArmed ? 0 : 160, 
                  y: isArmed ? 0 : 100, 
                  opacity: isArmed ? 1 : 0 
                }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              >
                {/* Plate base polygon */}
                <path
                  d="M 680 540 L 540 520 L 510 570 L 550 670 L 670 630 Z"
                  fill="url(#mask-plate-grad)"
                  stroke="url(#metal-edge)"
                  strokeWidth="2.5"
                />
                {/* Cyan Neon Light Trim */}
                <path
                  d="M 665 550 L 548 533 L 520 575"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  filter="url(#hud-cyan-glow)"
                />
                {/* Ventilation slots */}
                <line x1="640" y1="580" x2="590" y2="575" stroke="#121519" strokeWidth="4" strokeLinecap="round" />
                <line x1="635" y1="600" x2="585" y2="595" stroke="#121519" strokeWidth="4" strokeLinecap="round" />
              </motion.g>

              {/* Center Filter Node Core: drops down from center nose bridge */}
              <motion.g
                initial={{ y: -120, opacity: 0 }}
                animate={{ 
                  y: isArmed ? 0 : -120, 
                  opacity: isArmed ? 1 : 0 
                }}
                transition={{ type: "spring", stiffness: 140, damping: 15, delay: 0.05 }}
              >
                {/* Nose bridge clamp */}
                <path
                  d="M 470 470 L 530 470 L 540 520 L 460 520 Z"
                  fill="#2c323f"
                  stroke="#101217"
                  strokeWidth="1.5"
                />
                {/* Center respirator core box */}
                <path
                  d="M 465 515 L 535 515 L 540 580 L 500 630 L 460 580 Z"
                  fill="#15171e"
                  stroke="url(#metal-edge)"
                  strokeWidth="2"
                />
                {/* Glowing red lock sensor in the center */}
                <circle cx="500" cy="555" r="8" fill="#fb3a5d" filter="url(#hud-red-glow)" />
                <circle cx="500" cy="555" r="3.5" fill="#ffffff" />

                {/* Sub-mesh details */}
                <rect x="480" y="582" width="40" height="4" fill="#0c0d10" rx="1" />
                <rect x="485" y="592" width="30" height="4" fill="#0c0d10" rx="1" />
              </motion.g>
            </g>

            {/* D. INTERACTIVE DIAGNOSTIC DATA LABELS (On the sides) */}
            <g className="hud-data-labels" fontSize="12" fontFamily="monospace" fill="#00f0ff">
              {/* Left Label Line */}
              <motion.path
                d="M 280 250 L 150 250 L 120 280"
                stroke="#00f0ff"
                strokeWidth="1"
                opacity={isArmed ? 0.75 : 0}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isArmed ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              {/* Left Label Text */}
              <motion.g
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isArmed ? 0.95 : 0, x: isArmed ? 0 : -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <text x="110" y="305" fill="#00f0ff" textAnchor="end">SYS_HELMET: LOCKED</text>
                <text x="110" y="325" fill="#fb3a5d" textAnchor="end">TARGET_ID: MD_KAIF</text>
                <text x="110" y="345" fill="rgba(255,255,255,0.5)" textAnchor="end" fontSize="10">COORDS: 23.81N 86.44E</text>
              </motion.g>

              {/* Right Label Line */}
              <motion.path
                d="M 720 250 L 850 250 L 880 280"
                stroke="#00f0ff"
                strokeWidth="1"
                opacity={isArmed ? 0.75 : 0}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isArmed ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
              {/* Right Label Text */}
              <motion.g
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isArmed ? 0.95 : 0, x: isArmed ? 0 : 20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <text x="890" y="305" fill="#00f0ff">GCS_AUTONOMY: ARMED</text>
                <text x="890" y="325" fill="#4ade80">CALIBRATION: OK</text>
                <text x="890" y="345" fill="rgba(255,255,255,0.5)" fontSize="10">UAV_LINK: ACTIVE 60FPS</text>
              </motion.g>
            </g>
          </svg>
        </div>

        {/* Corner styling widgets */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent-coral" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent-coral" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent-coral" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent-coral" />
      </div>

      {/* Manual toggle override for Mobile/Tablet users */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsArmed(!isArmed)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-[#1c1c1c]/80 text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-white hover:border-accent-coral hover:bg-accent-coral/10 transition-all duration-300 shadow-md cursor-pointer z-10"
        >
          {isArmed ? (
            <>
              <ToggleRight size={16} className="text-accent-coral" />
              <span>Cybernetics: ARMED</span>
            </>
          ) : (
            <>
              <ToggleLeft size={16} className="text-gray-400" />
              <span>Cybernetics: STANDBY</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
