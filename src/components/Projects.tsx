"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowUpRight, FolderGit2 } from "lucide-react";

export default function Projects() {
  const categories = ["All", "UAVs", "Embedded", "Robotics"];
  const [activeFilter, setActiveFilter] = useState("All");

  const projects = [
    {
      title: "ISRO IROC 2026 UAV Docking Challenge",
      period: "Jan 2026 - Present",
      description: "Qualified Rounds 1 & 2; currently preparing for the Round 3 full autonomy flight phase. Designing a physical docking lock mechanism, integrating ultrasonic ranging, and sensor handshake relays with OrangeCube controllers.",
      categories: ["UAVs", "Robotics", "Embedded"],
      highlights: [
        "Mechanical structure layout design for stable alignment under heavy sway",
        "Sensors relay code: Arduino interfaces mapping to Pixhawk autopilot via MAVLink",
        "Field telemetry troubleshooting, power distribution circuits, and docking lock actuators"
      ],
      link: "https://github.com/nezamimdkaif/ISRO-IROC-2026"
    },
    {
      title: "Custom Hexacopter Flight Platform",
      period: "June 2024",
      description: "Assembled a 550mm class carbon fiber hexacopter utilizing Pixhawk OrangeCube flight controller. Calibrated inertial sensors, tuned PID parameters, and configured autonomous waypoint navigation protocols.",
      categories: ["UAVs"],
      highlights: [
        "Full frame wiring layout, power distribution board setups, and ESC calibrations",
        "Calibrated magnetometer tilt-compensation and barometer altitude relays",
        "Conducted mission waypoint maps and autonomous return-to-launch fail-safes"
      ],
      link: "https://github.com/nezamimdkaif/uav-hexacopter-flight"
    },
    {
      title: "Lightweight UAV Payload Camera Relay",
      period: "2024",
      description: "Integrated an ESP32-CAM and RF wireless video transmitter node onto a physical drone body. Enabled a light real-time telemetry stream back to the ground control station.",
      categories: ["UAVs", "Embedded"],
      highlights: [
        "Lightweight housing design to minimize aerodynamic drag and payload weight",
        "Custom ESP32-CAM script configuring RTSP video stream packet transmission",
        "Installed physical filters to avoid RF interference from main brushless motor lines"
      ],
      link: "https://github.com/nezamimdkaif/payload-camera-transmission"
    }
  ];

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <section id="portfolio" className="py-24 bg-[#0a0a0a] px-6 sm:px-8 lg:px-12 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">
            My <span className="text-accent-coral">Portfolio</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
            Filter and explore projects documenting hardware integrations, autonomous flight tuning, and microcontroller designs.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeFilter === cat
                  ? "bg-accent-coral border-accent-coral text-white shadow-[0_4px_15px_rgba(251,58,93,0.3)]"
                  : "bg-[#1c1c1c] border-white/5 text-gray-400 hover:text-white hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1c1c1c] border border-white/5 rounded-xl p-6 flex flex-col justify-between hover:border-accent-coral/25 transition-all duration-300 shadow-lg group relative overflow-hidden h-full"
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-coral/5 rounded-bl-full pointer-events-none group-hover:bg-accent-coral/10 transition-all duration-500" />
                
                <div>
                  {/* Category tag badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.categories.map((c) => (
                      <span key={c} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-coral/10 text-accent-coral border border-accent-coral/15">
                        {c}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2 leading-snug group-hover:text-accent-coral transition-colors duration-300 flex items-start justify-between gap-4">
                    {project.title}
                    <FolderGit2 className="text-gray-600 group-hover:text-accent-coral transition-colors flex-shrink-0" size={18} />
                  </h3>
                  
                  <p className="text-accent-coral text-xs font-semibold mb-3">{project.period}</p>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">{project.description}</p>

                  <div className="space-y-2 mb-6">
                    {project.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="text-accent-coral flex-shrink-0 mt-0.5" size={14} />
                        <span className="text-gray-400 text-xs leading-relaxed">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-white hover:text-accent-coral text-xs font-bold mt-auto transition-colors duration-200 cursor-pointer"
                  >
                    View Source Repository
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
