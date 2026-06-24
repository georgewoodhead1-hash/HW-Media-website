"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY } from "../_data";

// THE REEL — (01) who we are. The agency statement set LARGE over a single dimmed
// film frame (bennettandclive type-over-footage). A vertical edge label, a gold
// phrase, the lead beneath. Words rise on scrub; the frame drifts for parallax.
export default function ReelStatement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rs-stmt] .word", { yPercent: 115, autoAlpha: 0, ease: "none", stagger: 0.05, scrollTrigger: { trigger: "[data-rs-stmt]", start: "top 82%", end: "top 38%", scrub: 0.5 } });
      gsap.from("[data-rs-lead]", { autoAlpha: 0, y: 28, ease: "power3.out", scrollTrigger: { trigger: "[data-rs-lead]", start: "top 84%", once: true } });
      gsap.to("[data-rs-bg]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    }, el);
    return () => ctx.revert();
  }, []);

  const { statement, statementGold } = AGENCY;
  const [before, after] = statement.split(statementGold);
  const wrap = (text: string, gold = false) =>
    text.split(" ").filter(Boolean).map((w, i) => (
      <span key={`${gold ? "g" : "n"}-${w}-${i}`} className="inline-block overflow-hidden align-bottom">
        <span className={`word inline-block ${gold ? "gold-lg" : ""}`}>{w}&nbsp;</span>
      </span>
    ));

  return (
    <section ref={root} data-surface="media" className="relative flex min-h-screen items-center overflow-hidden px-5 py-[18vh] md:px-10">
      <div data-rs-bg className="absolute inset-0 -z-10 will-change-transform" style={{ top: "-12%", bottom: "-12%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/videos/films/posters/chasing-the-salt-w.jpg" alt="" className="h-full w-full object-cover" style={{ filter: "brightness(0.42) grayscale(0.2) contrast(1.05)" }} />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <span className="about-label absolute right-4 top-1/2 hidden -translate-y-1/2 text-[var(--fg)]/45 md:block" style={{ writingMode: "vertical-rl" }}>(01) Who we are</span>

      <div className="max-w-[20ch]">
        <h2 data-rs-stmt className="glass-motto about-display" style={{ fontSize: "clamp(2rem,5.4vw,4.6rem)", lineHeight: 1.02 }}>
          {wrap(before)}{wrap(statementGold, true)}{wrap(after)}
        </h2>
        <p data-rs-lead className="about-body mt-9 max-w-[52ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-[var(--fg)]/80">{AGENCY.lead}</p>
      </div>
    </section>
  );
}
