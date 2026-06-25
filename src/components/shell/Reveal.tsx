"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

// Reveal-as-you-reach-it (client): section content unveils — rises + fades +
// clips up from the bottom — as it enters the viewport, instead of just
// hard-appearing on scroll. One-shot, motion-safe, fully cleaned up.
export default function Reveal({
  children,
  className,
  y = 56,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y, clipPath: "inset(0% 0% 16% 0%)" },
      {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.15,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 58%", scrub: 0.85 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
