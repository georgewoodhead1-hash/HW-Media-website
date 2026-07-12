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
      const covers = gsap.utils.toArray<HTMLElement>(".gt-cover");
      const featured = covers.slice(0, FEATURED.length);
      const rest = covers.slice(FEATURED.length);

      gsap.set(covers, { yPercent: 0 });

      // THE WALL IS BUILT BY THE TRANSITION (George): every tile sits under
      // a cream block — the same cream as the cover slats — and the blocks
      // FALL OFF one by one in reading order as the weave clears upward.
      // No fades anywhere.
      cancelEnter = onPageEntered(() => {
        gsap.to(featured, { yPercent: 103, duration: 0.85, ease: "power4.inOut", stagger: 0.09, delay: 0.08 });
      });

      // The rest shed their blocks as you reach them.
      ScrollTrigger.batch(rest, {
        start: "top 92%",
        onEnter: (els) => gsap.to(els, { yPercent: 103, duration: 0.75, ease: "power4.inOut", stagger: 0.1, overwrite: true }),
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
