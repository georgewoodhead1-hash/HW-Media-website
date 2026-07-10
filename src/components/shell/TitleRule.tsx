"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Centred section title with DYNAMIC lines either side of the words (client
// final round): the two hairlines draw OUTWARD from the title as the section
// arrives, with the house + marks at the outer ends.
export default function TitleRule({ title, className = "" }: { title: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const left = el.querySelector(".tr-line-l");
    const right = el.querySelector(".tr-line-r");
    const plus = el.querySelectorAll(".tr-plus");
    const word = el.querySelector(".tr-word");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 92%", end: "top 40%", scrub: 1.2 },
    });
    tl.fromTo(word, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, ease: "none" }, 0)
      .fromTo(left, { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "right center" }, 0.15)
      .fromTo(right, { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "left center" }, 0.15)
      .fromTo(plus, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, ease: "none" }, 0.7);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <div ref={ref} className={`flex items-center gap-4 md:gap-6 ${className}`}>
      <style>{`@keyframes trSpin { to { transform: rotate(360deg); } } .tr-plus{ animation: trSpin 26s linear infinite; } @media (prefers-reduced-motion: reduce){ .tr-plus{ animation: none; } }`}</style>
      <span aria-hidden className="tr-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
      <span aria-hidden className="tr-line-l block h-px flex-1 bg-[var(--fg)] will-change-transform" />
      <h2 className="tr-word blink-title font-display shrink-0 text-center text-[clamp(1.8rem,3.6vw,3.4rem)] leading-none">
        {title}
      </h2>
      <span aria-hidden className="tr-line-r block h-px flex-1 bg-[var(--fg)] will-change-transform" />
      <span aria-hidden className="tr-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
    </div>
  );
}
