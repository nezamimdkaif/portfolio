"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { news, profile } from "@/lib/data";
import { getAssetPath } from "@/utils";

const RoverHero = dynamic(() => import("./RoverHero"), { ssr: false });

const links = [
  { label: "Resume", href: profile.resume },
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export default function Hero() {
  // render a single WebGL rover: full-bleed on desktop, a box under the text on phones
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
      {/* Rover: full-bleed behind the text on large screens, below it on phones */}
      <div className="relative">
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
            <h1 className="text-5xl font-semibold tracking-tight text-paper sm:text-6xl">{profile.name}</h1>
            <p className="mt-6 leading-relaxed text-paper-dim">
              B.Tech Electronics and Communication Engineering student at <span className="text-paper">BIT Sindri</span> (2024 - 2028) and project
              intern at the <span className="text-paper">Drone Electronics Laboratory, IIT (ISM) Dhanbad</span>. I build autonomy software for robots
              that fly without GPS: LiDAR SLAM, sensor integration and simulation, mostly in Python and ROS 2.
            </p>
            <p className="mt-6 flex flex-wrap gap-3">
              {links.map((l, i) => (
                <a
                  key={l.label}
                  href={getAssetPath(l.href)}
                  target={l.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  className={i === 0 ? "btn btn-primary" : "btn"}
                >
                  {l.label}
                </a>
              ))}
            </p>
          </motion.div>
        </div>
       </div>
      </div>

      <div className="relative mt-6 h-[52vh] lg:hidden">{wide === false && <RoverHero className="absolute inset-0" />}</div>

      <div className="mx-auto mt-10 max-w-page px-4 md:px-6 lg:mt-0">
        <h2 className="label mb-4">News</h2>
        <ul className="divide-y divide-ink-700 border-y border-ink-700">
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
