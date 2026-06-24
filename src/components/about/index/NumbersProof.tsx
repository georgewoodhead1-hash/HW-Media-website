"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY, NUMBERS } from "../_data";

// THE INDEX — (05) the proof. Big gold numerals (noxediem huge-type discipline):
// the thesis overline, four figures that count up on entry, and the Aristotle line
// closing in gold. One loud type moment after all the hairlines — distinct again.
export default function NumbersProof() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-np-over] .word", { yPercent: 110, autoAlpha: 0, ease: "none", stagger: 0.04, scrollTrigger: { trigger: "[data-np-over]", start: "top 85%", end: "top 50%", scrub: 0.5 } });
      gsap.from("[data-np-fig]", { autoAlpha: 0, y: 40, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: "[data-np-grid]", start: "top 80%", once: true } });
      gsap.from("[data-np-quote]", { autoAlpha: 0, y: 28, ease: "power3.out", scrollTrigger: { trigger: "[data-np-quote]", start: "top 88%", once: true } });

      // count the numeric figures up
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        const suffix = node.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.7,
          ease: "power2.out",
          snap: { v: 1 },
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
          onUpdate: () => { node.textContent = Math.round(obj.v) + suffix; },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const overline = AGENCY.thesis;

  return (
    <section ref={root} className="relative px-5 py-[18vh] md:px-10 md:py-[22vh]">
      <p data-np-over className="about-display mx-auto max-w-[18ch] text-center text-[var(--fg)]" style={{ fontSize: "clamp(1.5rem,3.4vw,2.8rem)", lineHeight: 1.06 }}>
        {overline.split(" ").map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom"><span className="word inline-block">{w}&nbsp;</span></span>
        ))}
      </p>

      <div data-np-grid className="mt-[12vh] grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {NUMBERS.map((n) => {
          const m = n.figure.match(/^(\d+)(\+?)$/);
          return (
            <div key={n.label} data-np-fig className="text-center">
              {m ? (
                <span className="about-display gold-lg block leading-none" data-count={m[1]} data-suffix={m[2]} style={{ fontSize: "clamp(2.8rem,7vw,6rem)" }}>{n.figure}</span>
              ) : (
                <span className="about-display gold-lg block leading-none" style={{ fontSize: "clamp(2rem,4.4vw,3.6rem)" }}>{n.figure}</span>
              )}
              <span className="about-label mt-4 block text-[var(--fg)]/50">{n.label}</span>
            </div>
          );
        })}
      </div>

      <figure data-np-quote className="mx-auto mt-[16vh] max-w-[40ch] text-center">
        <blockquote className="about-display text-[var(--gold-text)]" style={{ fontSize: "clamp(1.3rem,2.6vw,2.2rem)", lineHeight: 1.12, textTransform: "none" }}>
          “{AGENCY.aristotle}”
        </blockquote>
        <figcaption className="about-label mt-6 text-[var(--fg)]/40">Aristotle — the studio creed</figcaption>
      </figure>
    </section>
  );
}
