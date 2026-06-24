"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Hero — Luke Baffait's opening, adapted. Tiny intro top-left, ONE restrained
// statement anchored bottom-left (NOT a centred wordmark), vast black space, a row
// of tiny meta along the foot. Scrubbed reveal. The gold full stop is the accent.
export default function LukeHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-h-intro]", { autoAlpha: 0, y: -12, duration: 1, ease: "power3.out", delay: 0.2 });
      gsap.from("[data-h-line] .ln", { yPercent: 120, duration: 1.2, ease: "power4.out", stagger: 0.12, delay: 0.35 });
      gsap.from("[data-h-foot] > *", { autoAlpha: 0, y: 14, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.7 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-screen flex-col px-5 pb-7 pt-7 md:px-10 md:pb-9">
      {/* tiny intro, top-left */}
      <p data-h-intro className="about-body max-w-[32ch] text-[clamp(0.95rem,1.4vw,1.15rem)] leading-snug text-[var(--fg)]/55">
        HW Media. A creative media company making films for brands.
      </p>

      {/* statement + foot, anchored to the bottom */}
      <div className="mt-auto">
        <h1 data-h-line className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(2.4rem,7vw,6rem)", lineHeight: 0.95 }}>
          <span className="block overflow-hidden"><span className="ln block">Films for brands,</span></span>
          <span className="block overflow-hidden"><span className="ln block">shot by one</span></span>
          <span className="block overflow-hidden"><span className="ln block">director<span className="gold-lg">.</span></span></span>
        </h1>

        <div data-h-foot className="mt-9 flex items-end justify-between about-label text-[var(--fg)]/45">
          <span>London</span>
          <span>Est. 2018</span>
        </div>
      </div>
    </section>
  );
}
