"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ist = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      setTime(
        ist.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        ist.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-clock">
      <span className="status-clock-time">{time}</span>
      <span className="status-clock-date">{date}</span>
    </div>
  );
}

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
                Whether you&apos;re planning an AEM Cloud rollout, scaling
                backend systems, or looking for experienced engineering
                support — I&apos;d love to hear from you.
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

          {/* Right: Status Terminal Card (aligned with top) */}
          <div className="contact-aside">
            <ScrollReveal delay={0.15}>
              <div className="status-card">
                <div className="status-card-header">
                  <div className="status-card-dots">
                    <span className="status-card-dot dot-red" />
                    <span className="status-card-dot dot-yellow" />
                    <span className="status-card-dot dot-green" />
                  </div>
                  <span className="status-card-title">status.config</span>
                </div>

                <div className="status-card-body">
                  <div className="status-row">
                    <span className="status-key">location</span>
                    <span className="status-value">Hyderabad, India</span>
                  </div>
                  <div className="status-row">
                    <span className="status-key">timezone</span>
                    <span className="status-value">IST (UTC+5:30)</span>
                  </div>
                  <div className="status-row">
                    <span className="status-key">local_time</span>
                    <LiveClock />
                  </div>
                  <div className="status-divider" />
                  <div className="status-row">
                    <span className="status-key">status</span>
                    <span className="status-value status-available">
                      <span className="contact-dot" />
                      available
                    </span>
                  </div>
                  <div className="status-row">
                    <span className="status-key">open_to</span>
                    <span className="status-value">roles · consulting · projects</span>
                  </div>
                  <div className="status-row">
                    <span className="status-key">response</span>
                    <span className="status-value">&lt; 24 hours</span>
                  </div>
                  <div className="status-divider" />
                  <div className="status-row">
                    <span className="status-key">stack</span>
                    <span className="status-value">AEM Cloud · Java · Sling</span>
                  </div>
                  <div className="status-row">
                    <span className="status-key">experience</span>
                    <span className="status-value">4+ years</span>
                  </div>
                </div>
              </div>
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
