"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ScrollType from "@/components/shell/ScrollType";

// 02 — Trusted by (client feedback): TWO rows of client logos marqueeing in
// OPPOSITE directions, larger marks, tight spacing. Every logo sits dimmed and
// slightly desaturated by default; hover one and it grows + brightens to full
// white while every OTHER logo dims and shrinks back (CSS group/has, so it
// survives the marquee, and the hovered row slows). Theme-aware.

const LOGOS = [
  "mclaren-logo", "aston-martin-white", "nike-white", "red-bull-7", "spotify-white",
  "defender-white", "meta-logo-white", "natwest-white", "airbus-white", "soho-house-white",
  "salomon-logo-white", "diageo-white", "led-zeppelin-logo-1", "abby-road-studios-white",
  "waldorf-astoria-white", "tui-white", "hofmeister-png", "gj-white",
];

// split across two rows
const mid = Math.ceil(LOGOS.length / 2);
const ROW_A = LOGOS.slice(0, mid);
const ROW_B = LOGOS.slice(mid);

function Logo({ slug }: { slug: string }) {
  return (
    <span className="tb-logo flex h-24 w-[210px] shrink-0 cursor-pointer items-center justify-center will-change-transform md:w-[230px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/${slug}.png`}
        alt=""
        aria-hidden
        className="logo-mark max-h-[60px] max-w-[200px] object-contain md:max-h-[68px] [html[data-mode=light]_&]:invert"
        loading="lazy"
      />
    </span>
  );
}

interface RowProps {
  logos: string[];
  reverse?: boolean;
  trackRef: React.RefObject<HTMLDivElement | null>;
  tweenRef: React.RefObject<gsap.core.Tween | null>;
}

function Row({ logos, reverse = false, trackRef, tweenRef }: RowProps) {
  const list = [...logos, ...logos, ...logos];
  return (
    <div
      className="tb-row overflow-hidden"
      onMouseEnter={() => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 0, duration: 0.25 })}
      onMouseLeave={() => tweenRef.current && gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6 })}
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
      }}
      data-reverse={reverse ? "true" : "false"}
    >
      <div ref={trackRef} className="flex w-max items-center gap-8 py-3 will-change-transform md:gap-10">
        {list.map((slug, i) => (
          <Logo key={`${slug}-${i}`} slug={slug} />
        ))}
      </div>
    </div>
  );
}

export default function TrustedBy() {
  const rootRef = useRef<HTMLElement>(null);
  const trackARef = useRef<HTMLDivElement>(null);
  const trackBRef = useRef<HTMLDivElement>(null);
  const tweenARef = useRef<gsap.core.Tween | null>(null);
  const tweenBRef = useRef<gsap.core.Tween | null>(null);

  // marquee — always on (mobile included), but skip when reduced motion
  useEffect(() => {
    const trackA = trackARef.current;
    const trackB = trackBRef.current;
    if (!trackA || !trackB) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // three copies of each row, so -33.333% loops seamlessly
    tweenARef.current = gsap.fromTo(
      trackA,
      { xPercent: 0 },
      { xPercent: -33.333, duration: 55, ease: "none", repeat: -1 },
    );
    tweenBRef.current = gsap.fromTo(
      trackB,
      { xPercent: -33.333 },
      { xPercent: 0, duration: 55, ease: "none", repeat: -1 },
    );

    return () => {
      tweenARef.current?.kill();
      tweenBRef.current?.kill();
    };
  }, []);

  // scroll-in entrance — shared motion language (organic assemble)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const heading = root.querySelector<HTMLElement>(".tb-heading");
      const rows = gsap.utils.toArray<HTMLElement>(".tb-row", root);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      if (heading) {
        tl.fromTo(
          heading,
          { autoAlpha: 0, y: 30, rotation: -1.5 },
          { autoAlpha: 1, y: 0, rotation: 0, duration: 0.7, ease: "power3.out" },
        );
      }

      tl.fromTo(
        rows,
        { autoAlpha: 0, y: 40, x: (i) => (i % 2 === 0 ? -26 : 26), rotation: (i) => (i % 2 === 0 ? -1.2 : 1.2) },
        { autoAlpha: 1, y: 0, x: 0, rotation: 0, duration: 0.85, ease: "power3.out", stagger: 0.12 },
        "-=0.35",
      );

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  // keep ScrollTrigger honest if anything resizes the marquee
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="02 — Trusted by"
      className="relative px-5 py-[8vh] md:px-10"
      aria-label="Trusted by"
    >
      <div className="tb-heading mb-[4vh] text-center">
        <ScrollType
          as="h2"
          className="font-display text-[clamp(1.2rem,2.4vw,2rem)] normal-case leading-none text-[var(--gold)]"
          style={{ fontWeight: 400 }}
        >
          Trusted by
        </ScrollType>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        <Row logos={ROW_A} trackRef={trackARef} tweenRef={tweenARef} />
        <Row logos={ROW_B} reverse trackRef={trackBRef} tweenRef={tweenBRef} />
      </div>
    </section>
  );
}
