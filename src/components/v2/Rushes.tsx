"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import { formatTimecode, prefersReducedMotion, WORK } from "./data";

// Noxediem: the work is presented as RUSHES — sticky stacked full-bleed loops
// under camera-viewfinder chrome. Each film's title rises out of a mask as its
// card arrives, the timecode TICKS at 24fps while the rush is on screen, and
// hovering shows a PLAY affordance. Director-first credit lines under titles.
export default function Rushes() {
  const rootRef = useRef<HTMLElement>(null);

  // ── entrance + settle choreography per card ─────────────────────────────
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".v2-rush", el).forEach((card) => {
        // footage settles from a slight push-in as the card arrives
        const video = card.querySelector<HTMLElement>("video");
        if (video) {
          gsap.fromTo(
            video,
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: 0.4 },
            },
          );
        }
        // title rises out of its mask
        gsap.from(card.querySelectorAll(".v2-rush-line"), {
          yPercent: 115,
          duration: 0.95,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: card, start: "top 62%" },
        });
        // viewfinder chrome blinks awake (flicker, then settle)
        const chromeEls = card.querySelectorAll(".v2-rush-chrome");
        gsap.set(chromeEls, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          once: true,
          onEnter: () => {
            gsap.to(chromeEls, {
              keyframes: [
                { autoAlpha: 1, duration: 0.07 },
                { autoAlpha: 0.3, duration: 0.06 },
                { autoAlpha: 1, duration: 0.1 },
              ],
              stagger: 0.08,
            });
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // ── in-view playback + ticking timecodes (24fps instrument realism) ─────
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".v2-rush"));
    const visible = new Set<HTMLElement>();
    const frames = new Map<HTMLElement, number>();
    cards.forEach((c) => frames.set(c, Number(c.dataset.tcStart || 0) * 24));

    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const card = e.target as HTMLElement;
          const video = card.querySelector<HTMLVideoElement>("video");
          if (e.isIntersecting) {
            visible.add(card);
            safePlay(video);
          } else {
            visible.delete(card);
            video?.pause();
          }
        }),
      { rootMargin: "12%" },
    );
    cards.forEach((c) => io.observe(c));

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!document.hidden) {
        visible.forEach((card) => {
          const f = (frames.get(card) || 0) + dt * 24;
          frames.set(card, f);
          const tc = card.querySelector<HTMLElement>(".v2-rush-tc");
          if (tc) tc.textContent = formatTimecode(f);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const firma = { fontFamily: "var(--font-firma), sans-serif" } as const;
  const chrome = "v2-rush-chrome absolute z-10 text-[10px] uppercase tracking-[0.2em] text-white/85";

  return (
    <section ref={rootRef} data-chapter-v2 className="relative" aria-label="Selected work">
      {WORK.map((w, i) => (
        <div
          key={w.slug}
          className="v2-rush sticky top-0 h-screen overflow-hidden"
          style={{ zIndex: i + 1 }}
          data-tc-start={w.tcStart}
        >
          <Link href={`/work/${w.slug}`} className="group block h-full w-full" aria-label={`${w.title} — watch the film`}>
            <video
              className="h-full w-full object-cover"
              src={`/videos/films/${w.slug}-w.mp4`}
              poster={`/videos/films/posters/${w.slug}-w.jpg`}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
            {/* footage always blends into the canvas, never a hard cut — the
                darker top edge also stitches each incoming card to the last */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0a0a09]/65 via-transparent to-[#0a0a09]" />

            {/* title block CENTRED over the footage (Luke's stacked cases /
                B&C's roster grammar) — clear of the left rail at every scroll
                position; blend-difference keeps it legible on any frame */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-4">
              <span className="block overflow-hidden mix-blend-difference">
                <h3 className="v2-rush-line font-display block text-center text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[1.04] text-white">
                  {w.title}
                </h3>
              </span>
              <span className="mt-3 block overflow-hidden">
                <span
                  className="v2-rush-line flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/75"
                  style={firma}
                >
                  Directed by {w.director}
                  <span aria-hidden className="inline-block h-px w-8 bg-white/40" />
                  {w.category}
                </span>
              </span>
              {/* PLAY affordance — settles in on hover */}
              <span
                aria-hidden
                className="mt-7 flex h-14 w-14 scale-75 items-center justify-center rounded-full border border-white/70 opacity-0 backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
              >
                <span className="ml-[3px] block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white/90" />
              </span>
            </div>

            {/* viewfinder chrome — REC, ticking timecode + rush index, right stack */}
            <div className={`${chrome} right-6 top-6 flex flex-col items-end gap-2 md:right-12 md:top-8`} style={firma}>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="v2-recdot inline-block h-[7px] w-[7px] rounded-full bg-[var(--gold)]" /> REC
                </span>
                <span className="v2-rush-tc">{formatTimecode(w.tcStart * 24)}</span>
              </span>
              <span className="text-white/60">Rush 0{i + 1} / 0{WORK.length}</span>
            </div>
            <span aria-hidden className="v2-rush-chrome absolute left-6 top-6 z-10 h-6 w-6 border-l border-t border-white/60 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 md:left-12 md:top-8" />
            <span aria-hidden className="v2-rush-chrome absolute bottom-10 right-6 z-10 h-6 w-6 border-b border-r border-white/60 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 md:bottom-12 md:right-12" />

            <span
              className="absolute bottom-10 left-6 z-10 hidden text-[11px] uppercase tracking-[0.24em] text-white/0 transition-colors duration-400 group-hover:text-white/85 md:bottom-12 md:left-12 md:block"
              style={firma}
            >
              Watch the film ▸
            </span>
          </Link>
        </div>
      ))}
      {/* runway: the last rush holds full-screen for a beat before the
          process section pushes in over it */}
      <div aria-hidden className="h-[70vh]" />
    </section>
  );
}
