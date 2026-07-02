"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { STAGES, FIRMA } from "./data";

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS — one quiet numbered line-list (the films already made the
// argument). Each row's hairline draws in from the left, the number ticks up
// to its value, and the stage name rises out of a mask.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProcessList() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pl-kicker",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 78%" } },
      );
      gsap.utils.toArray<HTMLElement>("[data-proc-row]", el).forEach((row, i) => {
        const rule = row.querySelector<HTMLElement>(".pl-rule");
        const line = row.querySelector<HTMLElement>(".pl-line");
        const num = row.querySelector<HTMLElement>(".pl-num");
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 84%" } });
        if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power3.inOut" }, 0);
        if (line) tl.fromTo(line, { yPercent: 112 }, { yPercent: 0, duration: 0.95, ease: "power4.out" }, 0.12);
        if (num) {
          const counter = { n: 0 };
          tl.to(counter, {
            n: i + 1,
            duration: 0.8,
            ease: "power2.out",
            snap: { n: 1 },
            onUpdate: () => { num.textContent = `0${counter.n}`; },
          }, 0.15);
        }
      });
      gsap.fromTo(".pl-cta",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".pl-cta", start: "top 92%" } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="px-5 pb-[14vh] pt-[10vh] md:px-10" aria-label="Our process">
      <div className="mx-auto max-w-[900px] text-center">
        <p className="pl-kicker mb-10 text-[11px] uppercase tracking-[0.3em] text-[#f5f1e6]/50" style={FIRMA}>
          Our process
        </p>
        {STAGES.map((s, i) => (
          <div key={s} data-proc-row className="relative py-7">
            <div className="pl-rule absolute left-0 top-0 h-px w-full origin-left bg-[#f5f1e6]/12" />
            {i === STAGES.length - 1 && <div className="pl-rule absolute bottom-0 left-0 h-px w-full origin-left bg-[#f5f1e6]/12" />}
            <div className="overflow-hidden pb-[0.07em] -mb-[0.07em]">
              <h3 className="pl-line font-display text-[clamp(1.8rem,4.2vw,4.2rem)] leading-[1.0] will-change-transform">
                <span className="pl-num mr-5 align-middle text-[0.45em] text-[#f5f1e6]/40" style={{ fontVariantNumeric: "tabular-nums" }}>00</span>
                {s}
                {i === STAGES.length - 1 && <span className="text-[var(--gold-text)]">.</span>}
              </h3>
            </div>
          </div>
        ))}
      </div>
      <div className="pl-cta mt-[10vh] text-center">
        <Link
          href="/contact"
          className="glass backdrop-blur-md backdrop-saturate-150 inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white"
          style={FIRMA}
        >
          Start here <span aria-hidden>⟶</span>
        </Link>
      </div>
    </section>
  );
}
