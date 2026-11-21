"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { availability, news, profile, stats } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { Magnetic, RevealText } from "./effects";

const RoverHero = dynamic(() => import("./RoverHero"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  // the 3D rover only loads on desktop; phones get the same layout without it
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft blue wash + dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#eff6ff] via-white to-white" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]"
        style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="relative lg:min-h-[100svh]">
        {wide && <RoverHero className="absolute inset-y-0 right-0 hidden w-[62%] lg:block" />}

        <div className="pointer-events-none relative mx-auto flex max-w-page flex-col px-5 pb-12 pt-28 md:px-6 lg:min-h-[100svh] lg:justify-center lg:pb-16 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="pointer-events-auto max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[13px] font-medium text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {availability}
            </span>

            <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-paper sm:text-6xl">
              <RevealText text={profile.name} />
            </h1>
            <p className="mt-3 text-xl font-medium text-signal">{profile.role}</p>

            <p className="mt-5 text-[16px] leading-relaxed text-paper-dim">
              Third-year Electronics and Communication Engineering undergraduate at <span className="font-medium text-paper">BIT Sindri</span> (B.Tech,
              2024–2028) and Project Intern at the <span className="font-medium text-paper">Drone Electronics Laboratory, IIT (ISM) Dhanbad</span>.
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-paper-dim">
              I develop autonomy software for drones that must navigate without GPS, with a focus on{" "}
              <span className="font-medium text-paper">LiDAR SLAM</span>, <span className="font-medium text-paper">sensor integration</span> and{" "}
              <span className="font-medium text-paper">simulation-to-hardware testing</span> in Python and ROS 2.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="btn btn-primary px-5 py-2.5">
                  <FileText size={16} /> Resume
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#projects" className="btn px-5 py-2.5">
                  View projects <ArrowRight size={16} />
                </a>
              </Magnetic>
              <span className="flex items-center gap-1">
                {[
                  { href: profile.github, icon: Github, label: "GitHub" },
                  { href: profile.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: `mailto:${profile.email}`, icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <Magnetic key={label} strength={0.35}>
                    <a
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-paper-dim transition-colors hover:bg-ink-800 hover:text-signal"
                    >
                      <Icon size={19} />
                    </a>
                  </Magnetic>
                ))}
              </span>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-paper-mute">
              <MapPin size={14} /> {profile.location}
            </p>
          </motion.div>

          {/* key numbers */}
          <div className="pointer-events-auto mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.08, ease }}
                className="rounded-xl border border-ink-700 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
              >
                <div className="text-xl font-semibold tracking-tight text-paper">{s.value}</div>
                <div className="mt-0.5 text-[12px] leading-snug text-paper-mute">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {wide && (
            <p className="pointer-events-auto mt-8 max-w-md text-[12.5px] leading-relaxed text-paper-mute">
              3D: NASA&apos;s Perseverance rover (model: NASA/JPL-Caltech), which navigates Mars without GPS, the kind of autonomy I work on.
            </p>
          )}
        </div>
      </div>

      {/* latest updates */}
      <div className="mx-auto max-w-page px-5 pb-6 md:px-6">
        <h2 className="label mb-3">Latest</h2>
        <ul className="divide-y divide-ink-700 rounded-xl border border-ink-700 bg-white shadow-sm">
          {news.slice(0, 5).map((n, i) => (
            <motion.li
              key={n.text}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group grid grid-cols-[5.5rem_1fr] gap-4 px-4 py-3 text-[15px] transition-colors hover:bg-ink-900"
            >
              <span className="font-mono text-[13px] leading-6 text-paper-mute">{n.date}</span>
              <span className="leading-6 text-paper-dim group-hover:text-paper">
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
