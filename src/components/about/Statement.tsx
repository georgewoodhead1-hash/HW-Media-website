"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Task 2 — what HW Media is. A monumental statement whose lines rise out of clip
// masks on a scrubbed timeline (smooth), gold on the last phrase, with the brands
// in prose under it. No film. Bar's value register.
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-s-line]", { yPercent: 112, ease: "none", stagger: 0.08, scrollTrigger: { trigger: "[data-s-statement]", start: "top 80%", end: "top 40%", scrub: 0.6 } });
      gsap.from("[data-s-copy]", { autoAlpha: 0, y: 26, ease: "none", scrollTrigger: { trigger: "[data-s-copy]", start: "top 88%", end: "top 58%", scrub: 0.5 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[18vh] md:px-10">
      <h2 data-s-statement className="about-display max-w-4xl text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5.6vw,4.8rem)", lineHeight: 0.99 }}>
        <span className="block overflow-hidden"><span data-s-line className="block">We make brand films</span></span>
        <span className="block overflow-hidden"><span data-s-line className="block">that feel more cinematic,</span></span>
        <span className="block overflow-hidden"><span data-s-line className="block">more considered, and more</span></span>
        <span className="block overflow-hidden"><span data-s-line className="block text-[var(--gold-text)]">worth remembering.</span></span>
      </h2>
      <p data-s-copy className="about-body mt-12 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-[#f5f1e6]/80">
        We make films for performance and legacy brands, on location wherever the story actually happens. McLaren, Aston Martin, Nike, Salomon, Defender, and the names that expect the work to be remembered.
      </p>
    </section>
  );
}
