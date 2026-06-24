"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY } from "../_data";

// THE INDEX — masthead. Editorial register (noxediem / savor): a hairline ledger
// across the top with edge ticks, vast black space, the about H1 anchored LOW and
// LEFT (never a centred wordmark). Lines rise on load; the whole head drifts up and
// blurs as you scroll out, so the seam into the statement is unnoticeable.
export default function IndexMasthead() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-mh-tick]", { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power3.inOut", delay: 0.15 });
      gsap.from("[data-mh-eyebrow]", { autoAlpha: 0, y: -10, duration: 0.9, ease: "power3.out", delay: 0.35 });
      gsap.from("[data-mh-line] .ln", { yPercent: 118, duration: 1.25, ease: "power4.out", stagger: 0.12, delay: 0.4 });
      gsap.from("[data-mh-foot] > *", { autoAlpha: 0, y: 16, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.8 });
      // scroll-out drift + blur — hands into the statement with no hard stop
      gsap.to("[data-mh-head]", {
        yPercent: -14,
        autoAlpha: 0.18,
        filter: "blur(7px)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-screen flex-col px-5 pb-8 pt-24 md:px-10 md:pb-12 md:pt-28">
      {/* top hairline ledger with edge ticks */}
      <div className="flex items-center gap-5">
        <span className="about-label whitespace-nowrap text-[var(--fg)]/55">HW Media</span>
        <span data-mh-tick className="h-px flex-1 origin-left bg-[var(--hairline-dark)]" />
        <span className="about-label whitespace-nowrap text-[var(--fg)]/55">{AGENCY.est}</span>
      </div>
      <p data-mh-eyebrow className="about-label mt-5 text-[var(--gold-text)]">{AGENCY.eyebrow}</p>

      {/* H1 anchored bottom-left */}
      <div data-mh-head className="mt-auto will-change-transform">
        <h1 data-mh-line className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(2.7rem,9vw,8.5rem)", lineHeight: 0.9 }}>
          <span className="block overflow-hidden"><span className="ln block">{AGENCY.h1Lines[0]}</span></span>
          <span className="block overflow-hidden">
            <span className="ln block">
              the camera<span className="gold-lg">.</span>
            </span>
          </span>
        </h1>

        <div data-mh-foot className="mt-10 flex items-end justify-between about-label text-[var(--fg)]/45">
          <span>{AGENCY.place} — {AGENCY.reach}</span>
          <span className="hidden sm:block">The crew, the work, the way we shoot</span>
          <span aria-hidden className="animate-pulse">Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
