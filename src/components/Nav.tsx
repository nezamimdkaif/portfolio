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

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: "-45% 0px -50% 0px",
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 md:px-6">
        <a href="#top" className="text-sm font-medium tracking-wide text-paper">
          {profile.name}
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
          {sections.slice(1).map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`text-sm transition-colors ${active === s.id ? "text-signal" : "text-paper-dim hover:text-paper"}`}>
              {s.label}
            </a>
          ))}
          <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="text-sm text-paper-dim hover:text-paper">
            Resume
          </a>
        </nav>
        <button className="p-2 text-paper md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <motion.div className="h-px origin-left bg-signal/70" style={{ scaleX: progress }} />
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
