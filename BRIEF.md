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

## SECTIONS (home) — REVISED 2026-07-03 (George's voice-note round)
1. Hero: reel, "Break the ordinary." left, glass Start here. ✓
2. Trusted By: keep, but heading = BRACKETS `[ TRUSTED BY ]`, hover → solid cream block (blink effect).
3. ~~Statement "FILMS, NOT CONTENT."~~ **KILLED — George doesn't like it.** In its place between
   Trusted By and Featured: a BIG PHOTO band, nice and simple (harry-field.jpg), maybe tiny label.
4. Featured Projects: keep. Add small bracket SUBHEADING under the big heading. DISCOVER MORE bracket-link ✓.
5. OUR PROCESS = THE 1820 PATTERN: tiny label on hairline, then FOUR FULL-VIEWPORT **IMAGE**
   panels (stills from /videos/posters — NOT videos, 4 decoding videos janked the scroll),
   stage word centred at 1820 scale (NOT huge — George: font was too big), copy beneath,
   ONE pinned stage, each panel GLIDES up over the last (eased, scrub 1.2 — "smooth").
   ⚠ copy still 1820-derived — reword before launch.
6. Testimonials = FULL-BLEED CINEMA BAND (v3, complete revamp): the campaign film fills the
   screen; quote lower-LEFT types itself in on switch; attribution small (label small-caps +
   micro mono); bottom-right HUD = square marker + mono number + thin progress line per slide;
   AUTO-ADVANCES every 7s like a reel, click to jump. **NO travelling full stop — the dot-ride
   is BINNED (George: "don't understand why that's there").**
7. Defender band ("Wherever the story is." riding over image) + glass Start here.
8. FAQs: NOT a thin middle column — spread out, use the whole width. GO HEAVY with the font
   (big display questions). Nice hairlines separating each row that draw as you scroll.
   Little video on the LEFT. More interactive, 1820-aligned.
