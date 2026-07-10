"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Pre-entry loading screen, v5 (client final round): the 0–100 bar/counter is
// gone. The load is now a CIRCLE that traces around the HW mark — starting at
// the bottom and drawing up BOTH sides at once. When the ring closes at the
// top, the camera animation rolls (public/videos/intro.mp4): the frame drives
// INTO the lens barrel, through the iris, and blows out to white — the site
// fades in under the bloom. GSAP runs the handoffs.
// Fallbacks: reduced-motion and repeat visits skip the film; if the video
// can't start (decode/autoplay failure) we dissolve straight to the hero.
const LENS_REVEAL_AT = 2.7; // seconds into the film when the white bloom peaks

export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const arcLeftRef = useRef<SVGPathElement>(null);
  const arcRightRef = useRef<SVGPathElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [done, setDone] = useState(false);
  const [withFilm, setWithFilm] = useState(false);

  useEffect(() => {
    const reveal = () => window.dispatchEvent(new Event("hw:reveal"));
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
    setWithFilm(true);

    const logo = logoRef.current;
    let cleanupFilm: (() => void) | null = null;

    const ctx = gsap.context(() => {
      gsap.set(logo, { autoAlpha: 0, scale: 1.06, filter: "blur(16px)" });
      // both arcs hidden — each is a half-circle from the bottom point to the
      // top point, so together they close the ring from the bottom up
      gsap.set([arcLeftRef.current, arcRightRef.current], {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(".ls-meta", { autoAlpha: 0, y: 8 });
      // NOTE: the film's first frame (the lens, parked) is deliberately
      // visible BEHIND the card during the trace — the HW mark resolves
      // inside the lens glass. The push only rolls once the ring closes.

      // straight to the hero — used if the film can't run
      const bail = () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0, duration: 0.65, ease: "power2.inOut",
          onStart: reveal, onComplete: () => setDone(true),
        });
      };

      // THE CAMERA ANIMATION — plays once the ring closes
      const rollFilm = () => {
        const video = videoRef.current;
        if (!video) return bail();
        let revealed = false;
        const finish = () => {
          if (revealed) return;
          revealed = true;
          // the bloom peaks — site fades in underneath the white
          gsap.to(rootRef.current, {
            autoAlpha: 0, duration: 0.8, ease: "power2.inOut",
            onStart: reveal, onComplete: () => setDone(true),
          });
        };
        const onTime = () => { if (video.currentTime >= LENS_REVEAL_AT) finish(); };
        const onEnded = () => finish();
        video.addEventListener("timeupdate", onTime);
        video.addEventListener("ended", onEnded);
        // stall guard: if the film hasn't actually advanced shortly after
        // play(), skip it rather than trap the visitor on a frozen frame
        const stall = window.setTimeout(() => { if (video.currentTime < 0.2) { revealed = true; bail(); } }, 1600);
        cleanupFilm = () => {
          window.clearTimeout(stall);
          video.removeEventListener("timeupdate", onTime);
          video.removeEventListener("ended", onEnded);
        };
        gsap.timeline()
          .to(".ls-card", { autoAlpha: 0, scale: 1.02, filter: "blur(6px)", duration: 0.4, ease: "power2.in" }, 0)
          .to(".ls-meta", { autoAlpha: 0, duration: 0.3 }, 0)
          .to(".ls-film", { autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 0.2);
        video.play().catch(() => { revealed = true; bail(); });
      };

      gsap
        .timeline({ onComplete: rollFilm })
        // the meta corners fade up first — the room lights coming on
        .to(".ls-meta", { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0)
        // the mark pulls into focus while the ring traces the load
        .to(logo, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.inOut" }, 0.15)
        // both halves draw at once — bottom, up the sides, closing at the top
        .to([arcLeftRef.current, arcRightRef.current], {
          strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut",
        }, 0.15)
        // a held beat with the ring closed, then the film rolls
        .to({}, { duration: 0.35 });
    }, rootRef);

    return () => { cleanupFilm?.(); ctx.revert(); };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} aria-hidden className="fixed inset-0 z-[300] bg-black text-[#f5f1e6]">
      {/* THE LENS FILM — mounted (and preloading) behind the card so it can
          roll the instant the ring closes */}
      {withFilm && (
        <video
          ref={videoRef}
          className="ls-film absolute inset-0 h-full w-full object-cover"
          src="/videos/intro.mp4"
          poster="/images/intro-poster.jpg"
          muted
          playsInline
          preload="auto"
        />
      )}

      {/* corner meta — quiet, technical */}
      <span className="ls-meta label-mono absolute left-6 top-6 text-[10px] tracking-[0.24em] text-white/60 md:left-10 md:top-8">
        HW MEDIA
      </span>
      <span className="ls-meta label-mono absolute right-6 top-6 text-[10px] tracking-[0.24em] text-white/60 md:right-10 md:top-8">
        LONDON
      </span>

      {/* the card — mark resolving out of blur inside the tracing ring */}
      <div className="ls-card relative flex h-full w-full items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* the ring — two half-circles, each pathLength-normalised, both
              starting at the bottom point (100,196) and meeting at the top */}
          <svg
            className="absolute h-[19rem] w-[19rem] md:h-[25rem] md:w-[25rem]"
            viewBox="0 0 200 200"
            fill="none"
          >
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
    </div>
  );
}
