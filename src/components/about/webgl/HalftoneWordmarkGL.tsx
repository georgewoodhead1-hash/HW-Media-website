"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getLenis } from "@/lib/lenis";

// Halftone wordmark backing (ref-luke-97 footer halftone). A single full-bleed
// plane runs harry-bw.jpg through a dot-matrix fragment shader so it reads as
// graphic TEXTURE, never as footage (constraint: no full-screen background
// video). A `uResolve` uniform (0 = full dots, 1 = sharp photo) is driven on
// scroll for the hero -> founder morph: the dots melt into the real portrait.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// luminance-driven halftone: each cell draws a dot whose radius tracks the
// underlying image brightness. uResolve crossfades dots -> raw image.
const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uResolve;
  uniform float uCells;
  uniform vec3 uTint;
  uniform float uTime;
  varying vec2 vUv;

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec3 src = texture2D(uTex, vUv).rgb;

    // halftone grid
    vec2 grid = vUv * uCells;
    vec2 cell = floor(grid);
    vec2 center = (cell + 0.5) / uCells;
    vec3 cellColor = texture2D(uTex, center).rgb;
    float l = luma(cellColor);
    float radius = (1.0 - l) * 0.62;                 // dark = bigger dot
    float d = distance(fract(grid), vec2(0.5));
    float dot = 1.0 - smoothstep(radius - 0.06, radius + 0.02, d);
    vec3 dotColor = mix(vec3(0.0), uTint, dot) * (0.5 + l);

    // crossfade halftone -> sharp source on resolve
    vec3 col = mix(dotColor, src * 0.9, smoothstep(0.0, 1.0, uResolve));

    // overall low presence so it sits behind the wordmark
    float pres = mix(0.5, 0.85, uResolve);
    gl_FragColor = vec4(col * pres, 1.0);
  }
`;

function Plane({ src, tint, resolveOnScroll }: { src: string; tint: [number, number, number]; resolveOnScroll: boolean }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const resolve = useRef(0);

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    if (!resolveOnScroll) return;
    // hero only: resolve dots into the sharp portrait as the section scrolls
    // toward the founder frame (the hero -> founder morph).
    const lenis = getLenis();
    const scroll = lenis ? (lenis.scroll || 0) : (typeof window !== "undefined" ? window.scrollY : 0);
    const vh = typeof window !== "undefined" ? window.innerHeight : 1;
    const target = THREE.MathUtils.clamp(scroll / (vh * 0.85), 0, 1);
    resolve.current += (target - resolve.current) * Math.min(1, dt * 3);
    mat.current.uniforms.uResolve.value = resolve.current;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTex: { value: tex },
          uResolve: { value: 0 },
          uCells: { value: 150 },
          uTint: { value: new THREE.Vector3(...tint) },
          uTime: { value: 0 },
        }}
      />
    </mesh>
  );
}

interface HalftoneWordmarkGLProps {
  src?: string;
  // tint of the dots — HW gold by default
  tint?: [number, number, number];
  // hero uses scroll to resolve dots -> photo; footer stays dotted
  resolveOnScroll?: boolean;
  active?: boolean;
}

export default function HalftoneWordmarkGL({
  src = "/images/harry-bw.jpg",
  tint = [0.749, 0.667, 0.325],
  resolveOnScroll = false,
  active = true,
}: HalftoneWordmarkGLProps) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Plane src={src} tint={tint} resolveOnScroll={resolveOnScroll} />
      </Suspense>
    </Canvas>
  );
}
