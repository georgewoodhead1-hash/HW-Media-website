"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ScrollType from "@/components/shell/ScrollType";
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
      className="relative bg-[var(--bg)] px-5 py-[8vh] text-[var(--fg)] md:px-10 md:py-[10vh]"
      aria-label="Our mission"
      style={{ fontFamily: "var(--font-firma), sans-serif" }}
    >
      <MobileReveal className="mx-auto grid max-w-[1100px] gap-7 md:grid-cols-[0.72fr_1.28fr] md:items-start md:gap-16">
        <ScrollType
          as="h2"
          className="font-display text-[clamp(2rem,3.4vw,3.4rem)] leading-[0.95]"
          gold={["not"]}
        >
          Films, not content.
        </ScrollType>
        <p className="max-w-xl text-[clamp(1.1rem,1.5vw,1.55rem)] leading-[1.42] text-[var(--fg)]/80" style={{ fontFamily: "var(--font-archivo), sans-serif" }}>
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
