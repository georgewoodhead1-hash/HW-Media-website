"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY } from "../_data";

// THE INDEX — (01) the agency. A wide editorial statement on the left with the
// payoff words lifted to gold; a lead paragraph and a hairline fact-ledger on the
// right. Two-column editorial grid — deliberately NOT the masthead's full-bleed
// headline. Words rise word-by-word on scrub; the closing rule draws across.
const FACTS: [string, string][] = [
  ["Discipline", "Director-led"],
  ["Base", "London"],
  ["Reach", "Worldwide"],
  ["Since", "2018"],
];

export default function AgencyStatement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-as-stmt] .word", {
        yPercent: 110,
        autoAlpha: 0,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: "[data-as-stmt]", start: "top 85%", end: "top 40%", scrub: 0.5 },
      });
      gsap.from("[data-as-lead]", { autoAlpha: 0, y: 30, ease: "power3.out", scrollTrigger: { trigger: "[data-as-lead]", start: "top 82%", once: true } });
      gsap.from("[data-as-fact]", { autoAlpha: 0, x: 24, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: "[data-as-facts]", start: "top 80%", once: true } });
      gsap.from("[data-as-rule]", { scaleX: 0, transformOrigin: "left center", ease: "power3.inOut", duration: 1.1, scrollTrigger: { trigger: "[data-as-rule]", start: "top 88%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  // split the statement, wrapping the gold phrase so it lifts as one unit
  const renderStatement = () => {
    const { statement, statementGold } = AGENCY;
    const [before, after] = statement.split(statementGold);
    const wrap = (text: string, gold = false) =>
      text
        .split(" ")
        .filter(Boolean)
        .map((w, i) => (
          <span key={`${gold ? "g" : "n"}-${w}-${i}`} className="inline-block overflow-hidden align-bottom">
            <span className={`word inline-block ${gold ? "gold-lg" : ""}`}>{w}&nbsp;</span>
          </span>
        ));
    return (
      <>
        {wrap(before)}
        {wrap(statementGold, true)}
        {wrap(after)}
      </>
    );
  };

  return (
    <section ref={root} className="relative px-5 py-[16vh] md:px-10 md:py-[22vh]">
      <div className="mb-12 scene-marker about-label text-[var(--gold-text)]">
        <span>(01)</span>
        <span className="text-[var(--fg)]/55">The agency</span>
      </div>

      <div className="grid gap-12 md:grid-cols-[1.25fr_0.75fr] md:gap-16">
        <h2 data-as-stmt className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(1.9rem,4.4vw,3.6rem)", lineHeight: 1.04 }}>
          {renderStatement()}
        </h2>

        <div className="md:pt-3">
          <p data-as-lead className="about-body max-w-[46ch] text-[clamp(1rem,1.3vw,1.18rem)] leading-relaxed text-[var(--fg)]/72">
            {AGENCY.lead}
          </p>
          <ul data-as-facts className="mt-10">
            {FACTS.map(([k, v]) => (
              <li key={k} data-as-fact className="flex items-baseline justify-between border-t border-[var(--hairline-dark)] py-3.5 last:border-b">
                <span className="about-label text-[var(--fg)]/40">{k}</span>
                <span className="about-label text-[var(--fg)]">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div data-as-rule className="mt-[16vh] h-px w-full origin-left bg-[var(--hairline-dark)]" />
    </section>
  );
}
