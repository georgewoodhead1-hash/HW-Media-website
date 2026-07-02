"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// ─────────────────────────────────────────────────────────────────────────────
// V3 — "MOTION STUDIOS": Exo Ape + Obys + Basement + Unseen, blended.
// PLAN
//  1 OPEN     Unseen: two beats of near-black, tiny centred line, then the reel
//             fades up with a HUGE silver headline riding over it at Exo Ape
//             speed-split (text ~3x the image's scroll speed).
//  2 CREDO    one line per viewport, centred, tiny→huge scale jumps.
//  3 WORK     Basement: card-deck — a sticky "Selected work (06)" heading while
//             project cards slide up over each other; Obys grey-wash focus
//             (only the arriving card at full contrast).
//  4 WALL     Basement: client logo wall as hairline-bordered architecture.
//  5 PROCESS  numbered stages with Exo Ape parallax: stage films near-frozen,
//             titles riding over them.
//  6 FINALE   kept.
// TASTE: silver-on-black — headings live at #c3c3c3, pure white reserved for
// moments; gold only on periods. BLEND: media never hard-edges — text crosses
// every media boundary via speed-split.
// ─────────────────────────────────────────────────────────────────────────────

const WORK = [
  { slug: "otoko", title: "Otoko", meta: "Brand film" },
  { slug: "mclaren", title: "McLaren", meta: "Commercial" },
  { slug: "hera", title: "Hera", meta: "Brand film" },
  { slug: "salomon", title: "Salomon", meta: "Sport" },
  { slug: "nike", title: "Nike", meta: "Sport" },
  { slug: "castle-air", title: "Castle Air", meta: "Aerial" },
];
const LOGOS = ["aston-martin-white", "nike-white", "red-bull-7", "spotify-white", "defender-white", "salomon-logo-white", "gj-white", "diageo-logo-black-and-white"];
const CREDO = ["We don't make content.", "We make films", "people choose to watch."];

