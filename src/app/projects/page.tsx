"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Cpu } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const detailedProjects = [
  {
    id: "swayaan",
    title: "SwaYaan Summer Research Internship",
    specs: "MeitY Central Govt Initiative (IIT ISM)",
    description: "Serving as a Project Research Intern at the specialized Drone Lab in the Department of Electronics Engineering, IIT (ISM) Dhanbad, focusing on capacity building, flight control loop setups, sensor feedback loops, and advanced UAS GNC systems.",
    accent: "border-accent-coral/20 hover:border-accent-coral/65 shadow-md shadow-accent-coral/5"
  },
  {
    id: "iroc",
    title: "ISRO IROC 2026 UAV Docking Station",
    specs: "Autonomous Mechanical & Sensor Interfacing Dock",
    description: "Designing mechanical docking plates and sensor calibration loops for autonomous drone alignment and battery coupling under GPS-denied scenarios.",
    accent: "border-accent-coral/20 hover:border-accent-coral/65 shadow-md shadow-accent-coral/5"
  },
  {
    id: "hexacopter",
    title: "Autonomous Hexacopter Flight Setup",
    specs: "OrangeCube Flight Controller & Core Build",
    description: "Integrated and calibrated a high-performance hexacopter flight platform utilizing OrangeCube flight controller. Tuned attitude/heading PID parameters and executed waypoint tracking missions.",
    accent: "border-accent-coral/20 hover:border-accent-coral/65 shadow-md shadow-accent-coral/5"
  },
  {
    id: "payload",
    title: "UAV Live Camera & Telemetry Payload",
    specs: "Zero-Latency Stream Transceiver Module",
    description: "Developed a lightweight, detachable ESP32-CAM payload structure with vibration isolation to relay real-time analog video streams directly to the ground station.",
    accent: "border-accent-coral/20 hover:border-accent-coral/65 shadow-md shadow-accent-coral/5"
  }
];

export default function ProjectsLab() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative">
      <Navigation />

      {/* Decorative background grid and neon points */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:50px_50px] -z-10 pointer-events-none" />
      <div className="absolute top-24 left-10 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-12 right-10 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-24 relative z-10">
        
        {/* Back to Home action */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-accent-coral hover:text-accent-coral/80 transition-colors text-sm font-semibold mb-8 group"
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
            <span className="text-accent-coral font-bold tracking-widest text-xs uppercase flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-accent-coral rounded-full animate-ping" />
              Robotics Workshop & Lab
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl mb-4 text-white">
              Robotics <span className="text-accent-coral">Lab Workspace</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl leading-relaxed">
              Overview of physical research implementations, core autonomous avionics platforms, and mechanical landing subsystems developed for autonomous UAV challenges.
            </p>
          </motion.div>
        </div>

        {/* Multi-Project Layout Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {detailedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`glass-card p-8 border ${project.accent} flex flex-col justify-between bg-[#111827]/30 backdrop-blur-md rounded-2xl transition-all duration-300 h-full`}
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-accent-coral/15 rounded-lg flex items-center justify-center border border-accent-coral/20">
                    <Cpu size={20} className="text-accent-coral animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-accent-coral text-xs font-semibold mt-0.5">{project.specs}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
