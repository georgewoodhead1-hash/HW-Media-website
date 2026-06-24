"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Harry first — the founder, told editorially (Bar). A clean colour portrait that
// wipes open, his name set big, and a short narrative whose lines rise as you
// reach them. Light surface, Archivo. He is the company; the work is his.
export default function Founder() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-founder-media]",
        { clipPath: "inset(0% 0% 100% 0%)", scale: 1.06 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 40%", scrub: 0.6 },
        },
      );
      gsap.from("[data-founder-line]", {
        yPercent: 110,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 78%", end: "top 38%", scrub: 0.5 },
      });
      gsap.fromTo(
        "[data-founder-copy] > *",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-founder-copy]", start: "top 82%", end: "top 50%", scrub: 0.5 },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="ch-founder"
      data-surface="page"
      className="about-body border-t border-[var(--hairline-dark)] px-5 py-[14vh] md:px-10"
    >
      <span className="about-label text-[var(--gold-text)]">The person behind it</span>

      <div className="mt-10 grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        {/* portrait */}
        <div className="overflow-hidden rounded-sm">
          <div data-founder-media style={{ willChange: "clip-path, transform" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/harry-color.jpg"
              alt="Harry Wallis, founder of HW Media"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>

        {/* name + narrative */}
        <div className="self-center">
          <h2 className="about-display text-[var(--fg)]" style={{ fontSize: "clamp(2.6rem,7vw,5.6rem)" }}>
            <span className="split-rise">
              <span data-founder-line className="block">Harry</span>
            </span>{" "}
            <span className="split-rise">
              <span data-founder-line className="block text-[var(--gold-text)]">Wallis.</span>
            </span>
          </h2>
          <p className="about-label mt-4 text-[var(--fg)]/55">Founder · Director</p>

          <div data-founder-copy className="mt-9 max-w-2xl space-y-5 text-[clamp(1.05rem,1.45vw,1.3rem)] leading-relaxed text-[var(--fg)]/80">
            <p>
              Harry started HW Media to make brand films that feel authored, not assembled. He directs
              and shoots the work himself, so the person who promises the film is the person behind the
              lens.
            </p>
            <p>
              The work runs for performance and legacy brands, on salt flats, grass strips, mountainsides
              and factory floors. We come to the brand and film where the story actually happens, with the
              people who make it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
