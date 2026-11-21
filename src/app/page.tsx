import Starfield from "@/components/Starfield";
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
      <Starfield />
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
        <div className="mx-auto max-w-page px-4 py-8 font-mono text-[11px] text-paper-mute md:px-6">
          © 2026 {profile.name}
        </div>
      </footer>
    </>
  );
}
