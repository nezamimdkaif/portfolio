"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { news, profile } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { Magnetic, RevealText } from "./effects";

const RoverHero = dynamic(() => import("./RoverHero"), { ssr: false });
const DroneHero = dynamic(() => import("./DroneHero"), { ssr: false });

const links = [
  { label: "Resume", href: profile.resume },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export default function Hero() {
  // desktop: Perseverance rover full-bleed behind the text; phones: their own layout with the drone
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <section id="top" className="relative">
      {/* soft blue tint: its own layer BEHIND the background drone (z -20 < drone z -10) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#eff6ff] via-white to-white" />
      {/* ---------- desktop ---------- */}
      <div className="relative hidden lg:block">
       <div className="relative lg:h-[100svh] lg:min-h-[640px]">
        {wide === true && <RoverHero className="absolute inset-0" />}

        <div className="pointer-events-none relative mx-auto flex h-full max-w-page items-center px-4 pt-28 md:px-6 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto max-w-xl"
          >
            <p className="label mb-4 text-signal">{profile.role}</p>
            <h1 className="text-5xl font-semibold tracking-tight text-paper sm:text-6xl">
              <RevealText text={profile.name} />
            </h1>
            <p className="mt-6 leading-relaxed text-paper-dim">
              Third-year Electronics and Communication Engineering undergraduate at <span className="text-paper">BIT Sindri</span> (B.Tech, 2024–2028) and
              Project Intern at the <span className="text-paper">Drone Electronics Laboratory, IIT (ISM) Dhanbad</span>.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-paper-dim">
              I develop autonomy software for drones that must navigate without GPS, with a focus on{" "}
              <span className="text-paper">LiDAR SLAM</span>, <span className="text-paper">sensor integration</span> and{" "}
              <span className="text-paper">simulation-to-hardware testing</span> in Python and ROS 2.
            </p>
            <p className="mt-6 flex flex-wrap gap-3">
              {links.map((l, i) => (
                <Magnetic key={l.label}>
                  <a
                    href={getAssetPath(l.href)}
                    target={l.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className={i === 0 ? "btn btn-primary" : "btn"}
                  >
                    {l.label}
                  </a>
                </Magnetic>
              ))}
            </p>
            <p className="mt-8 max-w-md text-[13px] leading-relaxed text-paper-mute">
              3D: NASA&apos;s Perseverance rover (model: NASA/JPL-Caltech), which navigates Mars without GPS, the kind of autonomy I work on.
            </p>
          </motion.div>
        </div>
       </div>
      </div>

      {/* ---------- phones ---------- */}
      <div className="lg:hidden">
        {/* the drone flies in the background, behind all content */}
        {wide === false && <DroneHero background className="pointer-events-none fixed inset-0 -z-10" />}
        <div aria-hidden className="h-[44svh] min-h-[280px]" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 pt-4"
        >
          <p className="label mb-3 text-signal">{profile.role}</p>
          <h1 className="text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-paper">
            <RevealText text={profile.name} />
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-paper-dim">
            Third-year Electronics and Communication Engineering undergraduate at <span className="text-paper">BIT Sindri</span> (B.Tech, 2024–2028)
            and Project Intern at the <span className="text-paper">Drone Electronics Laboratory, IIT (ISM) Dhanbad</span>.
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-paper-dim">
            I develop autonomy software for drones that must navigate without GPS, with a focus on <span className="text-paper">LiDAR SLAM</span>,{" "}
            <span className="text-paper">sensor integration</span> and <span className="text-paper">simulation-to-hardware testing</span> in Python and ROS 2.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {links.map((l, i) => (
              <a
                key={l.label}
                href={getAssetPath(l.href)}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className={`${i === 0 ? "btn btn-primary" : "btn"} justify-center py-3 active:scale-[0.97]`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-12 max-w-page px-5 md:px-6 lg:mt-0">
        <h2 className="label mb-4">News</h2>
        <ul className="divide-y divide-ink-700 border-y border-ink-700">
          {news.map((n, i) => (
            <motion.li
              key={n.text}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group relative grid grid-cols-[5.5rem_1fr] gap-4 py-2.5 text-[15px] transition-colors hover:bg-ink-900"
            >
              <span className="font-mono text-[13px] leading-6 text-paper-mute">{n.date}</span>
              <span className="leading-6 text-paper-dim transition-colors group-hover:text-paper">
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
