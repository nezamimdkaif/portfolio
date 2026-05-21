"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  GitFork,
  BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAssetPath } from "@/utils";

interface GitHubStats {
  user: {
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    avatar_url: string;
    html_url: string;
  };
  repos: Array<{
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    html_url: string;
  }>;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  
  // GitHub Dynamic Stats States
  const [githubData, setGithubData] = useState<GitHubStats | null>(null);
  const [githubLoading, setGithubLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const response = await fetch(getAssetPath("/api/github"));
        if (response.ok) {
          const data = await response.json();
          setGithubData(data);
          setGithubLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch github stats dynamically, using local cache fallback.", err);
      }
      
      // Local fallback sync card for static environments (GitHub Pages)
      setGithubData({
        user: {
          name: "Md Kaif Nezami",
          bio: "Embedded Systems & Robotics Engineer | B.Tech ECE Student at BIT Sindri | ISRO IROC 2026 Hardware Lead",
          public_repos: 4,
          followers: 5,
          following: 12,
          avatar_url: "https://github.com/nezamimdkaif.png",
          html_url: "https://github.com/nezamimdkaif"
        },
        repos: [
          {
            name: "ISRO-IROC-2026",
            description: "Subsystem design and hardware docking control integration code for the ISRO IROC UAV Docking Challenge.",
            stargazers_count: 2,
            forks_count: 1,
            language: "C++",
            html_url: "https://github.com/nezamimdkaif/ISRO-IROC-2026"
          },
          {
            name: "uav-hexacopter-flight",
            description: "OrangeCube configuration, PID tuning files, and waypoint mission planning configurations.",
            stargazers_count: 1,
            forks_count: 0,
            language: "C",
            html_url: "https://github.com/nezamimdkaif/uav-hexacopter-flight"
          },
          {
            name: "payload-camera-transmission",
            description: "Lightweight camera module controller with ESP32-CAM and wireless video data transmission code.",
            stargazers_count: 1,
            forks_count: 0,
            language: "Python",
            html_url: "https://github.com/nezamimdkaif/payload-camera-transmission"
          }
        ]
      });
      setGithubLoading(false);
    }
    fetchGitHubData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setStatusMessage("");

