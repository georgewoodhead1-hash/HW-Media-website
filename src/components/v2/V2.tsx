"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// ─────────────────────────────────────────────────────────────────────────────
// V2 — "REFERENCES": Auteur + Luke Baffait + Noxediem + Bennett&Clive, blended.
// PLAN
//  RAIL      Luke's fixed chapter rail, left edge: a vertical progress line with
//            named chapters (Reel/Roster/Work/Process) + live counter.
//  WORDMARK  Bennett&Clive: "HW" and "MEDIA" split and pinned to the viewport
//            edges, surviving the whole scroll.
//  1 HERO    Auteur: the reel mounted inside a slim cream FRAME border —
//            footage as a hung print — "Break the ordinary." beneath it.
//  2 ROSTER  B&C: client names cycle as giant type OVER the frame's footage.
//  3 WORK    Noxediem: sticky stacked full-bleed cards with camera-viewfinder
//            chrome (corner brackets, timecode, PLAY) — footage as rushes.
//  4 PROCESS Luke: ghost-grey rows that BRIGHTEN at viewport centre.
//  5 CTA     footage fades to the canvas at its bottom edge (Noxediem stitch).
//  6 FINALE  kept.
// BLEND: one #0a0a09 canvas, the rail + frame recur, media always fades into
// the canvas rather than ending at a hard edge.
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTERS = ["Reel", "Roster", "Work", "Process"];
const ROSTER = ["MCLAREN", "NIKE", "RED BULL", "DEFENDER", "SPOTIFY", "SALOMON"];
const WORK = [
  { slug: "otoko", title: "Otoko", tc: "00:01:24" },
  { slug: "mclaren", title: "McLaren", tc: "00:02:08" },
  { slug: "salomon", title: "Salomon", tc: "00:01:47" },
  { slug: "castle-air", title: "Castle Air", tc: "00:03:12" },
];
const STAGES = [
  { n: "01", name: "Pre-production", copy: "Brief, treatment, casting, locations, schedule." },
  { n: "02", name: "Production", copy: "Direction and cinematography, on location, in-camera." },
  { n: "03", name: "Post-production", copy: "Edit, grade, sound and motion, all under one roof." },
  { n: "04", name: "In motion", copy: "Aerial and motion design by the same crew." },
];

