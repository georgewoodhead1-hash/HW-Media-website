"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import TitleRule from "@/components/shell/TitleRule";

// 06 — WHAT WE DO, on the HOME page (ROUND-8: George moved it here from
// About, in place of the diagonal tiles band). Eight services as a BIG
// index — no tiny labels, display-size rows. Hover a row: the rest of the
// index dims back, the row's film fades up behind the type (the
// Iconoclast move from the site dossier), VIEW appears. Every row is a
// link to its /services page. Entrance = the house rise: each row lifts
// out of an overflow mask while its hairline draws from the centre.

export default function WhatWeDo() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>(".wwd-inner", root);
      const lines = gsap.utils.toArray<HTMLElement>(".wwd-line", root);
      gsap.set(rows, { yPercent: 115 });
      gsap.set(lines, { scaleX: 0, transformOrigin: "center center" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none reverse" },
      });
      tl.to(lines, { scaleX: 1, duration: 0.9, ease: "power4.inOut", stagger: 0.05 }, 0)
        .to(rows, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.06 }, 0.15);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });
    return () => mm.revert();
  }, []);

  const enter = (i: number) => {
    setActive(i);
    const v = videoRefs.current[i];
    if (v) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    }
  };
  const leave = (i: number) => {
    setActive((cur) => (cur === i ? -1 : cur));
    videoRefs.current[i]?.pause();
  };

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="06 — What we do"
      className="relative z-10 overflow-hidden bg-[var(--bg)] px-5 py-[14vh] text-[var(--fg)] md:px-10"
      aria-label="What we do"
    >
      {/* the film layer — the hovered row's clip owns the background (md+) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {SERVICES.map((s, i) => (
          <video
            key={s.slug}
            ref={(el) => { videoRefs.current[i] = el; }}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: active === i ? 0.28 : 0 }}
            data-src={s.clip}
            poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
            muted
            loop
            playsInline
            preload="none"
          />
        ))}
        {/* a quiet scrim so the type always wins */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/60 via-transparent to-[var(--bg)]/60" />
      </div>

      <div className="relative">
        <TitleRule title="What we do" className="mb-[7vh]" />

        {/* the index — hover one row, the others sit back (the Luke move) */}
        <div className="wwd-list">
          {SERVICES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              onMouseEnter={() => enter(i)}
              onMouseLeave={() => leave(i)}
              className="wwd-row group relative block transition-opacity duration-400"
              style={{ opacity: active === -1 || active === i ? 1 : 0.3 }}
              aria-label={`${s.name} — what we offer`}
            >
              <span aria-hidden className="wwd-line block h-px w-full bg-[var(--hairline-dark)]" />
              <div className="overflow-hidden">
                <div className="wwd-inner flex items-baseline gap-5 py-4 will-change-transform md:gap-8 md:py-6">
                  <span className="label-mono w-8 shrink-0 text-[11px] tracking-[0.2em] opacity-55">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display flex-1 text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.02]">
                    {s.name}
                  </h3>
                  <span className="label-mono hidden shrink-0 text-[10px] tracking-[0.24em] opacity-0 transition-opacity duration-300 group-hover:opacity-80 md:inline">
                    VIEW ⟶
                  </span>
                </div>
              </div>
            </Link>
          ))}
          <span aria-hidden className="wwd-line block h-px w-full bg-[var(--hairline-dark)]" />
        </div>
      </div>
    </section>
  );
}
