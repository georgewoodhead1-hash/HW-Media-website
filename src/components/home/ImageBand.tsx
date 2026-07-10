"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// 03 — the beat between Trusted By and Featured Projects. The statement sits
// over a GRID OF FOUR STILLS (George: no repeating showreel footage here) —
// the photos rise with a slight stagger and drift at different speeds against
// the scroll, the words ride over the top.
// the REAL photography from the Drive 'Website stills' folder (George)
const STILLS = [
  "/images/stills/s03.jpg",
  "/images/stills/s04.jpg",
  "/images/stills/s02.jpg",
  "/images/stills/s05.jpg",
];

export default function ImageBand() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];
      // each still drifts at its own speed — a quiet layered field
      gsap.utils.toArray<HTMLElement>(".band-still", root).forEach((el, i) => {
        const speed = [14, -10, 10, -16][i % 4];
        const t = gsap.fromTo(
          el,
          { yPercent: -speed },
          { yPercent: speed, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
        kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      });
      // the words ride over the field, slightly faster
      const content = root.querySelector<HTMLElement>(".band-content");
      const ct = gsap.fromTo(
        content,
        { yPercent: 20 },
        { yPercent: -20, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 } },
      );
      kills.push(() => { ct.scrollTrigger?.kill(); ct.kill(); });
      // grid rises in with a stagger on arrival; reverses on the way back
      const rise = gsap.from(".band-still", {
        autoAlpha: 0, y: 60, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 74%", toggleActions: "play none none reverse" },
      });
      kills.push(() => { rise.scrollTrigger?.kill(); rise.kill(); });
      // and the WHOLE band fades out in place as it leaves (site-wide rule)
      const fadeOut = ScrollTrigger.create({
        trigger: root,
        start: "bottom 50%",
        end: "bottom 12%",
        scrub: true,
        onUpdate: (self) => {
          const els = root.querySelectorAll(".band-still, .band-content");
          gsap.set(els, { autoAlpha: 1 - self.progress });
        },
      });
      kills.push(() => fadeOut.kill());
      return () => kills.forEach((k) => k());
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="06 — The mission"
      className="relative flex min-h-[86vh] items-center overflow-hidden bg-[var(--bg)] px-5 py-[12vh] md:px-10"
      aria-label="A creative agency for brands that refuse to be ordinary"
    >
      {/* the field of four stills */}
      <div className="pointer-events-none absolute inset-x-5 top-1/2 grid -translate-y-1/2 grid-cols-2 gap-4 md:inset-x-10 md:grid-cols-4">
        {STILLS.map((src) => (
          <div key={src} className="band-still relative overflow-hidden rounded-md will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" aria-hidden className="aspect-[3/4] w-full object-cover opacity-90" loading="lazy" />
            {/* the numbers (George) — mono index in each still's corner */}
            <span className="label-mono absolute bottom-3 left-3 text-[11px] tracking-[0.22em] text-[var(--fg)]">
              {String(STILLS.indexOf(src) + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
      {/* a floor so the words always win */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/25" />

      <div className="band-content relative z-10 mx-auto max-w-4xl text-center will-change-transform">
        <h2 className="font-display text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.02] tracking-[-0.015em] text-white">
          A creative agency for brands
          <br />
          that refuse to be ordinary.
        </h2>
        <p className="mt-9">
          <Link href="/about" className="blink text-[13px] tracking-[0.05em]">
            More about us
          </Link>
        </p>
      </div>
    </section>
  );
}
