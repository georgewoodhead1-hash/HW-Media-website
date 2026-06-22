"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { safePlay } from "@/lib/video";

// CH.00 — the lens. A real cine prime hanging in dark space, starting small
// (further out). Scroll approaches it, then passes through the LAYERS of the
// glass: the barrel hardware and front element fly past first, then the
// middle group (chromatic edges, refraction sheen), then the rear element —
// each at its own speed, like moving through a real optical stack. The reel
// recessed in the throat grows until it IS the viewport, the framing racks
// back to the true shot, the headline lands and blends with the footage,
// then a long buffer holds before the page releases. Fully reversible.

const RIG_REST = 0.55; // the whole lens starts at half size — further out
const VESSEL_REST = 0.16; // reel disc scale within the rig
const INNER_REST = 2.85; // reel over-zoom so the disc is always covered

/* Coords rounded so V8 and JSC serialise identically (Safari hydration). */
function ring(r: number, count: number, longEvery: number, len: number, lenLong: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((i * 360) / count) * (Math.PI / 180);
    const long = i % longEvery === 0;
    const l = long ? lenLong : len;
    return {
      key: i,
      long,
      x1: (500 + r * Math.cos(a)).toFixed(2),
      y1: (500 + r * Math.sin(a)).toFixed(2),
      x2: (500 + (r - l) * Math.cos(a)).toFixed(2),
      y2: (500 + (r - l) * Math.sin(a)).toFixed(2),
    };
  });
}

function GlassArt() {
  const knurl = ring(479, 120, 10, 7, 14);
  const aperture = ["22", "16", "11", "8", "5.6", "4", "2.8"];

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <defs>
        <linearGradient id="lens-spec" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <path id="lens-engrave" d="M 500 95 A 405 405 0 1 1 499.99 95" fill="none" />
        <path id="lens-scale" d="M 152 500 A 348 348 0 0 0 848 500" fill="none" />
      </defs>

      {/* rim edges + filter thread */}
      <circle cx="500" cy="500" r="496" fill="none" stroke="rgba(245,241,230,0.3)" strokeWidth="1.5" />
      <circle cx="500" cy="500" r="490" fill="none" stroke="rgba(245,241,230,0.08)" strokeWidth="1" />
      <circle cx="500" cy="500" r="486" fill="none" stroke="rgba(245,241,230,0.06)" strokeWidth="1" />
      <circle cx="500" cy="500" r="442" fill="none" stroke="rgba(245,241,230,0.12)" strokeWidth="1" />

      {/* knurled grip */}
      {knurl.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.long ? "rgba(245,241,230,0.4)" : "rgba(245,241,230,0.18)"}
          strokeWidth={t.long ? 1.5 : 1}
        />
      ))}

      {/* the red index dot every real lens carries */}
      <circle cx="500" cy="32" r="6" fill="var(--red)" opacity="0.9" />
      <line x1="500" y1="44" x2="500" y2="62" stroke="var(--red)" strokeWidth="2" opacity="0.7" />

      {/* specular streak on the front glass */}
      <path d="M 181.27 269.36 A 396 396 0 0 1 437.14 110.02" fill="none" stroke="url(#lens-spec)" strokeWidth="6" strokeLinecap="round" opacity="0.55" />

      {/* engraved spec ring — white with the red Ø mark */}
      <text fill="rgba(245,241,230,0.4)" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 15, letterSpacing: 7 }}>
        <textPath href="#lens-engrave">
          HW MEDIA · CINE PRIME · 24–70 ƒ2.8 · LONDON · EST. MMXX ·
        </textPath>
      </text>
      <text fill="var(--red)" opacity="0.85" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 15, letterSpacing: 7 }}>
        <textPath href="#lens-engrave" startOffset="62%">
          Ø82
        </textPath>
      </text>

      {/* aperture scale along the lower arc */}
      <text fill="rgba(245,241,230,0.28)" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 13, letterSpacing: 2 }}>
        <textPath href="#lens-scale" startOffset="6%">
          {aperture.join("   ·   ")}
        </textPath>
      </text>
    </svg>
  );
}

