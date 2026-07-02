"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// The 1820-style drawn divider: a hairline that EXPANDS across the page as you
// scroll to it (scaleX 0 → 1, scrubbed) — replaces every static white line.
// One of the "little lines that link the sections" George asked for. No text.
export default function Rule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        transformOrigin: "center center",
        scrollTrigger: { trigger: el, start: "top 96%", end: "top 30%", scrub: 1.3 },
      },
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`block h-px w-full bg-[var(--fg)]/50 will-change-transform ${className}`}
    />
  );
}
