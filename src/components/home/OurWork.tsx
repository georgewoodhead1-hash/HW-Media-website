"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 03 — Our Work, the kookie way. "Our Work" writes itself in, alone, dead-
// centre. Then a filmstrip of small clips streams up from below — hidden
// until they rise into frame — overlapping each other as they pass over the
// title, which blurs and holds blurred behind them. The title never moves;
// it only leaves once the last clip has streamed away. Every clip links to
// its project.

const BASE = projects.slice(0, 6);
const ITEMS = Array.from({ length: 15 }, (_, i) => BASE[i % BASE.length]);

// scattered lane: left %, width (vw), vertical slot (vh down the strip).
// Slots are close together so several clips overlap on screen at once.
const LANES = [
  { x: 26, w: 32, t: 0 }, { x: 70, w: 36, t: 20 }, { x: 40, w: 30, t: 40 },
  { x: 78, w: 28, t: 60 }, { x: 24, w: 34, t: 80 }, { x: 58, w: 30, t: 100 },
  { x: 18, w: 30, t: 120 }, { x: 72, w: 33, t: 140 }, { x: 38, w: 28, t: 160 },
  { x: 62, w: 36, t: 180 }, { x: 22, w: 30, t: 200 }, { x: 80, w: 28, t: 220 },
  { x: 46, w: 33, t: 240 }, { x: 30, w: 30, t: 260 }, { x: 66, w: 30, t: 280 },
];

export default function OurWork() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const strip = stripRef.current;
    const title = titleRef.current;
    if (!root || !strip || !title) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const vh = window.innerHeight;
      const chars = gsap.utils.toArray<HTMLElement>(".ow-char", title);
      const stripH = strip.scrollHeight;

      gsap.set(strip, { y: vh * 1.05 }); // parked fully below the stage, clipped away

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });

      // 1) the title writes itself in, on its own (films still hidden below)
      tl.fromTo(chars, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, stagger: 0.32, duration: 0.5 }, 0);

      // 2) the filmstrip streams up from below and out the top
      tl.fromTo(strip, { y: vh * 1.05 }, { y: -(stripH + vh * 0.15), duration: 9 }, 2.3);

      // 3) the title blurs the moment the films begin to arrive, and holds
      tl.fromTo(title, { filter: "blur(0px)" }, { filter: "blur(8px)", duration: 1.1 }, 2.5);
    });

    // only the clips in view play
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "20% 0px" },
    );
    root.querySelectorAll("video").forEach((v) => io.observe(v));

    return () => {
      mm.revert();
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="03 — Our work"
      className="relative bg-[var(--bg)] text-[var(--fg)] motion-safe:md:h-[560vh]"
      aria-label="Our work"
    >
      <div className="sticky top-0 hidden h-screen items-center justify-center overflow-hidden md:flex">
        {/* centred title — pinned, writes itself in, then blurs behind the films */}
        <h2
          ref={titleRef}
          className="ow-title font-display pointer-events-none z-0 select-none text-center leading-[0.84] text-[clamp(5rem,16vw,15rem)]"
          style={{ fontWeight: 400 }}
          aria-label="Our Work"
        >
          <span className="block">{"Our".split("").map((c, i) => <span key={i} className="ow-char inline-block">{c}</span>)}</span>
          <span className="block text-[var(--gold)]">{"Work".split("").map((c, i) => <span key={i} className="ow-char inline-block">{c}</span>)}</span>
        </h2>

        {/* the filmstrip — clips placed down a tall strip, streamed up as one */}
        <div ref={stripRef} className="absolute inset-x-0 top-0 z-10 will-change-transform">
          {ITEMS.map((p, i) => {
            const L = LANES[i];
            return (
              <Link
                key={i}
                href={`/work/${p.slug}`}
                className="ow-clip group absolute block -translate-x-1/2 overflow-hidden rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                style={{ left: `${L.x}%`, top: `${L.t}vh`, width: `${L.w}vw` }}
                aria-label={`${p.title} — ${p.client}`}
              >
                <video
                  className="aspect-video w-full object-cover"
                  src={p.wide}
                  poster={p.posterWide}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
                <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-transparent" />
                <span className="label-mono absolute bottom-2 left-2 text-[9px] tracking-[0.2em] text-white/85">
                  {p.client.toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* mobile / reduced: a calm stack */}
      <div className="flex flex-col gap-6 px-5 py-24 md:hidden motion-reduce:md:flex">
        <h2 className="font-display text-5xl leading-[0.9]" style={{ fontWeight: 400 }}>Our <span className="text-[var(--gold)]">Work</span></h2>
        {BASE.map((p, i) => (
          <Link key={i} href={`/work/${p.slug}`} className="block overflow-hidden rounded-md">
            <video className="aspect-video w-full object-cover" src={p.wide} poster={p.posterWide} muted loop playsInline preload="none" />
            <span className="label-mono mt-2 block text-[10px] tracking-[0.22em] text-[var(--gold)]">{p.client.toUpperCase()} · {p.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
