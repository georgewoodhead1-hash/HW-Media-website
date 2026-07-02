"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// ─────────────────────────────────────────────────────────────────────────────
// V4 — "PRODUCTION COMPANIES": Division + Iconoclast + Somesuch + 14islands.
// PLAN
//  1 SCREENING ROOM  Division/Iconoclast: the home opens as a cinema — an
//        auto-advancing reel of the films, corner captions only (title
//        bottom-right, HW top-left), numeric pagination + hairline progress,
//        every change passing through a BLACK frame like a reel change.
//  2 STATEMENT       14islands: one giant ink-fill line.
//  3 FILMOGRAPHY     Iconoclast (the star): a centred TEXT INDEX of the films —
//        hover a title and the full-viewport still crossfades behind the list.
//  4 CREDITS         Somesuch: director-first alternation — "Directed by Harry
//        Wallis — for McLaren" beats ping-ponging left/right with stills.
//  5 PROCESS         one quiet numbered line-list (the films already made the
//        argument).
//  6 FINALE          kept.
// TASTE: zero-accent chrome — #090909 + cream; ALL colour from footage; gold
// only on full stops. BLEND: one dark room; backgrounds swap behind fixed text.
// ─────────────────────────────────────────────────────────────────────────────

const REEL = [
  { slug: "otoko", title: "Otoko" },
  { slug: "mclaren", title: "McLaren" },
  { slug: "salomon", title: "Salomon" },
  { slug: "castle-air", title: "Castle Air" },
];
const INDEX = [
  { slug: "otoko", title: "Otoko", year: "2025" },
  { slug: "mclaren", title: "McLaren", year: "2025" },
  { slug: "hera", title: "Hera", year: "2024" },
  { slug: "salomon", title: "Salomon", year: "2025" },
  { slug: "nike", title: "Nike", year: "2024" },
  { slug: "castle-air", title: "Castle Air", year: "2026" },
];
const CREDITS = [
  { line: "Directed by Harry Wallis", forr: "for McLaren", slug: "mclaren", side: "left" },
  { line: "Shot on location", forr: "for Salomon", slug: "salomon", side: "right" },
  { line: "Cut, graded and mastered in-house", forr: "for Castle Air", slug: "castle-air", side: "left" },
];
const STAGES = ["Pre-production", "Production", "Post-production", "In motion"];
const STATEMENT = "FILMS PEOPLE CHOOSE TO WATCH.";

