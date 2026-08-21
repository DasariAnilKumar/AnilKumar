"use client";

import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <>
      <section id="contact" className="contact-section">
        <ScrollReveal>
          <h2 className="contact-lead">
            Let&apos;s work
            <br />
            together.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <a
            href="mailto:anilkumard707@gmail.com"
            className="contact-email-link"
          >
            anilkumard707@gmail.com
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="contact-socials">
            <a
              href="https://www.linkedin.com/in/anilkumard707"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <span>LinkedIn</span>
              <ArrowUpRight />
            </a>
          </div>
        </ScrollReveal>
      </section>

      <footer className="footer">
        <span className="footer-text">
          &copy; 2026 Anil Kumar. All rights reserved.
        </span>
        <span className="footer-location">
          Hyderabad, India
        </span>
      </footer>
    </>
  );
}
