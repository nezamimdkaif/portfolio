"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "ISRO IROC 2026 Autonomous UAV Docking Challenge",
    period: "Jan 2026 - Present",
    description: "Qualified Round 1 and Round 2; currently competing in the Round 3 full system autonomy phase. Leading the docking station design improvement as part of hardware implementation.",
    highlights: [
      "Spearheading docking station redesign to improve mechanical precision and reliable UAV docking alignment.",
      "Integrated proximity, IMU, and ultrasonic sensors for precision landing and autonomous docking operations.",
      "Performed component selection, circuit design, system integration, and hardware troubleshooting.",
    ],
    timeline: [
      { phase: "Round 1", status: "Qualified" },
      { phase: "Round 2", status: "Qualified" },
      { phase: "Round 3", status: "Current: Full System Autonomy Phase" },
    ],
    featured: true,
  },
  {
    title: "Custom Drone IIT ISM Bootcamp",
    period: "Jun 2024",
    description: "Assembled a high-performance hexacopter using an OrangeCube flight controller during an intensive, hands-on drone bootcamp at IIT ISM.",
    highlights: [
      "Handled complete component integration and physical hardware layout.",
      "Conducted PID tuning and executed autonomous waypoint mission planning.",
    ],
    featured: false,
  },
  {
    title: "UAV Payload Setup - Camera Module & Wireless Transmission",
    period: "2024",
    description: "Developed a lightweight, functional UAV payload integration setup.",
    highlights: [
      "Integrated a camera module with wireless data transmission on a physical UAV frame.",
      "Managed custom wiring, secure module mounting, and basic radio signal transmission testing.",
    ],
    featured: false,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-12 text-center">
            Featured <span className="text-accent-cyan">Projects</span>
          </h2>
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`glass-card p-8 glow-hover ${project.featured ? 'border-accent-cyan/30' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-2xl mb-2 text-white">
                      {project.title}
                    </h3>
                    <p className="text-accent-cyan text-sm font-medium">{project.period}</p>
                  </div>
                  {project.featured && (
                    <span className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan text-sm font-semibold rounded-full border border-accent-cyan/30">
                      Featured Project
                    </span>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">{project.description}</p>

                <div className="space-y-3 mb-6">
                  {project.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex items-start gap-3">
                      <CheckCircle className="text-accent-cyan flex-shrink-0 mt-1" size={18} />
                      <span className="text-gray-400">{highlight}</span>
                    </div>
                  ))}
                </div>

                {project.timeline && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="font-semibold text-lg mb-4 text-accent-cyan">Progress Timeline</h4>
                    <div className="flex flex-wrap gap-4">
                      {project.timeline.map((item, timelineIndex) => (
                        <div
                          key={timelineIndex}
                          className={`px-4 py-3 rounded-lg border ${
                            item.status.includes("Current")
                              ? "bg-accent-cyan/20 border-accent-cyan"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <p className="text-sm font-semibold text-white mb-1">{item.phase}</p>
                          <p className="text-xs text-gray-400">{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
