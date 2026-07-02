"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CHAPTERS, onReveal, prefersReducedMotion } from "./data";

// Luke Baffait: a fixed vertical progress line with named chapters — the long
// scroll becomes a film with a timecode. The gold fill scrubs with total page
// progress; the active chapter brightens and gets a gold tick; a live counter
// reads the current chapter index. Hidden on mobile.
// NOTE: element refs only — gsap.context() scopes string selectors to its
// scope element, which silently broke the section lookups in the first build.
export default function ChapterRail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = prefersReducedMotion();

    const page = document.querySelector<HTMLElement>("[data-v2-root]");
    const track = el.querySelector<HTMLElement>(".v2-railtrack");
    const fill = el.querySelector<HTMLElement>(".v2-railfill");
    const counter = el.querySelector<HTMLElement>(".v2-railcount");
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".v2-ch"));
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-v2]"));

    let current = -1;
    const setActive = (idx: number) => {
      if (idx === current) return;
      current = idx;
      rows.forEach((row, i) => {
        const on = i === idx;
        row.classList.toggle("text-[#f5f1e6]", on);
        row.classList.toggle("text-[#f5f1e6]/35", !on);
        const tick = row.querySelector<HTMLElement>(".v2-chtick");
        if (tick) gsap.to(tick, { scaleX: on ? 1 : 0, duration: 0.45, ease: "power2.out" });
      });
      if (counter) counter.textContent = `0${idx + 1} / 0${CHAPTERS.length}`;
    };

    // progress fill + active chapter, one scrub trigger — resilient to layout
    // shifts because the active chapter is measured from live rects.
    const trigger = page
      ? ScrollTrigger.create({
          trigger: page,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            if (fill && !reduced) {
              gsap.set(fill, { scaleY: self.progress, transformOrigin: "top center" });
            }
            let active = 0;
            sections.forEach((s, i) => {
              if (s.getBoundingClientRect().top < window.innerHeight * 0.5) active = i;
            });
            setActive(active);
          },
        })
      : null;
    setActive(0);

    // entrance — the line draws down, labels stagger in after the veil lifts
    let off = () => {};
    let intro: gsap.core.Timeline | null = null;
    if (!reduced) {
      gsap.set(el, { autoAlpha: 0 });
      gsap.set(track, { scaleY: 0, transformOrigin: "top center" });
      gsap.set([counter, ...rows], { autoAlpha: 0, x: -10 });
      off = onReveal(() => {
        intro = gsap
          .timeline({ delay: 0.35 })
          .to(el, { autoAlpha: 1, duration: 0.3 })
          .to(track, { scaleY: 1, duration: 1.0, ease: "power3.inOut" }, 0)
          .to(counter, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.5)
          .to(rows, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out", stagger: 0.08 }, 0.65);
      });
    }

    return () => {
      off();
      intro?.kill();
      trigger?.kill();
      gsap.set([el, track, counter, ...rows], { clearProps: "all" });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="v2-rail pointer-events-none fixed left-10 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      style={{ fontFamily: "var(--font-firma), sans-serif" }}
    >
      <p className="v2-railcount mb-4 text-[10px] tracking-[0.22em] text-[#f5f1e6]/55">01 / 05</p>
      <div className="v2-railtrack relative h-[30vh] w-px bg-[#f5f1e6]/20">
        <span className="v2-railfill absolute inset-0 origin-top bg-[var(--gold)]/90" style={{ transform: "scaleY(0)" }} />
      </div>
      <div className="mt-4 flex flex-col gap-[7px]">
        {CHAPTERS.map((c, i) => (
          <span
            key={c}
            className="v2-ch flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#f5f1e6]/35 transition-colors duration-300"
          >
            <span className="v2-chtick inline-block h-px w-3 origin-left bg-[var(--gold)]" style={{ transform: "scaleX(0)" }} />
            0{i + 1} {c}
          </span>
        ))}
      </div>
    </div>
  );
}
