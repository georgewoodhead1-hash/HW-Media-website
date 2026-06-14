"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// 01 — Mission, the Studio-Graham move. A dark panel that LAYERS UP over
// the camera (hero) as you scroll, framed by viewfinder corner brackets.
// A caption + a big heading on the left, a paragraph that types itself,
// and three stats that count up along the foot. Dark throughout so it
// blends straight into the Trusted By wall below.

const PARA =
  "HW Media is a London film agency for brands that refuse to be ordinary. We handle it all in-house — direction, cinematography, edit and grade — so the people who promise the film are the people who make it. From brand films and documentaries to social campaigns and photography, we make work people remember, not content they scroll past.";

const STATS = [
  { n: 60, suffix: "+", label: "Films delivered" },
  { n: 40, suffix: "+", label: "Brands filmed" },
  { n: 8, suffix: "", label: "Years on set" },
];

function Corner({ pos }: { pos: string }) {
  const edge: Record<string, string> = {
    tl: "left-12 top-12 border-l-2 border-t-2",
    tr: "right-12 top-12 border-r-2 border-t-2",
    bl: "left-12 bottom-12 border-b-2 border-l-2",
    br: "right-12 bottom-12 border-b-2 border-r-2",
  };
  return <span aria-hidden className={`pointer-events-none absolute h-6 w-6 border-[var(--gold)] ${edge[pos]}`} />;
}

export default function Mission() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // the panel slides up over the hero — the layering move
      gsap.fromTo(".ms-panel", { yPercent: 100 }, {
        yPercent: 0, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: 1.1 },
      });
      // heading rises in once the panel has landed
      gsap.fromTo(".ms-head-line", { yPercent: 115 }, {
        yPercent: 0, ease: "power3.out", duration: 1.1, stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 32%" },
      });
      // the paragraph writes itself, slowly, across the long pinned hold —
      // every word lights up well before the panel is allowed to leave
      gsap.fromTo(".ms-word", { opacity: 0.12 }, {
        opacity: 1, stagger: 0.02, ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "58% top", scrub: 1.1 },
      });
      // the stats count up once the paragraph has had its moment
      gsap.utils.toArray<HTMLElement>(".ms-stat-num", root).forEach((el) => {
        const target = parseInt(el.dataset.n ?? "0", 10);
        const suffix = el.dataset.suffix ?? "";
        const o = { v: 0 };
        gsap.to(o, {
          v: target, ease: "power2.out", duration: 1.6,
          scrollTrigger: { trigger: root, start: "45% top" },
          onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
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
      className="relative z-30 -mt-[100vh] motion-safe:md:h-[240vh]"
      aria-label="Our mission"
    >
      <div className="ms-panel sticky top-0 hidden h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)] will-change-transform motion-reduce:md:hidden md:block">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />

        <div
          className="flex h-full items-center px-12 py-[12vh] md:px-20"
          style={{ fontFamily: "var(--font-dm), sans-serif" }}
        >
          <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-12 md:items-start">
            {/* LEFT — heading only, nothing under it */}
            <h2 className="col-span-12 font-display text-[clamp(2.2rem,3.6vw,3.7rem)] leading-[0.92] lg:col-span-4">
              <span className="block overflow-hidden pb-[0.03em]"><span className="ms-head-line block will-change-transform">Films, not</span></span>
              <span className="block overflow-hidden pb-[0.03em]"><span className="ms-head-line block will-change-transform">content<span className="text-[var(--red)]">.</span></span></span>
            </h2>

            {/* RIGHT — the big paragraph, then the stats directly under it */}
            <div className="col-span-12 lg:col-span-8">
              <p className="text-[clamp(1.55rem,2.3vw,2.45rem)] font-medium leading-[1.13] text-[var(--fg)]">
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
