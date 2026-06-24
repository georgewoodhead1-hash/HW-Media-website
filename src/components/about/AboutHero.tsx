"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

// About hero — Bar Studios editorial: a huge "ABOUT" on a clean light surface,
// the letters clip-rising on load and drifting on scroll, a one-line statement
// and a wide film still that wipes open. Light, spacious, confident. Archivo
// expanded stands in for Owners Wide.
export default function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const h = el.querySelector<HTMLElement>("[data-hero-h]");
      let split: SplitText | null = null;
      if (h) {
        split = new SplitText(h, { type: "chars", charsClass: "split-char" });
        gsap.set(h, { autoAlpha: 1 });
        gsap.from(split.chars, { yPercent: 118, duration: 1.1, ease: "power4.out", stagger: 0.04, delay: 0.1 });
      }
      gsap.to("[data-hero-h]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.from("[data-hero-rev]", {
        autoAlpha: 0,
        y: 36,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.55,
      });
      const media = el.querySelector<HTMLElement>("[data-hero-media]");
      if (media) {
        gsap.fromTo(
          media,
          { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "power3.out", delay: 0.5 },
        );
      }

      return () => split?.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="ch-about" data-surface="page" className="about-body px-5 pb-[8vh] pt-[22vh] md:px-10">
      <h1 data-hero-h className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(4.5rem,21vw,19rem)", opacity: 0 }}>
        About
      </h1>

      <div className="mt-8 grid items-end gap-10 md:mt-12 md:grid-cols-[1fr_1fr] md:gap-16">
        <p data-hero-rev className="max-w-xl text-[clamp(1.15rem,2vw,1.7rem)] leading-[1.35] text-[var(--fg)]">
          HW Media is a creative media company. We make films for brands, on location, with the people
          who build them, and shoot every frame ourselves.
        </p>
        <div data-hero-rev className="flex items-end justify-start gap-4 md:justify-end">
          <span className="about-label text-[var(--gold-text)]">Films for brands</span>
          <span className="about-label text-[var(--fg)]/45">Est. London</span>
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-sm md:mt-16">
        <div data-hero-media style={{ willChange: "clip-path, transform" }}>
          <video
            src="/videos/films/mclaren-w.mp4"
            poster="/videos/films/posters/mclaren-w.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-label="HW Media work"
            className="aspect-[16/7] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
