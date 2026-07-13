"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The Defender band, v4 — the IL CAPO reveal (George, 2026-07-13: "the
// images come up… it kind of goes out a little bit before it then takes
// the frame… copy that"). Probed live from ilcapoproduction.com: media
// waits at clip-path inset(50%), and on entry the box OPENS FROM THE
// CENTRE to inset(0) over ~1.4s on an expo-style S-curve — it creeps open
// first, then accelerates and takes the whole frame; opacity snaps in
// during the first beat. Time-based on entry (not scrubbed), reversible.
// "Wherever the story is." and Start here land as the frame completes.

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

      gsap.set(frame, { clipPath: "inset(50%)", autoAlpha: 0 });
      if (img) gsap.set(img, { scale: 1.12 });
      gsap.set([line, cta], { autoAlpha: 0, y: 22 });

      const tl = gsap.timeline({ paused: true });
      tl.to(frame, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        // the il capo box: barely opens, hesitates, then takes the frame
        .to(frame, { clipPath: "inset(0%)", duration: 1.45, ease: "expo.inOut" }, 0)
        .to(img, { scale: 1, duration: 1.45, ease: "expo.inOut" }, 0)
        .to(line, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.95)
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.1);

      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top 62%",
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });

      return () => {
        st.kill();
        tl.kill();
      };
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
