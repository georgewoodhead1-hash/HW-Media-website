"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import { REEL, FIRMA, filmSrc, filmPoster } from "./data";

// ─────────────────────────────────────────────────────────────────────────────
// SCREENING ROOM (Division / Iconoclast) — the home opens as a cinema.
// One clock drives everything: a rAF loop accumulates elapsed time for the
// current slide, fills the hairline progress bar, ticks a broadcast timecode
// top-right, and fires the reel change when the slide runs out. Every change
// passes through a full BLACK frame (a reel change), and the incoming title
// card rises char-by-char out of a mask AFTER the black — Division's
// title-card feel. The clock pauses while the tab is hidden and while the
// pagination is hovered.
// ─────────────────────────────────────────────────────────────────────────────

const SLIDE_MS = 6200;
const FPS = 25; // timecode frame rate — instrument chrome, not playback

function formatTimecode(ms: number): string {
  const totalS = Math.floor(ms / 1000);
  const h = Math.floor(totalS / 3600);
  const m = Math.floor((totalS % 3600) / 60);
  const s = totalS % 60;
  const f = Math.floor(((ms % 1000) / 1000) * FPS);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
}

/** Per-word masks so the rise never clips across a line break; chars rise inside. */
function TitleChars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi}>
          <span className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em] align-bottom">
            <span className="inline-block">
              {w.split("").map((c, ci) => (
                <span key={ci} className="sr-char inline-block will-change-transform">{c}</span>
              ))}
            </span>
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export default function ScreeningRoom() {
  const root = useRef<HTMLElement>(null);
  const dipRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const inViewRef = useRef(true);

  const [slide, setSlide] = useState(0);
  const slideRef = useRef(0);
  const accRef = useRef(0); // elapsed ms within the current slide
  const sessionRef = useRef(0); // running timecode across the whole visit
  const hoverPauseRef = useRef(false);
  const transitioningRef = useRef(false);
  const reducedRef = useRef(false);

  // which slides carry a real src — active + next only, so four full films
  // never download in parallel
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));

  const goTo = useCallback((target: number) => {
    if (transitioningRef.current || target === slideRef.current) return;
    transitioningRef.current = true;
    const dip = dipRef.current;
    const apply = () => {
      slideRef.current = target;
      accRef.current = 0;
      setLoaded((prev) => {
        const nxt = new Set(prev);
        nxt.add(target);
        nxt.add((target + 1) % REEL.length);
        return nxt;
      });
      setSlide(target);
    };
    if (!dip || reducedRef.current) {
      apply();
      transitioningRef.current = false;
      return;
    }
    gsap.timeline({ onComplete: () => { transitioningRef.current = false; } })
      .to(dip, { opacity: 1, duration: 0.38, ease: "power2.in", onComplete: apply })
      .to(dip, { opacity: 0, duration: 0.7, ease: "power2.out", delay: 0.12 });
  }, []);

  // ── the clock: progress bar + timecode + auto-advance ──
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 100); // clamp tab-return jumps
      last = now;
      if (document.hidden || !inViewRef.current || hoverPauseRef.current || transitioningRef.current) return;
      accRef.current += dt;
      sessionRef.current += dt;
      if (progRef.current) {
        const p = Math.min(accRef.current / SLIDE_MS, 1);
        progRef.current.style.transform = `scaleX(${p})`;
      }
      if (tcRef.current) tcRef.current.textContent = formatTimecode(sessionRef.current);
      if (accRef.current >= SLIDE_MS) goTo((slideRef.current + 1) % REEL.length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [goTo]);

  // ── keep only the active film playing; pause with the tab and off-screen ──
  useEffect(() => {
    const sync = () => {
      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        if (i === slide && !document.hidden && inViewRef.current) safePlay(v);
        else v.pause();
      });
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    let io: IntersectionObserver | null = null;
    if (root.current) {
      io = new IntersectionObserver((es) => es.forEach((e) => {
        inViewRef.current = e.isIntersecting;
        sync();
      }), { threshold: 0 });
      io.observe(root.current);
    }
    return () => { document.removeEventListener("visibilitychange", sync); io?.disconnect(); };
  }, [slide, loaded]);

  // ── title card rise — fires on every slide change (and on mount) ──
  useEffect(() => {
    const el = titleRef.current;
    if (!el || reducedRef.current) return;
    const chars = el.querySelectorAll<HTMLElement>(".sr-char");
    const credit = el.querySelector<HTMLElement>(".sr-credit");
    const tl = gsap.timeline({ delay: slide === 0 ? 0.55 : 0.18 });
    tl.fromTo(chars, { yPercent: 118 }, { yPercent: 0, duration: 0.95, ease: "power4.out", stagger: 0.038 });
    if (credit) tl.fromTo(credit, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.55");
    return () => { tl.kill(); };
  }, [slide]);

  // ── mount entrance: open on a black frame, then the room fades up ──
  useEffect(() => {
    const el = root.current;
    const dip = dipRef.current;
    if (!el || !dip) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chrome = el.querySelectorAll<HTMLElement>("[data-sr-chrome]");
    if (reduced) { gsap.set(dip, { opacity: 0 }); gsap.set(chrome, { autoAlpha: 1 }); return; }
    gsap.set(dip, { opacity: 1 });
    const ctx = gsap.context(() => {
      gsap.timeline()
        .to(dip, { opacity: 0, duration: 1.1, ease: "power2.out", delay: 0.3 })
        .fromTo(chrome, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, "-=0.7");
      // depth exit: the projected image sinks and dims at half speed while the
      // next scene rides over it — the room stays one continuous dark space
      if (stageRef.current) {
        gsap.to(stageRef.current, {
          yPercent: 26,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".sr-exit-dim", {
          opacity: 0.72,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  const film = REEL[slide];

  return (
    <section ref={root} className="relative h-screen overflow-hidden" aria-label="HW Media — showreel">
      {/* the reel — wrapped in a stage that sinks on exit */}
      <div ref={stageRef} aria-hidden className="absolute inset-0 will-change-transform">
        {REEL.map((r, i) => (
          <video
            key={r.slug}
            ref={(v) => { videoRefs.current[i] = v; }}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === slide ? 1 : 0 }}
            src={loaded.has(i) ? filmSrc(r.slug) : undefined}
            poster={filmPoster(r.slug)}
            preload={loaded.has(i) ? "auto" : "none"}
            muted loop playsInline autoPlay
          />
        ))}
        {/* projection falloff */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
        {/* exit dim — scrubbed toward black as the next scene rides over */}
        <div className="sr-exit-dim absolute inset-0 bg-[#090909] opacity-0" />
      </div>
      {/* the black frame between reels */}
      <div ref={dipRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0" />
      {/* deep tail so the room hands off to the page below */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#090909]" />

      {/* chrome — top-left slate */}
      <div data-sr-chrome className="absolute left-6 top-24 md:left-10" style={FIRMA}>
        <p className="text-[11px] uppercase tracking-[0.26em] text-white/80">Showreel</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-white/45">London — worldwide</p>
      </div>

      {/* chrome — timecode top-right (instrument, ticks at 25fps) */}
      <div data-sr-chrome className="absolute right-6 top-24 text-right md:right-10" style={FIRMA}>
        <span ref={tcRef} className="text-[11px] tracking-[0.2em] text-white/60" style={{ fontVariantNumeric: "tabular-nums" }}>
          00:00:00:00
        </span>
      </div>

      {/* title card — bottom-right, re-keyed per slide so the rise re-runs */}
      <div ref={titleRef} key={slide} className="absolute bottom-24 right-6 z-10 text-right md:bottom-9 md:right-10">
        <h1 className="font-display text-[clamp(2rem,4.6vw,4.6rem)] leading-none">
          <Link href={`/work/${film.slug}`} className="focus-visible:outline-none">
            <TitleChars text={film.title} />
          </Link>
        </h1>
        <p className="sr-credit mt-2 text-[11px] uppercase tracking-[0.22em] text-white/65" style={FIRMA}>
          Directed by Harry Wallis
        </p>
      </div>

      {/* pagination + hairline progress — hovering here holds the reel */}
      <div
        data-sr-chrome
        className="absolute bottom-9 left-6 z-10 md:left-10"
        style={FIRMA}
        onMouseEnter={() => { hoverPauseRef.current = true; }}
        onMouseLeave={() => { hoverPauseRef.current = false; }}
      >
        <div className="flex items-baseline gap-4">
          {REEL.map((r, i) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Play ${r.title}`}
              aria-current={i === slide}
              className={`cursor-pointer py-1 text-[13px] tracking-[0.2em] transition-colors duration-300 ${i === slide ? "text-white" : "text-white/35 hover:text-white/70"}`}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              0{i + 1}
            </button>
          ))}
        </div>
        <div className="mt-2 h-px w-44 bg-white/20">
          <div ref={progRef} className="h-px w-full origin-left bg-white/90" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
