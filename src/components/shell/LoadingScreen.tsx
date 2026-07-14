"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { createLensDive, type LensDive } from "@/components/shell/lensDive";

// Pre-entry loading screen, v10 — THE 3D DIVE (George, 2026-07-14 round 8:
// "needs to feel like you are diving through an actual camera lens").
// The write-on stays EXACTLY as v9 (George: "really good"):
//   1. the HW mark writes itself out LEFT TO RIGHT, unhurried
//   2. the two ring lines rise from the bottom, closing at the top
//   3. the APERTURE assembles — blades draw in, the focus ticks pull round
// …then the flat iris is GONE. In its place:
//   4. the drawn lens flies past you and the camera TRAVELS down a real 3D
//      lens barrel (three.js) — machined rings, glass elements, an 8-blade
//      aperture swinging open as you reach it
//   5. at the far end of the barrel the SHOWREEL is playing; the dive lands
//      inside it and the loader hands straight to the hero reel beneath.
// WebGL unavailable → the v9 2D iris plays instead. Reduced-motion cuts.

// hexagon chord endpoints on the ring (r = 78 about 100,100)
const HEX = [
  [100, 22], [167.5, 61], [167.5, 139], [100, 178], [32.5, 139], [32.5, 61],
] as const;

export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const arcLeftRef = useRef<SVGPathElement>(null);
  const arcRightRef = useRef<SVGPathElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    // the 3D barrel builds in the background WHILE the mark writes — by the
    // time the dive is due it has its first frame ready and the showreel
    // buffering. If WebGL/three fails, dive stays null and the 2D iris runs.
    let dive: LensDive | null = null;
    let disposed = false;
    if (canvasRef.current) {
      createLensDive(canvasRef.current).then((d) => {
        if (disposed) { d?.dispose(); return; }
        dive = d;
      });
    }
    let endTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      // same ink-edge gradient as v8, but the position runs from +140%
      // instead of −140% — that flips the sweep to LEFT → RIGHT (the
      // gradient's black edge enters over the container's left side first)
      const mask = "linear-gradient(100deg, #000 48%, rgba(0,0,0,0) 62%)";
      gsap.set(logoRef.current, {
        webkitMaskImage: mask,
        maskImage: mask,
        webkitMaskSize: "250% 100%",
        maskSize: "250% 100%",
        webkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        webkitMaskPosition: "140% 0%",
        maskPosition: "140% 0%",
      });
      gsap.set([arcLeftRef.current, arcRightRef.current], { drawSVG: "0%" });
      gsap.set(".ls-meta", { autoAlpha: 0, y: 8 });
      gsap.set(".ls-blade", { drawSVG: "50% 50%", autoAlpha: 0 });
      gsap.set(".ls-blades", { rotation: -26, scale: 1, transformOrigin: "50% 50%", svgOrigin: "100 100" });
      gsap.set(".ls-ticks", { autoAlpha: 0, rotation: 0, svgOrigin: "100 100" });

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

      // ── the ENDINGS, picked when the write-on finishes ──
      // A: the 3D dive — the drawn lens flies past, the camera travels the
      // barrel, the aperture opens mid-flight, the reel takes the frame
      const diveEnding = (d: LensDive) => {
        const state = { p: 0 };
        d.begin();
        endTl = gsap
          .timeline({ onComplete: () => setDone(true) })
          // fly PAST the 2D lens you just built — it scales out around you
          .to(canvasRef.current, { autoAlpha: 1, duration: 0.5, ease: "power1.inOut" }, 0)
          .to(stageRef.current, { scale: 2.3, autoAlpha: 0, duration: 0.75, ease: "power2.in" }, 0)
          .to(".ls-meta", { autoAlpha: 0, duration: 0.4 }, 0.05)
          // THE DIVE — one eased travel, the barrel does the talking
          .to(state, {
            p: 1,
            duration: 2.35,
            ease: "power2.inOut",
            onUpdate: () => d.apply(state.p),
          }, 0.15)
          // the site wakes beneath while we land inside the reel…
          .call(reveal, [], 1.9)
          // …and the loader hands over to the live hero
          .to(rootRef.current, { autoAlpha: 0, duration: 0.4, ease: "power1.out" }, 2.45);
      };

      // B: fallback (no WebGL) — the v9 flat iris
      const irisEnding = () => {
        endTl = gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(".ls-blades", { rotation: 55, scale: 1.5, autoAlpha: 0, duration: 0.85, ease: "power3.in" }, 0)
          .to(".ls-ticks", { autoAlpha: 0, rotation: 60, duration: 0.6, ease: "power2.in" }, 0)
          .call(reveal, [], 0.15)
          .to(logoRef.current, { autoAlpha: 0, scale: 0.94, duration: 0.5, ease: "power2.in" }, 0.2)
          .to(".ls-meta", { autoAlpha: 0, duration: 0.45 }, 0.2)
          .to(iris, {
            r: RMAX,
            duration: 1.3,
            ease: "power3.in",
            onUpdate: () => {
              setMask(iris.r);
              const k = 1 + (iris.r / R0 - 1);
              if (stageRef.current) gsap.set(stageRef.current, { scale: Math.max(1, k), force3D: true });
              const fade = Math.min(1, Math.max(0, (iris.r - RMAX * 0.55) / (RMAX * 0.35)));
              if (svgEl) gsap.set(svgEl, { opacity: 1 - fade });
            },
          }, 0.3);
      };

      gsap
        .timeline({ onComplete: () => (dive ? diveEnding(dive) : irisEnding()) })
        // the room lights come up
        .to(".ls-meta", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
        // 1 — the mark writes itself, left to right, unhurried
        .to(logoRef.current, {
          webkitMaskPosition: "0% 0%",
          maskPosition: "0% 0%",
          duration: 2.2,
          ease: "power1.inOut",
        }, 0.25)
        // 2 — the ring rises from the bottom on both sides
        .to([arcLeftRef.current, arcRightRef.current], {
          drawSVG: "0% 100%", duration: 1.3, ease: "power2.inOut",
        }, 2.25)
        // 3 — the APERTURE assembles: six blades draw across the ring into
        // the hexagonal iris; the focus ticks appear and pull round
        .to(".ls-blade", { drawSVG: "0% 100%", autoAlpha: 1, duration: 0.55, ease: "power2.out", stagger: 0.06 }, 3.45)
        .to(".ls-blades", { rotation: 0, duration: 0.9, ease: "power3.inOut" }, 3.45)
        .to(".ls-ticks", { autoAlpha: 0.55, duration: 0.4 }, 3.5)
        .to(".ls-ticks", { rotation: 32, duration: 1.05, ease: "power2.inOut" }, 3.5)
        // the mark dims a touch behind the closed aperture — focus found
        .to(logoRef.current, { autoAlpha: 0.75, duration: 0.4 }, 3.9)
        // a held breath at full focus, then the ending takes it
        .to({}, { duration: 0.55 }, 4.4);
    }, rootRef);

    return () => {
      disposed = true;
      endTl?.kill();
      dive?.dispose();
      ctx.revert();
    };
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

      {/* the 3D barrel — sits under the 2D stage, fades in as the dive
          starts (the drawn lens flies out over it) */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-0" aria-hidden />

      {/* the stage — mark + lens push through the viewer as ONE object */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div ref={stageRef} className="relative flex items-center justify-center will-change-transform">
          <svg
            className="ls-lens absolute h-[19rem] w-[19rem] md:h-[25rem] md:w-[25rem]"
            viewBox="0 0 200 200"
            fill="none"
          >
            {/* both ring paths START at the bottom point — DrawSVG grows
                them toward the top up opposite sides */}
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
            {/* the focus ring's ticks */}
            <circle
              className="ls-ticks"
              cx="100" cy="100" r="88"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={1.4}
              strokeDasharray="2 9"
            />
            {/* the aperture — six chords closing into a hexagonal iris */}
            <g className="ls-blades">
              {HEX.map((v, i) => {
                const w = HEX[(i + 1) % 6];
                return (
                  <line
                    key={i}
                    className="ls-blade"
                    x1={v[0]} y1={v[1]} x2={w[0]} y2={w[1]}
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            src="/logos/hwmedia-white.png"
            alt=""
            className="h-32 w-auto md:h-44"
          />
        </div>
      </div>
    </div>
  );
}
