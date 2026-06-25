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
      gsap.set(".gtile", { autoAlpha: 0, y: 56 });
      ScrollTrigger.batch(".gtile", {
        start: "top 97%",
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.15, ease: "power3.out", stagger: 0.18, overwrite: true }),
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
