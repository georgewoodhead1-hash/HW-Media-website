"use client";

import { createElement, useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

// Reusable scroll-typewriter heading. The text "types itself across" as the
// section scrolls into view — each character lights up left to right, tied to
// scroll position (scrubbed), the same effect as the finale line. Pass the
// text as a string; mark any words that should be gold via `gold`.

interface ScrollTypeProps {
  children: string;
  className?: string;
  gold?: string[];           // words rendered in gold
  as?: "h1" | "h2" | "h3" | "p";
  start?: string;
  end?: string;
  style?: React.CSSProperties;
}

export default function ScrollType({
  children,
  className = "",
  gold = [],
  as = "h2",
  start = "top 88%",
  end = "top 46%",
  style,
}: ScrollTypeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const split = new SplitText(el, { type: "chars", charsClass: "st-char" });
    gsap.set(split.chars, { autoAlpha: 0 });
    const tween = gsap.to(split.chars, {
      autoAlpha: 1,
      ease: "none",
      stagger: 0.45,
      scrollTrigger: { trigger: el, start, end, scrub: 0.9 },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [children, start, end]);

  const goldSet = new Set(gold.map((g) => g.toLowerCase()));
  const words = children.split(" ");

  return createElement(
    as,
    { ref, className, style },
    words.map((w, i) => {
      const isGold = goldSet.has(w.replace(/[^a-zA-Z]/g, "").toLowerCase());
      return (
        <span key={i} className={isGold ? "text-[var(--gold)]" : undefined}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      );
    }),
  );
}
