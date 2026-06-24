"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Calendar } from "lucide-react";

export default function Resume() {
  const experience = [
    {
      title: "Project Research Intern",
      facility: "Drone Lab, IIT (ISM) Dhanbad",
      period: "Summer 2026",
      description: "Contributing to the central government-funded 'SwaYaan' initiative under MeitY, focusing on human resource development and technical capacity building in UAS. Interfaced sensor relays, assembled test beds, and calibrated GNC flight systems."
    },
    {
      title: "Hardware Subsystem Lead",
      facility: "ISRO IROC 2026 UAV Docking Challenge",
      period: "Jan 2026 - Present",
      description: "Spearheading docking station mechanical alignment upgrades. Integrating ultrasonic and infrared distance arrays with autopilot stacks to optimize precision automated landing and locking loops."
    },
    {
      title: "Drone Assembly & flight Tuning",
      facility: "IIT ISM Custom Drone Bootcamp",
      period: "June 2024",
      description: "Assembled a 550mm diagonal heavy carbon fiber hexacopter, integrating Pixhawk OrangeCube flight controller with ESC boards. Conducted sensor calibration, PID tuning loops, and waypoints."
    }
  ];

  const education = [
    {
      title: "B.Tech in Electronics & Communication Engineering",
      facility: "Birsa Institute of Technology (BIT) Sindri",
      period: "2024 - 2028",
      description: "Pursuing bachelor's degree in engineering. Active member of the Aero and Robotics Club, contributing to hands-on drone engineering projects. 1st Sem CGPA: 7.10"
    },
    {
      title: "ISRO GNSS Certification",
      facility: "Indian Space Research Organisation (ISRO)",
      period: "2025",
      description: "Completed academic overview course on Global Navigation Satellite System (GNSS) mapping, satellite tracking data feeds, and coordinates translation systems."
    },
    {
      title: "Machine Learning Certificate",
      facility: "DeepLearning.AI (Coursera)",
      period: "2024",
      description: "Verified training in Supervised Machine Learning, covering regression modeling, gradient descent optimization, classifications, and parameter adjustments."
    }
  ];

  return (
    <section id="resume" className="py-24 bg-[#0a0a0a] px-6 sm:px-8 lg:px-12 relative">
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
            My <span className="text-accent-coral">Resume</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
            A chronological timeline of my academic background, certificates, and practical hardware research accomplishments.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Experience Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent-coral/10 border border-accent-coral/20 flex items-center justify-center text-accent-coral">
                <Briefcase size={20} />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">Experience</h3>
            </div>

            <div className="border-l border-white/10 pl-6 ml-5 space-y-10 relative">
              {experience.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent-coral border-4 border-[#0a0a0a]" />

                  <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-6 hover:border-accent-coral/20 transition-all duration-300 shadow-md">
                    <span className="text-accent-coral text-xs font-bold font-mono flex items-center gap-1.5 mb-2">
                      <Calendar size={12} />
                      {item.period}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm font-semibold mb-3">{item.facility}</p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent-coral/10 border border-accent-coral/20 flex items-center justify-center text-accent-coral">
                <GraduationCap size={20} />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">Education & Certs</h3>
            </div>

            <div className="border-l border-white/10 pl-6 ml-5 space-y-10 relative">
              {education.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent-coral border-4 border-[#0a0a0a]" />

                  <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-6 hover:border-accent-coral/20 transition-all duration-300 shadow-md">
                    <span className="text-accent-coral text-xs font-bold font-mono flex items-center gap-1.5 mb-2">
                      <Calendar size={12} />
                      {item.period}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm font-semibold mb-3">{item.facility}</p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
