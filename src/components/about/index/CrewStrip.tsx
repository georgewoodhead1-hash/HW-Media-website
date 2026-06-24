"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { AGENCY, COLLECTIVE, CREW } from "../_data";

// THE INDEX — (02) the crew. A horizontal contact-sheet that travels sideways as
// you scroll down (ponder.ai mechanic, done with sticky + scrub, no pin so Lenis
// stays smooth). Intro panel → three crew panels → a closing collective panel.
// Structurally unlike anything else on the page: the whole section moves on one axis.
export default function CrewStrip() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const rail = track.current;
    if (!section || !rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(rail, {
        x: () => -(rail.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative" style={{ height: "280vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div ref={track} className="flex items-stretch gap-6 px-5 will-change-transform md:gap-12 md:px-10">
          {/* intro */}
          <div className="flex w-[78vw] shrink-0 flex-col justify-center sm:w-[44vw] md:w-[30vw]">
            <div className="mb-7 scene-marker about-label text-[var(--gold-text)]">
              <span>(02)</span>
              <span className="text-[var(--fg)]/55">The crew</span>
            </div>
            <p className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(1.5rem,2.4vw,2.2rem)", lineHeight: 1.08 }}>
              {AGENCY.crewLead}
            </p>
            <p className="about-label mt-8 text-[var(--fg)]/40">Drag your scroll →</p>
          </div>

          {/* crew */}
          {CREW.map((m, i) => (
            <article key={m.name} className="flex w-[80vw] shrink-0 flex-col justify-center sm:w-[52vw] md:w-[34vw]">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <span className="cross-mark left-2 top-2" />
                <span className="cross-mark bottom-2 right-2" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.still} alt="" className="h-full w-full object-cover" style={{ filter: "grayscale(0.18) brightness(0.92) contrast(1.05)" }} />
                <span className="about-label absolute bottom-3 left-3 text-[var(--fg)]/70">{String(i + 1).padStart(2, "0")} / 03</span>
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(1.5rem,2.6vw,2.4rem)" }}>{m.name}</h3>
                <span className="about-label text-[var(--gold-text)]">{m.role}</span>
              </div>
              <p className="about-body mt-3 max-w-[34ch] text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed text-[var(--fg)]/65">{m.line}</p>
            </article>
          ))}

          {/* collective close */}
          <div className="flex w-[82vw] shrink-0 flex-col justify-center sm:w-[50vw] md:w-[36vw]">
            <span className="about-label text-[var(--fg)]/40">And then some</span>
            <p className="about-display mt-5 text-[var(--fg)]" style={{ fontSize: "clamp(1.6rem,2.8vw,2.6rem)", lineHeight: 1.06 }}>{COLLECTIVE}</p>
            <p className="about-body mt-7 max-w-[40ch] text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-[var(--gold-text)]">{AGENCY.creative}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
