"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// CH.00 — hero. A full-bleed showreel (placeholder until Harry's cut) with the
// motto "Break the ordinary" TYPING ON in real time and sitting slightly
// see-through over the footage (you can read it, but the video shows through).
// No scroll cue. Click anywhere to play the reel with sound.
const LINES = ["Break the", "ordinary."];

export default function LensIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullReelRef = useRef<HTMLVideoElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(".hero-bg", { autoAlpha: 1 });
      gsap.set(".hero-char", { autoAlpha: 1 });
      gsap.set(".hero-sub", { autoAlpha: 1, y: 0 });
      gsap.set(".hero-caret", { autoAlpha: 0 });
      return;
    }
    gsap.set(".hero-bg", { autoAlpha: 0 });
    gsap.set(".hero-char", { autoAlpha: 0 });
    gsap.set(".hero-sub", { autoAlpha: 0, y: 16 });
    gsap.set(".hero-caret", { autoAlpha: 1 });

    let started = false;
    let ctx: gsap.Context | null = null;
    const start = () => {
      if (started) return;
      started = true;
      ctx = gsap.context(() => {
        const blink = gsap.to(".hero-caret", { autoAlpha: 0.15, duration: 0.45, repeat: -1, yoyo: true, ease: "power1.inOut" });
        gsap
          .timeline({ delay: 0.15 })
          .to(".hero-bg", { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0)
          // TYPE the motto on, character by character (real-time writing)
          .to(".hero-char", { autoAlpha: 1, duration: 0.01, stagger: 0.055, ease: "none" }, 0.4)
          .add(() => blink.kill(), ">")
          .to(".hero-caret", { autoAlpha: 0, duration: 0.3 }, ">")
          .to(".hero-sub", { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "<0.1");
      }, wrap);
    };
    window.addEventListener("hw:reveal", start, { once: true });
    const fb = window.setTimeout(start, 500);

    return () => {
      window.removeEventListener("hw:reveal", start);
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
    <div ref={wrapRef} data-theme="dark" data-surface="media" data-chapter="CH.00" className="relative h-screen">
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
        {/* HEADLINE — its own blend layer (NO z-index, so it blends with the video
            behind it). mix-blend-difference INVERTS the showreel inside the letters:
            the type interacts with the footage, no wash dimming the video. */}
        <div className="pointer-events-none absolute left-0 top-[30%] px-5 mix-blend-difference md:px-10">
          <h1 className="font-display text-[clamp(2.8rem,9vw,8.2rem)] leading-[0.82] text-white" aria-label="Break the ordinary.">
            {LINES.map((line, li) => (
              <span key={li} className="block">
                {line.split("").map((c, ci) => (
                  <span key={ci} aria-hidden className="hero-char inline-block whitespace-pre">{c}</span>
                ))}
                {li === LINES.length - 1 && (
                  <span aria-hidden className="hero-caret ml-1 inline-block h-[0.78em] w-[5px] translate-y-[0.06em] bg-[var(--gold)] align-baseline" />
                )}
              </span>
            ))}
          </h1>
        </div>

        {/* subtitle + CTA — normal layer, left-aligned directly UNDER the headline
            (an invisible copy reserves the headline's height so they line up). */}
        <div className="absolute left-0 top-[30%] z-10 flex flex-col items-start px-5 md:px-10">
          <div aria-hidden className="invisible font-display text-[clamp(2.8rem,9vw,8.2rem)] leading-[0.82]">
            Break the<br />ordinary.
          </div>
          <div className="hero-sub">
            <p
              className="mt-5 max-w-md text-[clamp(1rem,1.5vw,1.35rem)] uppercase leading-snug tracking-[0.16em] text-white/90"
              style={{ fontFamily: "var(--font-archivo), sans-serif", textShadow: "0 2px 14px rgba(0,0,0,0.65)" }}
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
