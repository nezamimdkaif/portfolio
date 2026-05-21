"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Award } from "lucide-react";

import { getAssetPath } from "@/utils";

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-12 text-center">
            <span className="text-accent-cyan">About</span> Me
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              whileHover={{ y: -6, boxShadow: "0 10px 40px rgba(0, 212, 255, 0.15)" }}
              className="glass-card p-8 glow-hover transition-all duration-300"
            >
              <h3 className="font-display font-bold text-2xl mb-6 text-accent-cyan">
                My Journey
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                I am deeply passionate about drone technology, hardware troubleshooting in field conditions, and practical aerial robotics. My journey in embedded systems and robotics has been driven by hands-on experience and a commitment to solving real-world engineering challenges.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                What sets me apart is my active role in the Aero and Robotics Club at BIT Sindri and my selection to lead hardware implementation for the prestigious ISRO IROC 2026 challenge. This opportunity has allowed me to work on cutting-edge UAV docking systems and autonomous flight technologies.
              </p>
              <p className="text-gray-300 leading-relaxed">
                I thrive in environments where I can apply my technical skills to create innovative solutions, particularly in the field of autonomous systems and drone technology.
              </p>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
                <span className="text-gray-400 text-sm font-medium">Looking for my detailed credentials?</span>
                <motion.a
                  href={getAssetPath("/nezami_uavs_cv_ism.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 255, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer hover:border-accent-cyan/60"
                >
                  <GraduationCap size={16} />
                  View Full Resume
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div 
              whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 212, 255, 0.1)" }}
              className="glass-card p-6 glow-hover transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="text-accent-cyan" size={24} />
                <h4 className="font-semibold text-lg">Location</h4>
              </div>
              <p className="text-gray-300">Dhanbad, India</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 212, 255, 0.1)" }}
              className="glass-card p-6 glow-hover transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <GraduationCap className="text-accent-cyan" size={24} />
                <h4 className="font-semibold text-lg">Education</h4>
              </div>
              <p className="text-gray-300 mb-2">Birsa Institute of Technology (BIT) Sindri</p>
              <p className="text-gray-400 text-sm">B.Tech in Electronics and Communication Engineering</p>
              <p className="text-gray-400 text-sm">2024-2028 | 1st Sem CGPA: 7.10</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 212, 255, 0.1)" }}
              className="glass-card p-6 glow-hover transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <Award className="text-accent-cyan" size={24} />
                <h4 className="font-semibold text-lg">Key Achievement</h4>
              </div>
              <p className="text-gray-300">
                Selected to lead hardware implementation for ISRO IROC 2026 UAV Docking Challenge
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
