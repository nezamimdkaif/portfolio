"use client";

import { profile } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { Reveal } from "./ui";

export default function About() {
  return (
    <section className="mx-auto max-w-page px-4 pb-8 pt-24 md:px-6 md:pt-32">
      <div className="grid items-center gap-10 md:grid-cols-[16rem_1fr]">
        <Reveal>
          <div className="relative mx-auto w-48 md:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getAssetPath(profile.portrait)} alt={`Portrait of ${profile.name}`} className="aspect-[4/5] w-full rounded-xl border border-ink-700 object-cover grayscale-[35%]" />
            <span className="absolute -bottom-3 left-4 rounded border border-ink-600 bg-ink-950 px-2 py-0.5 font-mono text-[10px] text-paper-mute">
              BIT Sindri · ECE · 2028
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="label mb-4">About</p>
          <p className="text-xl font-light leading-relaxed text-paper md:text-2xl">
            I started with a ground station for an ISRO competition and got curious about the autonomy side. Since then my work has been about one
            question: <span className="text-signal">how does a small robot know where it is when GPS is not there?</span>
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-paper-dim">
            I test ideas in simulation first, measure them against ground truth, and then move them to the real drone. When something fails, I write down why.
            The reports and manuals below are part of the work, not an afterthought.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
