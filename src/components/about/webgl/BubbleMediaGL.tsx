"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getLenis } from "@/lib/lenis";

// Contact bubble media (ref-luke-85). A duotone (gold/dark) Harry-on-location
// frame masked to a CIRCLE inside the plane, with the FilmBand velocity warp.
// The DOM wrapper handles the rise + clip reveal; this just renders the masked
// duotone media that fills the circular bubble.

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += sin(p.x * 1.4 + uTime) * 0.03;
    p.z += sin(p.x * 1.0) * uVelocity * 0.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uVelocity;
  uniform vec3 uGold;
  varying vec2 vUv;
  float luma(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }
  void main() {
    // circular mask centred in the plane
    float d = distance(vUv, vec2(0.5));
    float mask = 1.0 - smoothstep(0.49, 0.5, d);
    if (mask < 0.01) discard;

    float a = clamp(abs(uVelocity) * 0.5, 0.0, 0.02);
    float r = texture2D(uTex, vUv + vec2(a, 0.0)).r;
    float g = texture2D(uTex, vUv).g;
    float b = texture2D(uTex, vUv - vec2(a, 0.0)).b;
    float l = luma(vec3(r,g,b));
    // gold/dark duotone
    vec3 col = mix(vec3(0.05,0.04,0.03), uGold, smoothstep(0.05, 0.95, l));
    gl_FragColor = vec4(col, mask);
  }
`;

function Plane({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const vel = useRef(0);
  const size = Math.min(viewport.width, viewport.height);

  useFrame((_, dt) => {
    const lv = getLenis()?.velocity ?? 0;
    vel.current += (lv - vel.current) * Math.min(1, dt * 6);
    const smoothed = THREE.MathUtils.clamp(vel.current * 0.012, -3, 3);
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt;
      mat.current.uniforms.uVelocity.value = smoothed;
      // continuous breathing pulse so the bubble is alive without scroll
      const pulse = 1 + Math.sin(mat.current.uniforms.uTime.value * 1.15) * 0.035;
      if (mesh.current) mesh.current.scale.setScalar(size * pulse);
    }
  });

  return (
    <mesh ref={mesh} scale={[size, size, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={mat}
        transparent
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTex: { value: tex },
          uVelocity: { value: 0 },
          uTime: { value: 0 },
          uGold: { value: new THREE.Vector3(0.749, 0.667, 0.325) },
        }}
      />
    </mesh>
  );
}

export default function BubbleMediaGL({ src = "/images/harry-bw.jpg", active = true }: { src?: string; active?: boolean }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Plane src={src} />
      </Suspense>
    </Canvas>
  );
}
