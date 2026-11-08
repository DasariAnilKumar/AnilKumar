"use client";

import { useEffect, useRef } from "react";

/**
 * ParticlePortrait
 * ----------------
 * An intro "birth" for the hero cutout, inspired by apex-humanoid, that ends
 * on the real photo:
 *
 *   1. Swirl      – glowing particles spiral up out of a vortex under the
 *                   portrait and land, bottom row first, on contour lines
 *                   that follow the relief of the face.
 *   2. Contours   – as each row lands it is drawn as a glowing line, so the
 *                   head appears as a stack of light contours. A small
 *                   "ASSEMBLING 000%" readout counts the arrivals.
 *   3. Resolve    – the contours flatten and thicken into bands of the real
 *                   photo until the bands tile the whole image. The final
 *                   frame is the photo itself, so the hand-off to <img> is exact.
 *   4. Gaze       – afterwards the eyes follow the cursor (real eye pixels,
 *                   warped with a smooth falloff).
 *   (Once resolved, the photo stays put while scrolling.)
 *
 * The <img> stays the source of truth: phones, reduced motion and no-JS get
 * the plain photo.
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

/* ---- Intro timing (ms) ---- */
const SPAWN_SPREAD = 1100; // bottom row leaves the vortex first, top row last
const FLIGHT_MIN = 1000; // each particle's spiral flight
const FLIGHT_VAR = 500;
const LINE_FADE = 450; // a row's contour line fades in after its last particle lands
const HOLD = 350; // contours fully drawn before resolving
const RESOLVE_MS = 1100;

/* ---- Look ---- */
const ROW_GAP_PX = 7.5; // css px between contour rows (≈120 rows on desktop)
const DOT_STEP_PX = 2.4; // css px between particles along a row
const RELIEF = 1.5; // contour bulge, in row gaps, for the brightest pixels
const PAD_RATIO = 0.4; // canvas overhang so the swirl is not clipped

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const bucketOf = (l: number) => (l < 45 ? 0 : l < 105 ? 1 : l < 165 ? 2 : 3);

