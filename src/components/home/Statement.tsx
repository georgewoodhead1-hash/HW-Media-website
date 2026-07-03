"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Rule from "@/components/shell/Rule";

// The beat between Trusted By and Featured Projects — 1820-style: TYPE does the
// talking. One huge condensed statement, wall to wall, that INK-FILLS from dim
// to bright as you scroll through it (the 14islands fill, in our cream), gold
// full stop, sitting on the plus-hairline grammar. No video, no gimmick.
const LINES = ["FILMS,", "NOT CONTENT."];

export default function Statement() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".st2-char");
      gsap.set(chars, { opacity: 0.45 });
      gsap.to(chars, {
        opacity: 1,
        ease: "none",
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: "top 82%", end: "top 18%", scrub: 0.8 },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="media"
      className="relative bg-[#050505] px-5 py-[18vh] text-[#f5f1e6] md:px-10"
      aria-label="Films, not content."
    >
      <Rule className="mb-[9vh]" />
      <h2 className="font-display text-center text-[clamp(3.2rem,10.5vw,10.5rem)] leading-[0.92]" aria-label="Films, not content.">
        {LINES.map((line, li) => (
          <span key={li} className="block">
            {line.split("").map((c, ci) => (
              <span key={ci} aria-hidden className={`st2-char inline-block whitespace-pre ${c === "." ? "text-[var(--gold-text)]" : ""}`}>{c}</span>
            ))}
          </span>
        ))}
      </h2>
    </section>
  );
}
