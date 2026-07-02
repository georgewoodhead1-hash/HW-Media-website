"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, SplitText } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import { Brackets, FIRMA, PlusRule, Stop, Tiny } from "./grammar";

// ─────────────────────────────────────────────────────────────────────────────
// V1 — "1820": the whole site speaks 1820productions' language, in HW's skin.
//  1 HERO       full-bleed reel; label-on-hairline top; massive statement
//               mask-rises bottom-left; showreel meta bottom-right; scroll cue.
//  2 HYPE       witty statement, second line ghosted, manifesto meta row.
//  3 CLIENTS    "BRANDS WHO SAID YES." + [ bracketed ] text marquee, edge-faded.
//  4 WORK       edge-to-edge 2-up autoplay grid, clip-reveals, director-first
//               credit line under every tile, [ VIEW FILM ] on hover.
//  5 STATEMENT  full-bleed film band, centre axis, media fades into the canvas.
//  6 PROCESS    01–04 rows on drawn hairlines, hover language on every row.
//  7 CTA        one massive bracketed invitation + email + witty sign-off.
//  8 FINALE     WhirlwindGallery, untouched.
// GRAMMAR: every section opens with the plus-hairline; links wear [ brackets ];
// zero accent except gold periods; near-black one-surface canvas = blend.
// ─────────────────────────────────────────────────────────────────────────────

const WORK = [
  { slug: "otoko", title: "OTOKO", credit: "DIR. HARRY WALLIS — BRAND FILM, 2026" },
  { slug: "mclaren", title: "MCLAREN", credit: "DIR. HARRY WALLIS — COMMERCIAL, 2025" },
  { slug: "hera", title: "HERA", credit: "DIR. HARRY WALLIS — BRAND FILM, 2026" },
  { slug: "salomon", title: "SALOMON", credit: "DIR. HARRY WALLIS — COMMERCIAL, 2025" },
  { slug: "nike", title: "NIKE", credit: "DIR. HARRY WALLIS — COMMERCIAL, 2025" },
  { slug: "castle-air", title: "CASTLE AIR", credit: "DIR. HARRY WALLIS — BRAND FILM, 2025" },
];

const CLIENTS = [
  "MCLAREN", "NIKE", "RED BULL", "SPOTIFY", "DEFENDER",
  "SALOMON", "ASTON MARTIN", "LED ZEPPELIN", "DIAGEO", "SOHO HOUSE",
];

