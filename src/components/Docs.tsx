"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { docs } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { SectionHead } from "./ui";

export default function Docs() {
  return (
    <section id="docs" className="mx-auto max-w-page px-4 py-24 md:px-6 md:py-32">
      <SectionHead
        index="04"
        title="Documentation"
        lead="I write down what I build: reports, manuals and guides that someone else can pick up and use."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((d, i) => (
          <motion.a
            key={d.title}
            href={getAssetPath(d.href)}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
            className={`panel group relative flex flex-col p-6 transition-colors hover:border-ink-600 hover:bg-ink-800/80 ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-600 text-signal">
                  <FileText size={16} />
                </span>
                <div>
                  <p className="label">{d.type}</p>
                  <p className="font-mono text-[11px] text-paper-mute">{d.date}</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-paper-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
            </div>
            <h3 className="mt-5 text-lg font-medium leading-snug text-paper">{d.title}</h3>
            <p className="mt-1 font-mono text-[11px] text-paper-mute">{d.meta}</p>
            <ul className={`mt-4 grid gap-1.5 ${i === 0 ? "md:grid-cols-2" : ""}`}>
              {d.inside.map((x) => (
                <li key={x} className="flex gap-2 text-sm text-paper-dim">
                  <span className="text-paper-mute">-</span>
                  {x}
                </li>
              ))}
            </ul>
            {d.source && (
              <span className="mt-4 font-mono text-[11px] text-paper-mute">
                Source and code on GitHub
              </span>
            )}
          </motion.a>
        ))}
      </div>
    </section>
  );
}