export default function V2() {
  const root = useRef<HTMLElement>(null);
  const [roster, setRoster] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoster((r) => (r + 1) % ROSTER.length), 1600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // chapter rail progress
      const fill = el.querySelector<HTMLElement>(".v2-railfill");
      const marks = gsap.utils.toArray<HTMLElement>(".v2-ch");
      const secs = gsap.utils.toArray<HTMLElement>("[data-chapter-v2]");
      if (fill) {
        ScrollTrigger.create({
          trigger: el, start: "top top", end: "bottom bottom", scrub: 0.4,
          onUpdate: (self) => {
            gsap.set(fill, { scaleY: self.progress, transformOrigin: "top center" });
            // active chapter
            let active = 0;
            secs.forEach((s, i) => { if (s.getBoundingClientRect().top < window.innerHeight * 0.5) active = i; });
            marks.forEach((m, i) => m.classList.toggle("text-[#f5f1e6]", i === active));
          },
        });
      }
      // ghost-grey process rows brighten at viewport centre (Luke)
      gsap.utils.toArray<HTMLElement>(".v2-stage").forEach((row) => {
        gsap.fromTo(row, { opacity: 0.22 }, {
          opacity: 1, ease: "none",
          scrollTrigger: { trigger: row, start: "top 78%", end: "center 45%", scrub: 0.5 },
        });
        gsap.fromTo(row, { opacity: 1 }, {
          opacity: 0.22, ease: "none", immediateRender: false,
          scrollTrigger: { trigger: row, start: "center 40%", end: "bottom 12%", scrub: 0.5 },
        });
      });
      // rises
      gsap.utils.toArray<HTMLElement>("[data-v2rise]").forEach((n) => {
        gsap.from(n, { autoAlpha: 0, y: 40, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 87%" } });
      });
    }, el);

    const vids = el.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) safePlay(v); else v.pause();
    }), { rootMargin: "15%" });
    vids.forEach((v) => io.observe(v));
    return () => { ctx.revert(); io.disconnect(); };
  }, []);

  return (
    <main ref={root} className="on-media relative bg-[#0a0a09] text-[#f5f1e6]">
      {/* B&C split wordmark, pinned to the viewport edges */}
      <div aria-hidden className="pointer-events-none fixed inset-y-0 left-3 z-40 hidden items-center md:flex">
        <span className="font-display rotate-180 text-[15px] tracking-[0.34em] text-[#f5f1e6]/40" style={{ writingMode: "vertical-rl" }}>HW</span>
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-y-0 right-3 z-40 hidden items-center md:flex">
        <span className="font-display text-[15px] tracking-[0.34em] text-[#f5f1e6]/40" style={{ writingMode: "vertical-rl" }}>MEDIA</span>
      </div>

      {/* Luke chapter rail */}
      <div className="pointer-events-none fixed left-10 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <div className="relative h-[38vh] w-px bg-[#f5f1e6]/15">
          <span className="v2-railfill absolute inset-0 origin-top bg-[var(--gold)]/80" style={{ transform: "scaleY(0)" }} />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {CHAPTERS.map((c, i) => (
            <span key={c} className="v2-ch text-[10px] uppercase tracking-[0.22em] text-[#f5f1e6]/35 transition-colors duration-300" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
              0{i + 1} {c}
            </span>
          ))}
        </div>
      </div>

      {/* 1 — HERO: the mounted reel (Auteur frame) */}
      <section data-chapter-v2 className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-24 md:px-10" aria-label="Showreel">
        <div data-v2rise className="relative w-full max-w-[1180px] border-[10px] border-[#f5f1e6]/92 md:border-[14px]">
          <div className="relative aspect-video overflow-hidden">
            <video className="h-full w-full object-cover" src="/videos/showreel-full.mp4" autoPlay muted loop playsInline />
            {/* the roster cycles OVER the footage (B&C) */}
            <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
              <span className="font-display text-[clamp(2.4rem,7vw,7rem)] leading-none text-white">{ROSTER[roster]}</span>
            </div>
            {/* viewfinder corners */}
            <span aria-hidden className="absolute left-3 top-3 h-5 w-5 border-l border-t border-white/70" />
            <span aria-hidden className="absolute right-3 top-3 h-5 w-5 border-r border-t border-white/70" />
            <span aria-hidden className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-white/70" />
            <span aria-hidden className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-white/70" />
          </div>
        </div>
        <h1 data-v2rise className="font-display mt-10 text-center text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.92]">
          Break the ordinary<span className="text-[var(--gold-text)]">.</span>
        </h1>
        <p data-v2rise className="mt-6 text-[12px] uppercase tracking-[0.24em] text-[#f5f1e6]/55" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          we go where the story is
        </p>
      </section>

      {/* 2 — spacer beat: the roster line, quiet */}
      <section data-chapter-v2 className="px-5 py-[14vh] text-center md:px-10" aria-label="Trusted by">
        <p data-v2rise className="text-[12px] uppercase tracking-[0.26em] text-[#f5f1e6]/45" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          Trusted by McLaren · Nike · Red Bull · Defender · Spotify · Salomon · Aston Martin · Diageo
        </p>
      </section>

      {/* 3 — WORK: sticky stacked rushes with viewfinder chrome (Noxediem) */}
      <section data-chapter-v2 aria-label="Selected work">
        {WORK.map((w, i) => (
          <div key={w.slug} className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: i + 1 }}>
            <Link href={`/work/${w.slug}`} className="group block h-full w-full">
              <video className="h-full w-full object-cover" src={`/videos/films/${w.slug}-w.mp4`} poster={`/videos/films/posters/${w.slug}-w.jpg`} muted loop playsInline preload="none" aria-hidden />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#0a0a09]" />
              {/* viewfinder chrome */}
              <div className="absolute left-6 top-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/85" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--gold)]" /> REC
              </div>
              <div className="absolute right-6 top-6 text-[11px] tracking-[0.2em] text-white/85" style={{ fontFamily: "var(--font-firma), sans-serif" }}>{w.tc}</div>
              <span aria-hidden className="absolute left-6 top-14 h-6 w-6 border-l border-t border-white/60" />
              <span aria-hidden className="absolute bottom-14 right-6 h-6 w-6 border-b border-r border-white/60" />
              <div className="absolute bottom-10 left-6 md:left-10">
                <h3 className="font-display text-[clamp(2.6rem,7vw,7rem)] leading-none">{w.title}</h3>
                <span className="mt-3 inline-block text-[11px] uppercase tracking-[0.22em] text-white/0 transition-colors duration-300 group-hover:text-white/85" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                  PLAY ▸
                </span>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* 4 — PROCESS: ghost rows brightening at centre (Luke) */}
      <section data-chapter-v2 className="relative z-10 bg-[#0a0a09] px-5 py-[18vh] md:px-10" aria-label="Our process">
        <div className="mx-auto max-w-[1200px]">
          {STAGES.map((s) => (
            <div key={s.n} className="v2-stage grid grid-cols-1 items-baseline gap-2 border-t border-[#f5f1e6]/12 py-10 md:grid-cols-[6rem_1fr_1fr] md:gap-10">
              <span className="text-[clamp(0.9rem,1.1vw,1.05rem)] text-[var(--gold-text)]/80" style={{ fontFamily: "var(--font-firma), sans-serif" }}>({s.n})</span>
              <h3 className="font-display text-[clamp(2.2rem,5vw,5rem)] leading-[0.95]">{s.name}{s.n === "04" && <span className="text-[var(--gold-text)]">.</span>}</h3>
              <p className="max-w-[46ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.55] text-[#f5f1e6]/70">{s.copy}</p>
            </div>
          ))}
          <div className="border-t border-[#f5f1e6]/12" />
        </div>
      </section>

      {/* 5 — CTA: Defender fading into the canvas (Noxediem stitch) */}
      <section className="relative" aria-label="Start a project">
        <div className="relative h-[70vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/harry-field.jpg" alt="HW Media on location" className="h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a09]" />
        </div>
        <div className="px-5 pb-[16vh] pt-2 text-center md:px-10">
          <h2 data-v2rise className="font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.94]">Have a project in mind<span className="text-[var(--gold-text)]">?</span></h2>
          <Link href="/contact" className="glass backdrop-blur-md backdrop-saturate-150 mt-9 inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
            Start here <span aria-hidden>⟶</span>
          </Link>
        </div>
      </section>

      <WhirlwindGallery />
    </main>
  );
}
