"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { profile } from "@/lib/data";

type Repo = { name: string; description: string | null; html_url: string; language: string | null; pushed_at: string; fork: boolean };

const FALLBACK: Repo[] = [
  {
    name: "drone-slam-simulator",
    description: "2D LiDAR SLAM (Cartographer) for a quadrotor in a GPS-denied Gazebo maze | ROS 2 Jazzy, Python, web dashboard",
    html_url: "https://github.com/nezamimdkaif/drone-slam-simulator",
    language: "Python",
    pushed_at: "2026-11-21T00:00:00Z",
    fork: false,
  },
];

function ago(iso: string) {
  const d = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d} days ago`;
  const m = Math.round(d / 30);
  return `${m} month${m > 1 ? "s" : ""} ago`;
}

export default function GitHubLive() {
  const [repos, setRepos] = useState<Repo[] | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${profile.githubUser}/repos?sort=pushed&per_page=10`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Repo[]) => {
        const list = data.filter((r) => !r.fork && r.name !== profile.githubUser && r.name !== "portfolio").slice(0, 4);
        setRepos(list.length ? list : FALLBACK);
      })
      .catch(() => setRepos(FALLBACK));
  }, []);

  return (
    <div className="rounded-lg border border-ink-700 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-paper">
          <Github size={16} />
          <span className="font-mono text-xs">github.com/{profile.githubUser}</span>
        </div>
        <span className="flex items-center gap-2 font-mono text-[11.5px] text-paper-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> live
        </span>
      </div>
      <div className="mt-4 divide-y divide-ink-700">
        {repos === null && <p className="py-3 text-sm text-paper-mute">Loading latest repositories…</p>}
        {repos?.map((r) => (
          <a key={r.name} href={r.html_url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-paper group-hover:text-signal">{r.name}</p>
              {r.description && <p className="mt-0.5 text-xs leading-relaxed text-paper-mute">{r.description}</p>}
            </div>
            <div className="shrink-0 text-right font-mono text-[11.5px] text-paper-mute">
              <div>{r.language ?? ""}</div>
              <div>updated {ago(r.pushed_at)}</div>
            </div>
          </a>
        ))}
      </div>
      <a href={profile.github} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 font-mono text-[12.5px] text-paper-mute hover:text-paper">
        All repositories <ArrowUpRight size={12} />
      </a>
    </div>
  );
}
