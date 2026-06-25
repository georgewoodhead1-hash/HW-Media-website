"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// "Let's create" — the white bubble the client loves, on a now-dark site. A cream
// circle GROWS up out of the dark with the line in black, holds, then SHRINKS back
// into the dark and hands to the FAQs. Driven by transform `scale` on a circular
// div (GPU-composited) — NOT a per-frame clip-path, which was the jank. ~160vh.
export default function LetsCreate() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-lc-bubble]", { scale: 1.4 });
      gsap.set("[data-lc-content]", { autoAlpha: 1, scale: 1 });
    });

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-lc-bubble]", { scale: 0 });
      gsap.set("[data-lc-content]", { autoAlpha: 0, scale: 0.92 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl
        .to("[data-lc-bubble]", { scale: 1.4, duration: 1, ease: "power2.out" }, 0)
        .to("[data-lc-content]", { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0.35)
        .to("[data-lc-content]", { autoAlpha: 1, duration: 0.55 }, 1.05)
        .to("[data-lc-content]", { autoAlpha: 0, scale: 0.94, duration: 0.4, ease: "power2.in" }, 1.6)
        .to("[data-lc-bubble]", { scale: 0, duration: 0.75, ease: "power2.in" }, 1.7);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" data-surface="media" className="relative min-h-screen bg-[#050505] md:min-h-[160vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[#050505]">
        {/* the white bubble — a cream circle scaled via transform (GPU) */}
        <div data-lc-bubble aria-hidden className="absolute aspect-square w-[150vmax] rounded-full bg-[#f9f6e4] will-change-transform" />
        <div data-lc-content className="relative px-5 text-center md:px-10 will-change-transform">
          <h2 className="about-display leading-[0.86] text-[#171717]" style={{ fontSize: "clamp(3rem,12vw,9rem)" }}>
            Let&apos;s create.
          </h2>
          <a
            data-cursor="Email"
            href="mailto:harry@hwmedia.co.uk"
            className="about-display mt-7 inline-block text-[#171717] text-[clamp(1.3rem,3vw,2.4rem)] underline-offset-[10px] transition-colors hover:text-[var(--gold-text)] hover:underline"
            style={{ textTransform: "none" }}
          >
            harry@hwmedia.co.uk
          </a>
          <p className="about-body mx-auto mt-6 max-w-md text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-[#171717]/70">
            Tell us the brand and the story. We will come to you and shoot it.
          </p>
        </div>
      </div>
    </section>
  );
}
