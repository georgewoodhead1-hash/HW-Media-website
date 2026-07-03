# HW MEDIA — THE BRIEF (single source of truth, 2026-07-03)
Every rule George has set. Nothing ships that violates these.

## TYPE (the 1820 kit, exactly)
- BIG display: Suisse Intl Condensed SemiBold 600, uppercase, tight (-0.015em). ✓ right
- SMALL/UI (nav, links, buttons, meta): **Suisse Intl Medium — REGULAR WIDTH, NOT condensed**,
  uppercase, near-zero tracking (~-0.01em, like 1820's -0.125px). ← was wrong (condensed + wide tracking)
- Micro-labels (tiny technical only): Geist Mono.
- Body: Suisse Intl Book.
- Small links wear the 1820 bracket treatment: `[ TEXT ]` → hover = solid cream block, black text, underline.

## COLOUR
- Canvas near-black; type CREAM/WHITE — **text is NEVER grey at rest**. The ONLY grey allowed:
  tiny footer-grade meta (address / socials / copyright).
- Scroll write-on effects may dim DURING animation but must start high (≥0.45) and resolve to full white fast.
- ZERO gold accents. Gold lives in the logo PNG only.
- All colour comes from footage.

## LAYOUT
- CENTRE the compositions. Stop left-aligning statements, quotes, section content. (Hero "Break the
  ordinary." stays LEFT — George's explicit exception.)
- Huge or tiny type, nothing mid. Generous air.
- Trusted By: BIG (heading + logos were too small).

## SECTIONS (home)
1. Hero: reel, "Break the ordinary." left, glass Start here. ✓
2. Trusted By: keep concept, bigger everything.
3. Statement "FILMS, NOT CONTENT." — centred, bright, fill starts ≥0.45.
4. Featured Projects: keep. DISCOVER MORE as bracket-link.
5. OUR PROCESS (1820 copy): centred statement stack (We listen./We craft./We deliver. + subtexts,
   sign-off pair) → 01 PRE-PRODUCTION / 02 PRODUCTION / 03 EDIT / 04 DELIVER rows with images.
   ⚠ placeholder copy from 1820 — reword before launch. White text throughout.
6. Testimonials: CENTRED composition (heading, quote, attribution, dots centred; film centred below).
   Keep the dot-ride landing into the dots. Cream dot.
7. Defender band ("Wherever the story is." riding over image) + glass Start here.
8. FAQs: centred header, full-width bright rows, no side column.
9. FINALE: FAQs lift like a stage curtain revealing the stage. Tiles train in, ring, scatter for a
   beat, LOOP BACK into the spinning ring, then **spiral OFF SCREEN while looping**; THEN the
   heading types + "Start here" + footer rise from underneath. Slim footer = the only place grey meta is allowed.

## MOTION
- Route changes: dark veil sweep (no gold line). ✓
- Plus-hairlines: draw centre-out, plusses spin slowly forever, labels track in.
- Every section enters with choreography; one hover language.
- Lenis at direct feel (0.09 / 0.9).

## HARD BANS
italic serif · mid-size headings · grey resting text · gold accents · tiny caption clutter ·
left-aligned statement dumps · template sections (stats rows, logo soup) · "one guy with a camera" voice.

## PRE-LAUNCH LIST
Reword 1820 placeholder copy · licence Suisse Intl · Harry's lens loading video (preview first) ·
RESEND_API_KEY + CONTACT_FROM in Vercel · deploy only to hw-media-website-5pbo on explicit go.

---

# HANDOVER — READ FIRST IN THE NEXT CHAT (written 2026-07-03, end of session)

## WHERE THINGS STAND — HONESTLY
George's last words this session: the current home page state looks WRONG on his screen
("hallucinating"). My automated checks passed (0 errors, fonts computed, 0 grey) but automated ≠
what he sees. **DO NOT TRUST the current state. First action next session = load localhost:3005
in a real look-and-fix pass, section by section, against THIS brief — before building anything.**

## SUSPECT LIST (most likely sources of the "wtf")
1. Testimonials recompose (this session): centred stack + film below — the quote write-on may sit
   half-grey mid-viewport; the layout change was never eyeballed at every scroll position.
2. FAQ restructure: side reel removed; entrance/pin leftovers may misbehave.
3. Finale retimings (spiral-off + curtain, q-remap): several stacked scroll-math changes — the
   curtain overlap (-100vh) + retimed type/CTA/foot need a real-scroll check.
4. Process (1820 copy): statements centred but rows left-grid — may read disjointed.
5. Stale-CSS gotcha: EVERY globals.css edit needs `rm -rf .next` + restart or George sees old styles.

## THE SITE (main /, branch rebuild, dev :3005)
Flow: LensIntro → TrustedBy → Statement (FILMS, NOT CONTENT.) → OurWork (Featured) →
EditorFCP (1820 process: statements + 01–04 rows w/ images) → Testimonials (centred, dot-ride) →
FeatureBand (Defender, "Wherever the story is." riding over) → FAQs (centred, full-width) →
WhirlwindGallery finale (curtain reveal; tiles spiral off; heading+footer rise).

## RESTORE POINTS (git tags, all local)
- `pre-1820-assembly` — before font-kit/process/curtain round
- `bin-checkpoint-2026-07-03` — before the big cleanup
- `bookmark-2026-07-02-pre-rehaul` — the pre-rehaul site
- Variants /v1–/v4 (deep-built, verified) — component dirs src/components/v1..v4 — mine for pieces.

## HARD CONSTRAINTS (unchanged)
- NO GitHub push, NO Vercel deploy without explicit fresh go-ahead (prod = hw-media-website-5pbo).
- NEVER touch Sites/HW Media (the live old site).
- Disposal bin (never delete): "/Users/georgewoodhead/Web Dev AIOS/_DISPOSAL BIN/".
- 1820 placeholder copy in process MUST be reworded before launch; Suisse licences before launch.

## GEORGE'S WORKING STYLE (hard-learned)
- Verify on the RENDERED page; screenshots at multiple scroll points; never claim without looking.
- He reviews on his own browser — after CSS changes, tell him to hard-refresh AND restart server first.
- When he says a font is wrong: check WIDTH and TRACKING, not just family.
- Short answers. No progress spam. Build → verify → show one link.
