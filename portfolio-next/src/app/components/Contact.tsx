"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const lineVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "anilkumard707@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <>
      <section id="contact" className="contact-section">
        <motion.div
          className="contact-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Quiet Label */}
          <motion.div className="contact-label-wrap" variants={lineVariants}>
            <span className="contact-label-number">05</span>
            <span className="contact-label-text">Get in touch</span>
          </motion.div>

          {/* Primary Focal Element: Large Display Email */}
          <motion.div className="contact-email-hero" variants={lineVariants}>
            <a
              href={`mailto:${email}`}
              onClick={handleCopyEmail}
              className="contact-email-display-link"
              aria-label={`Send email to ${email}`}
            >
              <span className="contact-email-display-text">{email}</span>
              <span className="contact-email-display-underline" />
            </a>

            <AnimatePresence>
              {copied && (
                <motion.span
                  className="contact-copied-toast"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease }}
                >
                  Email copied to clipboard ✓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quiet Inline Meta & Links */}
          <motion.div className="contact-meta-footer" variants={lineVariants}>
            <div className="contact-links-row">
              <a
                href="https://www.linkedin.com/in/anilkumard707"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-quiet-link"
              >
                <span>LinkedIn</span>
                <ArrowUpRight size={13} className="contact-link-arrow" />
              </a>

              <span className="contact-meta-divider">/</span>

              <div className="contact-status-inline">
                <span className="contact-status-dot" />
                <span>Available for select roles & consulting</span>
              </div>

              <span className="contact-meta-divider">/</span>

              <span className="contact-location-text">Hyderabad, India (IST)</span>
            </div>

            <div className="contact-colophon">
              <span>AEM Cloud · Java Backend · Web Systems</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="footer">
        <span className="footer-text">
          &copy; {new Date().getFullYear()} Dasari Anil Kumar. All rights reserved.
        </span>
        <span className="footer-location">
          Hyderabad, India
        </span>
      </footer>
    </>
  );
}