export default function ParticlePortrait({ imgRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eyeLRef = useRef<HTMLCanvasElement>(null);
  const eyeRRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const hudPctRef = useRef<HTMLSpanElement>(null);
  const hudBarRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const hud = hudRef.current;
    const hudPct = hudPctRef.current;
    const hudBar = hudBarRef.current;
    const eyeCanvases = [eyeLRef.current, eyeRRef.current];
    if (!img || !canvas || !hud || !hudPct || !hudBar || !eyeCanvases[0] || !eyeCanvases[1]) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return; // plain photo, exactly as before

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const glow = document.createElement("canvas");
    const gctx = glow.getContext("2d");
    if (!gctx) return;

    let disposed = false;
    let raf = 0;

    /* ---------- particles (ordered row by row, left to right) ---------- */
    let count = 0;
    let hx = new Float32Array(0); // home on the contour (full relief), css px
    let hy = new Float32Array(0);
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let lift = new Float32Array(0); // relief offset (px) at this particle
    let lum = new Uint8Array(0);
    let brk = new Uint8Array(0); // 1 = starts a new line segment
    let rowOf = new Uint16Array(0);
    let delay = new Float32Array(0);
    let flight = new Float32Array(0);
    let sa = new Float32Array(0); // swirl start angle
    let sr = new Float32Array(0); // swirl start radius
    let seed = new Float32Array(0);
    let color = new Uint32Array(0);
    let rowY = new Float32Array(0); // undisplaced row centre, css px
    let rowStart = new Uint32Array(0);
    let rowEnd = new Uint32Array(0);
    let rowLanded = new Float32Array(0); // ms when the row's last particle lands
    let introEnd = 0; // ms when the last particle lands

    let W = 0;
    let H = 0;
    let PAD = 0;
    let dpr = 1;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    let dw = 0;
    let dh = 0;
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
      ex: number;
      ey: number;
    };
    let eyes: EyeState[] = [];

    /* ---------- state ---------- */
    const start = performance.now();
    let landedAll = false; // switch from scripted flight to springs
    let resolveStart = 0;
    let introSolid = 0;
    const mouse = { x: 0, y: 0, active: false };
    const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
    let light = isLight();

    let photoShown: boolean | null = null;
    const setPhotoVisible = (v: boolean) => {
      if (photoShown === v) return;
      photoShown = v;
      img.style.opacity = v ? "1" : "0";
      for (const c of eyeCanvases) c!.style.opacity = v ? "1" : "0";
    };
    img.classList.add("pp-photo");
    setPhotoVisible(false);

    const packColors = () => {
      light = isLight();
      for (let i = 0; i < count; i++) {
        const l = lum[i];
        let r: number, g: number, b: number;
        if (light) {
          const v = Math.min(140, l * 0.5);
          r = v;
          g = v;
          b = v;
        } else {
          // silver-white, brighter on the lit face, faint on the dark shirt
          const v = Math.min(255, 70 + l * 0.8);
          r = v * 0.9;
          g = v * 0.96;
          b = v;
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
      glow.width = Math.max(1, Math.round(canvas.width / 4));
      glow.height = Math.max(1, Math.round(canvas.height / 4));

      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      scale = Math.min(W / nw, H / nh);
      dw = nw * scale;
      dh = nh * scale;
      ox = (W - dw) / 2;
      oy = H - dh;

      const full = document.createElement("canvas");
      full.width = nw;
      full.height = nh;
      const fctx = full.getContext("2d", { willReadFrequently: true });
      if (!fctx) return false;
      fctx.drawImage(img, 0, 0);
      const fdata = fctx.getImageData(0, 0, nw, nh).data;
      // A softened copy drives the contour relief so the lines flow smoothly
      const soft = document.createElement("canvas");
      soft.width = nw;
      soft.height = nh;
      const sctx = soft.getContext("2d", { willReadFrequently: true });
      if (!sctx) return false;
      sctx.filter = "blur(6px)";
      sctx.drawImage(img, 0, 0);
      const sdata = sctx.getImageData(0, 0, nw, nh).data;
      const sample = (x: number, y: number) => {
        const nx = Math.min(nw - 1, Math.max(0, (x / scale) | 0));
        const ny = Math.min(nh - 1, Math.max(0, (y / scale) | 0));
        return (ny * nw + nx) * 4;
      };

      // Scale spacing a little with size so phones-sized windows stay light
      const rowGap = Math.max(4, Math.round(ROW_GAP_PX * Math.min(1.3, Math.max(0.75, dw / 740))));
      const step = DOT_STEP_PX * Math.min(1.3, Math.max(0.8, dw / 740));
      const relief = rowGap * RELIEF;
      const nRows = Math.ceil(dh / rowGap);

      const hxA: number[] = [];
      const hyA: number[] = [];
      const liftA: number[] = [];
      const lumA: number[] = [];
      const brkA: number[] = [];
      const rowA: number[] = [];
      rowY = new Float32Array(nRows);
      rowStart = new Uint32Array(nRows);
      rowEnd = new Uint32Array(nRows);
      for (let r = 0; r < nRows; r++) {
        const y = r * rowGap + rowGap / 2;
        rowY[r] = oy + y;
        rowStart[r] = hxA.length;
        let prevIn = false;
        for (let x = step / 2; x < dw; x += step) {
          const k = sample(x, y);
          const inside = fdata[k + 3] > 60;
          if (!inside) {
            prevIn = false;
            continue;
          }
          const l = 0.299 * fdata[k] + 0.587 * fdata[k + 1] + 0.114 * fdata[k + 2];
          const ls = 0.299 * sdata[k] + 0.587 * sdata[k + 1] + 0.114 * sdata[k + 2];
          const up = Math.pow(ls / 255, 1.4) * relief;
          hxA.push(ox + x);
          hyA.push(oy + y - up);
          liftA.push(up);
          lumA.push(l);
          brkA.push(prevIn ? 0 : 1);
          rowA.push(r);
          prevIn = true;
        }
        rowEnd[r] = hxA.length;
      }

      const fresh = count === 0;
      count = hxA.length;
      hx = Float32Array.from(hxA);
      hy = Float32Array.from(hyA);
      lift = Float32Array.from(liftA);
      lum = Uint8Array.from(lumA);
      brk = Uint8Array.from(brkA);
      rowOf = Uint16Array.from(rowA);
      px = new Float32Array(count);
      py = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      delay = new Float32Array(count);
      flight = new Float32Array(count);
      sa = new Float32Array(count);
      sr = new Float32Array(count);
      seed = new Float32Array(count);
      color = new Uint32Array(count);
      rowLanded = new Float32Array(nRows);
      introEnd = 0;

      for (let i = 0; i < count; i++) {
        seed[i] = Math.random();
        const yFrac = (hy[i] - oy) / dh; // 0 top … 1 bottom
        delay[i] = 250 + (1 - yFrac) * SPAWN_SPREAD + Math.random() * 260;
        flight[i] = FLIGHT_MIN + Math.random() * FLIGHT_VAR;
        sa[i] = Math.random() * Math.PI * 2;
        sr[i] = dw * (0.12 + Math.random() * 0.32);
        const land = delay[i] + flight[i];
        const r = rowOf[i];
        if (land > rowLanded[r]) rowLanded[r] = land;
        if (land > introEnd) introEnd = land;
        if (!fresh || landedAll) {
          px[i] = hx[i];
          py[i] = hy[i];
        } else {
          px[i] = -9999;
          py[i] = -9999;
        }
      }
      packColors();

      // HUD sits to the upper right of the head
      hud.style.left = `${img.offsetLeft + ox + dw * 0.74}px`;
      hud.style.top = `${img.offsetTop + oy + dh * 0.14}px`;

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
        const prev = eyes[idx];
        return { w, h, src, weight, out, ctx: ectx, ex: prev?.ex ?? 0, ey: prev?.ey ?? 0 };
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
    let hudShown = false;
    let lastPct = -1;

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !buf || !buf32) return;
      const t = now - start;

      /* --- intro clock --- */
      if (!landedAll && t >= introEnd) {
        landedAll = true;
        for (let i = 0; i < count; i++) {
          px[i] = hx[i];
          py[i] = hy[i];
          vx[i] = 0;
          vy[i] = 0;
        }
      }
      const contoursDone = landedAll && t >= introEnd + LINE_FADE + HOLD;
      if (contoursDone && !resolveStart) resolveStart = now;
      if (resolveStart) introSolid = clamp01((now - resolveStart) / RESOLVE_MS);

      const drift = 0; // the portrait no longer dissolves on scroll
      const solid = easeInOut(introSolid);
      const photoOn = solid >= 0.999;

      /* --- HUD --- */
      if (!landedAll || (resolveStart && introSolid < 1)) {
        let pct: number;
        if (!landedAll) {
          // share of particles that have landed
          let landed = 0;
          for (let i = 0; i < count; i += 7) if (t >= delay[i] + flight[i]) landed++;
          pct = Math.min(99, Math.floor((landed / Math.ceil(count / 7)) * 100));
        } else pct = 100;
        if (pct !== lastPct) {
          lastPct = pct;
          hudPct.textContent = String(pct).padStart(2, "0") + "%";
          hudBar.style.transform = `scaleX(${pct / 100})`;
        }
      }
      const hudVisible = t > 200 && !(resolveStart && introSolid > 0.35);
      if (hudVisible !== hudShown) {
        hudShown = hudVisible;
        hud.style.opacity = hudVisible ? "1" : "0";
      }

      /* --- motion --- */
      let moving = 0;
      const time = t * 0.001;
      if (!landedAll) {
        // scripted spiral: vortex under the chin → home on the contour
        const vxC = ox + dw * 0.5;
        const vyC = oy + dh * 1.02;
        for (let i = 0; i < count; i++) {
          const local = (t - delay[i]) / flight[i];
          if (local <= 0) {
            // waiting in the vortex: slow orbit
            const a = sa[i] + time * 2.2;
            px[i] = vxC + Math.cos(a) * sr[i];
            py[i] = vyC + Math.sin(a) * sr[i] * 0.22;
            continue;
          }
          const p = easeOut(clamp01(local));
          const a = sa[i] + time * 2.2 + p * 5.5;
          const rad = sr[i] * (1 - p);
          const cx = vxC + (hx[i] - vxC) * p;
          const cy = vyC + (hy[i] - vyC) * p;
          px[i] = cx + Math.cos(a) * rad;
          py[i] = cy + Math.sin(a) * rad * 0.35;
        }
        moving = 1;
      } else {
        for (let i = 0; i < count; i++) {
          let tx = hx[i];
          let ty = hy[i];
          if (drift > 0) {
            const s = seed[i];
            const ang = s * 6.2832 + time * 0.3;
            tx += Math.cos(ang) * 240 * drift + (hx[i] - W / 2) * 0.5 * drift;
            ty += Math.sin(ang) * 150 * drift - 200 * drift * (0.5 + s);
          }
          vx[i] = (vx[i] + (tx - px[i]) * 0.08) * 0.8;
          vy[i] = (vy[i] + (ty - py[i]) * 0.08) * 0.8;
          px[i] += vx[i];
          py[i] += vy[i];
          if (Math.abs(vx[i]) + Math.abs(vy[i]) > 0.03) moving++;
        }
      }

      setPhotoVisible(photoOn);

      /* --- draw --- */
      if (photoOn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        const cw = canvas.width;
        const ch = canvas.height;
        buf32.fill(0);

        // 1) particles
        const dotAlpha = 1 - smooth(0, 0.4, solid);
        if (dotAlpha > 0) {
          for (let i = 0; i < count; i++) {
            let a = dotAlpha;
            if (!landedAll) {
              const local = (t - delay[i]) / flight[i];
              // fade in while orbiting, brighten on arrival
              a *= local <= 0 ? 0.35 * clamp01(t / 400) : 0.35 + 0.65 * clamp01(local);
            }
            const x = ((px[i] + PAD) * dpr) | 0;
            const y = ((py[i] + PAD) * dpr) | 0;
            if (x < 0 || y < 0 || x >= cw - 2 || y >= ch - 2) continue;
            const c = a >= 1 ? color[i] : (color[i] & 0x00ffffff) | (((255 * a) | 0) << 24);
            const o = y * cw + x;
            buf32[o] = c;
            buf32[o + 1] = c;
            buf32[o + cw] = c;
            buf32[o + cw + 1] = c;
          }
        }
        ctx.putImageData(buf, 0, 0);

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);

        // 2) contour lines — each row fades in once all its particles landed;
        //    while resolving they flatten (relief → 0) and fade out
        const flat = solid; // 0 full relief … 1 flat
        const lineFade = (1 - smooth(0.55, 1, solid)) * (1 - smooth(0, 0.5, drift));
        if (lineFade > 0) {
          ctx.lineWidth = 1;
          ctx.lineCap = "round";
          ctx.strokeStyle = light ? "rgb(17,17,16)" : "rgb(226,236,244)";
          // brightness of each segment follows the photo (4 buckets = 4 strokes)
          const BUCKET_A = light ? [0.55, 0.38, 0.24, 0.12] : [0.07, 0.22, 0.45, 0.85];
          const nRows = rowY.length;
          const addRow = (r: number) => {
            const s = rowStart[r];
            const e = rowEnd[r];
            for (let i = s + 1; i < e; i++) {
              if (brk[i]) continue;
              const l = (lum[i] + lum[i - 1]) >> 1;
              if (bucketOf(l) !== curBucket) continue;
              const x0 = drift > 0 ? px[i - 1] : hx[i - 1];
              const y0 = drift > 0 ? py[i - 1] : hy[i - 1] + lift[i - 1] * flat;
              const x1 = drift > 0 ? px[i] : hx[i];
              const y1 = drift > 0 ? py[i] : hy[i] + lift[i] * flat;
              ctx.moveTo(x0, y0);
              ctx.lineTo(x1, y1);
            }
          };
          let curBucket = 0;
          for (curBucket = 0; curBucket < 4; curBucket++) {
            // rows that are fully in
            ctx.globalAlpha = BUCKET_A[curBucket] * lineFade;
            ctx.beginPath();
            for (let r = 0; r < nRows; r++) {
              if (landedAll || t - rowLanded[r] >= LINE_FADE) addRow(r);
            }
            ctx.stroke();
            // rows still fading in, each with its own alpha
            if (!landedAll) {
              for (let r = 0; r < nRows; r++) {
                const ra = (t - rowLanded[r]) / LINE_FADE;
                if (ra <= 0 || ra >= 1) continue;
                ctx.globalAlpha = BUCKET_A[curBucket] * lineFade * ra;
                ctx.beginPath();
                addRow(r);
                ctx.stroke();
              }
            }
          }
          ctx.globalAlpha = 1;
        }

        // 3) resolve: the real photo through bands that grow from each row
        if (solid > 0) {
          const nRows = rowY.length;
          const gapH = nRows > 1 ? rowY[1] - rowY[0] : 6;
          const half = (gapH / 2) * Math.min(1.06, solid * 1.06);
          ctx.beginPath();
          for (let r = 0; r < nRows; r++) {
            ctx.rect(ox - 2, rowY[r] - half, dw + 4, half * 2);
          }
          ctx.clip();
          ctx.drawImage(img, ox, oy, dw, dh);
        }
        ctx.restore();

        // 4) bloom (dark theme): a blurred, additive copy of the frame
        if (!light && solid < 0.6) {
          gctx.globalCompositeOperation = "copy";
          gctx.filter = "blur(2px)";
          gctx.drawImage(canvas, 0, 0, glow.width, glow.height);
          gctx.filter = "none";
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = 0.8 * (1 - smooth(0, 0.6, solid));
          ctx.drawImage(glow, 0, 0, cw, ch);
          ctx.restore();
        }
      }

      const eyesMoving = photoOn ? updateEyes() : false;
      const busy =
        !landedAll ||
        !resolveStart ||
        introSolid < 1 ||
        moving > 0 ||
        eyesMoving ||
        (!photoOn && drift > 0 && drift < 1);
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
      window.addEventListener("resize", onResize);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      io.observe(img);
      schedule();
    };

    // Never leave the photo hidden if something goes wrong
    const failSafe = window.setTimeout(() => {
      if (introSolid < 1) {
        landedAll = true;
        resolveStart = performance.now() - RESOLVE_MS;
        schedule();
      }
    }, 9000);

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
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
      io.disconnect();
      img.classList.remove("pp-photo");
      img.style.removeProperty("opacity");
      hud.style.opacity = "0";
    };
  }, [imgRef]);

  return (
    <>
      <canvas ref={canvasRef} className="pp-canvas" aria-hidden="true" />
      <canvas ref={eyeLRef} className="pp-eye" aria-hidden="true" />
      <canvas ref={eyeRRef} className="pp-eye" aria-hidden="true" />
      <div ref={hudRef} className="pp-hud" aria-hidden="true">
        <span className="pp-hud-label">Assembling</span>
        <span ref={hudPctRef} className="pp-hud-pct">
          00%
        </span>
        <span className="pp-hud-track">
          <span ref={hudBarRef} className="pp-hud-bar" />
        </span>
      </div>
    </>
  );
}
