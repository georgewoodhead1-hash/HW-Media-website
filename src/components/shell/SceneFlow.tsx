"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Scene linking: every section tagged [data-flow] dims + lifts as it leaves the top
// of the viewport while the next section rises in beneath it, so adjacent scenes
// CROSSFADE into one another instead of butt-joining as separate blocks. The
// entrances already exist per-section; this supplies the missing exit half. Desktop
// + motion only (pinned scenes run their own choreography and are not tagged).
export default function SceneFlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-flow]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 1, yPercent: 0 },
          {
            autoAlpha: 0.5,
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 10%", end: "top -20%", scrub: 0.8 },
          },
        );
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
