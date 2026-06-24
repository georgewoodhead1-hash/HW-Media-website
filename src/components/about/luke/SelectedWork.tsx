"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// The work — Luke's gallery mechanic, adapted. A list of films, ALL dimmed except
// the one you're on (bright cream), with a live VERTICAL preview on the right that
// crossfades as the active film changes. Counters + edge labels. This replaces the
// image-grid: the work is the page, shown bright, no big horizontal video.
const FILMS = [
  { title: "Otoko", poster: "otoko-p" },
  { title: "McLaren", poster: "mclaren-p" },
  { title: "Hera", poster: "hera-p" },
  { title: "Zuma", poster: "zuma-p" },
  { title: "Nike", poster: "nike-p" },
  { title: "Salomon", poster: "salomon-p" },
  { title: "Chasing the Salt", poster: "chasing-the-salt-p" },
];

export default function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-sw-row]", { yPercent: 70, autoAlpha: 0, ease: "power3.out", stagger: 0.06, scrollTrigger: { trigger: "[data-sw-list]", start: "top 80%", once: true } });
      gsap.from("[data-sw-prev]", { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)", ease: "power3.out", duration: 1, scrollTrigger: { trigger: "[data-sw-prev]", start: "top 82%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[14vh] md:px-10">
      <div className="mb-10 flex items-baseline justify-between about-label text-[var(--fg)]/45">
        <span>Selected work</span>
        <span>({String(FILMS.length).padStart(2, "0")})</span>
      </div>

      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        {/* LEFT — the dimmed film list */}
        <ul data-sw-list className="order-2 md:order-1">
          {FILMS.map((f, i) => {
            const on = active === i;
            return (
              <li key={f.title} data-sw-row className="border-t border-[var(--hairline-dark)] last:border-b">
                <button
                  type="button"
                  data-cursor="View"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                >
                  <span className={`about-label transition-colors duration-300 ${on ? "text-[var(--gold-text)]" : "text-[var(--fg)]/30"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`about-display leading-none transition-colors duration-300 ${on ? "text-[var(--fg)]" : "text-[var(--fg)]/20"}`} style={{ fontSize: "clamp(1.7rem,4vw,3.2rem)" }}>{f.title}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* RIGHT — live vertical preview of the active film */}
        <div className="order-1 md:order-2 md:sticky md:top-[15vh] md:self-start">
          <div className="mb-3 flex items-center justify-between about-label text-[var(--fg)]/40">
            <span>2026</span>
            <span>Preview</span>
          </div>
          <div data-sw-prev className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-sm ring-1 ring-[var(--gold-text)]/20">
            {FILMS.map((f, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={f.poster}
                src={`/videos/films/posters/${f.poster}.jpg`}
                alt={f.title}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                style={{ opacity: active === i ? 1 : 0, filter: "brightness(1.08) contrast(1.04) saturate(1.06)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
