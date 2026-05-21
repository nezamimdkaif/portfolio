"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Terminal as TermIcon, 
  Cpu, 
  Battery, 
  Signal, 
  Compass, 
  Database,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getAssetPath } from "@/utils";

// Command output logs database
const getCommandResponses = () => {
  const resumeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${getAssetPath("/nezami_uavs_cv_ism.pdf")}`
    : "https://nezamimdkaif.github.io/portfolio/nezami_uavs_cv_ism.pdf";

  return {
    isro: `
[ISRO IROC 2026 UAV DOCKING CHALLENGE]
--------------------------------------------------
STATUS      : Qualified Round 1 & Round 2 (Actively competing in Round 3 Autonomy)
ROLE        : Hardware Implementation Subsystem Lead
OBJECTIVES  : Redesigning and optimizing the physical docking station mechanisms to 
              ensure reliable UAV alignment, landing locks, and sensor telemetry handshakes.
INTEGRATION : Successfully interfaced Arduino sensor relays with Pixhawk OrangeCube FC.
DIAGNOSTIC  : Mechanical tolerance checked to 0.5cm mechanical guidance error.
`,
    sensors: `
[SYSTEM DIAGNOSTIC REPORT]
--------------------------------------------------
[OK] GNSS RTK RECEIVER: 3D Fix Active (14 Satellites, DGPS lock)
[OK] PRIMARY IMU (ICM-42688-P): Temperature stabilized (38.5C). Align complete.
[OK] SONAR DISTANCE TRANSDUCER (HC-SR04): Ultrasonic ping echoing correctly. Target: 15.2cm
[OK] IR PROXIMITY SOLENOID DRIVERS: Magnetic align latch signals online.
[OK] ESP32-CAM payload: RTSP video broadcast handshake verified. Signal: -62dBm
--------------------------------------------------
RESULT: ALL HARDWARE SUBSYSTEMS OPERATIONAL. GO FOR FLIGHT.
`,
    drone: `
            __          __
           \\  \\  __  /  /
            \\  \\/  \\/  /
        =====[  (MKN)  ]=====
            /  /\\  /\\  \\
           /__/  ~~  \\__\\
           
      --- HEXACOPTER UAV BLUEPRINT ---
      - Frame: 550mm Diagonal Carbon Fiber
      - Controller: Pixhawk OrangeCube (ArduPilot)
      - Power: 4S 5200mAh LiPo Battery Pack
      - Payload:Detachable ESP32 Camera Node
`,
    resume: `
[RESUME/CV ACQUISITION]
--------------------------------------------------
NAME        : Md Kaif Nezami
DEGREE      : B.Tech, Electronics and Communication Engineering (ECE)
ACADEMIC    : Birsa Institute of Technology (BIT) Sindri (2024-2028)
RESUME FILE : nezami_uavs_cv_ism.pdf

Click to download: ${resumeUrl}
Or view directly in browser.
`
  };
};

export default function TelemetryConsole() {
  const [history, setHistory] = useState<Array<{ text: string; type: "input" | "output" | "error" }>>([
    { text: "MKN UAV Telemetry Deck v1.0.4 - Initialized.", type: "output" },
    { text: "Board: Pixhawk OrangeCube. Connection: LINK OK.", type: "output" },
    { text: "Type 'help' to view available diagnostic shell directives.", type: "output" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeTelemetry, setActiveTelemetry] = useState(true);

  // Live Telemetry Simulation States
  const [batteryVolt, setBatteryVolt] = useState(14.84);
  const [satellites, setSatellites] = useState(14);
  const [alt, setAlt] = useState(0.0);
  const [yaw, setYaw] = useState(128.4);
  const [pitch, setPitch] = useState(0.2);
  const [roll, setRoll] = useState(-0.4);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryVolt((prev) => parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setAlt((prev) => {
        if (!activeTelemetry) return 0.0;
        // Simulate hover fluctuation
        const val = prev + (Math.random() * 0.2 - 0.1);
        return parseFloat(Math.max(0, val).toFixed(1));
      });
      setYaw((prev) => parseFloat((prev + (Math.random() * 1.0 - 0.5)).toFixed(1)));
      setPitch((prev) => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setRoll((prev) => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      
      // Randomly fluctuation satellite locks
      if (Math.random() > 0.85) {
        setSatellites((prev) => Math.min(18, Math.max(12, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 800);

    return () => clearInterval(timer);
  }, [activeTelemetry]);

  // Terminal telemetry print generator
  useEffect(() => {
    if (!activeTelemetry) return;
    const logTimer = setInterval(() => {
      setHistory((prev) => [
        ...prev,
        { 
          text: `[LOG]: ALT:${alt}m | YAW:${yaw}deg | BAT:${batteryVolt}V | SAT:${satellites} | IMU:OK`, 
          type: "output" 
        }
      ]);
    }, 4000);

    return () => clearInterval(logTimer);
  }, [activeTelemetry, alt, yaw, batteryVolt, satellites]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputValue.trim().toLowerCase();
    if (!cleanCmd) return;

    const newHistory = [...history, { text: `mkn-uav-station:~ nezami$ ${inputValue}`, type: "input" as const }];

    if (cleanCmd === "help") {
      newHistory.push({
        text: `
AVAILABLE SHELL DIRECTIVES:
--------------------------------------------------
- help      : Print this diagnostics manual.
- isro      : View ISRO IROC 2026 docking challenge briefing.
- sensors   : Run simulated self-tests on UAV sensor payloads.
- drone     : Fetch UAV hexacopter technical frame specs.
- telemetry : Toggle simulated telemetry logs in this terminal.
- resume    : Output direct CV/Resume acquisition parameters.
- clear     : Wipe screen command records.
`,
        type: "output"
      });
    } else if (cleanCmd === "isro") {
      newHistory.push({ text: getCommandResponses().isro, type: "output" });
    } else if (cleanCmd === "sensors") {
      newHistory.push({ text: getCommandResponses().sensors, type: "output" });
    } else if (cleanCmd === "drone") {
      newHistory.push({ text: getCommandResponses().drone, type: "output" });
    } else if (cleanCmd === "resume") {
      newHistory.push({ text: getCommandResponses().resume, type: "output" });
    } else if (cleanCmd === "clear") {
      setHistory([]);
      setInputValue("");
      return;
    } else if (cleanCmd === "telemetry") {
      setActiveTelemetry(!activeTelemetry);
      newHistory.push({ 
        text: `[SYSTEM]: Telemetry feed toggled. Active Status: ${!activeTelemetry ? "ON" : "OFF"}`, 
        type: "output" 
      });
    } else {
      newHistory.push({
        text: `Command '${inputValue}' not recognized. Type 'help' to inspect flight deck instructions.`,
        type: "error"
      });
    }

    setHistory(newHistory);
    setInputValue("");
  };

  return (
    <main className="min-h-screen bg-[#030712] text-[#10b981] font-mono relative">
      <Navigation />

      {/* Futuristic background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors text-sm font-bold mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Disconnect Telemetry Link
        </Link>

        {/* Dashboard Title */}
        <div className="mb-10 border-b border-[#10b981]/25 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[#00d4ff] font-bold tracking-widest text-xs uppercase flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-ping" />
                UAV Flight Deck Diagnostic Console
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
                HARDWARE <span className="text-[#00d4ff]">DIAGNOSTICS PANEL</span>
              </h1>
            </div>
            <div className="flex items-center gap-2.5 bg-black/60 border border-[#10b981]/30 px-5 py-2.5 rounded-xl shadow-lg">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Telemetry Link Up</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Widgets Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          
          {/* Controller Card */}
          <div className="bg-black/60 border border-[#10b981]/20 rounded-xl p-5 shadow-xl flex items-center gap-4 hover:border-[#10b981]/40 transition-colors duration-300">
            <div className="p-3 bg-[#10b981]/10 rounded-lg">
              <Cpu size={24} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-gray-400 text-3xs uppercase tracking-wider">Flight Controller</p>
              <p className="text-white font-bold text-sm">Pixhawk OrangeCube</p>
              <p className="text-[#10b981] text-3xs font-semibold">ArduPilot FW v4.5</p>
            </div>
          </div>

          {/* Battery Card */}
          <div className="bg-black/60 border border-[#10b981]/20 rounded-xl p-5 shadow-xl flex items-center gap-4 hover:border-[#10b981]/40 transition-colors duration-300">
            <div className="p-3 bg-[#10b981]/10 rounded-lg">
              <Battery size={24} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-gray-400 text-3xs uppercase tracking-wider">Main Power Battery</p>
              <p className="text-white font-bold text-sm">{batteryVolt}V (4S Lipo)</p>
              <p className="text-[#10b981] text-3xs font-semibold">86% capacity - Norm</p>
            </div>
          </div>

          {/* Satellite Card */}
          <div className="bg-black/60 border border-[#10b981]/20 rounded-xl p-5 shadow-xl flex items-center gap-4 hover:border-[#10b981]/40 transition-colors duration-300">
            <div className="p-3 bg-[#10b981]/10 rounded-lg">
              <Signal size={24} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-gray-400 text-3xs uppercase tracking-wider">GPS Satellite Locks</p>
              <p className="text-white font-bold text-sm">GNSS: 3D Fix ({satellites})</p>
              <p className="text-[#10b981] text-3xs font-semibold">RTK Lock HDOP: 0.82</p>
            </div>
          </div>

          {/* Orientation Card */}
          <div className="bg-black/60 border border-[#10b981]/20 rounded-xl p-5 shadow-xl flex items-center gap-4 hover:border-[#10b981]/40 transition-colors duration-300">
            <div className="p-3 bg-[#10b981]/10 rounded-lg">
              <Compass size={24} className="text-[#10b981]" />
            </div>
            <div>
              <p className="text-gray-400 text-3xs uppercase tracking-wider">UAV Stabilization Status</p>
              <p className="text-white font-bold text-sm">Yaw: {yaw}°</p>
              <p className="text-[#10b981] text-3xs font-semibold">P: {pitch}° | R: {roll}°</p>
            </div>
          </div>
        </div>

        {/* Command Line Terminal Display Frame */}
        <div className="bg-black/90 border-2 border-[#10b981]/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          
          {/* Terminal Console Titlebar */}
          <div className="bg-[#050b14] border-b border-[#10b981]/25 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TermIcon size={18} className="text-[#10b981]" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                INTEGRATED UAV MOCK DIAGNOSTIC SHELL
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
          </div>

          {/* Terminal Log Output List */}
          <div className="p-6 h-[460px] overflow-y-auto text-xs sm:text-sm space-y-3.5 bg-black/95">
            {history.map((line, idx) => {
              if (line.type === "input") {
                return (
                  <div key={idx} className="text-[#00d4ff] font-semibold">
                    {line.text}
                  </div>
                );
              } else if (line.type === "error") {
                return (
                  <div key={idx} className="text-red-500 font-semibold bg-red-500/10 p-2 rounded border border-red-500/20 max-w-max">
                    {line.text}
                  </div>
                );
              } else {
                return (
                  <pre key={idx} className="whitespace-pre-wrap leading-relaxed text-gray-300 font-mono">
                    {line.text}
                  </pre>
                );
              }
            })}
            <div ref={consoleEndRef} />
          </div>

          {/* Terminal Shell Input Bar */}
          <form 
            onSubmit={handleCommandSubmit}
            className="border-t border-[#10b981]/25 bg-[#050b14] px-6 py-4 flex items-center gap-2"
          >
            <span className="text-[#00d4ff] font-bold select-none text-xs sm:text-sm">
              mkn-uav-station:~ nezami$
            </span>
            <input 
              type="text"
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent text-[#10b981] placeholder-[#10b981]/30 focus:outline-none border-none p-0 text-xs sm:text-sm font-mono caret-[#10b981]"
              placeholder="type 'help' to run self-tests..."
              autoFocus
            />
            <button 
              type="submit"
              className="text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors cursor-pointer"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
