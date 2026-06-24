"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getLenis } from "@/lib/lenis";

// Founder warping portrait (Scene 02). Single plane, harry-color.jpg, the same
// velocity-driven vertex displacement + RGB-shift as FilmBandGL, plus an optional
// duotone push toward HW gold in shadows. Gentle, premium, scrubbed to scroll.

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.y * 1.4 + uTime * 0.8) * 0.04;
    p.z += sin(p.y * 1.0) * uVelocity * 0.4;
    p.x += sin(p.y * 1.6) * uVelocity * 0.07;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uVelocity;
  uniform float uDuo;
  uniform vec3 uGold;
  varying vec2 vUv;
  float luma(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }
  void main() {
    float a = clamp(abs(uVelocity) * 0.5, 0.0, 0.022);
    float r = texture2D(uTex, vUv + vec2(a, 0.0)).r;
    float g = texture2D(uTex, vUv).g;
    float b = texture2D(uTex, vUv - vec2(a, 0.0)).b;
    vec3 col = vec3(r, g, b);
    // duotone: lift the shadows toward gold so it reads as graded media
    float l = luma(col);
    vec3 duo = mix(vec3(0.04,0.035,0.03), uGold, smoothstep(0.0, 0.85, l));
    col = mix(col, duo, uDuo);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ src, duo }: { src: string; duo: number }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const vel = useRef(0);

  // fit the 4:5 plane to the container, cover-style
  const img = tex.image as HTMLImageElement | undefined;
  const aspect = img && img.width ? img.width / img.height : 0.8;
  const vAspect = viewport.width / viewport.height;
  let w = viewport.width;
  let h = viewport.height;
  if (vAspect > aspect) { h = viewport.width / aspect; } else { w = viewport.height * aspect; }

  useFrame((_, dt) => {
    const lv = getLenis()?.velocity ?? 0;
    vel.current += (lv - vel.current) * Math.min(1, dt * 6);
    const smoothed = THREE.MathUtils.clamp(vel.current * 0.012, -3, 3);
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt;
      mat.current.uniforms.uVelocity.value = smoothed;
    }
  });

  return (
    <mesh scale={[w, h, 1]}>
      <planeGeometry args={[1, 1, 40, 50]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTex: { value: tex },
          uVelocity: { value: 0 },
          uTime: { value: 0 },
          uDuo: { value: duo },
          uGold: { value: new THREE.Vector3(0.749, 0.667, 0.325) },
        }}
      />
    </mesh>
  );
}

interface PortraitWarpGLProps {
  src?: string;
  duo?: number;
  active?: boolean;
}

export default function PortraitWarpGL({ src = "/images/harry-color.jpg", duo = 0.32, active = true }: PortraitWarpGLProps) {
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
        <Plane src={src} duo={duo} />
      </Suspense>
    </Canvas>
  );
}
