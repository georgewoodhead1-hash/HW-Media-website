"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY, CLIENTS, NUMBERS } from "../_data";

// THE REEL — (04) proof. A calm breather after the full-bleed scenes: the real
// client wall (dim by default, hover to bring one to white and blow the rest back),
// the numbers on a hairline row, and the deck pledge closing in gold. A grid — the
// structural opposite of every moving scene around it, so the rhythm breathes.
const ROW_ONE = CLIENTS.slice(0, 6);
const ROW_TWO = CLIENTS.slice(6);

export default function ReelProof() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rp-head]", { autoAlpha: 0, y: 22, ease: "power3.out", scrollTrigger: { trigger: "[data-rp-head]", start: "top 86%", once: true } });
      gsap.from("[data-rp-logo]", { autoAlpha: 0, y: 18, ease: "power3.out", stagger: 0.04, scrollTrigger: { trigger: "[data-rp-wall]", start: "top 82%", once: true } });
      gsap.from("[data-rp-num]", { autoAlpha: 0, y: 24, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: "[data-rp-nums]", start: "top 84%", once: true } });
      gsap.from("[data-rp-quote] .word", { yPercent: 110, autoAlpha: 0, ease: "none", stagger: 0.04, scrollTrigger: { trigger: "[data-rp-quote]", start: "top 88%", end: "top 55%", scrub: 0.5 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-[#050505] px-5 py-[16vh] md:px-10 md:py-[20vh]">
      <div data-rp-head className="mb-14 flex flex-wrap items-end justify-between gap-4">
        <h2 className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(1.7rem,4.4vw,3.4rem)" }}>The company we keep</h2>
        <p className="about-label max-w-[28ch] text-right text-[var(--fg)]/45">The kind of brands McLaren and Aston Martin sit beside.</p>
      </div>

      {/* client wall */}
      <div data-rp-wall className="space-y-8">
        {[ROW_ONE, ROW_TWO].map((row, r) => (
          <div key={r} className="tb-row grid grid-cols-3 items-center gap-x-6 gap-y-10 sm:grid-cols-6">
            {row.map((c) => (
              <span key={c.src} data-rp-logo className="tb-logo flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} className="h-7 w-auto max-w-[120px] object-contain md:h-9" />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* numbers row */}
      <div data-rp-nums className="mt-[14vh] grid grid-cols-2 gap-y-10 border-t border-[var(--hairline-dark)] pt-12 md:grid-cols-4">
        {NUMBERS.map((n) => (
          <div key={n.label} data-rp-num>
            <div className="about-display gold-lg leading-none" style={{ fontSize: "clamp(1.8rem,4vw,3rem)" }}>{n.figure}</div>
            <div className="about-label mt-3 text-[var(--fg)]/50">{n.label}</div>
          </div>
        ))}
      </div>

      {/* pledge */}
      <p data-rp-quote className="about-display mt-[14vh] max-w-[24ch] text-[var(--gold-text)]" style={{ fontSize: "clamp(1.4rem,3vw,2.4rem)", lineHeight: 1.1, textTransform: "none" }}>
        {`“${AGENCY.pledge}”`.split(" ").map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom"><span className="word inline-block">{w}&nbsp;</span></span>
        ))}
      </p>
    </section>
  );
}
