"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// A full-bleed photo beat between the testimonials and the FAQs — the Aston + heli
// still — to break up the dark text sections with a single cinematic image. Subtle
// parallax so it breathes as you scroll past.
export default function FeatureBand() {
  const img = useRef<HTMLImageElement>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = img.current;
    const sec = root.current;
    if (!el || !sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        el,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      data-theme="dark"
      data-surface="media"
      className="relative z-[15] h-[clamp(60vh,88vh,92vh)] overflow-hidden bg-[#050505]"
      aria-label="HW Media"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={img}
        src="/images/feature.jpg"
        alt="HW Media film production"
        className="absolute inset-x-0 top-[-9%] h-[118%] w-full object-cover object-[center_26%]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
    </section>
  );
}
