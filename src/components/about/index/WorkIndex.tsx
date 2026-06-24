"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { FILMS } from "../_data";

// THE INDEX — (03) selected work. The films as a dimmed title index (lukebaffait):
// every title is grey until you land on it, then it goes cream and its widescreen
// frame bleeds in FULL behind the whole section (bennettandclive type-over-footage)
// under a dark scrim. No side-panel preview — the footage IS the background.
export default function WorkIndex() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-wk-row]", {
        yPercent: 60,
        autoAlpha: 0,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-wk-list]", start: "top 78%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-surface="media" className="relative min-h-screen overflow-hidden px-5 py-[14vh] md:px-10">
      {/* full-bleed footage behind everything */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {FILMS.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.slug}
            src={`/videos/films/posters/${f.slug}-w.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: active === i ? 1 : 0, filter: "brightness(0.5) contrast(1.05) saturate(1.05)" }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/92 via-[#050505]/55 to-[#050505]/20" />
        <div className="absolute inset-0 bg-[#050505]/35" />
      </div>

      <div className="mb-10 flex items-baseline justify-between about-label text-[var(--fg)]/55">
        <span className="scene-marker text-[var(--gold-text)]"><span>(03)</span><span className="text-[var(--fg)]/55">Selected work</span></span>
        <span>({String(FILMS.length).padStart(2, "0")})</span>
      </div>

      <ul data-wk-list className="relative">
        {FILMS.map((f, i) => {
          const on = active === i;
          return (
            <li key={f.slug} data-wk-row className="border-t border-[var(--hairline-dark)] last:border-b">
              <button
                type="button"
                data-cursor="View"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex w-full flex-wrap items-baseline gap-x-5 gap-y-1 py-4 text-left md:py-5"
              >
                <span className={`about-label transition-colors duration-300 ${on ? "text-[var(--gold-text)]" : "text-[var(--fg)]/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`about-display leading-none transition-colors duration-300 ${on ? "text-[var(--fg)]" : "text-[var(--fg)]/25"}`} style={{ fontSize: "clamp(1.7rem,5vw,3.6rem)" }}>
                  {f.title}
                </span>
                <span className={`about-body ml-auto max-w-[40ch] text-right text-[clamp(0.8rem,0.95vw,0.95rem)] transition-opacity duration-300 ${on ? "opacity-100 text-[var(--fg)]/70" : "opacity-0"}`}>
                  {f.stat}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
