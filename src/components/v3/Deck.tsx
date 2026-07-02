"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// V3 §3 — THE DECK. Basement's card-deck: "Selected work (06)" holds sticky at
// the top while project cards slide up and dock beneath it, each one 14px lower
// than the last so every previous card keeps a visible lip (true deck). Obys
// grey-wash: a card arrives desaturated and reaches full colour exactly as it
// docks; when the next card arrives, the one beneath washes back to grey and
// compresses slightly. Hover = subtle scale + meta reveal. The heading band is
// 22vh and cards dock at 22vh + lip, so the heading is never covered.

interface WorkItem {
  slug: string;
  title: string;
  meta: string;
  year: string;
}

const WORK: WorkItem[] = [
  { slug: "otoko", title: "Otoko", meta: "Brand film", year: "2025" },
  { slug: "mclaren", title: "McLaren", meta: "Commercial", year: "2025" },
  { slug: "hera", title: "Hera", meta: "Brand film", year: "2024" },
  { slug: "salomon", title: "Salomon", meta: "Sport", year: "2024" },
  { slug: "nike", title: "Nike", meta: "Sport", year: "2023" },
  { slug: "castle-air", title: "Castle Air", meta: "Aerial", year: "2023" },
];

const LIP = 14; // px each card docks below the previous — the deck cascade
const BAND = "26vh"; // sticky heading band height — clears the fixed nav when it re-appears

export default function Deck() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading entrance: masked rise + hairline draw
      gsap.from(".v3d-headline-line", {
        yPercent: 112,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".v3d-head", start: "top 70%" },
      });
      gsap.from(".v3d-rule", {
        scaleX: 0,
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ".v3d-head", start: "top 70%" },
      });
      gsap.from(".v3d-count", {
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.5,
        scrollTrigger: { trigger: ".v3d-head", start: "top 70%" },
      });

      const items = gsap.utils.toArray<HTMLElement>(".v3d-item");
      items.forEach((item, i) => {
        const card = item.querySelector(".v3d-card");
        if (!card) return;

        // Obys grey-wash arrival: colour lands exactly as the card docks.
        gsap.fromTo(
          card,
          { filter: "grayscale(1) brightness(0.55)" },
          {
            filter: "grayscale(0) brightness(1)",
            ease: "none",
            scrollTrigger: { trigger: item, start: "top 95%", end: "top 30%", scrub: 0.4 },
          },
        );

        // When the NEXT card arrives, this one washes back and compresses.
        // The wash filter targets the VIDEO (not the card) so it can never race
        // the card-level arrival tween on the same property — the two filters
        // simply multiply (r2 fix: same-property scrub tweens raced on big
        // scroll jumps and could leave a previous card full-colour).
        const prevItem = items[i - 1];
        if (prevItem) {
          const prevCard = prevItem.querySelector(".v3d-card");
          const prevVideo = prevItem.querySelector("video");
          const washTrigger = { trigger: item, start: "top 85%", end: "top 30%", scrub: 0.4 } as const;
          if (prevVideo) {
            gsap.fromTo(
              prevVideo,
              { filter: "grayscale(0) brightness(1)" },
              { filter: "grayscale(0.85) brightness(0.42)", ease: "none", immediateRender: false, scrollTrigger: { ...washTrigger } },
            );
          }
          if (prevCard) {
            gsap.fromTo(
              prevCard,
              { scale: 1 },
              { scale: 0.975, transformOrigin: "center top", ease: "none", immediateRender: false, scrollTrigger: { ...washTrigger } },
            );
          }
        }
      });

      // Closing link fade
      gsap.from(".v3d-all", {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".v3d-all", start: "top 92%" },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative" aria-label="Selected work">
      {/* sticky heading band — cards dock below it, never over it */}
      {/* sticky on desktop only — the mobile deck is a plain stack */}
      <div className="v3d-head pointer-events-none z-30 flex items-end px-5 pb-4 pt-16 md:sticky md:top-0 md:h-[26vh] md:min-h-[200px] md:bg-gradient-to-b md:from-[#050505] md:via-[#050505]/85 md:to-transparent md:px-10 md:pt-0">
        <div className="w-full">
          <div className="flex items-end justify-between pb-4">
            <h2 className="font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-none text-[#f5f1e6]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="v3d-headline-line block">Selected work</span>
              </span>
            </h2>
            <span
              className="v3d-count pb-1 text-[13px] tracking-[0.2em] text-[#c3c3c3]/60"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              (06)
            </span>
          </div>
          <div aria-hidden className="v3d-rule h-px w-full origin-left bg-[#f5f1e6]/15" />
        </div>
      </div>

      <div className="relative">
        {WORK.map((w, i) => (
          <div
            key={w.slug}
            className="v3d-item px-5 py-5 md:sticky md:px-10 md:py-0"
            style={{ top: `calc(${BAND} + ${i * LIP}px)`, zIndex: i + 1 }}
          >
            <Link href={`/work/${w.slug}`} className="group block">
              <div className="v3d-card relative mx-auto h-[44vh] max-w-[1180px] overflow-hidden rounded-lg bg-[#0a0a0a] shadow-[0_-26px_70px_rgba(0,0,0,0.78)] will-change-[filter,transform] md:h-[58vh]">
                <video
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.045]"
                  src={`/videos/films/${w.slug}-w.mp4`}
                  poster={`/videos/films/posters/${w.slug}-w.jpg`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
                <span
                  className="absolute right-6 top-5 text-[12px] tracking-[0.16em] text-[#f5f1e6]/70"
                  style={{ fontFamily: "var(--font-firma), sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}/{String(WORK.length).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h3 className="font-display text-[clamp(1.8rem,3.6vw,3.6rem)] leading-none text-[#f5f1e6]">{w.title}</h3>
                  <div className="mt-3 flex translate-y-2 items-center gap-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <span
                      className="text-[11px] uppercase tracking-[0.2em] text-[#c3c3c3]/80"
                      style={{ fontFamily: "var(--font-firma), sans-serif" }}
                    >
                      {w.meta} — {w.year}
                    </span>
                    <span
                      className="text-[11px] uppercase tracking-[0.2em] text-[#f5f1e6]"
                      style={{ fontFamily: "var(--font-firma), sans-serif" }}
                    >
                      View project <span aria-hidden>⟶</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            {/* scroll room between arrivals (desktop deck only) */}
            <div aria-hidden className="hidden md:block md:h-[40vh]" />
          </div>
        ))}
        <div aria-hidden className="hidden md:block md:h-[26vh]" />
      </div>

      <div className="v3d-all flex justify-end px-5 pb-[10vh] pt-8 md:px-10">
        <Link
          href="/work"
          className="group inline-flex items-baseline gap-3 text-[13px] uppercase tracking-[0.22em] text-[#c3c3c3]/80 transition-colors duration-300 hover:text-[#f5f1e6]"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          <span className="border-b border-[#c3c3c3]/30 pb-1 transition-colors duration-300 group-hover:border-[#f5f1e6]/70">
            Browse all work
          </span>
          <span aria-hidden>⟶</span>
        </Link>
      </div>
    </section>
  );
}
