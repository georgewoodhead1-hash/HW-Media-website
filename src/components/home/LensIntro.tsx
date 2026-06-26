"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// CH.00 — the lens. The showreel sits INSIDE a real circular lens: the footage is
// clipped to a glass disc, ringed by a machined barrel (brushed-metal ring, knurled
// focus ring, gold aperture ring, index dot) with a specular highlight on the glass.
// On load the disc grows and dives forward to fill the frame while the barrel rings
// fade past, then the motto rises in liquid glass. Scroll is locked until the dive
// finishes (safe failsafe). Click anywhere to play the reel with sound.
export default function LensIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullReelRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(bgRef.current, { autoAlpha: 1 });
      gsap.set([lensRef.current, ringsRef.current], { autoAlpha: 0 });
      gsap.set(cueRef.current, { autoAlpha: 0 });
      gsap.set(".hero-motto", { autoAlpha: 1 });
      return;
    }

    // RESTING — a mid-size lens dead centre, rings visible, sharp bg + motto hidden.
    gsap.set(bgRef.current, { autoAlpha: 0 });
    gsap.set(lensRef.current, { scale: 1, transformOrigin: "50% 50%" });
    gsap.set(ringsRef.current, { autoAlpha: 1, scale: 1 });
    gsap.set(cueRef.current, { autoAlpha: 1 });
    gsap.set(".hero-motto", { autoAlpha: 0, y: 24 });

    let ctx: gsap.Context | null = null;
    let started = false;

    // NO scroll-lock. The old version called Lenis.stop() + capture-phase
    // wheel/touch/key blockers and relied on a release callback firing — if that
    // ever missed, scroll died across the WHOLE site (the "scroll freezes" bug).
    // The dive is fast enough now that it reads before you'd scroll anyway.
    const startZoom = () => {
      if (started) return;
      started = true;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        // the barrel rings fade + spread as we pass through them
        tl.to(ringsRef.current, { autoAlpha: 0, scale: 1.7, duration: 1.0, ease: "power2.in" }, 0);
        // the glass disc dives forward, then DISSOLVES into the sharp full-bleed
        // footage — much faster (it took far too long to arrive before).
        tl.to(lensRef.current, { scale: 3.2, duration: 1.5, ease: "power2.inOut" }, 0);
        tl.to(cueRef.current, { autoAlpha: 0, duration: 0.35 }, 0);
        tl.to(bgRef.current, { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.85);
        tl.to(lensRef.current, { autoAlpha: 0, duration: 0.55, ease: "power2.in" }, 1.15);
        // ARRIVE — the motto rises over the live footage (mix-blend interacts)
        tl.to(".hero-motto", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.35);
      }, wrap);
    };

    window.addEventListener("hw:reveal", startZoom, { once: true });
    // start almost immediately if the preloader event never fires (was 3.2s —
    // that wait is why the camera "took far too long to come in").
    const fallback = window.setTimeout(startZoom, 500);

    return () => {
      window.removeEventListener("hw:reveal", startZoom);
      window.clearTimeout(fallback);
      ctx?.revert();
    };
  }, []);

  const openReel = () => {
    setReelOpen(true);
    dialogRef.current?.showModal();
    videoRef.current?.pause();
    const reel = fullReelRef.current;
    if (reel) {
      reel.currentTime = 0;
      safePlay(reel);
    }
  };

  const closeReel = () => {
    fullReelRef.current?.pause();
    dialogRef.current?.close();
    setReelOpen(false);
    safePlay(videoRef.current);
  };

  return (
    <div ref={wrapRef} data-theme="dark" data-surface="media" data-chapter="CH.00 — The lens" className="relative h-screen">
      <div
        className="on-media isolate sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black"
        data-cursor="play"
        onClick={openReel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openReel();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Play showreel with sound"
      >
        {/* sharp full-bleed hero footage — revealed as the dive dissolves */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={bgRef} className="pointer-events-none absolute inset-0 h-full w-full object-cover" src="/videos/hero-loop.mp4" autoPlay muted loop playsInline style={{ filter: "brightness(0.9) contrast(1.06)" }} />

        {/* THE LENS — barrel rings + circular glass disc holding the reel */}
        <div className="relative" style={{ width: "62vmin", height: "62vmin" }}>
          {/* barrel rings */}
          <div ref={ringsRef} className="pointer-events-none absolute inset-0 will-change-transform">
            {/* seating shadow */}
            <div className="absolute -inset-[12%] rounded-full" style={{ background: "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.6) 70%, transparent 84%)" }} />
            {/* outer brushed-metal barrel */}
            <div
              className="absolute -inset-[8%] rounded-full"
              style={{
                background: "conic-gradient(from 210deg, #0c0c0c, #2c2c2c 12%, #0e0e0e 25%, #353535 38%, #0d0d0d 52%, #272727 68%, #0b0b0b 82%, #2a2a2a 94%, #0c0c0c)",
                WebkitMaskImage: "radial-gradient(circle, transparent 60.5%, #000 61.5%, #000 100%)",
                maskImage: "radial-gradient(circle, transparent 60.5%, #000 61.5%, #000 100%)",
              }}
            />
            {/* knurled focus ring */}
            <div
              className="absolute -inset-[2.5%] rounded-full"
              style={{
                background: "repeating-conic-gradient(#111 0deg 1.05deg, #202020 1.05deg 2.1deg)",
                WebkitMaskImage: "radial-gradient(circle, transparent 80%, #000 81%, #000 93%, transparent 94%)",
                maskImage: "radial-gradient(circle, transparent 80%, #000 81%, #000 93%, transparent 94%)",
              }}
            />
            {/* top-left rim light */}
            <div
              className="absolute -inset-[8%] rounded-full"
              style={{
                background: "conic-gradient(from 150deg, transparent 0deg, rgba(255,255,255,0.25) 38deg, rgba(255,255,255,0.04) 80deg, transparent 120deg, transparent 360deg)",
                WebkitMaskImage: "radial-gradient(circle, transparent 67%, #000 68%, #000 72%, transparent 73%)",
                maskImage: "radial-gradient(circle, transparent 67%, #000 68%, #000 72%, transparent 73%)",
                filter: "blur(1px)",
              }}
            />
            {/* gold aperture ring + index dot */}
            <div className="absolute -inset-[1%] rounded-full border-2 border-[var(--gold)]/40" />
            <div className="absolute left-1/2 -top-[2.5%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[var(--gold)] shadow-[0_0_10px_rgba(191,170,83,0.9)]" />
          </div>

          {/* the glass disc — the reel, clipped to a circle */}
          <div
            ref={lensRef}
            className="absolute left-1/2 top-1/2 aspect-square w-[54vmin] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full will-change-transform"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/showreel-full.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            {/* specular glass highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "radial-gradient(ellipse at 34% 26%, rgba(255,255,255,0.30), rgba(255,255,255,0.05) 30%, transparent 56%)" }} />
            {/* glass-depth vignette + faint chromatic rim */}
            <div className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 70px 12px rgba(0,0,0,0.5)" }} />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[rgba(216,74,160,0.14)]" />
          </div>
        </div>

        {/* the motto — the footage plays THROUGH the text (mix-blend-difference,
            the same effect the IG/LinkedIn marks use), not a distortion filter */}
        <div className="hero-motto absolute left-0 top-[33%] z-10 px-5 md:px-10">
          <h1 className="font-display text-[clamp(2.8rem,9vw,8.2rem)] leading-[0.82] text-white mix-blend-difference">
            Break the<br />
            ordinary.
          </h1>
          <p
            className="mt-5 max-w-md text-[clamp(1.05rem,1.6vw,1.5rem)] leading-snug text-white"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            we go where the story is
          </p>
          <Link
            href="/contact"
            onClick={(e) => e.stopPropagation()}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/70 px-8 py-3.5 text-[clamp(15px,1.4vw,18px)] text-white transition-opacity duration-300 hover:opacity-70"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Start here <span aria-hidden>⟶</span>
          </Link>
        </div>

        {/* scroll cue */}
        <div ref={cueRef} className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2">
          <span className="label-mono text-[10px] opacity-70">Scroll</span>
          <span className="block h-8 w-px animate-pulse bg-[var(--gold)]" />
        </div>
      </div>

      {/* fullscreen reel */}
      <dialog
        ref={dialogRef}
        onClose={closeReel}
        className="m-0 h-screen max-h-none w-screen max-w-none bg-black p-0 backdrop:bg-black/90"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <video
            ref={fullReelRef}
            className="h-full w-full object-contain"
            src="/videos/showreel-full.mp4"
            controls={reelOpen}
            playsInline
          />
          <button
            onClick={closeReel}
            className="label-mono absolute right-6 top-6 rounded-full border border-[var(--hairline-dark)] bg-black/40 px-5 py-3 text-[#f5f1e6] backdrop-blur-sm transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            aria-label="Close showreel"
          >
            Close ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}
