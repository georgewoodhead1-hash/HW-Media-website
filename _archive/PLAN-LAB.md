# HW Media — LAB PLAN (v9, localhost:3004)

The playground. Stable site stays untouched on :3003 (tag v8-stable).
Rule: experiments land here first; George promotes winners to normal.

## R1 — The whirlwind gallery  ★ BUILD FIRST
Replica of lukebaffait.fr "Gallery" mechanic, ours: ~10 SMALL video tiles
(micro loops, w-36/44 max) fly in from the edges, orbit the screen centre in
a whirlwind while the centre line reads:
  "Every film is a chance to break the ordinary."
Then the orbit releases and the tiles span out to a loose resting grid.
Pinned ~320vh, fully reversible scrub. GSAP only (already installed; all
plugins free since 3.13 — nothing to download).

## R2 — Meet the team (homepage section)
Dynamic crew moment on the main page: Harry / Glen / Will cards that deal
out like a hand of contact sheets, red-pen roles, hover grades them in.
Slot: after SC.05 ledger, before footer. Placeholder photos until Harry.

## R3 — The Luke footer
Giant HW MEDIA wordmark filling the footer with an interactive element:
letters react to cursor (magnetic chars / spotlight fill), reel sliver
peeking through the counters. Keep contact row + marquee above it.

## R4 — Longer + more spread out
Site-wide: bump seam rhythm 160px → 224px (pt-56), slower stagger reveals,
one extra breathing band (full-bleed still + one line) between SC.02 → SC.03.

## R5 — Free play (in order of likely payoff)
- Film-burn / light-leak transition when sections hand over
- Cursor trail: tiny frames trail the cursor over the films grid
- Draggable gallery (Observer plugin) after the whirlwind settles
- Ambient sound toggle (projector hum) bottom-right, off by default
- Grain intensity reacts to scroll velocity

## Status
- [x] R1 whirlwind — built (WhirlwindGallery.tsx, after the ledger)
- [x] R2 team section
- [x] R3 Luke footer
- [x] R4 spread pass
- [ ] R5 experiments

## R6 — THE SINEK RESTRUCTURE (George, 2026-06-10 — build next)
New homepage order (start with why):
1. Hero — BREAK THE ORDINARY (keep)
2. OUR MISSION (rename Who-we-are; bar = "Our mission"; statement stays
   "A creative agency for brands that refuse to be ordinary.")
3. Selected films (proof)
4. What we do — SMALLER, all five services on ONE SCREEN as full-width
   rows (no pin, no slides; the option-B layout)
5. How a film gets made (keep — he loves it; keep Make-it-last breaker)
6. Meet Harry + the team (interactive)
7. BRANDS WE FILM FOR — bigger, prominent + NEW TESTIMONIALS section
8. Whirlwind finale ("Every film is a chance to break the ordinary.")
9. Footer (giant wordmark)
DELETE: the ledger ("agency built like a crew / no middlemen" section).

## R7 — Whirlwind 3D loop (replace current orbit)
Tiles enter from BOTTOM-LEFT like a snake (staggered along one path, not
all at once) → spiral up toward top-right → curve INTO the screen (scale
down, dim = behind) → come forward around the word to MIDDLE-LEFT (scale
up over the text) → exit BOTTOM-RIGHT. One continuous 3D loop path:
implement as progress-offset tiles on a shared path (x/y waypoints +
scale 1→0.5→1.1 + opacity/blur for depth + z-index flip behind the word).

- [x] R6 Sinek restructure — built
- [x] R7 3D loop whirlwind — built

## R8 — CLIENT MEETING PLAN (Harry, 2026-06-10, Granola 9f880717)
New homepage order (agreed with client):
 1. Hero with animated intro (keep)
 2. Mission — swap placeholder imagery for BTS photos (Drive folder coming)
 3. "Trusted by" LOGO WALL (replaces journey index) — continuous loop,
    edge fades, mono→colour on hover (Epic Ocean treatment)
 4. Selected films — CONDENSED teaser: vinyl-stack / 3D depth picker
    (one film fills most of the screen, neighbours visible; Outer Studios
    horizontal × Conceptual Works reveals). Full gallery page = flush 3x3.
 5. "Our process" (rename How-a-film-gets-made; keep scroll timeline)
 6. Testimonials
 7. Footer CTA (the finale — built)
CUT: "What we do" + "Brands we film for" sections.
REPLACE: Meet the crew → "About" (just Harry for now).
ADD: persistent fixed CTA button throughout scroll (Jesko style);
 stats counters (years/projects/retention) count-up; FAQ section (AI
 search); blog/about for SEO; contact page transition (Outer Studios).
MOBILE-FIRST optimisation (discovery on phone, conversion on laptop);
 simplify animations on mobile; contact always reachable.
FONT: Harry revisiting heading font — font kit incoming, swap when sent
 (avoid Neue Haas Grotesk). Dark mode preferred. Text sizes UP overall.
WAITING ON HARRY: Drive folder (portrait+landscape clips, BTS photos),
 font kit. DEADLINE: hosted on Vercel for review END OF THIS WEEK.

## R8 STATUS — built 2026-06-10 evening
- [x] New order: hero → mission → trusted-by → films (vinyl crate) → our
      process (Ponder mechanic, slow) → breaker → testimonials → about →
      finale w/ page lock + slim rising footer
- [x] Cut: what-we-do, brands wall, meet-the-crew (→ About, Harry only),
      old footer (headline, giant wordmark, marquee)
- [x] Trusted-by logo wall: looping rows, edge fades, colour on hover
- [x] Persistent CTA (hides at finale) + right-edge scroll progress bar
- [x] Stats count-up in About; /work = flush 3x3 grid
- [x] Finale: 14 tiles, under-first entry, ~1 loop then fire-off,
      condensed scatter, Start-here, footer rises, options pill gone
- [ ] WAITING ON HARRY: BTS photos (mission imagery), portrait/landscape
      clips, font kit, real testimonial quotes, logo files
- [ ] NEXT: Vercel deploy for end-of-week review; FAQ section; blog/SEO;
      mobile simplification pass; contact page transition
