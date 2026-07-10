"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen, v6 (George's notes):
//   1. the HW mark WRITES ITSELF OUT — a soft-edged mask sweeps along the
//      writing direction, so the ink appears gradually (no hard wipe)
//   2. THEN the two lines draw — you can see them start together at the
//      bottom and rise up either side to close the circle at the top
//   3. THEN one single continuous push: the whole lens drives past the
//      viewer in one accelerating motion (no staged zooms), blooming to
//      white as it passes — and the site fades in underneath
// The hero holds until "hw:reveal" fires. Reduced-motion and repeat visits
// skip to a quick dissolve.

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
    let seen = false;
    try { seen = sessionStorage.getItem("hw-intro-seen") === "1"; sessionStorage.setItem("hw-intro-seen", "1"); } catch {}
    if (seen) {
      const quick = gsap.to(rootRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut",
        delay: 0.15,
        onStart: reveal,
        onComplete: () => setDone(true),
      });
      return () => { quick.kill(); };
    }

    const ctx = gsap.context(() => {
      const mask =
        "linear-gradient(100deg, #000 45%, rgba(0,0,0,0) 65%)";
      // the ink starts fully off-canvas left; sweeping the gradient right
      // reveals the mark stroke-by-stroke, soft-edged — the writing feel
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
      gsap.set([arcLeftRef.current, arcRightRef.current], {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(bloomRef.current, { autoAlpha: 0 });
      gsap.set(".ls-meta", { autoAlpha: 0, y: 8 });

      const finish = () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0, duration: 0.7, ease: "power2.inOut",
          onStart: reveal, onComplete: () => setDone(true),
        });
      };

      const tl = gsap.timeline({ onComplete: finish });
      tl
        // room lights on
        .to(".ls-meta", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
        // 1 — the mark writes itself out, steady hand
        .to(logoRef.current, {
          webkitMaskPosition: "0% 0%",
          maskPosition: "0% 0%",
          duration: 1.7,
          ease: "power1.inOut",
        }, 0.25)
        // 2 — THEN the two lines rise from the bottom and close at the top
        .to([arcLeftRef.current, arcRightRef.current], {
          strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut",
        }, 2.05)
        // 3 — ONE continuous push past the viewer: stage, mark fade and
        // bloom all keyed inside the same accelerating move
        .to(stageRef.current, {
          scale: 16, duration: 1.35, ease: "power3.in", force3D: true,
        }, 3.75)
        .to(logoRef.current, { autoAlpha: 0, duration: 1.0, ease: "power3.in" }, 3.75)
        .to(".ls-meta", { autoAlpha: 0, duration: 0.5 }, 3.8)
        .to(bloomRef.current, { autoAlpha: 1, duration: 0.7, ease: "power2.in" }, 4.3);
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

      {/* the stage — everything pushes through the viewer as ONE object */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div ref={stageRef} className="relative flex items-center justify-center will-change-transform">
          <svg
            className="absolute h-[19rem] w-[19rem] md:h-[25rem] md:w-[25rem]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              ref={arcLeftRef}
              d="M 100 196 A 96 96 0 0 1 100 4"
              pathLength={1}
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <path
              ref={arcRightRef}
              d="M 100 196 A 96 96 0 0 0 100 4"
              pathLength={1}
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
            className="h-32 w-auto will-change-[transform,filter] md:h-44"
          />
        </div>
        <span className="ls-meta label-mono absolute bottom-10 text-[10px] tracking-[0.24em] text-white/60">
          FILMS, NOT CONTENT
        </span>
      </div>

      {/* the bloom the camera drives into */}
      <div ref={bloomRef} className="pointer-events-none absolute inset-0 bg-white" />
    </div>
  );
}
