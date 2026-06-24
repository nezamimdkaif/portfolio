"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] border-t border-white/5 text-gray-400 py-16 px-6 sm:px-8 lg:px-12 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        
        {/* Column 1: Brand Wordmark + Tagline + Socials */}
        <div className="space-y-5">
          <h3 className="font-display font-black text-2xl text-white">
            MKN<span className="text-accent-coral">.</span>
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-xs">
            Designing and building the next generation of autonomous flight systems, embedded sensors interface, and hardware control systems.
          </p>
          <div className="flex gap-3">
            {[
              { icon: Twitter, url: "https://x.com/Nezamimd7" },
              { icon: Instagram, url: "https://instagram.com/nezamimdkaif" },
              { icon: Linkedin, url: "https://linkedin.com/in/md-kaif-nezami-029507313" }
            ].map((soc, idx) => {
              const Icon = soc.icon;
              return (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-accent-coral flex items-center justify-center hover:bg-accent-coral/10 transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Useful Links */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-5 uppercase tracking-wider text-xs">
            Useful Links
          </h4>
          <ul className="space-y-3 text-xs sm:text-sm">
            {[
              { name: "Home", href: "#home" },
              { name: "About", href: "#about" },
              { name: "Resume", href: "#resume" },
              { name: "Portfolio", href: "#portfolio" },
              { name: "Contact", href: "#contact" }
            ].map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="hover:text-accent-coral transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Us */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-white text-base mb-5 uppercase tracking-wider text-xs">
            Contact Us
          </h4>
          <ul className="space-y-3.5 text-xs sm:text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-accent-coral flex-shrink-0" />
              <span>Dhanbad, Jharkhand, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-accent-coral flex-shrink-0" />
              <a href="tel:9801615695" className="hover:text-white transition-colors">
                +91 9801615695
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-accent-coral flex-shrink-0" />
              <a href="mailto:mdkaif.ece24@bitsindri.ac.in" className="hover:text-white transition-colors break-all">
                mdkaif.ece24@bitsindri.ac.in
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 text-center text-xs text-gray-500">
        <p>© {currentYear} MKN Portfolio. Designed for Md Kaif Nezami. All rights reserved.</p>
      </div>
    </footer>
  );
}
