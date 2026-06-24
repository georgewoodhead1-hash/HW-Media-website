"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY } from "../_data";

// THE REEL — cold open. Full-screen showreel under a centred viewfinder ring
// (oceanfilms), the motto rising LOW-LEFT over the footage (bennettandclive type
// over film, never centred), tiny production credits in the corners. On scroll the
// reel pushes in and the motto lifts away, handing seamlessly to the statement.
export default function ReelColdOpen() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-co-corner]", { autoAlpha: 0, duration: 1, ease: "power2.out", stagger: 0.1, delay: 0.4 });
      gsap.from("[data-co-ring]", { autoAlpha: 0, scale: 1.25, duration: 1.6, ease: "power3.out", delay: 0.3 });
      gsap.from("[data-co-line] .ln", { yPercent: 120, duration: 1.3, ease: "power4.out", stagger: 0.12, delay: 0.55 });
      gsap.to("[data-co-motto]", { yPercent: -26, autoAlpha: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } });
      gsap.to("[data-co-media]", { scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-surface="media" className="relative h-screen overflow-hidden bg-black">
      <div data-co-media className="absolute inset-0 will-change-transform">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/posters/hero-loop.jpg"
        >
          <source src="/videos/films/defender-reel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* viewfinder ring */}
      <div data-co-ring aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--gold-text)]/40" style={{ width: "58vmin", height: "58vmin" }}>
        <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[var(--gold-text)]/60" />
        <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-[var(--gold-text)]/60" />
      </div>

      {/* motto, low-left (eyebrow folded in to clear the fixed nav up top) */}
      <div data-co-motto className="absolute bottom-[12vh] left-5 right-5 md:left-10">
        <p data-co-corner className="about-label mb-5 text-[var(--gold-text)]">{AGENCY.eyebrow}</p>
        <h1 data-co-line className="glass-motto about-display" style={{ fontSize: "clamp(2.8rem,10vw,9rem)", lineHeight: 0.9 }}>
          <span className="block overflow-hidden"><span className="ln block">Break the</span></span>
          <span className="block overflow-hidden"><span className="ln block">ordinary<span className="glass-motto-gold">.</span></span></span>
        </h1>
        <div data-co-corner className="mt-7 flex items-center gap-5 about-label text-[var(--fg)]/55">
          <span>{AGENCY.place} — {AGENCY.reach}</span>
          <span className="h-px w-10 bg-[var(--fg)]/25" />
          <span aria-hidden className="animate-pulse">Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
