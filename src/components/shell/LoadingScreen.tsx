"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen, v7. Plays on EVERY full page load (the old
// once-per-session gate meant every reload showed a static logo + finished
// circle for half a second — the "no animation" bug).
// The sequence, three clean beats:
//   1. the HW mark writes itself out (soft ink-edge sweep)
//   2. the two lines draw from the BOTTOM, rising both sides at once,
//      closing the circle at the top (DrawSVG, from the same origin point)
//   3. ONE continuous accelerating push through the lens into white,
//      and the site is underneath
// The hero holds until "hw:reveal" fires. Reduced-motion skips to a cut.

export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const arcLeftRef = useRef<SVGPathElement>(null);
  const arcRightRef = useRef<SVGPathElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reveal = () => {
      (window as unknown as { __hwRevealed?: boolean }).__hwRevealed = true;
      window.dispatchEvent(new Event("hw:reveal"));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      setDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const mask = "linear-gradient(100deg, #000 48%, rgba(0,0,0,0) 62%)";
      gsap.set(logoRef.current, {
        webkitMaskImage: mask,
        maskImage: mask,
        webkitMaskSize: "250% 100%",
        maskSize: "250% 100%",
        webkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        webkitMaskPosition: "-140% 0%",
        maskPosition: "-140% 0%",
      });
      // both arcs hidden, ready to draw from their start point (the bottom)
      gsap.set([arcLeftRef.current, arcRightRef.current], { drawSVG: "0%" });
      gsap.set(bloomRef.current, { autoAlpha: 0 });
      gsap.set(".ls-meta", { autoAlpha: 0, y: 8 });

      const finish = () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0, duration: 0.7, ease: "power2.inOut",
          onStart: reveal, onComplete: () => setDone(true),
        });
      };

      gsap
        .timeline({ onComplete: finish })
        // the room lights come up
        .to(".ls-meta", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
        // 1 — the mark writes itself out, steady hand
        .to(logoRef.current, {
          webkitMaskPosition: "0% 0%",
          maskPosition: "0% 0%",
          duration: 1.7,
          ease: "power1.inOut",
        }, 0.25)
        // 2 — the two lines rise from the bottom together and close at the top
        .to([arcLeftRef.current, arcRightRef.current], {
          drawSVG: "0% 100%", duration: 1.5, ease: "power2.inOut",
        }, 2.1)
        // 3 — one continuous push: everything accelerates past the viewer,
        // the mark falls away inside the same move, white blooms at its peak
        .to(stageRef.current, {
          scale: 18, duration: 1.4, ease: "power3.in", force3D: true,
        }, 3.85)
        .to(logoRef.current, { autoAlpha: 0, duration: 0.9, ease: "power3.in" }, 3.95)
        .to(".ls-meta", { autoAlpha: 0, duration: 0.5 }, 3.9)
        .to(bloomRef.current, { autoAlpha: 1, duration: 0.65, ease: "power2.in" }, 4.5);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-[300] bg-black text-[#f5f1e6]">
      {/* corner meta — quiet, technical */}
      <span className="ls-meta label-mono absolute left-6 top-6 text-[10px] tracking-[0.24em] text-white/60 md:left-10 md:top-8">
        HW MEDIA
      </span>
      <span className="ls-meta label-mono absolute right-6 top-6 text-[10px] tracking-[0.24em] text-white/60 md:right-10 md:top-8">
        LONDON
      </span>

      {/* the stage — mark + lens push through the viewer as ONE object */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div ref={stageRef} className="relative flex items-center justify-center will-change-transform">
          <svg
            className="absolute h-[19rem] w-[19rem] md:h-[25rem] md:w-[25rem]"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* both paths START at the bottom point (100,196) — DrawSVG grows
                them toward the top point (100,4) up opposite sides */}
            <path
              ref={arcLeftRef}
              d="M 100 196 A 96 96 0 0 1 100 4"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              ref={arcRightRef}
              d="M 100 196 A 96 96 0 0 0 100 4"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            src="/logos/hwmedia-white.png"
            alt=""
            className="h-32 w-auto md:h-44"
          />
        </div>
        <span className="ls-meta label-mono absolute bottom-10 text-[10px] tracking-[0.24em] text-white/60">
          FILMS, NOT CONTENT
        </span>
      </div>

      {/* the white the camera drives into */}
      <div ref={bloomRef} className="pointer-events-none absolute inset-0 bg-white" />
    </div>
  );
}
