"use client";

import dynamic from "next/dynamic";

// Client-only mount for the single persistent world canvas (R3F can't SSR).
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function SceneCanvasMount() {
  return <SceneCanvas />;
}
