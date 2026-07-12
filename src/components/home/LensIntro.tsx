"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import { onPageEntered } from "@/lib/entrance";

// CH.00 — hero. A full-bleed showreel (placeholder until Harry's cut) with the
// motto "Break the ordinary" TYPING ON in real time and sitting slightly
// see-through over the footage (you can read it, but the video shows through).
// No scroll cue. Click anywhere to play the reel with sound.
const LINES = ["Break the ordinary."];

export default function LensIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullReelRef = useRef<HTMLVideoElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  // LAYOUT effect: the hides must land BEFORE first paint or the hero
  // flashes at rest during a route transition (review defect #4)
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(".hero-bar", { autoAlpha: 0 });
      gsap.set(".hero-bg", { autoAlpha: 1 });
      gsap.set(".hero-char", { autoAlpha: 1 });
      gsap.set(".hero-sub", { autoAlpha: 1, y: 0 });
      return;
    }
    // BLACK BARS stand in front of the hero; the reveal LIFTS them to
    // unveil the reel and the headline (George: the section is built by
    // the transition, never a fade)
    gsap.set(".hero-bar", { yPercent: 0 });
    gsap.set(".hero-bg", { autoAlpha: 1, scale: 1.04 });
    gsap.set(".hero-char", { autoAlpha: 0 });
    gsap.set(".hero-sub", { autoAlpha: 0, y: 16 });

    let started = false;
    let ctx: gsap.Context | null = null;
    const start = () => {
      if (started) return;
      started = true;
      ctx = gsap.context(() => {
        gsap
          .timeline({ delay: 0.05 })
          // the bars LIFT one by one — the reel is unveiled beneath them
          .to(".hero-bar", { yPercent: -101, duration: 0.85, ease: "power4.inOut", stagger: 0.07 }, 0)
          .to(".hero-bg", { scale: 1, duration: 1.4, ease: "power3.out" }, 0.1)
          // then the motto TYPES on (the write-in George likes)
          .to(".hero-char", { autoAlpha: 1, duration: 0.01, stagger: 0.055, ease: "none" }, 0.75)
          .to(".hero-sub", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, ">0.05");
      }, wrap);
    };
    // DEPTH (George): the process speed-split, applied to the hero — as you
    // scroll away the words travel faster than the reel, so the layers
    // separate: headline fast, sub a touch slower, film nearly still
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const headline = wrap.querySelector<HTMLElement>(".hero-head-layer");
      const sub = wrap.querySelector<HTMLElement>(".hero-sub-layer");
      const bg = wrap.querySelector<HTMLElement>(".hero-bg");
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const p2 = self.progress;
          if (headline) gsap.set(headline, { yPercent: -p2 * 42, force3D: true });
          if (sub) gsap.set(sub, { yPercent: -p2 * 26, force3D: true });
          if (bg) gsap.set(bg, { yPercent: p2 * 8, scale: 1 + p2 * 0.05, force3D: true });
        },
      });
      return () => st.kill();
    });

    // first visit: the loader fires hw:reveal when it finishes. Return
    // visits (loader long gone): start once the route transition lands.
    let cancelEnter: (() => void) | null = null;
    if ((window as unknown as { __hwRevealed?: boolean }).__hwRevealed) {
      cancelEnter = onPageEntered(start);
    } else {
      window.addEventListener("hw:reveal", start, { once: true });
    }
    const fb = window.setTimeout(start, 8000);

    // iOS: the autoPlay attribute is ignored in Low Power Mode — kick the
    // reel manually on mount and again on the first touch
    safePlay(videoRef.current);
    const kick = () => safePlay(videoRef.current);
    window.addEventListener("touchstart", kick, { once: true, passive: true });

    return () => {
      cancelEnter?.();
      mm.revert();
      window.removeEventListener("hw:reveal", start);
      window.removeEventListener("touchstart", kick);
      window.clearTimeout(fb);
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
    <div ref={wrapRef} data-theme="dark" data-surface="media" data-chapter="CH.00" className="relative h-[100svh] md:h-screen">
      <div
        className="on-media isolate sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black md:h-screen"
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
        {/* full-bleed hero footage — placeholder until Harry's final cut */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          className="hero-bg pointer-events-none absolute inset-0 h-full w-full object-cover"
          src="/videos/showreel-full.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* the reveal bars — five black columns that lift away */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="hero-bar h-full flex-1 bg-[#050505] will-change-transform" style={{ marginLeft: i === 0 ? 0 : -1 }} />
          ))}
        </div>

        {/* HEADLINE — ONE line, solid WHITE (George binned the difference-blend
            interplay: the heading read brown against the footage) */}
        <div className="hero-head-layer pointer-events-none absolute left-0 top-[39%] px-5 will-change-transform md:px-10">
          <h1 className="font-display whitespace-nowrap text-[clamp(2.6rem,7.6vw,8.2rem)] leading-[0.9] text-white" aria-label="Break the ordinary.">
            {LINES.map((line, li) => (
              <span key={li} className="block">
                {line.split("").map((c, ci) => (
                  <span key={ci} aria-hidden className="hero-char inline-block whitespace-pre">{c}</span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        {/* subtitle + CTA — normal layer, left-aligned directly UNDER the headline
            (an invisible copy reserves the headline's height so they line up). */}
        <div className="hero-sub-layer absolute left-0 top-[35%] z-10 flex flex-col items-start px-5 text-left will-change-transform md:px-10">
          <div aria-hidden className="invisible font-display whitespace-nowrap text-[clamp(2.6rem,7.6vw,8.2rem)] leading-[0.9]">
            Break the ordinary.
          </div>
          <div className="hero-sub">
            {/* sub-line wears the DISPLAY face now (George) — same cut as the
                headline, a size down, tight tracking */}
            <p className="font-display mt-10 max-w-2xl pl-[0.35rem] text-[clamp(1.15rem,2vw,1.8rem)] uppercase leading-snug tracking-[-0.015em] text-white">
              we go where the story is
            </p>
            {/* bracket CTA — the house [ ] grammar, hover fills solid; glass binned */}
            <Link
              href="/contact"
              onClick={(e) => e.stopPropagation()}
              className="blink mt-9 text-[clamp(14px,1.3vw,17px)] tracking-[0.05em]"
            >
              Start here
            </Link>
          </div>
        </div>
      </div>

      {/* fullscreen reel */}
      <dialog
        ref={dialogRef}
        onClose={closeReel}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-black p-0 backdrop:bg-black/90"
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
            className="label-mono absolute right-6 top-6 rounded-full border border-[var(--hairline-dark)] bg-black/40 px-5 py-3 text-[var(--fg)] backdrop-blur-sm transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            aria-label="Close showreel"
          >
            Close ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}