    try {
      // Web3Forms: Works on static sites (GitHub Pages) with no backend needed.
      // Sends the message directly to mdkaif.ece24@bitsindri.ac.in via Web3Forms relay.
      const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      
      if (!web3formsKey) {
        throw new Error("Web3Forms key not configured");
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `📬 New Portfolio Message from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: "MKN Portfolio Contact Form",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormState("success");
        setStatusMessage("✅ Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.warn("Web3Forms unavailable:", error);
      // Hard fallback: open mail client directly
      const subject = encodeURIComponent(`Portfolio Message from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.open(`mailto:mdkaif.ece24@bitsindri.ac.in?subject=${subject}&body=${body}`, "_blank");
      setFormState("success");
      setStatusMessage("Your email client has been opened with your message pre-filled. Please send it to complete your submission.");
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Dynamic background cyan glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-12 text-center">
            Get In <span className="text-accent-cyan">Touch</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact info & Live GitHub stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Contacts */}
            <div className="grid sm:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ y: -3 }}
                className="glass-card p-5 glow-hover flex flex-col items-center text-center justify-center"
              >
                <div className="w-10 h-10 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-3">
                  <Mail className="text-accent-cyan" size={20} />
                </div>
                <p className="text-gray-400 text-xs mb-1">Email</p>
                <a href="mailto:mdkaif.ece24@bitsindri.ac.in" className="text-white hover:text-accent-cyan transition-colors text-xs font-semibold break-all">
                  mdkaif.ece24@bitsindri.ac.in
                </a>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="glass-card p-5 glow-hover flex flex-col items-center text-center justify-center"
              >
                <div className="w-10 h-10 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-3">
                  <Phone className="text-accent-cyan" size={20} />
                </div>
                <p className="text-gray-400 text-xs mb-1">Phone</p>
                <a href="tel:9801615695" className="text-white hover:text-accent-cyan transition-colors text-xs font-semibold">
                  +91 9801615695
                </a>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="glass-card p-5 glow-hover flex flex-col items-center text-center justify-center"
              >
                <div className="w-10 h-10 bg-accent-cyan/10 rounded-full flex items-center justify-center mb-3">
                  <MapPin className="text-accent-cyan" size={20} />
                </div>
                <p className="text-gray-400 text-xs mb-1">Location</p>
                <p className="text-white text-xs font-semibold">Dhanbad, India</p>
              </motion.div>
            </div>

            {/* GitHub Live stats card */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 15px 40px rgba(0, 212, 255, 0.1)" }}
              className="glass-card p-6 glow-hover border border-white/10"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Github className="text-accent-cyan" size={22} />
                  <h3 className="font-display font-bold text-lg text-white">Live GitHub Activity</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  Live Sync
                </span>
              </div>

              {githubLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="text-accent-cyan animate-spin" size={32} />
                  <p className="text-gray-400 text-sm">Fetching repository logs...</p>
                </div>
              ) : githubData ? (
                <div className="space-y-5">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={githubData.user.avatar_url} 
                      alt={githubData.user.name} 
                      className="w-14 h-14 rounded-full border border-accent-cyan/40 bg-white/5"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">{githubData.user.name}</h4>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{githubData.user.bio}</p>
                    </div>
                  </div>

                  {/* Profile Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <div>
                      <p className="text-white font-bold text-lg">{githubData.user.public_repos}</p>
                      <p className="text-gray-400 text-2xs uppercase tracking-wider">Repos</p>
                    </div>
                    <div className="border-x border-white/10">
                      <p className="text-white font-bold text-lg">{githubData.user.followers}</p>
                      <p className="text-gray-400 text-2xs uppercase tracking-wider">Followers</p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{githubData.user.following}</p>
                      <p className="text-gray-400 text-2xs uppercase tracking-wider">Following</p>
                    </div>
                  </div>

                  {/* Featured Repositories */}
                  <div className="space-y-3">
                    <p className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                      <BookOpen size={14} className="text-accent-cyan" />
                      Featured Repositories
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {githubData.repos.slice(0, 4).map((repo) => (
                        <a 
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 bg-white/5 border border-white/5 hover:border-accent-cyan/30 hover:bg-accent-cyan/5 rounded-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            <h5 className="font-bold text-white text-sm group-hover:text-accent-cyan transition-colors line-clamp-1">
                              {repo.name}
                            </h5>
                            <p className="text-gray-400 text-2xs mt-1.5 leading-relaxed line-clamp-2">
                              {repo.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-2xs">
                            <span className="px-2 py-0.5 bg-white/10 text-gray-300 rounded text-2xs font-medium">
                              {repo.language}
                            </span>
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="flex items-center gap-0.5 hover:text-white transition-colors">
                                <Star size={10} /> {repo.stargazers_count}
                              </span>
                              <span className="flex items-center gap-0.5 hover:text-white transition-colors">
                                <GitFork size={10} /> {repo.forks_count}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Call to GitHub */}
                  <div className="pt-2 text-center">
                    <a 
                      href={githubData.user.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent-cyan text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      Explore Full GitHub Profile <Linkedin size={12} className="inline ml-1 opacity-0 w-0 h-0" />
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">Failed to retrieve GitHub sync.</p>
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://github.com/nezamimdkaif"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 glow-hover flex-1 flex items-center justify-center gap-2 hover:text-accent-cyan transition-colors"
              >
                <Github size={20} />
                <span className="font-semibold text-sm">GitHub Profile</span>
              </a>
              <a
                href="https://linkedin.com/in/md-kaif-nezami-029507313"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 glow-hover flex-1 flex items-center justify-center gap-2 hover:text-accent-cyan transition-colors"
              >
                <Linkedin size={20} />
                <span className="font-semibold text-sm">LinkedIn Profile</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Contact Form with State Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 glow-hover border border-white/10 relative">
              <h3 className="font-display font-bold text-2xl mb-6 text-accent-cyan">Send a Message</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-colors disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-colors disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-colors resize-none disabled:opacity-50"
                    placeholder="Your message..."
                  />
                </div>

                {/* API feedback response message */}
                {formState === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/25 text-green-400 rounded-lg flex items-start gap-3"
                  >
                    <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-medium">{statusMessage}</p>
                  </motion.div>
                )}

                {formState === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-medium">{statusMessage}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full bg-accent-cyan text-background-dark px-8 py-4 rounded-lg font-semibold hover:bg-accent-cyan/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {formState === "submitting" ? (
                    <>
                      Sending Message...
                      <Loader2 className="animate-spin" size={20} />
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
