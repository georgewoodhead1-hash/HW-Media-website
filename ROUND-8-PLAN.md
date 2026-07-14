# ROUND 8 — MASTER PLAN (George, 14 Jul 2026, night)

Compiled from George's three messages after the ROUND-7 build. He said:
"compile everything I've said … into a master plan. You can go and do the
proper build after." Execute phases in order. One fix at a time, verify with
the Playwright rig, link localhost per section.

## Context

- Project: this folder. Dev: `npx next dev -p 3006` → http://localhost:3006
- Branch `rebuild`. Push dance: `gh auth switch --user georgewoodhead1-hash && git push origin rebuild; gh auth switch --user squirrelsneststay-beep`
- Loader is now ~7.8s (3D dive) — Playwright: `waitForTimeout(11000)` still fine.
- Drive Lenis with `page.mouse.wheel(0, dy)`, viewport option is `viewport`.
- ROUND-7 state (all live): OurWork pins in a 280vh `.ow-runway`; pair drops
  {0,5}→{1,4}→{3}; hera → `.ow-heroclone` → square (sqP 0.26–0.56) → grows
  full-bleed (grP 0.6–0.96); Process runway 640vh, TRAVEL_END 0.75,
  TST_IN 0.735 / TST_OUT 0.71; testimonials = real quotes (Norton/Hollie,
  Sans Matin/Willow, Ferrari/Kelly), 16:9 film; loader v10 = 3D lens dive
  (`src/components/shell/lensDive.ts`).

## Open questions for George (defaults chosen, flag if wrong)

1. **"Producing two frames"** — I read this as: during the hand-off you can
   see the hera film twice (the grown clone + the strip's frame 1 sliding
   past each other). The Phase-1 seamless fix removes the visible seam
   entirely, so this dies with it. Shout if you meant something else.
2. **About panel vs /about page** — building the monolog side panel for nav
   clicks, and KEEPING /about reachable by direct URL (SEO + deep links).
   If you want the route killed entirely, say so.
3. **Underlines** — removing the underline from the Featured Projects
   heading and Discover more only (hover keeps the gold bar). The `.blink`
   underline stays everywhere else. Say if you want it gone sitewide.

## PHASE 1 — the hand-off + testimonial fixes (msg 1)

### 1a. Hera shrink-to-square QUICKER
George: "the way it gets smaller just takes too long. Just speed that little
bit up." The grow part is great — don't touch it.
- OurWork.tsx: sqP window sm(0.26, 0.56) → sm(0.26, 0.40). Grow stays
  sm(0.6, 0.96). The gap 0.40–0.6 holds the square a beat — good.

