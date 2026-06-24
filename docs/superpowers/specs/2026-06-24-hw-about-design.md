# HW Media — About page design

**Date:** 2026-06-24
**Status:** approved structure (George), pending spec review

## Goal

Rebuild the About page as a clean, light, editorial page in **Bar Studios'** register, animated with **Luke Baffait**-grade scroll motion, so the whole page reads as one linked, premium scroll — not disconnected blocks.

## Approach

Bar Studios structure + font feel, plus Luke's smooth scrubbed motion. One light surface throughout (no dark full-screen video). The five-stage section is **locked**: reverted to the hover-fill version George already approved, then left untouched.

**Why this approach:** George chose "big ABOUT, clean & editorial (Bar)" and confirmed the 4-section structure. A judge agent comparing builds against the real Bar screenshots found Bar's defining "about" beat is the giant **ABOUT** + a **row of small landscape film stills** + a small **ragged-right** intro line — that film band is the load-bearing signature.

## Page structure (top → bottom)

### 1. ABOUT hero
- Colossal `ABOUT` set in `.about-display` (Archivo expanded, the Owners Wide stand-in), light `var(--bg)` surface, vast whitespace.
- A short intro line set **ragged-right**: "HW Media is a creative media company. We make films for **brands** — on location, with the people who build them, every frame shot by the director himself." (one gold accent word: `brands`).
- Below a hairline: a **row of 3 landscape film stills** (Bar's film band), ~4:3 / 3:2 crops, that wipe open on load.
- Motion: `ABOUT` chars clip-rise on load (SplitText + `.split-line` masks); the line/labels settle after; the film band wipes open; everything drifts on a slow scrub as you leave. Buttery, never clunky.

### 2. Harry Wallis (founder)
- Bar's founder treatment. Name big with gold "Wallis." (mirrors the hero's gold `brands`). A portrait (`/images/harry-color.jpg`). Short bio: he founded HW Media, directs and shoots every frame himself, comes to the brand and films on location.
- Editorial reveal: portrait wipes open, name rises, copy settles on scrub.

### 3. Vision → Strategy → Creation → Refinement → Impact — LOCKED
- **Revert to the earlier hover-fill version** George approved ("Vision strategy creation is good now... the animation is really good"): each full-width row, on **hover/focus**, sweeps a **gold fill left → right** (`.hww-row[data-on]::before` scaleX), inverts its type to near-black, opens its description, and rotates a `+` affordance. Five stages, on a dark contrast band for separation.
- **Do not change this section again** after restoring it.

### 4. Let's create (contact close)
- Big "Let's create" headline on the **left** (`.about-display`, gold "create."). On the **right**, a framed film that **rises and shifts colour** as you scroll in (the Luke "a bubble comes up and it changes colour" feel), then settles. Smooth, scroll-driven. CTA → `/contact`.

One light surface all the way down (except the locked dark band in §3); each section reveals as you reach it so the page links together.

## Constraints (client has explicitly rejected each opposite)
- **Light editorial** surface. **No** dark full-screen background video anywhere.
- Use `.about-display` / `.about-label` / `.about-body` (Archivo). Owners Wide is Bar's real, commercial font — flag for licensing; do not block on it.
- Minimal labels — **no eyebrow-label clutter**; at most one gold accent per area.
- Copy: **"creative media company"**, films for brands, on location, every frame shot by the director. **Never "studio."**
- `gsap` + `ScrollTrigger` + `SplitText` from `@/lib/gsap`; Lenis already tuned (lerp 0.06). `prefers-reduced-motion` guards; `gsap.context()` + `ctx.revert()` cleanup on every component.
- **Next 16 + Turbopack gotcha:** after editing `globals.css` the dev server serves **stale CSS**. Restart clean (`kill :3011; rm -rf .next; next dev -p 3011`) and verify computed styles via Playwright before trusting any screenshot.

## Components
- `src/components/about/AboutHero.tsx` — ABOUT + ragged-right line + 3-still film band
- `src/components/about/Founder.tsx` — Harry
- `src/components/about/HowWeWork.tsx` — **LOCKED**: restore hover-fill version
- `src/components/about/LetsCreate.tsx` — dynamic contact
- `src/app/about/page.tsx` — compose the four
- `src/app/globals.css` — `.about-*` font helpers (exist), `.hww-row` fill, dynamic-contact bits

## Verification
- `npx tsc --noEmit` clean.
- Playwright screenshots desktop (1440) + mobile (390) of **every** section; **read** the PNGs.
- Confirm computed `.about-display` actually applies (font-family Archivo, uppercase) — not just that it looks plausible.
- No console/page errors; full scroll is smooth.

## Out of scope (later)
- Site-wide font rehaul (Owners across the whole site) + Owners licensing.
- Home page (lens intro / finale stay untouched).
