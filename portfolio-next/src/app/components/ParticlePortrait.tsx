"use client";

import { useEffect, useRef } from "react";

/**
 * ParticlePortrait
 * ----------------
 * Wraps the hero cutout <img> with two kinds of canvas:
 *
 *  • Particle canvas (shown while the photo is hidden)
 *      1. Assemble – dots fly in and settle on their exact pixel of the photo.
 *      2. Resolve  – every dot grows into a disc filled with the real photo
 *                    pixels under it until the discs merge into the image.
 *                    The last frame is the photo itself, so the hand-off to
 *                    the <img> is invisible.
 *      3. Scroll   – the same resolve runs backwards and the dots drift apart.
 *
 *  • Eye canvases (on top of the photo)
 *      The real pixels inside each eye opening are warped toward the cursor
 *      with a smooth falloff, so the irises look around while the lids and
 *      skin stay untouched at the edges.
 *
 * The <img> remains the source of truth (SEO, no-JS, phones, reduced motion).
 */

type Props = {
  imgRef: React.RefObject<HTMLImageElement | null>;
};

/* ---- Eye map, in the natural pixels of anil_cutout_transparent.png (1024²) -----
   If the photo changes, update these. cx/cy = iris centre, rx/ry = eye opening. */
const EYES = [
  { cx: 440, cy: 345.5, rx: 30, ry: 12 }, // left on screen
  { cx: 562, cy: 344.5, rx: 30, ry: 12 }, // right on screen
];
// Max iris travel (natural px). The gaze is an ellipse: wide sideways, shorter
// up/down, like a real eye under its lids.
const EYE_MAX_X = 8;
const EYE_MAX_Y = 5;
const GAZE_REACH = 260; // css px from the eye at which the gaze is ~63% of max
const GAZE_EASE = 0.09; // per frame; lower = softer, lazier eyes

