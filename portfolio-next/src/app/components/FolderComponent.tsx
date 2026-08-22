"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export interface CertificateItem {
  id: number;
  title: string;
  subtitle: string;
  issuer: string;
  imageSrc: string;
}

export const certificatesData: CertificateItem[] = [
  {
    id: 1,
    title: "Adobe Certified Professional — AEM Developer",
    subtitle: "AD0-E128 · AEM Developer Credential",
    issuer: "Adobe Certified (2026–2028)",
    imageSrc: "/images/cert-aem.png",
  },
  {
    id: 2,
    title: "Azure Fundamentals (AZ-900)",
    subtitle: "Cloud Architecture & Services",
    issuer: "Microsoft Certified",
    imageSrc: "/images/cert-1.png",
  },
  {
    id: 3,
    title: "Azure AI Fundamentals (AI-900)",
    subtitle: "AI Workloads & Machine Learning",
    issuer: "Microsoft Certified",
    imageSrc: "/images/cert-2.png",
  },
  {
    id: 4,
    title: "ERS Champion Award",
    subtitle: "Excellence in Enterprise Delivery",
    issuer: "HCLTech (2023–24)",
    imageSrc: "/images/c-5.jpeg",
  },
  {
    id: 5,
    title: "Full-Stack Web Internship",
    subtitle: "Full-Stack Development Credential",
    issuer: "APSSDC",
    imageSrc: "/images/c-4.jpeg",
  },
];

const themes = {
  black: {
    backFill: "#0b0b0b",
    backInsetShadow:
      "inset 0 0 8px 2px rgba(255,255,255,0.25), 0 20px 40px rgba(0,0,0,0.8)",
    flapFill: "#292929",
    flapFillOpacity: 0.25,
    flapStroke: "#888888",
    flapInsetColor: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0",
  },
} as const;

const BASE_WIDTH = 321;
const BASE_HEIGHT = 270;
const scale = 1.05;

const FLAP_PATH =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

