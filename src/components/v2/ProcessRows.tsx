"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, STAGES } from "./data";

// Luke: ghost-grey process rows that BRIGHTEN as they pass the viewport
// centre, each opened by a hairline that draws across. The margin carries a
// quiet eyebrow; the rows themselves are the show.
export default function ProcessRows() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".v2-proc-eyebrow", {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });

      gsap.utils.toArray<HTMLElement>(".v2-stage", el).forEach((row) => {
        // hairline draws across as the row approaches
        const rule = row.querySelector<HTMLElement>(".v2-stage-rule");
        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.inOut",
              scrollTrigger: { trigger: row, start: "top 86%" },
            },
          );
        }
        // ghost → bright at centre, then back to ghost (scrubbed both ways)
        const body = row.querySelector<HTMLElement>(".v2-stage-body");
        if (body) {
          gsap.fromTo(
            body,
            { opacity: 0.2 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 80%", end: "center 46%", scrub: 0.5 },
            },
          );
          gsap.fromTo(
            body,
            { opacity: 1 },
            {
              opacity: 0.2,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: row, start: "center 40%", end: "bottom 8%", scrub: 0.5 },
            },
          );
        }
      });

      gsap.fromTo(
        ".v2-proc-endrule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".v2-proc-endrule", start: "top 90%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const firma = { fontFamily: "var(--font-firma), sans-serif" } as const;

  return (
    <section
      ref={rootRef}
      data-chapter-v2
      className="relative z-10 bg-[#0a0a09] px-5 py-[18vh] md:px-10"
      aria-label="Our process"
    >
      <div className="mx-auto max-w-[1120px]">
        <p className="v2-proc-eyebrow mb-14 text-[11px] uppercase tracking-[0.26em] text-[#f5f1e6]/45" style={firma}>
          ( Process ) — one crew, four stages
        </p>

        {STAGES.map((s) => (
          <div key={s.n} className="v2-stage relative">
            <span aria-hidden className="v2-stage-rule block h-px w-full origin-left bg-[#f5f1e6]/14" />
            <div className="v2-stage-body grid grid-cols-1 items-baseline gap-2 py-10 md:grid-cols-[6rem_1fr_1fr] md:gap-10 md:py-12">
              <span className="text-[clamp(0.85rem,1vw,1rem)] text-[var(--gold-text)]/80" style={firma}>
                ({s.n})
              </span>
              <h3 className="font-display text-[clamp(2.1rem,4.6vw,4.6rem)] leading-[0.96]">
                {s.name}
                {s.n === "04" && <span className="text-[var(--gold-text)]">.</span>}
              </h3>
              <p className="max-w-[44ch] text-[clamp(1rem,1.25vw,1.15rem)] leading-[1.55] text-[#f5f1e6]/70">
                {s.copy}
              </p>
            </div>
          </div>
        ))}
        <span aria-hidden className="v2-proc-endrule block h-px w-full origin-left bg-[#f5f1e6]/14" />
      </div>
    </section>
  );
}
