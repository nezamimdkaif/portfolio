"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects, type Media, type Project } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { Reveal, SectionHead } from "./ui";

function MediaView({ m }: { m: Media }) {
  const vref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  if (m.kind === "video") {
    return (
      <video ref={vref} src={getAssetPath(m.src)} muted loop playsInline preload="metadata" aria-label={m.alt} className="h-full w-full object-cover" />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={getAssetPath(m.src)} alt={m.alt} loading="lazy" className="h-full w-full object-cover" />;
}

function Gallery({ media }: { media: Media[] }) {
  const [i, setI] = useState(0);
  const m = media[i];
  return (
    <div>
      <div className="panel relative aspect-[16/10] overflow-hidden bg-ink-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={m.src}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <MediaView m={m} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-paper-mute">{m.caption}</p>
        {media.length > 1 && (
          <div className="flex gap-1.5">
            {media.map((x, k) => (
              <button
                key={x.src}
                onClick={() => setI(k)}
                aria-label={`Show ${x.caption ?? x.alt}`}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-signal" : "w-1.5 bg-ink-600 hover:bg-paper-mute"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectRow({ p, flip }: { p: Project; flip: boolean }) {
  return (
    <article className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
      <Reveal className={flip ? "lg:order-2" : ""}>
        <Gallery media={p.media} />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="label">{p.kicker}</p>
        <h3 className="mt-2 text-2xl font-medium text-paper md:text-3xl">{p.title}</h3>
        <p className="mt-4 leading-relaxed text-paper-dim">{p.summary}</p>
        <ul className="mt-5 space-y-2">
          {p.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-sm leading-relaxed text-paper-dim">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
        {p.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.links.map((l) => (
              <a key={l.href} href={getAssetPath(l.href)} target="_blank" rel="noreferrer" className="btn">
                {l.label} <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        )}
      </Reveal>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-page px-4 py-24 md:px-6 md:py-32">
      <SectionHead index="02" title="Projects" lead="From a simulated maze to a real map, with the numbers to back each step." />
      <div className="space-y-24 md:space-y-32">
        {projects.map((p, i) => (
          <ProjectRow key={p.id} p={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
