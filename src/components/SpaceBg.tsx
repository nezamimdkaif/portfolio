"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getAssetPath } from "@/utils";

const SpaceBackground = dynamic(() => import("./SpaceBackground"), { ssr: false });

/*
 * Desktop: full WebGL space (stars, galaxies, flying forward on scroll), started when idle.
 * Phones / tablets: a light static sky (Milky Way photo + CSS stars with a slow GPU drift),
 * so the only WebGL scene on a phone is the drone. Much smoother scrolling.
 */
export default function SpaceBg() {
  const [mode, setMode] = useState<"none" | "lite" | "full">("none");
  useEffect(() => {
    const small = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
    if (small) {
      setMode("lite");
      return;
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setMode("full"), { timeout: 1200 });
    else {
      const t = window.setTimeout(() => setMode("full"), 400);
      return () => window.clearTimeout(t);
    }
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 bg-[#050507]" />
      {mode === "full" && <SpaceBackground />}
      {mode === "lite" && (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
          <div
            className="absolute -inset-[10%] opacity-[0.32] motion-safe:animate-[skydrift_90s_linear_infinite_alternate]"
            style={{
              backgroundImage: `url(${getAssetPath("/space/milkyway.jpg")})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "rotate(-28deg) scale(1.25)",
            }}
          />
          <div className="stars-sm absolute inset-0 motion-safe:animate-[twinkle_6s_ease-in-out_infinite_alternate]" />
          <div className="stars-lg absolute inset-0 motion-safe:animate-[twinkle_9s_ease-in-out_infinite_alternate-reverse]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,5,7,0.35), rgba(5,5,7,0.7) 40%, rgba(5,5,7,0.75))" }} />
        </div>
      )}
    </>
  );
}
