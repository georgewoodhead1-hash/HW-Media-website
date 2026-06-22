"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/shell/Footer";

// About — rebuilt simple + clean (auteur-style): who founded it, the story,
// the founding year, then the way we work as five stages that swap an image on
// hover, and a "Let's create" tombola CTA. One display face for headings, BR
// Firma for everything else. Follows the global light/dark mode.

const STAGES = [
  { key: "Vision", body: "Every project starts with the story you already have. We find the idea worth filming before anything else.", img: "/videos/films/posters/otoko-w.jpg" },
  { key: "Strategy", body: "Treatment, arcs, shot design. The film is authored on paper before a camera ever comes out.", img: "/videos/films/posters/mclaren-w.jpg" },
  { key: "Creation", body: "One crew, every department, on location wherever the story lives. No corners cut on the day.", img: "/videos/films/posters/salomon-w.jpg" },
  { key: "Refinement", body: "The edit and the grade, obsessed over until every frame earns its place in the cut.", img: "/videos/films/posters/zuma-w.jpg" },
  { key: "Impact", body: "Masters and the cutdowns your channels actually need — work people remember, not content they scroll past.", img: "/videos/films/posters/chasing-the-salt-w.jpg" },
];

const FOUNDERS: [string, string][] = [
  ["Harry Wallis", "Founder · Director & DP"],
  ["Glen", "Producer & Cam Op"],
  ["Will", "Photographer & Cam Op"],
];

export default function About() {
  const [active, setActive] = useState(0);

  return (
    <>
      <main
        data-theme="dark"
        data-surface="page"
        className="min-h-screen bg-[var(--bg)] text-[var(--fg)]"
        style={{ fontFamily: "var(--font-firma), sans-serif" }}
      >
        {/* hero */}
        <section className="px-5 pb-[10vh] pt-[24vh] md:px-10">
          <div className="grid items-center gap-12 md:grid-cols-[1.4fr_0.6fr] md:gap-16">
            {/* text — left */}
            <div>
              <span className="text-[12px] uppercase tracking-[0.28em] text-[var(--gold-text)]">About</span>
              <h1
                className="font-display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.95]"
                style={{ fontWeight: 400 }}
              >
                A London production company, <span className="text-[var(--gold-text)]">founded 2018.</span>
              </h1>
              <p className="mt-8 max-w-xl text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-[var(--fg)]/70">
                We go where the story is and film it. A small crew on purpose — direction, cinematography,
                edit and grade, all in-house — making films brands remember.
              </p>
            </div>
            {/* vertical film — right */}
            <div className="w-full max-w-[280px] md:justify-self-end">
              <video
                src="/videos/films/otoko-p.mp4"
                poster="/videos/films/posters/otoko-p.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="HW Media showreel — vertical film"
                className="aspect-[3/4] w-full rounded-lg object-cover ring-1 ring-[var(--hairline-dark)]"
              />
            </div>
          </div>
        </section>

        {/* our story */}
        <section className="border-t border-[var(--hairline-dark)] px-5 py-[10vh] md:px-10">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <div>
              <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight" style={{ fontWeight: 400 }}>
                Our story
              </h2>
              {/* Harry — greyscale by default, colour on hover (group reveals colour layer) */}
              <div
                className="group relative mt-8 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-lg ring-1 ring-[var(--hairline-dark)]"
                aria-label="Harry Wallis, founder of HW Media"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/harry-bw.jpg"
                  alt="Harry Wallis, founder of HW Media"
                  className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:opacity-0"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/harry-color.jpg"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                />
              </div>
            </div>
            <div className="max-w-2xl space-y-5 text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[var(--fg)]/75">
              <p>
                HW Media started with one director who refused to hand the camera to anyone else. Harry
                Wallis founded the company in London in 2018, around a simple idea: the people who promise
                the film should be the people who shoot it.
              </p>
              <p>
                Since then we&apos;ve made films for performance and legacy brands — McLaren, Aston Martin,
                Norton, Defender, Nike, Salomon — on salt flats, grass strips, mountainsides and factory
                floors. A small core crew, a collective of trusted creatives, and a standard that
                doesn&apos;t move.
              </p>
            </div>
          </div>
        </section>

        {/* founders */}
        <section className="border-t border-[var(--hairline-dark)] px-5 py-[10vh] md:px-10">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight" style={{ fontWeight: 400 }}>
              Who&apos;s behind it
            </h2>
            <div className="grid gap-10 sm:grid-cols-3">
              {FOUNDERS.map(([n, r]) => (
                <div key={n}>
                  <h3 className="font-display text-xl" style={{ fontWeight: 400 }}>{n}</h3>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-[var(--gold-text)]">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* how we work — hover a stage, the image swaps */}
        <section className="border-t border-[var(--hairline-dark)] px-5 py-[12vh] md:px-10">
          <span className="text-[12px] uppercase tracking-[0.28em] text-[var(--gold-text)]">How we work</span>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-20">
            {/* left — the five stages */}
            <ul className="flex flex-col">
              {STAGES.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="block w-full border-b border-[var(--hairline-dark)] py-6 text-left"
                  >
                    <span
                      className="font-display block text-[clamp(2rem,4.5vw,3.6rem)] leading-none transition-opacity duration-300"
                      style={{ fontWeight: 400, opacity: active === i ? 1 : 0.3 }}
                    >
                      {s.key}
                    </span>
                    <span
                      className="mt-3 block max-w-md overflow-hidden text-sm leading-relaxed text-[var(--fg)]/70 transition-all duration-500"
                      style={{ opacity: active === i ? 1 : 0, maxHeight: active === i ? 120 : 0 }}
                    >
                      {s.body}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {/* right — the image that changes on hover (sticky as you read) */}
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-[var(--hairline-dark)] md:block md:self-start md:sticky md:top-28">
              {STAGES.map((s, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s.key}
                  src={s.img}
                  alt={s.key}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  style={{ opacity: active === i ? 1 : 0 }}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* let's create — the tombola CTA (loops over itself on hover) */}
        <section className="border-t border-[var(--hairline-dark)] px-5 py-[16vh] text-center md:px-10">
          <Link
            href="/contact"
            aria-label="Let's create — get in touch"
            className="font-display inline-block text-[clamp(2.6rem,9vw,8rem)] leading-none text-[var(--fg)] transition-colors duration-300 hover:text-[var(--gold-text)]"
            style={{ fontWeight: 400 }}
          >
            <span className="tombola">
              <span className="tombola-track" aria-hidden>
                <span className="tombola-line">Let&apos;s create</span>
                <span className="tombola-line">Let&apos;s create</span>
              </span>
            </span>
          </Link>
          <p className="mt-8 text-[12px] uppercase tracking-[0.22em] text-[var(--gold-text)]">Get in touch ⟶</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
