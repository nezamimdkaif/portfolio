"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { getAssetPath } from "@/utils";
import AnimatedDrone from "./AnimatedDrone";

const titles = [
  "Embedded Systems Engineer",
  "Autonomous UAV Specialist",
  "Robotics Developer"
];

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [titleIdx, setTitleIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = titles[titleIdx];
    
    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          // Pause before deleting
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        // Deleting
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setTitleIdx((prev) => (prev + 1) % titles.length);
          return;
        }
      }
      
      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(handleType, speed);
    };

    timer = setTimeout(handleType, 100);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIdx]);

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a] pt-28 pb-16 px-6 sm:px-8 lg:px-12"
    >
      {/* Background ambient red-coral lights */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent-coral/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-accent-coral/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none -z-10" />

      {/* Floating Animated Drone in Background */}
      <div className="absolute left-6 md:left-12 bottom-12 w-48 sm:w-64 md:w-80 opacity-25 pointer-events-none select-none z-0">
        <AnimatedDrone showBackground={false} />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Welcome and Typewriter Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col items-start space-y-6 text-left"
        >
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
            Hi, I&apos;m <span className="text-white">Md Kaif Nezami</span>
          </h1>

          <div className="h-12 flex items-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-medium">
              I&apos;m a <span className="text-accent-coral font-bold typewriter-cursor pr-1">{currentText}</span>
            </h2>
          </div>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Electronics &amp; Communication Engineering student at BIT Sindri, currently diving deep into robotics mechanisms, engineering mathematics, and ROS (Robot Operating System). Simultaneously, as an intern at IIT (ISM) Dhanbad Drone Lab, I work on drone telemetry setups, sensor integration, and component validation—honing hands-on research and development skills by decoding datasheets and running system-level trials.
          </p>

          {/* Social Icons list */}
          <div className="flex gap-4 pt-4">
            {[
              { icon: Twitter, url: "https://x.com/Nezamimd7" },
              { icon: Instagram, url: "https://instagram.com/nezamimdkaif" },
              { icon: Linkedin, url: "https://linkedin.com/in/md-kaif-nezami-029507313" }
            ].map((soc, idx) => {
              const Icon = soc.icon;
              return (
                <motion.a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, backgroundColor: "#fb3a5d", borderColor: "#fb3a5d", color: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-full border border-white/10 bg-[#1c1c1c] text-gray-400 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer z-10"
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Moody Techwear Portrait Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          <div className="relative group max-w-sm sm:max-w-md">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-accent-coral/20 rounded-2xl blur-xl group-hover:bg-accent-coral/30 transition-all duration-500" />
            
            {/* Inner Border frame */}
            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-[#1c1c1c] p-2 shadow-2xl">
              <img 
                src={getAssetPath("/moody_portrait.png")} 
                alt="Md Kaif Nezami portrait" 
                className="w-full h-auto rounded-xl object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Corner styling widgets */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent-coral" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent-coral" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent-coral" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent-coral" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
