"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

// Our process — a full-bleed STACKING SERVICES list (1820 Productions structure,
// client-requested): a big statement, then four numbered rows edge-to-edge, each
// split by a hairline — number + title on the left, copy on the right. A gold
// timeline line fills down the left as you scroll (timeline feel, no sky imagery).
// The last row's full stop ("In motion.") is what the testimonials dot peels off.

interface Stage {
  n: string;
  name: string;
  copy: string;
}

const STAGES: Stage[] = [
  {
    n: "01",
    name: "Pre-production",
    copy: "Brief, treatment, casting, locations and schedule. We map the whole shoot before a single frame is captured, so the day runs like clockwork and the idea survives contact with the real world.",
  },
  {
    n: "02",
    name: "Production",
    copy: "Direction and cinematography on location. A tight crew, the right kit, and a director behind the camera rather than watching a monitor. Wherever it can be done in-camera, we do it in-camera.",
  },
  {
    n: "03",
    name: "Post-production",
    copy: "Edit, grade, sound and motion, all under one roof. Where the film finds its rhythm: cut with intent, coloured with care, finished to a master plus every cutdown your channels need.",
  },
  {
    n: "04",
    name: "In motion",
    copy: "Aerial, timelapse and the moving-image extras that lift a film. CAA-authorised drone work and motion design, handled by the same crew, so nothing is outsourced and nothing is lost in translation.",
  },
];

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      // header rises in
      gsap.from(".proc-rise", {
        autoAlpha: 0,
        y: 40,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });

      // each row: number + title rise as it enters; the copy WRITES itself in
      // (greyed words filling as you scroll — the house motif).
      gsap.utils.toArray<HTMLElement>(".proc-row").forEach((row) => {
        gsap.from(row.querySelectorAll(".proc-rowhead"), {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 82%" },
        });
        const copy = row.querySelector<HTMLElement>(".proc-copy");
        if (copy) {
          const s = new SplitText(copy, { type: "words", wordsClass: "proc-word" });
          splits.push(s);
          gsap.set(s.words, { autoAlpha: 0.18 });
          gsap.to(s.words, {
            autoAlpha: 1,
            ease: "none",
            stagger: 0.03,
            scrollTrigger: { trigger: row, start: "top 78%", end: "top 40%", scrub: 0.7 },
          });
        }
      });

      // gold timeline line fills down the left as the section scrolls
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: { trigger: ".proc-rows", start: "top 70%", end: "bottom 72%", scrub: 0.8 },
          },
        );
      }

      return () => splits.forEach((s) => s.revert());
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="media"
      className="relative z-20 border-y border-[var(--hairline-dark)] bg-[var(--bg)] text-[var(--fg)]"
      aria-label="Our process"
    >
      {/* header — full width, generous */}
      <div className="px-5 pb-[7vh] pt-[13vh] md:px-10">
        <p className="proc-rise label-mono text-[11px] uppercase tracking-[0.28em] text-[var(--gold-text)]">Our process</p>
        <h2 className="proc-rise mt-6 max-w-[16ch] font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.9]">
          Idea to master, every frame in-house.
        </h2>
      </div>

      {/* the stacking rows — edge to edge, split by hairlines, timeline line left */}
      <div className="proc-rows relative">
        {/* the timeline rail + gold fill, in the left gutter (desktop) */}
        <span aria-hidden className="pointer-events-none absolute bottom-0 top-0 left-5 hidden w-px bg-[var(--hairline-dark)] md:left-10 md:block" />
        <span
          ref={lineRef}
          aria-hidden
          className="pointer-events-none absolute bottom-0 top-0 left-5 hidden w-px origin-top bg-[var(--gold)] md:left-10 md:block"
        />

        {STAGES.map((s, i) => (
          <div
            key={s.name}
            className="proc-row grid grid-cols-1 gap-y-4 border-t border-[var(--hairline-dark)] px-5 py-[7vh] md:grid-cols-[6rem_minmax(0,0.85fr)_minmax(0,1.35fr)] md:items-baseline md:gap-x-10 md:px-10 md:py-[8vh]"
          >
            <span className="proc-rowhead label-mono text-[13px] tracking-[0.18em] text-[var(--gold-text)] md:pl-[calc(1.25rem)]">
              {s.n}
            </span>
            <h3 className="proc-rowhead font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[0.98]">
              {s.name}
              {i === STAGES.length - 1 && <span className="wd-stop text-[var(--gold-text)]">.</span>}
            </h3>
            <p
              className="proc-copy max-w-[52ch] text-[clamp(1.02rem,1.35vw,1.28rem)] leading-[1.5] text-[var(--fg)]/85"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              {s.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
