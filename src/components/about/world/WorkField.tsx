"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// The work "toy" (Floema/Trionn DNA): HW's films as a field of planes in 3D that
// float on their own AND can be grabbed and FLUNG. Drag a film, let go, it keeps
// going with inertia then springs back home. Lives on the one persistent canvas;
// fades in only while the Work section is on screen (read from #ch-work's rect,
// so no hard-coded scroll math) and its planes don't render when faded out.

const FILMS = [
  "/videos/films/posters/mclaren-w.jpg",
  "/videos/films/posters/salomon-w.jpg",
  "/videos/films/posters/zuma-w.jpg",
  "/videos/films/posters/nike-w.jpg",
  "/videos/films/posters/hera-w.jpg",
  "/videos/films/posters/chasing-the-salt-w.jpg",
  "/videos/films/posters/bts-w.jpg",
  "/videos/films/posters/otoko-w.jpg",
];

const HOMES: [number, number, number][] = [
  [-3.6, 1.5, 0.2],
  [-3.2, -1.4, 0.8],
  [-1.2, 0.6, -0.6],
  [0.1, -1.8, 0.4],
  [1.4, 1.7, -0.4],
  [3.3, 0.5, 0.6],
  [3.7, -1.6, -0.8],
  [1.1, 1.1, 1.0],
];

const PW = 2.35;
const PH = 1.32;

interface PlaneState {
  home: THREE.Vector3;
  pos: THREE.Vector3;
  prev: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
}

export default function WorkField() {
  const textures = useTexture(FILMS);
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));

  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const { camera, pointer } = useThree();

  const planes = useMemo<PlaneState[]>(
    () =>
      HOMES.map((h, i) => ({
        home: new THREE.Vector3(...h),
        pos: new THREE.Vector3(...h),
        prev: new THREE.Vector3(...h),
        vel: new THREE.Vector3(),
        phase: i * 1.7,
      })),
    [],
  );

  const grabbed = useRef(-1);
  const hovered = useRef(-1);
  const opacity = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ptrWorld = useRef(new THREE.Vector3());

  useEffect(() => {
    const up = () => { grabbed.current = -1; };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    // fade by how centred #ch-work is in the viewport
    const sec = document.getElementById("ch-work");
    let target = 0;
    if (sec) {
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const dist = Math.abs(r.top + r.height / 2 - vh / 2) / vh;
      target = THREE.MathUtils.clamp(1 - dist * 1.6, 0, 1);
    }
    opacity.current += (target - opacity.current) * Math.min(1, d * 4);
    if (group.current) group.current.visible = opacity.current > 0.01;

    if (grabbed.current >= 0) {
      const gp = planes[grabbed.current];
      dragPlane.constant = -gp.home.z;
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(dragPlane, ptrWorld.current);
    }

    const t = state.clock.elapsedTime;
    planes.forEach((pl, i) => {
      const m = meshes.current[i];
      if (!m) return;
      pl.prev.copy(pl.pos);
      const bobX = Math.sin(t * 0.5 + pl.phase) * 0.16;
      const bobY = Math.cos(t * 0.42 + pl.phase) * 0.13;
      if (grabbed.current === i) {
        pl.pos.lerp(ptrWorld.current, Math.min(1, d * 14));
      } else {
        // inertia, then spring back to the floating home
        pl.pos.addScaledVector(pl.vel, d);
        const homeX = pl.home.x + bobX;
        const homeY = pl.home.y + bobY;
        pl.vel.x += (homeX - pl.pos.x) * 6 * d;
        pl.vel.y += (homeY - pl.pos.y) * 6 * d;
        pl.vel.z += (pl.home.z - pl.pos.z) * 6 * d;
        pl.vel.multiplyScalar(Math.pow(0.82, d * 60));
      }
      // velocity estimate (for the fling on release)
      if (grabbed.current === i) pl.vel.copy(pl.pos).sub(pl.prev).multiplyScalar(1 / Math.max(d, 0.001));
      m.position.copy(pl.pos);
      const hov = hovered.current === i ? 1.12 : 1;
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x || 1, hov, Math.min(1, d * 8)));
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity.current * (hovered.current === -1 || hovered.current === i ? 1 : 0.45);
    });
  });

  return (
    <group ref={group} visible={false}>
      {planes.map((pl, i) => (
        <mesh
          key={i}
          ref={(el) => { meshes.current[i] = el; }}
          position={pl.home}
          onPointerDown={(e) => { e.stopPropagation(); grabbed.current = i; }}
          onPointerOver={(e) => { e.stopPropagation(); hovered.current = i; document.body.dataset.workhover = "1"; }}
          onPointerOut={() => { hovered.current = -1; delete document.body.dataset.workhover; }}
        >
          <planeGeometry args={[PW, PH]} />
          <meshBasicMaterial map={textures[i]} transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
