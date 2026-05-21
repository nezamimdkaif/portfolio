"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-background-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center"
        >
          {/* Quick Subpage Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm font-semibold text-gray-400">
            <Link href="/" className="hover:text-accent-cyan transition-colors">Command Station</Link>
            <Link href="/projects" className="hover:text-accent-cyan transition-colors">Robotics Lab</Link>
            <Link href="/drone" className="hover:text-accent-cyan transition-colors">Drone Showcase</Link>
          </div>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Md Kaif Nezami. All rights reserved.
          </p>
          <p className="text-accent-cyan text-xs font-bold uppercase tracking-widest mt-2.5">
            Embedded Systems & Robotics Engineer | Dhanbad, India
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
