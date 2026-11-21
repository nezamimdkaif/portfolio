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

export function SectionHead({ index, title, lead }: { index: string; title: string; lead?: string }) {
  return (
    <Reveal className="mb-6 md:mb-8">
      <div className="label mb-3 flex items-center gap-3">
        <span className="text-signal">{index}</span>
        <span className="h-px w-10 bg-ink-600" />
        <span>{title}</span>
      </div>
      {lead && <p className="max-w-2xl text-lg font-light leading-snug text-paper-dim">{lead}</p>}
    </Reveal>
  );
}
