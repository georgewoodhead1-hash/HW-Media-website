"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "./data";

// The Defender field image fades into the canvas at its bottom edge (the
// Noxediem hero-to-paper stitch) and drifts gently as you pass; the ask rises
// out of a mask beneath it.
export default function CtaFade() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // slow parallax drift on the still
      gsap.fromTo(
        ".v2-cta-img",
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: ".v2-cta-media", start: "top bottom", end: "bottom top", scrub: 0.4 },
        },
      );
      // the ask rises under a mask
      gsap.from(".v2-cta-line", {
        yPercent: 115,
        duration: 1.0,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".v2-cta-copy", start: "top 82%" },
      });
      gsap.from(".v2-cta-btn", {
        autoAlpha: 0,
        y: 26,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".v2-cta-copy", start: "top 74%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const firma = { fontFamily: "var(--font-firma), sans-serif" } as const;

  return (
    <section ref={rootRef} data-chapter-v2 className="relative" aria-label="Start a project">
      <div className="v2-cta-media relative h-[72vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/harry-field.jpg"
          alt="HW Media on location"
          className="v2-cta-img h-full w-full object-cover"
          loading="lazy"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0a0a09]/60 via-transparent to-[#0a0a09]" />
      </div>

      <div className="v2-cta-copy px-5 pb-[16vh] pt-4 text-center md:px-10">
        <span className="block overflow-hidden">
          <span className="v2-cta-line block text-[11px] uppercase tracking-[0.26em] text-[#f5f1e6]/45" style={firma}>
            London — worldwide
          </span>
        </span>
        <h2 className="font-display mt-5 overflow-hidden text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.96]">
          <span className="v2-cta-line block">
            Have a project in mind<span className="text-[var(--gold-text)]">?</span>
          </span>
        </h2>
        <div className="v2-cta-btn mt-9">
          <Link
            href="/contact"
            className="glass inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white backdrop-blur-md backdrop-saturate-150"
            style={firma}
          >
            Start here <span aria-hidden>⟶</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
