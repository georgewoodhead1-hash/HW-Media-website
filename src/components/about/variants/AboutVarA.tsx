"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";
import FooterReveal from "@/components/shell/FooterReveal";
import { WhatWeDo, BehindTheCamera } from "./shared";

// ABOUT — VARIANT A: "The statement stack" (the most 1820). No image opener:
// you land on black and a stack of short lines takes the stage one at a
// time — each mask-rises, holds the frame, then gives way to the next as
// you scroll. Motion IS the page; the only photography is Behind the Camera.
// Mid-page: one huge line ink-fills word by word.
// ⚠ ALL statement copy is PLACEHOLDER — Harry rewords before launch.

const STACK = [
  "Director-led.",
  "Shot in-house.",
  "Wherever the story is.",
];

const SIGNOFF = "HW Media is a London production company led by director Harry Wallis — a small senior crew, and no layers between you and the people making the work.";

export default function AboutVarA() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // ── OPENER: sticky stage, lines trade the frame on scroll ──
      const lines = gsap.utils.toArray<HTMLElement>(".va-line", el);
      gsap.set(lines, { autoAlpha: 0, yPercent: 60 });
      gsap.set(".va-signoff", { autoAlpha: 0 });

      // the first line rises on page-enter (the second loading animation)
      cancel = onPageEntered(() => {
        gsap.to(lines[0], { autoAlpha: 1, yPercent: 0, duration: 1.0, ease: "expo.out", delay: 0.1 });
      });

      const sm = (a: number, b: number, t: number) => {
        const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
        return x * x * (3 - 2 * x);
      };
      const N = lines.length;
      const st = ScrollTrigger.create({
        trigger: ".va-opener",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          lines.forEach((line, i) => {
            const a = i / N;          // my window opens
            const b = (i + 1) / N;    // the next takes over
            const rise = i === 0 ? 1 : sm(a - 0.06, a + 0.08, p);
            const leave = i === N - 1 ? 0 : sm(b - 0.08, b + 0.05, p);
            gsap.set(line, {
              autoAlpha: rise * (1 - leave),
              yPercent: (1 - rise) * 60 - leave * 46,
            });
          });
          // the quiet sign-off arrives with the last line
          const s = sm(0.86, 0.98, p);
          gsap.set(".va-signoff", { autoAlpha: s, y: (1 - s) * 18 });
        },
      });

      // ── MID: the huge line ink-fills word by word ──
      const words = gsap.utils.toArray<HTMLElement>(".va-word", el);
      if (words.length) {
        gsap.set(words, { opacity: 0.16 });
        gsap.to(words, {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: ".va-mid", start: "top 74%", end: "top 22%", scrub: 0.7 },
        });
      }

      return () => st.kill();
    }, el);

    return () => { cancel?.(); ctx.revert(); };
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* 1 — THE STATEMENT STACK (sticky, 320vh runway) */}
        <section data-surface="page" className="va-opener relative md:h-[320vh]">
          <div className="flex flex-col items-center justify-center gap-10 px-5 py-[16vh] md:sticky md:top-0 md:h-screen md:gap-0 md:py-0">
            <div className="relative flex h-auto w-full items-center justify-center md:h-[40vh]">
              {STACK.map((line, i) => (
                <h1
                  key={line}
                  className={`va-line font-display text-center text-[clamp(2.6rem,7.5vw,7.5rem)] leading-[0.95] ${i === 0 ? "relative" : "absolute inset-x-0"}`}
                >
                  {line}
                </h1>
              ))}
            </div>
            <p
              className="va-signoff mx-auto max-w-[52ch] text-center text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.55] text-[var(--fg)] md:absolute md:bottom-[12vh] md:left-1/2 md:-translate-x-1/2"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              {SIGNOFF}
            </p>
          </div>
        </section>

        {/* 2 — WHAT WE DO (kept) */}
        <WhatWeDo />

        {/* 3 — THE INK-FILL LINE (replaces the brands band) */}
        <section data-surface="page" className="va-mid relative z-10 bg-[var(--bg)] px-5 py-[24vh] md:px-10">
          <h2 className="font-display mx-auto max-w-6xl text-center text-[clamp(2.4rem,6vw,6rem)] leading-[1.0]">
            {"Films, not content.".split(" ").map((w, i) => (
              <span key={i} className="va-word inline-block whitespace-pre">{w}{" "}</span>
            ))}
          </h2>
        </section>

        {/* 4 — BEHIND THE CAMERA (kept) */}
        <BehindTheCamera />
      </main>
      <FooterReveal />
    </>
  );
}
