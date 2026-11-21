"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { SectionHead } from "./ui";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-page px-4 py-24 md:px-6 md:py-32">
      <SectionHead index="05" title="Skills" lead="Python first, ROS 2 every day, and enough hardware to wire up what I write." />
      <div className="divide-y divide-ink-700 border-y border-ink-700">
        {skills.map((s, i) => (
          <motion.div
            key={s.area}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className="grid gap-3 py-5 md:grid-cols-[14rem_1fr] md:gap-8"
          >
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-paper-mute">{s.area}</h3>
            <div className="flex flex-wrap gap-2">
              {s.items.map((it) => (
                <span key={it} className="rounded-md border border-ink-700 px-2.5 py-1 text-sm text-paper-dim">
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
