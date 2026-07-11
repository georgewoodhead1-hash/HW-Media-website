"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The Defender band, v3 (George's spec, final round): NO pen stroke, no
// lines, nothing drawn. The film starts SMALL and FAR BACK — as you scroll
// it rises and comes FORWARD, expanding up and over itself until it fills
// the frame. "Wherever the story is." and Start here arrive with it. Then
// the page scrolls straight into the footer reveal. Simple.
//
// Sticky inner (CSS sticky, never ScrollTrigger pin — a pinned ancestor's
// transform breaks position:fixed children, see HW-MEDIA-RULES); the section
// height provides the scroll runway that drives the growth.

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

      gsap.set(frame, {
        scale: 0.24, y: "36vh", transformOrigin: "center center", force3D: true,
        filter: "blur(6px)", borderRadius: "14px",
      });
      if (img) gsap.set(img, { scale: 1.35 });
      gsap.set([line, cta], { autoAlpha: 0, y: 22 });

      const sm = (a: number, b: number, t: number) => {
        const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
        return x * x * (3 - 2 * x);
      };

      const st = ScrollTrigger.create({
        trigger: sec,
        // starts the moment the band enters — the small film sits right
        // below the FAQ line, already riding (no dead black run-up)
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // ONE MOTION (George): a single eased progress drives y and scale
          // together — no phase changes, no speed steps, no pauses
          const e = sm(0.02, 0.88, p);
          gsap.set(frame, {
            y: (1 - e) * 34 + "vh",
            scale: 0.24 + e * 0.76,
            // it sharpens and squares off as it comes forward — emerging
            // from the depth rather than just growing
            filter: `blur(${((1 - e) * 6).toFixed(2)}px)`,
            borderRadius: `${((1 - e) * 14).toFixed(2)}px`,
            force3D: true,
          });
          if (img) gsap.set(img, { scale: 1.35 - e * 0.35 });
          // the words land as the film does, CTA right on their heels
          const wIn = sm(0.84, 0.93, p);
          if (line) gsap.set(line, { autoAlpha: wIn, y: (1 - wIn) * 22 });
          const cIn = sm(0.87, 0.96, p);
          if (cta) gsap.set(cta, { autoAlpha: cIn, y: (1 - cIn) * 22, pointerEvents: cIn > 0.5 ? "auto" : "none" });
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
      className="relative z-[35] bg-[var(--bg)] md:h-[170vh]"
      aria-label="Wherever the story is"
    >
      <div className="overflow-hidden md:sticky md:top-0 md:h-screen">
        <div className="fb-stage relative flex h-[80vh] items-center justify-center md:h-screen">
          {/* the film — small and far back, growing up and over itself */}
          <div className="fb-frame absolute inset-0 overflow-hidden will-change-transform">
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
