"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrollType from "@/components/shell/ScrollType";
import Rule from "@/components/shell/Rule";
import MobileReveal from "@/components/shell/MobileReveal";

// 01 — Mission. CONDENSED (client): a small, simple statement — heading + one
// short line. No stats/numbers, no tall pinned layering. Just a quiet beat.

const PARA =
  "A London film production company for brands that refuse to be ordinary. We go where the story is and film it — direction, cinematography, edit and grade, all in-house.";

export default function Mission() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // light word write-on, finished well before the section leaves
      gsap.fromTo(
        ".ms-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 78%", end: "center 48%", scrub: 1.0 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="01 — Mission"
      data-flow
      className="relative z-10 -mt-[10vh] rounded-t-[2rem] bg-[#080807] px-5 py-[13vh] text-[var(--fg)] shadow-[0_-24px_60px_rgba(0,0,0,0.6)] md:px-10 md:py-[15vh]"
      aria-label="Our mission"
    >
      <Rule className="mb-[10vh]" />
      <MobileReveal className="mx-auto flex max-w-[900px] flex-col items-center gap-8 text-center">
        <ScrollType
          as="h2"
          className="font-display text-[clamp(2.8rem,5.6vw,5.6rem)] leading-[0.95]"

        >
          Films, not content.
        </ScrollType>
        <p className="mx-auto max-w-[52ch] text-[clamp(1.1rem,1.5vw,1.5rem)] leading-[1.5] text-[var(--fg)]/80">
          {PARA.split(" ").map((w, i) => (
            <span key={i} className="ms-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </MobileReveal>
    </section>
  );
}
