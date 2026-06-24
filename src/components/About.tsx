"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Mail, Phone, Clock, Briefcase, Download, ArrowRight, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { getAssetPath } from "@/utils";

export default function About() {
  const stats = [
    { label: "UAV Projects", value: "15+" },
    { label: "Years Experience", value: "2+" },
    { label: "Tech Awards", value: "5+" }
  ];

  const infoCards = [
    { icon: Briefcase, label: "Role", value: "Robotics Subsystem Lead" },
    { icon: GraduationCap, label: "Degree", value: "B.Tech in ECE" },
    { icon: MapPin, label: "Based in", value: "Dhanbad, India" },
    { icon: Mail, label: "Email", value: "mdkaif.ece24@bitsindri.ac.in" },
    { icon: Phone, label: "Phone", value: "+91 9801615695" },
    { icon: Clock, label: "Availability", value: "Open to Work / Intern" }
  ];

  const skills = [
    { name: "Embedded Systems & C/C++", level: 95 },
    { name: "UAV Flight Control & Autonomy", level: 90 },
    { name: "Sensor Interfacing & Calibration", level: 92 },
    { name: "PCB & Circuit Design", level: 80 },
    { name: "Linux & Python", level: 85 }
  ];

  return (
    <section id="about" className="py-24 relative bg-[#0d0d0d] px-6 sm:px-8 lg:px-12">
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
            About <span className="text-accent-coral">Me</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
            Passionate about embedded firmware development, electronic hardware designs, and autonomous aerial robotics systems.
          </p>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
              
              {/* Avatar circle */}
              <div className="w-28 h-28 rounded-full border-2 border-accent-coral p-1 mb-4 overflow-hidden bg-black/40">
                <img 
                  src={getAssetPath("/moody_portrait.png")} 
                  alt="Avatar portrait" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-1">Md Kaif Nezami</h3>
              <p className="text-gray-400 text-sm mb-4">Embedded & UAV Hardware Specialist</p>





              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
                <motion.a
                  href={getAssetPath("/nezami_uavs_cv_ism.pdf")}
                  download="Md_Kaif_Nezami_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-accent-coral hover:bg-accent-coral/95 text-white py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  Download CV
                </motion.a>

                <motion.a
                  href="#contact"
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 border border-white/10 hover:border-accent-coral hover:bg-accent-coral/5 text-gray-300 hover:text-white py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Contact Me
                  <ArrowRight size={14} />
                </motion.a>
              </div>

              {/* Social icons */}
              <div className="flex gap-3">
                {[
                  { icon: Twitter, url: "https://x.com/Nezamimd7" },
                  { icon: Instagram, url: "https://instagram.com/nezamimdkaif" },
                  { icon: Linkedin, url: "https://linkedin.com/in/md-kaif-nezami-029507313" }
                ].map((soc, idx) => {
                  const Icon = soc.icon;
                  return (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-accent-coral flex items-center justify-center hover:bg-accent-coral/10 transition-all duration-300"
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>

            </div>
          </motion.div>

          {/* Right Column Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {infoCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5 flex items-center gap-4 hover:border-accent-coral/25 transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-accent-coral/10 border border-accent-coral/20 flex items-center justify-center text-accent-coral flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-3xs uppercase tracking-widest">{card.label}</p>
                      <p className="text-white text-sm font-semibold mt-0.5 line-clamp-1">{card.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Core Skills section */}
            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-8 shadow-md">
              <h3 className="font-display font-bold text-xl text-white mb-6">Core Skills / Technical Proficiency</h3>
              
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-2 bg-black/40 border border-white/5 rounded-xl text-xs font-semibold text-gray-300 hover:border-accent-coral/30 hover:text-white transition-all duration-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
