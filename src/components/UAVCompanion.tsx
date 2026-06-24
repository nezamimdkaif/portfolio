"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Cpu, Radio, Target, Battery, Compass, Sliders, Wind,
  AlertTriangle, CheckCircle2, Play, Pause, Zap, Terminal,
  RefreshCw, Power, ShieldAlert, ArrowUpRight
} from "lucide-react";
import AnimatedDrone from "./AnimatedDrone";

export default function UAVCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEngineOn, setIsEngineOn] = useState(true);
  const [isLaserGridOn, setIsLaserGridOn] = useState(true);
  const [ledPulseSpeed, setLedPulseSpeed] = useState<0 | 1 | 2>(1);
  const [altitude, setAltitude] = useState(100); // 0 to 100
  const [status, setStatus] = useState<"PATROLLING" | "DESCENDING" | "DOCKED" | "DISARMED" | "CLIMBING">("PATROLLING");
  const [battery, setBattery] = useState(84.3);
  const [pitch, setPitch] = useState(0.5);
  const [roll, setRoll] = useState(-0.3);
  const [heading, setHeading] = useState(184.2);
  const [logs, setLogs] = useState<string[]>([
    "System init... OK",
    "Companion SBC online (Pi 4B)",
    "GPS-Denied Autonomy Stack Ready",
    "Hovering at 8.5m patrol height"
  ]);

  const landingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Random fluctuations for telemetry when in flight
  useEffect(() => {
    const telemetryTimer = setInterval(() => {
      if (isEngineOn && status !== "DOCKED") {
        setPitch(Number((Math.sin(Date.now() / 600) * 1.5 + (Math.random() - 0.5) * 0.5).toFixed(1)));
        setRoll(Number((Math.cos(Date.now() / 500) * 1.2 + (Math.random() - 0.5) * 0.3).toFixed(1)));
        setHeading(Number((184.2 + Math.sin(Date.now() / 2000) * 1.8).toFixed(1)));
        
        // Battery drain slowly
        setBattery(prev => {
          if (prev > 10) return Number((prev - 0.01).toFixed(2));
          return prev;
        });
      } else if (status === "DOCKED") {
        setPitch(0.0);
        setRoll(0.0);
        
        // Battery charge slowly
        setBattery(prev => {
          if (prev < 100) return Number((prev + 0.05).toFixed(2));
          return 100;
        });
      }
    }, 1000);

    return () => clearInterval(telemetryTimer);
  }, [isEngineOn, status]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 8)]);
  };

  // Handle landing / takeoff simulation
  const triggerLanding = () => {
    if (landingIntervalRef.current) clearInterval(landingIntervalRef.current);
    
    setStatus("DESCENDING");
    addLog("Descending: Laser alignment active.");

    let currentAlt = altitude;
    landingIntervalRef.current = setInterval(() => {
      currentAlt -= 5;
      if (currentAlt <= 0) {
        currentAlt = 0;
        clearInterval(landingIntervalRef.current!);
        setStatus("DOCKED");
        addLog("Docked: Pogo-pins coupled, charging.");
      }
      setAltitude(currentAlt);
    }, 150);
  };

  const triggerTakeoff = () => {
    if (landingIntervalRef.current) clearInterval(landingIntervalRef.current);
    
    // Ensure engines are on
    setIsEngineOn(true);
    setStatus("CLIMBING");
    addLog("Climbing: Thrusters set to takeoff power.");

    let currentAlt = altitude;
    landingIntervalRef.current = setInterval(() => {
      currentAlt += 5;
      if (currentAlt >= 100) {
        currentAlt = 100;
        clearInterval(landingIntervalRef.current!);
        setStatus("PATROLLING");
        addLog("Hovering at patrol height.");
      }
      setAltitude(currentAlt);
    }, 150);
  };

  const toggleEngine = () => {
    if (isEngineOn) {
      // Turn off
      setIsEngineOn(false);
      setStatus("DISARMED");
      setAltitude(0);
      addLog("Engines Disarmed. Drone sits on ground.");
    } else {
      // Turn on
      setIsEngineOn(true);
      setStatus("PATROLLING");
      setAltitude(100);
      addLog("Engines Armed. Climbing to hover.");
    }
  };

  return (
    <>
      {/* Floating Radar Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 z-40 w-12 h-12 rounded-full border border-accent-coral/30 bg-[#0a0a0a]/90 hover:bg-[#121212]/90 flex items-center justify-center shadow-[0_4px_25px_rgba(251,58,93,0.3)] hover:scale-105 active:scale-95 cursor-pointer text-white"
        title="UAV Mission Console"
        whileHover={{ boxShadow: "0 0 20px rgba(251, 58, 93, 0.6)" }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 rounded-full border border-accent-coral/20 animate-ping opacity-60 pointer-events-none" />
          <Radio size={20} className="text-accent-coral animate-pulse" />
        </div>
      </motion.button>

      {/* Slide-out Control Dashboard */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-screen w-[420px] max-w-full bg-[#0a0f18]/95 border-l border-white/10 backdrop-blur-md shadow-2xl p-6 flex flex-col justify-between font-mono text-white select-none overflow-y-auto"
          >
            {/* Console Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status === "PATROLLING" ? "bg-green-500 animate-pulse" :
                    status === "DESCENDING" || status === "CLIMBING" ? "bg-amber-400 animate-spin" :
                    status === "DOCKED" ? "bg-accent-coral animate-pulse" : "bg-red-500"
                  }`} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    UAV FLIGHT DASHBOARD v2.0
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drone Real-time Live View Window */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-[#060b13] p-1 shadow-inner mb-4">
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 rounded text-[9px] border border-white/5 text-[#fb3a5d]">
                  LIVE HUD VIEW [ALT: {((altitude / 100) * 8.5).toFixed(2)}m]
                </div>
                <div className="w-full h-full pointer-events-none scale-90 translate-y-[-10px]">
                  <AnimatedDrone 
                    isEngineOn={isEngineOn}
                    isLaserGridOn={isLaserGridOn}
                    ledPulseSpeed={ledPulseSpeed}
                    altitude={altitude}
                    showBackground={false}
                  />
                </div>
              </div>

              {/* Telemetry Monitor Grids */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#111827]/70 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase">SYS STATUS</span>
                  <span className={`text-xs font-bold mt-1 ${
                    status === "PATROLLING" ? "text-green-400" :
                    status === "DOCKED" ? "text-accent-coral" : "text-amber-400"
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="bg-[#111827]/70 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase">BATTERY CELL</span>
                  <span className="text-xs font-bold mt-1 text-emerald-400 flex items-center gap-1">
                    <Battery size={14} />
                    {battery}%
                  </span>
                </div>
                <div className="bg-[#111827]/70 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase">PITCH / ROLL</span>
                  <span className="text-xs font-bold mt-1 text-white">
                    {pitch}° / {roll}°
                  </span>
                </div>
                <div className="bg-[#111827]/70 p-3 rounded-lg border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase">HEADING DIRECTION</span>
                  <span className="text-xs font-bold mt-1 text-white flex items-center gap-1">
                    <Compass size={14} className="text-accent-coral" />
                    {heading}°
                  </span>
                </div>
              </div>

              {/* Hardware / Engine Interactive Control Board */}
              <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-4 mb-6 space-y-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                  MISSION COMMAND CONSOLE
                </div>
                
                {/* Engine Switch */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">PROPULSION MOTORS</span>
                  <button
                    onClick={toggleEngine}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                      isEngineOn 
                        ? "bg-red-500/25 border border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                        : "bg-green-500/25 border border-green-500 text-green-400"
                    }`}
                  >
                    <Power size={11} />
                    {isEngineOn ? "STOP MOTORS" : "ARM MOTORS"}
                  </button>
                </div>

                {/* Laser Grid Toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">LASER DOCK GRID</span>
                  <button
                    onClick={() => {
                      setIsLaserGridOn(!isLaserGridOn);
                      addLog(`Laser grid ${!isLaserGridOn ? "enabled" : "disabled"}`);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer ${
                      isLaserGridOn 
                        ? "bg-accent-coral/25 border border-accent-coral text-accent-coral shadow-[0_0_10px_rgba(251,58,93,0.2)]" 
                        : "bg-white/5 border border-white/10 text-gray-400"
                    }`}
                  >
                    {isLaserGridOn ? "LASER ON" : "LASER OFF"}
                  </button>
                </div>

                {/* LED Mode Selector */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">ARM LED SIGNALS</span>
                  <div className="flex bg-[#060b13] border border-white/10 rounded overflow-hidden">
                    {([0, 1, 2] as const).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          setLedPulseSpeed(speed);
                          addLog(`LED pulse speed set to level ${speed}`);
                        }}
                        className={`px-2.5 py-1 text-[9px] font-bold transition-colors cursor-pointer ${
                          ledPulseSpeed === speed
                            ? "bg-accent-coral text-white font-black"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {speed === 0 ? "SOLID" : speed === 1 ? "SLOW" : "FAST"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Takeoff / Land Autonomy trigger */}
                <div className="pt-2">
                  {status === "DOCKED" || status === "DISARMED" ? (
                    <button
                      onClick={triggerTakeoff}
                      className="w-full bg-green-500 hover:bg-green-600 text-black py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-green-500/10"
                    >
                      <ArrowUpRight size={14} />
                      EXECUTE TAKE-OFF SEQUENCE
                    </button>
                  ) : (
                    <button
                      onClick={triggerLanding}
                      disabled={status === "DESCENDING" || !isEngineOn}
                      className="w-full bg-accent-coral hover:bg-accent-coral/95 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-accent-coral/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Target size={14} />
                      EXECUTE PRECISION AUTOLAND
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostic Operations Terminal Log */}
            <div>
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-accent-coral tracking-widest uppercase flex items-center gap-1">
                  <Terminal size={12} />
                  CALIBRATION TERMINAL LOG
                </span>
                
                <div className="bg-[#05080e] rounded-lg p-3 border border-white/5 h-32 overflow-y-auto text-[9px] text-gray-400 space-y-1 select-text scrollbar-thin">
                  {logs.map((log, i) => (
                    <div key={i} className="leading-tight flex gap-1">
                      <span className="text-[#fb3a5d]">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
