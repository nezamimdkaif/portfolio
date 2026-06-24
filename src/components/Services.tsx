"use client";

import { motion } from "framer-motion";
import { Plane, Compass, Code, Sliders, Layers, Activity, Gauge, Cpu, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Plane,
      title: "Drone Assembly & Integration",
      desc: "Complete layout design, weight calibration, ESC integration, and custom motor mount structuring on multirotor drone systems.",
      highlight: true
    },
    {
      icon: Compass,
      title: "Autonomous Mission Planning",
      desc: "Programming automated flight path configurations, fail-safes, landing sequences, and waypoint coordinates telemetry.",
      highlight: false
    },
    {
      icon: Code,
      title: "Embedded Firmware Development",
      desc: "Writing highly-optimized C and C++ scripts for Arduino, ESP32, and Pixhawk processors to govern real-time sensors and payloads.",
      highlight: false
    },
    {
      icon: Sliders,
      title: "Sensor Interfacing & Calibration",
      desc: "Interfacing and data logging for ultrasonic transducers, IMUs, optical flow, RTK GPS receivers, and distance proximity matrices.",
      highlight: false
    },
    {
      icon: Layers,
      title: "PCB Layout & Circuit Design",
      desc: "Schematic generation and multi-layer PCB design for drone payloads, custom controller shields, and signal distribution nodes.",
      highlight: false
    },
    {
      icon: Activity,
      title: "Drone Diagnostics & Repair",
      desc: "Field hardware troubleshooting, oscilloscope diagnostics, wiring corrections, and telemetry signal integrity assessments.",
      highlight: false
    },
    {
      icon: Gauge,
      title: "PID Tuning & Stabilization",
      desc: "Calibrating roll, pitch, and yaw control loops on heavy hexacopters to establish optimal hover stability under turbulent wind states.",
      highlight: false
    },
    {
      icon: Cpu,
      title: "Robotics Control & Autonomy",
      desc: "Developing autonomous docking alignment systems utilizing ArUco visual markers, sensor feedback loops, and actuator locking solenoids.",
      highlight: false
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#0d0d0d] px-6 sm:px-8 lg:px-12 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">
            My <span className="text-accent-coral">Services</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
            Hands-on technical engineering services specialized in aerial systems, robotics autonomy, and embedded circuits.
          </p>
        </motion.div>

        {/* 8-Card Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <div 
                  className={`bg-[#1c1c1c] rounded-xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-lg group ${
                    srv.highlight 
                      ? "border-2 border-accent-coral shadow-[0_4px_25px_rgba(251,58,93,0.15)]" 
                      : "border border-white/5 hover:border-accent-coral/30"
                  }`}
                >
                  <div>
                    {/* Icon container */}
                    <div className="w-12 h-12 rounded-lg bg-accent-coral/10 border border-accent-coral/20 flex items-center justify-center text-accent-coral mb-6 group-hover:bg-accent-coral group-hover:text-white transition-all duration-300">
                      <Icon size={22} />
                    </div>

                    <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-accent-coral transition-colors duration-300">
                      {srv.title}
                    </h3>
                    
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                      {srv.desc}
                    </p>
                  </div>

                  <a 
                    href="#contact" 
                    className="inline-flex items-center gap-1.5 text-accent-coral hover:text-accent-coral/80 text-xs font-bold transition-all duration-200 mt-auto cursor-pointer"
                  >
                    Explore
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coral Gradient CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-accent-coral to-[#ff6b8b] rounded-2xl p-10 sm:p-12 md:p-16 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Decorative glowing overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          
          <div className="relative z-10 flex-1 space-y-3 text-center md:text-left">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              Transform Your Vision Into Reality
            </h3>
            <p className="text-white/90 text-sm sm:text-base max-w-xl">
              Collaborate on custom UAV integrations, embedded robotics hardware controllers, or sensor subsystem calibrations today.
            </p>
          </div>

          <div className="relative z-10">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-100 text-accent-coral px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Your Project
              <ArrowRight size={18} />
            </motion.a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
