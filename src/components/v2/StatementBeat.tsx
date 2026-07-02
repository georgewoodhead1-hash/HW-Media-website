"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion, TRUSTED } from "./data";

// The beat between roster and work: a Noxediem hairline draws across, the
// trusted-by roll settles in, then a Luke-style statement whose words resolve
// from ghost-grey to cream as they pass through the viewport.
export default function StatementBeat() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // hairline draws across as the section arrives
      gsap.fromTo(
        ".v2-stmt-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 78%" },
        },
      );
      // trusted-by row settles up
      gsap.from(".v2-stmt-trusted", {
        autoAlpha: 0,
        y: 22,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
      // statement words resolve from ghost to cream, scrubbed (Luke)
      const stmt = el.querySelector<HTMLElement>(".v2-stmt-copy");
      if (stmt) {
        const split = new SplitText(stmt, { type: "words" });
        gsap.set(stmt, { autoAlpha: 1 });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.35,
            scrollTrigger: { trigger: stmt, start: "top 78%", end: "top 32%", scrub: 0.5 },
          },
        );
      }
      // sign-off eyebrow
      gsap.from(".v2-stmt-sign", {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".v2-stmt-sign", start: "top 88%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const firma = { fontFamily: "var(--font-firma), sans-serif" } as const;

  return (
    <section
      ref={rootRef}
      data-chapter-v2
      className="relative px-5 pb-[16vh] pt-[12vh] md:px-10"
      aria-label="Statement"
    >
      <div className="mx-auto max-w-[1120px]">
        <span aria-hidden className="v2-stmt-rule block h-px w-full origin-left bg-[#f5f1e6]/18" />
        <p
          className="v2-stmt-trusted mt-6 text-[11px] uppercase tracking-[0.26em] text-[#f5f1e6]/45"
          style={firma}
        >
          Trusted by {TRUSTED}
        </p>

        <p className="v2-stmt-copy font-display invisible mt-[12vh] max-w-[21ch] text-[clamp(2.3rem,5vw,5rem)] leading-[1.02] text-[#f5f1e6]">
          Films for brands that refuse to blend in — directed, shot and finished by one
          crew<span className="text-[var(--gold-text)]">.</span>
        </p>

        <p className="v2-stmt-sign mt-10 text-[11px] uppercase tracking-[0.26em] text-[#f5f1e6]/45" style={firma}>
          Selected work — four films, start to finish
        </p>
      </div>
    </section>
  );
}
