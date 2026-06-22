"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// Our process — FULLY scroll-tied, zero time-based tweens (those were the
// clunk). Arrive on a BLACK screen; as you scroll, the scattered letters of
// "Our process" and the four films drift in one at a time on uneven windows.
// Once assembled, the title crossfades We plan -> We film -> We edit -> We
// deliver while a tall play-bar with a playhead rides the full width of the
// stepped row, the active film brightening as the bar reaches it. Every
// property is a smooth function of scroll progress; heavy scrub; transforms
// only (the bar moves by translate, never `left`).

interface Stage { name: string; clip: string; }

const STAGES: Stage[] = [
  { name: "We plan", clip: "/videos/micro/m02.mp4" },
  { name: "We film", clip: "/videos/micro/m07.mp4" },
  { name: "We edit", clip: "/videos/micro/m10.mp4" },
  { name: "We deliver", clip: "/videos/micro/m12.mp4" },
];

const COMBINE = 0.5; // first half = the slow, staggered assemble
const ROW_X = [15, 38.3, 61.7, 85];
const ROW_Y = [60, 49, 60, 49]; // stepped up/down for depth
const CORNERS: [number, number][] = [[10, 16], [90, 16], [10, 86], [90, 86]];
const CLIP_WIN: [number, number][] = [[0.04, 0.26], [0.13, 0.35], [0.23, 0.44], [0.31, 0.5]];
const BAR_LEFT = ROW_X[0] - 11.5;
const BAR_RIGHT = ROW_X[3] + 11.5;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(-2);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const clips = clipRefs.current.filter(Boolean) as HTMLDivElement[];
      const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
      const nStage = STAGES.length;

      let split: SplitText | null = null;
      let chars: HTMLElement[] = [];
      if (titleRef.current) {
        split = new SplitText(titleRef.current, { type: "chars", charsClass: "fcp-char" });
        chars = split.chars as HTMLElement[];
      }
      const N = chars.length || 1;
      const scatter = chars.map((_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const mag = 0.24 + ((i * 13) % 22) / 100;
        const a = 0.03 + (i / N) * 0.34; // staggered, uneven start
        return {
          x: dir * mag,
          y: ((((i * 53) % 100) - 50) / 50) * 0.4,
          rot: dir * (9 + ((i * 29) % 30)),
          sc: 0.62 + ((i * 17) % 38) / 100,
          a,
          b: a + 0.3, // WIDE window -> slow, smooth per-letter fade
        };
      });

      gsap.set(stages, { autoAlpha: 0, yPercent: 8 });
      gsap.set(clips, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      gsap.set(barRef.current, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      // smooth crossfade weight of stage i at stage-progress sp
      const stageWeight = (sp: number, i: number) => {
        const c = (i + 0.5) / nStage;
        const half = 0.5 / nStage;
        const d = Math.min(1, Math.abs(sp - c) / (half * 1.7));
        const w = 1 - d;
        return w * w * (3 - 2 * w);
      };

      const place = (p: number) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const enter = smooth(COMBINE - 0.02, COMBINE + 0.1, p); // assemble(0) -> stages(1)
        const sp = clamp01((p - COMBINE) / (1 - COMBINE));

        // FILMS — drift in from a corner during assemble, then brighten/dim
        // continuously by which stage is active. No discrete pop.
        clips.forEach((c, i) => {
          const [a, b] = CLIP_WIN[i];
          const t = smooth(a, b, p);
          const offX = ((CORNERS[i][0] - ROW_X[i]) / 100) * vw;
          const offY = ((CORNERS[i][1] - ROW_Y[i]) / 100) * vh;
          const w = stageWeight(sp, i);
          const assembleA = smooth(a, a + (b - a) * 0.55, p);
          gsap.set(c, {
            x: lerp(offX, 0, t),
            y: lerp(offY, 0, t),
            scale: lerp(0.82, 1, t) * lerp(1, 1 + 0.06 * w, enter),
            autoAlpha: lerp(assembleA, 0.32 + 0.68 * w, enter),
          });
        });

        // LETTERS — scattered across the page, draw home one at a time
        chars.forEach((c, i) => {
          const s = scatter[i];
          const t = smooth(s.a, s.b, p);
          gsap.set(c, {
            x: lerp(s.x * vw, 0, t),
            y: lerp(s.y * vh, 0, t),
            rotation: lerp(s.rot, 0, t),
            scale: lerp(s.sc, 1, t),
            autoAlpha: t,
          });
        });

        // "Our process" fades out as the stages take over
        gsap.set(titleRef.current, { autoAlpha: 1 - enter });

        // STAGE names crossfade smoothly (continuous, not on index change)
        stages.forEach((s, i) => {
          const w = stageWeight(sp, i);
          gsap.set(s, { autoAlpha: enter * w, yPercent: lerp(8, 0, w) });
        });

        // PLAY-BAR — pure translate sweep across the full row
        const barX = (lerp(BAR_LEFT, BAR_RIGHT, sp) / 100) * vw;
        gsap.set(barRef.current, { x: barX, autoAlpha: enter });

        // video play/pause follows the dominant stage (throttled, not a tween)
        const dom = enter > 0.5 ? Math.min(nStage - 1, Math.max(0, Math.round(sp * nStage - 0.5))) : -1;
        if (dom !== activeRef.current) {
          activeRef.current = dom;
          vids.current.forEach((v, i) => { if (!v) return; if (i === dom) safePlay(v); else v.pause(); });
        }
      };

      place(0);
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.6,
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
      className="relative motion-safe:md:h-[560vh]"
      aria-label="Our process"
    >
      <div className="sticky top-0 hidden h-screen overflow-hidden bg-[var(--bg)] md:block">
        {/* the four films — bigger, stepped up/down, drift in from the corners */}
        {STAGES.map((s, i) => (
          <button
            key={s.name}
            onClick={() => jumpTo(i)}
            aria-label={`Go to ${s.name}`}
            ref={(el) => { clipRefs.current[i] = el as unknown as HTMLDivElement; }}
            className="fcp-clip absolute z-10 block w-[22vw] max-w-[360px] cursor-pointer overflow-hidden rounded-lg ring-1 ring-[var(--hairline-dark)] will-change-transform"
            style={{ left: `${ROW_X[i]}%`, top: `${ROW_Y[i]}%` }}
          >
            <video
              ref={(el) => { vids.current[i] = el; }}
              className="aspect-video h-full w-full scale-[1.08] object-cover"
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

        {/* centre — "Our process" assembling, crossfading to the active stage */}
        <div className="pointer-events-none absolute inset-x-0 top-[27%] z-20 -translate-y-1/2 px-6 text-center">
          <h2
            ref={titleRef}
            className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] [&_.fcp-char]:inline-block [&_.fcp-char]:will-change-transform"
            style={{ fontWeight: 400 }}
          >
            Our process
          </h2>
          {STAGES.map((s, i) => (
            <div key={s.name} ref={(el) => { stageRefs.current[i] = el; }} className="absolute inset-x-0 top-0 px-6 will-change-transform">
              <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88]" style={{ fontWeight: 400 }}>
                {s.name}<span className="text-[var(--gold)]">.</span>
              </h2>
            </div>
          ))}
        </div>

        {/* tall play-bar with a playhead on top — translate sweep, full row */}
        <div
          ref={barRef}
          aria-hidden
          className="absolute left-0 top-[54.5%] z-30 opacity-0 will-change-transform"
        >
          <span className="absolute -left-[6px] -top-3 h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-[var(--gold)]" />
          <span className="block h-[30vh] w-[2px] rounded-full bg-[var(--gold)] shadow-[0_0_14px_3px_rgba(191,170,83,0.5)]" />
        </div>
      </div>

      {/* mobile / reduced: calm stack */}
      <div className="px-5 py-24 md:hidden">
        <h2 className="font-display text-4xl" style={{ fontWeight: 400 }}>Our <span className="text-[var(--gold)]">process.</span></h2>
        {STAGES.map((s, i) => (
          <article key={s.name} className="border-t border-[var(--hairline-dark)] py-8">
            <span className="text-[10px] text-[var(--gold)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>0{i + 1}</span>
            <h3 className="font-display mt-2 text-2xl">{s.name}.</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
