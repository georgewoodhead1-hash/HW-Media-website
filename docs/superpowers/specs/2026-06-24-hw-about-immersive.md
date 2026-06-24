# HW Media — About page, immersive rebuild (APPROVED)

**Date:** 2026-06-24 · **Status:** approved by George, executing

## Direction (confirmed via Q&A)
Brand-new About page (start fresh). North star = **Luke Baffait (dark cinematic WebGL) blended with Floema/Trionn (playful 3D toy + physics)**. **Full immersive rebuild.** About is the template; roll out to Home/Work/Contact after. Build **the contact circle early** as proof of matching a reference exactly.

## Architecture (the foundation that fixes everything)
- **ONE persistent R3F `<Canvas>`** fixed full-viewport behind all DOM (`SceneCanvas`). NOT one canvas per scene. This is what makes it one continuous world AND fixes the CPU (one render loop, viewport-gated, `frameloop` paused when the tab/section is hidden).
- **Master scroll timeline**: a single source of scroll progress (Lenis, already global) drives a `World` that moves a camera through depth and cross-dissolves scene "stages" on the one canvas. No hard section edges.
- **Heavy weighted smooth scroll**: Lenis (global) tuned ~0.08, dropped to ~0.045 in pinned/hero moments.
- **Custom cursor**: lerp-trailing, morphs on hover (Luke/Trionn). George flagged it before; it is IN because he chose that blend. Removable.
- Use the FULL GSAP set (ScrollTrigger, SplitText, ScrollSmoother, Observer, Flip, **InertiaPlugin** for the throw/blast physics) — all free on 3.15. Three.js shaders. postprocessing (cinematic, performance-gated, verified before shipping).

## The journey (DOM text floats over the one canvas; everything scrubbed to scroll)
1. **Intro lock** → "HW MEDIA" assembles → releases. (Flagged before; core DNA; removable.)
2. **Hero** — monumental "HW MEDIA" over a live **mouse-reactive shader** (dark + gold, Luke-style, constant motion).
3. **Harry** — name huge, framed portrait **warps under the cursor**, text floating in front at depth. NEEDS real Harry photo.
4. **The work = the toy** — films as a 3D field you **fling/blast** (InertiaPlugin + pointer impulse); flick one → it swaps to playing footage. A pinned camera move through them.
5. **Method** — page **pins**; one 3D film rotates + crossfades through Vision→Strategy→Creation→Refinement→Impact; stages big on the LEFT.
6. **Contact** — **the circle**: a circle grows to take over the whole page, flips to light, contact inside. Not a corner bubble.
7. **Footer** — monumental "HW MEDIA" stamp.

## Copy
Bar/Auteur register, real sentences, no labels/eyebrows, no em dashes, "creative media company" never "studio".

## Constraints (hard, learned)
- Dark immersive. No full-screen background *video*. Only build what's specced; no unrequested additions.
- Verify EVERY change with a screenshot/measurement before claiming done. Performance gated (no CPU cook): one canvas, `frameloop` off when not visible, dpr capped.
- Turbopack stale-CSS: after globals.css edits, restart clean + verify computed styles.
- WebGL screenshots need Playwright swiftshader flags.

## Build order (foundation-first; show each piece)
1. **Foundation:** `SceneCanvas` (one canvas) + `World` + `CustomCursor` + fresh `AboutExperience` + the mouse-reactive **hero** scene. Verify renders, smooth scroll, cursor, shader reacts, perf OK.
2. **Contact circle** (proof of exact reference match).
3. Harry scene (portrait warp). 4. The work toy (physics). 5. Method pin. 6. Footer + intro + postprocessing polish.

## Blocked on George
Real Harry photo; real email + social URLs.

## Out of scope (later)
Home/Work/Contact pages (roll the template out after About is signed off).
