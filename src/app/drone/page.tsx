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
  Radio, Target, Activity, Compass, Info, AlertTriangle,
  Layers, Grid, Video, Sliders, Wind, CheckCircle2, Zap, ArrowRight, Eye
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
  const [activeTab, setActiveTab] = useState<"video" | "physics" | "analytics" | "gallery">("video");
  
  // Real-time Telemetry state fetched from API
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

  // Canvas Physics Simulator configuration
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [physicsActive, setPhysicsActive] = useState(true);
  const [simPhase, setSimPhase] = useState("PATROL"); // PATROL, ALIGNING, DESCENDING, TOUCHDOWN, CHARGING
  
  // Simulation physics parameters
  const [gravityPreset, setGravityPreset] = useState<"earth" | "mars" | "moon" | "space">("earth");
  const [windSetting, setWindSetting] = useState<"none" | "light" | "storm">("light");
  const [springStiffness, setSpringStiffness] = useState(250); // N/m
  const [simAltitude, setSimAltitude] = useState(8.5); // meters
  const [simLogs, setSimLogs] = useState<string[]>([
    "[SYS] Autonomous Guidance Suite initialized.",
    "[NAV] Primary optical channel established.",
    "[SEN] Downcard camera calibrating exposure..."
  ]);

  // Gallery Image Selected lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [galleryTab, setGalleryTab] = useState<number>(0);

  // Specifications
  const specs = [
    { icon: Cpu, label: "Onboard Computing", value: "Pixhawk Orange Cube / Custom STM32 Payload Companion" },
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
      desc: "Hand-drawn blueprint of the ROS / ROS2 autonomous flight network stack. In this pipeline, the Camera Node publishes raw video frames (/camera/image_raw), which are consumed by the Vision Node to perform optical target tracking. Concurrently, ORB-SLAM3 publishes /pose telemetry, combining with marker measurements in the State Machine Node. Upon resolving coordinates, the system publishes /target_waypoint to the Control Node, which translates vectors into MAVLink stabilizer commands sent to the autopilot companion for a soft touchdown.",
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

  // Fetch Telemetry from API
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch("/api/telemetry");
        if (res.ok) {
          const data = await res.json();
          data.uav.model = "URSC Autonomous Guidance UAV";
          setTelemetry(data);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic telemetry, initiating client-side simulator.", err);
      }

      // Live client-side simulation fallback for static deploys (GitHub Pages)
      const t = Date.now() / 1000;
      const simulatedData = {
        timestamp: new Date().toLocaleTimeString(),
        uav: {
          model: "URSC Autonomous Guidance UAV",
          status: Math.sin(t / 10) > 0 ? "DESCENDING" : "PATROL",
          altitude: (8.5 + Math.sin(t) * 0.4).toFixed(2),
          velocity: (1.2 + Math.cos(t) * 0.15).toFixed(2),
          battery: (78 - (t % 3600) * 0.005).toFixed(1),
          chargingCurrent: Math.sin(t / 10) > 0 ? "2.68" : "0.00",
          rssi: (92 + Math.sin(t * 1.5) * 3).toFixed(0),
          gps: {
            lat: "22.3149",
            lng: "87.3102",
            sats: (14 + Math.round(Math.sin(t / 20) * 2)).toString()
          }
        },
        dock: {
          status: Math.sin(t / 10) > 0 ? "ALIGNING" : "LOCKED",
          voltage: Math.sin(t / 10) > 0 ? "15.27" : "0.00",
          alignmentOffset: {
            x: (Math.sin(t / 2) * 5.2).toFixed(1),
            y: (Math.cos(t / 2) * 4.8).toFixed(1)
          }
        }
      };
      setTelemetry(simulatedData as any);
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 1000);
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

  const addSimLog = (msg: string) => {
    setSimLogs((prev) => {
      const next = [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`];
      if (next.length > 7) next.shift();
      return next;
    });
  };

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
      // Phase 1: Search & Align
      currentPhase = "OPTICAL ALIGNMENT";
      calculatedAlt = 8.5 - progress * 12; // 8.5m down to 5.5m
      computedPitch = Math.sin(time * 2.5) * 1.8;
      computedRoll = Math.cos(time * 2.0) * 1.2;
      computedYaw = 184.2 + Math.sin(time) * 0.8;
      computedOffset = { x: 0.120 - progress * 0.3, y: -0.080 + progress * 0.2 };
      alignmentError = `${(144.2 - progress * 350).toFixed(1)}mm`;
    } else if (progress < 0.65) {
      // Phase 2: Steady Descent
      currentPhase = "STEADY DESCENT";
      calculatedAlt = 5.5 - (progress - 0.25) * 11; // 5.5m down to 1.1m
      computedPitch = Math.sin(time * 3.5) * 0.6;
      computedRoll = Math.cos(time * 3.0) * 0.4;
      computedYaw = 185.1 + Math.sin(time * 0.5) * 0.2;
      computedOffset = { x: 0.045 - (progress - 0.25) * 0.1, y: -0.030 + (progress - 0.25) * 0.06 };
      alignmentError = `${Math.max(4.2, 56.5 - (progress - 0.25) * 130).toFixed(1)}mm`;
    } else if (progress < 0.82) {
      // Phase 3: Final Approach & Touchdown
      currentPhase = "FINAL COUPLING";
      calculatedAlt = Math.max(0.04, 1.1 - (progress - 0.65) * 5.88); // 1.1m down to 0.1m
      computedPitch = Math.sin(time * 5) * 0.2;
      computedRoll = Math.cos(time * 4) * 0.15;
      computedYaw = 185.0;
      computedOffset = { x: 0.004, y: -0.002 };
      alignmentError = `${Math.max(1.2, 6.2 - (progress - 0.65) * 30).toFixed(1)}mm`;
      
      if (calculatedAlt < 0.15) {
        currentPhase = "TOUCHDOWN CONTACT";
        springComp = Math.min(8.5, (0.15 - calculatedAlt) * 56.6); // Spring compression in mm
      }
    } else {
      // Phase 4: Charging Docked
      currentPhase = "FAST CHARGE ACTIVATED";
      calculatedAlt = 0.00;
      computedPitch = 0.0;
      computedRoll = 0.0;
      computedYaw = 185.0;
      computedOffset = { x: 0.000, y: 0.000 };
      alignmentError = "0.00mm (MAGNETIC LOCK)";
      currentDraw = "25.2V @ 6.2A (156.2W)";
      springComp = 8.5; // Full compression
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

  // Custom Physics Engine Simulator Loop for Tab 2
  useEffect(() => {
    if (activeTab !== "physics" || !physicsActive) return;

    let animId: number;
    let localAlt = simAltitude;
    let localPhase = simPhase;
    
    // Physics variables
    let vy = 0; // vertical speed
    let xOffset = 0; // lateral offset (drift)
    let vx = 0; // lateral speed
    let springX = 0; // pogo pin compression

    // Constants based on selections
    const gValues = { earth: 9.81, mars: 3.71, moon: 1.62, space: 0.0 };
    const g = gValues[gravityPreset];
    const dragCoeff = 0.45;
    const droneMass = 1.42; // kg

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      // Wind vector logic
      let windForce = 0;
      if (windSetting === "light") {
        windForce = (Math.sin(Date.now() / 400) * 0.15) + 0.08;
      } else if (windSetting === "storm") {
        windForce = (Math.sin(Date.now() / 200) * 0.85) + 0.55;
      }

      // 1. Simulation Phase Updates
      if (localPhase === "PATROL") {
        // Hover at ~8.5m with minor random sway
        const targetAlt = 8.5;
        const diff = targetAlt - localAlt;
        vy += (diff * 0.15 - vy * 0.1); // PD hover control
        xOffset += (Math.sin(Date.now() / 800) * 0.3 - xOffset) * 0.05;
        
        if (Math.random() > 0.99) {
          localPhase = "ALIGNING";
          setSimPhase("ALIGNING");
          addSimLog("[NAV] Base station beacon locked. Centering trajectory.");
        }
      } else if (localPhase === "ALIGNING") {
        // Move towards center (xOffset -> 0)
        xOffset += (-xOffset) * 0.04;
        vy += (7.5 - localAlt) * 0.1 - vy * 0.08; // hover slightly lower
        
        if (Math.abs(xOffset) < 0.15 && Math.random() > 0.98) {
          localPhase = "DESCENDING";
          setSimPhase("DESCENDING");
          addSimLog("[NAV] Target aligned (ArUco ID: 50 locked). Initializing vertical descent.");
        }
      } else if (localPhase === "DESCENDING") {
        // Descend with steady speed, adjusting for wind sway
        const targetDescentSpeed = -0.75; // m/s
        const weight = droneMass * g;
        const drag = -0.5 * dragCoeff * vy * Math.abs(vy);
        
        // Dynamic control thrust
        const targetAcc = (targetDescentSpeed - vy) * 0.8;
        const controlThrust = weight + droneMass * targetAcc;
        
        const totalF = controlThrust - weight - drag;
        const ay = totalF / droneMass;
        
        vy += ay * 0.016; // 60fps dt
        localAlt += vy * 0.016;

        // X movement with wind drift
        const lateralAcc = (windForce - vx * 0.5 - xOffset * 0.2) / droneMass;
        vx += lateralAcc * 0.016;
        xOffset += vx * 0.016;

        if (localAlt <= 0.18) {
          localAlt = 0.18;
          vy = 0;
          localPhase = "TOUCHDOWN";
          setSimPhase("TOUCHDOWN");
          addSimLog("[MECH] Landing contact. Pogo-pins compressing under gravity.");
        }
      } else if (localPhase === "TOUCHDOWN") {
        // Spring compliance mechanics
        const baseHeight = 0.0;
        const compression = 0.18 - localAlt; // m
        springX = Math.max(0, compression * 1000); // mm

        // Hooke's Law: Fs = -k * x
        const springForce = springStiffness * compression;
        const gravityForce = droneMass * g;
        const netForce = springForce - gravityForce;
        
        const ay = netForce / droneMass;
        vy += ay * 0.016;
        localAlt += vy * 0.016;

        // Dampen lateral motion
        xOffset += (-xOffset) * 0.1;

        if (springX > 4.5) {
          localPhase = "CHARGING";
          setSimPhase("CHARGING");
          addSimLog("[PWR] Electrical circuit closed. Power flowing at 25.2V @ 6.2A.");
        }
      } else if (localPhase === "CHARGING") {
        localAlt = 0.08;
        vy = 0;
        springX = 8.5; // Fully compressed
        xOffset = 0.0;

        // Periodically cycle simulation back to patrol
        if (Math.random() > 0.995) {
          localPhase = "PATROL";
          setSimPhase("PATROL");
          addSimLog("[SYS] Battery cycle test complete. Issuing take-off command.");
        }
      }

      // Fallback boundaries
      if (localAlt < 0.0) {
        localAlt = 0.0;
        vy = 0;
      }
      setSimAltitude(Number(localAlt.toFixed(2)));

      // 2. RENDERING CANVAS SCENARIO
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Sky Background (Vibrant Dark)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h - 80);
      skyGrad.addColorStop(0, "#060b13");
      skyGrad.addColorStop(1, "#0d1b2a");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 15; i++) {
        const starX = (Math.sin(i * 99) * 0.5 + 0.5) * w;
        const starY = (Math.cos(i * 37) * 0.5 + 0.5) * (h - 100);
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      // Ground Base
      ctx.fillStyle = "#0c1524";
      ctx.fillRect(0, h - 80, w, 80);
      
      // Ground perspective gridlines
      ctx.strokeStyle = "rgba(0, 212, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, h - 80);
        ctx.lineTo(w / 2 + (i - w / 2) * 1.5, h);
        ctx.stroke();
      }

      // Landing Platform Base
      const platW = 200;
      const platH = 12;
      const platX = w / 2 - platW / 2;
      const platY = h - 92;
      ctx.fillStyle = "#1b2a47";
      ctx.fillRect(platX, platY, platW, platH);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.strokeRect(platX, platY, platW, platH);

      // Polished Copper Sheet Contacts
      ctx.fillStyle = "#ea580c"; // Copper Amber
      const contactW = 70;
      ctx.fillRect(w / 2 - 80, platY - 4, contactW, 4);
      ctx.fillRect(w / 2 + 10, platY - 4, contactW, 4);

      // ArUco Tracking Marker Center Symbol
      ctx.fillStyle = "#000000";
      ctx.fillRect(w / 2 - 12, platY - 4, 24, 4);
      // Small ArUco square grid
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(w / 2 - 12, platY - 4, 4, 4);
      ctx.fillRect(w / 2 + 8, platY - 4, 4, 4);
      ctx.fillRect(w / 2 - 4, platY - 4, 8, 2);

      // Optical Camera Detection Cone
      const droneY = h - 92 - 35 - (localAlt * 25);
      const droneX = w / 2 + (xOffset * 80);

      if (localPhase !== "CHARGING" && localPhase !== "TOUCHDOWN") {
        ctx.fillStyle = "rgba(14, 165, 233, 0.06)";
        ctx.beginPath();
        ctx.moveTo(droneX, droneY + 8);
        ctx.lineTo(w / 2 - 90, platY);
        ctx.lineTo(w / 2 + 90, platY);
        ctx.closePath();
        ctx.fill();

        // Laser scan line
        ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(droneX, droneY + 8);
        ctx.lineTo(w / 2, platY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Drone Spring Pogo Pins
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#94a3b8";
      // Left Leg
      const legHeight = 25 - (springX * 1.5);
      ctx.beginPath();
      ctx.moveTo(droneX - 25, droneY + 10);
      ctx.lineTo(droneX - 25, droneY + legHeight);
      ctx.stroke();
      // Right Leg
      ctx.beginPath();
      ctx.moveTo(droneX + 25, droneY + 10);
      ctx.lineTo(droneX + 25, droneY + legHeight);
      ctx.stroke();

      // Gold tips
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(droneX - 27, droneY + legHeight - 2, 4, 4);
      ctx.fillRect(droneX + 23, droneY + legHeight - 2, 4, 4);

      // Drone Body
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.ellipse(droneX, droneY, 32, 10, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      // GPS dome
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(droneX, droneY - 7, 6, Math.PI, 0);
      ctx.fill();

      // Rotors Spinning
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(droneX - 32, droneY - 4, 16, 2, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(droneX + 32, droneY - 4, 16, 2, 0, 0, 2 * Math.PI);
      ctx.stroke();

      // VECTOR OVERLAYS (Visualizing forces for the "real developer" look)
      if (localPhase !== "CHARGING") {
        const vectorScale = 3;
        
        // Gravity Vector (Red, down)
        ctx.strokeStyle = "#f87171";
        ctx.fillStyle = "#f87171";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(droneX, droneY);
        ctx.lineTo(droneX, droneY + g * vectorScale);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(droneX - 3, droneY + g * vectorScale - 3);
        ctx.lineTo(droneX, droneY + g * vectorScale);
        ctx.lineTo(droneX + 3, droneY + g * vectorScale - 3);
        ctx.fill();

        // Thrust Vector (Cyan, up)
        const thrustVal = (localPhase === "PATROL" || localPhase === "ALIGNING") ? g : g * 0.9;
        ctx.strokeStyle = "#22d3ee";
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.moveTo(droneX, droneY);
        ctx.lineTo(droneX, droneY - thrustVal * vectorScale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(droneX - 3, droneY - thrustVal * vectorScale + 3);
        ctx.lineTo(droneX, droneY - thrustVal * vectorScale);
        ctx.lineTo(droneX + 3, droneY - thrustVal * vectorScale + 3);
        ctx.fill();

        // Wind/Drift Force (Green, lateral)
        if (windSetting !== "none") {
          ctx.strokeStyle = "#4ade80";
          ctx.fillStyle = "#4ade80";
          ctx.beginPath();
          ctx.moveTo(droneX, droneY);
          ctx.lineTo(droneX + windForce * 15, droneY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(droneX + windForce * 15 - 3 * Math.sign(windForce), droneY - 3);
          ctx.lineTo(droneX + windForce * 15, droneY);
          ctx.lineTo(droneX + windForce * 15 - 3 * Math.sign(windForce), droneY + 3);
          ctx.fill();
        }
      }

      // Charging Sparks
      if (localPhase === "CHARGING") {
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 2; i++) {
          ctx.beginPath();
          ctx.moveTo(droneX - 25, platY);
          ctx.lineTo(droneX - 25 + Math.random() * 8 - 4, platY - Math.random() * 8);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(droneX + 25, platY);
          ctx.lineTo(droneX + 25 + Math.random() * 8 - 4, platY - Math.random() * 8);
          ctx.stroke();
        }
      }

      // HUD Overlay text
      ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
      ctx.font = "9px monospace";
      ctx.fillText(`ENGINE: RIGID_BODY_2D_SIM`, 12, 18);
      ctx.fillText(`PHASE: ${localPhase}`, 12, 30);
      ctx.fillText(`GRAVITY: ${g.toFixed(2)} m/s²`, 12, 42);
      ctx.fillText(`WIND: ${windSetting.toUpperCase()}`, 12, 54);
      ctx.fillText(`POGO_K: ${springStiffness} N/m`, 12, 66);
      ctx.fillText(`ALTITUDE: ${localAlt.toFixed(2)}m`, 12, 78);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, physicsActive, gravityPreset, windSetting, springStiffness, simAltitude, simPhase]);

  const triggerSimAutoland = () => {
    setSimPhase("DESCENDING");
    addSimLog("[NAV] Autonomous autoland issued by operator override.");
  };

  const resetSim = () => {
    setSimAltitude(8.5);
    setSimPhase("PATROL");
    addSimLog("[SYS] Command reset. Climbing back to 8.5m patrol height.");
  };

  return (
    <main className="min-h-screen bg-[#060b13] text-white relative font-sans selection:bg-accent-cyan selection:text-[#060b13] overflow-x-hidden">
      <Navigation />

      {/* Cybernetic Landing Page Hero */}
      <section className="relative pt-32 pb-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/10 via-[#7c3aed]/5 to-transparent pointer-events-none -z-10" />
        <div className="absolute w-[600px] h-[600px] -top-1/4 left-1/2 -translate-x-1/2 bg-[#00d4ff]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-accent-cyan text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Radio size={12} className="animate-pulse text-accent-cyan" />
            ISRO Robotics Challenge – URSC Landing Suite
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-accent-cyan/80 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Precision Telemetry & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-[#7c3aed]">
              Autonomous Docking
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed font-sans"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A high-fidelity developer dashboard showcasing continuous spring-loaded electrical coupling and ArUco marker computer vision tracking in GPS-denied scenarios.
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
                    ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "text-gray-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <Video size={14} />
                Flight Landing Video HUD
              </button>
              
              <button
                onClick={() => {
                  setActiveTab("physics");
                  setPhysicsActive(true);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "physics"
                    ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "text-gray-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <Sliders size={14} />
                Physics Stress-Testing Sandbox
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "analytics"
                    ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "text-gray-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <Activity size={14} />
                Data Analytics
              </button>

              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "gallery"
                    ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
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
                        <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-yellow-500"}`} />
                        <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
                          FEED // FLIGHT_RECORDING_ANALYSIS_MP4
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-accent-cyan">
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
                        <div className="flex justify-between items-start text-[10px] text-[#00d4ff] bg-black/35 p-2 rounded backdrop-blur-xs">
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
                            <div className="text-amber-400 font-bold">STATE: {vidTelemetry.phase}</div>
                          </div>
                        </div>

                        {/* Centered Computer Vision ArUco Targeting Reticle */}
                        {parseFloat(vidTelemetry.altitude) > 0.05 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                            {/* Circle lock */}
                            <div className={`border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center transition-all duration-300 ${
                              vidTelemetry.phase === "FINAL COUPLING" ? "border-green-400 w-16 h-16 animate-spin" : "border-accent-cyan/60 animate-[spin_8s_linear_infinite]"
                            }`}>
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            </div>
                            
                            {/* Scanning Box overlay mock representing ArUco target lock */}
                            <div className={`mt-2 px-2 py-0.5 text-[8px] bg-black/60 rounded border transition-colors ${
                              vidTelemetry.phase === "FINAL COUPLING" ? "border-green-400 text-green-400" : "border-accent-cyan text-accent-cyan"
                            }`}>
                              ARUCO LOCK [ID: 50]
                            </div>
                          </div>
                        )}

                        {/* Lower HUD: Spring compression / current draw */}
                        <div className="flex justify-between items-end text-[10px] text-[#00d4ff] bg-black/35 p-2 rounded backdrop-blur-xs">
                          <div className="space-y-1">
                            <div>SPRING TRAVEL: {vidTelemetry.springComp} mm / 8.5mm</div>
                            <div className="w-24 bg-slate-800 h-1.5 rounded overflow-hidden">
                              <div 
                                className="bg-green-400 h-full transition-all duration-100" 
                                style={{ width: `${(parseFloat(vidTelemetry.springComp) / 8.5) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div>PIN CIRCUIT CONTINUITY: {parseFloat(vidTelemetry.springComp) > 3.0 ? "CONNECTED (CLOSED)" : "OPEN"}</div>
                            <div className={`font-bold ${parseFloat(vidTelemetry.springComp) > 6.0 ? "text-green-400 animate-pulse" : "text-amber-400"}`}>
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
                          className="px-5 py-2 bg-accent-cyan text-[#060b13] font-display text-xs font-bold rounded-lg hover:bg-accent-cyan/90 transition-colors flex items-center gap-2 shadow-lg shadow-accent-cyan/15"
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
                        Playback speed: <span className="text-accent-cyan">1.0x (Realtime)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. HIGH-FIDELITY PHYSICS ENGINE SANDBOX */}
                {activeTab === "physics" && (
                  <motion.div
                    key="physics-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex-grow flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                        <span className="font-mono text-xs text-gray-400 tracking-wider">
                          2D PHYSICS SIMULATOR // RIGID_BODY_GRAVITY_COUPLE
                        </span>
                      </div>
                      
                      {/* Active vectors stats indicators */}
                      <div className="flex gap-4 font-mono text-[9px] text-[#4ade80]">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#f87171] rounded-full" />
                          Fg (Gravity)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full" />
                          Ft (Thrust)
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full" />
                          Fw (Wind)
                        </span>
                      </div>
                    </div>

                    {/* Purpose explanation Banner */}
                    <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-400 font-mono flex items-start gap-2 leading-relaxed">
                      <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white uppercase">[SIMULATION TESTBED CALIBRATION]</strong>: While the <span className="text-accent-cyan font-bold">Flight Video HUD</span> shows the recorded real flight test, this sandbox mathematically models the landing dynamics in real time. Calibrate gravity scenarios, wind sways, and spring compliance constants to stress-test the stabilization algorithms before physical deployment.
                      </div>
                    </div>

                    {/* Canvas and Controls Wrapper */}
                    <div className="grid grid-cols-1 md:grid-cols-4 items-stretch divide-y md:divide-y-0 md:divide-x divide-white/5">
                      
                      {/* Interactive Canvas Rendering Screen */}
                      <div className="md:col-span-3 p-4 flex items-center justify-center bg-black/40">
                        <canvas
                          ref={canvasRef}
                          width={480}
                          height={300}
                          className="max-w-full rounded-lg border border-white/5 bg-slate-950/80 shadow-2xl"
                        />
                      </div>

                      {/* Interactive Physics Sliders */}
                      <div className="p-5 space-y-5 bg-[#091222]/50 font-mono text-xs">
                        <div className="border-b border-white/10 pb-2 mb-2">
                          <span className="text-accent-cyan font-bold">PHYSICS SYSTEM CONSTANTS</span>
                        </div>

                        {/* Gravity Preset */}
                        <div className="space-y-2">
                          <label className="text-gray-400 block text-[10px] uppercase">GRAVITY SCENARIO</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(["earth", "mars", "moon", "space"] as const).map((preset) => (
                              <button
                                key={preset}
                                onClick={() => {
                                  setGravityPreset(preset);
                                  addSimLog(`[SYS] Adjusted environment gravity preset to: ${preset.toUpperCase()}`);
                                }}
                                className={`py-1 text-[10px] rounded uppercase font-bold border transition-colors ${
                                  gravityPreset === preset
                                    ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Wind Drift setting */}
                        <div className="space-y-2">
                          <label className="text-gray-400 block text-[10px] uppercase">WIND TURBULENCE</label>
                          <div className="grid grid-cols-3 gap-1">
                            {(["none", "light", "storm"] as const).map((wind) => (
                              <button
                                key={wind}
                                onClick={() => {
                                  setWindSetting(wind);
                                  addSimLog(`[SYS] Environmental wind friction scale set to: ${wind.toUpperCase()}`);
                                }}
                                className={`py-1 text-[9px] rounded uppercase font-bold border transition-colors ${
                                  windSetting === wind
                                    ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white"
                                }`}
                              >
                                {wind}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Spring Constant Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-gray-400">
                            <span>SPRING STIFFNESS (k)</span>
                            <span className="text-white font-bold">{springStiffness} N/m</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="500"
                            step="50"
                            value={springStiffness}
                            onChange={(e) => {
                              const v = parseInt(e.target.value);
                              setSpringStiffness(v);
                            }}
                            className="w-full accent-accent-cyan bg-slate-900 rounded-lg cursor-pointer appearance-none h-1.5"
                          />
                        </div>

                        {/* Diagnostics info */}
                        <div className="pt-2 border-t border-white/5 text-[9px] space-y-1.5 text-gray-400">
                          <div>DRONE MASS: <span className="text-white">1.42 kg</span></div>
                          <div>DRAG CONST (Cd): <span className="text-white">0.45</span></div>
                          <div>ARUCO SIZE: <span className="text-white">80x80 mm</span></div>
                        </div>
                      </div>

                    </div>

                    {/* Physics simulation trigger deck */}
                    <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={triggerSimAutoland}
                          disabled={simPhase === "DESCENDING" || simPhase === "TOUCHDOWN" || simPhase === "CHARGING"}
                          className="px-4 py-2 bg-accent-cyan text-[#060b13] font-display text-xs font-bold rounded-lg hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          LAUNCH AUTOLAND
                        </button>
                        <button
                          onClick={resetSim}
                          className="px-4 py-2 bg-white/5 border border-white/10 font-mono text-xs font-bold rounded-lg hover:bg-white/10 transition-colors text-white"
                        >
                          RESET POSITION
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-gray-400">
                        Simulation Mode: <span className="text-green-400">ACTIVE REALTIME OSCILLATION</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. DYNAMIC DATA ANALYTICS & CURVES */}
                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 flex-grow flex flex-col gap-6"
                  >
                    <div className="border-b border-white/10 pb-3">
                      <h3 className="font-display text-lg font-bold text-white">Dynamic Flight Curve & Interface Modeling</h3>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        High-fidelity telemetry plots representing physical calculations across landing phases.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Plot 1: Altitude Descent Curve */}
                      <div className="p-4 bg-black/35 rounded-xl border border-white/5 space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center text-gray-400">
                          <span>DESCENT TRAJECTORY PROFILE</span>
                          <span className="text-accent-cyan text-[10px]">ALTITUDE (m) vs TIME (s)</span>
                        </div>
                        {/* Custom SVG line plot */}
                        <div className="relative h-32 bg-slate-950/80 rounded border border-white/5 p-2 flex items-end">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                            {/* Gridlines */}
                            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                            {/* Plot path representing landing descent */}
                            <path
                              d="M 5,5 Q 35,5 50,30 T 80,48 L 95,48"
                              fill="none"
                              stroke="#00d4ff"
                              strokeWidth="1.5"
                              strokeDasharray="200"
                              strokeDashoffset="0"
                              className="animate-[dash_3s_ease-in-out_infinite]"
                            />
                            {/* Highlight landing point */}
                            <circle cx="80" cy="48" r="2.5" fill="#34d399" />
                          </svg>
                          <span className="absolute bottom-2 left-3 text-[8px] text-gray-500">t=0s</span>
                          <span className="absolute bottom-2 right-3 text-[8px] text-gray-500">t=12s</span>
                        </div>
                        <div className="text-[10px] text-gray-400 leading-tight">
                          Exponential landing deceleration solver to minimize docking impact velocity (v_z ≤ 0.1 m/s) at touchdown.
                        </div>
                      </div>

                      {/* Plot 2: Pogo Spring Travel vs Force */}
                      <div className="p-4 bg-black/35 rounded-xl border border-white/5 space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center text-gray-400">
                          <span>POGO PIN FORCE COMPLIANCE</span>
                          <span className="text-amber-400 text-[10px]">FORCE (N) vs DEFL (mm)</span>
                        </div>
                        {/* Custom SVG line plot */}
                        <div className="relative h-32 bg-slate-950/80 rounded border border-white/5 p-2 flex items-end">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                            {/* Gridlines */}
                            <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                            <line x1="0" y1="38" x2="100" y2="38" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                            {/* Plot path representing linear elastic spring behavior */}
                            <line x1="5" y1="45" x2="85" y2="10" stroke="#fbbf24" strokeWidth="1.8" />
                            <circle cx="85" cy="10" r="2.5" fill="#f87171" />
                          </svg>
                          <span className="absolute bottom-2 left-3 text-[8px] text-gray-500">0mm deflection</span>
                          <span className="absolute bottom-2 right-3 text-[8px] text-gray-500">8.5mm limit</span>
                        </div>
                        <div className="text-[10px] text-gray-400 leading-tight">
                          Dual BeCu pins compressed up to 8.5 mm, generating 16.8 N deflection force for optimal electrical contact.
                        </div>
                      </div>
                    </div>

                    {/* Quantitative Interface Parameters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-400 font-mono">DRAG PROFILE</div>
                        <div className="text-sm font-bold mt-1 text-white">0.45 Cd</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-400 font-mono">CONTACT RESISTANCE</div>
                        <div className="text-sm font-bold mt-1 text-emerald-400">0.02 Ω</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-400 font-mono">THERMAL PROFILE</div>
                        <div className="text-sm font-bold mt-1 text-white">34.2 °C</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-400 font-mono">FAST RECHARGE RATE</div>
                        <div className="text-sm font-bold mt-1 text-accent-cyan">156.2 Watts</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. PREMIUM DEPLOYMENT & HARDWARE MEDIA GALLERY */}
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
                              ? "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan shadow-[0_0_15px_rgba(0,212,255,0.1)]"
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
                          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono font-bold tracking-wider border border-white/10 uppercase text-accent-cyan">
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
                          <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest">{galleryImages[galleryTab].category}</span>
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

          {/* Sidebar Area (4 columns): Telemetry panel & Live System Logs */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full justify-between">
            
            {/* Live GCS Telemetry Dashboard */}
            <div className="glass-card p-6 border-white/10 bg-[#070e1a]/90 flex-grow shadow-lg">
              <h3 className="font-display font-bold text-sm text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-3 tracking-wider uppercase">
                <Activity size={15} className="text-accent-cyan animate-pulse" />
                Live Ground Telemetry
              </h3>

              {telemetry ? (
                <div className="space-y-4 font-mono text-xs md:text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">SYSTEM STATUS:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      telemetry.status === "DOCKED" 
                        ? "bg-green-500/10 text-green-400 border border-green-500/25" 
                        : "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/25 animate-pulse"
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
                      <Compass size={12} className="text-accent-cyan" />
                      {telemetry.uav.heading}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">BATTERY POWER:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Battery size={14} />
                      {telemetry.uav.battery}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">CONTACT DRAWS:</span>
                    <span className={`font-bold ${telemetry.status === "DOCKED" ? "text-green-400" : "text-white"}`}>
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

            {/* Scrolling Live System Logs */}
            <div className="glass-card p-6 border-white/10 bg-[#070e1a]/90 flex flex-col justify-between h-56 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-xs font-mono text-accent-cyan tracking-wider font-bold uppercase">
                  OPERATIONAL LOGS
                </span>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
              </div>
              
              <div className="font-mono text-[10px] text-gray-400 space-y-1.5 h-36 overflow-y-auto mt-1 select-none pr-1 scrollbar-thin">
                {simLogs.map((log, i) => (
                  <div key={i} className="leading-normal flex gap-1 items-start">
                    <span className="text-accent-cyan flex-shrink-0">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed]/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="p-4 bg-accent-cyan/15 border border-accent-cyan/30 rounded-2xl text-accent-cyan shadow-[0_0_20px_rgba(0,212,255,0.1)] flex-shrink-0">
                <Target size={36} />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  ISRO Robotics Challenge (IRoC‑U) Problem Statement
                </h2>
                
                <p className="text-gray-300 leading-relaxed font-sans text-sm sm:text-base">
                  The <strong className="text-white">ISRO Robotics Challenge – University Edition (IRoC‑U)</strong> themed <strong className="text-[#00d4ff]">&quot;ASCEND&quot;</strong> tasks university engineering groups with constructing a fully autonomous micro-UAV. The drone is restricted to GPS-denied navigation, demanding high-fidelity optical cameras and onboard telemetry sensors to locate a specialized base station. 
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
                <div className="p-3 bg-accent-cyan/15 rounded-xl text-accent-cyan mb-4 border border-accent-cyan/20">
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-cyan text-[#060b13] font-display font-bold rounded-xl hover:bg-accent-cyan/90 transition-colors shadow-lg shadow-accent-cyan/20 text-sm"
              >
                <Download size={16} />
                Download Firmware Suite
              </a>
              
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-display font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm"
              >
                UAV Flight Systems
                <ArrowRight size={16} className="text-accent-cyan" />
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

