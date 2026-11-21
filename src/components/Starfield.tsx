"use client";

import { useEffect, useRef } from "react";

/* Sparse, slow starfield behind the whole page. Stars sit at three depths and
   shift with scroll (parallax), so the page feels like it is moving through space
   without anything flashing. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: { x: number; y: number; z: number; r: number; tw: number }[] = [];
    let raf = 0;

    const seed = (n: number) => {
      // deterministic pseudo-random so the sky is the same on every visit
      let t = n;
      return () => {
        t = (t * 9301 + 49297) % 233280;
        return t / 233280;
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const rnd = seed(42);
      const count = Math.round((w * h) / 9000);
      stars = Array.from({ length: count }, () => {
        const z = rnd() < 0.7 ? 0.15 : rnd() < 0.8 ? 0.35 : 0.7;
        return { x: rnd() * w, y: rnd() * h * 3, z, r: 0.4 + z * 0.9, tw: rnd() * Math.PI * 2 };
      });
    };

    const draw = (t: number) => {
      const sy = window.scrollY;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const y = (((s.y - sy * s.z * 0.35) % (h * 3)) + h * 3) % (h * 3);
        if (y > h) continue;
        const a = 0.35 + s.z * 0.5 + (reduce ? 0 : Math.sin(t / 1600 + s.tw) * 0.12);
        ctx.fillStyle = s.z > 0.5 ? `rgba(255,214,190,${a})` : `rgba(236,232,225,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