9. FINALE: tiles train in → ring SPINS AROUND the line while it TYPES ON ("Every film is a chance
   to break the ordinary.") → tiles SPREAD OUT and fill the page → HOLD there → keep scrolling and
   the FOOTER reveals LAYERED BEHIND (Stone Visuals sticky-reveal: the page lifts off the footer).
   NO spiral-off-screen (that broke it — reverted).
10. FOOTER (1820-exact, revealed layered behind the page): small wordmark top · statement left
    ("Got a story? We go where it is.") + quick links stacked right · three hairline columns
    with tiny mono labels (OUR BASE / GET IN TOUCH / SOCIALS) · © line. Only grey lives here.
11. SCROLL FEEL: Lenis lerp 0.06 (was 0.09 — George: "site doesn't scroll smoothly").
    FAQ questions clamp(1.5rem,2.8vw,2.6rem) — heavy but not shouting; number inverts to a
    filled tag on the open row.

## ROUTE TRANSITIONS — REVISED
- NO black veil ("weird black blur"). The NEW page slides UP over the current page in real time —
  you see it overlap and cover the old one. Smooth blend, 1820/stone feel.

## SITE-WIDE
- MORE bracket effects — `[ ]` grammar is the house style for labels/links.
- BLEND everything: same label grammar, same alignment logic, one motion language.

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

# ROUND 2026-07-03 (later) — CURRENT STATE
- LOADING: B&W chalk handwriting — HW writes with a SPARKLER tip, media scribbles after. Once/session.
- HERO: lens-opens from a small circle on reveal; solid white heading (bigger, lower); sub in display
  face aligned under it; [ START HERE ] no arrow. NO carets anywhere (hero + Featured).
- TESTIMONIALS+FAQS = ONE pinned morph section (TestimonialsFaqs.tsx): testimonial ledger dissolves
  in place, FAQ ledger forms out of it, rule label crossfades. MINIMAL lines (one separator per row).
  Old Testimonials.tsx/FAQs.tsx retired to the disposal bin.
- PROCESS: 1820 window mechanic (clip-path windows onto viewport-FIXED stills) + extra word drift
  + subtext + bracket CTAs per stage.
- FOOTER: solid black; showreel visible ONLY through the HUGE wordmark bottom-far-right; big email
  left; columns left; bright lines; © grey.
- ALL LINES BRIGHT WHITE site-wide. Bracket CTAs everywhere, no arrows, no glass.
- ROUTE MORPH: old page eases back + dims, new page rises through, ~0.9s.
- George may supply a Higgsfield intro video — drop at public/videos/intro.mp4 and wire into hero.
- Deploys: PREVIEW only via CLI; PROD promote must be run by George (permission-gated here).

# ROUND 2026-07-03 (evening) — LATEST
- NAV TRANSITIONS: next page RISES FROM BELOW over the frozen current page (both visible, no cuts).
- PROCESS v7: stills scroll WITH the page (no fixed frames), words follow w/ light 3D tilt drift.
- TESTIMONIALS⟶FAQS: one pinned stage, 240vh — writing out → lines retract → FAQ rows one-by-one
  (full width) → everything incl. rule fades out; LAST line stays, shrinks + drifts down = the pen.
- SNAKE: one continuous 1.5px path in the Defender band — wanders down then wraps a GENEROUS
  hand-drawn ring around "Wherever the story is." (never touches the words). No centre thread.
- LIGHT/DARK TOGGLE in nav (upright switch): light = CREAM #f5f1e6 canvas via [data-mode="light"]
  vars. Media sections stay cinema-dark; nav stays cream over media; logos invert in light
  ([data-mode="light"] .logo-mark). Finale + footer flip with the mode. --page-bg = fade-to-page
  gradients (band bottoms) so they blend to cream in light.
- About v3 = 1820 page language (still opener + sky-band + What We Do + crew). Contact/privacy on
  the reveal footer; contact Send button themed.
- OPEN: Higgsfield intro video (public/videos/intro.mp4), "creative agency" band rework (George
  will direct), hero-film ambiguity, prod promote = George.

# ROUND 2026-07-03 (night) — LOCKED CHOREOGRAPHY, DO NOT REGRESS
- FEATURED PROJECTS exit = the show-curtain drop (0.72→1) — GEORGE'S KEEPER, never remove again.
  Gap fix = Process overlaps ONLY the post-wipe tail (-mt-[40vh], z-20). Section 168vh.
- FAQ exit: rows+lines FADE (dissipate, no retraction), LAST LINE stays whole and rides with the
  page. NO vertical thread. The band below draws ONE continuous 1.5px pen line: in from the LEFT,
  across, off the RIGHT edge, U-bend outside, back in, LEFT above the words, then ANTI-CLOCKWISE
  hand-drawn loops around "Wherever the story is." (band pinned 220vh, draw 0.03→0.72).
- ALL hairlines FULL WHITE (var(--fg)) everywhere.
- ONE footer everywhere incl. /work/[slug] (FooterReveal). v1–v4 routes + Footer.tsx +
  ProjectCTA.tsx retired to the disposal bin.
- Transitions: rise-from-below over live-frame canvas clone; template.tsx black wipe REMOVED
  (it was the "two pages/black screen" bug).

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

## SEO (implemented 2026-07-04)
- Canonical domain everywhere = https://hwmedia.co.uk (single source: `SITE_URL` in src/content/site.ts) — deliberate even while on the Vercel URL; nothing to touch at launch.
- Root layout NO LONGER sets a global canonical (it was marking every page as the homepage). Every page sets its own.
- Bespoke titles/descriptions per page (30–60 char titles, 120–160 char descriptions). Sitemap includes all 13 case pages.
- JSON-LD: Organization+ProfessionalService (London, services, clients), Person (Harry, E-E-A-T), WebSite, FAQPage on home (FAQS moved to src/content/site.ts — single source with the FAQ ledger), VideoObject + BreadcrumbList on /work/[slug].
- public/llms.txt for AI answer engines. /work has an sr-only H1.
- At launch: point hwmedia.co.uk DNS at the Vercel project, then submit sitemap in Google Search Console + create a Google Business Profile (London) — the two external actions Claude can't do.
