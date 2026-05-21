"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Cpu, 
  Settings, 
  Activity, 
  FileCode, 
  Check, 
  ChevronRight, 
  Eye, 
  Smartphone, 
  Terminal as TerminalIcon,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Detailed C++ & Config Code Snippets for the IDE Frame
const codeSnippets = {
  sonarDocking: {
    filename: "uav_sonar_docking.cpp",
    language: "C++ / Arduino",
    description: "Firmware loop for precision ultrasonic sensor reading and autonomous landing alignment check on the ISRO IROC 2026 Docking Station.",
    code: `#include <Arduino.h>

// Sensor Pin Definitions
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int ALIGN_INDICATOR = 13;

// Telemetry thresholds
const float TARGET_DOCK_DIST_CM = 15.0;
const float ALIGN_TOLERANCE_CM = 2.0;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(ALIGN_INDICATOR, OUTPUT);
  Serial.begin(115200);
  Serial.println("[SYSTEM]: Sonar Docking Subsystem Initialized.");
}

float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2.0; // cm
  return distance;
}

void loop() {
  float currentDist = measureDistance();
  
  // Verify alignment parameters
  bool isAligned = (abs(currentDist - TARGET_DOCK_DIST_CM) <= ALIGN_TOLERANCE_CM);
  
  if (isAligned) {
    digitalWrite(ALIGN_INDICATOR, HIGH);
    Serial.println("[TELEMETRY]: UAV Aligned. Sending Docking Trigger.");
  } else {
    digitalWrite(ALIGN_INDICATOR, LOW);
  }
  
  delay(100); // 10Hz Telemetry Rate
}`
  },
  pidTuning: {
    filename: "hexacopter_pid_calibration.ini",
    language: "ArduPilot Config",
    description: "Custom PID tuning parameters for the OrangeCube hexacopter, providing high-wind roll and pitch stabilization during autonomous waypoints.",
    code: `# ArduPilot Hexacopter Parameter File
# Custom PID Calibration - IIT ISM Bootcamp

ATC_RAT_RLL_P     = 0.135000  # Roll Rate Proportional Gain
ATC_RAT_RLL_I     = 0.135000  # Roll Rate Integral Gain
ATC_RAT_RLL_D     = 0.003600  # Roll Rate Derivative Gain
ATC_RAT_RLL_IMAX  = 0.500000  # Roll Rate Limit Integral Max

ATC_RAT_PIT_P     = 0.145000  # Pitch Rate Proportional Gain
ATC_RAT_PIT_I     = 0.145000  # Pitch Rate Integral Gain
ATC_RAT_PIT_D     = 0.004200  # Pitch Rate Derivative Gain
ATC_RAT_PIT_IMAX  = 0.500000  # Pitch Rate Limit Integral Max

ATC_RAT_YAW_P     = 0.180000  # Yaw Rate Proportional Gain
ATC_RAT_YAW_I     = 0.018000  # Yaw Rate Integral Gain
ATC_RAT_YAW_D     = 0.000000  # Yaw Rate Derivative Gain

# Auto-tune status flags
AUTOTUNE_AXIS     = 7         # Roll, Pitch, and Yaw tuned
AUTOTUNE_AGGR     = 0.100000  # Autotune aggressiveness (Aggressive)`
  },
  camTransmitter: {
    filename: "esp32_cam_transmitter.cpp",
    language: "C++",
    description: "Lightweight RTSP server setup on ESP32-CAM payload to transmit zero-latency telemetry and high-definition aerial video footage.",
    code: `#include "esp_camera.h"
#include <WiFi.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

const char* ssid = "UAV_GCS_AccessPoint";
const char* password = "AutonomousFlight2026";

void startCameraServer();

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // Disable brownout detector
  
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  // Connect WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("[SYSTEM]: Stream server ready. WiFi Link Active.");
  startCameraServer();
}`
  }
};

const detailedProjects = [
  {
    id: "iroc",
    title: "ISRO IROC 2026 UAV Docking Station",
    specs: "Autonomous Mechanical & Sensor Interfacing Dock",
    description: "As part of Round 3 full autonomy preparation, designing mechanical and sensor feedback subsystems for autonomous drone capture, battery replenishment, and location stabilization.",
    bom: ["Arduino Nano Controller", "HC-SR04 Ultrasonic Array", "IR Obstacle Proximity Modules", "Custom Buck Regulators", "Magnetic Latch Solenoids", "9DOF IMU Stabilization Sensor"],
    features: [
      "Physical realignment system utilizing conical guide pathways.",
      "Dual proximity sensor safety confirmation feedback loop.",
      "Ultrasonic alignment verification reading to 0.5cm tolerances.",
      "Secure latching telemetry relayed back to Pixhawk flight deck."
    ],
    accent: "border-accent-cyan/30"
  },
  {
    id: "hexacopter",
    title: "Autonomous Hexacopter Flight Setup",
    specs: "OrangeCube Flight Controller & Core Build",
    description: "Built and assembled a full high-performance hexacopter utilizing OrangeCube (Pixhawk) flight control module during the IIT ISM Bootcamp. Handled core integration, flight telemetry setups, PID tuning, and waypoint flight testing.",
    bom: ["Pixhawk OrangeCube FC", "Here3+ RTK GPS Module", "60A BlHeli Brushless ESCs", "T-Motor 2216 800KV Motors", "Carbon Fiber Frame Assembly", "915MHz Telemetry Transceivers"],
    features: [
      "Waypoint mission autonomous execution using ArduPilot Mission Planner.",
      "Complete physical hardware layout configuration & high-voltage routing.",
      "PID auto-tune sequences to suppress oscillation parameters under load.",
      "Failsafe setup triggers (Battery Low, GCS Loss, Geo-fence limits)."
    ],
    accent: "border-purple-500/25 hover:border-purple-500/50"
  },
  {
    id: "payload",
    title: "UAV Live Camera & Telemetry Payload",
    specs: "Zero-Latency Stream Transceiver Module",
    description: "Assembled a lightweight, detachable sensor payload including custom-designed structural brackets and continuous wireless data transceivers to transmit live feeds to ground controls.",
    bom: ["ESP32-CAM Module", "OV2640 Lens Sensor", "5.8GHz VTX transmitter", "Lightweight 3D Printed Frame Mounts", "Carbon Fiber Vibration Dampers", "Buzzer Failsafe Tracker"],
    features: [
      "Zero-latency continuous analog video feedback loop tests.",
      "Detachable physical mounting system with dampening layers.",
      "Compact wiring scheme maintaining balanced center-of-gravity.",
      "Diagnostic status relays over WiFi link directly."
    ],
    accent: "border-emerald-500/25 hover:border-emerald-500/50"
  }
];

