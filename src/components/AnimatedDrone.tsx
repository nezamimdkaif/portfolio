"use client";

import { motion } from "framer-motion";

interface AnimatedDroneProps {
  isEngineOn?: boolean;
  isLaserGridOn?: boolean;
  ledPulseSpeed?: 0 | 1 | 2; // 0 = solid, 1 = slow pulse, 2 = fast pulse
  altitude?: number; // 0 to 100 (0 = landed, 100 = full hover altitude)
  scale?: number;
  opacity?: number;
  className?: string;
  showBackground?: boolean;
  isLanding?: boolean;
}

export default function AnimatedDrone({
  isEngineOn = true,
  isLaserGridOn = true,
  ledPulseSpeed = 1,
  altitude = 100,
  scale = 1,
  opacity = 1,
  className = "",
  showBackground = true,
}: AnimatedDroneProps) {
  // LED Pulse timings based on speed
  const ledDurations = {
    0: 0,
    1: 2.0,
    2: 0.5,
  };

  // Convert 0-100 altitude to actual vertical offset in SVG
  // Max hover height offset is 0px (at altitude 100)
  // Landed height offset is 110px down (at altitude 0)
  const verticalOffset = ((100 - altitude) / 100) * 110;

  // Propeller animation parameters
  const propTransition = isEngineOn
    ? { repeat: Infinity, duration: 0.08, ease: "linear" }
    : { duration: 1.5, ease: "easeOut" };

  return (
    <div
      className={`relative w-full h-full min-h-[350px] flex items-center justify-center overflow-hidden transition-all duration-700 ${className}`}
      style={{
        background: showBackground
          ? "radial-gradient(circle at center, #1b202c 0%, #080a0e 100%)"
          : "transparent",
        opacity,
      }}
    >
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-3xl"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          {/* Intense red laser glow filter */}
          <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft red LED ambient light glow */}
          <filter id="red-led-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 1  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Propeller motion blur filter */}
          <filter id="prop-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
          </filter>

          {/* Shading gradients for the drone body */}
          <linearGradient id="body-grad" x1="400" y1="180" x2="400" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f5664" />
            <stop offset="45%" stopColor="#2c303a" />
            <stop offset="100%" stopColor="#15171c" />
          </linearGradient>

          <linearGradient id="arm-front-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2c303a" />
            <stop offset="50%" stopColor="#454c59" />
            <stop offset="100%" stopColor="#1a1c22" />
          </linearGradient>

          <linearGradient id="propeller-grad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.03)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.22)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.03)" />
          </linearGradient>

          <radialGradient id="camera-lens" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="40%" stopColor="#a3001e" />
            <stop offset="100%" stopColor="#110003" />
          </radialGradient>
        </defs>

        {/* ========================================== */}
        {/* 1. FLICKERING PERSPECTIVE RED LASER GRID   */}
        {/* ========================================== */}
        {isLaserGridOn && (
          <g className="laser-grid-group">
            {/* Ambient Red landing glow */}
            <ellipse
              cx="400"
              cy="435"
              rx="240"
              ry="45"
              fill="rgba(251, 58, 93, 0.04)"
              filter="url(#red-led-glow)"
            />

            {/* Flickering Laser Grid lines (Perspective Trapezoid) */}
            <motion.polygon
              points="220,400 580,400 680,470 120,470"
              fill="none"
              stroke="#fb3a5d"
              strokeWidth="2.5"
              filter="url(#laser-glow)"
              animate={{
                opacity: [0.9, 0.25, 0.95, 0.15, 0.9, 0.8, 0.1, 0.95, 0.4, 0.9],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "linear",
              }}
            />

            {/* Inner diagonal cross laser guidelines */}
            <motion.path
              d="M 220 400 L 680 470 M 580 400 L 120 470"
              stroke="#fb3a5d"
              strokeWidth="0.8"
              strokeDasharray="4 8"
              opacity="0.6"
              animate={{
                opacity: [0.6, 0.2, 0.8, 0.1, 0.7, 0.5, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            />

            {/* Corner Bracket markers */}
            <motion.path
              d="M 200 400 L 220 400 L 220 415 M 580 415 L 580 400 L 600 400 M 100 455 L 120 470 L 145 470 M 700 455 L 680 470 L 655 470"
              stroke="#fb3a5d"
              strokeWidth="2"
              fill="none"
              filter="url(#laser-glow)"
              animate={{
                opacity: [1, 0.3, 0.9, 0.2, 1, 0.8, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "linear",
              }}
            />
          </g>
        )}

        {/* Shadow of the drone on the ground */}
        <motion.ellipse
          cx="400"
          cy="435"
          // Shadow gets smaller, more transparent, and blurs more as altitude increases
          animate={{
            rx: altitude > 10 ? 100 * (altitude / 100) + 40 : 130,
            ry: altitude > 10 ? 20 * (altitude / 100) + 10 : 25,
            opacity: altitude > 10 ? 0.65 - (altitude / 100) * 0.45 : 0.75,
          }}
          transition={{ duration: 0.4 }}
          fill="rgba(0, 0, 0, 0.65)"
          filter="url(#prop-blur)"
        />

        {/* ========================================== */}
        {/* 2. HOVERING DRONE GROUP                    */}
        {/* ========================================== */}
        <motion.g
          className="drone-assembly"
          // Subtle up-and-down floating motion when hovering in place
          animate={{
            y: isEngineOn 
              ? [verticalOffset, verticalOffset - 12, verticalOffset] 
              : [verticalOffset, verticalOffset, verticalOffset],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
          }}
        >
          {/* ========================================== */}
          {/* REAR ARMS & REAR MOTOR PODS                */}
          {/* ========================================== */}
          <g id="rear-arms" opacity="0.9">
            {/* Rear Left Arm */}
            <path
              d="M 330 240 L 220 280 L 210 270 L 320 230 Z"
              fill="#181a20"
              stroke="#0f1115"
              strokeWidth="1.5"
            />
            {/* Rear Right Arm */}
            <path
              d="M 470 240 L 580 280 L 590 270 L 480 230 Z"
              fill="#181a20"
              stroke="#0f1115"
              strokeWidth="1.5"
            />
            {/* Rear Left Motor housing */}
            <rect x="200" y="260" width="22" height="30" rx="3" fill="#252a35" stroke="#0e1014" strokeWidth="1" />
            <ellipse cx="211" cy="260" rx="11" ry="3" fill="#1c1e24" />

            {/* Rear Right Motor housing */}
            <rect x="578" y="260" width="22" height="30" rx="3" fill="#252a35" stroke="#0e1014" strokeWidth="1" />
            <ellipse cx="589" cy="260" rx="11" ry="3" fill="#1c1e24" />
          </g>

          {/* ========================================== */}
          {/* FRONT ARMS & FRONT MOTOR PODS              */}
          {/* ========================================== */}
          <g id="front-arms">
            {/* Front Left Arm (Sleek carbon fiber angular shape) */}
            <path
              d="M 350 245 L 240 315 L 235 345 L 255 348 L 360 262 Z"
              fill="url(#arm-front-grad)"
              stroke="#12141a"
              strokeWidth="1.5"
            />
            {/* Front Left Arm Edge Highlight */}
            <path
              d="M 350 246 L 240 316 L 236 332"
              stroke="#5b6475"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Front Right Arm */}
            <path
              d="M 450 245 L 560 315 L 565 345 L 545 348 L 440 262 Z"
              fill="url(#arm-front-grad)"
              stroke="#12141a"
              strokeWidth="1.5"
            />
            {/* Front Right Arm Edge Highlight */}
            <path
              d="M 450 246 L 560 316 L 564 332"
              stroke="#5b6475"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Front Left Motor Pod / Leg Support */}
            <g id="left-motor-pod">
              {/* Cylinder motor */}
              <rect x="230" y="325" width="28" height="42" rx="4" fill="#2c313d" stroke="#101217" strokeWidth="1.5" />
              {/* Silver metallic band */}
              <rect x="230" y="333" width="28" height="6" fill="#6d7688" />
              <ellipse cx="244" cy="325" rx="14" ry="4" fill="#181a20" />
              
              {/* Landing leg extending downwards */}
              <path d="M 240 367 L 240 400 L 246 400 L 246 367 Z" fill="#1a1c22" stroke="#0b0c0f" strokeWidth="1" />
              <rect x="236" y="398" width="14" height="4" rx="1" fill="#111317" />
            </g>

            {/* Front Right Motor Pod / Leg Support */}
            <g id="right-motor-pod">
              {/* Cylinder motor */}
              <rect x="542" y="325" width="28" height="42" rx="4" fill="#2c313d" stroke="#101217" strokeWidth="1.5" />
              {/* Silver metallic band */}
              <rect x="542" y="333" width="28" height="6" fill="#6d7688" />
              <ellipse cx="556" cy="325" rx="14" ry="4" fill="#181a20" />
              
              {/* Landing leg extending downwards */}
              <path d="M 560 367 L 560 400 L 554 400 L 554 367 Z" fill="#1a1c22" stroke="#0b0c0f" strokeWidth="1" />
              <rect x="550" y="398" width="14" height="4" rx="1" fill="#111317" />
            </g>
          </g>

          {/* ========================================== */}
          {/* PULSING RED LEDs UNDER MOTOR PODS          */}
          {/* ========================================== */}
          <g id="led-lights">
            {/* Front Left LED glow cone */}
            <motion.ellipse
              cx="244"
              cy="365"
              rx="15"
              ry="10"
              fill="#fb3a5d"
              filter="url(#red-led-glow)"
              animate={
                ledPulseSpeed > 0
                  ? { opacity: [0.3, 0.95, 0.3], scale: [0.9, 1.15, 0.9] }
                  : { opacity: 0.85 }
              }
              transition={
                ledPulseSpeed > 0
                  ? {
                      repeat: Infinity,
                      duration: ledDurations[ledPulseSpeed],
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />
            {/* LED actual tiny diode */}
            <circle cx="244" cy="364" r="3.5" fill="#ffffff" />
            <circle cx="244" cy="364" r="2" fill="#fb3a5d" />

            {/* Front Right LED glow cone */}
            <motion.ellipse
              cx="556"
              cy="365"
              rx="15"
              ry="10"
              fill="#fb3a5d"
              filter="url(#red-led-glow)"
              animate={
                ledPulseSpeed > 0
                  ? { opacity: [0.3, 0.95, 0.3], scale: [0.9, 1.15, 0.9] }
                  : { opacity: 0.85 }
              }
              transition={
                ledPulseSpeed > 0
                  ? {
                      repeat: Infinity,
                      duration: ledDurations[ledPulseSpeed],
                      ease: "easeInOut",
                      delay: 0.1, // micro phase delay for realism
                    }
                  : undefined
              }
            />
            {/* LED actual tiny diode */}
            <circle cx="556" cy="364" r="3.5" fill="#ffffff" />
            <circle cx="556" cy="364" r="2" fill="#fb3a5d" />
          </g>

          {/* ========================================== */}
          {/* DRONE MAIN CHASSIS (Aerodynamic Core)      */}
          {/* ========================================== */}
          <g id="drone-body">
            {/* Main fuselage shell */}
            <path
              d="M 330 220 C 330 190, 470 190, 470 220 C 470 250, 460 275, 430 282 C 410 285, 390 285, 370 282 C 340 275, 330 250, 330 220 Z"
              fill="url(#body-grad)"
              stroke="#0f1115"
              strokeWidth="2"
            />
            {/* Silver metal canopy trim */}
            <path
              d="M 345 210 C 380 202, 420 202, 455 210 M 358 240 L 442 240"
              stroke="#586070"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Cybernetic red pixel cluster detail (matches background highlight in reference) */}
            <rect x="396" y="200" width="8" height="8" rx="1.5" fill="#fb3a5d" opacity="0.9" />
            <rect x="406" y="204" width="4" height="4" rx="1" fill="#fb3a5d" opacity="0.8" />

            {/* Front ventilation slots */}
            <rect x="355" y="218" width="18" height="6" rx="1.5" fill="#131518" />
            <rect x="427" y="218" width="18" height="6" rx="1.5" fill="#131518" />

            {/* Front-Facing Camera Gimbal Mount */}
            <rect x="382" y="268" width="36" height="24" rx="6" fill="#181b22" stroke="#0a0c0e" strokeWidth="1.5" />
            
            {/* Rotating Camera Gimbal head */}
            <motion.g
              animate={isEngineOn ? { rotateY: [0, -10, 10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            >
              {/* Spherical Camera lens casing */}
              <circle cx="400" cy="282" r="13" fill="#2d3341" stroke="#0e1014" strokeWidth="1.5" />
              {/* Lens glass */}
              <circle cx="400" cy="282" r="8" fill="url(#camera-lens)" />
              {/* Reflection */}
              <circle cx="397" cy="279" r="2.5" fill="#ffffff" opacity="0.6" />
            </motion.g>
          </g>

          {/* ========================================== */}
          {/* SPINNING BLURRED PROPELLERS                */}
          {/* ========================================== */}
          <g id="propellers">
            {/* Rear Left Propeller Blur */}
            <g transform="translate(211, 260)">
              <motion.ellipse
                cx="0"
                cy="0"
                rx={isEngineOn ? "60" : "55"}
                ry={isEngineOn ? "4" : "1.5"}
                fill={isEngineOn ? "url(#propeller-grad)" : "#222"}
                stroke={isEngineOn ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)"}
                strokeWidth="0.5"
                filter="url(#prop-blur)"
                animate={isEngineOn ? { rotate: 360 } : { rotate: 0 }}
                transition={propTransition}
                style={{ originX: 0, originY: 0 }}
              />
            </g>

            {/* Rear Right Propeller Blur */}
            <g transform="translate(589, 260)">
              <motion.ellipse
                cx="0"
                cy="0"
                rx={isEngineOn ? "60" : "55"}
                ry={isEngineOn ? "4" : "1.5"}
                fill={isEngineOn ? "url(#propeller-grad)" : "#222"}
                stroke={isEngineOn ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)"}
                strokeWidth="0.5"
                filter="url(#prop-blur)"
                animate={isEngineOn ? { rotate: -360 } : { rotate: 0 }}
                transition={propTransition}
                style={{ originX: 0, originY: 0 }}
              />
            </g>

            {/* Front Left Propeller Blur (Closer, larger, highly detailed) */}
            <g transform="translate(244, 325)">
              <motion.ellipse
                cx="0"
                cy="0"
                rx={isEngineOn ? "90" : "80"}
                ry={isEngineOn ? "6" : "2"}
                fill={isEngineOn ? "url(#propeller-grad)" : "#181818"}
                stroke={isEngineOn ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.5)"}
                strokeWidth="0.75"
                filter="url(#prop-blur)"
                animate={isEngineOn ? { rotate: 360 } : { rotate: 0 }}
                transition={propTransition}
                style={{ originX: 0, originY: 0 }}
              />
              {/* Spinner cap */}
              <circle cx="0" cy="0" r="4.5" fill="#323741" stroke="#0e1014" />
            </g>

            {/* Front Right Propeller Blur */}
            <g transform="translate(556, 325)">
              <motion.ellipse
                cx="0"
                cy="0"
                rx={isEngineOn ? "90" : "80"}
                ry={isEngineOn ? "6" : "2"}
                fill={isEngineOn ? "url(#propeller-grad)" : "#181818"}
                stroke={isEngineOn ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.5)"}
                strokeWidth="0.75"
                filter="url(#prop-blur)"
                animate={isEngineOn ? { rotate: -360 } : { rotate: 0 }}
                transition={propTransition}
                style={{ originX: 0, originY: 0 }}
              />
              {/* Spinner cap */}
              <circle cx="0" cy="0" r="4.5" fill="#323741" stroke="#0e1014" />
            </g>
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
