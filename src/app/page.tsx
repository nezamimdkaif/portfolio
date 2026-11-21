import SpaceBackground from "@/components/SpaceBg";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Finding from "@/components/Finding";
import Experience from "@/components/Experience";
import Docs from "@/components/Docs";
import Contact from "@/components/Contact";
import { profile } from "@/lib/data";

export default function Home() {
  return (
    <>
      <SpaceBackground />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Finding />
        <Experience />
        <Docs />
        <Contact />
      </main>
      <footer className="border-t border-ink-700/60">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-8 font-mono text-[11.5px] leading-relaxed text-paper-mute md:flex-row md:justify-between md:px-6">
          <span>© 2026 {profile.name}</span>
          <span>
            Perseverance 3D model NASA/JPL-Caltech · Milky Way ESO/S. Brunier (CC BY 4.0) · Galaxies NASA, ESA, Hubble Heritage (M101 CC BY 4.0)
          </span>
        </div>
      </footer>
    </>
  );
}
