"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavSection {
  id: string;
  number: string;
  name: string;
}

const sections: NavSection[] = [
  { id: "hero", number: "01", name: "Home" },
  { id: "timeline", number: "02", name: "Timeline" },
  { id: "skills", number: "03", name: "Skills" },
  { id: "certifications", number: "04", name: "Certs" },
  { id: "contact", number: "05", name: "Contact" },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 60);

      // Compute total scroll progress percentage
      const totalDocHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalDocHeight > 0
          ? Math.min(100, Math.max(0, Math.round((currentScroll / totalDocHeight) * 100)))
          : 0;
      setScrollProgress(progress);

      // Determine active section based on scroll offset
      const scrollPosition = currentScroll + window.innerHeight * 0.35;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMouseEnter = () => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 450);
  };

  const currentActiveObj =
    sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <>
      {/* 1. TOP HERO NAV (Visible when at the very top) */}
      <motion.header
        className="nav"
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: isScrolled ? 0 : 1,
          y: isScrolled ? -20 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          pointerEvents: isScrolled ? "none" : "auto",
        }}
      >
        <nav
          className="nav-links-container"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <Link href="#timeline" className="nav-link">
            Timeline
          </Link>
          <Link href="#skills" className="nav-link">
            Skills
          </Link>
          <Link href="#certifications" className="nav-link">
            Certificates
          </Link>
          <Link href="#contact" className="nav-link">
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </motion.header>

      {/* 2. DYNAMIC FLOATING ISLAND CAPSULE (Appears on Scroll) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            className="capsule-nav-wrapper"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className={`capsule-nav-body ${isExpanded ? "is-expanded" : ""}`}
              layout
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 24,
                mass: 0.8,
              }}
            >
              {/* Left: Active Section Status with Live Green Dot */}
              <div
                className="capsule-active-badge"
                onClick={() => setIsExpanded((prev) => !prev)}
                title="Hover or click to view menu"
              >
                <span className="capsule-status-dot" />
                <span className="capsule-section-num">
                  {currentActiveObj.number}
                </span>
                <span className="capsule-section-divider">/</span>
                <span className="capsule-section-name">
                  {currentActiveObj.name}
                </span>
              </div>

              {/* Center: Live Scroll Progress Ring / Percentage */}
              <div
                className="capsule-progress-wrap"
                title={`Page scrolled ${scrollProgress}%`}
              >
                <svg className="capsule-progress-svg" viewBox="0 0 32 32">
                  <circle
                    className="capsule-progress-bg"
                    cx="16"
                    cy="16"
                    r="12"
                  />
                  <circle
                    className="capsule-progress-bar"
                    cx="16"
                    cy="16"
                    r="12"
                    strokeDasharray="75.398"
                    strokeDashoffset={
                      75.398 - (75.398 * scrollProgress) / 100
                    }
                  />
                </svg>
                <span className="capsule-progress-text">{scrollProgress}%</span>
              </div>

              {/* Expanded Nav Links (ONLY visible on hover) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.nav
                    className="capsule-links-row"
                    initial={{ opacity: 0, width: 0, scale: 0.96 }}
                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {sections.map((sec) => {
                      const isActive = activeSection === sec.id;
                      return (
                        <Link
                          key={sec.id}
                          href={`#${sec.id}`}
                          className={`capsule-nav-item ${
                            isActive ? "is-active" : ""
                          }`}
                          onClick={() => setIsExpanded(false)}
                          title={`Jump to ${sec.name}`}
                        >
                          <span className="capsule-item-num">{sec.number}</span>
                          <span className="capsule-item-label">{sec.name}</span>
                          {isActive && (
                            <motion.span
                              className="capsule-active-glow"
                              layoutId="capsuleActivePill"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </motion.nav>
                )}
              </AnimatePresence>

              {/* Theme Switcher in Capsule */}
              <ThemeToggle />

              {/* Far Right: Quick Jump to Top */}
              <button
                type="button"
                className="capsule-top-btn"
                onClick={scrollToTop}
                title="Scroll to top"
                aria-label="Scroll to top"
              >
                <ArrowUp size={12} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
