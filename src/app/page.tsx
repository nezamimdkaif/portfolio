import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Finding from "@/components/Finding";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Docs from "@/components/Docs";
import Contact from "@/components/Contact";
import { profile } from "@/lib/data";
import { CursorGlow } from "@/components/effects";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <div className="border-y border-ink-700 bg-ink-900">
          <Finding />
        </div>
        <Experience />
        <div className="border-y border-ink-700 bg-ink-900">
          <Skills />
        </div>
        <Docs />
        <Contact />
      </main>
      <footer className="border-t border-ink-700">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-5 py-8 text-[13px] text-paper-mute md:flex-row md:justify-between md:px-6">
          <span>© 2026 {profile.name}</span>
          <span>Perseverance 3D model: NASA/JPL-Caltech</span>
        </div>
      </footer>
    </>
  );
}