export default function V3() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // 1 — hero speed-split: image slow, headline fast
      const heroVid = el.querySelector<HTMLElement>(".v3-herovid");
      const heroLine = el.querySelector<HTMLElement>(".v3-heroline");
      if (heroVid && heroLine) {
        gsap.fromTo(heroVid, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: heroVid.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(heroLine, { yPercent: 120 }, { yPercent: -140, ease: "none", scrollTrigger: { trigger: heroVid.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      }
      // hero intro: black beat then reel fades up
      gsap.fromTo(".v3-herovid", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6, ease: "power2.inOut", delay: 0.9 });
      gsap.fromTo(".v3-open", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0, ease: "power2.out", delay: 0.25 });

      // 2 — credo lines: fill as each crosses centre
      gsap.utils.toArray<HTMLElement>(".v3-credo").forEach((line) => {
        gsap.fromTo(line, { opacity: 0.16 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: line, start: "top 74%", end: "top 42%", scrub: 0.6 } });
      });

      // 3 — card deck: grey-wash focus — the topmost arriving card is full
      gsap.utils.toArray<HTMLElement>(".v3-card").forEach((card) => {
        gsap.fromTo(card.querySelector(".v3-cardin"), { filter: "grayscale(1) brightness(0.6)" }, {
          filter: "grayscale(0) brightness(1)", ease: "none",
          scrollTrigger: { trigger: card, start: "top 80%", end: "top 25%", scrub: 0.5 },
        });
      });

      // 5 — process parallax titles over near-frozen films
      gsap.utils.toArray<HTMLElement>(".v3-stage").forEach((stage) => {
        const vid = stage.querySelector(".v3-stagevid");
        const title = stage.querySelector(".v3-stagetitle");
        if (vid) gsap.fromTo(vid, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true } });
        if (title) gsap.fromTo(title, { yPercent: 90 }, { yPercent: -90, ease: "none", scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true } });
      });

      gsap.utils.toArray<HTMLElement>("[data-v3rise]").forEach((n) => {
        gsap.from(n, { autoAlpha: 0, y: 36, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%" } });
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
    <main ref={root} className="on-media bg-[#050505] text-[#c3c3c3]">
      {/* 1 — OPEN: dark beat → reel + silver headline riding over it */}
      <section className="relative h-[135vh]" aria-label="HW Media">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="v3-herovid absolute inset-x-0 top-[-6%] h-[112%] opacity-0">
            <video className="h-full w-full object-cover" src="/videos/showreel-full.mp4" autoPlay muted loop playsInline />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505]" />
          </div>
          <p className="v3-open absolute left-1/2 top-[12vh] -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-[#c3c3c3]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
            HW Media — London
          </p>
          <div className="absolute inset-0 flex items-center px-5 md:px-10">
            <h1 className="v3-heroline font-display text-[clamp(3rem,9.5vw,9.5rem)] leading-[0.9] text-[#c3c3c3] will-change-transform">
              Break the<br />ordinary<span className="text-[var(--gold-text)]">.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* 2 — CREDO: one line per beat, centred */}
      <section className="px-5 py-[14vh] text-center md:px-10" aria-label="Films people choose to watch">
        {CREDO.map((line, i) => (
          <p key={i} className={`v3-credo font-display leading-[1.02] ${i === 0 ? "text-[clamp(1.4rem,2.4vw,2.4rem)] text-[#c3c3c3]/80" : "text-[clamp(2.6rem,7vw,7rem)] text-[#f5f1e6]"}`}>
            {line}
          </p>
        ))}
      </section>

      {/* 3 — WORK: sticky heading + card deck */}
      <section className="relative" aria-label="Selected work">
        <div className="sticky top-0 z-0 flex h-[38vh] items-end justify-between px-5 pb-6 md:px-10">
          <h2 className="font-display text-[clamp(2rem,4.6vw,4.6rem)] leading-none text-[#f5f1e6]">Selected work</h2>
          <span className="text-[13px] tracking-[0.2em] text-[#c3c3c3]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>({WORK.length})</span>
        </div>
        <div className="relative z-10">
          {WORK.map((w, i) => (
            <div key={w.slug} className="v3-card sticky top-[30vh] px-5 md:px-10" style={{ zIndex: i + 1 }}>
              <Link href={`/work/${w.slug}`} className="group block">
                <div className="v3-cardin relative mx-auto aspect-video max-w-[1180px] overflow-hidden rounded-xl shadow-[0_-30px_80px_rgba(0,0,0,0.7)] will-change-[filter]">
                  <video className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={`/videos/films/${w.slug}-w.mp4`} poster={`/videos/films/posters/${w.slug}-w.jpg`} muted loop playsInline preload="none" aria-hidden />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-6 flex items-baseline gap-4">
                    <h3 className="font-display text-[clamp(1.8rem,3.6vw,3.6rem)] leading-none text-[#f5f1e6]">{w.title}</h3>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#c3c3c3]/70" style={{ fontFamily: "var(--font-firma), sans-serif" }}>{w.meta}</span>
                  </div>
                  <span className="absolute bottom-6 right-6 text-[12px] tracking-[0.14em] text-[#c3c3c3]/60" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                    {String(i + 1).padStart(2, "0")}/{String(WORK.length).padStart(2, "0")}
                  </span>
                </div>
              </Link>
              <div className="h-[16vh]" />
            </div>
          ))}
        </div>
        <div className="h-[8vh]" />
      </section>

      {/* 4 — WALL: hairline-bordered logo architecture */}
      <section className="px-5 py-[12vh] md:px-10" aria-label="Trusted by">
        <p data-v3rise className="mb-8 text-center text-[11px] uppercase tracking-[0.3em] text-[#c3c3c3]/55" style={{ fontFamily: "var(--font-firma), sans-serif" }}>Trusted by</p>
        <div data-v3rise className="grid grid-cols-2 border-l border-t border-[#f5f1e6]/12 md:grid-cols-4">
          {LOGOS.map((slug) => (
            <div key={slug} className="flex h-32 items-center justify-center border-b border-r border-[#f5f1e6]/12 transition-colors duration-300 hover:bg-[#f5f1e6]/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/logos/${slug}.png`} alt={slug} className="max-h-[40px] max-w-[130px] object-contain opacity-55 transition-opacity duration-300 hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* 5 — PROCESS: titles riding over near-frozen stage films */}
      <section aria-label="Our process">
        {[
          { n: "01", name: "Pre-production", clip: "/videos/micro/m02.mp4" },
          { n: "02", name: "Production", clip: "/videos/micro/m07.mp4" },
          { n: "03", name: "Post-production", clip: "/videos/micro/m10.mp4" },
          { n: "04", name: "In motion", clip: "/videos/micro/m12.mp4" },
        ].map((s, i, arr) => (
          <div key={s.n} className="v3-stage relative h-[86vh] overflow-hidden">
            <div className="v3-stagevid absolute inset-x-0 top-[-5%] h-[110%]">
              <video className="h-full w-full object-cover opacity-60" src={s.clip} poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")} muted loop playsInline preload="none" aria-hidden />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/80" />
            </div>
            <div className="relative flex h-full items-center px-5 md:px-10">
              <div className="v3-stagetitle will-change-transform">
                <span className="text-[13px] tracking-[0.24em] text-[#c3c3c3]/70" style={{ fontFamily: "var(--font-firma), sans-serif" }}>{s.n} / 04</span>
                <h3 className="font-display mt-3 text-[clamp(2.8rem,8vw,8rem)] leading-[0.9] text-[#f5f1e6]">
                  {s.name}{i === arr.length - 1 && <span className="text-[var(--gold-text)]">.</span>}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-5 py-[16vh] text-center md:px-10" aria-label="Start a project">
        <h2 data-v3rise className="font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.94] text-[#f5f1e6]">Have a project in mind<span className="text-[var(--gold-text)]">?</span></h2>
        <Link href="/contact" className="glass backdrop-blur-md backdrop-saturate-150 mt-9 inline-flex items-center gap-2 rounded-full px-9 py-4 text-[clamp(14px,1.3vw,16px)] text-white" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          Start here <span aria-hidden>⟶</span>
        </Link>
      </section>

      <WhirlwindGallery />
    </main>
  );
}
