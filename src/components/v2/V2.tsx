"use client";

import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import ChapterRail from "./ChapterRail";
import Wordmark from "./Wordmark";
import HeroFrame from "./HeroFrame";
import StatementBeat from "./StatementBeat";
import Rushes from "./Rushes";
import ProcessRows from "./ProcessRows";
import CtaFade from "./CtaFade";

// ─────────────────────────────────────────────────────────────────────────────
// V2 — "REFERENCES": Auteur + Luke Baffait + Noxediem + Bennett&Clive, blended.
//  RAIL       Luke's fixed chapter rail: gold progress fill, named chapters
//             with live counter + active tick.                → ChapterRail
//  WORDMARK   B&C: HW / MEDIA split and pinned to the viewport edges,
//             blend-difference so it survives any footage.    → Wordmark
//  1 REEL     Auteur: the reel mounted inside a cream frame that DRAWS itself
//             on load; camera chrome blinks awake; the client roster (B&C)
//             cycles over the footage with a masked rise.     → HeroFrame
//  2 STATEMENT Noxediem hairline + trusted-by roll + Luke ghost words that
//             resolve to cream on scroll.                     → StatementBeat
//  3 WORK     Noxediem: sticky stacked full-bleed rushes under viewfinder
//             chrome — ticking 24fps timecodes, masked title rises, hover
//             PLAY, director-first credits.                   → Rushes
//  4 PROCESS  Luke: ghost rows that brighten at centre, hairlines drawing
//             per row.                                        → ProcessRows
//  5 CTA      footage fades into the canvas (Noxediem stitch) → CtaFade
//  6 FINALE   WhirlwindGallery, untouched.
// BLEND: one #0a0a09 canvas; media always fades into the canvas, never a hard
// cut; gold only on the rail fill, full stops and tiny instrument accents.
// ─────────────────────────────────────────────────────────────────────────────

export default function V2() {
  return (
    <main data-v2-root className="on-media relative bg-[#0a0a09] text-[#f5f1e6]">
      {/* keyframes local to V2 (globals.css is off-limits) */}
      <style>{`
        @keyframes v2RecBlink { 0%, 58% { opacity: 1; } 62%, 88% { opacity: 0.25; } 92%, 100% { opacity: 1; } }
        .v2-recdot { animation: v2RecBlink 1.6s steps(1) infinite; }
        @keyframes v2Cue { 0% { transform: scaleY(0); transform-origin: top; } 45% { transform: scaleY(1); transform-origin: top; } 55% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
        .v2-cueline { animation: v2Cue 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .v2-recdot, .v2-cueline { animation: none; }
        }
      `}</style>

      <Wordmark />
      <ChapterRail />
      <HeroFrame />
      <StatementBeat />
      <Rushes />
      <ProcessRows />
      <CtaFade />
      <WhirlwindGallery />
    </main>
  );
}
