"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onReveal, prefersReducedMotion } from "./data";

// Bennett&Clive: the wordmark splits and pins to the viewport edges — the whole
// site lives inside the logo. HW rides the left edge, MEDIA the right.
// mix-blend-difference keeps it legible over bright footage without ever
// fighting the content (it is pinned to the 12px gutters, outside every
// content column). Hidden on mobile.
export default function Wordmark() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll(".v2-wm"), { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(".v2-wm", { autoAlpha: 0, y: 24 });
    }, el);
    const off = onReveal(() => {
      gsap.to(el.querySelectorAll(".v2-wm"), {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.55,
      });
    });
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="hidden md:block">
      <div className="pointer-events-none fixed inset-y-0 left-3 z-40 flex items-center mix-blend-difference">
        <span
          className="v2-wm font-display rotate-180 text-[14px] tracking-[0.4em] text-white/55"
          style={{ writingMode: "vertical-rl" }}
        >
          HW
        </span>
      </div>
      <div className="pointer-events-none fixed inset-y-0 right-3 z-40 flex items-center mix-blend-difference">
        <span
          className="v2-wm font-display text-[14px] tracking-[0.4em] text-white/55"
          style={{ writingMode: "vertical-rl" }}
        >
          MEDIA
        </span>
      </div>
    </div>
  );
}
