"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// The diagonal tiles band (client final round) — the Stone Visuals /
// monopo.vn `tilesGrid` move, sat between Testimonials and the FAQs.
// The wrap is 150% wide and rotated 45°; each row is scrubbed horizontally
// in alternating directions so the drift reads as diagonal on screen, with
// a half-speed inner drift for depth. "Start here" floats dead-centre as
// the one interactive thing in the field.

const STILLS = [
  "/images/stills/s01.jpg",
  "/videos/micro/posters/m01.jpg",
  "/images/stills/s02.jpg",
  "/videos/micro/posters/m04.jpg",
  "/images/stills/s03.jpg",
  "/videos/micro/posters/m06.jpg",
  "/images/stills/s04.jpg",
  "/videos/micro/posters/m10.jpg",
  "/images/stills/s05.jpg",
  "/videos/micro/posters/m12.jpg",
];

const ROW_DIRECTIONS = [1, -1, 1, -1];
const TILES_PER_ROW = 6;

function rowImages(rowIndex: number): string[] {
  return Array.from(
    { length: TILES_PER_ROW },
    (_, i) => STILLS[(rowIndex * 3 + i) % STILLS.length],
  );
}

export default function TilesField() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const scrub = {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      };

      el.querySelectorAll<HTMLElement>("[data-tiles-row]").forEach((row) => {
        const dir = Number(row.dataset.tilesRow);
        gsap.fromTo(
          row,
          { x: `${dir * -10}vw` },
          { x: `${dir * 10}vw`, ease: "none", scrollTrigger: scrub },
        );
        row.querySelectorAll<HTMLElement>("[data-tiles-inner]").forEach((inner) => {
          gsap.fromTo(
            inner,
            { xPercent: dir * -6 },
            { xPercent: dir * 6, ease: "none", scrollTrigger: scrub },
          );
        });
      });
      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      data-theme="dark"
      data-surface="page"
      className="relative bg-[var(--bg)] text-[var(--fg)]"
      aria-label="Start a project"
    >
      <div className="tiles" aria-hidden>
        <div className="tiles__wrap">
          {ROW_DIRECTIONS.map((dir, rowIndex) => (
            <div
              key={`tiles-row-${rowIndex}`}
              className="tiles__line"
              data-tiles-row={dir}
            >
              {rowImages(rowIndex).map((src, i) => (
                <div key={`tile-${rowIndex}-${i}`} className="tiles__tile">
                  <div className="tiles__tile-inner" data-tiles-inner>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" loading="lazy" draggable={false} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* the one interactive thing in the field — dead centre */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Link
          href="/contact"
          className="blink bg-black/45 text-[clamp(14px,1.3vw,17px)] tracking-[0.05em] backdrop-blur-sm"
        >
          Start here
        </Link>
      </div>
    </section>
  );
}