export default function ProjectsLab() {
  const [selectedSnippet, setSelectedSnippet] = useState<"sonarDocking" | "pidTuning" | "camTransmitter">("sonarDocking");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedSnippet].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background-dark text-white relative">
      <Navigation />

      {/* Decorative background grid and neon points */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] -z-10 pointer-events-none" />
      <div className="absolute top-24 left-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-12 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* Back to Home action */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-cyan/80 transition-colors text-sm font-semibold mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Command Station
        </Link>

        {/* Section Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent-cyan font-bold tracking-widest text-xs uppercase flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-cyan rounded-full animate-ping" />
              Robotics Workshop & Lab
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4 text-white">
              Robotics <span className="text-accent-cyan">Lab Workspace</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
              Explore structural blueprints, physical bill of materials, and autonomous firmware files written for quadcopters, custom payloads, and ISRO docking station subsystems.
            </p>
          </motion.div>
        </div>

        {/* Multi-Project Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {detailedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className={`glass-card p-6 border ${project.accent} flex flex-col justify-between glow-hover transition-all duration-300 h-full`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent-cyan/15 rounded-lg flex items-center justify-center border border-accent-cyan/20">
                    <Cpu size={20} className="text-accent-cyan animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-accent-cyan transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-accent-cyan text-xs font-semibold">{project.specs}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Subsystem Specifications */}
                <div className="space-y-2 mb-6">
                  <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">Subsystem Specs</p>
                  {project.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-accent-cyan flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill of Materials (BOM) */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-2.5">Core Bill of Materials (BOM)</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.bom.map((item, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-2xs text-gray-300 font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* High-End IDE Code Sandbox Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-black/60 backdrop-blur-xl"
        >
          {/* Mock IDE Titlebar Header */}
          <div className="bg-background-dark/85 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Fake OS buttons */}
              <div className="flex gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                <FileCode size={18} className="text-accent-cyan" />
                <span className="text-gray-300 text-sm font-semibold tracking-wide">
                  {codeSnippets[selectedSnippet].filename}
                </span>
                <span className="px-2 py-0.5 bg-accent-cyan/15 text-accent-cyan text-3xs font-bold rounded uppercase">
                  {codeSnippets[selectedSnippet].language}
                </span>
              </div>
            </div>

            {/* Select sandbox files dropdown tabs */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSnippet("sonarDocking")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  selectedSnippet === "sonarDocking" 
                    ? "bg-accent-cyan text-background-dark shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                uav_sonar_docking.cpp
              </button>
              <button 
                onClick={() => setSelectedSnippet("pidTuning")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  selectedSnippet === "pidTuning" 
                    ? "bg-accent-cyan text-background-dark shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                hexacopter_pid.ini
              </button>
              <button 
                onClick={() => setSelectedSnippet("camTransmitter")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  selectedSnippet === "camTransmitter" 
                    ? "bg-accent-cyan text-background-dark shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                esp32_cam.cpp
              </button>
            </div>
          </div>

          {/* IDE Sub-Description */}
          <div className="bg-[#0b1120] px-6 py-3 border-b border-white/5 flex justify-between items-center text-xs text-gray-400">
            <span>
              {codeSnippets[selectedSnippet].description}
            </span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-accent-cyan hover:text-white transition-colors font-semibold"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <FileCode size={14} />
                  Copy Snippet
                </>
              )}
            </button>
          </div>

          {/* Code display grid with line numbers */}
          <div className="p-6 bg-[#070c18] font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto leading-relaxed max-h-[480px]">
            <pre className="whitespace-pre">
              {codeSnippets[selectedSnippet].code.split("\n").map((line, idx) => (
                <div key={idx} className="flex group hover:bg-white/5 py-0.5 rounded">
                  <span className="w-10 text-gray-600 select-none text-right pr-4 text-xs font-bold">{idx + 1}</span>
                  <code className="text-gray-300">{line}</code>
                </div>
              ))}
            </pre>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
