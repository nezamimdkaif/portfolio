"use client";

import { motion } from "framer-motion";
import { getAssetPath } from "@/utils";
import { 
  ArrowRight, 
  Download, 
  Terminal, 
  Cpu, 
  Compass, 
  Radio, 
  ShieldAlert,
  Zap,
  Activity
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [telemetry, setTelemetry] = useState({
    altitude: 120.4,
    pitch: 0.8,
    roll: -0.5,
    yaw: 45.2,
    gpsLat: 23.8124,
    gpsLon: 86.4412,
    battery: 98,
    speed: 4.2
  });

  const [logLines, setLogLines] = useState<string[]>([]);
  const [activeFailsafe, setActiveFailsafe] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });

  // Create a React Ref to prevent dependency triggers for the log printer interval
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  // Simulate Live UAV Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const altOffset = (Math.random() - 0.5) * 0.4;
        const pitchOffset = (Math.random() - 0.5) * 0.6;
        const rollOffset = (Math.random() - 0.5) * 0.4;
        const yawOffset = (Math.random() - 0.4) * 1.5;
        const gpsOffsetLat = (Math.random() - 0.5) * 0.0001;
        const gpsOffsetLon = (Math.random() - 0.5) * 0.0001;
        const speedOffset = (Math.random() - 0.5) * 0.2;

        return {
          altitude: Math.max(0, parseFloat((prev.altitude + altOffset).toFixed(1))),
          pitch: parseFloat((prev.pitch + pitchOffset).toFixed(1)),
          roll: parseFloat((prev.roll + rollOffset).toFixed(1)),
          yaw: parseFloat(((prev.yaw + yawOffset + 360) % 360).toFixed(1)),
          gpsLat: parseFloat((prev.gpsLat + gpsOffsetLat).toFixed(6)),
          gpsLon: parseFloat((prev.gpsLon + gpsOffsetLon).toFixed(6)),
          battery: prev.battery > 10 ? prev.battery - (Math.random() > 0.95 ? 1 : 0) : 98,
          speed: Math.max(0, parseFloat((prev.speed + speedOffset).toFixed(1)))
        };
      });

      // Randomly blink failsafe warning for realism
      if (Math.random() > 0.97) {
        setActiveFailsafe(prev => !prev);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Simulate Booting Logs
  useEffect(() => {
    const startupLogs = [
      ">> INITIATING PX6X BOOTSTRAP SYSTEM...",
      ">> CALIBRATING IMU & GYROSCOPES [OK]",
      ">> MAGNETOMETER INCLINATION: 34.2 DEG [OK]",
      ">> MAVLINK PROTOCOL V2.0 STREAM: ONLINE [915MHz]",
      ">> SEARCHING GPS SATELLITES... FOUND 19 SATS",
      ">> 3D FIXED POSITION ESTABLISHED [BIT SINDRI]",
      ">> ISRO IROC 2026 AUTONOMY STACK LOADED",
      ">> ULTRASONIC RANGEFINDER SENSORS: ONLINE",
      ">> LIDAR ALTIMETER & ARUCO TRACKER INI [OK]",
      ">> GUIDED NAVIGATION DEPLOYED. READY FOR DOCKING."
    ];

    let currentLine = 0;
    const logInterval = setInterval(() => {
      if (currentLine < startupLogs.length) {
        setLogLines(prev => [...prev, startupLogs[currentLine]]);
        currentLine++;
      } else {
        // Keep logs rolling with dynamic events
        const t = telemetryRef.current;
        const eventLogs = [
          `>> MAVLINK: GPS Status [Lat: ${t.gpsLat.toFixed(5)}, Lon: ${t.gpsLon.toFixed(5)}]`,
          `>> ALTITUDE STABLE: Altimeter reading ${t.altitude}m`,
          `>> STABILIZING PILOT: Roll: ${t.roll}deg, Pitch: ${t.pitch}deg`,
          `>> COMPASS YAW UPDATED: Heading ${t.yaw}°`,
          `>> telemetry: 115200bps rf link heartbeat ok`,
          `>> DOCKING CAM: Scanning for ArUco landing marker...`
        ];
        const randomEvent = eventLogs[Math.floor(Math.random() * eventLogs.length)];
        setLogLines(prev => {
          const updated = [...prev, randomEvent];
          return updated.slice(updated.length - 8); // Keep last 8 lines
        });
      }
    }, 1800);

    return () => clearInterval(logInterval);
  }, []);

  // Interactive Radar Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const points: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const numPoints = 25;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1
      });
    }

    let sweepAngle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Matrix (Hexagonal/Tactical lines)
      ctx.strokeStyle = "rgba(0, 212, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw sweeping radar circles in center
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
      for (let r = 100; r < Math.max(width, height); r += 150) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Radar sweeping line
      sweepAngle += 0.005;
      const sweepLength = Math.max(width, height);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 212, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * sweepLength,
        centerY + Math.sin(sweepAngle) * sweepLength
      );
      ctx.stroke();

      // Connect nodes with light lines
      ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw moving nodes
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = "rgba(0, 212, 255, 0.3)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mouse interactive target tracking crosshair
      if (mouseRef.current.isHovering) {
        const { x, y } = mouseRef.current;

        // Draw crosshair circles
        ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Horizontal and vertical coordinate axis lines
        ctx.strokeStyle = "rgba(0, 212, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(x - 80, y); ctx.lineTo(x + 80, y);
        ctx.moveTo(x, y - 80); ctx.lineTo(x, y + 80);
        ctx.stroke();

        // Print coordinates text
        ctx.fillStyle = "rgba(0, 212, 255, 0.7)";
        ctx.font = "10px monospace";
        ctx.fillText(`SYS_LOCK_X: ${Math.floor(x)}`, x + 40, y - 10);
        ctx.fillText(`SYS_LOCK_Y: ${Math.floor(y)}`, x + 40, y + 10);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-28 pb-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic interactive Canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* Cyberpunk HUD corners on outer container */}
      <div className="absolute top-24 left-6 w-6 h-6 border-t-2 border-l-2 border-accent-cyan/30 pointer-events-none" />
      <div className="absolute top-24 right-6 w-6 h-6 border-t-2 border-r-2 border-accent-cyan/30 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-accent-cyan/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-accent-cyan/30 pointer-events-none" />

      {/* Radial overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-transparent to-background-dark opacity-80 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Aerospace Engineering bio & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-left space-y-6"
          >
            {/* Tag / Micro status indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
              Robotics Autonomy Developer
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight">
              <span className="text-white">Md Kaif Nezami</span>
            </h1>

            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-accent-cyan text-glow leading-snug">
              Embedded Systems & Robotics Engineer
            </h2>

            <p className="text-lg sm:text-xl text-gray-300 font-medium tracking-wide">
              Autonomous UAV Systems Developer | Drone Hardware Specialist
            </p>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              Second-year ECE student at BIT Sindri with hands-on experience in UAV electronics, embedded systems, and sensor integration. Currently contributing to the prestigious ISRO IROC 2026 UAV docking challenge through subsystem design, component selection, and full-system autonomy testing.
            </p>

            {/* CTAs Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-stretch sm:items-center">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0, 212, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center gap-2 bg-accent-cyan text-background-dark px-8 py-4 rounded-xl font-bold transition-all duration-300"
              >
                View Missions
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={18} />
              </motion.a>
              
              <motion.a
                href={getAssetPath("/nezami_uavs_cv_ism.pdf")}
                download="Md_Kaif_Nezami_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(0, 212, 255, 0.08)", boxShadow: "0 0 20px rgba(0, 212, 255, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 border border-accent-cyan/50 text-accent-cyan px-8 py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer"
              >
                <Download size={18} />
                Download CV
              </motion.a>
            </div>

            {/* Status bar widgets below CTAs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-gray-400 font-mono">
                <Cpu size={14} className="text-accent-cyan" />
                <span>PX6X: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-gray-400 font-mono">
                <Compass size={14} className="text-accent-cyan" />
                <span>HEADING: {telemetry.yaw}°</span>
              </div>
              <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-gray-400 font-mono">
                <Radio size={14} className="text-accent-cyan" />
                <span>MAVLINK: CONNECTED</span>
              </div>
              <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-gray-400 font-mono">
                <Activity size={14} className="text-accent-cyan" />
                <span>SYS_TEMP: 32.4°C</span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Floating Ground Control Station (GCS) Console */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full"
          >
            <div className="glass-card border border-white/10 hover:border-accent-cyan/30 rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Outer Cyan border glow */}
              <div className="absolute inset-0 rounded-2xl bg-accent-cyan/5 blur-xl pointer-events-none -z-10" />

              {/* Console Header */}
              <div className="bg-white/5 px-5 py-3.5 border-b border-white/10 flex items-center justify-between font-mono text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-accent-cyan" />
                  <span className="font-bold font-mono text-accent-cyan tracking-wider">[GCS_GROUND_CONTROL_V2.0]</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-2xs uppercase tracking-widest font-semibold">Live stream</span>
                </div>
              </div>

              {/* Telemetry live grids */}
              <div className="grid grid-cols-3 border-b border-white/10 text-center font-mono">
                <div className="p-3.5 border-r border-white/10 bg-white/3">
                  <div className="text-2xs text-gray-400 uppercase tracking-widest mb-0.5">Altitude</div>
                  <div className="text-lg font-bold text-accent-cyan">{telemetry.altitude}m</div>
                </div>
                <div className="p-3.5 border-r border-white/10 bg-white/3">
                  <div className="text-2xs text-gray-400 uppercase tracking-widest mb-0.5">Air Speed</div>
                  <div className="text-lg font-bold text-white">{telemetry.speed}m/s</div>
                </div>
                <div className="p-3.5 bg-white/3">
                  <div className="text-2xs text-gray-400 uppercase tracking-widest mb-0.5">Battery</div>
                  <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <Zap size={12} />
                    {telemetry.battery}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-white/10 text-center font-mono text-2xs text-gray-300 py-2.5 bg-black/20">
                <div>ROLL: <span className={telemetry.roll > 0 ? "text-accent-cyan" : "text-amber-400"}>{telemetry.roll}°</span></div>
                <div className="border-x border-white/10">PITCH: <span className={telemetry.pitch > 0 ? "text-accent-cyan" : "text-amber-400"}>{telemetry.pitch}°</span></div>
                <div>GPS LAT: <span className="text-gray-300">{telemetry.gpsLat.toFixed(4)}</span></div>
              </div>

              {/* Console Logs display */}
              <div className="p-5 bg-black/40 h-52 overflow-y-auto font-mono text-2xs text-green-400/90 space-y-1.5 scrollbar-thin select-none leading-relaxed text-left">
                {logLines.length === 0 ? (
                  <div className="text-gray-500 italic animate-pulse">Establishing MAVLink connection...</div>
                ) : (
                  logLines.map((line, idx) => (
                    <div 
                      key={idx} 
                      className={
                        line && (line.includes("[OK]") || line.includes("STABLE"))
                          ? "text-emerald-400" 
                          : line && (line.includes("CALIBRATING") || line.includes("MAVLINK"))
                          ? "text-accent-cyan" 
                          : "text-gray-400"
                      }
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>

              {/* Failsafe Banner */}
              <div className={`py-2 px-5 font-mono text-3xs border-t border-white/10 flex items-center justify-between tracking-widest ${
                activeFailsafe ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-gray-400"
              }`}>
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={11} className={activeFailsafe ? "animate-bounce text-amber-400" : "text-gray-400"} />
                  <span>AUTOPILOT: {activeFailsafe ? "FS_RETURN_TO_LAUNCH" : "NAV_GUIDED"}</span>
                </div>
                <span>LATENCY: 4ms</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Futuristic animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 z-10"
      >
        <span className="text-gray-500 font-mono text-4xs uppercase tracking-widest">MISSION SCAN</span>
        <div className="w-5 h-8 border border-accent-cyan/30 rounded-full flex justify-center p-0.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-accent-cyan rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