/* ---- Timing ---- */
const ASSEMBLE_MS = 1900;
const RESOLVE_MS = 1250;
const PAD_RATIO = 0.4; // canvas overhang so flying dots are not clipped

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function ParticlePortrait({ imgRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eyeLRef = useRef<HTMLCanvasElement>(null);
  const eyeRRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const eyeCanvases = [eyeLRef.current, eyeRRef.current];
    if (!img || !canvas || !eyeCanvases[0] || !eyeCanvases[1]) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return; // plain photo, exactly as before

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let raf = 0;

    /* ---------- particles ---------- */
    let count = 0;
    let hx = new Float32Array(0);
    let hy = new Float32Array(0);
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let lum = new Uint8Array(0);
    let delay = new Float32Array(0);
    let seed = new Float32Array(0);
    let color = new Uint32Array(0);

    let W = 0; // photo box in css px
    let H = 0;
    let PAD = 0;
    let dpr = 1;
    let gap = 4; // dot spacing, css px
    let scale = 1; // natural px -> css px
    let ox = 0; // contain offset inside the box, css px
    let oy = 0;
    let buf: ImageData | null = null;
    let buf32: Uint32Array | null = null;

    /* ---------- eyes ---------- */
    type EyeState = {
      w: number;
      h: number;
      src: Uint8ClampedArray;
      weight: Float32Array;
      out: ImageData;
      ctx: CanvasRenderingContext2D;
      ex: number; // current iris offset, natural px
      ey: number;
    };
    let eyes: EyeState[] = [];

    /* ---------- timeline ---------- */
    const start = performance.now();
    let assembled = false;
    let introSolid = 0; // 0 = dots, 1 = photo
    let resolveStart = 0;
    const mouse = { x: 0, y: 0, active: false };

    let photoShown: boolean | null = null;
    const setPhotoVisible = (v: boolean) => {
      if (photoShown === v) return;
      photoShown = v;
      img.style.opacity = v ? "1" : "0";
      for (const c of eyeCanvases) c!.style.opacity = v ? "1" : "0";
    };
    img.classList.add("pp-photo");
    setPhotoVisible(false);

    /* ---------- colours ---------- */
    const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
    const packColors = () => {
      const light = isLight();
      for (let i = 0; i < count; i++) {
        const l = lum[i];
        let r: number, g: number, b: number;
        if (light) {
          const v = Math.min(150, l * 0.55);
          r = v;
          g = v;
          b = v;
        } else {
          const v = Math.min(255, 55 + l * 0.85);
          r = v * 0.94;
          g = v * 0.98;
          b = Math.min(255, v * 1.06);
        }
        color[i] = (255 << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255);
      }
    };

    /* ---------- build ---------- */
    const build = () => {
      W = Math.round(img.offsetWidth);
      H = Math.round(img.offsetHeight);
      if (W < 10 || H < 10) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      PAD = Math.round(Math.max(W, H) * PAD_RATIO);

      canvas.style.left = `${img.offsetLeft - PAD}px`;
      canvas.style.top = `${img.offsetTop - PAD}px`;
      canvas.style.width = `${W + PAD * 2}px`;
      canvas.style.height = `${H + PAD * 2}px`;
      canvas.width = Math.round((W + PAD * 2) * dpr);
      canvas.height = Math.round((H + PAD * 2) * dpr);
      buf = ctx.createImageData(canvas.width, canvas.height);
      buf32 = new Uint32Array(buf.data.buffer);

      // object-fit: contain (the cutout is anchored bottom)
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      scale = Math.min(W / nw, H / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      ox = (W - dw) / 2;
      oy = H - dh;

      // Full-resolution source pixels (for dots and for the eyes)
      const full = document.createElement("canvas");
      full.width = nw;
      full.height = nh;
      const fctx = full.getContext("2d", { willReadFrequently: true });
      if (!fctx) return false;
      fctx.drawImage(img, 0, 0);
      const fdata = fctx.getImageData(0, 0, nw, nh).data;

      // Dots on a regular grid (css px) so the resolve covers the photo fully
      gap = Math.max(3, Math.round(dw / 170));
      const hxA: number[] = [];
      const hyA: number[] = [];
      const lA: number[] = [];
      for (let y = gap / 2; y < dh; y += gap) {
        for (let x = gap / 2; x < dw; x += gap) {
          const nx = Math.min(nw - 1, (x / scale) | 0);
          const ny = Math.min(nh - 1, (y / scale) | 0);
          const k = (ny * nw + nx) * 4;
          if (fdata[k + 3] < 40) continue;
          hxA.push(ox + x);
          hyA.push(oy + y);
          lA.push(0.299 * fdata[k] + 0.587 * fdata[k + 1] + 0.114 * fdata[k + 2]);
        }
      }
      const fresh = count === 0;
      count = hxA.length;
      hx = Float32Array.from(hxA);
      hy = Float32Array.from(hyA);
      lum = Uint8Array.from(lA);
      px = new Float32Array(count);
      py = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      delay = new Float32Array(count);
      seed = new Float32Array(count);
      color = new Uint32Array(count);
      const cx = W / 2;
      const cy = H * 0.45;
      for (let i = 0; i < count; i++) {
        seed[i] = Math.random();
        if (!fresh || assembled) {
          px[i] = hx[i];
          py[i] = hy[i];
        } else {
          const a = Math.random() * Math.PI * 2;
          const r = Math.max(W, H) * (0.45 + Math.random() * 0.5);
          px[i] = cx + Math.cos(a) * r;
          py[i] = cy + Math.sin(a) * r * 0.8;
          // bright face first, then hair and shirt
          delay[i] = (1 - lum[i] / 255) * 550 + Math.random() * 400;
        }
      }
      packColors();

      // Eyes: copy each eye patch and precompute its warp weight
      eyes = EYES.map((e, idx) => {
        const x0 = Math.floor(e.cx - e.rx);
        const y0 = Math.floor(e.cy - e.ry);
        const w = Math.ceil(e.rx * 2) + 1;
        const h = Math.ceil(e.ry * 2) + 1;
        const src = new Uint8ClampedArray(w * h * 4);
        for (let y = 0; y < h; y++) {
          const from = ((y0 + y) * nw + x0) * 4;
          src.set(fdata.subarray(from, from + w * 4), y * w * 4);
        }
        const weight = new Float32Array(w * h);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const u = Math.abs((x0 + x - e.cx) / e.rx);
            const v = Math.abs((y0 + y - e.cy) / e.ry);
            // rigid around the iris, fading to zero at the corners and lids
            weight[y * w + x] = (1 - smooth(0.32, 1, u)) * (1 - smooth(0.45, 1, v));
          }
        }
        const c = eyeCanvases[idx]!;
        c.width = w;
        c.height = h;
        c.style.left = `${img.offsetLeft + ox + x0 * scale}px`;
        c.style.top = `${img.offsetTop + oy + y0 * scale}px`;
        c.style.width = `${w * scale}px`;
        c.style.height = `${h * scale}px`;
        const ectx = c.getContext("2d")!;
        const out = ectx.createImageData(w, h);
        out.data.set(src);
        ectx.putImageData(out, 0, 0);
        return { w, h, src, weight, out, ctx: ectx, ex: 0, ey: 0 };
      });
      return true;
    };

    /* ---------- eye warp ---------- */
    const drawEye = (e: EyeState) => {
      const { w, h, src, weight, out } = e;
      const d = out.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          const wt = weight[i];
          const o = i * 4;
          if (wt <= 0.001) {
            d[o] = src[o];
            d[o + 1] = src[o + 1];
            d[o + 2] = src[o + 2];
            d[o + 3] = src[o + 3];
            continue;
          }
          // sample the source "behind" the shift (bilinear)
          const sx = Math.min(w - 1.001, Math.max(0, x - e.ex * wt));
          const sy = Math.min(h - 1.001, Math.max(0, y - e.ey * wt));
          const xi = sx | 0;
          const yi = sy | 0;
          const fx = sx - xi;
          const fy = sy - yi;
          const a = (yi * w + xi) * 4;
          const b = a + 4;
          const c = a + w * 4;
          const dd = c + 4;
          for (let ch = 0; ch < 4; ch++) {
            const top = src[a + ch] + (src[b + ch] - src[a + ch]) * fx;
            const bot = src[c + ch] + (src[dd + ch] - src[c + ch]) * fx;
            d[o + ch] = top + (bot - top) * fy;
          }
        }
      }
      e.ctx.putImageData(out, 0, 0);
    };

    const updateEyes = () => {
      let moving = false;
      const r = img.getBoundingClientRect();
      for (let k = 0; k < eyes.length; k++) {
        const e = eyes[k];
        const def = EYES[k];
        let tx = 0;
        let ty = 0;
        if (mouse.active) {
          // Aim straight at the cursor: direction from this eye, strength
          // easing in with distance so nearby movement stays subtle.
          const dx = mouse.x - (r.left + ox + def.cx * scale);
          const dy = mouse.y - (r.top + oy + def.cy * scale);
          const dist = Math.hypot(dx, dy) || 1;
          const reach = 1 - Math.exp(-dist / GAZE_REACH);
          tx = (dx / dist) * reach * EYE_MAX_X;
          ty = (dy / dist) * reach * EYE_MAX_Y;
        }
        const nx = e.ex + (tx - e.ex) * GAZE_EASE;
        const ny = e.ey + (ty - e.ey) * GAZE_EASE;
        if (Math.abs(nx - e.ex) > 0.01 || Math.abs(ny - e.ey) > 0.01) {
          e.ex = nx;
          e.ey = ny;
          drawEye(e);
          moving = true;
        }
      }
      return moving;
    };

    /* ---------- frame ---------- */
    const scrollAmount = () => Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.75)));

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !buf || !buf32) return;
      const t = now - start;
      const scroll = scrollAmount();

      if (!assembled && t > ASSEMBLE_MS) {
        assembled = true;
        resolveStart = now;
      }
      if (assembled && introSolid < 1) {
        introSolid = Math.min(1, (now - resolveStart) / RESOLVE_MS);
      }

      // Scroll: first 30% un-resolves the photo, the rest lets dots drift
      const scrollSolid = 1 - smooth(0, 0.3, scroll);
      const drift = smooth(0.25, 1, scroll);
      const solid = easeInOut(Math.min(introSolid, scrollSolid));

      // Physics
      let moving = 0;
      const time = t * 0.001;
      for (let i = 0; i < count; i++) {
        if (!assembled && t < delay[i]) continue;
        let tx = hx[i];
        let ty = hy[i];
        if (drift > 0) {
          const s = seed[i];
          const ang = s * 6.2832 + time * 0.3;
          tx += Math.cos(ang) * 240 * drift + (hx[i] - W / 2) * 0.5 * drift;
          ty += Math.sin(ang) * 150 * drift - 200 * drift * (0.5 + s);
        }
        const k = assembled ? 0.08 : 0.035 + 0.045 * Math.min(1, (t - delay[i]) / 900);
        vx[i] = (vx[i] + (tx - px[i]) * k) * 0.8;
        vy[i] = (vy[i] + (ty - py[i]) * k) * 0.8;
        px[i] += vx[i];
        py[i] += vy[i];
        if (Math.abs(vx[i]) + Math.abs(vy[i]) > 0.03) moving++;
      }

      const photoOn = solid >= 0.999;
      setPhotoVisible(photoOn);

      if (photoOn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // 1) dots, fading out as they grow into the photo
        buf32.fill(0);
        const cw = canvas.width;
        const ch = canvas.height;
        const dotAlpha = 1 - smooth(0, 0.35, solid);
        const farFade = 1 - smooth(0.7, 1, scroll);
        if (dotAlpha > 0 && farFade > 0) {
          for (let i = 0; i < count; i++) {
            if (!assembled && t < delay[i]) continue;
            const x = ((px[i] + PAD) * dpr) | 0;
            const y = ((py[i] + PAD) * dpr) | 0;
            if (x < 0 || y < 0 || x >= cw - 2 || y >= ch - 2) continue;
            let a = dotAlpha * farFade;
            if (!assembled) a *= Math.min(1, (t - delay[i]) / 700);
            const c = a >= 1 ? color[i] : (color[i] & 0x00ffffff) | (((255 * a) | 0) << 24);
            const o = y * cw + x;
            buf32[o] = c;
            buf32[o + 1] = c;
            buf32[o + cw] = c;
            buf32[o + cw + 1] = c;
          }
        }
        ctx.putImageData(buf, 0, 0);

        // 2) the real photo seen through discs growing at every dot's home
        if (solid > 0) {
          const rad = (0.4 + solid * 0.62) * gap; // ≥0.71·gap covers the grid completely
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
          ctx.beginPath();
          for (let i = 0; i < count; i++) {
            ctx.moveTo(hx[i] + rad, hy[i]);
            ctx.arc(hx[i], hy[i], rad, 0, 6.2832);
          }
          ctx.clip();
          ctx.drawImage(img, ox, oy, img.naturalWidth * scale, img.naturalHeight * scale);
          ctx.restore();
        }
      }

      const eyesMoving = photoOn ? updateEyes() : false;
      const busy =
        !assembled || introSolid < 1 || moving > 0 || eyesMoving || (!photoOn && drift > 0 && drift < 1);
      if (busy) schedule();
    };

    const schedule = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    };

    /* ---------- events ---------- */
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      schedule();
    };
    const onLeave = () => {
      mouse.active = false;
      schedule();
    };
    const onScroll = () => schedule();
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (build()) {
          for (const e of eyes) drawEye(e);
          schedule();
        }
      }, 150);
    };
    const themeObserver = new MutationObserver(() => {
      packColors();
      schedule();
    });
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) schedule();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });

    const init = () => {
      if (disposed) return;
      if (!build()) {
        setPhotoVisible(true);
        return;
      }
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      io.observe(img);
      schedule();
    };

    // Never leave the photo hidden if something goes wrong
    const failSafe = window.setTimeout(() => {
      if (introSolid < 1) {
        introSolid = 1;
        assembled = true;
        schedule();
      }
    }, ASSEMBLE_MS + RESOLVE_MS + 2500);

    if (img.complete && img.naturalWidth > 0) init();
    else img.addEventListener("load", init, { once: true });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(failSafe);
      window.clearTimeout(resizeTimer);
      img.removeEventListener("load", init);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
      io.disconnect();
      img.classList.remove("pp-photo");
      img.style.removeProperty("opacity");
    };
  }, [imgRef]);

  return (
    <>
      <canvas ref={canvasRef} className="pp-canvas" aria-hidden="true" />
      <canvas ref={eyeLRef} className="pp-eye" aria-hidden="true" />
      <canvas ref={eyeRRef} className="pp-eye" aria-hidden="true" />
    </>
  );
}
