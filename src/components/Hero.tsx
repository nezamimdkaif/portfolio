"use client";

import { motion } from "framer-motion";
import { getAssetPath } from "@/utils";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-dark via-background-lighter to-background-dark opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl mb-4">
            <span className="text-white">Md Kaif Nezami</span>
          </h1>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 text-accent-cyan text-glow">
            Embedded Systems & Robotics Engineer
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 font-medium">
            Autonomous UAV Systems Developer | Drone Hardware Specialist
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-gray-400 text-lg mb-12 leading-relaxed"
        >
          Second-year ECE student at BIT Sindri with hands-on experience in UAV electronics, embedded systems, and sensor integration. Currently contributing to the prestigious ISRO IROC 2026 UAV docking challenge through subsystem design, component selection, and full-system autonomy testing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 bg-accent-cyan text-background-dark px-8 py-4 rounded-full font-semibold transition-all duration-300"
          >
            View Projects
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.a>
          <motion.a
            href={getAssetPath("/nezami_uavs_cv_ism.pdf")}
            download="Md_Kaif_Nezami_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 255, 0.1)", boxShadow: "0 0 20px rgba(0, 212, 255, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 border border-accent-cyan text-accent-cyan px-8 py-4 rounded-full font-semibold transition-all duration-300 cursor-pointer"
          >
            <Download size={20} />
            Download CV
          </motion.a>
        </motion.div>

        {/* Abstract tech graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="w-64 h-64 mx-auto relative">
            <div className="absolute inset-0 border-2 border-accent-cyan/30 rounded-full animate-pulse" />
            <div className="absolute inset-4 border border-accent-cyan/20 rounded-full" />
            <div className="absolute inset-8 border border-accent-cyan/10 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-accent-cyan/20 to-transparent rounded-full blur-xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-accent-cyan/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-accent-cyan rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
