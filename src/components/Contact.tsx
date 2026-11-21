"use client";

import { motion } from "framer-motion";
import { FileText, Linkedin, Mail, MapPin } from "lucide-react";
import { profile } from "@/lib/data";
import { getAssetPath } from "@/utils";
import GitHubLive from "./GitHubLive";
import { Magnetic } from "./effects";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-page px-5 py-20 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] px-6 py-12 text-white shadow-xl shadow-blue-900/20 md:px-12 md:py-16"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-blue-100">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Let&apos;s build robots that navigate without GPS.</h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-blue-50">
              I am looking for robotics, ROS 2 and UAV autonomy internships.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic>
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#1d4ed8] shadow-sm transition-colors hover:bg-blue-50">
                  <Mail size={16} /> Email me
                </a>
              </Magnetic>
              <Magnetic>
                <a href={getAssetPath(profile.resume)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  <FileText size={16} /> Resume
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  <Linkedin size={16} /> LinkedIn
                </a>
              </Magnetic>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-blue-100">
              <span>{profile.email}</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {profile.location}
              </span>
            </p>
          </div>
          <div className="rounded-2xl bg-white text-paper shadow-lg">
            <GitHubLive />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
