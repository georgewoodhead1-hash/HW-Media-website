# HW Media — About page, COMPLETE CREATIVE FREEDOM (autonomous 2-hour build)

George handed full creative control of the About page and stepped away for ~2 hours. No questions, no updates. Build an **unbelievably high-end, original** About page. Can be as long as needed. Then leave a to-do list of what was done + the thinking, for self-learning.

## THE ONLY HARD RULES (everything else is free)
1. **Fonts:** ONE family — Bar Studios' Owners Wide, stood in by **Archivo expanded** via `.about-display` / `.about-body`. The italic-serif accent face (`.font-accent`) and cursive (`.font-hand`) are **BANNED** (neutralised in globals.css). Never author them.
2. **Colours:** dark `#050505` base, cream `#f5f1e6` fg, gold `#bfaa53` accent.
3. **NO big films (NEW BIG RULE):** get rid of all the big/landscape film videos. Use **IMAGES (stills/posters)** instead for now. The ONLY place film is allowed is **VERTICAL (9:16) format**, used sparingly. No full-bleed horizontal autoplay video anywhere.

## THE KEY LEARNING (why every prior attempt failed)
George: *"The Let's Create you created from NOTHING, which is why it's good. The rest you're trying to fix a broken record — copying the same layout every time."* The fix is **invent original moments**, do NOT reproduce the reference sites' layouts. The five reference sites (Luke, Bar, Auteur, Floema, Trionn) are the **QUALITY BAR**, not templates. Originality is the whole point.

Also banned by experience: a **mouse-following gradient glow** (he hates it), a **draggable film "toy"** (horrendous), **clunky sticky-pin** scenes, **stacked editorial blocks**, micro-labels/eyebrows, em dashes, the word "studio".

## NORTH STAR
Luke (dark cinematic, scrubbed, shader) blended with Floema/Trionn (playful, 3D, physics) — but ORIGINAL, not copied. Everything **smooth** (the expanding contact circle is the bar for smoothness). About the **business (HW Media)** and **Harry** (the one director who shoots every film).

## ORIGINAL MOMENT IDEAS (invent, don't copy)
- **Films inside the name:** the colossal "HW MEDIA" wordmark with the brand films PLAYING inside the letters (SVG knockout mask over a video). The company is literally made of its work. (Project already used a "motto-knock" knockout in LensIntro — proven technique.)
- **The expanding circle as a recurring MOTIF:** reuse the loved circle as scene-to-scene transitions (a circle wipes to reveal the next dark scene), not only the contact. George explicitly suggested "let's create can go away again and go into the next section."
- **Harry as one continuous cinematic sequence** (the one director), smooth scrubbed.
- **Kinetic brand cascade** (McLaren, Aston Martin, Nike, Salomon, Defender) — smooth typographic motion, not a static logo wall.
- Everything scrubbed to scroll, buttery, monumental type bleeding off-canvas, generous black space.

## TECH (use all of it, performance-safe)
GSAP 3.15 — FULL free plugin set (ScrollTrigger, SplitText, ScrollSmoother, Observer, Flip, DrawSVG, MorphSVG, MotionPath, InertiaPlugin). Lenis (global). Three.js / R3F / drei / postprocessing INSTALLED and proven — but only where it genuinely elevates (NO gradient glow). Next 16 + Turbopack: `"use client"`, and after globals.css edits the dev server serves STALE CSS → restart clean (`lsof -ti:3011|xargs kill -9; rm -rf .next; npx next dev -p 3011`) and verify computed styles. WebGL canvases must be perf-gated (`frameloop` off when off-screen, dpr capped) — the page must NEVER cook the CPU. Verify every scene with Playwright screenshots (WebGL needs swiftshader flags) and READ them.

## CURRENT STATE (start of this build)
`src/components/about/`: AboutExperience (composes), AboutIntro (loader), CustomCursor (keep — trailing gold cursor), Business, Harry, Method, ContactCircle (the loved expanding circle — KEEP/repurpose), AboutFooter. The dark+gold + Archivo + ContactCircle are the keepers. Everything else is open to reinvention.

## TO-DO / THINKING LOG (append as I go, for George's self-learning)
- Removed the mouse-gradient WebGL plasma + the draggable film toy (both hated). Deleted `world/` + `webgl/`.
- Banned the accent/cursive fonts site-wide (CSS neutralised + memory rule).
- Decision: go content-first (business + Harry) with ORIGINAL high-end smooth moments, keep the expanding circle as a recurring motif. Build via an ideate->direct->build->verify workflow to break the "broken record" pattern, then integrate + polish solo.
