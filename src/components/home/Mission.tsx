"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ScrollType from "@/components/shell/ScrollType";

// 01 — Mission, the Studio-Graham move. A dark panel that LAYERS UP over
// the camera (hero) as you scroll, framed by viewfinder corner brackets.
// A caption + a big heading on the left, a paragraph that types itself,
// and three stats that count up along the foot. Dark throughout so it
// blends straight into the Trusted By wall below.

const PARA =
  "HW Media is a London film production company for brands that refuse to be ordinary. We go where the story is and film it — direction, cinematography, edit and grade, all in-house — so the people who promise the film are the people who shoot it. From brand films and documentaries to social campaigns and photography, we make work people remember, not content they scroll past.";

const STATS = [
  { n: 60, suffix: "+", label: "Films delivered" },
  { n: 40, suffix: "+", label: "Brands filmed" },
  { n: 8, suffix: "", label: "Years on set" },
];

export default function Mission() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // the panel slides up over the hero — the layering move, slow + smooth
      gsap.fromTo(".ms-panel", { yPercent: 100 }, {
        yPercent: 0, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "28% top", scrub: 1.5 },
      });
      // (the heading reveal is now handled by the ScrollType typewriter)
      // the paragraph writes itself, slowly, across the long pinned hold —
      // every word lights up well before the panel is allowed to leave
      gsap.fromTo(".ms-word", { opacity: 0.12 }, {
        opacity: 1, stagger: 0.02, ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "75% top", scrub: 1.4 },
      });
      // the stats count up AS the user scrolls — the numbers visibly climb,
      // scrubbed to scroll progress rather than firing once
      gsap.utils.toArray<HTMLElement>(".ms-stat-num", root).forEach((el) => {
        const target = parseInt(el.dataset.n ?? "0", 10);
        const suffix = el.dataset.suffix ?? "";
        ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          end: "center center",
          scrub: true,
          onUpdate: (self) => {
            el.textContent = `${Math.round(self.progress * target)}${suffix}`;
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="01 — Mission"
      className="relative z-30 motion-safe:md:-mt-[100vh] motion-safe:md:h-[200vh]"
      aria-label="Our mission"
    >
      <div className="ms-panel sticky top-0 hidden h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)] will-change-transform motion-reduce:md:hidden md:block">
        <div
          className="flex h-full items-center px-12 py-[1.5vh] md:px-20"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-12 md:items-start">
            {/* LEFT — heading only, nothing under it */}
            <ScrollType
              as="h2"
              className="col-span-12 font-display text-[clamp(2.5rem,4.1vw,4.1rem)] leading-[0.94] lg:col-span-4"
              gold={["not"]}
              start="top 95%"
              end="top 58%"
              style={{ fontWeight: 400 }}
            >
              Films, not content.
            </ScrollType>

            {/* RIGHT — the paragraph, then the stats directly under it */}
            <div className="col-span-12 lg:col-span-8">
              <p className="text-[clamp(1.6rem,2.6vw,2.65rem)] font-medium leading-[1.2] text-[var(--fg)]">
                {PARA.split(" ").map((w, i) => (
                  <span key={i} className="ms-word">{w} </span>
                ))}
              </p>
              <a href="/about" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--fg)] transition-opacity hover:opacity-70">
                More about us <span className="text-[var(--red)]">↗</span>
              </a>

              <div className="mt-12 grid grid-cols-3 gap-8">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <span
                      className="ms-stat-num block text-[clamp(2.3rem,3.2vw,3.4rem)] font-bold leading-none text-[var(--gold)]"
                      data-n={s.n}
                      data-suffix={s.suffix}
                    >
                      0{s.suffix}
                    </span>
                    <p className="mt-2 text-[13px] text-[var(--fg)]/55">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile / reduced */}
      <div className="bg-[var(--bg)] px-5 py-24 text-[var(--fg)] md:hidden motion-reduce:md:block">
        <span className="font-hand text-xl text-[var(--red)]">break the ordinary —</span>
        <h2 className="font-display mt-4 text-4xl leading-[0.95]">Films, <span className="text-[var(--gold)]">not content.</span></h2>
        <p className="mt-5 text-lg leading-relaxed text-[var(--fg)]/80">{PARA}</p>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <span className="font-display block text-3xl text-[var(--gold)]">{s.n}{s.suffix}</span>
              <p className="label-mono mt-1 text-[9px] opacity-55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
