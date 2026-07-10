"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen, v5 (George's spec, final round):
//   1. the HW mark WRITES ITSELF ON (left→right reveal, like the signature
//      being written)
//   2. a circle draws from the BOTTOM up BOTH sides and closes at the top
//   3. the closed ring becomes THE CAMERA — our own animation, no video:
//      concentric lens rings resolve around the mark, then the whole lens
//      drives PAST the viewer (scale blow-out) into a white bloom
//   4. the bloom fades and the home screen is revealed underneath
// The hero holds until "hw:reveal" fires, so nothing on the page moves
// before the loader is done. Reduced-motion and repeat visits skip to a
// quick dissolve.

export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const arcLeftRef = useRef<SVGPathElement>(null);
  const arcRightRef = useRef<SVGPathElement>(null);
  const ring2Ref = useRef<SVGCircleElement>(null);
  const ring3Ref = useRef<SVGCircleElement>(null);
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
      // start states: mark hidden behind a left→right writing wipe, arcs
      // undrawn, lens rings invisible, bloom off
      gsap.set(logoRef.current, {
        clipPath: "inset(0% 100% 0% 0%)",
        filter: "blur(1.5px)",
      });
      gsap.set([arcLeftRef.current, arcRightRef.current], {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set([ring2Ref.current, ring3Ref.current], { autoAlpha: 0, scale: 0.92, transformOrigin: "50% 50%" });
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
        // room lights on
        .to(".ls-meta", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
        // 1 — the mark writes itself on
        .to(logoRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px)",
          duration: 1.35,
          ease: "power2.inOut",
        }, 0.2)
        // 2 — the circle draws from the bottom, both sides at once
        .to([arcLeftRef.current, arcRightRef.current], {
          strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut",
        }, 1.25)
        // 3 — THE CAMERA forms: two more lens rings resolve around the ring
        .to(ring2Ref.current, { autoAlpha: 0.55, scale: 1, duration: 0.5, ease: "power2.out" }, 2.6)
        .to(ring3Ref.current, { autoAlpha: 0.3, scale: 1, duration: 0.5, ease: "power2.out" }, 2.72)
        // a held beat — the lens, assembled
        .to({}, { duration: 0.25 })
        // …then the camera drives PAST the viewer: the whole lens blows out
        // through the frame while the mark falls away behind it
        .to(logoRef.current, { scale: 0.8, autoAlpha: 0, filter: "blur(10px)", duration: 0.9, ease: "power3.in" }, 3.45)
        .to(lensRef.current, {
          scale: 14, autoAlpha: 0, duration: 1.15, ease: "power3.in",
        }, 3.4)
        .to(".ls-meta", { autoAlpha: 0, duration: 0.4 }, 3.5)
        // 4 — the bloom peaks and hands over to the site
        .to(bloomRef.current, { autoAlpha: 1, duration: 0.55, ease: "power2.in" }, 3.85);
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

      {/* the stage — mark writing on inside the forming lens */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div ref={logoWrapRef} className="relative flex items-center justify-center">
          {/* THE LENS — main ring drawn as two bottom-up arcs, then two more
              rings resolve to read as a camera lens barrel */}
          <div ref={lensRef} className="absolute flex h-[19rem] w-[19rem] items-center justify-center will-change-transform md:h-[25rem] md:w-[25rem]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200" fill="none">
              <path
                ref={arcLeftRef}
                d="M 100 196 A 96 96 0 0 1 100 4"
                pathLength={1}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <path
                ref={arcRightRef}
                d="M 100 196 A 96 96 0 0 0 100 4"
                pathLength={1}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <circle ref={ring2Ref} cx="100" cy="100" r="86" stroke="rgba(255,255,255,0.75)" strokeWidth={0.8} />
              <circle ref={ring3Ref} cx="100" cy="100" r="74" stroke="rgba(255,255,255,0.55)" strokeWidth={0.6} />
            </svg>
          </div>
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
