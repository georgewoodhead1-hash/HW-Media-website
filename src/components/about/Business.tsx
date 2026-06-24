"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// What HW Media is. A smooth scrubbed statement (lines rise out of masks) about
// the company, a film that wipes open as you scroll, and the brands in prose.
// Bar's value register, one type family, no accent face.
export default function Business() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-b-line]", { yPercent: 112, ease: "none", stagger: 0.08, scrollTrigger: { trigger: "[data-b-statement]", start: "top 82%", end: "top 42%", scrub: 0.6 } });
      gsap.fromTo("[data-b-film]", { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none", scrollTrigger: { trigger: "[data-b-film]", start: "top 88%", end: "top 38%", scrub: 0.7 } });
      gsap.from("[data-b-copy]", { autoAlpha: 0, y: 28, ease: "none", scrollTrigger: { trigger: "[data-b-copy]", start: "top 90%", end: "top 60%", scrub: 0.5 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[16vh] md:px-10">
      <h2 data-b-statement className="about-display max-w-4xl text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5.5vw,4.6rem)", lineHeight: 0.99 }}>
        <span className="block overflow-hidden"><span data-b-line className="block">HW Media makes brand films</span></span>
        <span className="block overflow-hidden"><span data-b-line className="block">that feel more cinematic,</span></span>
        <span className="block overflow-hidden"><span data-b-line className="block">more considered, and more</span></span>
        <span className="block overflow-hidden"><span data-b-line className="block text-[var(--gold-text)]">worth remembering.</span></span>
      </h2>

      <div className="mt-16 overflow-hidden rounded-sm md:mt-24">
        <div data-b-film data-cursor="Showreel" style={{ willChange: "clip-path, transform" }}>
          <video src="/videos/films/mclaren-w.mp4" poster="/videos/films/posters/mclaren-w.jpg" autoPlay muted loop playsInline aria-label="HW Media showreel" className="aspect-[16/8] w-full object-cover" />
        </div>
      </div>

      <p data-b-copy className="about-body mt-10 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-[#f5f1e6]/80">
        We make films for performance and legacy brands, on location wherever the story actually happens. McLaren, Aston Martin, Nike, Salomon, Defender, and the names that expect the work to be remembered.
      </p>
    </section>
  );
}
