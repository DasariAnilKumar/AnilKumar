"use client";

import { useEffect, useRef } from "react";

export default function LiquidBlob({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader: Raymarched organic dark-chrome liquid sphere
    const fsSource = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uTime;

      // Simplex-like 3D noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Signed distance function for morphing rich organic liquid chrome blob
      float map(vec3 p) {
        float baseRadius = 0.60;
        
        // Rich multi-layered organic liquid waves
        float t = uTime * 0.68;
        float n1 = snoise(p * 1.85 + vec3(0.0, t * 0.75, t * 0.45)) * 0.145;
        float n2 = snoise(p * 3.7 - vec3(t * 0.55, 0.0, t * 0.65)) * 0.062;
        float n3 = snoise(p * 6.8 + vec3(t * 0.35, t * 0.55, 0.0)) * 0.022;
        
        // Interactive mouse push/pull deformation
        vec2 m = (uMouse - 0.5) * 2.0;
        vec3 mousePos = vec3(m.x * 0.7, -m.y * 0.7, 0.6);
        float mouseDist = length(p - mousePos);
        float mouseInfl = smoothstep(0.85, 0.0, mouseDist) * 0.07;
        
        return length(p) - baseRadius - (n1 + n2 + n3 + mouseInfl);
      }

      // Normal computation via tetrahedron gradient
      vec3 calcNormal(vec3 p) {
        const float eps = 0.0015;
        const vec2 k = vec2(1.0, -1.0);
        return normalize(
          k.xyy * map(p + k.xyy * eps) +
          k.yyx * map(p + k.yyx * eps) +
          k.yxy * map(p + k.yxy * eps) +
          k.xxx * map(p + k.xxx * eps)
        );
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
        
        // Generous camera distance to guarantee full visibility without any edge clipping
        vec3 ro = vec3(0.0, 0.0, 2.5);
        vec3 rd = normalize(vec3(uv, -1.5));

        float dO = 0.0;
        float dS = 0.0;
        vec3 p = ro;
        bool hit = false;

        for (int i = 0; i < 75; i++) {
          p = ro + rd * dO;
          dS = map(p);
          if (dS < 0.001) {
            hit = true;
            break;
          }
          dO += dS;
          if (dO > 4.5) break;
        }

        if (!hit) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
        }

        vec3 N = calcNormal(p);
        vec3 V = -rd;

        // Primary key light from top-right
        vec3 keyLightDir = normalize(vec3(1.15, 1.55, 1.65));
        float diff = max(dot(N, keyLightDir), 0.0);
        vec3 H = normalize(keyLightDir + V);
        float spec = pow(max(dot(N, H), 0.0), 38.0);
        
        // Fill light from bottom-left
        vec3 fillLightDir = normalize(vec3(-1.0, -0.75, 0.95));
        float fillDiff = max(dot(N, fillLightDir), 0.0) * 0.35;

        // Overhead soft studio reflection
        vec3 topLightDir = normalize(vec3(0.0, 1.0, 0.6));
        float topDiff = max(dot(N, topLightDir), 0.0) * 0.25;

        // Fresnel rim reflection
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

        // Rich dark chrome / obsidian glossy metallic material
        vec3 darkBase = vec3(0.04, 0.04, 0.045);
        vec3 midTone = vec3(0.18, 0.19, 0.22);
        vec3 highlight = vec3(0.96, 0.98, 1.0);
        vec3 rimGlow = vec3(0.35, 0.38, 0.45);

        vec3 col = darkBase;
        col += midTone * (diff * 0.75 + fillDiff + topDiff);
        col += highlight * (spec * 1.35);
        col += rimGlow * (fresnel * 0.85);

        // Ambient crevice occlusion
        float ao = clamp(0.5 + 0.5 * map(p + N * 0.1) / 0.1, 0.0, 1.0);
        col *= (0.42 + 0.58 * ao);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Compile helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uTime = gl.getUniformLocation(program, "uTime");

    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let animationId: number;
    let startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width;
      mouse.targetY = (e.clientY - rect.top) / rect.height;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = (e.touches[0].clientX - rect.left) / rect.width;
      mouse.targetY = (e.touches[0].clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0.5;
      mouse.targetY = 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(Math.round(rect.width * dpr), 10);
      const h = Math.max(Math.round(rect.height * dpr), 10);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const elapsed = (performance.now() - startTime) / 1000;

      gl.uniform2f(uResolution, w, h);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, elapsed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`liquid-blob-container ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
