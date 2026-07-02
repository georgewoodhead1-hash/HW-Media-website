"use client";

import { useEffect, useRef } from "react";
import { safePlay } from "@/lib/video";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import Open from "./Open";
import Credo from "./Credo";
import Deck from "./Deck";
import LogoWall from "./LogoWall";
import Process from "./Process";
import Cta from "./Cta";

// ─────────────────────────────────────────────────────────────────────────────
// V3 — "MOTION STUDIOS": Exo Ape + Obys + Basement + Unseen, blended.
//  §1 OPEN     (Open.tsx)     Unseen two-beat entrance → Exo Ape speed-split
//                             (media ~0.10x, headline ~0.37x — probe-matched).
//  §2 CREDO    (Credo.tsx)    one line per beat; "We make films" scale-jumps
//                             ~6.6x at centre.
//  §3 WORK     (Deck.tsx)     Basement card-deck under a sticky heading with
//                             Obys grey-wash arrivals + previous-card wash-back.
//  §4 WALL     (LogoWall.tsx) hairline-bordered client logo architecture.
//  §5 PROCESS  (Process.tsx)  titles riding over near-frozen stage films.
//  §6 FINALE   (Cta.tsx + WhirlwindGallery) kept.
// TASTE: silver-on-black — headings at #c3c3c3/#f5f1e6, gold only on stops.
// BLEND: every media edge fades into #050505; sections hand over on canvas.
// ─────────────────────────────────────────────────────────────────────────────

export default function V3() {
  const root = useRef<HTMLElement>(null);

  // All ambient videos are lazy: play only in view, pause off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const vids = el.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) safePlay(v);
          else v.pause();
        }),
      { rootMargin: "20%" },
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <main ref={root} className="on-media bg-[#050505] text-[#c3c3c3]">
      <Open />
      <Credo />
      <Deck />
      <LogoWall />
      <Process />
      <Cta />
      <WhirlwindGallery />
    </main>
  );
}
