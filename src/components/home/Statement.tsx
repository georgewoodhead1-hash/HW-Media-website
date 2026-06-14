"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// 01 — the line. Luke restraint: one small refined line adrift in a vast
// field of black. It emerges from the dark the lens leaves behind, types
// itself as it passes the centre, then dissolves toward the films. No
// wall of huge type, no logo band — almost nothing on the screen.

const LINE = "A London film studio for brands that refuse to be ordinary.";
const GOLD_FROM = 6; // word index where the gold tail begins ("refuse…")

export default function Statement() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // type in as it rises to centre
      gsap.fromTo(
        ".st-word",
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".st-line", start: "top 82%", end: "top 42%", scrub: 0.8 },
        },
      );
      // the whole line drifts the full pass — a continuous glide, never parked
      gsap.fromTo(
        ".st-line",
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.9 },
        },
      );
      // and softly fades as it leaves, handing the screen to the films
      gsap.fromTo(
        ".st-line",
        { opacity: 1 },
        {
          opacity: 0.18,
          ease: "none",
          scrollTrigger: { trigger: root, start: "center top", end: "bottom top", scrub: 0.8 },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-chapter="01 — The studio"
      className="relative flex min-h-[125vh] flex-col justify-center px-5 md:px-10"
      aria-label="A London film studio"
    >
      <span className="label-mono absolute left-5 top-[20vh] text-[10px] tracking-[0.28em] opacity-35 md:left-10">
        (01)
      </span>

      <p className="st-line font-accent max-w-3xl text-[clamp(1.4rem,1rem+1.5vw,2.5rem)] leading-[1.32] text-[#f5f1e6] will-change-transform">
        {LINE.split(" ").map((w, i) => (
          <span key={i} className={`st-word ${i >= GOLD_FROM ? "text-[var(--gold)]" : ""}`}>
            {w}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
