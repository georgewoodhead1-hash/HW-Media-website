"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// Our process (rebuilt). The four stage clips START in the four corners of the
// screen and CONVERGE into a neat centred row as you scroll into the section.
// The "Our process" title is hidden until the section pins, then its letters
// appear scattered wide and slowly draw together (assemble). Only AFTER
// everything has combined do the stages play out — the centred title swaps to
// the active stage name, the active clip lights up, and a vertical play-bar
// rides across the row, locked to the active clip. All scroll-driven, scrubbed
// and slow.

interface Stage {
  name: string;
  blurb: string;
  clip: string;
}

const STAGES: Stage[] = [
  { name: "Planning", blurb: "We find the story before anything is booked.", clip: "/videos/micro/m02.mp4" },
  { name: "Filming", blurb: "One crew, every department, instinct welcome.", clip: "/videos/micro/m07.mp4" },
  { name: "Editing", blurb: "Where the footage becomes a film.", clip: "/videos/micro/m10.mp4" },
  { name: "Delivery", blurb: "Masters, plus every cutdown your channels need.", clip: "/videos/micro/m12.mp4" },
];

// First COMBINE of the section's scroll = corners converge + letters assemble.
// The remaining (1 - COMBINE) = the four stages play out, one per equal slice.
const COMBINE = 0.4;

