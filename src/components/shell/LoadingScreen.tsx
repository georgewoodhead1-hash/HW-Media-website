"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen, v8 — THROUGH THE LENS for real (George: "you
// don't really go through a camera lens — that needs to happen"). Plays on
// every full load. Three beats, one motion:
//   1. the HW mark writes itself out (soft ink-edge sweep)
//   2. the two lines draw from the BOTTOM, rising both sides, closing the
//      circle at the top — the lens, assembled
//   3. the black IS the camera body: an aperture opens exactly on the
//      drawn ring and you pass THROUGH it onto the live site — the ring
//      rides the rim of the opening iris, the mark falls away behind.
//      No white bloom, no second zoom. The site is already moving as the
//      iris clears.
// The hero starts on "hw:reveal", fired the moment the iris begins to
// open. Reduced-motion skips to a cut.

export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const arcLeftRef = useRef<SVGPathElement>(null);
  const arcRightRef = useRef<SVGPathElement>(null);
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
      gsap.set(".ls-meta", { autoAlpha: 0, y: 8 });

      // the APERTURE: a circular hole in the black, opened via mask. The
      // hole's radius and the drawn ring's scale run off the same value, so
      // the ring rides the rim of the iris as it opens.
      const root = rootRef.current;
      const svgEl = root?.querySelector<SVGSVGElement>(".ls-lens");
      const R0 = svgEl ? svgEl.getBoundingClientRect().width * 0.48 : 150;
      const RMAX = Math.hypot(window.innerWidth, window.innerHeight) * 0.62;
      const iris = { r: 0 };
      const setMask = (r: number) => {
        if (!root) return;
        const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r + 1.5}px)`;
        root.style.webkitMaskImage = m;
        root.style.maskImage = m;
      };

      gsap
        .timeline({ onComplete: () => setDone(true) })
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
        // 3 — THROUGH THE LENS: the site wakes behind, the mark falls away,
        // and the iris opens on the drawn ring — one accelerating pass
        .call(reveal, [], 3.78)
        .to(logoRef.current, { autoAlpha: 0, scale: 0.94, duration: 0.5, ease: "power2.in" }, 3.8)
        .to(".ls-meta", { autoAlpha: 0, duration: 0.45 }, 3.8)
        .to(iris, {
          r: RMAX,
          duration: 1.35,
          ease: "power3.in",
          onUpdate: () => {
            setMask(iris.r);
            const k = 1 + (iris.r / R0 - 1);
            if (stageRef.current) gsap.set(stageRef.current, { scale: Math.max(1, k), force3D: true });
            // the ring thins out as it flies past the viewer
            const fade = Math.min(1, Math.max(0, (iris.r - RMAX * 0.55) / (RMAX * 0.35)));
            if (svgEl) gsap.set(svgEl, { opacity: 1 - fade });
          },
        }, 3.95);
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
            className="ls-lens absolute h-[19rem] w-[19rem] md:h-[25rem] md:w-[25rem]"
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

    </div>
  );
}
