"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { COMING, DISCOVER, FEATURED } from "@/content/gallery";
import GalleryTile from "./GalleryTile";

// The work wall. Three flush 3-col blocks in Harry's hierarchy order. Tiles reveal
// in READING ORDER — left, middle, right, then the next row — each fading up in
// turn (ScrollTrigger.batch staggers each row's tiles as it enters). Headings rise
// ahead of their block.
export default function WorkGallery() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(".gtile");
      const featured = tiles.slice(0, FEATURED.length);
      const rest = tiles.slice(FEATURED.length);

      gsap.set(tiles, { autoAlpha: 0, y: 56 });

      // Top six — NOT scroll-driven (they sit above the fold, so a scroll trigger
      // fired them instantly). They HOLD until the page has landed (the "Our work"
      // intro has lifted), then reveal SLOWLY, one after another.
      gsap.to(featured, { autoAlpha: 1, y: 0, duration: 1.5, ease: "power3.out", stagger: 0.3, delay: 1.7 });

      // The rest reveal on scroll as you reach them — also unhurried.
      ScrollTrigger.batch(rest, {
        start: "top 92%",
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.3, ease: "power3.out", stagger: 0.22, overwrite: true }),
      });

      gsap.from("[data-ghead]", { autoAlpha: 0, y: 24, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } });
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((it) => (
          <GalleryTile key={it.label} item={it} />
        ))}
      </div>

      <h2 data-ghead className="about-display px-5 pb-7 pt-[13vh] text-[clamp(1.7rem,4vw,3.2rem)] text-[var(--fg)] md:px-10">
        Discover <span className="gold-lg">more</span>
      </h2>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {DISCOVER.map((it) => (
          <GalleryTile key={it.label} item={it} />
        ))}
      </div>

      <h2 data-ghead className="about-display px-5 pb-7 pt-[13vh] text-[clamp(1.7rem,4vw,3.2rem)] text-[var(--fg)] md:px-10">
        Coming <span className="gold-lg">soon</span>
      </h2>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {COMING.map((it) => (
          <GalleryTile key={it.label} item={it} />
        ))}
      </div>
    </div>
  );
}
