# DESIGN.md — HW Media

## Color

- `--black: #050505` page base (dark sections), `--black-2: #0a0a0a` raised surfaces
- `--cream: #f9f6e4` light sections (never pure white), `--ink: #171717` text on cream
- `--paper-text: #f5f1e6` text on black
- `--gold: #bfaa53` accent: emphasis words, active states, lens glass. ≤10% of any viewport.
- `--red: #c62222` ONLY: handwriting annotations + REC dot
- Alpha tints `--tint-w/--tint-b` (10%) for buttons/glass over video
- Strategy: Restrained on UI; the footage is the committed colour layer.

## Typography

- Display: Archivo Variable wdth 125 wght 900 uppercase (stand-in for Monument Extended), letter-spacing -0.03em, line-height 0.82–0.92
- Display scale (post-feedback, editorial restraint): xl clamp(44px–96px), lg clamp(36px–64px), md clamp(28px–44px). Nothing above ~96px.
- Accent serif: Instrument Serif Italic for 1–2 emphasis words inside display lines + pull quotes
- Body: Hanken Grotesk 400/600 (stand-in for Sofia Pro), 16–18px, max 70ch
- Labels: IBM Plex Mono 400/500, 10–11px, uppercase, tracking 0.18em — timecodes, [01] indices, section labels
- Handwriting: Caveat 600 (stand-in for Harry's hand), red only, annotations only

## Surfaces & elevation

- Flat black with grain overlay (7% opacity, steps(6) jitter) on dark sections only
- Rounded media frames: rounded-lg / rounded-xl on videos and stills (Wolverine inset-frame look)
- Hairlines: `--hairline-dark` rgba(245,241,230,.14), `--hairline-light` #d8d2bd
- Glass only on pill buttons over video (backdrop-blur-sm + tint)

## Motion

- Lenis smooth scroll (1.2 duration, expo easing) + GSAP ScrollTrigger
- Duration tokens: .2/.4/.6/.8/1s; ease `--ease-expo` cubic-bezier(.19,1,.22,1); all 0s under reduced-motion
- Patterns: char/line rises inside overflow clips (after fonts.ready), scrubbed pins (lens intro), theme flips at section boundaries (nav re-themes), hover loops, marquee crawl
- Never animate layout properties; transform/opacity only (accordion flex-grow is the one sanctioned exception)

## Components

- Nav: fixed, mix-blend-free, themed by html[data-nav]; MENU button opens dark fullscreen overlay with per-link film previews
- Section contract: every <section> carries data-theme="dark"|"light"
- Buttons: mono-label pills, tint bg, hover invert to cream
- Media: native <video> muted/loop/playsinline, poster fallback, preload="none" below fold

## Deck canon (v4) — Chasing The Salt treatment

The Norton pitch deck (`Clients/hw-media/assets/HWM Chasing The Salt Creative Deck Final.pdf`)
is the design reference of record. Client-approved cues, applied site-wide:

- Readable body copy is the workhorse; one display moment per section, then paragraphs
- `.bar-label`: text in a solid ink/cream highlight bar (deck's black label bars)
- `.note-rule`: text blocks end with a short heavy rule
- `.ghost-outline` / `.ghost-outline-ink`: outline display type (deck's "FOR THOSE WHO DARE" marquee), used once full-bleed + as rail numerals
- Red Caveat annotations over B&W photos = the deck's red-pen contact-sheet markup
- Production stats told with real numbers ("3 shoot days · 6 locations · crew of 2")
- The scroll is a numbered journey (SC.01–05) with a contents strip (deck p4 index)
- Real client wall (deck p3): McLaren, Aston Martin, Ferrari, Nike, Spotify, NatWest, Defender, Airbus, Abbey Road Studios, England Rugby, etc.
- Thesis line, verbatim from the deck: "The strongest brands are built on great stories."
