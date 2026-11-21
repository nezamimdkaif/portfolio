"use client";

import { experience, skills } from "@/lib/data";
import { Reveal, SectionHead } from "./ui";

export default function Experience() {
  return (
    <section id="work" className="mx-auto max-w-page px-4 py-20 md:px-6">
      <SectionHead index="03" title="Experience" />
      <div className="divide-y divide-ink-700/70">
        {experience.map((e) => (
          <Reveal key={e.role}>
            <article className="grid gap-2 py-8 md:grid-cols-[11rem_1fr] md:gap-10">
              <p className="font-mono text-[13px] leading-7 text-paper-mute">{e.period}</p>
              <div>
                <h3 className="text-lg font-medium text-paper">{e.role}</h3>
                <p className="text-paper-dim">{e.org}</p>
                {e.note && <p className="mt-0.5 text-[15px] italic text-paper-mute">{e.note}</p>}
                <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-paper-dim">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-paper-mute" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12">
          <h3 className="label mb-4">Skills</h3>
          <dl className="grid gap-x-10 gap-y-3 text-[15px] md:grid-cols-2">
            {skills.map((s) => (
              <div key={s.area} className="grid grid-cols-[9.5rem_1fr] gap-3">
                <dt className="text-paper-mute">{s.area}</dt>
                <dd className="text-paper-dim">{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}
