"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/lib/data";
import { Reveal, SectionHead } from "./ui";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });

  return (
    <section id="work" className="mx-auto max-w-page px-5 py-20 md:px-6 md:py-24">
      <SectionHead index="03" title="Experience" heading="Where I have worked" />
      <div ref={ref} className="relative ml-2 md:ml-4">
        <div className="absolute left-0 top-2 h-full w-0.5 rounded bg-ink-700" />
        <motion.div className="absolute left-0 top-2 h-full w-0.5 origin-top rounded bg-signal" style={{ scaleY: scrollYProgress }} />
        <div className="space-y-8">
          {experience.map((e) => (
            <Reveal key={e.role}>
              <article className="relative pl-8 md:pl-10">
                <span className="absolute -left-[7px] top-6 h-4 w-4 rounded-full border-[3px] border-white bg-signal shadow ring-1 ring-blue-200" />
                <div className="rounded-2xl border border-ink-700 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-paper">{e.role}</h3>
                      <p className="text-[15px] text-paper-dim">{e.org}</p>
                    </div>
                    <span className="mt-1 shrink-0 rounded-full bg-ink-800 px-3 py-1 font-mono text-[12.5px] text-paper-dim md:mt-0">{e.period}</span>
                  </div>
                  {e.note && <p className="mt-2 text-[14px] italic text-paper-mute">{e.note}</p>}
                  <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-paper-dim">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {e.tags.map((t) => (
                      <span key={t} className="rounded-md bg-ink-800 px-2 py-0.5 text-[12px] font-medium text-paper-dim">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
