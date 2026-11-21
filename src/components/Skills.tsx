"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Eye, Wrench, Network, Rocket } from "lucide-react";
import { skills } from "@/lib/data";
import { SectionHead } from "./ui";

const ICONS = [Code2, Network, Eye, Rocket, Cpu, Wrench];

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-page px-5 py-20 md:px-6 md:py-24">
      <SectionHead index="04" title="Skills" heading="Tools I use" lead="Python first, ROS 2 every day, and enough hardware to wire up what I write." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={s.area}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-ink-700 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.06]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-signal transition-colors group-hover:bg-signal group-hover:text-white">
                  <Icon size={19} />
                </span>
                <h3 className="font-semibold text-paper">{s.area}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span key={it} className="rounded-md border border-ink-700 bg-ink-900 px-2.5 py-1 text-[13px] text-paper-dim">
                    {it}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
