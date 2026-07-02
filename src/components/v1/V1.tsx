"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// ─────────────────────────────────────────────────────────────────────────────
// V1 — "1820": the whole site speaks 1820productions' language, in HW's skin.
// PLAN
//  1 HERO      full-bleed reel; label-on-hairline (+ ends) top; massive condensed
//              statement pinned bottom-left with gold period.
//  2 HYPE      witty confident statement block, left, wall-to-wall; second line
//              ghosted. ("THE HYPE IS REEL." energy, HW words.)
//  3 CLIENTS   marquee of [ bracketed ] client names — text, not logo soup.
//  4 WORK      edge-to-edge 2-up autoplay grid, giant titles on hover-brighten,
//              label-on-hairline "SELECTED WORK".
//  5 PROCESS   the 1820 services stack: 01-04 numbered rows on hairlines,
//              copy right, no imagery.
//  6 CTA       one massive bracketed invitation.
//  7 FINALE    kept.
// GRAMMAR: every section opens with the plus-hairline; links wear [ brackets ];
// zero accent except gold periods; near-black one-surface canvas = blend.
// ─────────────────────────────────────────────────────────────────────────────

const WORK = [
  { slug: "otoko", title: "OTOKO" },
  { slug: "mclaren", title: "MCLAREN" },
  { slug: "hera", title: "HERA" },
  { slug: "salomon", title: "SALOMON" },
  { slug: "nike", title: "NIKE" },
  { slug: "castle-air", title: "CASTLE AIR" },
];

const CLIENTS = ["MCLAREN", "NIKE", "RED BULL", "SPOTIFY", "DEFENDER", "SALOMON", "ASTON MARTIN", "LED ZEPPELIN", "DIAGEO", "SOHO HOUSE"];

