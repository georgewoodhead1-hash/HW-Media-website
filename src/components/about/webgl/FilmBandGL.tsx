"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { getLenis } from "@/lib/lenis";

// The film band — HW's work as planes in Three.js, warped + RGB-split by Lenis
// scroll velocity. Two modes:
//   "band"          — a continuous scrolling row (legacy hero usage).
//   "constellation" — the films scattered at real z-depth around a centred line
//                     (ref-luke-55), some nearer/larger/in front, some far/dim;
//                     hover swaps a plane's poster for its film video and pushes
//                     it toward camera. The depth is real, not a CSS fake.
// This is the proven velocity-driven displacement+RGB-shift shader family reused
// across every About WebGL surface.

const FILMS = [
  { poster: "/videos/films/posters/mclaren-w.jpg", video: "/videos/films/mclaren-w.mp4" },
  { poster: "/videos/films/posters/salomon-w.jpg", video: "/videos/films/salomon-w.mp4" },
  { poster: "/videos/films/posters/zuma-w.jpg", video: "/videos/films/zuma-w.mp4" },
  { poster: "/videos/films/posters/nike-w.jpg", video: "/videos/films/nike-w.mp4" },
  { poster: "/videos/films/posters/hera-w.jpg", video: "/videos/films/hera-w.mp4" },
  { poster: "/videos/films/posters/chasing-the-salt-w.jpg", video: "/videos/films/chasing-the-salt-w.mp4" },
  { poster: "/videos/films/posters/bts-w.jpg", video: "/videos/films/bts-w.mp4" },
  { poster: "/videos/films/posters/otoko-w.jpg", video: "/videos/films/otoko-w.mp4" },
];

const PITCH = 3.3;
const PW = 2.9;
const PH = 1.62;

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.x * 1.5 + uTime * 1.1) * 0.05;          // idle breathing
    p.z += sin(p.x * 1.1) * uVelocity * 0.5;             // bend with scroll speed
    p.y += sin(p.x * 1.9) * uVelocity * 0.12;            // skew with scroll speed
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uVelocity;
  uniform float uDim;
  varying vec2 vUv;
  void main() {
    float a = clamp(abs(uVelocity) * 0.6, 0.0, 0.03);    // RGB split grows with speed
    float r = texture2D(uTex, vUv + vec2(a, 0.0)).r;
    float g = texture2D(uTex, vUv).g;
    float b = texture2D(uTex, vUv - vec2(a, 0.0)).b;
    gl_FragColor = vec4(vec3(r, g, b) * uDim, 1.0);
  }
