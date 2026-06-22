"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// Our process. The four films START in the four corners of the screen (faded
// in as the section pins, NOT popped). As you scroll, "Our process" assembles
// from scattered letters AND the four films glide in from their corners into a
// centred row — together. Only once they've combined does the play-bar + the
// stage labels FADE IN and the sequence play: the title swaps to We plan ->
// We film -> We edit -> We deliver, the active film lights, and the bar rides
// the row locked to the active film. Deterministic %-based positions, animated
// with transforms (no layout thrash), scrubbed and slow.

interface Stage {
  name: string;
  blurb: string;
  clip: string;
}

const STAGES: Stage[] = [
  { name: "We plan", blurb: "Before a single frame, we find the story worth telling — and the sharpest way to tell it.", clip: "/videos/micro/m02.mp4" },
  { name: "We film", blurb: "One tight crew, every department covered. We shoot fast, stay loose, and chase the moments that matter.", clip: "/videos/micro/m07.mp4" },
  { name: "We edit", blurb: "The cut is where the film is made — paced, graded and scored until it earns attention.", clip: "/videos/micro/m10.mp4" },
  { name: "We deliver", blurb: "The master, plus every cutdown and format your channels need, finished properly and ready to publish.", clip: "/videos/micro/m12.mp4" },
];