const STAGES = [
  { n: "01", name: "PRE-PRODUCTION", copy: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot." },
  { n: "02", name: "PRODUCTION", copy: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera." },
  { n: "03", name: "POST-PRODUCTION", copy: "Edit, grade, sound and motion under one roof. The film finds its rhythm." },
  { n: "04", name: "IN MOTION", copy: "Aerial and motion design by the same crew. Nothing outsourced, nothing lost." },
];

function PlusRule({ label }: { label?: string }) {
  return (
    <div className="v1-rule relative flex items-center gap-3" aria-hidden>
      <span className="text-[15px] leading-none text-[#f5f1e6]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
      <span className="v1-line block h-px flex-1 origin-center bg-[#f5f1e6]/35" />
      {label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0e0e0d] px-4 text-[11px] uppercase tracking-[0.24em] text-[#f5f1e6]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          {label}
        </span>
      )}
      <span className="text-[15px] leading-none text-[#f5f1e6]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
    </div>
  );
}

function Bracket({ children }: { children: React.ReactNode }) {
  return (
    <span className="group inline-flex items-baseline gap-2" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
      <span className="text-[#f5f1e6]/45 transition-transform duration-300 group-hover:-translate-x-1">[</span>
      <span>{children}</span>
      <span className="text-[#f5f1e6]/45 transition-transform duration-300 group-hover:translate-x-1">]</span>
    </span>
  );
}

export default function V1() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // plus-rules draw centre-out on arrival
      gsap.utils.toArray<HTMLElement>(".v1-line").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: line, start: "top 94%", end: "top 40%", scrub: 1.2 } });
      });
      // statements rise
      gsap.utils.toArray<HTMLElement>("[data-v1rise]").forEach((n) => {
        gsap.from(n, { autoAlpha: 0, y: 44, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 86%" } });
      });
      // marquee
      const track = el.querySelector<HTMLElement>(".v1-marquee");
      if (track) gsap.to(track, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
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
    <main ref={root} className="on-media bg-[#0e0e0d] text-[#f5f1e6]">
      {/* 1 — HERO */}
      <section className="relative flex h-screen flex-col justify-between overflow-hidden" aria-label="HW Media — London film production">
        <video className="absolute inset-0 h-full w-full object-cover" src="/videos/showreel-full.mp4" autoPlay muted loop playsInline />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-[#0e0e0d]" />
        <div className="relative px-5 pt-28 md:px-10"><PlusRule label="HW Media — London" /></div>
        <div className="relative px-5 pb-[9vh] md:px-10">
          <h1 className="font-display text-[clamp(3.4rem,11vw,11rem)] leading-[0.9]">
            BREAK THE<br />ORDINARY<span className="text-[var(--gold-text)]">.</span>
          </h1>
        </div>
      </section>

      {/* 2 — HYPE */}
      <section className="px-5 py-[16vh] md:px-10" aria-label="Films, not content">
        <PlusRule />
        <div className="mt-[9vh]">
          <h2 data-v1rise className="font-display text-[clamp(2.8rem,8.5vw,8.5rem)] leading-[0.94]">
            FILMS, NOT CONTENT<span className="text-[var(--gold-text)]">.</span>
          </h2>
          <h2 data-v1rise className="font-display mt-2 text-[clamp(2.8rem,8.5vw,8.5rem)] leading-[0.94] text-[#f5f1e6]/25">
            WE GO WHERE THE STORY IS<span className="text-[var(--gold-text)]/40">.</span>
          </h2>
        </div>
      </section>

      {/* 3 — CLIENTS marquee, bracketed text */}
      <section className="overflow-hidden py-[6vh]" aria-label="Trusted by">
        <div className="px-5 md:px-10"><PlusRule label="Trusted by" /></div>
        <div className="mt-[7vh] flex whitespace-nowrap">
          <div className="v1-marquee flex shrink-0 items-baseline gap-14 pr-14">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="font-display text-[clamp(1.8rem,3.6vw,3.6rem)] text-[#f5f1e6]/85">
                <span className="text-[#f5f1e6]/35">[</span>&thinsp;{c}&thinsp;<span className="text-[#f5f1e6]/35">]</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — WORK: edge-to-edge 2-up */}
      <section className="pt-[12vh]" aria-label="Selected work">
        <div className="px-5 md:px-10"><PlusRule label="Selected work" /></div>
        <div className="mt-[8vh] grid grid-cols-1 gap-1 md:grid-cols-2">
          {WORK.map((w) => (
            <Link key={w.slug} href={`/work/${w.slug}`} className="group relative aspect-video overflow-hidden">
              <video
                className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
                src={`/videos/films/${w.slug}-w.mp4`}
                poster={`/videos/films/posters/${w.slug}-w.jpg`}
                muted loop playsInline preload="none" aria-hidden
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <h3 className="font-display absolute bottom-5 left-6 text-[clamp(1.8rem,3.4vw,3.4rem)] leading-none">{w.title}</h3>
              <span className="absolute bottom-6 right-6 text-[12px] uppercase tracking-[0.18em] text-[#f5f1e6]/0 transition-colors duration-300 group-hover:text-[#f5f1e6]/85" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                [ VIEW ]
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 — PROCESS: numbered stack on hairlines */}
      <section className="px-5 py-[16vh] md:px-10" aria-label="Our process">
        <PlusRule label="Our process" />
        <div className="mt-[8vh]">
          {STAGES.map((s) => (
            <div key={s.n} data-v1rise className="grid grid-cols-1 items-baseline gap-3 border-t border-[#f5f1e6]/14 py-9 md:grid-cols-[7rem_1fr_1.2fr] md:gap-10">
              <span className="text-[clamp(0.95rem,1.2vw,1.15rem)] text-[#f5f1e6]/45" style={{ fontFamily: "var(--font-firma), sans-serif" }}>{s.n}</span>
              <h3 className="font-display text-[clamp(2rem,4.6vw,4.6rem)] leading-[0.95]">{s.name}{s.n === "04" && <span className="text-[var(--gold-text)]">.</span>}</h3>
              <p className="max-w-[52ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.55] text-[#f5f1e6]/70">{s.copy}</p>
            </div>
          ))}
          <div className="border-t border-[#f5f1e6]/14" />
        </div>
      </section>

      {/* 6 — CTA */}
      <section className="px-5 pb-[18vh] pt-[6vh] md:px-10" aria-label="Start a project">
        <PlusRule />
        <div data-v1rise className="mt-[9vh]">
          <Link href="/contact" className="group block">
            <h2 className="font-display text-[clamp(2.6rem,8vw,8rem)] leading-[0.94] transition-colors duration-300 group-hover:text-[#f5f1e6]/70">
              <span className="text-[#f5f1e6]/40 transition-transform duration-300">[</span> HAVE A PROJECT IN MIND<span className="text-[var(--gold-text)]">?</span> <span className="text-[#f5f1e6]/40">]</span>
            </h2>
            <p className="mt-6 text-[13px] uppercase tracking-[0.22em] text-[#f5f1e6]/55" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
              Start here ⟶
            </p>
          </Link>
        </div>
      </section>

      <WhirlwindGallery />
    </main>
  );
}