`;

function Band() {
  const textures = useTexture(FILMS.map((f) => f.poster));
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });

  // two repeats so the row always fills the width
  const planes = useMemo(() => {
    const arr: { tex: THREE.Texture; key: string }[] = [];
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < FILMS.length; i++) arr.push({ tex: textures[i], key: `${r}-${i}` });
    }
    return arr;
  }, [textures]);

  const N = planes.length;
  const TOTAL = N * PITCH;
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([]);
  const offset = useRef(0);
  const vel = useRef(0);

  useFrame((_, dt) => {
    const lv = getLenis()?.velocity ?? 0;
    vel.current += (lv - vel.current) * Math.min(1, dt * 6);
    const smoothed = THREE.MathUtils.clamp(vel.current * 0.012, -3, 3);
    offset.current += (1.1 + Math.abs(smoothed) * 0.9) * dt;
    const wrap = (v: number, m: number) => ((v % m) + m) % m;
    for (let i = 0; i < N; i++) {
      const m = meshes.current[i];
      if (m) m.position.x = wrap(i * PITCH - offset.current, TOTAL) - TOTAL / 2;
      const mat = mats.current[i];
      if (mat) {
        mat.uniforms.uTime.value += dt;
        mat.uniforms.uVelocity.value = smoothed;
      }
    }
  });

  return (
    <>
      {planes.map((p, i) => (
        <mesh key={p.key} ref={(el) => { meshes.current[i] = el; }}>
          <planeGeometry args={[PW, PH, 36, 20]} />
          <shaderMaterial
            ref={(el) => { mats.current[i] = el; }}
            vertexShader={VERT}
            fragmentShader={FRAG}
            uniforms={{ uTime: { value: i * 0.6 }, uVelocity: { value: 0 }, uTex: { value: p.tex }, uDim: { value: 1 } }}
          />
        </mesh>
      ))}
    </>
  );
}

// ---- Constellation mode (ref-luke-55) ----

interface NodeDef {
  x: number;
  y: number;
  z: number;     // negative = farther (smaller/dimmer); positive = nearer
  scale: number;
}

// hand-placed scatter so films orbit the centred text with believable depth:
// near (in front of text) larger & bright, far behind smaller & dim.
const NODES: NodeDef[] = [
  { x: -4.6, y: 1.7, z: -2.4, scale: 0.62 },  // far top-left
  { x: -3.9, y: -1.4, z: 0.9, scale: 1.05 },  // near left
  { x: -2.1, y: 2.0, z: -1.2, scale: 0.78 },  // mid top
  { x: -1.4, y: -2.3, z: 1.4, scale: 1.18 },  // nearest, below text
  { x: 2.0, y: 2.1, z: -1.8, scale: 0.7 },    // far top-right
  { x: 3.7, y: 0.6, z: 0.7, scale: 1.0 },     // near right
  { x: 4.8, y: -1.6, z: -2.6, scale: 0.6 },   // far bottom-right
  { x: 1.6, y: -2.0, z: 1.1, scale: 1.1 },    // near bottom
];

function ConstellationNode({ def, poster, index }: { def: NodeDef; poster: THREE.Texture; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const drift = useRef(index * 1.7);

  useFrame((_, dt) => {
    const lv = getLenis()?.velocity ?? 0;
    const smoothed = THREE.MathUtils.clamp(lv * 0.012, -3, 3);
    // CONSTANT motion — the field is always alive, with or without scroll:
    // each film orbits, floats, bobs in depth, tilts in 3D and pulses.
    drift.current += dt * 0.4;
    const t = drift.current;
    const m = mesh.current;
    if (m) {
      m.position.x = def.x + Math.sin(t * 0.6 + index) * 0.55;
      m.position.y = def.y + Math.cos(t * 0.45 + index * 1.3) * 0.46;
      m.position.z = def.z + Math.sin(t * 0.5 + index) * 0.45;
      m.rotation.z = Math.sin(t * 0.3 + index) * 0.05;
      m.rotation.y = Math.sin(t * 0.24 + index) * 0.08;
      m.scale.setScalar(def.scale * (1 + Math.sin(t * 0.7 + index) * 0.04));
    }
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt;
      mat.current.uniforms.uVelocity.value = smoothed;
      const depthDim = THREE.MathUtils.clamp(0.5 + (def.z + 2.6) * 0.16, 0.42, 1.0);
      mat.current.uniforms.uDim.value = depthDim;
    }
  });

  return (
    <mesh ref={mesh} position={[def.x, def.y, def.z]} scale={def.scale}>
      <planeGeometry args={[PW, PH, 28, 16]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{ uTime: { value: index * 0.7 }, uVelocity: { value: 0 }, uTex: { value: poster }, uDim: { value: 1 } }}
      />
    </mesh>
  );
}

function Constellation() {
  const textures = useTexture(FILMS.map((f) => f.poster));
  textures.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; });
  const { camera } = useThree();
  const tilt = useRef(0);
  const time = useRef(0);

  // slow CONTINUOUS camera drift so the whole 3D field parallaxes on its own,
  // with or without scroll (plus a velocity nudge while scrolling).
  useFrame((_, dt) => {
    time.current += dt;
    const lv = getLenis()?.velocity ?? 0;
    tilt.current += (THREE.MathUtils.clamp(lv * 0.0006, -0.3, 0.3) - tilt.current) * Math.min(1, dt * 3);
    const tx = Math.sin(time.current * 0.12) * 0.9 + tilt.current * 1.4;
    const ty = Math.cos(time.current * 0.09) * 0.5;
    camera.position.x += (tx - camera.position.x) * Math.min(1, dt * 2.5);
    camera.position.y += (ty - camera.position.y) * Math.min(1, dt * 2.5);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {NODES.map((def, i) => (
        <ConstellationNode key={i} def={def} poster={textures[i]} index={i} />
      ))}
    </>
  );
}

interface FilmBandGLProps {
  mode?: "band" | "constellation";
  active?: boolean;
}

export default function FilmBandGL({ mode = "band", active = true }: FilmBandGLProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, mode === "constellation" ? 7.2 : 5.4], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        {mode === "constellation" ? <Constellation /> : <Band />}
      </Suspense>
    </Canvas>
  );
}
