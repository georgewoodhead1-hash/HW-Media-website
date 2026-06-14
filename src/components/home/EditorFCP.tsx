"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// S4 — the process inside an editor. A Final-Cut-style shell: the VIEWER
// up top (chrome bar with file · res · fps, footage crossfading per
// stage, a typed lower-third), and the TIMELINE below — timecode ruler,
// a video track of four named clips with thumbnails, an audio track of
// waveform bars, and the white playhead riding across the lot. The
// active clip wears the gold selection border, like a real edit.

interface Stage {
  name: string;
  file: string;
  blurb: string;
  main: string;
  thumb: string;
}

const STAGES: Stage[] = [
  { name: "Planning", file: "Planning_01", blurb: "We find the story before anything is booked.", main: "/videos/films/salomon-w.mp4", thumb: "/videos/micro/m02.mp4" },
  { name: "Filming", file: "Filming_02", blurb: "One crew, every department, instinct welcome.", main: "/videos/films/bts-w.mp4", thumb: "/videos/micro/m07.mp4" },
  { name: "Editing", file: "Editing_03", blurb: "Where the footage becomes a film.", main: "/videos/loop-04.mp4", thumb: "/videos/micro/m10.mp4" },
  { name: "Delivery", file: "Delivery_04", blurb: "Masters, plus every cutdown your channels need.", main: "/videos/loop-05.mp4", thumb: "/videos/micro/m12.mp4" },
];
const SEG = 1 / STAGES.length;
const WAVE = Array.from({ length: 120 }, (_, i) => 4 + ((i * 37) % 17));

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const fileRef = useRef<HTMLSpanElement>(null);
  const mainVids = useRef<(HTMLVideoElement | null)[]>([]);
  const lowerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(-1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const mains = gsap.utils.toArray<HTMLElement>(".fcp-main", root);
      const lowers = lowerRefs.current.filter(Boolean) as HTMLDivElement[];
      const clips = clipRefs.current.filter(Boolean) as HTMLButtonElement[];

      mains.forEach((m, i) => gsap.set(m, { opacity: i === 0 ? 1 : 0 }));
      lowers.forEach((l, i) => gsap.set(l, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 12 }));
      clips.forEach((c, i) => c.classList.toggle("fcp-active", i === 0));
      gsap.set(".fcp-shell", { y: 60, opacity: 0, scale: 0.97 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const lane = playheadRef.current?.parentElement;
            if (playheadRef.current && lane) {
              playheadRef.current.style.transform = `translateX(${(self.progress * lane.offsetWidth).toFixed(1)}px)`;
            }
            if (tcRef.current) {
              const t = self.progress * 48;
              tcRef.current.textContent = `00:00:${String(Math.floor(t)).padStart(2, "0")}:${String(Math.floor((t % 1) * 25)).padStart(2, "0")}`;
            }
            if (self.progress < 0.01) {
              mainVids.current.forEach((v) => v?.pause());
              activeRef.current = -1;
              return;
            }
            const idx = Math.min(STAGES.length - 1, Math.floor(self.progress / SEG));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              if (fileRef.current) fileRef.current.textContent = `HW_Process.fcpx — ${STAGES[idx].file}`;
              clips.forEach((c, i) => c.classList.toggle("fcp-active", i === idx));
              mainVids.current.forEach((v, i) => {
                if (!v) return;
                if (i === idx) safePlay(v);
                else v.pause();
              });
            }
          },
        },
      });

      // dynamic entrance: the heading rises out of its mask, then the editor
      // assembles — shell up, clips dealt in left-to-right — and the whole
      // stage keeps a slow drift for the entire pin so it never sits still
      gsap.set(".fcp-title", { yPercent: 110 });
      gsap.set(".fcp-clip", { y: 24, opacity: 0 });
      tl.to(".fcp-title", { yPercent: 0, duration: 0.07, ease: "power3.out" }, 0)
        .to(".fcp-shell", { y: 0, opacity: 1, scale: 1, duration: 0.08, ease: "power2.out" }, 0.02)
        .to(".fcp-clip", { y: 0, opacity: 1, stagger: 0.014, duration: 0.05, ease: "power2.out" }, 0.06)
        .fromTo(".fcp-stage", { yPercent: 1.5 }, { yPercent: -1.5, duration: 1 }, 0);
      for (let k = 1; k < STAGES.length; k++) {
        const t = k * SEG;
        tl.to(mains[k - 1], { opacity: 0, duration: 0.04 }, t - 0.01)
          .to(mains[k], { opacity: 1, duration: 0.04 }, t - 0.01)
          .to(lowers[k - 1], { opacity: 0, y: -12, duration: 0.03 }, t - 0.015)
          .to(lowers[k], { opacity: 1, y: 0, duration: 0.035 }, t + 0.005);
      }
      tl.to(root, { duration: 0.04 }, 0.99);

      return () => {
        mains.forEach((m) => gsap.set(m, { clearProps: "all" }));
      };
    });

    root.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      try { v.load(); } catch { /* fine */ }
    });

    return () => mm.revert();
  }, []);

  const jumpTo = (i: number) => {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const travel = root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i * SEG + SEG * 0.5) * travel, behavior: "smooth" });
  };

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-chapter="03 — The process"
      className="-mt-[8vh] relative motion-safe:md:h-[420vh]"
      aria-label="Our process"
    >
      <div className="sticky top-0 hidden h-screen flex-col overflow-hidden px-5 pb-10 pt-20 motion-reduce:md:hidden md:flex md:px-10">
        {/* the big heading, above the editor */}
        <div className="fcp-head shrink-0 overflow-hidden pb-1">
          <p className="scene-marker label-mono opacity-60">
            <span>03 — The process</span>
          </p>
          <h2 className="fcp-title font-display mt-4 text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.95] will-change-transform">
            Our <span className="font-accent text-[var(--gold)]">process.</span>
          </h2>
        </div>

        {/* the editor — full width, centred under the heading */}
        <div className="fcp-stage mt-6 flex min-h-0 flex-1 will-change-transform">
          <div className="fcp-shell flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-[var(--hairline-dark)] bg-[#0a0a0a] shadow-[0_40px_120px_rgba(0,0,0,0.6)] will-change-transform">
          {/* chrome bar */}
          <div className="flex items-center justify-between border-b border-[var(--hairline-dark)] px-4 py-2.5">
            <span ref={fileRef} className="label-mono text-[10px] opacity-80">HW_Process.fcpx — Planning_01</span>
            <span className="label-mono text-[10px] opacity-50">1920×1080 · 25fps · ProRes 4:2:2</span>
          </div>

          {/* viewer */}
          <div className="relative flex-1">
            {STAGES.map((s, i) => (
              <div key={s.name} className="fcp-main absolute inset-0">
                <video
                  ref={(el) => { mainVids.current[i] = el; }}
                  className="h-full w-full object-cover"
                  src={s.main}
                  poster={s.main.includes("films/") ? s.main.replace("films/", "films/posters/").replace(".mp4", ".jpg") : `/videos/posters/${s.main.split("/").pop()!.replace(".mp4", ".jpg")}`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            ))}
            {/* lower third */}
            <div className="absolute bottom-5 left-6">
              {STAGES.map((s, i) => (
                <div key={s.name} ref={(el) => { lowerRefs.current[i] = el; }} className="absolute bottom-0 left-0 w-max">
                  <span className="bar-label">{String(i + 1).padStart(2, "0")} / 04</span>
                  <span className="font-display mt-2 block text-3xl md:text-4xl">
                    {s.name}
                    <span className="font-accent text-[var(--gold)]">.</span>
                  </span>
                  <span className="mt-1 block max-w-md text-sm text-[#f5f1e6]/85">{s.blurb}</span>
                </div>
              ))}
            </div>
            <span ref={tcRef} className="label-mono absolute right-5 top-4 text-[10px] text-[var(--gold)]">00:00:00:00</span>
          </div>

          {/* timeline */}
          <div className="relative border-t border-[var(--hairline-dark)] bg-[#0d0d0c] px-4 pb-4 pt-2">
            {/* ruler */}
            <div className="flex justify-between" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="label-mono text-[8px] opacity-40">
                  00:{String(i * 6).padStart(2, "0")}
                </span>
              ))}
            </div>
            <div className="mt-1 flex justify-between" aria-hidden>
              {Array.from({ length: 49 }).map((_, i) => (
                <span key={i} className="w-px bg-[var(--fg)]" style={{ height: i % 6 === 0 ? 8 : 4, opacity: 0.3 }} />
              ))}
            </div>

            {/* tracks + playhead lane */}
            <div className="relative mt-2">
              {/* V1 */}
              <div className="flex gap-1">
                {STAGES.map((s, i) => (
                  <button
                    key={s.name}
                    ref={(el) => { clipRefs.current[i] = el; }}
                    onClick={() => jumpTo(i)}
                    aria-label={`Jump to ${s.name}`}
                    className="fcp-clip relative h-16 flex-1 cursor-pointer overflow-hidden rounded-[3px] border border-[var(--hairline-dark)] transition-[border-color,filter] duration-300 hover:brightness-125"
                  >
                    <video className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" src={s.thumb} poster={s.thumb.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")} aria-hidden muted loop playsInline preload="metadata" />
                    <span className="on-media label-mono absolute left-2 top-1.5 text-[8px]">{s.file}.mp4</span>
                  </button>
                ))}
              </div>
              {/* A1 */}
              <div className="mt-1 flex h-8 items-center gap-[2px] overflow-hidden rounded-[3px] border border-[var(--hairline-dark)] bg-[#101010] px-1" aria-hidden>
                {WAVE.map((h, i) => (
                  <span key={i} className="w-[2px] shrink-0 rounded-full bg-[var(--gold)]/45" style={{ height: h }} />
                ))}
              </div>
              {/* playhead across both tracks */}
              <div ref={playheadRef} className="pointer-events-none absolute -top-3 bottom-0 left-0 z-10 will-change-transform" aria-hidden>
                <span className="absolute -left-[5px] top-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-white" />
                <span className="absolute left-0 top-1 block h-full w-[1.5px] bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* mobile/reduced stack */}
      <div className="px-5 pb-40 pt-40 md:hidden motion-reduce:md:block md:px-10">
        <p className="scene-marker label-mono mb-12 opacity-60"><span>03 — The process</span></p>
        {STAGES.map((s, i) => (
          <article key={s.name} className="border-t border-[var(--hairline-dark)] py-10">
            <span className="bar-label">{String(i + 1).padStart(2, "0")} / 04</span>
            <h3 className="font-display mt-4 text-3xl">{s.name}<span className="font-accent text-[var(--gold)]">.</span></h3>
            <p className="mt-3 max-w-md text-[var(--paper-text)]/80">{s.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
