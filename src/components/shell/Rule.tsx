"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// The 1820 hairline grammar: a line that draws FROM THE CENTRE outward with a
// small + mark at each end (and an optional tiny centred label). The one
// repeating divider used sitewide — no other separators.
export default function Rule({ className = "", label, bg = "var(--bg)", fast = false }: { className?: string; label?: string; bg?: string; fast?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const line = el.querySelector(".rule-line");
    const plus = el.querySelectorAll(".rule-plus");
    const lab = el.querySelector(".rule-label");
    const tl = gsap.timeline({
      // fast = fully drawn while still low in the viewport (George: the
      // trusted-by closing line "takes too long to load in")
      scrollTrigger: { trigger: el, start: "top 96%", end: fast ? "top 72%" : "top 30%", scrub: fast ? 0.5 : 1.3 },
    });
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "center center" }, 0)
      .fromTo(plus, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, ease: "none" }, 0.5);
    if (lab) tl.fromTo(lab, { autoAlpha: 0, letterSpacing: "0.55em" }, { autoAlpha: 1, letterSpacing: "0.22em", ease: "none" }, 0.25);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [fast]);

  return (
    <div ref={ref} aria-hidden className={`relative flex items-center gap-3 ${className}`}>
      <style>{`@keyframes ruleSpin { to { transform: rotate(360deg); } } .rule-plus{ animation: ruleSpin 26s linear infinite; } @media (prefers-reduced-motion: reduce){ .rule-plus{ animation: none; } }`}</style>
      <span className="rule-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
      <span className="rule-line block h-px flex-1 bg-[var(--fg)] will-change-transform" />
      {label && (
        <span
          className="rule-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[11px] uppercase tracking-[0.22em] text-[var(--fg)]"
          style={{ fontFamily: "var(--font-firma), sans-serif", backgroundColor: bg }}
        >
          {label}
        </span>
      )}
      <span className="rule-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
    </div>
  );
}