const COMBINE = 0.42; // first slice = corners converge + title assembles
// centre positions in % of viewport: corner start, then the resting row slot
const CORNERS: [number, number][] = [[15, 22], [85, 22], [15, 82], [85, 82]];
const ROW: [number, number][] = [[21, 56], [40.3, 56], [59.7, 56], [79, 56]];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-2);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const clips = clipRefs.current.filter(Boolean) as HTMLDivElement[];
      const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];

      let split: SplitText | null = null;
      let chars: HTMLElement[] = [];
      if (titleRef.current) {
        split = new SplitText(titleRef.current, { type: "chars", charsClass: "fcp-char" });
        chars = split.chars as HTMLElement[];
      }
      // per-letter scatter (fractions of the viewport, computed live)
      const scatter = chars.map((_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const mag = 0.28 + ((i * 13) % 20) / 100;
        return { x: dir * mag, y: (((i * 53) % 100) - 50) / 50 * 0.4, rot: dir * (14 + ((i * 29) % 40)), sc: 0.6 + ((i * 17) % 40) / 100 };
      });

      gsap.set(stages, { autoAlpha: 0, y: 14 });
      gsap.set(clips, { xPercent: -50, yPercent: -50 });

      const place = (p: number) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const appear = smooth(0, 0.07, p);      // fade up gently on arrival (no pop)
        const comb = smooth(0.07, COMBINE, p);   // corners -> row + letters assemble

        // films glide from their corner to their row slot (transform only)
        clips.forEach((c, i) => {
          const offX = ((CORNERS[i][0] - ROW[i][0]) / 100) * vw;
          const offY = ((CORNERS[i][1] - ROW[i][1]) / 100) * vh;
          gsap.set(c, {
            x: lerp(offX, 0, comb),
            y: lerp(offY, 0, comb),
            scale: lerp(0.78, 1, comb),
            autoAlpha: appear,
          });
        });

        // title letters: scattered + invisible until arrival, then assemble
        chars.forEach((c, i) => {
          const s = scatter[i];
          gsap.set(c, {
            x: lerp(s.x * vw, 0, comb),
            y: lerp(s.y * vh, 0, comb),
            rotation: lerp(s.rot, 0, comb),
            scale: lerp(s.sc, 1, comb),
            autoAlpha: appear,
          });
        });

        // bar + labels FADE IN only once everything has combined
        const ui = smooth(COMBINE - 0.01, COMBINE + 0.07, p);
        const inStages = p >= COMBINE;
        const sp = Math.min(1, Math.max(0, (p - COMBINE) / (1 - COMBINE)));
        if (barRef.current) {
          const bx = lerp(ROW[0][0], ROW[3][0], sp);
          gsap.set(barRef.current, { autoAlpha: ui, left: `${bx}%` });
        }
        if (labelsRef.current) gsap.set(labelsRef.current, { autoAlpha: ui });

        // title <-> active stage swap + light the active film + sync bar/clip
        const idx = inStages ? Math.min(STAGES.length - 1, Math.floor(sp * STAGES.length)) : -1;
        if (idx !== activeRef.current) {
          activeRef.current = idx;
          gsap.to(titleRef.current, { autoAlpha: inStages ? 0 : 1, duration: 0.3, overwrite: true });
          stages.forEach((s, i) => gsap.to(s, { autoAlpha: i === idx ? 1 : 0, y: i === idx ? 0 : 14, duration: 0.35, overwrite: true }));
          clips.forEach((c, i) => gsap.to(c, { opacity: idx < 0 ? 1 : i === idx ? 1 : 0.4, duration: 0.35, overwrite: "auto" }));
          vids.current.forEach((v, i) => { if (!v) return; if (i === idx) safePlay(v); else v.pause(); });
        }
      };

      place(0);
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      });

      return () => { st.kill(); split?.revert(); };
    });

    return () => mm.revert();
  }, []);

  const jumpTo = (i: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const travel = root.offsetHeight - window.innerHeight;
    const seg = (1 - COMBINE) / STAGES.length;
    window.scrollTo({ top: top + (COMBINE + (i + 0.5) * seg) * travel, behavior: "smooth" });
  };

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="page"
      data-chapter="Our process"
      className="relative motion-safe:md:h-[480vh]"
      aria-label="Our process"
    >
      <div className="sticky top-0 hidden h-screen overflow-hidden md:block">
        {/* the four films — start in the corners, glide into the centred row */}
        {STAGES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => jumpTo(i)}
            aria-label={`Go to ${s.name}`}
            ref={(el) => { clipRefs.current[i] = el as unknown as HTMLDivElement; }}
            className="fcp-clip absolute z-10 block w-[19vw] max-w-[300px] cursor-pointer overflow-hidden rounded-lg ring-1 ring-[var(--hairline-dark)] will-change-transform"
            style={{ left: `${ROW[i][0]}%`, top: `${ROW[i][1]}%` }}
          >
            <video
              ref={(el) => { vids.current[i] = el; }}
              className="aspect-video h-full w-full object-cover"
              src={s.clip}
              poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
          </button>
        ))}

        {/* centre — "Our process" assembling, swapped for the active stage */}
        <div className="pointer-events-none absolute inset-x-0 top-[30%] z-20 -translate-y-1/2 px-6 text-center">
          <h2
            ref={titleRef}
            className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] [&_.fcp-char]:inline-block [&_.fcp-char]:will-change-transform"
            style={{ fontWeight: 400 }}
          >
            Our process
          </h2>
          {STAGES.map((s, i) => (
            <div key={s.name} ref={(el) => { stageRefs.current[i] = el; }} className="absolute inset-x-0 top-0 px-6">
              <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88]" style={{ fontWeight: 400 }}>
                {s.name}<span className="text-[var(--gold)]">.</span>
              </h2>
            </div>
          ))}
        </div>

        {/* play-bar — sweeps the row, fades in after the films combine */}
        <div
          ref={barRef}
          aria-hidden
          className="absolute top-[56%] z-30 h-[15vh] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gold)] opacity-0 shadow-[0_0_14px_3px_rgba(191,170,83,0.5)] will-change-transform"
          style={{ left: `${ROW[0][0]}%` }}
        />

        {/* stage labels under the row — fade in with the bar */}
        <div ref={labelsRef} className="absolute inset-x-0 top-[74%] z-20 flex justify-center gap-[7vw] opacity-0" style={{ fontFamily: "var(--font-dm), sans-serif" }}>
          {STAGES.map((s) => (
            <span key={s.name} className="text-[12px] font-medium tracking-[0.04em] text-[var(--fg)]/55">{s.name}</span>
          ))}
        </div>
      </div>

      {/* mobile / reduced: calm stack */}
      <div className="px-5 py-24 md:hidden">
        <h2 className="font-display text-4xl" style={{ fontWeight: 400 }}>Our <span className="text-[var(--gold)]">process.</span></h2>
        {STAGES.map((s, i) => (
          <article key={s.name} className="border-t border-[var(--hairline-dark)] py-8">
            <span className="label-mono text-[10px] text-[var(--gold)]">0{i + 1}</span>
            <h3 className="font-display mt-2 text-2xl">{s.name}.</h3>
            <p className="mt-2 text-[var(--fg)]/70">{s.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
