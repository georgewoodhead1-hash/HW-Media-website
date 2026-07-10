"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";
import FooterReveal from "@/components/shell/FooterReveal";
import { WhatWeDo, BehindTheCamera } from "./shared";

// ABOUT — VARIANT C: "The ledger". The opener is a production slate — the
// company's facts typed on line by line, technical and confident. Mid-page:
// one line types itself on and its full stop POPS gold — a small signature
// move instead of a big one.
// ⚠ ALL copy is PLACEHOLDER — Harry rewords before launch.

const SLATE: [string, string][] = [
  ["COMPANY", "HW Media — film production"],
  ["BASE", "London, United Kingdom"],
  ["EST.", "2018"],
  ["DIRECTOR", "Harry Wallis"],
  ["CLIENTS", "McLaren · Nike · Aston Martin · Land Rover"],
  ["APPROACH", "A small senior crew on every job"],
];

const TYPED = "Break the ordinary.";

export default function AboutVarC() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // ── OPENER: the slate types on, row by row, once the page lands ──
      const rows = gsap.utils.toArray<HTMLElement>(".vc-row", el);
      const rules = gsap.utils.toArray<HTMLElement>(".vc-rule", el);
      const head = el.querySelector<HTMLElement>(".vc-head");
      gsap.set(rows, { autoAlpha: 0, y: 16 });
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
      if (head) gsap.set(head, { autoAlpha: 0, y: 24 });
      cancel = onPageEntered(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        if (head) tl.to(head, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0);
        tl.to(rules, { scaleX: 1, duration: 0.8, ease: "expo.out", stagger: 0.14 }, 0.3)
          .to(rows, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.14 }, 0.42);
      });

      // ── MID: the line types on scroll; the full stop pops gold ──
      const chars = gsap.utils.toArray<HTMLElement>(".vc-char", el);
      const stop = el.querySelector<HTMLElement>(".vc-stop");
      if (chars.length) {
        gsap.set(chars, { opacity: 0 });
        if (stop) gsap.set(stop, { opacity: 0, scale: 0.4 });
        const st = ScrollTrigger.create({
          trigger: ".vc-mid",
          start: "top 72%",
          end: "top 26%",
          scrub: 0.5,
          onUpdate: (self) => {
            const want = Math.floor(self.progress * 1.15 * chars.length);
            chars.forEach((c, i) => { c.style.opacity = i < want ? "1" : "0"; });
            if (stop) {
              const on = self.progress > 0.92;
              gsap.to(stop, { opacity: on ? 1 : 0, scale: on ? 1 : 0.4, duration: 0.35, ease: "back.out(2.4)", overwrite: "auto" });
            }
          },
        });
        return () => st.kill();
      }
    }, el);

    return () => { cancel?.(); ctx.revert(); };
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* 1 — THE LEDGER */}
        <section data-surface="page" className="relative flex min-h-screen flex-col justify-center px-5 py-[16vh] md:px-10">
          <h1 className="vc-head font-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.95]">
            About<span className="text-[var(--gold-accent)]">.</span>
          </h1>
          <div className="mt-[7vh] w-full max-w-4xl">
            {SLATE.map(([label, value]) => (
              <div key={label}>
                <span aria-hidden className="vc-rule block h-px w-full bg-[var(--fg)]/60" />
                <div className="vc-row flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:gap-0">
                  <span className="label-mono w-44 shrink-0 text-[11px] tracking-[0.22em] text-[var(--fg)]">
                    {label}
                  </span>
                  <span className="text-[clamp(1.05rem,1.6vw,1.5rem)] leading-snug" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
            <span aria-hidden className="vc-rule block h-px w-full bg-[var(--fg)]/60" />
          </div>
        </section>

        {/* 2 — WHAT WE DO (kept) */}
        <WhatWeDo />

        {/* 3 — THE TYPED LINE (replaces the brands band) */}
        <section data-surface="page" className="vc-mid relative z-10 bg-[var(--bg)] px-5 py-[24vh] md:px-10">
          <h2 className="font-display mx-auto max-w-6xl text-center text-[clamp(2.4rem,6vw,6rem)] leading-[1.0]" aria-label={TYPED}>
            {TYPED.replace(/\.$/, "").split("").map((c, i) => (
              <span key={i} aria-hidden className="vc-char inline-block whitespace-pre">{c}</span>
            ))}
            <span aria-hidden className="vc-stop inline-block text-[var(--gold-accent)]">.</span>
          </h2>
        </section>

        {/* 4 — BEHIND THE CAMERA (kept) */}
        <BehindTheCamera />
      </main>
      <FooterReveal />
    </>
  );
}
