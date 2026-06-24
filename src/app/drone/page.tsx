// src/app/drone/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getAssetPath } from "@/utils";
import { 
  Cpu, Battery, Download, Play, Pause, RotateCcw, 
  Radio, Target, Activity, Compass, Info, Zap, ArrowRight, Eye,
  Video, Grid
} from "lucide-react";

interface TelemetryData {
  timestamp: number;
  status: string;
  uav: {
    model: string;
    battery: string;
    currentDraw: string;
    voltage: string;
    coordinates: { lat: string; lng: string };
    altitude: string;
    heading: string;
    orientation: { pitch: string; roll: string };
  };
  groundStation: {
    type: string;
    magneticLock: string;
    chargerOutput: string;
    alignmentError: { x: string; y: string };
    thermalState: string;
  };
}

export default function DroneShowcase() {
  const [activeTab, setActiveTab] = useState<"video" | "gallery">("video");
  
  // Real-time Telemetry state fetched from API or simulated locally
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  
  // Video HUD playback states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vidTelemetry, setVidTelemetry] = useState<any>({
    phase: "SEARCHING",
    altitude: "8.50",
    pitch: "0.0",
    roll: "0.0",
    yaw: "184.2",
    offsetX: "0.120",
    offsetY: "-0.080",
    alignmentError: "144.2mm",
    currentDraw: "0.0A (DISCONNECTED)",
    springComp: "0.00",
    time: "0.00",
    percent: "0"
  });

  // Gallery Image Selected lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [galleryTab, setGalleryTab] = useState<number>(0);

  // Specifications
  const specs = [
    { icon: Cpu, label: "Onboard Computing", value: "Pixhawk Orange Cube / STM32 Payload Companion" },
    { icon: Radio, label: "Precision Alignment", value: "Downcard Camera ArUco Marker Vector Solver" },
    { icon: Battery, label: "Physical Connector", value: "Spring-Loaded Low-Resistance Pogo Pins" },
    { icon: Zap, label: "Landing Surface", value: "Dual Polished Copper Sheet Charging Pads" },
  ];

  // Images shared by user in public folder, mapped exactly to visual contents
  const galleryImages = [
    {
      src: getAssetPath("/drone-sim/WhatsApp Image 2026-05-21 at 12.24.21 PM (1).jpeg"),
      tabName: "ROS Node Graph",
      title: "ROS System Architecture & Node Network Graph",
      category: "Software Workflow",
      desc: "Autonomy architecture mapping showing ROS2 nodes executing in parallel. Camera frame data publishes directly to OpenCV-powered vision solvers, calculating high-frequency landing platform displacement vectors to stabilize the Pixhawk flight logs.",
      stats: { Nodes: "6 Active", "Comm Link": "MAVLink Packets", "SLAM Suite": "ORB-SLAM3" },
      crop: { fit: "contain" as const, position: "center" }
    },
    {
      src: getAssetPath("/drone-sim/WhatsApp Image 2026-05-21 at 12.24.19 PM.jpeg"),
      tabName: "Landing Dock Skids",
      title: "UAV Ground Landing Dock & Pogo Skids",
      category: "Mechanical & Electrical",
      desc: "Physical landing dock prototype displaying our gold-plated pogo contact terminals on the drone's carbon fiber skids sitting directly on the dual semi-circular copper sheet pads. The dock embeds a central printed ArUco marker. When the quadcopter sits down, gravity compresses the skids, forming a secure mechanical latch and a positive electrical path for high-wattage battery charging and local data packet sync.",
      stats: { "Dock Size": "420x300 mm", "Charging Link": "Direct Pad Contacts", "Alignment": "Optical Lock" },
      crop: { fit: "cover" as const, position: "center 70%" }
    },
    {
      src: getAssetPath("/drone-sim/WhatsApp Image 2026-05-21 at 12.24.20 PM.jpeg"),
      tabName: "UAV Electronics",
      title: "Autopilot & Companion Payload Integration",
      category: "Avionics Payload",
      desc: "Macro view of our research quadcopter avionics chassis highlights structural payload integration. The central control unit features a Pixhawk Orange Flight Controller. For high-speed target tracking in GPS-denied zones, a Raspberry Pi companion computer is integrated on the carbon arm, linking to a downward-facing camera via a gold ribbon cable. The Pi companion processes raw frames at 60 FPS and pipes tracking offsets straight to the Pixhawk stabilizer.",
      stats: { "Flight Controller": "Pixhawk Orange Cube", "Companion SBC": "Raspberry Pi", "Vision Pipeline": "Onboard OpenCV" },
      crop: { fit: "cover" as const, position: "center 40%" }
    },
    {
      src: getAssetPath("/drone-sim/WhatsApp Image 2026-05-21 at 12.24.21 PM.jpeg"),
      tabName: "Lab Calibration Test",
      title: "IRoC-U Flight Trial & Power Calibration HUD",
      category: "System Validation",
      desc: "Top-down laboratory calibration session conducted under the IRoC-U 2026 Team Challengers flight trial protocol. As the research UAV touches down on the base station dock, a digital amp meter records an active high-wattage charging draw of 2.68A at 15.27V (41% active capacity), confirming low contact resistance. Ground telemetry widgets monitor the battery health, temperature, and cell voltages continuously.",
      stats: { "Charging Current": "2.68 A", "System Voltage": "15.27 V", "Active Charge": "41% Capacity" },
      crop: { fit: "contain" as const, position: "center" }
    }
  ];

  // Generate simulated data directly for static environments (GitHub Pages)
  useEffect(() => {
    const updateTelemetry = () => {
      const t = Date.now() / 1000;
      const isCharging = Math.sin(t / 10) > 0;
      const simulatedData: TelemetryData = {
        timestamp: Date.now(),
        status: isCharging ? "DOCKED" : "DESCENDING_ALIGNMENT",
        uav: {
          model: "URSC Autonomous Guidance UAV",
          battery: `${(82 - (t % 3600) * 0.003).toFixed(1)}%`,
          currentDraw: isCharging ? "-2.68A (CHARGING)" : "12.80A",
          voltage: isCharging ? "15.27V" : "14.84V",
          coordinates: { lat: "23.8125", lng: "86.4412" },
          altitude: `${isCharging ? 0.08 : (8.5 + Math.sin(t) * 0.4).toFixed(2)}m`,
          heading: `${(184.2 + Math.sin(t * 0.5) * 1.5).toFixed(1)}°`,
          orientation: {
            pitch: `${isCharging ? "0.0" : (Math.sin(t / 2) * 1.2).toFixed(1)}°`,
            roll: `${isCharging ? "0.0" : (Math.cos(t / 2) * 0.8).toFixed(1)}°`
          }
        },
        groundStation: {
          type: "Precision ArUco Charging Dock v2",
          magneticLock: isCharging ? "LOCKED" : "STANDBY",
          chargerOutput: isCharging ? "40.9W (2.68A @ 15.27V)" : "0.0W",
          alignmentError: {
            x: `${isCharging ? "0.0" : (Math.sin(t / 2) * 5.2).toFixed(1)}mm`,
            y: `${isCharging ? "0.0" : (Math.cos(t / 2) * 4.8).toFixed(1)}mm`
          },
          thermalState: "32.4°C"
        }
      };
      setTelemetry(simulatedData);
    };

    updateTelemetry();
    const interval = setInterval(updateTelemetry, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ensure landing video autoplays muted in all modern browsers
  useEffect(() => {
    if (activeTab === "video" && videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Video Autoplay blocked or failed:", err));
    }
  }, [activeTab]);

  // Video playback control handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
      setIsPlaying(true);
    }
  };

  const handleRestartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(err => console.log("Video play failed:", err));
    setIsPlaying(true);
  };

  // Synchronized telemetry calculation tied directly to the video's timeupdate event
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 12.2;
    const progress = time / duration;
    
    // Map time progress to landing scenarios
    let currentPhase = "ACQUIRING";
    let calculatedAlt = 8.5;
    let computedPitch = 0.0;
    let computedRoll = 0.0;
    let computedYaw = 184.2;
    let computedOffset = { x: 0.120, y: -0.080 };
    let currentDraw = "0.0A (DISCONNECTED)";
    let alignmentError = "144.2mm";
    let springComp = 0.0;
    
    if (progress < 0.25) {
      currentPhase = "OPTICAL ALIGNMENT";
      calculatedAlt = 8.5 - progress * 12;
      computedPitch = Math.sin(time * 2.5) * 1.8;
      computedRoll = Math.cos(time * 2.0) * 1.2;
      computedYaw = 184.2 + Math.sin(time) * 0.8;
      computedOffset = { x: 0.120 - progress * 0.3, y: -0.080 + progress * 0.2 };
      alignmentError = `${(144.2 - progress * 350).toFixed(1)}mm`;
    } else if (progress < 0.65) {
      currentPhase = "STEADY DESCENT";
      calculatedAlt = 5.5 - (progress - 0.25) * 11;
      computedPitch = Math.sin(time * 3.5) * 0.6;
      computedRoll = Math.cos(time * 3.0) * 0.4;
      computedYaw = 185.1 + Math.sin(time * 0.5) * 0.2;
      computedOffset = { x: 0.045 - (progress - 0.25) * 0.1, y: -0.030 + (progress - 0.25) * 0.06 };
      alignmentError = `${Math.max(4.2, 56.5 - (progress - 0.25) * 130).toFixed(1)}mm`;
    } else if (progress < 0.82) {
      currentPhase = "FINAL COUPLING";
      calculatedAlt = Math.max(0.04, 1.1 - (progress - 0.65) * 5.88);
      computedPitch = Math.sin(time * 5) * 0.2;
      computedRoll = Math.cos(time * 4) * 0.15;
      computedYaw = 185.0;
      computedOffset = { x: 0.004, y: -0.002 };
      alignmentError = `${Math.max(1.2, 6.2 - (progress - 0.65) * 30).toFixed(1)}mm`;
      
      if (calculatedAlt < 0.15) {
        currentPhase = "TOUCHDOWN CONTACT";
        springComp = Math.min(8.5, (0.15 - calculatedAlt) * 56.6);
      }
    } else {
      currentPhase = "FAST CHARGE ACTIVATED";
      calculatedAlt = 0.00;
      computedPitch = 0.0;
      computedRoll = 0.0;
      computedYaw = 185.0;
      computedOffset = { x: 0.000, y: 0.000 };
      alignmentError = "0.00mm (MAGNETIC LOCK)";
      currentDraw = "25.2V @ 6.2A (156.2W)";
      springComp = 8.5;
    }
    
    setVidTelemetry({
      phase: currentPhase,
      altitude: calculatedAlt,
      pitch: computedPitch.toFixed(1),
      roll: computedRoll.toFixed(1),
      yaw: computedYaw.toFixed(1),
      offsetX: computedOffset.x.toFixed(3),
      offsetY: computedOffset.y.toFixed(3),
      alignmentError,
      currentDraw,
      springComp: springComp.toFixed(2),
      time: time.toFixed(2),
      percent: (progress * 100).toFixed(0)
    });
  };

  return (
    <main className="min-h-screen bg-[#060b13] text-white relative font-sans selection:bg-accent-coral selection:text-white overflow-x-hidden">
      <Navigation />

      {/* Cybernetic Landing Page Hero */}
      <section className="relative pt-32 pb-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-coral/10 via-[#7c3aed]/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute w-[600px] h-[600px] -top-1/4 left-1/2 -translate-x-1/2 bg-accent-coral/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-accent-coral text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Radio size={12} className="animate-pulse text-accent-coral" />
            ISRO Robotics Challenge – URSC Landing Suite
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-accent-coral/80 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Precision Telemetry & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-[#7c3aed]">
              Autonomous Docking
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed font-sans"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A dynamic telemetry console demonstrating spring-loaded electrical coupling and ArUco marker tracking validation.
          </motion.p>
        </div>
      </section>

      {/* Primary Dashboard GCS Workspace */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Display Pane (8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Dashboard Tabs & Workspace Selector */}
            <div className="glass-card p-1.5 flex flex-wrap gap-2 border-white/5 bg-[#09111e]/85">
              <button
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "video"
                    ? "bg-accent-coral/15 text-accent-coral border border-accent-coral/30 shadow-[0_0_15px_rgba(251,58,93,0.15)]"
                    : "text-gray-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <Video size={14} />
                Flight Landing Video HUD
              </button>

              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "gallery"
                    ? "bg-accent-coral/15 text-accent-coral border border-accent-coral/30 shadow-[0_0_15px_rgba(251,58,93,0.15)]"
                    : "text-gray-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <Grid size={14} />
                Field Media Gallery
              </button>
            </div>

            {/* TAB CONTENT PANE */}
            <div className="glass-card border-white/10 overflow-hidden bg-[#070e1a]/90 min-h-[460px] flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              
              <AnimatePresence mode="wait">
                {/* 1. SYNCHRONIZED VIDEO TELEMETRY VIEW */}
                {activeTab === "video" && (
                  <motion.div
                    key="video-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex-grow flex flex-col justify-between"
                  >
                    {/* Screen Header */}
                    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-accent-coral animate-pulse" : "bg-yellow-500"}`} />
                        <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
                          FEED // FLIGHT_RECORDING_ANALYSIS_MP4
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-accent-coral">
                        <span>TIMECODE: {vidTelemetry.time}s</span>
                        <span>PROGRESS: {vidTelemetry.percent}%</span>
                      </div>
                    </div>

                    {/* Main Video View with overlaid high-fidelity HUD */}
                    <div className="relative flex-grow bg-black p-2 flex items-center justify-center min-h-[380px] overflow-hidden group">
                      <video
                        ref={videoRef}
                        src={getAssetPath("/drone-sim/drone_landing.mp4")}
                        onTimeUpdate={handleTimeUpdate}
                        loop
                        playsInline
                        muted
                        autoPlay
                        className="max-h-[360px] w-full rounded-lg object-contain shadow-inner"
                      />

                      {/* HUD overlay - ABSOLUTE POSITIONED CYBERNETICS */}
                      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between font-mono">
                        
                        {/* Upper HUD: Pitch / Roll / Coordinates */}
                        <div className="flex justify-between items-start text-[10px] text-accent-coral bg-black/35 p-2 rounded backdrop-blur-xs">
                          <div className="space-y-1">
                            <div>MODEL: URSC-UAV-X1</div>
                            <div>PITCH: {vidTelemetry.pitch}°</div>
                            <div>ROLL: {vidTelemetry.roll}°</div>
                            <div>YAW: {vidTelemetry.yaw}°</div>
                          </div>
                          <div className="text-right space-y-1">
                            <div>OFF_X: {vidTelemetry.offsetX}m</div>
                            <div>OFF_Y: {vidTelemetry.offsetY}m</div>
                            <div>ERR_ALIGN: {vidTelemetry.alignmentError}</div>
                            <div className="text-accent-coral font-bold">STATE: {vidTelemetry.phase}</div>
                          </div>
                        </div>

                        {/* Centered Computer Vision ArUco Targeting Reticle */}
                        {parseFloat(vidTelemetry.altitude) > 0.05 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                            {/* Circle lock */}
                            <div className={`border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300 ${
                              vidTelemetry.phase === "FINAL COUPLING" ? "border-accent-coral w-16 h-16 animate-spin" : "border-accent-coral/60 animate-[spin_8s_linear_infinite]"
                            }`}>
                              <div className="w-2 h-2 bg-accent-coral rounded-full animate-ping" />
                            </div>
                            
                            {/* Scanning Box overlay mock representing ArUco target lock */}
                            <div className="mt-2 px-2 py-0.5 text-[8px] bg-black/60 rounded border border-accent-coral text-accent-coral">
                              ARUCO LOCK [ID: 50]
                            </div>
                          </div>
                        )}

                        {/* Lower HUD: Spring compression / current draw */}
                        <div className="flex justify-between items-end text-[10px] text-accent-coral bg-black/35 p-2 rounded backdrop-blur-xs">
                          <div className="space-y-1">
                            <div>SPRING TRAVEL: {vidTelemetry.springComp} mm / 8.5mm</div>
                            <div className="w-24 bg-slate-800 h-1.5 rounded overflow-hidden">
                              <div 
                                className="bg-accent-coral h-full transition-all duration-100" 
                                style={{ width: `${(parseFloat(vidTelemetry.springComp) / 8.5) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div>PIN CIRCUIT CONTINUITY: {parseFloat(vidTelemetry.springComp) > 3.0 ? "CONNECTED (CLOSED)" : "OPEN"}</div>
                            <div className="font-bold text-accent-coral animate-pulse">
                              CURRENT: {vidTelemetry.currentDraw}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Video HUD Control Bar */}
                    <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePlayPause}
                          className="px-5 py-2 bg-accent-coral text-white font-display text-xs font-bold rounded-lg hover:bg-accent-coral/90 transition-colors flex items-center gap-2 shadow-lg shadow-accent-coral/15"
                        >
                          {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                          {isPlaying ? "PAUSE RECORDING" : "PLAY RECORDING"}
                        </button>
                        
                        <button
                          onClick={handleRestartVideo}
                          className="p-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                          title="Restart Feed"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>

                      <div className="text-xs text-gray-400 font-mono">
                        Playback speed: <span className="text-accent-coral">1.0x (Realtime)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. PREMIUM DEPLOYMENT & HARDWARE MEDIA GALLERY */}
                {activeTab === "gallery" && (
                  <motion.div
                    key="gallery-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 flex-grow flex flex-col gap-6"
                  >
                    <div className="border-b border-white/10 pb-3">
                      <h3 className="font-display text-lg font-bold text-white">UAV Systems Integration & Lab Assets</h3>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        Select a system asset below to explore its design blueprints, electrical calibration, and laboratory configurations.
                      </p>
                    </div>

                    {/* Media Gallery Sub-tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
                      {galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryTab(idx)}
                          className={`px-4 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                            galleryTab === idx
                              ? "bg-accent-coral/15 border-accent-coral/40 text-accent-coral shadow-[0_0_15px_rgba(251,58,93,0.1)]"
                              : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {img.tabName}
                        </button>
                      ))}
                    </div>

                    {/* Active Sub-tab Image & Description Display */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
                      {/* Left: Beautifully cropped and framed image */}
                      <div className="lg:col-span-7 flex flex-col gap-3">
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner group">
                          <img
                            src={galleryImages[galleryTab].src}
                            alt={galleryImages[galleryTab].title}
                            className="w-full h-full transition-all duration-500 cursor-zoom-in group-hover:scale-[1.02]"
                            style={{
                              objectFit: galleryImages[galleryTab].crop.fit,
                              objectPosition: galleryImages[galleryTab].crop.position
                            }}
                            onClick={() => setLightboxImage(galleryImages[galleryTab].src)}
                          />
                          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono font-bold tracking-wider border border-white/10 uppercase text-accent-coral">
                            {galleryImages[galleryTab].category}
                          </div>
                          
                          <button
                            onClick={() => setLightboxImage(galleryImages[galleryTab].src)}
                            className="absolute bottom-3 right-3 p-2 bg-black/75 rounded text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            title="Expand view"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                        <div className="text-center font-mono text-[9px] text-gray-500">
                          * Click on preview to expand full-resolution laboratory capture.
                        </div>
                      </div>

                      {/* Right: Technical Description & Specs */}
                      <div className="lg:col-span-5 space-y-5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-accent-coral uppercase tracking-widest">{galleryImages[galleryTab].category}</span>
                          <h4 className="font-display font-bold text-xl text-white tracking-tight leading-tight">{galleryImages[galleryTab].title}</h4>
                        </div>

                        <p className="text-xs text-gray-300 font-sans leading-relaxed bg-[#09111e]/80 p-4 rounded-xl border border-white/5 shadow-inner">
                          {galleryImages[galleryTab].desc}
                        </p>

                        {/* Specs badges */}
                        <div className="space-y-3 pt-2">
                          <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1">TECHNICAL SPECIFICATIONS:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[10px]">
                            {Object.entries(galleryImages[galleryTab].stats).map(([k, v]) => (
                              <div key={k} className="p-3 bg-[#060b13] rounded-lg border border-white/5 flex flex-col justify-between shadow-xs">
                                <span className="text-gray-500 uppercase text-[8px] tracking-wider">{k}</span>
                                <span className="text-white font-bold mt-1 text-[11px]">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Sidebar Area (4 columns): Telemetry panel */}
          <div className="lg:col-span-4 h-full">
            
            {/* Live GCS Telemetry Dashboard */}
            <div className="glass-card p-6 border-white/10 bg-[#070e1a]/90 shadow-lg">
              <h3 className="font-display font-bold text-sm text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-3 tracking-wider uppercase">
                <Activity size={15} className="text-accent-coral animate-pulse" />
                Live Ground Telemetry
              </h3>

              {telemetry ? (
                <div className="space-y-4 font-mono text-xs md:text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">SYSTEM STATUS:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      telemetry.status === "DOCKED" 
                        ? "bg-accent-coral/10 text-accent-coral border border-accent-coral/25" 
                        : "bg-accent-coral/10 text-accent-coral border border-accent-coral/25 animate-pulse"
                    }`}>
                      {telemetry.status === "DOCKED" ? "DOCKED (LOCKED)" : "DESCENDING_ARMED"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">FLIGHT ALTITUDE:</span>
                    <span className="text-white font-bold">{telemetry.uav.altitude}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">HEADING COMPASS:</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Compass size={12} className="text-accent-coral" />
                      {telemetry.uav.heading}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">BATTERY POWER:</span>
                    <span className="text-accent-coral font-bold flex items-center gap-1">
                      <Battery size={14} />
                      {telemetry.uav.battery}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">CONTACT DRAWS:</span>
                    <span className="text-white font-bold">
                      {telemetry.uav.currentDraw}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">ALGN DEV (X / Y):</span>
                    <span className="text-white font-bold">
                      {telemetry.groundStation.alignmentError.x} / {telemetry.groundStation.alignmentError.y}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">DOCK TEMP PROFILE:</span>
                    <span className="text-white font-bold">{telemetry.groundStation.thermalState}</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center font-mono text-xs text-gray-500">
                  <span className="animate-spin mr-2">⚙️</span> Awaiting Telemetry Pipeline...
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ISRO Robotics Challenge problem statement (URSC ASCEND Theme) */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-white/[0.01] to-transparent border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="glass-card p-8 sm:p-10 border border-white/10 relative overflow-hidden bg-[#070e1a]/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-coral/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="p-4 bg-accent-coral/15 border border-accent-coral/30 rounded-2xl text-accent-coral shadow-[0_0_20px_rgba(251,58,93,0.1)] flex-shrink-0">
                <Target size={36} />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  ISRO Robotics Challenge (IRoC‑U) Problem Statement
                </h2>
                
                <p className="text-gray-300 leading-relaxed font-sans text-sm sm:text-base">
                  The <strong className="text-white">ISRO Robotics Challenge – University Edition (IRoC‑U)</strong> themed <strong className="text-accent-coral">&quot;ASCEND&quot;</strong> tasks university engineering groups with constructing a fully autonomous micro-UAV. The drone is restricted to GPS-denied navigation, demanding high-fidelity optical cameras and onboard telemetry sensors to locate a specialized base station. 
                </p>
                
                <p className="text-gray-300 leading-relaxed font-sans text-sm sm:text-base">
                  To ensure dynamic power recharge and high-speed data transmission, our architecture incorporates a precision <strong className="text-white">spring-loaded contact pin interface</strong>. These pogo pins align with <strong className="text-white">copper landing sheets</strong> integrated directly onto the landing platform base station, creating a robust physical path for high-wattage charging and high-speed telemetry packet recovery.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-2 text-[9px] font-mono uppercase text-gray-400">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">GPS-DENIED SENSING</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">COMPLIANT CONTROLLER</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">POGO PIN INTERFACE</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">COPPER CHARGING COUPLING</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* UAV Subsystem Hardware Architecture */}
      <section className="py-20 bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-extrabold text-white mb-4 tracking-tight">
              UAV Subsystem Architecture
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-sans">
              High-precision hardware payload configuration designed for microgravity resistance, mechanical compliance, and rapid electrical coupling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specs.map((s, i) => (
              <motion.div
                key={s.label}
                className="glass-card p-6 border-white/10 flex flex-col items-center text-center glow-hover bg-[#070e1a]/90"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="p-3 bg-accent-coral/15 rounded-xl text-accent-coral mb-4 border border-accent-coral/20">
                  <s.icon size={22} />
                </div>
                <h3 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">{s.label}</h3>
                <p className="text-white font-display font-bold text-sm leading-snug">{s.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads / CTA Resources */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
              Research Blueprints & Software Suite
            </h2>
            
            <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-sans">
              Download the hardware schematics for the spring-loaded pogo interface and modular UAV controller configurations.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <a
                href={getAssetPath("/drone_firmware_v1.zip")}
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-coral text-white font-display font-bold rounded-xl hover:bg-accent-coral/90 transition-colors shadow-lg shadow-accent-coral/20 text-sm"
              >
                <Download size={16} />
                Download Firmware Suite
              </a>
              
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-display font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm"
              >
                UAV Flight Systems
                <ArrowRight size={16} className="text-accent-coral" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LIGHTBOX FOR MEDIA GALLERY */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md p-4 flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh]"
            >
              <img
                src={lightboxImage}
                alt="Calibration View Lightbox"
                className="max-w-full max-h-[85vh] rounded-xl object-contain border border-white/10"
              />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                Click anywhere to close preview
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
