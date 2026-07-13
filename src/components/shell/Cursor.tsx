"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Custom cursor (client final round): a thin hollow GOLD circle with a
// little gold dot in the middle on fine pointers; morphs to a PLAY pill
// over [data-cursor="play"] surfaces.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  // invisible until the pointer actually moves — otherwise the ring idles
  // at 0,0 as a stray arc in the corner on every fresh load (polish review)
  const [seen, setSeen] = useState(false);
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
      setSeen(true);
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
      className={`pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 ${seen ? "" : "opacity-0"}`}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ${
          mode === "play"
            ? "h-16 w-16 bg-[var(--cream)] text-[var(--black)] shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
            : "h-6 w-6 border border-[var(--gold-accent)] bg-transparent"
        }`}
        style={{ transitionTimingFunction: "var(--ease-expo)" }}
      >
        {mode === "play" ? (
          <span className="label-mono text-[9px]">Play</span>
        ) : (
          <span className="h-[3px] w-[3px] rounded-full bg-[var(--gold-accent)]" />
        )}
      </div>
    </div>
  );
}
