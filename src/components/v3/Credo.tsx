"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// V3 §2 — THE CREDO. Three beats, one line each, all centred.
// Beat 1: a whisper — the tiny line fills at centre and drifts.
// Beat 2: the scale-jump — "We make films" is pinned and blooms from the same
//         tiny size to full display size (~6.6x, measured) as you scroll.
// Beat 3: the payoff line fills at centre with a slight y-drift; gold stop.

const JUMP_FROM = 0.3; // beat-2 starting scale — visible from the first frame of the pin

export default function Credo() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Beat 1 — fill at centre + slight y-drift
      gsap.fromTo(
        ".v3c-tiny",
        { autoAlpha: 0.28, y: 48 },
        {
          autoAlpha: 1,
          y: -48,
          ease: "none",
          scrollTrigger: { trigger: ".v3c-b1", start: "top 88%", end: "bottom 35%", scrub: 0.5 },
        },
      );

      // Beat 2 — the jump. Scale runs over the first 60% of the pin, then the
      // line holds huge and drifts slightly before releasing.
      const b2 = gsap.timeline({
        scrollTrigger: { trigger: ".v3c-b2", start: "top top", end: "bottom bottom", scrub: 0.4 },
        defaults: { ease: "none" },
      });
      b2.fromTo(".v3c-films", { scale: JUMP_FROM, autoAlpha: 0.55 }, { scale: 1, autoAlpha: 1, duration: 0.6 }, 0)
        .to(".v3c-films", { y: "-6vh", duration: 0.4 }, 0.6);

      // Beat 3 — fill at centre + drift
      gsap.fromTo(
        ".v3c-choose",
        { autoAlpha: 0.12, y: 90 },
        {
          autoAlpha: 1,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: ".v3c-b3", start: "top 95%", end: "bottom 50%", scrub: 0.5 },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="We make films people choose to watch">
      <div className="v3c-b1 flex h-[60vh] items-center justify-center px-5">
        <p className="v3c-tiny font-display text-[clamp(0.95rem,1.5vw,1.4rem)] tracking-[0.08em] text-[#c3c3c3]/85">
          We don&rsquo;t make content.
        </p>
      </div>

      <div className="v3c-b2 relative h-[120vh] md:h-[140vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-5">
          <h2 className="v3c-films font-display whitespace-nowrap text-[clamp(3rem,10.5vw,10.5rem)] leading-[0.92] text-[#f5f1e6] will-change-transform">
            We make films
          </h2>
        </div>
      </div>

      <div className="v3c-b3 flex h-[80vh] items-center justify-center px-5">
        <p className="v3c-choose font-display text-center text-[clamp(1.9rem,6.4vw,6.4rem)] leading-[0.95] text-[#f5f1e6] will-change-transform">
          people choose to watch<span className="text-[var(--gold-text)]">.</span>
        </p>
      </div>
    </section>
  );
}
