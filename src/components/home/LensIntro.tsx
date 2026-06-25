"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import { BOOKING_URL } from "@/content/site";
import { getLenis } from "@/lib/lenis";

// CH.00 — the lens. The showreel sits INSIDE a real circular lens: the footage is
// clipped to a glass disc, ringed by a machined barrel (brushed-metal ring, knurled
// focus ring, gold aperture ring, index dot) with a specular highlight on the glass.
// On load the disc grows and dives forward to fill the frame while the barrel rings
// fade past, then the motto rises in liquid glass. Scroll is locked until the dive
// finishes (safe failsafe). Click anywhere to play the reel with sound.
export default function LensIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const unlockRef = useRef<(() => void) | null>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullReelRef = useRef<HTMLVideoElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(lensRef.current, { scale: 4 });
      gsap.set(ringsRef.current, { autoAlpha: 0 });
      gsap.set(cueRef.current, { autoAlpha: 0 });
      gsap.set(".hero-motto", { autoAlpha: 1 });
      return;
    }

    // RESTING — a mid-size lens dead centre, rings visible, motto hidden.
    gsap.set(lensRef.current, { scale: 1, transformOrigin: "50% 50%" });
    gsap.set(ringsRef.current, { autoAlpha: 1, scale: 1 });
    gsap.set(cueRef.current, { autoAlpha: 1 });
    gsap.set(".hero-motto", { autoAlpha: 0, y: 24 });

    let ctx: gsap.Context | null = null;
    let started = false;

    const startZoom = () => {
      if (started) return;
      started = true;

      // lock scroll for the dive only (Lenis stop + capture blocker), released on
      // finish with a hard failsafe so scroll can never stay dead.
      const lenis = getLenis();
      lenis?.stop();
      window.scrollTo(0, 0);
      const opts: AddEventListenerOptions = { passive: false, capture: true };
      const block = (e: Event) => e.preventDefault();
      const blockKeys = (e: KeyboardEvent) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key)) e.preventDefault();
      };
      window.addEventListener("wheel", block, opts);
      window.addEventListener("touchmove", block, opts);
      window.addEventListener("keydown", blockKeys, opts);
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        window.removeEventListener("wheel", block, opts);
        window.removeEventListener("touchmove", block, opts);
        window.removeEventListener("keydown", blockKeys, opts);
        lenis?.start();
      };
      unlockRef.current = release;
      const failsafe = window.setTimeout(release, 5600);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          delay: 0.2,
          onComplete: () => { window.clearTimeout(failsafe); release(); },
        });
        // the barrel rings fade + spread as we pass through them
        tl.to(ringsRef.current, { autoAlpha: 0, scale: 1.7, duration: 1.6, ease: "power2.in" }, 0);
        // the glass disc grows forward and fills the frame — pure transform scale
        tl.to(lensRef.current, { scale: 4.4, duration: 3.0, ease: "power2.inOut" }, 0);
        tl.to(cueRef.current, { autoAlpha: 0, duration: 0.4 }, 0);
        // ARRIVE — the motto rises in liquid glass
        tl.to(".hero-motto", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.45);
      }, wrap);
    };

    window.addEventListener("hw:reveal", startZoom, { once: true });
    const fallback = window.setTimeout(startZoom, 3200);

    return () => {
      window.removeEventListener("hw:reveal", startZoom);
      window.clearTimeout(fallback);
      unlockRef.current?.();
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
      {/* liquid-glass filter (animated turbulence -> displacement) for the motto */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter id="liquidGlass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="noise">
            <animate attributeName="baseFrequency" dur="18s" values="0.006 0.012;0.012 0.007;0.006 0.012" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        className="on-media sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black"
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

        {/* the motto — liquid glass over the footage */}
        <div className="hero-motto absolute left-0 top-[33%] z-10 px-5 md:px-10">
          <h1 className="glass-motto font-display text-[clamp(2.8rem,9vw,8.2rem)] leading-[0.82]" style={{ filter: "url(#liquidGlass)" }}>
            Break the<br />
            <span className="glass-motto-gold">ordinary.</span>
          </h1>
          <p
            className="mt-5 max-w-md text-[clamp(1.05rem,1.6vw,1.5rem)] leading-snug text-[#f5f1e6]/85"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            we go where the story is
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#f5f1e6]/55 px-8 py-3.5 text-[clamp(15px,1.4vw,18px)] text-[#f5f1e6] transition-colors duration-300 hover:bg-[#f5f1e6] hover:text-black"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            Book a call with us <span aria-hidden>⟶</span>
          </a>
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
