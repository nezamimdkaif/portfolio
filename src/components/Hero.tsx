"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, FileText } from "lucide-react";
import { useRef } from "react";
import LidarMap from "./LidarMap";
import { profile, stats } from "@/lib/data";
import { getAssetPath } from "@/utils";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-24 md:pt-28">
      {/* faint orbit lines: the space touch */}
      <svg aria-hidden className="pointer-events-none absolute -right-40 -top-24 h-[720px] w-[720px] opacity-[0.18]" viewBox="0 0 720 720">
        <ellipse cx="360" cy="360" rx="340" ry="140" fill="none" stroke="#ece8e1" strokeWidth="0.6" transform="rotate(-24 360 360)" />
        <ellipse cx="360" cy="360" rx="260" ry="100" fill="none" stroke="#ece8e1" strokeWidth="0.5" strokeDasharray="2 6" transform="rotate(-24 360 360)" />
        <circle cx="660" cy="232" r="3" fill="#ff6b35" />
      </svg>

      <div className="mx-auto grid max-w-page items-center gap-10 px-4 md:px-6 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={{ y: textY, opacity: fade }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="label mb-5">
            {profile.role} · {profile.location}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-semibold tracking-tight text-paper sm:text-6xl md:text-7xl"
          >
            {profile.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-2xl font-light leading-snug text-paper md:text-[1.7rem]"
          >
            {profile.tagline.replace("without GPS.", "")}
            <span className="text-signal">without GPS.</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-5 max-w-xl leading-relaxed text-paper-dim"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#projects" className="btn btn-primary">See the work</a>
            <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="btn">
              <FileText size={16} /> Resume
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn" aria-label="GitHub">
              <Github size={16} /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn" aria-label="LinkedIn">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="btn" aria-label="Email">
              <Mail size={16} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: mapY, scale: mapScale }} className="relative">
          <div className="panel blueprint relative aspect-[3/2] overflow-hidden">
            <LidarMap className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] leading-relaxed text-paper-mute">
              <div>/scan · 2D LiDAR · 360°</div>
              <div>/map · occupancy grid</div>
            </div>
            <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 font-mono text-[10px] text-paper-mute">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> SLAM running
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] text-paper-mute">
            Illustration of what I work on: a drone maps an unknown maze from its own LiDAR scans.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 grid max-w-page grid-cols-2 gap-px overflow-hidden border-y border-ink-700 bg-ink-700 px-0 md:mt-24 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-ink-950 px-4 py-6 md:px-6"
          >
            <div className="font-mono text-2xl text-paper md:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs leading-snug text-paper-mute">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <a href="#work" className="mx-auto mt-8 flex w-fit items-center gap-2 font-mono text-[11px] text-paper-mute hover:text-paper" aria-label="Scroll to experience">
        <ArrowDown size={14} className="animate-bounce" /> scroll
      </a>
    </section>
  );
}
