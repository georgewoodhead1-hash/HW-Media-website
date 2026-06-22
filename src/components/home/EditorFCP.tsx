"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// Our Process (client feedback): simplified. "Our process" sits centre; as you
// scrub it is replaced by the active stage name (Planning / Filming / Editing /
// Delivery). Below, four small looping clips in boxes — the active one lit. A
// clean timeline scrubber runs along the bottom. No big central video, no AI
// filenames.

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
const INTRO = 0.07; // first slice shows "Our process" before the stages begin

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
      gsap.set(stages, { autoAlpha: 0, y: 16 });
      gsap.set(introRef.current, { autoAlpha: 1 });

      const seg = (1 - INTRO) / STAGES.length;

      // ── LEGO ASSEMBLE: scatter the "Our process" title into chars, then
      // converge them into the centred title — scrubbed across the intro window.
      let split: SplitText | null = null;
      if (introTitleRef.current) {
        split = new SplitText(introTitleRef.current, { type: "chars", charsClass: "fcp-char" });
        const chars = split.chars as HTMLElement[];
        // a deterministic-ish scatter: each char flung wide with rotation
        chars.forEach((c, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const spread = 80 + ((i * 37) % 160); // 80–240px lateral spread
          gsap.set(c, {
            xPercent: 0,
            x: dir * spread * (0.6 + ((i * 13) % 40) / 100),
            y: (((i * 53) % 200) - 100) * 1.6, // ±160px vertical scatter
            rotation: dir * (12 + ((i * 29) % 36)), // 12–48deg tilt
            scale: 0.7 + ((i * 17) % 30) / 100,
            autoAlpha: 0.15,
            transformOrigin: "50% 50%",
          });
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // assemble completes a touch before the stage sequence begins
            end: () => `+=${(root.offsetHeight - window.innerHeight) * INTRO}`,
            scrub: 0.8,
          },
        }).to(chars, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          ease: "power3.out",
          stagger: 0.06,
        });
      }

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            // vertical play-bar sweeps across the clip row, DAW-style
            const row = clipRowRef.current;
            if (barRef.current && row) {
              barRef.current.style.transform = `translateX(${(self.progress * row.offsetWidth).toFixed(1)}px)`;
            }
            // dot on the thin timeline scrubber stays in sync
            const lane = playheadRef.current?.parentElement;
            if (playheadRef.current && lane) {
              playheadRef.current.style.transform = `translateX(${(self.progress * lane.offsetWidth).toFixed(1)}px)`;
            }
            const started = self.progress > INTRO;
            const idx = started ? Math.min(STAGES.length - 1, Math.floor((self.progress - INTRO) / seg)) : -1;
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              gsap.to(introRef.current, { autoAlpha: started ? 0 : 1, duration: 0.25, overwrite: true });
              stages.forEach((s, i) =>
                gsap.to(s, { autoAlpha: i === idx ? 1 : 0, y: i === idx ? 0 : 16, duration: 0.3, overwrite: true }),
              );
              clips.forEach((c, i) => {
                c.classList.toggle("fcp-active", i === idx);
                gsap.to(c, { opacity: i === idx ? 1 : 0.5, duration: 0.3, overwrite: true });
              });
              vids.current.forEach((v, i) => { if (!v) return; if (i === idx) safePlay(v); else v.pause(); });
            }
          },
        },
      });

      // clips deal in on entrance
      gsap.fromTo(
        ".fcp-clip",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 0.5, stagger: 0.08, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 65%" } },
      );

      return () => { st.scrollTrigger?.kill(); st.kill(); split?.revert(); };
    });

    return () => mm.revert();
  }, []);

  const jumpTo = (i: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const travel = root.offsetHeight - window.innerHeight;
    const seg = (1 - INTRO) / STAGES.length;
    window.scrollTo({ top: top + (INTRO + (i + 0.5) * seg) * travel, behavior: "smooth" });
  };

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="page"
      data-chapter="Our process"
      className="relative motion-safe:md:h-[340vh]"
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

        {/* clip row — bigger boxes, with a DAW-style vertical play-bar sweeping across */}
        <div ref={clipRowRef} className="relative mt-[5vh] flex w-full max-w-6xl items-stretch justify-center gap-5">
          {STAGES.map((s, i) => (
            <button
              key={s.name}
              ref={(el) => { clipRefs.current[i] = el; }}
              onClick={() => jumpTo(i)}
              aria-label={`Jump to ${s.name}`}
              className="fcp-clip relative aspect-video flex-1 cursor-pointer overflow-hidden rounded-lg border border-[var(--hairline-dark)] opacity-50"
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

          {/* vertical play-bar (metronome / DAW playhead) sweeping across the row */}
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
