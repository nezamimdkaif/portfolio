"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile, sections } from "@/lib/data";
import { getAssetPath } from "@/utils";

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => scrollYProgress.on("change", (v) => setPct(Math.round(v * 100))), [scrollYProgress]);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const idx = Math.max(0, sections.findIndex((s) => s.id === active));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-700/70 bg-ink-950/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 md:px-6">
        <a href="#top" className="font-mono text-sm tracking-wide text-paper">
          MKN<span className="text-signal">.</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
          {sections.slice(1).map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`text-sm transition-colors ${active === s.id ? "text-paper" : "text-paper-mute hover:text-paper-dim"}`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] text-paper-mute lg:inline">
            SEC {String(idx).padStart(2, "0")} · {sections[idx].label.toUpperCase()} · {String(pct).padStart(3, "0")}%
          </span>
          <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="btn btn-primary hidden py-1.5 sm:inline-flex">
            Resume
          </a>
          <button className="p-2 text-paper md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <motion.div className="h-px origin-left bg-signal" style={{ scaleX: progress }} />

      {open && (
        <nav className="border-t border-ink-700 bg-ink-950 px-4 py-3 md:hidden" aria-label="Sections">
          {sections.slice(1).map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)} className="block py-2 text-paper-dim">
              {s.label}
            </a>
          ))}
          <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="block py-2 text-signal">
            Resume (PDF)
          </a>
        </nav>
      )}
    </header>
  );
}
