"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "../_data";

// THE INDEX — (04) what we do. A tight editorial ledger (savor.it line geometry):
// index · service · what it is · the typical job, ruled with hairlines. Small,
// dense and precise — the deliberate counterweight to the giant work titles above.
// Rows draw in on scrub; hovering a row warms its rule and lifts the name.
export default function ServicesLedger() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-sv-row]", {
        autoAlpha: 0,
        y: 26,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: "[data-sv-table]", start: "top 80%", once: true },
      });
      gsap.from("[data-sv-head]", { autoAlpha: 0, y: 18, ease: "power3.out", scrollTrigger: { trigger: "[data-sv-head]", start: "top 86%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[16vh] md:px-10 md:py-[20vh]">
      <div data-sv-head className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(1.9rem,5vw,4rem)" }}>What we do</h2>
        <p className="about-label max-w-[30ch] text-right text-[var(--fg)]/45">Five ways of working, one standard.</p>
      </div>

      <div data-sv-table className="border-t border-[var(--hairline-dark)]">
        {SERVICES.map((s, i) => (
          <div
            key={s.name}
            data-sv-row
            className="ledger-row group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 border-b border-[var(--hairline-dark)] py-6 md:grid-cols-[3rem_minmax(11rem,1fr)_2fr_auto] md:py-7"
          >
            <span className="about-label text-[var(--gold-text)]">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="about-display text-[var(--fg)] transition-colors group-hover:text-[var(--gold-text)]" style={{ fontSize: "clamp(1.3rem,2.4vw,2rem)" }}>{s.name}</h3>
            <p className="about-body col-span-2 max-w-[44ch] text-[clamp(0.95rem,1.1vw,1.08rem)] leading-relaxed text-[var(--fg)]/65 md:col-span-1">{s.line}</p>
            <span className="about-label col-span-2 text-[var(--fg)]/40 md:col-span-1 md:text-right">{s.job}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
