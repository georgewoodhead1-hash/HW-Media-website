"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Task 5 — the work. A kinetic brand cascade (monumental names sliding on scroll
// velocity), film STILLS that parallax, and exactly ONE vertical 9:16 reel (the
// only film allowed). No big horizontal video. Media gets a mild brightness/
// contrast lift so the near-black stills don't read murky on the black surface.
const BRANDS_A = ["McLaren", "Aston Martin", "Nike", "Salomon"];
const BRANDS_B = ["Defender", "Norton", "Red Bull", "Soho House"];
const STILLS = ["/videos/films/posters/zuma-w.jpg", "/videos/films/posters/nike-w.jpg"];
const LIFT = "brightness(1.08) contrast(1.05) saturate(1.06)";

function Cascade({ words, dir, ghost }: { words: string[]; dir: 1 | -1; ghost?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tw = gsap.fromTo(el, { xPercent: dir === 1 ? -34 : 2 }, { xPercent: dir === 1 ? 2 : -34, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [dir]);
  return (
    <div ref={ref} className="flex w-max gap-12 md:gap-20" style={{ willChange: "transform" }}>
      {[...words, ...words].map((w, i) => (
        <span key={`${w}-${i}`} className={`about-display leading-none ${ghost ? "ghost-outline" : "text-[#f5f1e6]"}`} style={{ fontSize: "clamp(2.2rem,6vw,5rem)" }}>{w}</span>
      ))}
    </div>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-w-head]", { yPercent: 55, autoAlpha: 0, ease: "power3.out", duration: 1, scrollTrigger: { trigger: "[data-w-head]", start: "top 85%", once: true } });
      gsap.fromTo("[data-w-reel]", { clipPath: "inset(0% 0% 100% 0%)", scale: 1.06 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none", scrollTrigger: { trigger: "[data-w-reel]", start: "top 88%", end: "top 42%", scrub: 0.7 } });
      gsap.utils.toArray<HTMLElement>("[data-w-still]").forEach((s) => {
        gsap.fromTo(s, { yPercent: 16 }, { yPercent: -16, ease: "none", scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: 0.8 } });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden px-5 py-[16vh] md:px-10">
      <h2 data-w-head className="about-display mb-14 max-w-2xl text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5.5vw,4.4rem)" }}>
        The <span className="gold-lg">work.</span>
      </h2>

      <div className="flex flex-col gap-3 md:gap-5">
        <Cascade words={BRANDS_A} dir={1} />
        <Cascade words={BRANDS_B} dir={-1} ghost />
      </div>

      <div className="mt-16 grid items-center gap-8 md:mt-24 md:grid-cols-[1fr_auto_1fr]">
        <div className="hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-w-still src={STILLS[0]} alt="" aria-hidden className="aspect-[4/5] w-[82%] rounded-sm object-cover ring-1 ring-[var(--gold-text)]/25" style={{ willChange: "transform", filter: LIFT }} />
        </div>
        <div data-w-reel data-cursor="Reel" className="relative mx-auto aspect-[9/16] w-[64vw] max-w-[380px] overflow-hidden rounded-md ring-1 ring-[var(--gold-text)]/35" style={{ willChange: "clip-path, transform" }}>
          <video src="/videos/films/salomon-p.mp4" poster="/videos/films/posters/salomon-p.jpg" autoPlay muted loop playsInline aria-label="HW Media reel" className="h-full w-full object-cover" style={{ filter: LIFT }} />
        </div>
        <div className="hidden md:flex md:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-w-still src={STILLS[1]} alt="" aria-hidden className="aspect-[4/5] w-[82%] rounded-sm object-cover ring-1 ring-[var(--gold-text)]/25" style={{ willChange: "transform", filter: LIFT }} />
        </div>
      </div>
    </section>
  );
}
