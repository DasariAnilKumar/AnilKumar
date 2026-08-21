"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

const transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] as const,
};

const nameVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const lineVariant = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition,
  },
};

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ...transition, delay: 0.6 },
  },
};

const metaFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ...transition, delay: 0.9 },
  },
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, -100]);
  const imageOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      {/* Upper-left: Display name */}
      <motion.div
        className="hero-headline"
        variants={nameVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="hero-name-line" variants={lineVariant}>
          Anil
        </motion.span>
        <motion.span className="hero-name-line" variants={lineVariant}>
          Kumar
        </motion.span>
        <motion.div className="hero-mobile-sub" variants={lineVariant}>
          <span className="hero-mobile-role">Senior Software Engineer</span>
          <div className="hero-mobile-badges">
            <span className="hero-mobile-badge">Adobe Certified AEM Developer</span>
            <span className="hero-mobile-badge">4+ Years Experience</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Lower-left: Role title (behind image) */}
      <motion.div
        className="hero-role-wrap"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <span className="hero-role-line">Senior Software</span>
        <span className="hero-role-line">Engineer</span>
      </motion.div>

      {/* Bottom-right: Cutout image (in front) */}
      <motion.div
        className="hero-image-container"
        style={{ y: imageY, opacity: imageOpacity }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition, duration: 1.1, delay: 0.3 }}
      >
        <Image
          src="/images/anil_cutout_transparent.png"
          alt="Anil Kumar"
          width={620}
          height={800}
          className="hero-cutout"
          priority
        />
      </motion.div>

      {/* Bottom metadata bar */}
      <motion.div
        className="hero-meta-bar"
        variants={metaFade}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-meta-left">
          <span className="hero-meta-text">Adobe Certified AEM Developer</span>
          <span className="hero-meta-text">4+ years experience</span>
        </div>
        <div className="hero-scroll-cue">
          <span>Scroll</span>
          <ArrowDown size={14} className="scroll-arrow" />
        </div>
      </motion.div>
    </section>
  );
}
