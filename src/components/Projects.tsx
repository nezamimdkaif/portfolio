"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, type Media, type Project } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { SectionHead } from "./ui";
import { Tilt } from "./effects";

function MediaView({ m }: { m: Media }) {
  const vref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    // load the video only when it is about to scroll into view, play only while visible
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (near) vref.current?.play().catch(() => {});
  }, [near]);
  if (m.kind === "video") {
    return <video ref={vref} src={near ? getAssetPath(m.src) : undefined} muted loop playsInline preload="none" aria-label={m.alt} className="h-full w-full object-cover" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={getAssetPath(m.src)} alt={m.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />;
}

function Card({ p, i }: { p: Project; i: number }) {
  const [k, setK] = useState(0);
  const m = p.media[k];
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.08]"
    >
      <Tilt>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
          <div key={m.src} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
            <MediaView m={m} />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-paper shadow-sm backdrop-blur">{p.kicker}</span>
          {p.media.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {p.media.map((x, j) => (
                <button
                  key={x.src}
                  onClick={() => setK(j)}
                  aria-label={`Show ${x.caption ?? x.alt}`}
                  className={`h-1.5 rounded-full shadow transition-all ${j === k ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white"}`}
                />
              ))}
            </div>
          )}
        </div>
      </Tilt>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold tracking-tight text-paper">{p.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-paper-dim">{p.summary}</p>
        <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-paper-dim">
          {p.points.map((pt) => (
            <li key={pt} className="flex gap-2.5">
              <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="rounded-md bg-blue-50 px-2 py-0.5 text-[12px] font-medium text-blue-700">
              {t}
            </span>
          ))}
        </div>
        {p.links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-4 pt-5">
            {p.links.map((l) => (
              <a key={l.href} href={getAssetPath(l.href)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[14px] font-medium text-signal hover:underline">
                {l.label} <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-page px-5 py-20 md:px-6 md:py-24">
      <SectionHead index="01" title="Projects" heading="Selected work" lead="From a simulated maze to a real map, each step tested and measured." />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Card key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
