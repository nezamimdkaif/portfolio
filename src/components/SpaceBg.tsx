"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SpaceBackground = dynamic(() => import("./SpaceBackground"), { ssr: false });

// Start the WebGL background only after the page has painted and the browser is idle,
// so the text appears instantly and scrolling never stutters on load.
export default function SpaceBg() {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setGo(true), { timeout: 1200 });
    else {
      const t = window.setTimeout(() => setGo(true), 400);
      return () => window.clearTimeout(t);
    }
  }, []);
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 bg-[#050507]" />
      {go && <SpaceBackground />}
    </>
  );
}
