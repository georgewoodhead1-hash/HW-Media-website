"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";
import { COMING, DISCOVER, FEATURED } from "@/content/gallery";
import Rule from "@/components/shell/Rule";
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
    let cancelEnter: (() => void) | null = null;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>(".gtile");
      const featured = tiles.slice(0, FEATURED.length);
      const rest = tiles.slice(FEATURED.length);

      gsap.set(tiles, { autoAlpha: 0, y: 96 });

      // Top tiles BUILD WITH THE TRANSITION: the weave clears upward and the
      // wall lifts into place beneath it, tile by tile in reading order —
      // the transition constructs the page (George), never a fade.
      cancelEnter = onPageEntered(() => {
        gsap.to(featured, { autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out", stagger: 0.09, delay: 0.05 });
      });

      // The rest reveal on scroll as you reach them — snappy, not laboured.
      ScrollTrigger.batch(rest, {
        start: "top 96%",
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });

      // guard: [data-ghead] only exists on some layouts — targeting it
      // blind spammed "GSAP target not found" on every visit
      if (el.querySelector("[data-ghead]")) {
        gsap.from("[data-ghead]", { autoAlpha: 0, y: 24, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } });
      }
      ScrollTrigger.refresh();
    }, el);
    return () => { cancelEnter?.(); ctx.revert(); };
  }, []);

  return (
    <div ref={root}>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((it) => (
          <GalleryTile key={it.label} item={it} />
        ))}
      </div>

      <div className="px-5 pb-[7vh] pt-[13vh] md:px-10"><Rule label="Discover more" /></div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {DISCOVER.map((it) => (
          <GalleryTile key={it.label} item={it} />
        ))}
      </div>

      <div className="px-5 pb-[7vh] pt-[13vh] md:px-10"><Rule label="Coming soon" /></div>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {COMING.map((it) => (
          <GalleryTile key={it.label} item={it} />
        ))}
      </div>


    </div>
  );
}
