"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// 02 — Trusted by (client feedback): ONE clean row of client logos, larger,
// tighter spacing. The row marquees across; hover to slow it. Theme-aware.

const LOGOS = [
  "mclaren-logo", "aston-martin-white", "nike-white", "red-bull-7", "spotify-white",
  "defender-white", "meta-logo-white", "natwest-white", "airbus-white", "soho-house-white",
  "salomon-logo-white", "diageo-white", "led-zeppelin-logo-1", "abby-road-studios-white",
  "waldorf-astoria-white", "tui-white", "hofmeister-png", "gj-white",
];

export default function TrustedBy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tweenRef.current = gsap.fromTo(
      track,
      { xPercent: 0 },
      { xPercent: -50, duration: 60, ease: "none", repeat: -1 },
    );
    return () => { tweenRef.current?.kill(); };
  }, []);

  const list = [...LOGOS, ...LOGOS];

  return (
    <section
      data-theme="dark"
      data-surface="page"
      data-chapter="02 — Trusted by"
      className="relative px-5 py-[8vh] md:px-10"
      aria-label="Trusted by"
    >
      <div className="mb-[4vh] text-center">
        <h2 className="font-display text-[clamp(1.2rem,2.4vw,2rem)] normal-case leading-none text-[var(--gold)]">
          Trusted by
        </h2>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 0.12, duration: 0.5 })}
        onMouseLeave={() => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 })}
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <div ref={trackRef} className="flex w-max items-center gap-16 py-4 will-change-transform">
          {list.map((slug, i) => (
            <span key={`${slug}-${i}`} className="flex h-20 w-[210px] shrink-0 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/logos/${slug}.png`}
                alt=""
                aria-hidden
                className="logo-mark max-h-[52px] max-w-[200px] object-contain opacity-85 transition-opacity hover:opacity-100 [html[data-mode=light]_&]:invert"
                loading="lazy"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
