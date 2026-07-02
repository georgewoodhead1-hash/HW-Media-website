import WhirlwindGallery from "@/components/home/WhirlwindGallery";
import ScreeningRoom from "./ScreeningRoom";
import InkStatement from "./InkStatement";
import Filmography from "./Filmography";
import CreditBeats from "./CreditBeats";
import ProcessList from "./ProcessList";

// ─────────────────────────────────────────────────────────────────────────────
// V4 — "PRODUCTION COMPANIES": Division + Iconoclast + Somesuch + 14islands.
//  1 SCREENING ROOM  Division/Iconoclast: the home opens as a cinema — an
//        auto-advancing reel with corner captions, ticking timecode, numeric
//        pagination + hairline progress; every change passes through a BLACK
//        frame and the incoming title card rises char-by-char.
//  2 STATEMENT       14islands: one giant ink-fill line, gold full stop.
//  3 FILMOGRAPHY     Iconoclast (the star): a centred TEXT INDEX — hover a
//        title and the full-viewport still crossfades behind the list while a
//        credit lockup slides into the corners; touch devices cycle slowly.
//  4 CREDITS         Somesuch: director-first beats ping-ponging with media
//        that drifts on a subtle parallax.
//  5 PROCESS         one quiet numbered line-list — hairlines draw, numbers
//        tick in.
//  6 FINALE          kept (WhirlwindGallery).
// TASTE: zero-accent chrome — #090909 + cream; ALL colour from footage; gold
// only on full stops. BLEND: one dark room; backgrounds swap behind the text.
// ─────────────────────────────────────────────────────────────────────────────

export default function V4() {
  return (
    <main className="on-media bg-[#090909] text-[#f5f1e6]">
      <ScreeningRoom />
      <InkStatement />
      <Filmography />
      <CreditBeats />
      <ProcessList />
      <WhirlwindGallery />
    </main>
  );
}
