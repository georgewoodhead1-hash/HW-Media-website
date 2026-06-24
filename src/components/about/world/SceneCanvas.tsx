"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WorkField from "./WorkField";

// THE ONE PERSISTENT CANVAS. A single fixed full-viewport R3F canvas that lives
// behind every DOM scene — this is the continuous "world" the whole About page is
// composited over (the Floema/Trionn/Luke model), replacing the old per-scene
// canvases (which felt disconnected and cooked the CPU). For now it renders the
// hero field; scene stages + a scroll-driven camera get layered on next.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// dark gold plasma that flows on its own (constant motion) and glows toward the
// cursor — Luke's mouse-reactive shader hero, in HW's near-black + gold palette.
const FRAG = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; } return v; }
  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.05;
    vec2 q = vec2(fbm(uv * 2.2 + t), fbm(uv * 2.2 - t + 3.0));
    float n = fbm(uv * 2.6 + q * 1.4 + t);
    float md = distance(uv, uMouse);
    float glow = smoothstep(0.55, 0.0, md);
    vec3 dark = vec3(0.018, 0.018, 0.022);
    vec3 gold = vec3(0.749, 0.667, 0.325);
    vec3 col = mix(dark, gold * 0.42, smoothstep(0.5, 0.98, n) * 0.6);
    col += gold * glow * glow * (0.18 + 0.22 * n);
    col *= 1.0 - distance(uv, vec2(0.5)) * 0.55;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function HeroField() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) } }), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += Math.min(dt, 0.05);
    // ease the glow toward the pointer so it trails like Luke's
    mat.current.uniforms.uMouse.value.lerp(target.current, Math.min(1, dt * 3));
  });

  return (
    // pure background: no depth test/write + renderOrder -1 so the 3D films in
    // WorkField always draw OVER this fullscreen field instead of being occluded.
    <mesh renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export default function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        {/* the ambient gold field — clip-space quad, ignores the camera */}
        <HeroField />
        {/* the work toy — 3D films using the perspective camera, gated to #ch-work */}
        <WorkField />
      </Suspense>
    </Canvas>
  );
}
