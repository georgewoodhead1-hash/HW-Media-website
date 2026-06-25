"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// "Let's create" — the white bubble the client loves. A cream circle GROWS up over
// the dark surround (blending out of the dark Testimonials) with the line in black,
// holds, then SHRINKS away. The surround crossfades dark -> cream UNDER the shrink,
// so the bubble disappears INTO cream (never a flash of black) and hands straight
// to the cream FAQs. ~165vh, a quick beat, not the old 260vh.
export default function LetsCreate() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const circle = el.querySelector<HTMLElement>("[data-lc-circle]");
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      circle?.style.setProperty("--cr", "150%");
      gsap.set("[data-lc-content]", { autoAlpha: 1, scale: 1 });
      gsap.set("[data-lc-cream]", { autoAlpha: 1 });
    });

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-lc-cream]", { autoAlpha: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
      tl
        // GROW the bubble to full + lift the line in
        .fromTo("[data-lc-circle]", { "--cr": "0%" }, { "--cr": "150%", duration: 1, ease: "power2.out" }, 0)
        .fromTo("[data-lc-content]", { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0.35)
        // HOLD
        .to("[data-lc-content]", { autoAlpha: 1, duration: 0.55 }, 1.05)
        // surround turns cream UNDER the shrink, so there is never a black tail
        .to("[data-lc-cream]", { autoAlpha: 1, duration: 0.7, ease: "power1.inOut" }, 1.45)
        // SHRINK away (into the now-cream field) + line fades
        .to("[data-lc-content]", { autoAlpha: 0, scale: 0.95, duration: 0.4, ease: "power2.in" }, 1.6)
        .to("[data-lc-circle]", { "--cr": "0%", duration: 0.7, ease: "power2.in" }, 1.7);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" data-surface="media" className="relative bg-[#050505]" style={{ minHeight: "165vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[#050505]">
        {/* surround: dark while the bubble grows (blends from Testimonials), then
            cream by the time it shrinks (blends to the cream FAQs) — no black tail */}
        <div data-lc-cream className="absolute inset-0 bg-[#f9f6e4]" />
        <div
          data-lc-circle
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#f9f6e4] text-[#171717] will-change-[clip-path]"
          style={{ clipPath: "circle(var(--cr, 0%) at 50% 50%)" }}
        >
          <div data-lc-content className="px-5 text-center md:px-10 will-change-transform">
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
      </div>
    </section>
  );
}
