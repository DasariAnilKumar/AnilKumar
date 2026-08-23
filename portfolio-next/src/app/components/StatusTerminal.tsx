"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";

interface FallingChar {
  id: string;
  char: string;
  color: string;
  isMono: boolean;
  fontWeight?: string | number;
  fontSize: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vrot: number;
  width: number;
  height: number;
  settled: boolean;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  birth: number;
  lifespan: number;
}

interface Shockwave {
  x: number;
  y: number;
  maxRadius: number;
  birth: number;
  lifespan: number;
}

export default function StatusTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mounted, setMounted] = useState(false);
  const [timeString, setTimeString] = useState<string>("12:00:00");
  const [dateString, setDateString] = useState<string>("IST");

  // Fallen characters tracked by ID for gravity letters
  const [fallenIds, setFallenIds] = useState<Set<string>>(new Set());
  const fallenIdsRef = useRef<Set<string>>(new Set());
  fallenIdsRef.current = fallenIds;

  // Active falling physics objects
  const particlesRef = useRef<FallingChar[]>([]);
  const [, setFrameCount] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  // Graviton Magnetic Cursor Physics state
  const targetPosRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sparksRef = useRef<SparkParticle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const cursorAnimRef = useRef<number | null>(null);

  // Live IST Clock
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const ist = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      setTimeString(
        ist.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDateString(
        ist.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync canvas dimensions with devicePixelRatio for crisp Retina rendering
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Trigger a single character to fall
  const dropChar = useCallback(
    (id: string, el: HTMLElement, customVx?: number, customVy?: number) => {
      if (fallenIdsRef.current.has(id) || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const charRect = el.getBoundingClientRect();

      const initX = charRect.left - containerRect.left;
      const initY = charRect.top - containerRect.top;

      const computedStyle = window.getComputedStyle(el);

      const newParticle: FallingChar = {
        id,
        char: el.innerText || el.textContent || "",
        color: computedStyle.color || "#ffffff",
        isMono: true,
        fontWeight: computedStyle.fontWeight,
        fontSize: parseFloat(computedStyle.fontSize) || 12,
        x: initX,
        y: initY,
        vx: customVx !== undefined ? customVx : (Math.random() - 0.5) * 4.0,
        vy: customVy !== undefined ? customVy : -1.2 + (Math.random() - 0.5) * 1.5,
        rotation: (Math.random() - 0.5) * 20,
        vrot: (Math.random() - 0.5) * 16,
        width: charRect.width || 8,
        height: charRect.height || 14,
        settled: false,
      };

      particlesRef.current.push(newParticle);

      // Spawn 3 micro-sparks on snap
      const now = performance.now();
      for (let s = 0; s < 3; s++) {
        sparksRef.current.push({
          x: initX + (charRect.width || 8) / 2,
          y: initY + (charRect.height || 14) / 2,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -1.5 + (Math.random() - 0.5) * 3,
          alpha: 0.9,
          birth: now,
          lifespan: 220 + Math.random() * 120,
        });
      }

      setFallenIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(runPhysicsLoop);
      }
    },
    []
  );

  // Gravity Letters Physics animation loop
  const runPhysicsLoop = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const bounds = container.getBoundingClientRect();
    const floorY = bounds.height - 24;
    const rightX = bounds.width - 12;

    const gravity = 0.65;
    const bounce = 0.38;
    const friction = 0.88;

    let hasActive = false;

    particlesRef.current.forEach((p) => {
      if (p.settled) return;

      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vrot;

      // Floor collision
      if (p.y >= floorY - p.height) {
        p.y = floorY - p.height;
        p.vy = -p.vy * bounce;
        p.vx *= friction;
        p.vrot *= friction;

        // Micro bounce threshold to settle
        if (Math.abs(p.vy) < 0.6 && Math.abs(p.vx) < 0.25) {
          p.settled = true;
          p.vy = 0;
          p.vx = 0;
          p.vrot = 0;
        } else {
          hasActive = true;
        }
      } else {
        hasActive = true;
      }

      // Left / Right wall collision
      if (p.x < 10) {
        p.x = 10;
        p.vx = -p.vx * 0.5;
      } else if (p.x > rightX - p.width) {
        p.x = rightX - p.width;
        p.vx = -p.vx * 0.5;
      }
    });

    setFrameCount((c) => c + 1);

    if (hasActive) {
      animFrameRef.current = requestAnimationFrame(runPhysicsLoop);
    } else {
      animFrameRef.current = null;
    }
  }, []);

  // Graviton Magnetic Tethers & Shockwave Canvas Render Loop
  const renderCursorLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    const now = performance.now();
    const target = targetPosRef.current;
    const current = currentPosRef.current;

    // Smooth inertia tracking
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    current.x += dx * 0.35;
    current.y += dy * 0.35;

    const containerRect = container.getBoundingClientRect();

    // 1. Render Shockwaves & Shockwave Collision (Steel Grey)
    const activeShockwaves: Shockwave[] = [];
    for (let i = 0; i < shockwavesRef.current.length; i++) {
      const sw = shockwavesRef.current[i];
      const age = now - sw.birth;
      if (age < sw.lifespan) {
        const progress = age / sw.lifespan;
        const currentR = progress * sw.maxRadius;
        const alpha = (1 - progress) * 0.65;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, currentR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(161, 161, 170, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        activeShockwaves.push(sw);
      }
    }
    shockwavesRef.current = activeShockwaves;

    // 2. Render Micro-Sparks (Platinum Dust)
    const activeSparks: SparkParticle[] = [];
    for (let s = 0; s < sparksRef.current.length; s++) {
      const sp = sparksRef.current[s];
      const age = now - sp.birth;
      if (age < sp.lifespan) {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.15; // spark gravity

        const progress = age / sp.lifespan;
        const alpha = sp.alpha * (1 - progress);

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 212, 216, ${alpha})`;
        ctx.fill();

        activeSparks.push(sp);
      }
    }
    sparksRef.current = activeSparks;

    // 3. Dynamic Magnetic Gravitational Tethers in Refined Steel Grey & Platinum (to nearest letters)
    let tetherCount = 0;

    if (target.inside) {
      const targets = container.querySelectorAll<HTMLElement>(
        ".gravity-target:not(.is-fallen)"
      );

      targets.forEach((el) => {
        const gid = el.dataset.gid;
        if (!gid || fallenIdsRef.current.has(gid)) return;

        const charRect = el.getBoundingClientRect();
        const charCenterX = charRect.left - containerRect.left + charRect.width / 2;
        const charCenterY = charRect.top - containerRect.top + charRect.height / 2;

        const dist = Math.hypot(charCenterX - current.x, charCenterY - current.y);

        // Magnetic tether range (75px)
        if (dist < 75) {
          tetherCount++;
          const tension = 1 - dist / 75;

          // Draw Glowing Steel Grey Laser Tether
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(charCenterX, charCenterY);
          ctx.strokeStyle = `rgba(161, 161, 170, ${tension * 0.7})`;
          ctx.lineWidth = 0.8 + tension * 0.6;
          ctx.stroke();

          // Anchor point at character
          ctx.beginPath();
          ctx.arc(charCenterX, charCenterY, 1.5 + tension * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 212, 216, ${tension * 0.88})`;
          ctx.fill();

          // Snap tether & drop letter if sliced through (dist < 18px)
          if (dist < 18) {
            dropChar(gid, el);
          }
        }
      });

      // 4. Render Graviton Node (Platinum Core & Charcoal Aura)
      // Pulsing Gravitational Aura
      const auraPulse = Math.sin(now * 0.008) * 2;
      ctx.beginPath();
      ctx.arc(current.x, current.y, 8 + auraPulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(161, 161, 170, 0.09)";
      ctx.fill();

      // Magnetic Caliper Brackets
      const ringR = 6.5;
      ctx.beginPath();
      ctx.arc(current.x, current.y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(161, 161, 170, 0.45)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glowing Fusion Core Dot
      const isLight =
        typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-theme") === "light";
      ctx.beginPath();
      ctx.arc(current.x, current.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? "#18181b" : "#e4e4e7";
      ctx.shadowColor = isLight ? "rgba(0, 0, 0, 0.4)" : "#ffffff";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow
    }

    // Continue loop if cursor inside or particles/shockwaves active
    if (
      target.inside ||
      activeShockwaves.length > 0 ||
      activeSparks.length > 0 ||
      tetherCount > 0
    ) {
      cursorAnimRef.current = requestAnimationFrame(renderCursorLoop);
    } else {
      cursorAnimRef.current = null;
    }
  }, [dropChar]);

  const startCursorLoop = useCallback(() => {
    if (!cursorAnimRef.current) {
      cursorAnimRef.current = requestAnimationFrame(renderCursorLoop);
    }
  }, [renderCursorLoop]);

  // Handle Mouse Events
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPosRef.current = { x, y, inside: true };
    startCursorLoop();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPosRef.current = { x, y, inside: true };
    currentPosRef.current = { x, y };
    startCursorLoop();
  };

  const handleMouseLeave = () => {
    targetPosRef.current = { ...targetPosRef.current, inside: false };
    startCursorLoop();
  };

  // On Click: Emit Gravity Shockwave that blasts surrounding letters
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Trigger Shockwave
    shockwavesRef.current.push({
      x: clickX,
      y: clickY,
      maxRadius: 150,
      birth: performance.now(),
      lifespan: 380,
    });

    // Blast letters within shockwave radius
    const targets = containerRef.current.querySelectorAll<HTMLElement>(
      ".gravity-target:not(.is-fallen)"
    );
    targets.forEach((el) => {
      const gid = el.dataset.gid;
      if (!gid || fallenIdsRef.current.has(gid)) return;

      const charRect = el.getBoundingClientRect();
      const cx = charRect.left - rect.left + charRect.width / 2;
      const cy = charRect.top - rect.top + charRect.height / 2;

      const dist = Math.hypot(cx - clickX, cy - clickY);
      if (dist < 110) {
        const angle = Math.atan2(cy - clickY, cx - clickX);
        const force = (1 - dist / 110) * 6.5;
        const vx = Math.cos(angle) * force;
        const vy = Math.sin(angle) * force - 2.5;

        setTimeout(() => {
          dropChar(gid, el, vx, vy);
        }, dist * 1.5);
      }
    });

    startCursorLoop();
  };

  // Drop all letters at once
  const dropAll = useCallback(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll<HTMLElement>(
      ".gravity-target"
    );
    elements.forEach((el, index) => {
      const id = el.dataset.gid;
      if (id && !fallenIdsRef.current.has(id)) {
        setTimeout(() => {
          dropChar(id, el);
        }, index * 8);
      }
    });
  }, [dropChar]);

  // Reset / restore all letters
  const resetAll = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    particlesRef.current = [];
    sparksRef.current = [];
    shockwavesRef.current = [];
    setFallenIds(new Set());
  }, []);

  // Handle touch drag across mobile screen
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const element = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    ) as HTMLElement | null;
    if (element && element.classList.contains("gravity-target")) {
      const gid = element.dataset.gid;
      if (gid) {
        dropChar(gid, element);
      }
    }
  };

  // Helper to render interactive words/characters with unique IDs
  const renderInteractiveText = (
    text: string,
    prefix: string,
    colorClass: string = "status-value"
  ) => {
    return text.split("").map((char, index) => {
      const gid = `${prefix}-${index}`;
      const isFallen = fallenIds.has(gid);

      if (char === " ") {
        return (
          <span key={`space-${gid}`} className="gravity-space">
            &nbsp;
          </span>
        );
      }

      return (
        <span
          key={`static-${gid}`}
          data-gid={gid}
          className={`gravity-target ${colorClass} ${
            isFallen ? "is-fallen" : ""
          }`}
          onPointerEnter={(e) => {
            dropChar(gid, e.currentTarget);
          }}
          onPointerDown={(e) => {
            dropChar(gid, e.currentTarget);
          }}
        >
          {char}
        </span>
      );
    });
  };

  const hasFallen = fallenIds.size > 0;

  return (
    <div
      className="status-card"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
    >
      {/* High-Performance Canvas for Graviton Laser Tethers & Shockwaves */}
      <canvas ref={canvasRef} className="status-cursor-canvas" />

      {/* Terminal Window Header */}
      <div className="status-card-header">
        <div className="status-card-dots">
          <button
            type="button"
            className="status-card-dot dot-red"
            title="Reset Terminal (Restore Letters)"
            onClick={resetAll}
            aria-label="Reset Terminal"
          />
          <button
            type="button"
            className="status-card-dot dot-yellow"
            title="Trigger Gravity (Drop All Letters)"
            onClick={dropAll}
            aria-label="Drop All Letters"
          />
          <button
            type="button"
            className="status-card-dot dot-green"
            title="Terminal Active"
            aria-label="Terminal Active"
          />
        </div>

        <div className="status-header-center">
          <span className="status-card-title">status.config</span>
          <span className="status-gravity-hint">
            {hasFallen ? "(gravity active)" : "(magnetic tether field)"}
          </span>
        </div>

        {hasFallen && (
          <button
            type="button"
            className="status-reset-btn"
            onClick={resetAll}
            title="Reset all letters"
          >
            <RotateCcw size={10} />
            <span>reset</span>
          </button>
        )}
      </div>

      {/* Terminal Content Body */}
      <div className="status-card-body">
        {/* Row 1: Location */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("location:", "loc-k", "status-key-text")}
          </span>
          <span className="status-value">
            {renderInteractiveText("Hyderabad, India", "loc-v")}
          </span>
        </div>

        {/* Row 2: Timezone */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("timezone:", "tz-k", "status-key-text")}
          </span>
          <span className="status-value">
            {renderInteractiveText("IST (UTC+5:30)", "tz-v")}
          </span>
        </div>

        {/* Row 3: Local Time Live */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("local_time:", "time-k", "status-key-text")}
          </span>
          <div className="status-clock">
            <span className="status-clock-time" suppressHydrationWarning>
              {renderInteractiveText(timeString, "time-v")}
            </span>
            <span className="status-clock-date" suppressHydrationWarning>
              {renderInteractiveText(dateString, "date-v", "status-muted-text")}
            </span>
          </div>
        </div>

        <div className="status-divider" />

        {/* Row 4: Status */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("status:", "st-k", "status-key-text")}
          </span>
          <span className="status-value status-available">
            {renderInteractiveText("● available", "st-v", "status-green-text")}
          </span>
        </div>

        {/* Row 5: Open to */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("open_to:", "open-k", "status-key-text")}
          </span>
          <span className="status-value">
            {renderInteractiveText("roles · consulting · projects", "open-v")}
          </span>
        </div>

        {/* Row 6: Response */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("response:", "resp-k", "status-key-text")}
          </span>
          <span className="status-value">
            {renderInteractiveText("< 24 hours", "resp-v")}
          </span>
        </div>

        <div className="status-divider" />

        {/* Row 7: Stack */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("stack:", "stk-k", "status-key-text")}
          </span>
          <span className="status-value">
            {renderInteractiveText("AEM Cloud · Java · Sling", "stk-v")}
          </span>
        </div>

        {/* Row 8: Experience */}
        <div className="status-row">
          <span className="status-key">
            {renderInteractiveText("experience:", "exp-k", "status-key-text")}
          </span>
          <span className="status-value">
            {renderInteractiveText("4+ years", "exp-v")}
          </span>
        </div>

        {/* Falling Particles Layer */}
        {particlesRef.current.map((p, idx) => (
          <span
            key={`falling-particle-${p.id}-${idx}`}
            className="gravity-falling-char"
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`,
              color: p.color,
              fontSize: `${p.fontSize}px`,
              fontWeight: p.fontWeight,
            }}
          >
            {p.char}
          </span>
        ))}
      </div>
    </div>
  );
}
