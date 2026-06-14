"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 02 — the films, the oceanfilms way. Full-bleed film fills the screen;
// a single thin gold ring follows the cursor with a smooth lag (the only
// graphic). Films cross-dissolve one into the next as you scroll — no
// aperture, no wipe. A fixed vertical wordmark, a tiny credit, a small
// counter. The trusted-by logos arrive as one quiet panel at the end.

const FILMS = projects.slice(0, 6);
const PANELS = FILMS.length + 1; // films + the quiet logos panel
const SEG = 1 / PANELS;

const LOGOS = [
  "mclaren-logo", "aston-martin-white", "nike-white", "spotify-white",
  "red-bull-7", "natwest-white", "defender-white", "soho-house-white",
  "zuma-white", "salomon-logo-white", "led-zeppelin-logo-1", "meta-logo-white",
];

export default function Films() {
  const rootRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const vidRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const creditRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".fm-panel", root);
      const credits = creditRefs.current.filter(Boolean) as HTMLDivElement[];

      panels.forEach((p, i) => gsap.set(p, { opacity: i === 0 ? 1 : 0 }));
      credits.forEach((c, i) => gsap.set(c, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 18 }));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const idx = Math.min(PANELS - 1, Math.floor(self.progress / SEG + 0.5));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              if (countRef.current) {
                countRef.current.textContent = idx < FILMS.length ? String(idx + 1).padStart(2, "0") : "—";
              }
              vidRefs.current.forEach((v, i) => {
                if (!v) return;
                if (Math.abs(i - idx) <= 1) safePlay(v); else v.pause();
              });
            }
          },
        },
      });

      // every film slowly zooms across the whole pin — the frame is never
      // static, so the eye always has motion even between cross-dissolves
      panels.forEach((p) => {
        const v = p.querySelector("video");
        if (v) tl.fromTo(v, { scale: 1.16 }, { scale: 1.0, duration: 1 }, 0);
      });

      // cross-dissolves: previous fades out exactly as the next fades in
      for (let i = 1; i < PANELS; i++) {
        const t = i * SEG;
        tl.to(panels[i - 1], { opacity: 0, duration: 0.07 }, t - 0.035)
          .to(panels[i], { opacity: 1, duration: 0.07 }, t - 0.035)
          .to(credits[i - 1], { opacity: 0, y: -18, duration: 0.04 }, t - 0.04)
          .to(credits[i], { opacity: 1, y: 0, duration: 0.05 }, t + 0.005);
      }

      // the ring follows the cursor with a smooth, weighted lag
      const ring = ringRef.current;
      let xTo: ((v: number) => void) | null = null;
      let yTo: ((v: number) => void) | null = null;
      if (ring) {
        gsap.set(ring, { xPercent: -50, yPercent: -50, x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 });
        xTo = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3" });
        yTo = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3" });
      }
      const onMove = (e: PointerEvent) => { xTo?.(e.clientX); yTo?.(e.clientY); };
      window.addEventListener("pointermove", onMove, { passive: true });

      return () => window.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="films"
      data-theme="dark"
      data-chapter="02 — The films"
      className="relative motion-safe:md:-mt-[18vh] motion-safe:md:h-[480vh]"
      aria-label="Selected films"
    >
      <div className="sticky top-0 hidden h-screen overflow-hidden bg-[#040404] motion-reduce:md:hidden md:block">
        {/* the films, full-bleed, cross-dissolving */}
        {FILMS.map((p, i) => (
          <div key={p.slug} className="fm-panel absolute inset-0">
            <video
              ref={(el) => { vidRefs.current[i] = el; }}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              src={p.wide}
              poster={p.posterWide}
              muted
              loop
              playsInline
              preload={i < 2 ? "metadata" : "none"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
          </div>
        ))}
        {/* the quiet logos panel — trusted by, folded in at the edge */}
        <div className="fm-panel absolute inset-0 flex items-center justify-center bg-[#040404]">
          <div className="w-[60vw] max-w-3xl">
            <span className="label-mono block text-center text-[10px] tracking-[0.3em] text-[var(--gold)]/80">
              TRUSTED BY
            </span>
            <div className="mt-10 grid grid-cols-4 gap-x-12 gap-y-9">
              {LOGOS.map((slug) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={slug} src={`/logos/${slug}.png`} alt="" aria-hidden className="logo-mark mx-auto max-h-8 w-auto max-w-[120px] object-contain opacity-50 [html[data-mode=light]_&]:invert" loading="lazy" />
              ))}
            </div>
          </div>
        </div>

        {/* the cursor ring — the one graphic, oceanfilms-style */}
        <div ref={ringRef} className="pointer-events-none absolute left-0 top-0 z-20 h-[42vh] w-[42vh] rounded-full border border-[var(--gold)]/55 will-change-transform">
          <span className="absolute left-1/2 top-1/2 h-1.5 w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)]/60" />
          <span className="absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)]/60" />
        </div>

        {/* fixed vertical wordmark */}
        <span className="ghost-outline-ink font-display pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 select-none text-[6rem] leading-none [writing-mode:vertical-rl] rotate-180 md:left-8" aria-hidden>
          SELECTED WORK
        </span>

        {/* counter */}
        <div className="absolute right-5 top-24 z-10 text-right md:right-10">
          <span ref={countRef} className="font-display block text-5xl leading-none">01</span>
          <span className="label-mono mt-1 block text-[10px] tracking-[0.24em] text-[var(--gold)]">/ {String(FILMS.length).padStart(2, "0")}</span>
        </div>

        {/* credits — one per film, swapping with the dissolve */}
        {FILMS.map((p, i) => (
          <div key={`cr-${p.slug}`} ref={(el) => { creditRefs.current[i] = el; }} className="absolute bottom-14 right-5 z-10 max-w-md text-right will-change-transform md:right-10">
            <span className="label-mono text-[10px] tracking-[0.24em] text-[var(--gold)]">
              {p.client.toUpperCase()} · {p.category.toUpperCase()}
            </span>
            <Link href={`/work/${p.slug}`} className="group block">
              <span className="font-display mt-3 block text-[clamp(2rem,1.4rem+1.8vw,3.4rem)] leading-[0.95] text-[#f5f1e6]">
                {p.title}
              </span>
              <span className="label-mono mt-3 inline-block text-[10px] tracking-[0.22em] text-[#f5f1e6]/65 transition-colors duration-300 group-hover:text-[var(--gold)]">
                {p.stats} — WATCH ⟶
              </span>
            </Link>
          </div>
        ))}
        {/* a placeholder credit slot for the logos panel keeps indices aligned */}
        <div ref={(el) => { creditRefs.current[FILMS.length] = el; }} className="absolute bottom-14 right-5 z-10 text-right md:right-10">
          <Link href="/work" className="label-mono text-[10px] tracking-[0.24em] text-[#f5f1e6]/65 transition-colors hover:text-[var(--gold)]">
            THE FULL GALLERY ⟶ /WORK
          </Link>
        </div>
      </div>

      {/* mobile / reduced: a calm stack */}
      <div className="flex flex-col gap-12 px-5 pb-32 pt-24 md:hidden motion-reduce:md:flex md:px-10">
        {FILMS.map((p, i) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="block">
            <div className="on-media relative overflow-hidden rounded-md">
              <video className="aspect-video w-full object-cover" src={p.wide} poster={p.posterWide} muted loop playsInline preload="none" />
              <span className="bar-label absolute bottom-3 left-3">{String(i + 1).padStart(2, "0")} — {p.client}</span>
            </div>
            <span className="font-display mt-3 block text-2xl">{p.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
