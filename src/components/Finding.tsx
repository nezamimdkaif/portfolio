"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { loopClosure } from "@/lib/data";
import { getAssetPath } from "@/utils";

/* Scroll-driven story: the section pins while you scroll through three steps.
   1. the map with loop closure OFF, 2. it turns into the ON map, 3. the numbers. */

const STEPS = [
  {
    k: "Setup",
    t: "Same maze, same route, flown three times per setting.",
    d: "Cartographer 2D SLAM in a Gazebo maze. A Python test pilot flies a fixed route and compares the SLAM pose with ground truth 20 times a second.",
  },
  {
    k: "Loop closure ON",
    t: "The feature meant to remove drift made the map worse.",
    d: "With loop closure on, walls appear twice and slightly rotated. Corridors that look alike seem to be matched to the wrong place.",
  },
  {
    k: "Result",
    t: "Mean error rose from 0.10 m to 0.42 m, in every run.",
    d: "Worst error reached 1.75 m. Next: test stricter match scores and IMU-based checks that reject false loop closures, then repeat on the real drone.",
  },
];

export default function Finding() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(v < 0.33 ? 0 : v < 0.66 ? 1 : 2));

  const onOpacity = useTransform(scrollYProgress, [0.28, 0.42], [0, 1]);
  const offOpacity = useTransform(scrollYProgress, [0.28, 0.42], [1, 0.0]);
  const bars = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const max = 0.6;
  const offWidth = useTransform(bars, (x) => `${(loopClosure.avgOff / max) * 100 * x}%`);
  const onWidth = useTransform(bars, (x) => `${(loopClosure.avgOn / max) * 100 * x}%`);

  return (
    <section id="finding" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden pt-14">
        <div className="mx-auto grid w-full max-w-page items-center gap-10 px-4 md:px-6 gap-y-5 lg:grid-cols-2">
          <div>
            <div className="label mb-3 flex items-center gap-3">
              <span className="text-signal">03</span>
              <span className="h-px w-10 bg-ink-600" />
              <span>Research finding</span>
            </div>
            <div className="mb-6 flex gap-2">
              {STEPS.map((s, i) => (
                <span key={s.k} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-signal" : "bg-ink-700"}`} />
              ))}
            </div>
            <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <p className="font-mono text-xs text-paper-mute">{STEPS[step].k}</p>
              <h2 className="mt-2 text-2xl font-light leading-snug text-paper md:text-4xl">{STEPS[step].t}</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper-dim md:mt-4 md:text-base">{STEPS[step].d}</p>
            </motion.div>

            <motion.div style={{ opacity: bars }} className="mt-5 max-w-lg space-y-3 md:mt-8">
              {[
                { label: "Loop closure OFF", v: loopClosure.avgOff, runs: loopClosure.runs.map((r) => r.off), color: "bg-mint", w: offWidth },
                { label: "Loop closure ON", v: loopClosure.avgOn, runs: loopClosure.runs.map((r) => r.on), color: "bg-signal", w: onWidth },
              ].map((b) => (
                <div key={b.label}>
                  <div className="mb-1 flex justify-between font-mono text-[11px] text-paper-mute">
                    <span>{b.label}</span>
                    <span className="text-paper">{b.v.toFixed(2)} m mean</span>
                  </div>
                  <div className="relative h-2.5 rounded-full bg-ink-800">
                    <motion.div className={`h-full rounded-full ${b.color}`} style={{ width: b.w }} />
                    {b.runs.map((r, i) => (
                      <span
                        key={i}
                        title={`run ${i + 1}: ${r.toFixed(3)} m`}
                        className="absolute top-1/2 h-3.5 w-px -translate-y-1/2 bg-paper/70"
                        style={{ left: `${(r / max) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <p className="font-mono text-[10px] text-paper-mute">Bars: mean of 3 runs. Ticks: each run. Scale 0 - 0.6 m.</p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="panel blueprint relative mx-auto aspect-square w-[min(15rem,55vw)] overflow-hidden p-6 lg:w-full lg:max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img style={{ opacity: offOpacity }} src={getAssetPath("/img/lc-off.png")} alt="SLAM map with loop closure off: straight, square walls" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] object-contain [image-rendering:pixelated]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img style={{ opacity: onOpacity }} src={getAssetPath("/img/lc-on.png")} alt="SLAM map with loop closure on: doubled, rotated walls" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)] object-contain [image-rendering:pixelated]" />
            </div>
            <p className="mt-2 text-center font-mono text-[10px] text-paper-mute md:mt-3 md:text-[11px]">
              {step === 0 ? "Map with loop closure OFF: walls straight and square" : "Map with loop closure ON: doubled, rotated walls"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
