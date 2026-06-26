"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import ContactCircle from "./ContactCircle";

// About — fortemmedia.com/about layout, our dark + gold + Archivo brand, with
// real GSAP motion: hero words rise on load, a manifesto that WRITES itself as
// you scroll, headings that assemble, staggered reveals, hover, and a parallax
// portrait.
const VALUES = [
  { n: "01", name: "Story", line: "It starts with the story, never the shot list. Coverage is cheap; a film people choose to watch is not." },
  { n: "02", name: "Craft", line: "Cinema standards, whatever the budget. Shot, graded and finished to a level brands are proud to put their name on." },
  { n: "03", name: "In-house", line: "Brief, shoot, edit and grade run through one set of hands, so nothing is lost in translation." },
  { n: "04", name: "Trust", line: "The person who promises the film is the person behind the camera. No layers, no surprises." },
  { n: "05", name: "Speed", line: "Full campaigns turned around in days when it counts, without dropping the standard." },
];

const SERVICES = [
  "Brand films", "Documentary", "Commercial", "Photography",
  "Live events", "Aerial", "Edit & grade", "Social cutdowns",
];

const WORK = [
  { src: "/videos/films/mclaren-w.mp4", poster: "/videos/films/posters/mclaren-w.jpg", label: "McLaren" },
  { src: "/videos/films/nike-w.mp4", poster: "/videos/films/posters/nike-w.jpg", label: "Nike" },
  { src: "/videos/films/chasing-the-salt-w.mp4", poster: "/videos/films/posters/chasing-the-salt-w.jpg", label: "Chasing the Salt" },
  { src: "/videos/films/salomon-w.mp4", poster: "/videos/films/posters/salomon-w.jpg", label: "Salomon" },
  { src: "/videos/films/hera-w.mp4", poster: "/videos/films/posters/hera-w.jpg", label: "Heritage Flight" },
  { src: "/videos/films/defender-reel.mp4", poster: "/videos/films/posters/bts-w.jpg", label: "Defender" },
];

const MANIFESTO = "Content fills a feed. A film earns attention — and keeps it. I only make the second kind.";

