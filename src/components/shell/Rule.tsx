"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// The 1820 hairline grammar: a line that draws FROM THE CENTRE outward with a
// small + mark at each end (and an optional tiny centred label). The one
// repeating divider used sitewide — no other separators.
export default function Rule({ className = "", label, bg = "#050505" }: { className?: string; label?: string; bg?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const line = el.querySelector(".rule-line");
    const plus = el.querySelectorAll(".rule-plus");
    const lab = el.querySelector(".rule-label");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 96%", end: "top 30%", scrub: 1.3 },
    });
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "center center" }, 0)
      .fromTo(plus, { autoAlpha: 0, rotate: -90 }, { autoAlpha: 1, rotate: 0, ease: "none" }, 0.55);
    if (lab) tl.fromTo(lab, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none" }, 0.3);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <div ref={ref} aria-hidden className={`relative flex items-center gap-3 ${className}`}>
      <span className="rule-plus shrink-0 text-[15px] leading-none text-[var(--fg)]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
      <span className="rule-line block h-px flex-1 bg-[var(--fg)]/40 will-change-transform" />
      {label && (
        <span
          className="rule-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[11px] uppercase tracking-[0.22em] text-[var(--fg)]/55"
          style={{ fontFamily: "var(--font-firma), sans-serif", backgroundColor: bg }}
        >
          {label}
        </span>
      )}
      <span className="rule-plus shrink-0 text-[15px] leading-none text-[var(--fg)]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
    </div>
  );
}
