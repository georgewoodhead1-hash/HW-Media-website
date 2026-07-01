"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// Our process — a HOVER interaction (not a scroll-scrub). Four films in a
// symmetric row; hover (or focus/tap) one and the big stage line at the top
// swaps to that stage, the film brightens + plays, the others dim. The "We
// deliver." tile carries a gold full stop (.wd-stop) that the testimonials
// section peels off into its dots.
interface Stage {
  name: string;
  sub: string;
  clip: string;
}

const STAGES: Stage[] = [
  { name: "We plan", sub: "Brief, treatment, locations, schedule.", clip: "/videos/micro/m02.mp4" },
  { name: "We film", sub: "Direction and cinematography, on location.", clip: "/videos/micro/m07.mp4" },
  { name: "We edit", sub: "Edit, grade, sound and motion, all in-house.", clip: "/videos/micro/m10.mp4" },
  { name: "We deliver", sub: "The master plus every cutdown your channels need.", clip: "/videos/micro/m12.mp4" },
];

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(3); // default to "We deliver" so the full stop is home on load

  // entrance — eyebrow, heading and tiles rise in as the section enters
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".proc-rise", {
        autoAlpha: 0,
        y: 44,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // play the active film, pause the rest
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) safePlay(v);
      else v.pause();
    });
  }, [active]);

  // swap the big stage line smoothly on hover
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      el.querySelectorAll(".proc-active"),
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05, overwrite: true },
    );
  }, [active]);

  const current = STAGES[active];

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="media"
      className="relative z-20 bg-[var(--bg)] px-5 py-[11vh] text-[var(--fg)] md:px-10"
      aria-label="Our process"
    >
      <div className="mx-auto max-w-6xl">
        <p className="proc-rise label-mono text-[11px] uppercase tracking-[0.26em] text-[var(--gold-text)]">Our process</p>

        {/* the active stage — swaps on hover */}
        <div className="proc-rise mt-5 min-h-[clamp(5.5rem,9vw,8rem)]">
          <h2 className="proc-active font-display text-[clamp(2.6rem,6vw,5.2rem)] leading-[0.88]">
            {current.name}
            <span className="text-[var(--gold-text)]">.</span>
          </h2>
          <p
            className="proc-active mt-4 max-w-md text-[clamp(1rem,1.4vw,1.25rem)] leading-snug text-[var(--fg)]/85"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            {current.sub}
          </p>
        </div>

        {/* the four films — symmetric row */}
        <div className="proc-rise mt-[4vh] grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {STAGES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={s.name}
              aria-pressed={i === active}
              className={`group relative aspect-[3/4] overflow-hidden rounded-lg ring-1 transition-all duration-500 ${
                i === active ? "ring-[var(--gold)]/60" : "ring-[var(--hairline-dark)]"
              }`}
            >
              <video
                ref={(el) => {
                  vids.current[i] = el;
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[650ms] ${
                  i === active ? "scale-105 opacity-100" : "opacity-45 grayscale"
                }`}
                src={s.clip}
                poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between p-4">
                <span className="label-mono text-[11px] tracking-[0.2em] text-white/80">0{i + 1}</span>
                <span className="font-display text-[clamp(0.95rem,1.4vw,1.35rem)] text-white">
                  {s.name}
                  {i === 3 && <span className="wd-stop text-[var(--gold-text)]">.</span>}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
