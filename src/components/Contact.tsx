"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Loader2, CheckCircle2, AlertCircle, Star, GitFork, BookOpen } from "lucide-react";
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
    subject: "",
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
        const username = "nezamimdkaif";
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            "Accept": "application/vnd.github.v3+json",
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`, {
            headers: {
              "Accept": "application/vnd.github.v3+json",
            }
          });
          
          let reposData = [];
          if (reposResponse.ok) {
            const fullRepos = await reposResponse.json();
            reposData = fullRepos
              .map((repo: any) => ({
                name: repo.name,
                description: repo.description || "No description provided.",
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                language: repo.language || "TypeScript",
                html_url: repo.html_url
              }));
          }
          
          setGithubData({
            user: {
              name: userData.name || "Md Kaif Nezami",
              bio: userData.bio || "Embedded Systems & Robotics Engineer | B.Tech ECE Student at BIT Sindri | ISRO IROC 2026 Hardware Lead",
              public_repos: userData.public_repos,
              followers: userData.followers,
              following: userData.following,
              avatar_url: userData.avatar_url,
              html_url: userData.html_url,
            },
            repos: reposData.length > 0 ? reposData : [
              {
                name: "ISRO-IROC-2026",
                description: "Subsystem design and hardware docking control integration code for the ISRO IROC UAV Docking Challenge.",
                stargazers_count: 2,
                forks_count: 1,
                language: "C++",
                html_url: `https://github.com/${username}/ISRO-IROC-2026`
              },
              {
                name: "uav-hexacopter-flight",
                description: "OrangeCube configuration, PID tuning files, and waypoint mission planning configurations.",
                stargazers_count: 1,
                forks_count: 0,
                language: "C",
                html_url: `https://github.com/${username}/uav-hexacopter-flight`
              },
              {
                name: "payload-camera-transmission",
                description: "Lightweight camera module controller with ESP32-CAM and wireless video data transmission code.",
                stargazers_count: 1,
                forks_count: 0,
                language: "Python",
                html_url: `https://github.com/${username}/payload-camera-transmission`
              }
            ]
          });
          setGithubLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch github stats dynamically, using local cache fallback.", err);
      }
      
      // Local fallback sync card for static environments
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
          subject: `📬 [${formData.subject || "Contact Form"}] from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          message: `Subject: ${formData.subject}\n\nMessage:\n${formData.message}`,
          from_name: "Craftivo MKN Portfolio",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormState("success");
        setStatusMessage("✅ Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.warn("Web3Forms unavailable:", error);
      // Hard fallback: open mail client directly
      const subject = encodeURIComponent(formData.subject || `Portfolio Message from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.open(`mailto:mdkaif.ece24@bitsindri.ac.in?subject=${subject}&body=${body}`, "_blank");
      setFormState("success");
      setStatusMessage("Your email client has been opened with your message pre-filled. Please send it to complete your submission.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0d0d0d] px-6 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Background ambient red-coral lights */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent-coral/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-coral/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">
            Contact <span className="text-accent-coral">Me</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mt-4">
            Feel free to reach out for robotics collaborations, internship opportunities, or general technical discussions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: 3 Info Cards + GitHub Live Sync */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Info cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              
              {/* Address */}
              <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center justify-center hover:border-accent-coral/25 transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/10 border border-accent-coral/20 rounded-full flex items-center justify-center mb-3 text-accent-coral">
                  <MapPin size={20} />
                </div>
                <p className="text-gray-400 text-3xs uppercase tracking-widest mb-1">Address</p>
                <p className="text-white text-xs font-bold">Dhanbad, India</p>
              </div>

              {/* Phone */}
              <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center justify-center hover:border-accent-coral/25 transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/10 border border-accent-coral/20 rounded-full flex items-center justify-center mb-3 text-accent-coral">
                  <Phone size={20} />
                </div>
                <p className="text-gray-400 text-3xs uppercase tracking-widest mb-1">Call Me</p>
                <a href="tel:9801615695" className="text-white hover:text-accent-coral transition-colors text-xs font-bold">
                  +91 9801615695
                </a>
              </div>

              {/* Email */}
              <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5 flex flex-col items-center text-center justify-center hover:border-accent-coral/25 transition-all duration-300">
                <div className="w-10 h-10 bg-accent-coral/10 border border-accent-coral/20 rounded-full flex items-center justify-center mb-3 text-accent-coral">
                  <Mail size={20} />
                </div>
                <p className="text-gray-400 text-3xs uppercase tracking-widest mb-1">Email Me</p>
                <a href="mailto:mdkaif.ece24@bitsindri.ac.in" className="text-white hover:text-accent-coral transition-colors text-2xs font-bold break-all">
                  mdkaif.ece24@bitsindri.ac.in
                </a>
              </div>

            </div>

            {/* GitHub live sync widget */}
            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-white">
                  <Github className="text-accent-coral" size={20} />
                  <h3 className="font-display font-bold text-base">GitHub Activity</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-ping" />
                  Live Sync
                </span>
              </div>

              {githubLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Loader2 className="text-accent-coral animate-spin" size={24} />
                  <p className="text-gray-400 text-xs">Syncing source codes...</p>
                </div>
              ) : githubData ? (
                <div className="space-y-4">
                  {/* Bio summary */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={githubData.user.avatar_url} 
                      alt={githubData.user.name} 
                      className="w-11 h-11 rounded-full border border-accent-coral/45"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{githubData.user.name}</h4>
                      <p className="text-gray-400 text-3xs leading-normal line-clamp-1">{githubData.user.bio}</p>
                    </div>
                  </div>

                  {/* Profile Quick Stats */}
                  <div className="grid grid-cols-3 gap-1 py-2 bg-black/30 rounded-lg border border-white/5 text-center text-xs">
                    <div>
                      <p className="text-white font-bold">{githubData.user.public_repos}</p>
                      <p className="text-gray-400 text-[9px] uppercase tracking-wider">Repos</p>
                    </div>
                    <div className="border-x border-white/5">
                      <p className="text-white font-bold">{githubData.user.followers}</p>
                      <p className="text-gray-400 text-[9px] uppercase tracking-wider">Followers</p>
                    </div>
                    <div>
                      <p className="text-white font-bold">{githubData.user.following}</p>
                      <p className="text-gray-400 text-[9px] uppercase tracking-wider">Following</p>
                    </div>
                  </div>

                  {/* Top Repos list */}
                  <div className="space-y-2">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <BookOpen size={12} className="text-accent-coral" />
                      Featured Repositories
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {githubData.repos.slice(0, 4).map((repo) => (
                        <a 
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-black/20 border border-white/5 hover:border-accent-coral/30 hover:bg-accent-coral/5 rounded-lg transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            <h5 className="font-bold text-white text-xs group-hover:text-accent-coral transition-colors line-clamp-1">
                              {repo.name}
                            </h5>
                            <p className="text-gray-400 text-[10px] mt-1 leading-normal line-clamp-2">
                              {repo.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[9px] text-gray-500">
                            <span className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-medium text-gray-300">
                              {repo.language}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-0.5">
                                <Star size={9} /> {repo.stargazers_count}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <GitFork size={9} /> {repo.forks_count}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Link */}
                  <div className="text-center pt-2">
                    <a 
                      href={githubData.user.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent-coral text-xs font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      View GitHub Profile
                      <span>&rarr;</span>
                    </a>
                  </div>

                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-xs">Failed to load live data.</p>
                </div>
              )}
            </div>

            {/* Social card handles */}
            <div className="flex gap-4">
              <a
                href="https://github.com/nezamimdkaif"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1c1c1c] border border-white/5 p-4 rounded-xl flex-1 flex items-center justify-center gap-2 text-gray-300 hover:text-accent-coral hover:border-accent-coral/25 transition-all duration-300"
              >
                <Github size={18} />
                <span className="font-bold text-xs">GitHub Profile</span>
              </a>
              <a
                href="https://linkedin.com/in/md-kaif-nezami-029507313"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1c1c1c] border border-white/5 p-4 rounded-xl flex-1 flex items-center justify-center gap-2 text-gray-300 hover:text-accent-coral hover:border-accent-coral/25 transition-all duration-300"
              >
                <Linkedin size={18} />
                <span className="font-bold text-xs">LinkedIn Profile</span>
              </a>
            </div>

          </motion.div>

          {/* Right Column: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 shadow-xl relative">
              <h3 className="font-display font-bold text-2xl mb-6 text-white">Send a Message</h3>
              
              <div className="space-y-5">
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3.5 bg-black/35 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-coral focus:ring-1 focus:ring-accent-coral transition-colors disabled:opacity-50 text-sm"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3.5 bg-black/35 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-coral focus:ring-1 focus:ring-accent-coral transition-colors disabled:opacity-50 text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3.5 bg-black/35 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-coral focus:ring-1 focus:ring-accent-coral transition-colors disabled:opacity-50 text-sm"
                    placeholder="Project Inquiry, Internship, etc."
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={formState === "submitting"}
                    className="w-full px-4 py-3.5 bg-black/35 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent-coral focus:ring-1 focus:ring-accent-coral transition-colors resize-none disabled:opacity-50 text-sm"
                    placeholder="Describe your project, ideas, or questions..."
                  />
                </div>

                {/* Success/Error displays */}
                {formState === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/25 text-green-400 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-semibold">{statusMessage}</p>
                  </motion.div>
                )}

                {formState === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-xs font-semibold">{statusMessage}</p>
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full bg-accent-coral hover:bg-accent-coral/95 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_4px_25px_rgba(251,58,93,0.35)] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {formState === "submitting" ? (
                    <>
                      Sending Message...
                      <Loader2 className="animate-spin" size={18} />
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
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