const cardPositions = [
  // 1: Adobe (Far Left)
  {
    open: { x: -88, y: -168, rotate: -18 },
    hover: { x: -45, y: -38, rotate: -10 },
    closed: { x: -36, y: -12, rotate: -8 },
    delay: 0,
  },
  // 2: Azure Fundamentals (Mid-Left)
  {
    open: { x: -44, y: -182, rotate: -9 },
    hover: { x: -22, y: -44, rotate: -5 },
    closed: { x: -18, y: -15, rotate: -4 },
    delay: 0.03,
  },
  // 3: Azure AI Fundamentals (Center)
  {
    open: { x: 0, y: -188, rotate: 0 },
    hover: { x: 0, y: -48, rotate: 0 },
    closed: { x: 0, y: -18, rotate: 0 },
    delay: 0.06,
  },
  // 4: HCLTech ERS (Mid-Right)
  {
    open: { x: 44, y: -182, rotate: 9 },
    hover: { x: 22, y: -44, rotate: 5 },
    closed: { x: 18, y: -15, rotate: 4 },
    delay: 0.09,
  },
  // 5: Internship (Far Right)
  {
    open: { x: 88, y: -168, rotate: 18 },
    hover: { x: 45, y: -38, rotate: 10 },
    closed: { x: 36, y: -12, rotate: 8 },
    delay: 0.12,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function FolderComponent({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
} = {}) {
  const theme = themes.black;
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Selected certificate index (null by default; only set when interacting or returning from modal)
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);

  // Modal state (null when closed, index when open)
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState(0);

  // Swipe gesture tracking
  const touchStartXRef = useRef<number | null>(null);

  const handleNextCert = () => {
    setSlideDirection(1);
    setModalIndex((prev) => {
      if (prev === null) return 0;
      const next = (prev + 1) % certificatesData.length;
      setSelectedCertIndex(next);
      return next;
    });
  };

  const handlePrevCert = () => {
    setSlideDirection(-1);
    setModalIndex((prev) => {
      if (prev === null) return 0;
      const prevIdx =
        (prev - 1 + certificatesData.length) % certificatesData.length;
      setSelectedCertIndex(prevIdx);
      return prevIdx;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (modalIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNextCert();
      } else if (e.key === "ArrowLeft") {
        handlePrevCert();
      } else if (e.key === "Escape") {
        setModalIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalIndex]);

  // Prevent background scrolling when modal is open on mobile & desktop
  useEffect(() => {
    if (modalIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [modalIndex]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartXRef.current;

    if (diff < -40) {
      // Swiped Left -> Next
      handleNextCert();
    } else if (diff > 40) {
      // Swiped Right -> Previous
      handlePrevCert();
    }
    touchStartXRef.current = null;
  };

  const toggleFolder = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen((prev) => {
      if (prev) {
        setSelectedCertIndex(null);
        return false;
      }
      return true;
    });
  };

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    setSelectedCertIndex(index);
    setSlideDirection(0);
    setModalIndex(index);
  };

  const activeCert =
    modalIndex !== null ? certificatesData[modalIndex] : null;

  return (
    <>
      <div className="folder-root-container">
        {/* RareUI 3D Folder Shell */}
        <div
          className="folder-interactive-box"
          style={{
            width: BASE_WIDTH * scale,
            height: BASE_HEIGHT * scale,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={toggleFolder}
        >
          <div
            style={{
              position: "relative",
              width: BASE_WIDTH,
              height: BASE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              perspective: 800 * scale,
            }}
          >
            {/* Back folder body */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                borderRadius: 25,
                backgroundColor: theme.backFill,
                boxShadow: theme.backInsetShadow,
                border: "1px solid #282828",
              }}
            />

            {/* Fanning Certificate Cards */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
              }}
            >
              {certificatesData.map((cert, index) => {
                const pos = cardPositions[index] || cardPositions[2];
                const isSelected =
                  selectedCertIndex !== null && index === selectedCertIndex;

                // Symmetrical fan arc; only elevate when selected
                let currentPos = pos.closed;
                let zIndex = 10 - index;

                if (selectedCertIndex !== null) {
                  zIndex = isSelected
                    ? 25
                    : 10 - Math.abs(index - selectedCertIndex);
                }

                if (isOpen) {
                  currentPos = {
                    x: pos.open.x,
                    y: isSelected ? pos.open.y - 24 : pos.open.y,
                    rotate: pos.open.rotate,
                  };
                } else if (isHovered) {
                  currentPos = {
                    x: pos.hover.x,
                    y: isSelected ? pos.hover.y - 16 : pos.hover.y,
                    rotate: pos.hover.rotate,
                  };
                } else {
                  currentPos = {
                    x: pos.closed.x,
                    y: isSelected ? -24 : pos.closed.y,
                    rotate: pos.closed.rotate,
                  };
                }

                return (
                  <motion.div
                    key={cert.id}
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      zIndex,
                    }}
                    animate={{
                      x: currentPos.x,
                      y: currentPos.y,
                      rotate: currentPos.rotate,
                      scale: isSelected && isOpen ? 1.03 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 14,
                      delay: isOpen ? pos.delay : isHovered ? pos.delay : 0,
                    }}
                    onClick={(e) => handleCardClick(e, index)}
                  >
                    <MiniCertificateCard
                      cert={cert}
                      isSelected={isSelected}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Front Translucent Frosted Flap */}
            <motion.div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 321,
                height: 241,
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
                pointerEvents: "auto",
                cursor: "pointer",
                zIndex: 30,
              }}
              animate={{ rotateX: isOpen ? -55 : isHovered ? -45 : -15 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              onClick={toggleFolder}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  clipPath: `path('${FLAP_PATH}')`,
                  WebkitClipPath: `path('${FLAP_PATH}')`,
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
              <svg
                style={{ position: "absolute", inset: 0 }}
                width="321"
                height="241"
                viewBox="0 0 321 241"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_i_171_13)">
                  <path
                    d={FLAP_PATH}
                    fill={theme.flapFill}
                    fillOpacity={theme.flapFillOpacity}
                  />
                  <path
                    d="M25 0.5H136.084C142.905 0.5 149.417 3.3431 154.054 8.3457L177.713 33.874C182.539 39.0808 189.317 42.04 196.416 42.04H296C309.531 42.04 320.5 53.0092 320.5 66.54V216C320.5 229.531 309.531 240.5 296 240.5H25C11.469 240.5 0.5 229.531 0.5 216V25C0.5 11.469 11.469 0.5 25 0.5Z"
                    stroke={theme.flapStroke}
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_i_171_13"
                    x="-25.4"
                    y="-25.4"
                    width="371.8"
                    height="291.8"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="2.65" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values={theme.flapInsetColor}
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_171_13"
                    />
                  </filter>
                </defs>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Quick Certificate Selector Buttons below */}
        <div className="folder-buttons-row">
          {certificatesData.map((cert, idx) => {
            const isSelected =
              selectedCertIndex !== null && idx === selectedCertIndex;
            return (
              <button
                key={cert.id}
                onClick={() => {
                  setSelectedCertIndex(idx);
                  setIsOpen(true);
                  setSlideDirection(0);
                  setModalIndex(idx);
                }}
                className={`folder-quick-btn ${
                  isSelected ? "is-selected" : ""
                }`}
                type="button"
              >
                <span>{cert.title}</span>
                <ExternalLink size={12} style={{ opacity: 0.6 }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipeable Lightbox Modal */}
      <AnimatePresence>
        {activeCert && modalIndex !== null && (
          <motion.div
            className="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalIndex(null)}
          >
            <motion.div
              className="cert-modal-dialog"
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Modal Header */}
              <div className="cert-modal-header">
                <div>
                  <div className="cert-modal-counter">
                    <span>{`0${modalIndex + 1}`}</span>
                    <span className="cert-modal-divider">/</span>
                    <span>{`0${certificatesData.length}`}</span>
                  </div>
                  <h4 className="cert-modal-title">{activeCert.title}</h4>
                  <p className="cert-modal-meta">
                    {activeCert.issuer} · {activeCert.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setModalIndex(null)}
                  className="cert-modal-close-btn"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Certificate Image Frame with Slide Transition & Navigation Arrows */}
              <div className="cert-modal-image-wrap">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  className="cert-modal-nav-btn cert-nav-prev"
                  onClick={handlePrevCert}
                  title="Previous Certificate (Swipe Right / Left Arrow)"
                  aria-label="Previous Certificate"
                >
                  <ChevronLeft size={22} />
                </button>

                <AnimatePresence
                  initial={false}
                  custom={slideDirection}
                  mode="wait"
                >
                  <motion.div
                    key={activeCert.id}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="cert-modal-slide-container"
                  >
                    <Image
                      src={activeCert.imageSrc}
                      alt={activeCert.title}
                      width={960}
                      height={680}
                      className="cert-modal-image"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  className="cert-modal-nav-btn cert-nav-next"
                  onClick={handleNextCert}
                  title="Next Certificate (Swipe Left / Right Arrow)"
                  aria-label="Next Certificate"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="cert-modal-footer">
                <div className="cert-modal-dots">
                  {certificatesData.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      className={`cert-dot-indicator ${
                        dotIdx === modalIndex ? "is-active" : ""
                      }`}
                      onClick={() => {
                        setSlideDirection(dotIdx > modalIndex ? 1 : -1);
                        setSelectedCertIndex(dotIdx);
                        setModalIndex(dotIdx);
                      }}
                      title={`Go to certificate ${dotIdx + 1}`}
                      aria-label={`Go to certificate ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mini preview card fanning out of the folder
function MiniCertificateCard({
  cert,
  isSelected,
}: {
  cert: CertificateItem;
  isSelected: boolean;
}) {
  return (
    <div
      style={{
        width: 164,
        height: 214,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: isSelected ? "#1c1c1e" : "#161616",
        border: isSelected
          ? "1px solid rgba(255, 255, 255, 0.48)"
          : "1px solid #303030",
        boxShadow: isSelected
          ? "0 20px 40px rgba(0, 0, 0, 0.9), 0 0 16px rgba(255, 255, 255, 0.12)"
          : "0 14px 28px rgba(0, 0, 0, 0.75)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 120,
          backgroundColor: "#0d0d0d",
          borderBottom: "1px solid #282828",
          overflow: "hidden",
        }}
      >
        <Image
          src={cert.imageSrc}
          alt={cert.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="164px"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(22, 22, 22, 0.9) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Details */}
      <div
        style={{
          padding: "8px 10px",
          height: 94,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "8.5px",
              color: isSelected ? "#10b981" : "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {cert.issuer}
          </span>
          <h5
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: 1.25,
              marginTop: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cert.title}
          </h5>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 4,
            borderTop: "1px solid #222222",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              color: isSelected ? "#ffffff" : "#888888",
            }}
          >
            {isSelected ? "Active credential" : "View details"}
          </span>
          <ExternalLink
            size={10}
            style={{ color: isSelected ? "#ffffff" : "#aaa" }}
          />
        </div>
      </div>
    </div>
  );
}