export default function V4() {
  const root = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const dipRef = useRef<HTMLDivElement>(null);

  // screening room: auto-advance through black every 5s
  useEffect(() => {
    const t = setInterval(() => {
      const dip = dipRef.current;
      if (!dip) { setSlide((s) => (s + 1) % REEL.length); return; }
      gsap.timeline()
        .to(dip, { opacity: 1, duration: 0.35, ease: "power2.in", onComplete: () => setSlide((s) => (s + 1) % REEL.length) })
        .to(dip, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.1 });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // statement ink-fill
      const chars = gsap.utils.toArray<HTMLElement>(".v4-char");
      gsap.set(chars, { opacity: 0.14 });
      gsap.to(chars, { opacity: 1, ease: "none", stagger: 0.04, scrollTrigger: { trigger: ".v4-statement", start: "top 80%", end: "top 22%", scrub: 0.7 } });
      // credit beats rise
      gsap.utils.toArray<HTMLElement>("[data-v4rise]").forEach((n) => {
        gsap.from(n, { autoAlpha: 0, y: 40, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 86%" } });
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
    <main ref={root} className="on-media bg-[#090909] text-[#f5f1e6]">
      {/* 1 — SCREENING ROOM */}
      <section className="relative h-screen overflow-hidden" aria-label="HW Media — showreel">
        {REEL.map((r, i) => (
          <video
            key={r.slug}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === slide ? 1 : 0 }}
            src={`/videos/films/${r.slug}-w.mp4`}
            poster={`/videos/films/posters/${r.slug}-w.jpg`}
            muted loop playsInline autoPlay aria-hidden
          />
        ))}
        <div ref={dipRef} aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />
        {/* corner captions only */}
        <div className="absolute left-6 top-24 md:left-10" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          <span className="text-[11px] uppercase tracking-[0.26em] text-white/80">HW Media — London</span>
        </div>
        <div className="absolute bottom-9 right-6 text-right md:right-10">
          <h1 className="font-display text-[clamp(2rem,4.6vw,4.6rem)] leading-none">{REEL[slide].title}</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/65" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
            Directed by Harry Wallis
          </p>
        </div>
        {/* numeric pagination + hairline progress */}
        <div className="absolute bottom-9 left-6 md:left-10" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          <span className="text-[13px] tracking-[0.2em] text-white/85">{slide + 1} — {REEL.length}</span>
          <div className="mt-3 h-px w-40 bg-white/25">
            <div className="h-px bg-white/90 transition-all duration-500" style={{ width: `${((slide + 1) / REEL.length) * 100}%` }} />
          </div>
        </div>
      </section>

      {/* 2 — STATEMENT: ink-fill */}
      <section className="v4-statement px-5 py-[18vh] md:px-10" aria-label="Films people choose to watch">
        <h2 className="font-display text-[clamp(2.8rem,9vw,9rem)] leading-[0.94]" aria-label={STATEMENT}>
          {STATEMENT.split("").map((c, i) => (
            <span key={i} aria-hidden className={`v4-char inline-block whitespace-pre ${c === "." ? "text-[var(--gold-text)]" : ""}`}>{c}</span>
          ))}
        </h2>
      </section>

      {/* 3 — FILMOGRAPHY: text index, stills swap behind (Iconoclast) */}
      <section className="relative" aria-label="Filmography">
        <div className="relative min-h-screen overflow-hidden py-[12vh]">
          {/* the swapping backdrop */}
          {INDEX.map((it) => (
            <div key={it.slug} aria-hidden className="absolute inset-0 transition-opacity duration-500" style={{ opacity: hovered === it.slug ? 1 : 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/videos/films/posters/${it.slug}-w.jpg`} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/55" />
            </div>
          ))}
          <div className="relative flex min-h-[70vh] flex-col items-center justify-center">
            <p className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#f5f1e6]/50" style={{ fontFamily: "var(--font-firma), sans-serif" }}>Filmography</p>
            {INDEX.map((it) => (
              <Link
                key={it.slug}
                href={`/work/${it.slug}`}
                onMouseEnter={() => setHovered(it.slug)}
                onMouseLeave={() => setHovered(null)}
                className="group flex items-baseline gap-5 py-2"
              >
                <h3 className={`font-display text-[clamp(2.2rem,5.4vw,5.4rem)] leading-[1.02] transition-colors duration-300 ${hovered && hovered !== it.slug ? "text-[#f5f1e6]/30" : "text-[#f5f1e6]"}`}>
                  {it.title}
                </h3>
                <span className="text-[12px] tracking-[0.18em] text-[#f5f1e6]/45 transition-colors duration-300 group-hover:text-[#f5f1e6]/85" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                  ({it.year})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — CREDITS: director-first ping-pong (Somesuch) */}
      <section className="px-5 py-[10vh] md:px-10" aria-label="Credits">
        {CREDITS.map((c) => (
          <div key={c.forr} data-v4rise className={`flex flex-col gap-6 py-[9vh] md:flex-row md:items-center md:gap-14 ${c.side === "right" ? "md:flex-row-reverse" : ""}`}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg md:w-[46%]">
              <video className="h-full w-full object-cover" src={`/videos/films/${c.slug}-w.mp4`} poster={`/videos/films/posters/${c.slug}-w.jpg`} muted loop playsInline preload="none" aria-hidden />
            </div>
            <div className={c.side === "right" ? "md:text-right" : ""}>
              <h3 className="font-display text-[clamp(1.9rem,4vw,4rem)] leading-[1.0]">{c.line}</h3>
              <p className="mt-3 text-[clamp(1.1rem,1.6vw,1.5rem)] text-[#f5f1e6]/55">{c.forr}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 5 — PROCESS: one quiet numbered list */}
      <section className="px-5 py-[14vh] md:px-10" aria-label="Our process">
        <div className="mx-auto max-w-[900px] text-center">
          <p data-v4rise className="mb-10 text-[11px] uppercase tracking-[0.3em] text-[#f5f1e6]/50" style={{ fontFamily: "var(--font-firma), sans-serif" }}>Our process</p>
          {STAGES.map((s, i) => (
            <div key={s} data-v4rise className="border-t border-[#f5f1e6]/12 py-7 last:border-b">
              <h3 className="font-display text-[clamp(1.8rem,4.2vw,4.2rem)] leading-[1.0]">
                <span className="mr-5 text-[0.45em] align-middle text-[#f5f1e6]/40">0{i + 1}</span>
                {s}{i === STAGES.length - 1 && <span className="text-[var(--gold-text)]">.</span>}
              </h3>
            </div>
          ))}
        </div>
        <div className="mt-[10vh] text-center">
          <Link href="/contact" className="glass backdrop-blur-md backdrop-saturate-150 inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
            Start here <span aria-hidden>⟶</span>
          </Link>
        </div>
      </section>

      <WhirlwindGallery />
    </main>
  );
}
