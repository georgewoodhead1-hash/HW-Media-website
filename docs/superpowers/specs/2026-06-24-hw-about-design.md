# HW Media — About page design (v2)

**Date:** 2026-06-24
**Status:** revised after George's review — stripped all subtext labels, made it genuinely dynamic

## Goal

Rebuild the About page so it feels like a $10k Bar Studios / Luke Baffait build: clean, light, editorial, and **alive** — continuous scroll-linked motion the whole way down, not static blocks that fade in.

## TWO HARD RULES (these are why the last attempts failed)

1. **NO LABELS. NO SUBTEXT. NO EYEBROWS. NO CAPTIONS.** Zero small descriptive tags anywhere — no "Films for brands", "London", "The person behind it", "Let's talk", "Founder · Director", "How we operate", "on location", "every frame", "in-house". Only big type, real sentences, media, and motion. If it's small grey supporting text floating next to something, delete it.
2. **EVERYTHING MOVES.** No section is a static block. Type and media parallax at different speeds; reveals are scrubbed to scroll; there is a continuously-moving element (the film band). The page should feel animated whether you scroll or not.

## Approach

Bar Studios structure + font feel + Luke's constant scrubbed motion. One light surface (except the locked dark band in §3). Lenis is already tuned (lerp 0.06).

## Dynamism (the motion system — applies to every section)

- **Continuous motion:** a horizontal **film band** in the hero auto-slides and reacts to scroll velocity (speeds up / changes direction with the wheel), the way Bar's name/film band and Luke's marquees do. It never stops.
- **Parallax depth:** in every section, the heading, the body, and the media move at *different* scroll speeds (scrubbed `yPercent`), so there's real depth, not a flat fade-in.
- **Scrubbed reveals:** headings clip-rise (`SplitText` + `.split-line` masks); media wipes open via `clipPath`; all tied to scroll position (`scrub`), eased `none`.
- **Cursor:** the existing `Cursor` component grows / labels on interactive media + the CTA (magnetic feel), so hovering feels alive without being the *trigger* for the page's animation.
- **Smoothness:** Lenis lerp 0.06; `gsap.ticker` bridge; no abrupt stops.

## Page structure (top → bottom)

### 1. ABOUT hero
- Colossal `ABOUT` (`.about-display`), light surface, vast space. Chars clip-rise on load, then the whole word parallaxes up slowly as you scroll past.
- **One** real intro sentence, large, NOT a label: *"HW Media is a creative media company making films for the brands behind them."* (No trailing fragment tags. No gold-word gimmick unless it earns it.)
- A **continuously sliding film band** of the work (the brand films, playing video, landscape crops) — Bar's signature dynamic element. Auto-scroll + scroll-velocity reactive. This replaces the static 3-still row.

### 2. Harry Wallis (founder)
- Name set big. A portrait that **parallaxes** against the text (moves slower than the copy) and wipes open on entry. Two real sentences of bio (he founded it, directs and shoots every film himself) — **no role label, no eyebrow.**

### 3. Vision → Strategy → Creation → Refinement → Impact — LOCKED
- **Revert to the earlier hover-fill version** George approved: each row, on hover/focus, sweeps a **gold fill left → right**, inverts its type, opens its description, rotates a `+`. Dark contrast band. **Do not change after restoring.**

### 4. Let's create (contact close)
- Big "Let's create" on the **left**. On the right, a framed film that **rises and shifts colour** on scroll (Luke's "a bubble comes up and changes colour"), then settles. CTA → `/contact` as a **magnetic** button. **No "Let's talk" label.**

## Constraints
- Light editorial surface; **no** dark full-screen background video.
- `.about-display` / `.about-body` (Archivo; Owners Wide is Bar's real commercial font — flag for licensing).
- Copy: **"creative media company"**, films for brands. **Never "studio."** Real sentences only — no fragment tags.
- `gsap` + `ScrollTrigger` + `SplitText` from `@/lib/gsap`; `prefers-reduced-motion` guards; `gsap.context()` + `ctx.revert()` cleanup.
- **Turbopack gotcha:** after editing `globals.css`, restart clean (`kill :3011; rm -rf .next; next dev -p 3011`) and verify computed styles via Playwright before trusting screenshots.

## Components
- `AboutHero.tsx` — ABOUT + one sentence + sliding film band
- `Founder.tsx` — Harry, parallax portrait, no labels
- `HowWeWork.tsx` — **LOCKED**: restore hover-fill version
- `LetsCreate.tsx` — dynamic contact, magnetic CTA
- `about/page.tsx`, `globals.css`

## Verification
- `tsc` clean; Playwright desktop + mobile screenshots of every section, **read** them.
- Grep the About components for stray `.about-label` / eyebrow text — there should be **none**.
- Confirm `.about-display` actually applies (computed font Archivo, uppercase). No console errors. Smooth scroll.

## Out of scope (later)
- Site-wide font rehaul + Owners licensing. Home page.
