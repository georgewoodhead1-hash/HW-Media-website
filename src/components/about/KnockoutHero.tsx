"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Task 1 — the name IS the work. The colossal "HW MEDIA" wordmark is filled with
// a cinematic film still (background-clip:text), and the still slowly pans inside
// the letters (Ken Burns = constant motion). On scroll the wordmark parallaxes.
// Original device, on-brand (the company literally made of its footage), a still
// not a big video. Dark surround, gold dot.
const STILL = "/videos/films/posters/mclaren-w.jpg";

export default function KnockoutHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // constant Ken Burns pan of the still inside the letters
      gsap.fromTo(
        "[data-knock]",
        { backgroundSize: "118%", backgroundPosition: "42% 42%" },
        { backgroundSize: "138%", backgroundPosition: "60% 56%", duration: 16, ease: "sine.inOut", repeat: -1, yoyo: true },
      );
      // load reveal + the quiet line
      gsap.from("[data-knock]", { autoAlpha: 0, yPercent: 16, duration: 1.4, ease: "power4.out", delay: 0.2 });
      gsap.from("[data-hero-line]", { autoAlpha: 0, y: 24, duration: 1, ease: "power3.out", delay: 0.6 });
      // parallax the whole lockup up on scroll
      gsap.to("[data-knock-wrap]", { yPercent: -14, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.8 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-screen flex-col justify-end overflow-hidden px-5 pb-[12vh] pt-[24vh] md:px-10">
      <p data-hero-line className="about-body mb-8 max-w-md text-[clamp(1rem,1.6vw,1.3rem)] leading-[1.4] text-[#f5f1e6]/85">
        A creative media company making films for brands.
      </p>
      <div data-knock-wrap className="flex items-end" style={{ willChange: "transform" }}>
        <h1
          data-knock
          className="about-display leading-[0.8]"
          style={{
            fontSize: "clamp(4rem,20vw,18rem)",
            backgroundImage: `url(${STILL})`,
            backgroundSize: "120%",
            backgroundPosition: "50% 45%",
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          HW&nbsp;MEDIA
        </h1>
        <span className="mb-[0.12em] ml-[0.06em] inline-block aspect-square w-[0.1em] shrink-0 rounded-full" style={{ background: "var(--gold-text)", fontSize: "clamp(4rem,20vw,18rem)" }} />
      </div>
    </section>
  );
}
