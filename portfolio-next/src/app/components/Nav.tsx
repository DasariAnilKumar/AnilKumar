"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Nav() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Only visible when at the top of the page
      setIsVisible(window.scrollY < 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className="nav"
      initial={{ opacity: 1, y: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -25,
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <nav
        className="nav-links-container"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
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
      </nav>
    </motion.header>
  );
}
