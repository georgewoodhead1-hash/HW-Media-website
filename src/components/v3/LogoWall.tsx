"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// V3 §4 — THE WALL. Basement's logo wall: social proof as hairline-bordered
// architecture. Twelve greyscale marks in a strict grid; cells stagger-in on
// arrival; hover brightens the mark and tints the cell — opacity/background
// only, so nothing ever jumps.

const LOGOS: ReadonlyArray<readonly [string, string]> = [
  ["aston-martin-white", "Aston Martin"],
  ["nike-white", "Nike"],
  ["red-bull-7", "Red Bull"],
  ["spotify-white", "Spotify"],
  ["defender-white", "Defender"],
  ["salomon-logo-white", "Salomon"],
  ["mclaren-logo", "McLaren"],
  ["soho-house-white", "Soho House"],
  ["gj-white", "Gentleman's Journal"],
  ["meta-logo-white", "Meta"],
  ["natwest-white", "NatWest"],
  ["diageo-logo-black-and-white", "Diageo"],
];

export default function LogoWall() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".v3w-label", {
        autoAlpha: 0,
        y: 18,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
      gsap.from(".v3w-cell", {
        autoAlpha: 0,
        duration: 0.7,
        stagger: { each: 0.05, grid: [3, 4], from: "start" },
        ease: "power2.out",
        scrollTrigger: { trigger: ".v3w-grid", start: "top 82%" },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="px-5 py-[14vh] md:px-10" aria-label="Trusted by">
      <div className="v3w-label mb-10 flex items-baseline justify-center gap-4">
        <p
          className="text-[11px] uppercase tracking-[0.32em] text-[#c3c3c3]/55"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Trusted by
        </p>
        <span className="text-[11px] tracking-[0.2em] text-[#c3c3c3]/40" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          (12)
        </span>
      </div>
      <div className="v3w-grid grid grid-cols-2 border-l border-t border-[#f5f1e6]/12 md:grid-cols-4">
        {LOGOS.map(([slug, name]) => (
          <div
            key={slug}
            className="v3w-cell group flex h-28 items-center justify-center border-b border-r border-[#f5f1e6]/12 transition-colors duration-500 hover:bg-[#f5f1e6]/[0.045] md:h-32"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${slug}.png`}
              alt={name}
              loading="lazy"
              className="max-h-[36px] max-w-[120px] object-contain opacity-50 transition-opacity duration-500 group-hover:opacity-100 md:max-h-[40px] md:max-w-[130px]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