### 1b. SEAMLESS into Our Process (no scroll seam, no second slide)
George: "I want it to start on the sans Martin film without me having to
scroll … seamless." Currently after full-bleed you scroll through the
sticky-release seam (the page 'goes down'), then the strip starts.
- OVERLAP the sections: Process section gets `md:-mt-[100vh]` (its runway
  slides up under OurWork's last 100vh) and sits BELOW OurWork in z while
  overlapped (OurWork section z must beat Process's z-[20] during the pin;
  restore stacking after — check nav/footer z's).
- Process runway 640 → 740vh; drive mapping gets a dead zone: p' =
  max(0, (p − 0.135) / 0.865), use p' for travel + TST thresholds.
- At OurWork exit p ≥ 0.995: clone snaps autoAlpha 0 → beneath it is the
  ALREADY-PINNED Process frame 1, same film, frame-synced (sync already
  in) with "Pre-production" already built (its `first` trigger will have
  fired under cover). Result: zero seam, no extra scroll, no second frame.
- Scrolling back up must reverse cleanly (clone back at p < 0.995).

### 1c. Testimonial 1/2/3 clicks must not jump the layout
Film + numerals stay EXACTLY put; only the quote may reflow.
- Give the blockquote a fixed min-height that fits the longest quote
  (≈5 lines: `min-h-[13rem]` at md, tune by measure), so the numerals row
  never moves and the grid column height is constant (film stays put).
- Verify: click 1→2→3, screenshot each, diff the film rect + numeral rect.

## PHASE 2 — scroll smoothing sitewide (msg 2, "the MAIN thing")

George: section-to-section scroll does "this really horrible thing where it
doesn't scroll, suddenly goes quite quickly, clunky". Reference feel:
https://bymonolog.com/ . He LIKES the frame freezes themselves.
- Audit every pin boundary (hero→Featured, Featured→Process, Process
  release→FAQs, FAQs→band, band→footer) with a constant-wheel capture and
  look for velocity spikes/hitches.
- Suspects: the hera clone animates left/top/width/height (layout per
  frame — convert to transform-based scale on a 100vw×100vh box if it
  shows up in traces); Lenis lerp 0.06 + wheelMultiplier 0.55 vs monolog's
  directness; any scrub:number smoothing fighting Lenis.
- Fix until a continuous wheel ride feels one-speed except the designed
  freezes. Don't slow the scroll down (0.3-0.35 was "way too slow").

## PHASE 3 — small visual fixes (msg 2)

### 3a. TrustedBy
- "TRUSTED BY" → BIGGER + ALL CAPS.
- The bottom line draws too late/slow on scroll — earlier trigger + quicker draw.
### 3b. Featured Projects heading
- Underline (`.ow-underline`) REMOVED at rest. On heading hover → the gold
  bar treatment (the `.blink` hover fill grammar). Heading is not a link —
  hover-only visual.
### 3c. Discover more
- Remove its underline, keep the hover box; make it BIGGER (a step up).
### 3d. Featured tile logos
- All 6 tiles get correct brand logos, BIGGER: McLaren ✓, Nike ✓,
  Salomon ✓, Castle Air = castle-air-white.png, Sans Matin (hera) =
  sm-new-logo-design-white-2025.png, Otoko = ??? (check /public/logos for
  an Otoko file; if none, keep wordmark but bigger).
### 3e. Font audit ("do a font order")
- Sweep: every heading = Inter Display 450 sentence case, UI = Suisse
  Medium, body = Suisse Book, labels = Geist Mono. Fix strays.

## PHASE 4 — "What we do" moves to the HOME page

- KILL the diagonal image band (the "triangle" section below testimonials,
  between Testimonials and FAQs).
- Put the About "What we do" content there (editing, grade, AI imagery,
  etc.) with a proper animation — find a cool treatment that fits the
  house grammar (char-wave, drawn lines, live film tiles). This puts all
  services on the home page.
- About page keeps its own copy of nothing — the section MOVES.

## PHASE 5 — About becomes a MONOLOG-style side panel

Reference: https://bymonolog.com/ (their About). Clicking About in the nav:
- NO route change. The current page fades, blurs and darkens; the About
  content slides in as a panel on the RIGHT side of the screen.
- Content (portfolio-flavoured, short): Harry Wallis — who he is, why he
  started HW Media, the mission, what he offers. Plain copy, no pitch.
- Esc / click-outside / X closes it, page un-blurs.
- Keep /about reachable by URL (renders the same content full-page) unless
  George says kill it.
- Scrape bymonolog.com first for the exact feel (timings, widths, blur).

## PHASE 6 — the agent design audit

Once phases 1–5 land: run a team of independent review agents over the
whole site (visual polish, motion, consistency, mobile, copy) — same
pattern as the 14 Jul review round — compile findings, fix the real ones.

## Verification (every phase)

- Full wheel ride down AND back up, frame captures at each boundary.
- `npx tsc --noEmit` clean; light-mode sweep still all-flip.
- Commit per phase, push (auth dance), localhost link per section.

## Parked / waiting on George

- 2 more real testimonials (5 total planned) — slugs TBD when they arrive.
- Vercel prod deploy of everything since 12 Jul — needs George's explicit go.
- Loader length vs SEO question; Harry's copy sign-offs; raw NatWest/Meta
  footage; /work tile-label system.
