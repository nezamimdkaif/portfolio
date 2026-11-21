import Starfield from "@/components/Starfield";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Finding from "@/components/Finding";
import Docs from "@/components/Docs";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { profile } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Finding />
        <Docs />
        <Skills />
        <Contact />
      </main>
      <footer className="border-t border-ink-700">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-8 font-mono text-[11px] text-paper-mute md:flex-row md:justify-between md:px-6">
          <span>© 2026 {profile.name}</span>
          <span>Built with Next.js · deployed on GitHub Pages</span>
        </div>
      </footer>
    </>
  );
}
