"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// "Let's create" — the line the client loved, on home between Testimonials and FAQ.
// SHORT cream beat (the old 260vh circle bloom was far too long and mostly black).
// A soft seam fades the dark testimonials into the cream at the top; the line fades
// up IN, then fades away OUT as the cream FAQ takes over — no black void, blended
// both ends.
export default function LetsCreate() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const inT = gsap.fromTo(
        "[data-lc-content]",
        { autoAlpha: 0, y: 64 },
        { autoAlpha: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 80%", end: "top 40%", scrub: 0.8 } },
      );
      return () => { inT.scrollTrigger?.kill(); inT.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      data-theme="light"
      data-surface="page"
      className="relative flex min-h-[105vh] items-center justify-center overflow-hidden bg-[#f9f6e4] text-[#171717]"
    >
      {/* seam — the dark testimonials dissolve into the cream */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[16vh]" style={{ background: "linear-gradient(to bottom, #050505, transparent)" }} />

      <div data-lc-content className="relative z-0 px-5 text-center md:px-10">
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
    </section>
  );
}
