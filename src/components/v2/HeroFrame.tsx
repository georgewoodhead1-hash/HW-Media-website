"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import { formatTimecode, onReveal, prefersReducedMotion, ROSTER } from "./data";

// Auteur: the reel is mounted inside a cream picture frame — footage hung like
// a print. The frame DRAWS itself edge by edge when the veil lifts, the cover
// fades off the footage, then the camera chrome flickers awake and the client
// roster (Bennett&Clive) begins cycling over the reel with a masked rise.
export default function HeroFrame() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── intro choreography ──────────────────────────────────────────────────
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(".v2-edge-t, .v2-edge-b", { scaleX: 0 });
      gsap.set(".v2-edge-l, .v2-edge-r", { scaleY: 0 });
      gsap.set(".v2-hero-cover", { autoAlpha: 1 });
      gsap.set(".v2-chrome", { autoAlpha: 0 });
      gsap.set(".v2-roster", { autoAlpha: 0 });
      gsap.set(".v2-hero-line", { yPercent: 112 });
      gsap.set(".v2-hero-cue", { autoAlpha: 0 });
    }, el);

    const off = onReveal(() => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ delay: 0.1 });
      // 1 — the frame draws itself clockwise, line by line (fast, decisive)
      tl.to(q(".v2-edge-t"), { scaleX: 1, duration: 0.34, ease: "power2.inOut" })
        .to(q(".v2-edge-r"), { scaleY: 1, duration: 0.26, ease: "power2.inOut" }, "-=0.1")
        .to(q(".v2-edge-b"), { scaleX: 1, duration: 0.34, ease: "power2.inOut" }, "-=0.08")
        .to(q(".v2-edge-l"), { scaleY: 1, duration: 0.26, ease: "power2.inOut" }, "-=0.08")
        // 2 — the print develops: cover lifts off the footage
        .to(q(".v2-hero-cover"), { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.28")
        // 3 — headline rises out of its mask while the print develops
        .to(q(".v2-hero-line"), { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.09 }, "-=0.55")
        // 4 — camera chrome blinks awake, element by element (flicker, settle)
        .to(
          q(".v2-chrome"),
          {
            keyframes: [
              { autoAlpha: 1, duration: 0.07 },
              { autoAlpha: 0.25, duration: 0.07 },
              { autoAlpha: 1, duration: 0.1 },
            ],
            stagger: 0.07,
          },
          "-=0.85",
        )
        // 5 — the roster fades up over the reel
        .to(q(".v2-roster"), { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, "-=0.5")
        .to(q(".v2-hero-cue"), { autoAlpha: 1, duration: 0.5 }, "-=0.25");
    });

    return () => {
      off();
      ctx.revert();
    };
  }, []);

  // ── roster cycling with a masked rise ───────────────────────────────────
  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const reduced = prefersReducedMotion();
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % ROSTER.length;
      const next = ROSTER[i];
      if (reduced) {
        word.textContent = next;
        return;
      }
      gsap
        .timeline()
        .to(word, { yPercent: -112, duration: 0.42, ease: "power3.in" })
        .add(() => {
          word.textContent = next;
        })
        .fromTo(word, { yPercent: 112 }, { yPercent: 0, duration: 0.55, ease: "power3.out" });
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  // ── instrument realism: the hero timecode ticks at 24fps while visible ──
  useEffect(() => {
    const tc = tcRef.current;
    const video = videoRef.current;
    if (!tc || !video) return;
    let visible = false;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          visible = e.isIntersecting;
          if (visible) safePlay(video);
          else video.pause();
        }),
      { rootMargin: "15%" },
    );
    io.observe(video);
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (visible && !document.hidden) {
        frames += dt * 24;
        tc.textContent = formatTimecode(frames);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const chrome = "v2-chrome absolute z-10 text-[10px] uppercase tracking-[0.2em] text-white/80";
  const firma = { fontFamily: "var(--font-firma), sans-serif" } as const;

  return (
    <section
      ref={rootRef}
      data-chapter-v2
      className="relative flex min-h-screen flex-col items-center justify-center px-5 pb-16 pt-24 md:px-10"
      aria-label="Showreel"
    >
      {/* the mounted print — cream frame that draws itself */}
      <div className="relative w-full max-w-[880px]">
        {/* frame edges */}
        <span aria-hidden className="v2-edge-t absolute left-0 top-0 z-20 h-[10px] w-full origin-left bg-[#f5f1e6]/95 md:h-[13px]" />
        <span aria-hidden className="v2-edge-r absolute right-0 top-0 z-20 h-full w-[10px] origin-top bg-[#f5f1e6]/95 md:w-[13px]" />
        <span aria-hidden className="v2-edge-b absolute bottom-0 left-0 z-20 h-[10px] w-full origin-right bg-[#f5f1e6]/95 md:h-[13px]" />
        <span aria-hidden className="v2-edge-l absolute left-0 top-0 z-20 h-full w-[10px] origin-bottom bg-[#f5f1e6]/95 md:w-[13px]" />

        <div className="relative m-[10px] md:m-[13px]">
          <div className="relative aspect-video overflow-hidden bg-[#050504]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/videos/showreel-full.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            {/* development cover — lifts once the frame is drawn */}
            <div aria-hidden className="v2-hero-cover absolute inset-0 z-20 bg-[#050504]" />

            {/* the roster cycles OVER the footage (B&C) — masked rise */}
            <div className="v2-roster absolute inset-0 z-10 flex items-center justify-center mix-blend-difference">
              <span className="block h-[clamp(2.4rem,6vw,6rem)] overflow-hidden">
                <span ref={wordRef} className="font-display block text-[clamp(2.2rem,5.6vw,5.6rem)] leading-[1.06] text-white">
                  {ROSTER[0]}
                </span>
              </span>
            </div>

            {/* viewfinder chrome — blinks awake like camera UI */}
            <div className={`${chrome} left-4 top-4 flex items-center gap-2`} style={firma}>
              <span className="v2-recdot inline-block h-[7px] w-[7px] rounded-full bg-[var(--gold)]" /> REC
            </div>
            <span ref={tcRef} className={`${chrome} right-4 top-4`} style={firma}>
              00:00:00:00
            </span>
            <span className={`${chrome} bottom-4 left-4`} style={firma}>
              A-CAM · 24 FPS
            </span>
            <span className={`${chrome} bottom-4 right-4`} style={firma}>
              ISO 800 · 5600K
            </span>
            <span aria-hidden className="v2-chrome absolute left-4 top-10 z-10 h-5 w-5 border-l border-t border-white/60" />
            <span aria-hidden className="v2-chrome absolute right-4 top-10 z-10 h-5 w-5 border-r border-t border-white/60" />
            <span aria-hidden className="v2-chrome absolute bottom-10 left-4 z-10 h-5 w-5 border-b border-l border-white/60" />
            <span aria-hidden className="v2-chrome absolute bottom-10 right-4 z-10 h-5 w-5 border-b border-r border-white/60" />
          </div>
        </div>
      </div>

      {/* headline beneath the print — masked line rise */}
      <h1 className="font-display mt-7 overflow-hidden text-center text-[clamp(2.2rem,4.6vw,4.6rem)] leading-[0.94]">
        <span className="v2-hero-line block">
          Break the ordinary<span className="text-[var(--gold-text)]">.</span>
        </span>
      </h1>
      <p className="mt-4 overflow-hidden text-[11px] uppercase tracking-[0.26em] text-[#f5f1e6]/55" style={firma}>
        <span className="v2-hero-line block">Film &amp; photography — we go where the story is</span>
      </p>

      <span aria-hidden className="v2-hero-cue absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="v2-cueline block h-9 w-px bg-[#f5f1e6]/35" />
      </span>
    </section>
  );
}
