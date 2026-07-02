"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import { CREDITS, FIRMA, filmSrc, filmPoster } from "./data";

// ─────────────────────────────────────────────────────────────────────────────
// CREDIT BEATS (Somesuch) — director-first alternation. Each beat ping-pongs
// left/right with generous air: the credit line rises out of a mask, the
// sub-line follows, and the media drifts with a subtle scrub parallax inside
// an overflow-hidden frame. Videos are lazy (preload=none, play in view).
// ─────────────────────────────────────────────────────────────────────────────

export default function CreditBeats() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(".cb-kicker",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%" } },
      );
      gsap.utils.toArray<HTMLElement>("[data-beat]", el).forEach((beat) => {
        // masked text rise
        const lines = beat.querySelectorAll<HTMLElement>(".cb-line");
        gsap.fromTo(lines,
          { yPercent: 112 },
          { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.14, scrollTrigger: { trigger: beat, start: "top 74%" } },
        );
        // media: soft reveal, then a slow parallax drift while scrolling through
        const frame = beat.querySelector<HTMLElement>(".cb-frame");
        const media = beat.querySelector<HTMLElement>(".cb-media");
        if (frame) {
          gsap.fromTo(frame,
            { autoAlpha: 0, y: 44 },
            { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: beat, start: "top 78%" } },
          );
        }
        if (media) {
          gsap.fromTo(media,
            { yPercent: -9 },
            { yPercent: 9, ease: "none", scrollTrigger: { trigger: beat, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
        }
      });
    }, el);
    // lazy playback — only run the loops that are on screen
    const vids = el.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) safePlay(v); else v.pause();
    }), { rootMargin: "20%" });
    vids.forEach((v) => io.observe(v));
    return () => { ctx.revert(); io.disconnect(); };
  }, []);

  return (
    <section ref={root} className="px-5 pb-[4vh] pt-[6vh] md:px-10" aria-label="Credits">
      <p className="cb-kicker text-center text-[11px] uppercase tracking-[0.3em] text-[#f5f1e6]/50" style={FIRMA}>
        Credits
      </p>
      {CREDITS.map((c) => (
        <div
          key={c.forr}
          data-beat
          className={`flex flex-col gap-8 py-[9vh] md:flex-row md:items-center md:gap-[7vw] ${c.side === "right" ? "md:flex-row-reverse" : ""}`}
        >
          <div className="cb-frame relative aspect-video w-full overflow-hidden md:w-[52%]">
            <video
              className="cb-media absolute left-0 top-[-10%] h-[120%] w-full object-cover will-change-transform"
              src={filmSrc(c.slug)}
              poster={filmPoster(c.slug)}
              muted loop playsInline preload="none" aria-hidden
            />
          </div>
          <div className={`md:w-[41%] ${c.side === "right" ? "md:text-right" : ""}`}>
            <div className="overflow-hidden pb-[0.07em] -mb-[0.07em]">
              <h3 className="cb-line font-display text-[clamp(1.9rem,3.8vw,3.8rem)] leading-[1.0] will-change-transform">{c.line}</h3>
            </div>
            <div className="overflow-hidden">
              <p className="cb-line mt-4 text-[clamp(1.05rem,1.5vw,1.4rem)] text-[#f5f1e6]/55 will-change-transform">{c.forr}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
