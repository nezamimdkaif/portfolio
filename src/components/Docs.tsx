"use client";

import { ArrowUpRight } from "lucide-react";
import { docs } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { Reveal, SectionHead } from "./ui";

export default function Docs() {
  return (
    <section id="docs" className="mx-auto max-w-page px-4 py-20 md:px-6">
      <SectionHead index="04" title="Documentation" lead="Reports, manuals and guides I wrote for the work above." />
      <div className="divide-y divide-ink-700/70 border-y border-ink-700/70">
        {docs.map((d) => (
          <Reveal key={d.title}>
            <a href={getAssetPath(d.href)} target="_blank" rel="noreferrer" className="group grid gap-2 py-5 md:grid-cols-[11rem_1fr_auto] md:gap-10">
              <p className="font-mono text-xs leading-6 text-paper-mute">
                {d.date}
                <br className="hidden md:block" />
                <span className="md:hidden"> · </span>
                {d.type}
              </p>
              <div>
                <h3 className="font-medium text-paper transition-colors group-hover:text-signal">{d.title}</h3>
                <p className="mt-0.5 font-mono text-[11px] text-paper-mute">{d.meta}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{d.inside.join(" · ")}</p>
              </div>
              <ArrowUpRight size={18} className="hidden text-paper-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal md:block" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
