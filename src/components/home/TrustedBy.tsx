"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// 02 — Trusted by, deck-slide-3 layout: a big "Trusted by" heading, then
// THREE rows of logos scrubbing across in alternating directions. Hover a
// row and it slows so you can catch a mark; hover a mark and it grows
// while every other logo on the wall blows back (dim + shrink). Theme-aware.

const ROW_A = [
  "mclaren-logo", "nike-white", "red-bull-7", "natwest-white", "spotify-white",
  "defender-white", "meta-logo-white", "aston-martin-white", "airbus-white",
  "abby-road-studios-white", "soho-house-white", "salomon-logo-white",
];
const ROW_B = [
  "zuma-white", "led-zeppelin-logo-1", "waldorf-astoria-white", "diageo-white",
  "tui-white", "racing-tv-white", "mac-cosemetics-white", "malle-logo-white",
  "62ebd2669147fe93452c8ffd-er-primary-logowhite", "castle-air-white",
  "kayali-white", "crystal-ski-white",
];
const ROW_C = [
  "burger-and-lobster-white", "cancer-platform-white", "ecurie-bertelli-white",
  "evamore-music-white", "gj-white", "hofmeister-png", "kingsclere-white",
  "sm-new-logo-design-white-2025", "malle-icon-white", "waldorf-astoria-white",
  "tui-white", "racing-tv-white",
];

function Row({ logos, reverse, dur }: { logos: string[]; reverse?: boolean; dur: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tweenRef.current = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: dur, ease: "none", repeat: -1 },
    );
    return () => { tweenRef.current?.kill(); };
  }, [reverse, dur]);

  const list = [...logos, ...logos];
  return (
    <div
      className="tb-row overflow-hidden"
      onMouseEnter={() => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 0.08, duration: 0.5 })}
      onMouseLeave={() => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 })}
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-14 py-3 will-change-transform">
        {list.map((slug, i) => (
          <span key={`${slug}-${i}`} className="tb-logo flex h-16 w-[170px] shrink-0 items-center justify-center will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${slug}.png`}
              alt=""
              aria-hidden
              className="logo-mark max-h-[34px] max-w-[148px] object-contain [html[data-mode=light]_&]:invert"
              loading="lazy"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section
      data-theme="dark"
      data-surface="page"
      data-chapter="02 — Trusted by"
      className="relative px-5 py-[13vh] md:px-10"
      aria-label="Trusted by"
    >
      {/* the heading — small, deck-slide-3 style */}
      <div className="mb-[7vh] text-center">
        <h2 className="font-display text-[clamp(1.3rem,2.6vw,2.2rem)] normal-case leading-none text-[var(--gold)]">
          Trusted by
        </h2>
      </div>

      {/* the three scrubbing rows */}
      <div className="tb-wall space-y-1">
        <Row logos={ROW_A} dur={52} />
        <Row logos={ROW_B} reverse dur={64} />
        <Row logos={ROW_C} dur={58} />
      </div>
    </section>
  );
}