export default function AboutClean() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // films play only while on screen
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "10% 0px" },
    );
    el.querySelectorAll<HTMLVideoElement>(".about-film").forEach((v) => io.observe(v));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      // 1) HERO — the heading rises word-by-word out of a mask on load
      const heroH = el.querySelector<HTMLElement>(".ab-hero-h");
      if (heroH) {
        const s = new SplitText(heroH, { type: "words", wordsClass: "ab-word" });
        splits.push(s);
        gsap.set(s.words, { yPercent: 115 });
        gsap.from(s.words, { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.05, delay: 0.15 });
      }
      gsap.from(".ab-hero-fade", { autoAlpha: 0, y: 22, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.45 });

      // 2) SECTION HEADINGS — chars assemble up as each one enters
      gsap.utils.toArray<HTMLElement>(".ab-head").forEach((h) => {
        const s = new SplitText(h, { type: "chars", charsClass: "ab-char" });
        splits.push(s);
        gsap.from(s.chars, {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: { trigger: h, start: "top 88%" },
        });
      });

      // 3) MANIFESTO — each character lights up as you scroll through it (writes
      //    itself with the scroll)
      const man = el.querySelector<HTMLElement>(".ab-manifesto");
      if (man) {
        const s = new SplitText(man, { type: "chars,words", charsClass: "ab-mchar" });
        splits.push(s);
        gsap.set(s.chars, { autoAlpha: 0.14 });
        gsap.to(s.chars, {
          autoAlpha: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: { trigger: man, start: "top 78%", end: "bottom 55%", scrub: 0.5 },
        });
      }

      // 4) staggered rise for values / services / work cards
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 40,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", end: "top 66%", scrub: 0.7 },
        });
      });

      // 5) parallax on the portrait
      const portraitImg = el.querySelector<HTMLElement>(".ab-portrait img");
      if (portraitImg) {
        gsap.to(portraitImg, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: ".ab-portrait", start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      return () => splits.forEach((s) => s.revert());
    }, el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <main ref={root} className="on-media relative overflow-x-clip bg-[#050505] text-[#f5f1e6]">
      {/* HERO */}
      <section className="mx-auto flex min-h-[82vh] max-w-5xl flex-col items-center justify-center px-5 py-[18vh] text-center md:px-10">
        <p className="ab-hero-fade text-[var(--gold-text)] text-[clamp(0.78rem,1vw,0.95rem)] uppercase tracking-[0.22em]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
          Director-led film &amp; photography · London
        </p>
        <h1 className="ab-hero-h about-display mt-7 text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5.4vw,4.6rem)", lineHeight: 1.04, textTransform: "none" }}>
          I make films brands are <span className="gold-lg">proud to put their name on</span>.
        </h1>
        <p className="ab-hero-fade about-body mx-auto mt-9 max-w-[58ch] text-[#f5f1e6]/70 text-[clamp(1.05rem,1.4vw,1.3rem)] leading-relaxed">
          HW Media is the studio of director and cinematographer Harry Wallis. A camera, a story worth telling, and the discipline to make the two meet — for the kind of brands that refuse to look like everyone else.
        </p>
        <Link
          href="/contact"
          className="ab-hero-fade mt-11 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-9 py-4 text-[clamp(14px,1.3vw,16px)] font-medium text-[#0a0a08] transition-colors duration-300 hover:bg-[#d7c476]"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Get in touch <span aria-hidden>⟶</span>
        </Link>
      </section>

      {/* MANIFESTO — writes itself on scroll */}
      <section className="border-t border-[var(--hairline-dark)] px-5 py-[20vh] md:px-10">
        <p className="ab-manifesto about-display mx-auto max-w-[24ch] text-center text-[#f5f1e6]" style={{ fontSize: "clamp(1.8rem,4.4vw,3.6rem)", lineHeight: 1.12, textTransform: "none" }}>
          {MANIFESTO}
        </p>
      </section>

      {/* VALUES */}
      <section className="border-t border-[var(--hairline-dark)] px-5 py-[14vh] md:px-10">
        <h2 className="ab-head about-display mb-12 text-[#f5f1e6]" style={{ fontSize: "clamp(1.6rem,3.4vw,2.8rem)" }}>
          What we value
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map((v) => (
            <div key={v.n} data-rise>
              <div className="about-display text-[var(--gold-text)]" style={{ fontSize: "clamp(1.1rem,1.4vw,1.3rem)" }}>{v.n}</div>
              <h3 className="about-display mt-3 text-[#f5f1e6]" style={{ fontSize: "clamp(1.4rem,2vw,1.9rem)", textTransform: "none" }}>{v.name}</h3>
              <p className="about-body mt-3 text-[#f5f1e6]/60 text-[clamp(0.92rem,1.05vw,1.05rem)] leading-relaxed">{v.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-[var(--hairline-dark)] px-5 py-[14vh] md:px-10">
        <h2 className="ab-head about-display mb-12 text-[#f5f1e6]" style={{ fontSize: "clamp(1.6rem,3.4vw,2.8rem)" }}>
          What we do
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s} data-rise className="group flex aspect-[4/3] flex-col justify-between rounded-md border border-[var(--hairline-dark)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/60">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#f5f1e6]/40" style={{ fontFamily: "var(--font-firma), sans-serif" }}>Service</span>
              <h3 className="about-display text-[#f5f1e6] transition-colors duration-300 group-hover:text-[var(--gold-text)]" style={{ fontSize: "clamp(1.4rem,2.2vw,2.1rem)", textTransform: "none" }}>{s}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* BEHIND THE CAMERA */}
      <section className="grid items-center gap-10 border-t border-[var(--hairline-dark)] px-5 py-[16vh] md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:px-10">
        <div data-rise className="ab-portrait group relative aspect-[4/5] w-full overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/harry-bw.jpg" alt="Harry Wallis" className="h-[112%] w-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/harry-color.jpg" alt="" aria-hidden className="absolute inset-0 h-[112%] w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div>
          <span className="ab-hero-fade block text-[var(--gold-text)] text-[clamp(0.78rem,1vw,0.95rem)] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
            Behind the camera
          </span>
          <h2 className="ab-head about-display mt-4 text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 0.95 }}>
            Harry Wallis
          </h2>
          <p data-rise className="about-body mt-6 max-w-[52ch] text-[#f5f1e6]/70 text-[clamp(1.05rem,1.3vw,1.25rem)] leading-relaxed">
            I direct and shoot every film myself — a CAA-authorised drone pilot, so the aerials are in-house too. When a job needs more, a trusted collective scales around it, but the camera stays with me.
          </p>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="border-t border-[var(--hairline-dark)] px-5 py-[14vh] md:px-10">
        <h2 className="ab-head about-display mb-10 text-[#f5f1e6]" style={{ fontSize: "clamp(1.6rem,3.4vw,2.8rem)" }}>
          Selected work
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORK.map((w) => (
            <figure key={w.label} data-rise className="group relative aspect-video w-full overflow-hidden rounded-md ring-1 ring-[var(--hairline-dark)]">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video className="about-film h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={w.src} poster={w.poster} muted loop playsInline preload="none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <figcaption className="absolute bottom-3 left-4 text-[12px] uppercase tracking-[0.18em] text-white/90" style={{ fontFamily: "var(--font-firma), sans-serif" }}>{w.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <ContactCircle />
    </main>
  );
}
