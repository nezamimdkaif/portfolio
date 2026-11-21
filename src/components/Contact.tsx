"use client";

import { profile } from "@/lib/data";
import { getAssetPath } from "@/utils";
import GitHubLive from "./GitHubLive";
import { Reveal, SectionHead } from "./ui";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-page px-4 py-20 md:px-6">
      <SectionHead index="05" title="Contact" />
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <p className="text-2xl font-light leading-snug text-paper">Open to robotics, ROS 2 and UAV autonomy internships.</p>
          <p className="mt-5 space-y-1 text-sm text-paper-dim">
            <a href={`mailto:${profile.email}`} className="block text-paper underline decoration-ink-600 underline-offset-4 hover:text-signal">
              {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block hover:text-signal">LinkedIn</a>
            <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="block hover:text-signal">Resume (PDF)</a>
            <span className="block text-paper-mute">{profile.location}</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <GitHubLive />
        </Reveal>
      </div>
    </section>
  );
}
