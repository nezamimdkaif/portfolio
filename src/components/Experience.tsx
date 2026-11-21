"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/lib/data";
import { Reveal, SectionHead } from "./ui";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <section id="work" className="mx-auto max-w-page px-4 py-24 md:px-6 md:py-32">
      <SectionHead index="01" title="Experience" lead="Lab work, a national competition, and one internship that turned into two." />

      <div ref={ref} className="relative pl-6 md:pl-10">
        <div className="absolute left-0 top-1 h-full w-px bg-ink-700" />
        <motion.div className="absolute left-0 top-1 h-full w-px origin-top bg-signal" style={{ scaleY: scrollYProgress }} />

        <div className="space-y-14">
          {experience.map((e, i) => (
            <Reveal key={e.role} delay={0.05 * i}>
              <article className="relative">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-signal bg-ink-950 md:-left-[45px]" />
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="text-xl font-medium text-paper">{e.role}</h3>
                  <span className="font-mono text-xs text-paper-mute">{e.period}</span>
                </div>
                <p className="mt-1 text-paper-dim">{e.org}</p>
                {e.note && <p className="mt-1 text-sm italic text-paper-mute">{e.note}</p>}
                <ul className="mt-4 space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 leading-relaxed text-paper-dim">
                      <span className="mt-2.5 h-px w-3 shrink-0 bg-paper-mute" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