// which screen corner each clip flies in from: [x-sign, y-sign]
// 0 top-left, 1 top-right, 2 bottom-left, 3 bottom-right
const CORNERS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const clipRowRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introTitleRef = useRef<HTMLHeadingElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(-2);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const stages = stageRefs.current.filter(Boolean) as HTMLDivElement[];
      const clips = clipRefs.current.filter(Boolean) as HTMLButtonElement[];
      const row = clipRowRef.current;

      // Stage names start hidden; the centred "Our process" intro is the only
      // thing on screen, and even its letters are invisible until we assemble.
      gsap.set(stages, { autoAlpha: 0, y: 16 });
      gsap.set(introRef.current, { autoAlpha: 1 });
      // play-bar parked far-left and hidden until the row has formed
      gsap.set(barRef.current, { autoAlpha: 0, x: 0 });

      // ── 1) CLIPS FROM THE CORNERS ──────────────────────────────────────────
      // Each clip lives in a centred row (its final resting place). We measure
      // its natural position, then offset it out to a screen corner; scrubbing
      // the COMBINE window animates that offset back to zero → they converge.
      // Function-based from-values + invalidateOnRefresh keep the corner offsets
      // correct across resizes (each clip must first be reset to x:0/y:0 to read
      // its true resting centre, which gsap does internally before re-measuring).
      const cornerX = (i: number) => {
        const c = clips[i];
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width / 2 - (gsap.getProperty(c, "x") as number);
        const [sx] = CORNERS[i];
        const tx = sx < 0 ? window.innerWidth * 0.12 : window.innerWidth * 0.88;
        return tx - cx;
      };
      const cornerY = (i: number) => {
        const c = clips[i];
        const r = c.getBoundingClientRect();
        const cy = r.top + r.height / 2 - (gsap.getProperty(c, "y") as number);
        const [, sy] = CORNERS[i];
        const ty = sy < 0 ? window.innerHeight * 0.16 : window.innerHeight * 0.84;
        return ty - cy;
      };

      const combineTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${(root.offsetHeight - window.innerHeight) * COMBINE}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // clips slide/scale from their corners into the centred row
      combineTl.fromTo(
        clips,
        {
          x: (i: number) => cornerX(i),
          y: (i: number) => cornerY(i),
          scale: 0.82,
          autoAlpha: 1,
        },
        { x: 0, y: 0, scale: 1, autoAlpha: 1, ease: "power3.out", duration: 1 },
        0,
      );

      // ── 2) TITLE: hidden until pin, then assembles ─────────────────────────
      let split: SplitText | null = null;
      if (introTitleRef.current) {
        split = new SplitText(introTitleRef.current, { type: "chars", charsClass: "fcp-char" });
        const chars = split.chars as HTMLElement[];
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // INVISIBLE and scattered wide — letters do NOT sit visible beforehand.
        chars.forEach((c, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const mag = 0.3 + ((i * 13) % 22) / 100; // 0.30–0.52 of viewport width
          gsap.set(c, {
            x: dir * mag * vw,
            y: (((i * 53) % 100) - 50) / 50 * vh * 0.42, // up to ±0.42vh
            rotation: dir * (14 + ((i * 29) % 46)),
            scale: 0.55 + ((i * 17) % 45) / 100,
            autoAlpha: 0,
            transformOrigin: "50% 50%",
          });
        });
        // fade IN first (so they pop into view on arrival, not before)…
        combineTl.to(
          chars,
          { autoAlpha: 1, ease: "power1.out", duration: 0.35, stagger: 0.03 },
          0,
        );
        // …then draw together over the same combine window
        combineTl.to(
          chars,
          { x: 0, y: 0, rotation: 0, scale: 1, ease: "power2.inOut", duration: 1, stagger: 0.05 },
          0,
        );
      }

      // ── 3) STAGE SEQUENCE + 4) PLAY-BAR SYNC ───────────────────────────────
      // One master trigger reads whole-section progress. Before COMBINE it does
      // nothing but keep the intro visible & bar hidden. After COMBINE it maps
      // STAGE-LOCAL progress so the bar tracks the active clip exactly.
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            // stage-local progress: 0 at COMBINE, 1 at section end
            const sp = gsap.utils.clamp(0, 1, (p - COMBINE) / (1 - COMBINE));
            const inStages = p >= COMBINE;

            // play-bar rides the clip row using STAGE progress, so it sits over
            // the active clip rather than running ahead of the films.
            if (barRef.current && row) {
              const w = row.offsetWidth;
              gsap.set(barRef.current, { autoAlpha: inStages ? 1 : 0, x: sp * w });
            }
            // thin scrubber dot tracks the same stage progress
            const lane = playheadRef.current?.parentElement;
            if (playheadRef.current && lane) {
              gsap.set(playheadRef.current, { x: sp * lane.offsetWidth });
            }

            // active stage index from the stage-local progress
            const idx = inStages
              ? Math.min(STAGES.length - 1, Math.floor(sp * STAGES.length))
              : -1;
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              gsap.to(introRef.current, {
                autoAlpha: inStages ? 0 : 1,
                duration: 0.3,
                overwrite: true,
              });
              stages.forEach((s, i) =>
                gsap.to(s, {
                  autoAlpha: i === idx ? 1 : 0,
                  y: i === idx ? 0 : 16,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: true,
                }),
              );
              clips.forEach((c, i) => {
                c.classList.toggle("fcp-active", i === idx);
                gsap.to(c, { opacity: i === idx || idx === -1 ? 1 : 0.5, duration: 0.35, overwrite: true });
              });
              vids.current.forEach((v, i) => {
                if (!v) return;
                if (i === idx) safePlay(v);
                else v.pause();
              });
            }
          },
        },
      });

      // SplitText reflows the title and the clip row sits beneath it — refresh
      // once on the next frame so all ScrollTrigger measurements (incl. the
      // function-based corner offsets) are taken against the final layout.
      const refresh = gsap.delayedCall(0.05, () => ScrollTrigger.refresh());

      return () => {
        refresh.kill();
        combineTl.scrollTrigger?.kill();
        combineTl.kill();
        st.scrollTrigger?.kill();
        st.kill();
        split?.revert();
        gsap.set(clips, { clearProps: "all" });
      };
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
      className="relative motion-safe:md:h-[600vh]"
      aria-label="Our process"
    >
      <div className="sticky top-0 hidden h-screen flex-col items-center justify-center overflow-hidden px-5 md:flex md:px-10">
        {/* CENTRE — "Our process", swapped for the active stage as you scrub */}
        <div className="relative flex h-[32vh] w-full items-center justify-center text-center">
          <div ref={introRef} className="absolute">
            <h2
              ref={introTitleRef}
              className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] [&_.fcp-char]:will-change-transform"
              style={{ fontWeight: 400 }}
            >
              Our process
            </h2>
          </div>
          {STAGES.map((s, i) => (
            <div key={s.name} ref={(el) => { stageRefs.current[i] = el; }} className="absolute">
              <span className="label-mono text-[11px] tracking-[0.26em] text-[var(--gold)]">
                0{i + 1} / 0{STAGES.length}
              </span>
              <h2 className="font-display mt-3 text-[clamp(3rem,8vw,7rem)] leading-[0.88]" style={{ fontWeight: 400 }}>
                {s.name}<span className="text-[var(--gold)]">.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[var(--fg)]/70">{s.blurb}</p>
            </div>
          ))}
        </div>

        {/* clip row — clips start in the corners, converge here; a DAW-style
            vertical play-bar rides across, locked to the active clip */}
        <div ref={clipRowRef} className="relative mt-[5vh] flex w-full max-w-6xl items-stretch justify-center gap-5">
          {STAGES.map((s, i) => (
            <button
              key={s.name}
              ref={(el) => { clipRefs.current[i] = el; }}
              onClick={() => jumpTo(i)}
              aria-label={`Jump to ${s.name}`}
              className="fcp-clip relative aspect-video flex-1 cursor-pointer overflow-hidden rounded-lg border border-[var(--hairline-dark)] will-change-transform"
            >
              <video
                ref={(el) => { vids.current[i] = el; }}
                className="h-full w-full object-cover"
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

          {/* vertical play-bar (metronome / DAW playhead) — its X is driven by
              STAGE progress so it sits over the active clip, never ahead */}
          <div
            ref={barRef}
            className="pointer-events-none absolute -top-3 -bottom-3 left-0 z-10 w-[2px] -translate-x-1/2 will-change-transform"
            aria-hidden
          >
            <span className="block h-full w-full rounded-full bg-[var(--gold)] shadow-[0_0_14px_3px_rgba(191,170,83,0.55)]" />
          </div>
        </div>

        {/* the timeline scrubber */}
        <div className="mt-[5vh] w-full max-w-4xl">
          <div className="relative h-px w-full bg-[var(--hairline-dark)]">
            <div ref={playheadRef} className="absolute -top-[3px] left-0 will-change-transform">
              <span className="block h-[7px] w-2 rounded-full bg-[var(--gold)] shadow-[0_0_10px_rgba(191,170,83,0.7)]" />
            </div>
          </div>
          <div className="mt-3 flex justify-between">
            {STAGES.map((s) => (
              <span key={s.name} className="label-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/50">{s.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* mobile / reduced: a calm stack */}
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
