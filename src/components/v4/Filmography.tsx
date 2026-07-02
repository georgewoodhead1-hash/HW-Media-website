"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { INDEX, FIRMA, filmPoster } from "./data";

// ─────────────────────────────────────────────────────────────────────────────
// FILMOGRAPHY (Iconoclast — the star) — a centred text index of the films.
// Hover a title: the full-viewport still crossfades in behind the list (with a
// slow 6s settle out of a gentle zoom), the other titles dim, and a credit
// lockup slides into the viewport corners — title/year bottom-left, "Directed
// by Harry Wallis" bottom-right. On touch / no-hover devices the backdrop
// cycles slowly by itself instead. Titles enter with a masked line-rise.
// ─────────────────────────────────────────────────────────────────────────────

const CYCLE_MS = 3400;

export default function Filmography() {
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [autoIdx, setAutoIdx] = useState(0);
  const [canHover, setCanHover] = useState(true);
  const [inView, setInView] = useState(false);
  const metaRef = useRef<HTMLDivElement>(null);

  const activeSlug = hovered ?? (!canHover && inView ? INDEX[autoIdx].slug : null);
  const activeFilm = INDEX.find((f) => f.slug === activeSlug) ?? null;

  // hover capability + in-view tracking (drives the touch auto-cycle)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", onChange);
    const el = root.current;
    let io: IntersectionObserver | null = null;
    if (el) {
      io = new IntersectionObserver((es) => es.forEach((e) => setInView(e.isIntersecting)), { threshold: 0.35 });
      io.observe(el);
    }
    return () => { mq.removeEventListener("change", onChange); io?.disconnect(); };
  }, []);

  // touch / no-hover: cycle the backdrop slowly while the section is on screen
  useEffect(() => {
    if (canHover || !inView) return;
    const t = setInterval(() => setAutoIdx((i) => (i + 1) % INDEX.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [canHover, inView]);

  // masked line-rise entrance for the index
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".fg-kicker",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 68%" } },
      );
      gsap.fromTo(".fg-line",
        { yPercent: 112 },
        { yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.09, scrollTrigger: { trigger: el, start: "top 62%" } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  // corner credit lockup slides in whenever the active film changes
  useEffect(() => {
    const el = metaRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!activeFilm) { gsap.to(el.children, { autoAlpha: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" }); return; }
    const tl = gsap.timeline();
    tl.fromTo(el.children,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.08, overwrite: "auto" },
    );
    return () => { tl.kill(); };
  }, [activeFilm?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={root} className="relative" aria-label="Filmography">
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-[10vh]">
        {/* the swapping backdrop — a slow settle out of a gentle zoom */}
        {INDEX.map((it) => {
          const on = activeSlug === it.slug;
          return (
            <div key={it.slug} aria-hidden className="absolute inset-0" style={{ opacity: on ? 1 : 0, transition: "opacity 0.7s ease" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filmPoster(it.slug)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ transform: on ? "scale(1)" : "scale(1.07)", transition: "transform 6s linear" }}
              />
              <div className="absolute inset-0 bg-black/55" />
            </div>
          );
        })}

        {/* the index */}
        <div className="relative flex flex-col items-center">
          <p className="fg-kicker mb-9 text-[11px] uppercase tracking-[0.3em] text-[#f5f1e6]/50" style={FIRMA}>
            Filmography
          </p>
          {INDEX.map((it) => (
            <div key={it.slug} className="overflow-hidden pb-[0.07em] -mb-[0.07em]">
              <Link
                href={`/work/${it.slug}`}
                onMouseEnter={() => setHovered(it.slug)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(it.slug)}
                onBlur={() => setHovered(null)}
                className="fg-line block py-1.5 will-change-transform"
              >
                <h3
                  className="font-display text-center text-[clamp(2rem,4.8vw,4.6rem)] leading-[1.02] transition-colors duration-300"
                  style={{ color: activeSlug && activeSlug !== it.slug ? "rgba(245,241,230,0.28)" : "#f5f1e6" }}
                >
                  {it.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        {/* corner credit lockup — appears with the backdrop */}
        <div ref={metaRef} aria-hidden className="pointer-events-none absolute inset-x-6 bottom-9 z-10 flex items-end justify-between md:inset-x-10" style={FIRMA}>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/80 opacity-0">
            {activeFilm ? `${activeFilm.title} — ${activeFilm.year}` : ""}
          </p>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/55 opacity-0">
            {activeFilm ? "Directed by Harry Wallis" : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
