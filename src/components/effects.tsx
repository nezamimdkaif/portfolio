"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Soft blue light that follows the cursor, behind the content. Disabled on touch
   screens and for reduced motion. */
export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 22 });
  const sy = useSpring(y, { stiffness: 120, damping: 22 });
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-[5] h-[520px] w-[520px] rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.04) 35%, rgba(59,130,246,0) 70%)",
      }}
    />
  );
}

/* Button that leans a few pixels towards the cursor. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* Card that tilts in 3D towards the cursor and glows at the edge. */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 20 });
  const ry = useSpring(0, { stiffness: 180, damping: 20 });
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false });
  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * 10);
          rx.set(-(py - 0.5) * 8);
          setGlow({ x: px * 100, y: py * 100, on: true });
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
          setGlow((g) => ({ ...g, on: false }));
        }}
        className="relative"
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300"
          style={{
            opacity: glow.on ? 1 : 0,
            boxShadow: "0 0 0 1px rgba(59,130,246,0.55), 0 18px 50px -12px rgba(59,130,246,0.35)",
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.10), rgba(255,255,255,0) 45%)`,
          }}
        />
      </motion.div>
    </div>
  );
}

/* Name that rises in letter by letter on load. */
export function RevealText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: "0.4em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
