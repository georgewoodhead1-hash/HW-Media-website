"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Task 2 (polish) — what HW Media is. Two-column so it uses the full width (no
// dead right void): the monumental scrubbed statement left, a tall still that
// wipes open + parallaxes right. Brighter display gold on the last line.
export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-s-line]", { yPercent: 112, ease: "none", stagger: 0.08, scrollTrigger: { trigger: "[data-s-statement]", start: "top 80%", end: "top 40%", scrub: 0.6 } });
      gsap.fromTo("[data-s-still]", { clipPath: "inset(0% 0% 100% 0%)", yPercent: 14 }, { clipPath: "inset(0% 0% 0% 0%)", yPercent: -14, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.7 } });
      gsap.from("[data-s-copy]", { autoAlpha: 0, y: 26, ease: "none", scrollTrigger: { trigger: "[data-s-copy]", start: "top 88%", end: "top 58%", scrub: 0.5 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[18vh] md:px-10">
      <div className="grid items-center gap-12 md:grid-cols-[1.32fr_0.68fr] md:gap-16">
        <h2 data-s-statement className="about-display text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5.8vw,5rem)", lineHeight: 0.99 }}>
          <span className="block overflow-hidden"><span data-s-line className="block">We make brand films</span></span>
          <span className="block overflow-hidden"><span data-s-line className="block">that feel more cinematic,</span></span>
          <span className="block overflow-hidden"><span data-s-line className="block">more considered, and more</span></span>
          <span className="block overflow-hidden"><span data-s-line className="gold-lg block">worth remembering.</span></span>
        </h2>
        <div data-s-still className="hidden overflow-hidden rounded-sm md:block" style={{ willChange: "clip-path, transform" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/videos/films/posters/salomon-w.jpg" alt="" aria-hidden className="aspect-[3/4] w-full object-cover ring-1 ring-[var(--hairline-dark)]" />
        </div>
      </div>

      <p data-s-copy className="about-body mt-12 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-[#f5f1e6]/80">
        We make films for performance and legacy brands, on location wherever the story actually happens. McLaren, Aston Martin, Nike, Salomon, Defender, and the names that expect the work to be remembered.
      </p>
    </section>
  );
}
