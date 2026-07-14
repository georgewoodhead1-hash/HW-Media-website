"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import TitleRule from "@/components/shell/TitleRule";

// 06 — WHAT WE DO, on the HOME page (ROUND-8/9: moved here from About in
// place of the diagonal band). George's brief: the About-page grid — EIGHT
// boxes, 2×4, a still frame in each — but with the "slot machine" hover
// (the Stone Visuals / club-project move): hover a tile and the still
// darkens + blurs while the FILM rises up from the bottom in front of it,
// like a ticket sliding out of the machine. Every tile links to its
// /services page. Entrance = the house rise (masked lift per tile).

export default function WhatWeDo() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tiles = gsap.utils.toArray<HTMLElement>(".wwd-tile", root);
      gsap.set(tiles, { autoAlpha: 0, y: 40 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none reverse" },
      });
      tl.to(tiles, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 });
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="06 — What we do"
      className="relative z-10 bg-[var(--bg)] px-5 py-[14vh] text-[var(--fg)] md:px-10"
      aria-label="What we do"
    >
      <TitleRule title="What we do" className="mb-[8vh]" />

      {/* the grid — 2×4 (George), each tile a slot-machine hover */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {SERVICES.map((s) => {
          const poster = s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg");
          return (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              aria-label={`${s.name} — what we offer`}
              className="wwd-tile group relative flex aspect-[4/5] items-end overflow-hidden rounded-md bg-black md:aspect-[4/3]"
              onMouseEnter={(e) => { const v = e.currentTarget.querySelector("video"); if (v) { v.currentTime = 0; v.play().catch(() => {}); } }}
              onMouseLeave={(e) => e.currentTarget.querySelector("video")?.pause()}
            >
              {/* the still — darkens + blurs behind the rising film */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-[filter,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-40 group-hover:blur-md"
              />
              {/* the film — rises up from the bottom in front (the slot) */}
              <video
                className="absolute inset-0 h-full w-full translate-y-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:translate-y-0"
                src={s.clip}
                poster={poster}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden
              />
              {/* a resting scrim so the label reads, lifts on hover */}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* the name */}
              <h3 className="relative z-10 p-4 md:p-5">
                <span className="blink blink-fill text-[clamp(12px,1.05vw,15px)] !text-[#f5f1e6] group-hover:!text-[var(--bg)]">
                  {s.name}
                </span>
              </h3>
            </Link>
          );
        })}
      </div>

      <p className="mt-[8vh] text-center">
        <Link href="/work" className="blink blink-bare text-[15px] tracking-[0.05em]">
          Discover the work
        </Link>
      </p>
    </section>
  );
}
