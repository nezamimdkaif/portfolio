"use client";

import { motion } from "framer-motion";
import { Trophy, Award, ExternalLink, Download } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "ISRO IROC 2026 Achievement",
    description: "Qualified Round 1 & 2 of ISRO IROC 2026; currently preparing for Round 3 full system autonomy phase.",
    type: "achievement",
    link: null,
  },
  {
    icon: Award,
    title: "Overview of Global Navigation Satellite System (GNSS)",
    issuer: "Indian Space Research Organisation (ISRO)",
    type: "certificate",
    link: "/gnss-certificate.pdf",
    linkType: "download",
  },
  {
    icon: Award,
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "DeepLearning.AI (Coursera)",
    type: "certificate",
    link: "https://www.coursera.org/account/accomplishments/verify/4AKPRXKFOA84",
    linkType: "external",
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-12 text-center">
            <span className="text-accent-cyan">Achievements</span> & Certifications
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div 
                  whileHover={{ y: -8, boxShadow: "0 15px 40px rgba(0, 212, 255, 0.15)" }}
                  className="glass-card p-8 glow-hover h-full flex flex-col justify-between transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center">
                        <Icon className="text-accent-cyan" size={32} />
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-xl mb-3 text-center text-white">
                      {item.title}
                    </h3>
                    {item.issuer && (
                      <p className="text-accent-cyan text-sm text-center mb-4">{item.issuer}</p>
                    )}
                    {item.description && (
                      <p className="text-gray-400 text-center leading-relaxed text-sm">{item.description}</p>
                    )}
                  </div>

                  {item.link && (
                    <div className="mt-8 flex justify-center">
                      {item.linkType === "download" ? (
                        <motion.a
                          href={item.link}
                          download="ISRO_GNSS_Certificate.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 255, 0.15)" }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
                        >
                          <Download size={14} />
                          Download PDF
                        </motion.a>
                      ) : (
                        <motion.a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 212, 255, 0.15)" }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          Verify Credential
                        </motion.a>
                      )}
                    </div>
                  )}

                  {!item.link && item.type === "achievement" && (
                    <div className="mt-8 flex justify-center">
                      <span className="inline-flex items-center gap-1.5 bg-accent-cyan/5 text-accent-cyan/80 border border-accent-cyan/20 px-4 py-1.5 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-pulse" />
                        In Progress
                      </span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
