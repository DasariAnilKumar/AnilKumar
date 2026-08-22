"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import StatusTerminal from "./StatusTerminal";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "anilkumard707@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <>
      <section id="contact" className="section contact-section">
        <div className="contact-grid">
          {/* Left: Header + Content */}
          <div className="contact-content">
            <ScrollReveal>
              <div className="section-header">
                <span className="section-number">05</span>
                <h2 className="section-title">Get in Touch</h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="contact-intro">
                Have a project in mind, need engineering support, or want to
                discuss a new opportunity? Feel free to reach out anytime.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <div className="contact-email-row">
                <a
                  href={`mailto:${email}`}
                  onClick={handleCopyEmail}
                  className="contact-email-display"
                >
                  {email}
                  <span className="contact-email-underline" />
                </a>

                <AnimatePresence>
                  {copied && (
                    <motion.span
                      className="contact-copied-toast"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      Copied ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.24}>
              <div className="contact-links-row">
                <a
                  href="https://www.linkedin.com/in/anilkumard707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} className="contact-link-icon" />
                </a>

                <a
                  href={`mailto:${email}`}
                  className="contact-link"
                >
                  <span>Direct Mail</span>
                  <ArrowUpRight size={14} className="contact-link-icon" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Status Terminal Card with Gravity Letters */}
          <div className="contact-aside">
            <ScrollReveal delay={0.15}>
              <StatusTerminal />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-text">
          &copy; {new Date().getFullYear()} Dasari Anil Kumar
        </span>
        <span className="footer-text">Hyderabad, India</span>
      </footer>
    </>
  );
}
