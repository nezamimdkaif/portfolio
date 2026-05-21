"use client";

import { useState, useEffect } from "react";
import { Menu, X, Terminal, Cpu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          ? "bg-background-dark/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="font-display font-black text-2xl tracking-wider text-accent-cyan flex items-center gap-2 group">
              <span className="bg-accent-cyan/15 p-1.5 rounded-lg border border-accent-cyan/20 group-hover:border-accent-cyan/50 transition-all duration-300">
                MKN
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-6 border-r border-white/10 pr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-gray-300 hover:text-accent-cyan transition-all duration-200 text-sm font-medium ${
                    isLinkActive(link.href) ? "text-accent-cyan font-bold text-glow" : ""
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
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-accent-cyan/40 hover:text-accent-cyan"
                    }`}
                  >
                    <Icon size={14} className={active ? "animate-pulse" : ""} />
                    {page.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-accent-cyan transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-dark/98 backdrop-blur-md border-b border-white/10">
          <div className="px-4 py-6 space-y-4">
            {/* Core Section Links */}
            <div className="space-y-2 border-b border-white/15 pb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-gray-300 hover:text-accent-cyan transition-colors duration-200 text-sm font-medium py-2 ${
                    isLinkActive(link.href) ? "text-accent-cyan font-semibold" : ""
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
