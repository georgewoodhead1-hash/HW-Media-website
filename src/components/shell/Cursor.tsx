"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Custom cursor: crosshair dot everywhere on fine pointers,
// morphs to a PLAY pill over [data-cursor="play"] surfaces.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"dot" | "play">("dot");

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "expo.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const playTarget = (e.target as HTMLElement | null)?.closest?.('[data-cursor="play"]');
      setMode(playTarget ? "play" : "dot");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ${
          mode === "play"
            ? "h-16 w-16 bg-[var(--cream)] text-[var(--black)]"
            : "h-2.5 w-2.5 bg-[var(--gold)]"
        }`}
        style={{ transitionTimingFunction: "var(--ease-expo)" }}
      >
        {mode === "play" && <span className="label-mono text-[9px]">Play</span>}
      </div>
    </div>
  );
}
