"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="nav">
      <motion.nav
        className="nav-links-container"
        layout
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        style={{
          marginLeft: isScrolled ? 0 : "auto",
          marginRight: isScrolled ? "auto" : "auto",
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
      </motion.nav>
    </header>
  );
}
