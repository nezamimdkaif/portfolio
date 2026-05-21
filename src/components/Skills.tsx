"use client";

import { motion } from "framer-motion";
import { Cpu, Plane, Radio, Code, CheckCircle2 } from "lucide-react";

const skillCategories = [
  {
    icon: Cpu,
    title: "Embedded Systems & Hardware",
    skills: [
      { name: "Microcontrollers", status: "Active System" },
      { name: "Sensor Interfacing", status: "Active System" },
      { name: "Communication Modules", status: "Integration Ready" },
      { name: "PCB Design", status: "Operational" },
      { name: "UAV Power Systems", status: "Active System" },
      { name: "ESC Integration", status: "Operational" },
      { name: "Circuit Design", status: "Operational" },
    ],
  },
  {
    icon: Plane,
    title: "UAV & Autonomous Systems",
    skills: [
      { name: "Mission Planning", status: "Active System" },
      { name: "Flight Testing", status: "Operational" },
      { name: "PID Tuning", status: "Active System" },
      { name: "Troubleshooting", status: "Active System" },
      { name: "Autonomous Systems", status: "Operational" },
    ],
  },
  {
    icon: Radio,
    title: "Sensors",
    skills: [
      { name: "IMU Integration", status: "Active System" },
      { name: "Ultrasonic Sensors", status: "Integration Ready" },
      { name: "Proximity Sensors", status: "Active System" },
      { name: "Sensor Fusion", status: "Operational" },
    ],
  },
  {
    icon: Code,
    title: "Programming & Tools",
    skills: [
      { name: "C Programming", status: "Core Language" },
      { name: "Python", status: "Core Language" },
      { name: "Git/GitHub", status: "Active Workflow" },
      { name: "VS Code", status: "Operational" },
      { name: "Linux CLI", status: "Operational" },
      { name: "Google Colab", status: "Active Workflow" },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-center">
            <span className="text-accent-cyan">Capabilities</span> & Technical Suite
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Autonomous guidance profiles, hardware architectures, and communication protocols currently integrated in active hardware projects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <div className="glass-card p-8 border border-white/10 glow-hover h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-accent-cyan/10 border border-accent-cyan/20 rounded-xl text-accent-cyan">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-display font-bold text-xl">{category.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          whileHover={{ scale: 1.05, borderColor: "rgba(0, 212, 255, 0.4)" }}
                          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5"
                        >
                          <CheckCircle2 size={14} className="text-accent-cyan" />
                          <div className="flex flex-col items-start">
                            <span className="text-white text-xs font-semibold">{skill.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">{skill.status}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
