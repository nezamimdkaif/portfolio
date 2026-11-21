"use client";

import { useState } from "react";
import { Linkedin, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { profile } from "@/lib/data";
import GitHubLive from "./GitHubLive";
import { Reveal, SectionHead } from "./ui";

export default function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!key) {
      window.location.href = `mailto:${profile.email}`;
      return;
    }
    setState("sending");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: key, subject: `Portfolio message from ${data.name}`, from_name: "Portfolio", ...data }),
      });
      const json = await res.json();
      if (json.success) {
        setState("sent");
        form.reset();
      } else setState("error");
    } catch {
      setState("error");
    }
  }

  const input =
    "w-full rounded-md border border-ink-700 bg-ink-950 px-3 py-2.5 text-sm text-paper placeholder:text-paper-mute focus:border-paper-mute focus:outline-none";

  return (
    <section id="contact" className="mx-auto max-w-page px-4 py-24 md:px-6 md:py-32">
      <SectionHead index="06" title="Contact" lead="Looking for robotics, ROS 2 and UAV autonomy internships. Happy to talk." />

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <form onSubmit={submit} className="panel space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label mb-1.5 block">Name</span>
                <input name="name" required className={input} placeholder="Your name" />
              </label>
              <label className="block">
                <span className="label mb-1.5 block">Email</span>
                <input name="email" type="email" required className={input} placeholder="you@company.com" />
              </label>
            </div>
            <label className="block">
              <span className="label mb-1.5 block">Message</span>
              <textarea name="message" required rows={5} className={input} placeholder="Role, team, or what you would like to discuss" />
            </label>
            <div className="flex items-center gap-4">
              <button type="submit" disabled={state === "sending"} className="btn btn-primary disabled:opacity-60">
                {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Send message
              </button>
              <p className="text-sm text-paper-mute" aria-live="polite">
                {state === "sent" && "Thanks, I will reply soon."}
                {state === "error" && `Could not send. Please email ${profile.email}.`}
              </p>
            </div>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          <div className="panel space-y-3 p-6 text-sm">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-paper-dim hover:text-paper">
              <Mail size={16} className="text-signal" /> {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-paper-dim hover:text-paper">
              <Linkedin size={16} className="text-signal" /> linkedin.com/in/md-kaif-nezami
            </a>
            <p className="flex items-center gap-3 text-paper-dim">
              <MapPin size={16} className="text-signal" /> {profile.location}
            </p>
          </div>
          <GitHubLive />
        </Reveal>
      </div>
    </section>
  );
}
