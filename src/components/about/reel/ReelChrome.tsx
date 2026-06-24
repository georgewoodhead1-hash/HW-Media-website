"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// THE REEL — persistent chrome (oceanfilms.com.br near-zero UI): a vertical
// wordmark up the left edge, a live counter, and a hairline scroll-progress bar
// across the foot that fills gold. Edges only, so it never crosses the footage type.
export default function ReelChrome() {
  const fill = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
        if (num.current) num.current.textContent = String(Math.round(self.progress * 100)).padStart(2, "0");
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <span className="about-label absolute left-3 top-1/2 hidden -translate-y-1/2 text-[var(--fg)]/40 md:block" style={{ writingMode: "vertical-rl" }}>
        HW Media — Reel 2025
      </span>
      <div className="absolute bottom-4 right-4 hidden items-center gap-2 about-label text-[var(--fg)]/40 md:flex">
        <span ref={num}>00</span>
        <span>/ 100</span>
      </div>
      <div className="absolute bottom-0 left-0 h-px w-full bg-[var(--fg)]/12">
        <div ref={fill} className="h-full w-full origin-left bg-[var(--gold-text)]" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
