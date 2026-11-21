"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import { docs } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { SectionHead } from "./ui";

export default function Docs() {
  return (
    <section id="docs" className="mx-auto max-w-page px-5 py-20 md:px-6 md:py-24">
      <SectionHead index="05" title="Documentation" heading="Reports and manuals" lead="I write down what I build, so others can pick it up and use it." />
      <div className="grid gap-5 md:grid-cols-2">
        {docs.map((d, i) => (
          <motion.a
            key={d.title}
            href={getAssetPath(d.href)}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
            className="group flex gap-4 rounded-2xl border border-ink-700 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.06]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-signal transition-colors group-hover:bg-signal group-hover:text-white">
              <FileText size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12.5px] font-medium uppercase tracking-wide text-signal">{d.type}</p>
                <ArrowUpRight size={18} className="shrink-0 text-paper-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
              </div>
              <h3 className="mt-1 font-semibold leading-snug text-paper">{d.title}</h3>
              <p className="mt-1 text-[13px] text-paper-mute">
                {d.meta} · {d.date}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-paper-dim">{d.inside.join(" · ")}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
