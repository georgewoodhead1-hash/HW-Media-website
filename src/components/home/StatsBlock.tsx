"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Reveal from "@/components/shell/Reveal";

// Animated stats block (client). Numbers count up when scrolled into view.
// NOTE: client retention % is TBD — placeholder 96%, confirm with George.
const STATS = [
  { n: 5, suffix: "", label: "Years in business" },
  { n: 150, suffix: "+", label: "Projects completed" },
  { n: 96, suffix: "%", label: "Client retention" },
];

export default function StatsBlock() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".stat-num", root).forEach((el) => {
        const target = parseInt(el.dataset.n ?? "0", 10);
        const suffix = el.dataset.suffix ?? "";
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const o = { v: 0 };
            gsap.to(o, {
              v: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
            });
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="By the numbers"
      data-flow
      className="relative bg-[var(--bg)] px-5 py-[8vh] text-[var(--fg)] md:px-10"
      aria-label="By the numbers"
    >
      <Reveal className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 text-center sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <span
              className="stat-num font-display block text-[clamp(2rem,4.2vw,3.4rem)] leading-none text-[var(--gold-text)]"
              data-n={s.n}
              data-suffix={s.suffix}
              style={{ fontWeight: 400 }}
            >
              0{s.suffix}
            </span>
            <p
              className="mt-4 text-[13px] uppercase tracking-[0.18em] text-[var(--fg)]/60"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
