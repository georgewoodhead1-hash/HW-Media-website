"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { STATEMENT, FIRMA } from "./data";

// ─────────────────────────────────────────────────────────────────────────────
// INK-FILL STATEMENT (14islands) — one giant line that "prints" from dim to
// bright under the scroll; the full stop is gold. Chars are grouped inside
// nowrap word spans so the line never breaks mid-word. A small right-hung
// paragraph (14islands' two-voice trick) balances the viewport.
// ─────────────────────────────────────────────────────────────────────────────

export default function InkStatement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".v4-char", el);
      gsap.set(chars, { opacity: 0.13 });
      gsap.to(chars, {
        opacity: 1,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 72%", end: "top 18%", scrub: 0.7 },
      });
      gsap.fromTo(".v4-stmt-kicker",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } },
      );
      gsap.fromTo(".v4-stmt-body",
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out", scrollTrigger: { trigger: ".v4-stmt-body", start: "top 88%" } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const words = STATEMENT.split(" ");

  return (
    <section ref={root} className="v4-statement flex min-h-[92vh] flex-col justify-center px-5 py-[10vh] md:px-10" aria-label={STATEMENT}>
      <p className="v4-stmt-kicker mb-8 text-[11px] uppercase tracking-[0.3em] text-[#f5f1e6]/50" style={FIRMA} aria-hidden>
        HW Media — production
      </p>
      <h2 className="font-display text-[clamp(2.8rem,9vw,9rem)] leading-[0.94]" aria-hidden>
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {w.split("").map((c, ci) => (
                <span key={ci} className={`v4-char inline-block ${c === "." ? "text-[var(--gold-text)]" : ""}`}>{c}</span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </h2>
      <p className="v4-stmt-body ml-auto mt-[9vh] max-w-[420px] text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.6] text-[#f5f1e6]/60 md:mr-[4vw]">
        A London film studio. Written, directed, shot and finished under one
        roof — so every frame answers to the same eye.
      </p>
    </section>
  );
}
