"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Luke chrome — a thin scroll-progress rail on the right edge with a gold fill,
// plus a live percentage counter beside it. Ties the whole page together as one
// continuous piece (Luke's "(39)" / "(78)" counter + edge rail).
export default function ProgressRail() {
  const fill = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
        if (num.current) num.current.textContent = `(${String(Math.round(self.progress * 100)).padStart(2, "0")})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      <div className="relative h-[34vh] w-px bg-[var(--fg)]/12">
        <div ref={fill} className="absolute inset-x-0 top-0 h-full origin-top bg-[var(--gold-text)]" style={{ transform: "scaleY(0)" }} />
      </div>
      <span ref={num} className="about-label text-[var(--fg)]/40">(00)</span>
    </div>
  );
}
