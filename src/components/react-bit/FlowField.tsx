"use client";

import { useEffect, useRef } from "react";
import { Camera, Mesh, Program, Renderer, Triangle } from "ogl";

interface FlowFieldProps {
  className?: string;
}

const vertex = /* glsl */ `
  attribute vec3 position;
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uRes;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // drifting horizontal flow lines
    float n = noise(p * 3.0 + vec2(uTime * 0.25, -uTime * 0.12));
    float lines = smoothstep(0.74, 0.8, sin((p.y + n * 0.35) * 16.0) * 0.5 + 0.5);

    // pointer highlight
    vec2 m = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
    float glow = smoothstep(0.45, 0.0, distance(p, m));

    // edge vignette keeps focus toward the middle
    float vig = smoothstep(1.15, 0.15, length(p));

    float a = (lines * 0.05 + glow * 0.10) * vig;

    vec3 orange = vec3(1.0, 0.549, 0.259);
    vec3 violet = vec3(0.443, 0.259, 0.910);
    vec3 col = mix(orange, violet, uv.x);

    gl_FragColor = vec4(col, a);
  }
`;

export default function FlowField({ className = "" }: FlowFieldProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas as HTMLCanvasElement);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      transparent: true,
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uRes: { value: [1, 1] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const camera = new Camera(gl);

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [w, h];
    };
    resize();

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
    };

    let raf = 0;
    let time = 0;
    const loop = () => {
      time += 0.006;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      program.uniforms.uTime.value = time;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      renderer.render({ scene: mesh, camera });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
    };
  }, []);

  return <div ref={ref} aria-hidden className={className} />;
}