const STAGES = [
  { n: "01", name: "PRE-PRODUCTION", copy: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot." },
  { n: "02", name: "PRODUCTION", copy: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera." },
  { n: "03", name: "POST-PRODUCTION", copy: "Edit, grade, sound and motion under one roof. The film finds its rhythm." },
  { n: "04", name: "IN MOTION", copy: "Aerial and motion design by the same crew. Nothing outsourced, nothing lost." },
];

const EDGE_FADE = "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";

export default function V1() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;
    const splits: SplitText[] = [];

    // Split AFTER fonts load so line boxes are final.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // ── plus-hairlines: label appears, segments draw centre-out, + marks spin in
        gsap.utils.toArray<HTMLElement>(".v1-rule").forEach((rule) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: rule, start: "top 92%" } });
          tl.from(rule.querySelectorAll(".v1-seg-l, .v1-seg-r"), { scaleX: 0, duration: 1.4, ease: "expo.out" }, 0)
            .from(rule.querySelectorAll(".v1-plus"), { autoAlpha: 0, rotate: -90, duration: 0.9, ease: "expo.out" }, 0.25)
            .from(rule.querySelectorAll(".v1-lab"), { autoAlpha: 0, y: 10, duration: 0.7, ease: "power3.out" }, 0.1);
        });

        // ── every big statement mask-rises line by line
        gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((h) => {
          const split = new SplitText(h, { type: "lines", mask: "lines", linesClass: "v1-splitline" });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 112,
            duration: 1.25,
            ease: "power3.out",
            stagger: 0.09,
            delay: Number(h.dataset.delay || 0),
            scrollTrigger: { trigger: h, start: "top 88%" },
            // restore the original DOM once risen — line masks would otherwise
            // clip hover transforms (e.g. the CTA brackets spreading outward)
            onComplete: () => split.revert(),
          });
        });

        // ── small elements rise
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((n) => {
          gsap.from(n, {
            autoAlpha: 0,
            y: 28,
            duration: 1,
            ease: "power3.out",
            delay: Number(n.dataset.delay || 0),
            scrollTrigger: { trigger: n, start: "top 90%" },
          });
        });

        // ── hero: reel settles from a push-in; content parallaxes away on scroll
        const heroVid = el.querySelector<HTMLElement>(".v1-herovid");
        if (heroVid) gsap.fromTo(heroVid, { scale: 1.08 }, { scale: 1, duration: 2.6, ease: "expo.out" });
        const hero = el.querySelector<HTMLElement>(".v1-hero");
        const heroInner = el.querySelector<HTMLElement>(".v1-heroinner");
        if (hero && heroInner) {
          gsap.to(heroInner, {
            yPercent: 24,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom 25%", scrub: true },
          });
        }
        const cue = el.querySelector<HTMLElement>(".v1-cue");
        if (cue) {
          gsap.fromTo(cue, { scaleY: 0, transformOrigin: "top" }, {
            scaleY: 1, duration: 1.1, ease: "power2.inOut", repeat: -1, yoyo: true, repeatDelay: 0.35,
          });
        }

        // ── marquee: constant glide, eases to quarter speed while hovered
        const track = el.querySelector<HTMLElement>(".v1-marquee");
        if (track) {
          const drift = gsap.to(track, { xPercent: -50, ease: "none", duration: 32, repeat: -1 });
          const strip = track.parentElement;
          strip?.addEventListener("mouseenter", () => gsap.to(drift, { timeScale: 0.25, duration: 0.6 }));
          strip?.addEventListener("mouseleave", () => gsap.to(drift, { timeScale: 1, duration: 0.6 }));
        }

        // ── work tiles: clip-reveal upward while the frame inside settles
        gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile) => {
          const media = tile.querySelector(".v1-tilemedia");
          const frame = tile.querySelector("video");
          const tl = gsap.timeline({ scrollTrigger: { trigger: tile, start: "top 86%" } });
          if (media) tl.from(media, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.35, ease: "expo.out" }, 0);
          if (frame) tl.from(frame, { scale: 1.14, duration: 1.9, ease: "expo.out" }, 0);
        });

        // ── statement band: footage drifts slower than the page (parallax)
        const band = el.querySelector<HTMLElement>(".v1-band");
        const bandVid = el.querySelector<HTMLElement>(".v1-bandvid");
        if (band && bandVid) {
          gsap.fromTo(bandVid, { yPercent: -9 }, {
            yPercent: 9,
            ease: "none",
            scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
          });
        }

        // ── process rows: hairline draws, then number → name → copy
        gsap.utils.toArray<HTMLElement>(".v1-prow").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } });
          tl.from(row.querySelector(".v1-hair"), { scaleX: 0, duration: 1.3, ease: "expo.out" }, 0)
            .from(row.querySelector(".v1-pn"), { autoAlpha: 0, y: 18, duration: 0.8, ease: "power3.out" }, 0.15)
            .from(row.querySelector(".v1-pcopy"), { autoAlpha: 0, y: 22, duration: 0.9, ease: "power3.out" }, 0.3)
            .from(row.querySelector(".v1-pplus"), { autoAlpha: 0, rotate: -90, duration: 0.8, ease: "expo.out" }, 0.35);
        });
      }, el);
    });

    const vids = el.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v);
        else v.pause();
      }),
      { rootMargin: "15%" },
    );
    vids.forEach((v) => io.observe(v));
    return () => {
      cancelled = true;
      splits.forEach((s) => s.revert());
      ctx?.revert();
      io.disconnect();
    };
  }, []);

  return (
    <main ref={root} className="on-media overflow-x-clip bg-[#050505] text-[#f5f1e6]">
      {/* 1 — HERO */}
      <section className="v1-hero relative flex h-screen flex-col justify-between overflow-hidden" aria-label="HW Media — London film production">
        <video className="v1-herovid absolute inset-0 h-full w-full object-cover" src="/videos/showreel-full.mp4" autoPlay muted loop playsInline />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-[#050505]" />
        <div className="relative px-5 pt-28 md:px-10">
          <PlusRule label="HW Media — London" />
        </div>
        <div className="v1-heroinner relative flex items-end justify-between px-5 pb-[9vh] md:px-10">
          <h1 data-lines data-delay="0.35" className="font-display text-[clamp(3.4rem,11vw,11rem)] leading-[0.9]">
            BREAK THE<br />ORDINARY<Stop />
          </h1>
          <div data-rise data-delay="0.9" className="hidden flex-col items-end gap-3 pb-3 md:flex">
            <Tiny>Showreel — 2026</Tiny>
            <Link href="/work" className="group" aria-label="All work">
              <Tiny dim={false}>
                <Brackets>ALL WORK</Brackets>
              </Tiny>
            </Link>
          </div>
        </div>
        <div aria-hidden className="absolute bottom-[3.5vh] left-1/2 -translate-x-1/2">
          <span className="v1-cue block h-9 w-px bg-[#f5f1e6]/60" />
        </div>
      </section>

      {/* 2 — HYPE */}
      <section className="px-5 pb-[16vh] pt-[14vh] md:px-10" aria-label="Films, not content">
        <PlusRule />
        <div className="mt-[10vh]">
          <h2 data-lines className="font-display text-[clamp(2.8rem,8.5vw,8.5rem)] leading-[0.94]">
            FILMS, NOT CONTENT<Stop />
          </h2>
          <h2 data-lines data-delay="0.15" className="font-display mt-2 text-[clamp(2.8rem,8.5vw,8.5rem)] leading-[0.94] text-[#f5f1e6]/25">
            WE GO WHERE THE STORY IS<Stop ghost />
          </h2>
        </div>
        <div className="mt-[9vh] flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div data-rise><Tiny>01 — The short version</Tiny></div>
          <p data-rise className="max-w-[40ch] text-[15px] leading-[1.7] text-[#f5f1e6]/65 md:text-right">
            Director-led film and photography for brands with a story worth telling.
            Small crew. Heavy kit. Nothing that looks like filler.
          </p>
        </div>
      </section>

      {/* 3 — CLIENTS */}
      <section className="overflow-hidden pb-[6vh]" aria-label="Trusted by">
        <div className="px-5 md:px-10"><PlusRule label="Trusted by" /></div>
        <div className="mt-[8vh] px-5 md:px-10">
          <h2 data-lines className="font-display text-[clamp(2.4rem,6.5vw,6.5rem)] leading-[0.94]">
            BRANDS WHO SAID YES<Stop />
          </h2>
        </div>
        <div
          data-rise
          className="mt-[7vh] flex whitespace-nowrap"
          style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
        >
          <div className="v1-marquee flex shrink-0 items-baseline gap-14 pr-14">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="group font-display cursor-default text-[clamp(1.8rem,3.6vw,3.6rem)] text-[#f5f1e6]/70 transition-colors duration-500 hover:text-[#f5f1e6]">
                <Brackets>{c}</Brackets>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — WORK */}
      <section className="pt-[14vh]" aria-label="Selected work">
        <div className="px-5 md:px-10">
          <PlusRule label="Selected work" />
          <div className="mt-6 flex items-baseline justify-between">
            <div data-rise><Tiny>02 — The proof</Tiny></div>
            <div data-rise><Tiny>Six films, 2024 — 2026</Tiny></div>
          </div>
        </div>
        <div className="mt-[8vh] grid grid-cols-1 gap-x-1 gap-y-[10vh] md:grid-cols-2">
          {WORK.map((w) => (
            <Link key={w.slug} href={`/work/${w.slug}`} className="group block" aria-label={`${w.title} — view film`}>
              <div className="v1-tilemedia relative aspect-video overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
                <video
                  className="h-full w-full object-cover opacity-[0.88] transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                  src={`/videos/films/${w.slug}-w.mp4`}
                  poster={`/videos/films/posters/${w.slug}-w.jpg`}
                  muted loop playsInline preload="none" aria-hidden
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#050505]/35 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-20" />
                <span className="absolute bottom-4 right-5 translate-y-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <Tiny dim={false}>[ VIEW FILM ]</Tiny>
                </span>
              </div>
              <div className="flex flex-col gap-2 px-5 pt-5 md:flex-row md:items-baseline md:justify-between md:px-6">
                <h3 data-rise className="font-display text-[clamp(1.9rem,3vw,3rem)] leading-none transition-transform duration-500 ease-out group-hover:translate-x-2">
                  {w.title}<Stop />
                </h3>
                <span data-rise className="text-[11px] uppercase tracking-[0.26em] text-[#f5f1e6]/45 transition-colors duration-500 group-hover:text-[#f5f1e6]/75" style={FIRMA}>
                  {w.credit}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 — STATEMENT band: full-bleed footage, centre axis, blended edges */}
      <section className="v1-band relative mt-[16vh] flex min-h-[70vh] items-center justify-center overflow-hidden md:min-h-[110vh]" aria-label="About HW Media">
        <div aria-hidden className="absolute inset-x-0 -inset-y-[10%]">
          <video
            className="v1-bandvid h-full w-full object-cover"
            src="/videos/films/zuma-w.mp4"
            poster="/videos/films/posters/zuma-w.jpg"
            muted loop playsInline preload="none"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-[22vh] bg-gradient-to-b from-[#050505] to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[22vh] bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="relative px-5 py-[12vh] text-center md:px-10 md:py-[18vh]">
          <div data-rise className="mb-10 flex justify-center"><Tiny>03 — Who&apos;s behind it</Tiny></div>
          <h2 data-lines className="font-display mx-auto max-w-[16ch] text-[clamp(2.6rem,7vw,7rem)] leading-[0.94]">
            WE&apos;RE NOT A CONTENT FARM<Stop />
          </h2>
          <h2 data-lines data-delay="0.15" className="font-display mx-auto mt-2 max-w-[18ch] text-[clamp(2.6rem,7vw,7rem)] leading-[0.94]">
            WE MAKE FILMS PEOPLE FINISH<Stop />
          </h2>
          <div data-rise data-delay="0.3" className="mt-12">
            <Link href="/about" className="group inline-flex" aria-label="More about us">
              <Tiny dim={false}>
                <Brackets>MORE ABOUT US</Brackets>
              </Tiny>
            </Link>
          </div>
        </div>
      </section>

      {/* 6 — PROCESS */}
      <section className="px-5 pb-[12vh] pt-[16vh] md:px-10" aria-label="Our process">
        <PlusRule label="Our process" />
        <div className="mt-6 flex items-baseline justify-between">
          <div data-rise><Tiny>04 — How it gets made</Tiny></div>
          <div data-rise><Tiny>Everything under one roof</Tiny></div>
        </div>
        <div className="mt-[8vh]">
          {STAGES.map((s) => (
            <div key={s.n} className="v1-prow group relative grid grid-cols-1 items-baseline gap-3 py-9 md:grid-cols-[6rem_minmax(0,1.2fr)_1fr_2.5rem] md:gap-10">
              <span aria-hidden className="v1-hair absolute inset-x-0 top-0 h-px origin-left bg-[#f5f1e6]/18" />
              <span className="v1-pn text-[clamp(0.95rem,1.2vw,1.15rem)] text-[#f5f1e6]/45 transition-colors duration-500 group-hover:text-[#f5f1e6]/80" style={FIRMA}>{s.n}</span>
              <h3 data-lines className="font-display text-[clamp(2rem,4.3vw,4.3rem)] leading-[0.95] transition-transform duration-500 ease-out group-hover:translate-x-3 md:whitespace-nowrap">
                {s.name}{s.n === "04" && <Stop />}
              </h3>
              <p className="v1-pcopy max-w-[52ch] text-[15px] leading-[1.7] text-[#f5f1e6]/55 transition-colors duration-500 group-hover:text-[#f5f1e6]/85 md:text-[16px]">{s.copy}</p>
              <span aria-hidden className="v1-pplus hidden justify-self-end text-[17px] leading-none text-[#f5f1e6]/40 transition-all duration-500 ease-out group-hover:rotate-45 group-hover:text-[#f5f1e6]/85 md:block" style={FIRMA}>+</span>
            </div>
          ))}
          <div className="relative h-px">
            <span aria-hidden className="v1-prow v1-hair absolute inset-x-0 top-0 h-px origin-left bg-[#f5f1e6]/18" />
          </div>
        </div>
      </section>

      {/* 7 — CTA */}
      <section className="px-5 pb-[18vh] pt-[4vh] md:px-10" aria-label="Start a project">
        <PlusRule />
        <div className="mt-[10vh]">
          <Link href="/contact" className="group block" aria-label="Start a project">
            <h2 data-lines className="font-display text-[clamp(2.4rem,7.6vw,7.6rem)] leading-[0.94] transition-colors duration-500">
              <Brackets gapClass="mx-[0.22em]" spreadL="group-hover:-translate-x-[0.28em]" spreadR="group-hover:translate-x-[0.28em]">
                HAVE A PROJECT IN MIND<span className="text-[var(--gold-text)]">?</span>
              </Brackets>
            </h2>
            <span data-rise className="mt-10 inline-flex items-center gap-4">
              <Tiny dim={false}>Start here</Tiny>
              <span aria-hidden className="block h-px w-10 bg-[#f5f1e6]/60 transition-all duration-500 ease-out group-hover:w-20 group-hover:bg-[#f5f1e6]" />
            </span>
          </Link>
          <div className="mt-[9vh] flex flex-col justify-between gap-6 md:flex-row md:items-baseline">
            <a href="mailto:harry@hwmedia.co.uk" className="group inline-flex" aria-label="Email HW Media">
              <Tiny dim={false}>
                <Brackets>HARRY@HWMEDIA.CO.UK</Brackets>
              </Tiny>
            </a>
            <div data-rise>
              <Tiny>Tell us everything. We&apos;ve seen worse briefs.</Tiny>
            </div>
          </div>
        </div>
      </section>

      <WhirlwindGallery />
    </main>
  );
}
