"use client";

import { useState, useEffect } from "react";
import { Menu, X, Terminal, Cpu, Settings, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const pathname = usePathname();

  // Load and apply theme from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightTheme(true);
      document.documentElement.classList.add("light-theme");
    } else {
      setIsLightTheme(false);
      document.documentElement.classList.remove("light-theme");
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsLightTheme(prev => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add("light-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.remove("light-theme");
        localStorage.setItem("theme", "dark");
      }
      return nextTheme;
    });
  };

  const navLinks = [
    { name: "Home", href: pathname === "/" ? "#home" : "/" },
    { name: "About", href: pathname === "/" ? "#about" : "/#about" },
    { name: "Skills", href: pathname === "/" ? "#skills" : "/#skills" },
    { name: "Achievements", href: pathname === "/" ? "#achievements" : "/#achievements" },
    { name: "Contact", href: pathname === "/" ? "#contact" : "/#contact" },
  ];

  const subPages = [
    { name: "Robotics Lab", href: "/projects", icon: Cpu },
    { name: "UAV Terminal", href: "/terminal", icon: Terminal },
    { name: "Drone Showcase", href: "/drone", icon: Settings },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/projects" && pathname === "/projects") return true;
    if (href === "/terminal" && pathname === "/terminal") return true;
    if (href === "/" && pathname === "/") return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || pathname !== "/"
          ? isLightTheme
            ? "bg-slate-50/95 backdrop-blur-md border-b border-slate-200"
            : "bg-background-dark/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="font-display font-black text-2xl tracking-wider text-accent-cyan flex items-center gap-2 group">
              <span className={`p-1.5 rounded-lg border transition-all duration-300 ${
                isLightTheme
                  ? "bg-accent-cyan/10 border-accent-cyan/20 group-hover:border-accent-cyan/40"
                  : "bg-accent-cyan/15 border-accent-cyan/20 group-hover:border-accent-cyan/50"
              }`}>
                MKN
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className={`flex items-center space-x-6 border-r pr-6 ${
              isLightTheme ? "border-slate-200" : "border-white/10"
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-all duration-200 text-sm font-semibold ${
                    isLightTheme
                      ? isLinkActive(link.href)
                        ? "text-accent-cyan font-bold text-glow"
                        : "text-slate-700 hover:text-accent-cyan"
                      : isLinkActive(link.href)
                        ? "text-accent-cyan font-bold text-glow"
                        : "text-gray-300 hover:text-accent-cyan"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Custom Subpage buttons with extra high-tech flare */}
            <div className="flex items-center space-x-4">
              {subPages.map((page) => {
                const Icon = page.icon;
                const active = isLinkActive(page.href);
                return (
                  <Link
                    key={page.name}
                    href={page.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
                      active
                        ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                        : isLightTheme
                          ? "bg-slate-100 border-slate-200 text-slate-700 hover:border-accent-cyan/40 hover:text-accent-cyan"
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-accent-cyan/40 hover:text-accent-cyan"
                    }`}
                  >
                    <Icon size={14} className={active ? "animate-pulse" : ""} />
                    {page.name}
                  </Link>
                );
              })}

              {/* High-tech Space vs Lab Theme Switcher */}
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-mono border transition-all duration-300 cursor-pointer select-none ${
                  isLightTheme
                    ? "border-accent-cyan/40 bg-accent-cyan/5 text-accent-cyan hover:bg-accent-cyan/10"
                    : "border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan hover:bg-accent-cyan/15 hover:shadow-[0_0_15px_rgba(0,212,255,0.25)]"
                }`}
                title="Toggle GCS Environment"
              >
                {isLightTheme ? (
                  <>
                    <Sun size={14} className="animate-spin text-amber-500" style={{ animationDuration: '8s' }} />
                    <span>GCS: LIGHT MODE</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="animate-pulse text-accent-cyan" />
                    <span>GCS: DARK MODE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu & Theme toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 border rounded-xl transition-all duration-200 select-none ${
                isLightTheme
                  ? "border-accent-cyan/35 bg-accent-cyan/5 text-accent-cyan"
                  : "border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan"
              }`}
              title="Toggle theme"
            >
              {isLightTheme ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-colors ${
                isLightTheme ? "text-slate-700 hover:text-accent-cyan" : "text-gray-300 hover:text-accent-cyan"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={`md:hidden backdrop-blur-md border-b ${
          isLightTheme
            ? "bg-slate-50/98 border-slate-200"
            : "bg-background-dark/98 border-white/10"
        }`}>
          <div className="px-4 py-6 space-y-4">
            {/* Core Section Links */}
            <div className={`space-y-2 border-b pb-4 ${
              isLightTheme ? "border-slate-200" : "border-white/15"
            }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block transition-colors duration-200 text-sm font-semibold py-2 ${
                    isLightTheme
                      ? isLinkActive(link.href)
                        ? "text-accent-cyan"
                        : "text-slate-700 hover:text-accent-cyan"
                      : isLinkActive(link.href)
                        ? "text-accent-cyan"
                        : "text-gray-300 hover:text-accent-cyan"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Special Subpages */}
            <div className="space-y-2.5">
              {subPages.map((page) => {
                const Icon = page.icon;
                const active = isLinkActive(page.href);
                return (
                  <Link
                    key={page.name}
                    href={page.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                      active
                        ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan"
                        : isLightTheme
                          ? "bg-slate-100 border-slate-200 text-slate-700"
                          : "bg-white/5 border-white/10 text-gray-300"
                    }`}
                  >
                    <Icon size={16} />
                    {page.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
