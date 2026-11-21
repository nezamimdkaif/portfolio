"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type Media, type Project } from "@/lib/data";
import { getAssetPath } from "@/utils";
import { Reveal, SectionHead } from "./ui";

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
      { rootMargin: "300px 0px", threshold: 0 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (near) vref.current?.play().catch(() => {});
  }, [near]);
  if (m.kind === "video") {
    return (
      <video
        ref={vref}
        src={near ? getAssetPath(m.src) : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={m.alt}
        className="h-full w-full object-cover"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={getAssetPath(m.src)} alt={m.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />;
}

function Thumb({ media }: { media: Media[] }) {
  const [i, setI] = useState(0);
  const m = media[i];
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-ink-700 bg-ink-900">
        <MediaView key={m.src} m={m} />
      </div>
      {media.length > 1 && (
        <div className="mt-2 flex gap-1.5">
          {media.map((x, k) => (
            <button
              key={x.src}
              onClick={() => setI(k)}
              aria-label={`Show ${x.caption ?? x.alt}`}
              className={`h-1 rounded-full transition-all ${k === i ? "w-5 bg-signal" : "w-2 bg-ink-600 hover:bg-paper-mute"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ p }: { p: Project }) {
  return (
    <Reveal>
      <article className="grid gap-6 py-10 md:grid-cols-[22rem_1fr] md:gap-10">
        <Thumb media={p.media} />
        <div>
          <h3 className="text-xl font-medium text-paper">{p.title}</h3>
          <p className="mt-1 font-mono text-[13px] text-paper-mute">{p.kicker}</p>
          {p.links.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-x-3 text-[15px]">
              {p.links.map((l, i) => (
                <span key={l.href}>
                  <a href={getAssetPath(l.href)} target="_blank" rel="noreferrer" className="text-signal hover:underline">
                    [{l.label}]
                  </a>
                  {i < p.links.length - 1 && " "}
                </span>
              ))}
            </p>
          )}
          <p className="mt-3 leading-relaxed text-paper-dim">{p.summary}</p>
          <ul className="mt-3 space-y-1.5 text-[15px] text-paper-dim">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-2.5">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-paper-mute" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[12.5px] text-paper-mute">{p.tags.join(" · ")}</p>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-page px-4 py-20 md:px-6">
      <SectionHead index="01" title="Projects" />
      <div className="divide-y divide-ink-700/70">
        {projects.map((p) => (
          <Row key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
