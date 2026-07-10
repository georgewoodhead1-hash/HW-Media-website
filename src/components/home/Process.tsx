"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// 05 — OUR PROCESS, v8 (client final round): HORIZONTAL SCROLL. A big "Our
// Process" title (the thin rule + plusses are gone), then the four stage
// cards ride side by side — the track translates X as the page scrolls
// through the section. The section pins via CSS STICKY (not ScrollTrigger
// pin — a pinned ancestor's transform breaks position:fixed children, see
// HW-MEDIA-RULES).
//
// TWO VARIANTS for the client to choose between (both live, /process-variants
// shows them stacked):
//   A — editorial cards: framed image on top, number + words below the frame
//   B — cinema cards: full-bleed image cards, words overlaid at the bottom
export type ProcessVariant = "a" | "b";

interface Stage {
  n: string;
  name: string;
  sub: string;
  cta: string;
  href: string;
  img: string;
}

const STAGES: Stage[] = [
  {
    n: "01", name: "PRE-PRODUCTION",
    sub: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot.",
    cta: "Start a project", href: "/contact", img: "/videos/posters/loop-01.jpg",
  },
  {
    n: "02", name: "PRODUCTION",
    sub: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera.",
    cta: "Behind the scenes", href: "/about", img: "/videos/posters/loop-02.jpg",
  },
  {
    n: "03", name: "EDIT",
    sub: "Edit, grade, sound and motion under one roof. The film finds its rhythm.",
    cta: "See the films", href: "/work", img: "/videos/posters/loop-03.jpg",
  },
  {
    n: "04", name: "DELIVER",
    sub: "The master film plus every vertical, square and short-form cutdown your channels need — mastered properly, never cropped as an afterthought.",
    cta: "Start here", href: "/contact", img: "/videos/posters/loop-04.jpg",
  },
];

export default function Process({ variant = "a" }: { variant?: ProcessVariant }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];

      // the title lifts in as the section arrives
      const head = root.querySelector<HTMLElement>(".proc-head");
      if (head) {
        gsap.set(head, { autoAlpha: 0, y: 34 });
        const t = gsap.to(head, {
          autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%", toggleActions: "play none none reverse" },
        });
        kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      }

      // the ride: track slides left while the sticky stage holds the frame
      const slide = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const max = Math.max(0, track.scrollWidth - track.clientWidth);
          gsap.set(track, { x: -max * self.progress, force3D: true });
        },
      });
      kills.push(() => slide.kill());

      // each card eases up slightly as it enters the frame from the right
      gsap.utils.toArray<HTMLElement>(".proc-card", track).forEach((card, i) => {
        gsap.set(card, { y: i === 0 ? 0 : 26 });
        const t = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const lift = Math.min(1, Math.max(0, self.progress * (STAGES.length + 0.5) - i + 0.6));
            gsap.set(card, { y: (1 - lift) * 26 });
          },
        });
        kills.push(() => t.kill());
      });

      return () => kills.forEach((k) => k());
    });

    return () => mm.revert();
  }, []);

  const isB = variant === "b";

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="page"
      data-chapter="05 — Our process"
      // 260vh of scroll room drives the horizontal ride on desktop
      className="relative z-[20] bg-[var(--bg)] text-[var(--fg)] md:h-[260vh]"
      aria-label="Our process"
    >
      <div className="flex flex-col justify-center overflow-hidden md:sticky md:top-0 md:h-screen">
        {/* the title — big, no rule, no plusses (client) */}
        <div className="proc-head px-5 pb-[4vh] pt-[8vh] md:px-10 md:pt-0">
          <h2 className="font-display text-center text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9] tracking-[-0.05em]">
            Our Process
          </h2>
        </div>

        {/* the ride — cards side by side; touch devices swipe natively */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-[6vh] will-change-transform [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:snap-none md:gap-8 md:overflow-x-visible md:px-[14vw]"
        >
          {STAGES.map((s) =>
            isB ? (
              /* ── VARIANT B — cinema card: full-bleed image, words overlaid ── */
              <div
                key={s.n}
                className="proc-card relative aspect-[3/4] w-[78vw] shrink-0 snap-center overflow-hidden rounded-lg shadow-[0_28px_60px_-18px_rgba(0,0,0,0.55)] ring-1 ring-[var(--hairline-dark)] md:aspect-[4/5] md:w-[30vw]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
                <span className="label-mono absolute left-5 top-5 text-[11px] tracking-[0.22em] text-white/85">
                  {s.n} / 04
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[0.95] tracking-[-0.015em] text-white">
                    {s.name}
                  </h3>
                  <p className="about-body mt-3 text-[13px] leading-relaxed text-white/85 md:text-[14px]">
                    {s.sub}
                  </p>
                  <p className="mt-5">
                    <Link href={s.href} className="blink text-[12px] tracking-[0.05em] !text-white">
                      {s.cta}
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              /* ── VARIANT A — editorial card: framed image, words below ── */
              <div
                key={s.n}
                className="proc-card w-[78vw] shrink-0 snap-center md:w-[30vw]"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg shadow-[0_28px_60px_-18px_rgba(0,0,0,0.55)] ring-1 ring-[var(--hairline-dark)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="mt-6">
                  <p className="label-mono text-[11px] tracking-[0.22em] text-[var(--fg)]">
                    {s.n} / 04
                  </p>
                  <h3 className="font-display mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[0.95] tracking-[-0.015em]">
                    {s.name}
                  </h3>
                  <p className="about-body mt-3 max-w-md text-[13px] leading-relaxed text-[var(--fg)] md:text-[14px]">
                    {s.sub}
                  </p>
                  <p className="mt-5">
                    <Link href={s.href} className="blink text-[12px] tracking-[0.05em]">
                      {s.cta}
                    </Link>
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
