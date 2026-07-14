"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The Defender band, v5 (George, 2026-07-14): the expansion is IN TUNE
// WITH THE SCROLL — it starts the moment the section enters, grows exactly
// as you scroll, STOPS when you stop, and settles with no clunk. Still the
// il capo box (opens from the centre, creeps then takes the frame) — the
// creep-then-take character comes from an eased mapping of the scrub
// progress, not from a clock. Scrolling back up collapses it just as
// directly (reverse speed = your scroll speed).

const sm = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

export default function FeatureBand() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current;
    if (!sec) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const frame = sec.querySelector<HTMLElement>(".fb-frame");
      const img = sec.querySelector<HTMLElement>(".fb-img");
      const line = sec.querySelector<HTMLElement>(".fb-line");
      const cta = sec.querySelector<HTMLElement>(".fb-cta");
      if (!frame) return;

      // GPU-ONLY box reveal: the frame SCALES open while the film inside
      // counter-scales — pure transforms (the old clip-path repainted the
      // whole screen every frame: the lag George felt riding into the
      // footer). Expansion is done by p=0.82, so it settles with a beat to
      // spare — no clunk at the release.
      gsap.set(frame, { scaleX: 0.001, scaleY: 0.001, autoAlpha: 0, transformOrigin: "center center", force3D: true });
      if (img) gsap.set(img, { scale: 400, transformOrigin: "center center", force3D: true });
      gsap.set([line, cta], { autoAlpha: 0, y: 22 });

      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // ROUND-7 retune: the expansion starts once the section is
          // properly on its way in (0.25 — it used to build the moment the
          // edge appeared) and is STILL finishing as the pin releases
          // (0.96) — so there is never a dead-frozen stretch at the end
          const e = Math.max(0.001, sm(0, 1, sm(0.25, 0.96, p)));
          gsap.set(frame, { autoAlpha: Math.min(1, e * 12), scaleX: e, scaleY: e, force3D: true });
          if (img) gsap.set(img, { scale: (1.12 - 0.12 * e) / e, force3D: true });
          const wIn = sm(0.82, 0.93, p);
          if (line) gsap.set(line, { autoAlpha: wIn, y: 22 * (1 - wIn) });
          const cIn = sm(0.87, 0.97, p);
          if (cta) gsap.set(cta, { autoAlpha: cIn, y: 22 * (1 - cIn), pointerEvents: cIn > 0.5 ? "auto" : "none" });
        },
      });

      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      data-theme="dark"
      data-surface="media"
      className="relative z-[35] bg-[var(--bg)] md:h-[130vh]"
      aria-label="Wherever the story is"
    >
      <div className="overflow-hidden md:sticky md:top-0 md:h-screen">
        <div className="fb-stage relative flex h-[80vh] items-center justify-center md:h-screen">
          {/* the film — the box opens from the centre and takes the frame */}
          <div className="fb-frame absolute inset-0 overflow-hidden will-change-[clip-path]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/harry-field.jpg"
              alt="HW Media film production"
              className="fb-img absolute inset-0 h-full w-full object-cover object-[center_26%] will-change-transform"
            />
          </div>

          {/* the words — nothing else, no lines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-5 md:px-10">
            <div className="fb-line will-change-transform">
              <h2 className="font-display text-center text-[clamp(2rem,4.6vw,4.4rem)] leading-[0.98] text-[#f5f1e6]">
                Wherever
                <br />
                the story is<span className="text-[var(--gold-text)]">.</span>
              </h2>
            </div>
            <div className="fb-cta">
              <a href="/contact" className="blink pointer-events-auto text-[clamp(16px,1.6vw,21px)] tracking-[0.05em]">
                Start here
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