export default function LensIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const vesselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const rearRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
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
      gsap.set(wrap, { height: "100vh" });
      gsap.set(rigRef.current, { scale: 1 });
      gsap.set(vesselRef.current, { xPercent: -50, yPercent: -50, scale: 1 / RIG_REST });
      gsap.set(
        [frontRef.current, midRef.current, rearRef.current, vignetteRef.current, dimRef.current, cueRef.current],
        { autoAlpha: 0 },
      );
      gsap.set(veilRef.current, { opacity: 1 });
      gsap.set(".hero-motto", { autoAlpha: 1, y: 0 });
      return;
    }

    // Resting state set synchronously — the timeline only animates AWAY from it.
    gsap.set(rigRef.current, { scale: RIG_REST });
    gsap.set(vesselRef.current, { xPercent: -50, yPercent: -50, scale: VESSEL_REST });
    gsap.set(innerRef.current, { xPercent: -50, yPercent: -50, scale: INNER_REST });
    gsap.set(dimRef.current, { opacity: 0.5 });
    gsap.set(".hero-motto", { autoAlpha: 0, y: 40 });

    const ctx = gsap.context(() => {
      gsap.set(veilRef.current, { opacity: 0 });
      gsap.set(".hero-motto", { autoAlpha: 0, y: 40 });

      {
        // AUTO-PLAY loading intro (client feedback): plays itself on load,
        // one clean zoom THROUGH the lens into the reel — no scrolling, no
        // zoom-back-out. timeScale stretches the ~1s build to a smooth ~3.4s.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          delay: 0.45,
        });

        tl
          // ONE continuous zoom — the whole lens dives in as a single move.
          // All the glass flies past together (not three separate steps) while
          // the reel racks up to fill the frame. Smooth acceleration in.
          .to(rigRef.current, { scale: 1.4, duration: 1, ease: "power2.in" }, 0)
          .to([frontRef.current, midRef.current, rearRef.current], { scale: 6, autoAlpha: 0, duration: 0.85, ease: "power2.in" }, 0.12)
          .to(vesselRef.current, { scale: 1, duration: 1, ease: "power2.in" }, 0)
          .to(innerRef.current, { scale: 1, duration: 1, ease: "power2.in" }, 0)
          // the stage opens up as we land inside the film
          .to(vignetteRef.current, { opacity: 0, duration: 0.55 }, 0.45)
          .to(dimRef.current, { opacity: 0, duration: 0.6 }, 0.4)
          .to(cueRef.current, { autoAlpha: 0, duration: 0.1 }, 0)
          // the scrim settles and the motto rises in as one clean unit
          .to(veilRef.current, { opacity: 1, duration: 0.25 }, 0.9)
          .to(".hero-motto", { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.95);

        tl.timeScale(0.38); // a calm ~3s single dive
      }
    }, wrap);

    return () => {
      ctx.revert();
    };
  }, []);

  const openReel = () => {
    setReelOpen(true);
    dialogRef.current?.showModal();
    getLenis()?.stop();
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
    getLenis()?.start();
    safePlay(videoRef.current);
  };

  return (
    <div ref={wrapRef} data-theme="dark" data-surface="media" data-chapter="CH.00 — The lens" className="relative h-[200vh]">
      <div
        className="on-media sticky top-0 h-screen overflow-hidden bg-[#050505]"
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
        {/* the rig: everything physical scales together on approach */}
        <div ref={rigRef} className="absolute inset-0 will-change-transform">
          {/* the reel, recessed in the throat — already playing at rest */}
          <div
            ref={vesselRef}
            className="lens-vessel absolute left-1/2 top-1/2 h-[124vmax] w-[124vmax] will-change-transform"
          >
            <div ref={innerRef} className="absolute left-1/2 top-1/2 h-screen w-screen will-change-transform">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src="/videos/hero-loop.mp4"
                poster="/videos/posters/hero-loop.jpg"
                autoPlay
                muted
                loop
                playsInline
              />
              <div ref={dimRef} className="absolute inset-0 bg-black" />
            </div>
          </div>

          {/* REAR ELEMENT — last glass before the reel, exits last */}
          <div ref={rearRef} className="pointer-events-none absolute inset-0 will-change-transform">
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 8%, rgba(0,0,0,0.42) 12.5%, rgba(0,0,0,0.12) 15.5%, transparent 19%)",
                filter: "blur(1.5px)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f1e6]/[0.07]"
              style={{ filter: "blur(0.5px)" }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[36vmin] w-[36vmin] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{ background: "radial-gradient(closest-side, rgba(196,74,168,0.08), transparent 78%)", filter: "blur(2px)" }}
            />
          </div>

          {/* MIDDLE GROUP — chromatic edges + refraction sheen, exits second */}
          <div ref={midRef} className="pointer-events-none absolute inset-0 will-change-transform">
            <div
              className="absolute left-1/2 top-1/2 h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f1e6]/[0.08]"
              style={{ filter: "blur(0.6px)" }}
            />
            {/* chromatic aberration: magenta outside, cyan inside the edge — feathered so it reads as a soft fringe, not a drawn ring */}
            <div
              className="absolute left-1/2 top-1/2 h-[77vmin] w-[77vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(216,74,160,0.16)]"
              style={{ filter: "blur(2.5px)" }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(64,196,210,0.14)]"
              style={{ filter: "blur(2.5px)" }}
            />
            {/* curved refraction sheen — soft specular glaze across the glass */}
            <div
              className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(ellipse at 62% 30%, rgba(255,255,255,0.08), transparent 52%)",
                filter: "blur(3px)",
              }}
            />
            {/* gentle internal vignette giving the group depth */}
            <div
              className="absolute left-1/2 top-1/2 h-[74vmin] w-[74vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.22) 84%, transparent 100%)",
                filter: "blur(2px)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{ background: "radial-gradient(closest-side, rgba(64,196,160,0.08), transparent 78%)", filter: "blur(2px)" }}
            />
          </div>

          {/* FRONT — barrel hardware + front element, exits first */}
          <div ref={frontRef} className="pointer-events-none absolute inset-0 will-change-transform">
            {/* shadow seating the barrel in the dark */}
            <div
              className="absolute left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0.18) 72%, transparent 80%)",
              }}
            />
            {/* machined metal rim: brushed conic sheen masked to an annulus */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 215deg, #0a0a0a, #232323 11%, #0c0c0c 23%, #2a2a2a 36%, #0b0b0b 52%, #1f1f1f 67%, #090909 81%, #222 93%, #0a0a0a)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 65.8%, black 66.6%, black 75%, transparent 75.6%)",
                maskImage:
                  "radial-gradient(circle, transparent 65.8%, black 66.6%, black 75%, transparent 75.6%)",
              }}
            />
            {/* soft edge-light catching the top-left of the rim */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 150deg, transparent 0deg, rgba(255,255,255,0.16) 40deg, rgba(255,255,255,0.03) 80deg, transparent 120deg, transparent 360deg)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 72.8%, black 74.4%, black 75.6%, transparent 77%)",
                maskImage:
                  "radial-gradient(circle, transparent 72.8%, black 74.4%, black 75.6%, transparent 77%)",
                filter: "blur(1.2px)",
              }}
            />
            {/* machined focus-ring band */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "repeating-conic-gradient(#101010 0deg 1.1deg, #1d1d1d 1.1deg 2.2deg)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 56.5%, black 57.2%, black 62.5%, transparent 63.2%)",
                maskImage:
                  "radial-gradient(circle, transparent 56.5%, black 57.2%, black 62.5%, transparent 63.2%)",
                opacity: 0.85,
              }}
            />
            {/* stepped barrel-depth shadows */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 26%, rgba(0,0,0,0.4) 29%, transparent 33%, transparent 42%, rgba(0,0,0,0.45) 45.5%, transparent 50%, transparent 56%, rgba(0,0,0,0.5) 60%, transparent 64.5%)",
              }}
            />
            {/* soft internal vignette across the front element for glass depth */}
            <div
              className="absolute left-1/2 top-1/2 h-[126vmin] w-[126vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.16) 70%, rgba(0,0,0,0.34) 88%, transparent 100%)",
                filter: "blur(4px)",
              }}
            />
            {/* front-element specular dome highlight, top-left — feathered like a real catch-light */}
            <div
              className="absolute left-1/2 top-1/2 h-[88vmin] w-[88vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(ellipse at 36% 28%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 30%, transparent 52%)",
                filter: "blur(3px)",
              }}
            />
            {/* multicoating flares — diffuse and feathered */}
            <div
              className="absolute left-1/2 top-1/2 h-[58vmin] w-[58vmin] rounded-full mix-blend-screen"
              style={{
                transform: "translate(-88%, -86%)",
                background: "radial-gradient(closest-side, rgba(196,74,168,0.16), transparent 78%)",
                filter: "blur(4px)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[34vmin] w-[34vmin] rounded-full mix-blend-screen"
              style={{
                transform: "translate(-150%, 36%)",
                background: "radial-gradient(closest-side, rgba(120,90,220,0.11), transparent 78%)",
                filter: "blur(3px)",
              }}
            />
            <GlassArt />
          </div>
        </div>

        {/* stage depth */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 50%, transparent 32%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* legibility scrim — fades in under the motto so it sits cleanly over
            any footage. A gradient surface, not a text shadow. */}
        <div
          ref={veilRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[58%]"
          style={{ background: "linear-gradient(to top, rgba(3,3,3,0.82), rgba(3,3,3,0.25) 52%, transparent)" }}
        />

        {/* the motto — our mainstream display font, solid and bold, standing
            out over the reel. No knockout, no glass, no shadow, one clean rise. */}
        <div className="hero-motto absolute bottom-0 left-0 z-10 px-5 pb-24 will-change-transform md:px-10 md:pb-28">
          <h1 className="font-display text-[clamp(2.4rem,7.6vw,6.6rem)] leading-[0.88] text-[#f5f1e6]">
            Break the<br />
            <span className="text-[var(--gold)]">ordinary.</span>
          </h1>
          <Link
            href="/contact"
            className="label-mono mt-6 inline-flex items-center gap-2 rounded-full border border-[#f5f1e6]/45 px-5 py-2 text-[11px] tracking-[0.18em] text-[#f5f1e6] transition-colors duration-300 hover:bg-[#f5f1e6] hover:text-black"
          >
            Get in touch <span aria-hidden>⟶</span>
          </Link>
        </div>

        {/* scroll hint, fades in once the intro has played */}
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
