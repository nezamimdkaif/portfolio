"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Cpu, Terminal, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: pathname === "/" ? "#home" : "/" },
    { name: "About", href: pathname === "/" ? "#about" : "/#about" },
    { name: "Resume", href: pathname === "/" ? "#resume" : "/#resume" },
    { name: "Portfolio", href: pathname === "/" ? "#portfolio" : "/#portfolio" },
    { name: "Contact", href: pathname === "/" ? "#contact" : "/#contact" },
  ];

  const subPages = [
    { name: "Robotics Lab", href: "/projects", icon: Cpu },
    { name: "UAV Terminal", href: "/terminal", icon: Terminal },
    { name: "Drone Showcase", href: "/drone", icon: Settings },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || pathname !== "/"
          ? "bg-[#0a0a0a]/90 border-b border-white/5 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo Brand Wordmark */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-display font-black text-2xl tracking-wider text-white hover:text-accent-coral transition-colors duration-300">
              MKN<span className="text-accent-coral">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-accent-coral text-sm font-semibold tracking-wide transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}

            {/* Dropdown Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-gray-300 hover:text-accent-coral text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer">
                Dropdown
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 w-52 pt-2 animate-fadeIn z-50">
                  <div className="bg-[#1c1c1c] border border-white/5 rounded-xl shadow-2xl py-2">
                    {subPages.map((page) => {
                      const Icon = page.icon;
                      return (
                        <Link
                          key={page.name}
                          href={page.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-accent-coral/10 transition-colors duration-200"
                        >
                          <Icon size={16} className="text-accent-coral" />
                          {page.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Get Started Coral Button */}
            <a
              href="#contact"
              className="bg-accent-coral hover:bg-accent-coral/90 text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-[0_4px_20px_rgba(251,58,93,0.3)] hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu & Dropdown Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-accent-coral transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 border-b border-white/5 backdrop-blur-lg animate-slideDown z-50">
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-accent-coral text-base font-semibold transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}

            {/* Subpages inside mobile menu */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Projects & Labs</p>
              {subPages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.name}
                    href={page.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-white py-1 transition-colors duration-200"
                  >
                    <Icon size={16} className="text-accent-coral" />
                    {page.name}
                  </Link>
                );
              })}
            </div>

            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center bg-accent-coral hover:bg-accent-coral/90 text-white py-3 rounded-full text-base font-bold transition-all duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
