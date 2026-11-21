"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LidarMap from "./LidarMap";
import { news, profile } from "@/lib/data";
import { getAssetPath } from "@/utils";

const links = [
  { label: "Resume", href: profile.resume },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-28 md:pt-32">
      <svg aria-hidden className="pointer-events-none absolute -right-48 -top-20 h-[760px] w-[760px] opacity-[0.22]" viewBox="0 0 760 760">
        <ellipse cx="380" cy="380" rx="360" ry="150" fill="none" stroke="#e6e6e6" strokeWidth="0.6" transform="rotate(-22 380 380)" />
        <ellipse cx="380" cy="380" rx="270" ry="110" fill="none" stroke="#e6e6e6" strokeWidth="0.5" strokeDasharray="2 7" transform="rotate(-22 380 380)" />
        <circle cx="700" cy="250" r="3" fill="#e8c872" />
      </svg>

      <div className="mx-auto grid max-w-page items-start gap-12 px-4 md:px-6 lg:grid-cols-[1.1fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="text-4xl font-semibold tracking-tight text-paper sm:text-5xl">{profile.name}</h1>
          <p className="mt-3 text-lg text-signal">{profile.role}</p>
          <p className="mt-6 max-w-xl leading-relaxed text-paper-dim">
            I am a B.Tech Electronics and Communication Engineering student at <span className="text-paper">BIT Sindri</span> (2024 - 2028) and a project
            intern at the <span className="text-paper">Drone Electronics Laboratory, IIT (ISM) Dhanbad</span>. I build autonomy software for robots that
            fly without GPS: LiDAR SLAM, sensor integration and simulation, mostly in Python and ROS 2. I like taking a feature from simulation to real
            hardware and proving it with data.
          </p>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {links.map((l, i) => (
              <span key={l.label} className="flex items-center gap-5">
                <a href={getAssetPath(l.href)} target={l.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" className="text-paper underline decoration-ink-600 underline-offset-4 hover:text-signal hover:decoration-signal">
                  {l.label}
                </a>
                {i < links.length - 1 && <span className="text-ink-600">/</span>}
              </span>
            ))}
          </p>
        </motion.div>

        <motion.div style={{ y: mapY }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-ink-700 bg-ink-900/60 blueprint">
            <LidarMap className="absolute inset-0 h-full w-full" />
          </div>
          <p className="mt-2 font-mono text-[11px] text-paper-mute">2D LiDAR SLAM: a drone maps an unknown maze from its own scans.</p>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 max-w-page px-4 md:px-6">
        <h2 className="label mb-4">News</h2>
        <ul className="divide-y divide-ink-700/70 border-y border-ink-700/70">
          {news.map((n, i) => (
            <motion.li
              key={n.text}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="grid grid-cols-[5.5rem_1fr] gap-4 py-2.5 text-sm"
            >
              <span className="font-mono text-xs leading-6 text-paper-mute">{n.date}</span>
              <span className="leading-6 text-paper-dim">
                {n.href ? (
                  <a href={getAssetPath(n.href)} target="_blank" rel="noreferrer" className="hover:text-signal">
                    {n.text}
                  </a>
                ) : (
                  n.text
                )}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
