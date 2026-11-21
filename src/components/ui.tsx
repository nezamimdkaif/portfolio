"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ index, title, heading, lead }: { index: string; title: string; heading?: string; lead?: string }) {
  return (
    <Reveal className="mb-10 md:mb-12">
      <div className="label mb-3 flex items-center gap-3">
        <span className="text-signal">{index}</span>
        <motion.span className="h-px bg-signal/70" initial={{ width: 0 }} whileInView={{ width: 40 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
        <span>{title}</span>
      </div>
      {heading && <h2 className="text-3xl font-semibold tracking-tight text-paper md:text-4xl">{heading}</h2>}
      {lead && <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-paper-dim">{lead}</p>}
    </Reveal>
  );
}
