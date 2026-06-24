# HW Media — CONTINUE-HERE brief (post-/compact)

Read this first. It is self-contained. Execute the **Remaining tasks** in order.

## Project / environment
- Path: `/Users/georgewoodhead/Web Dev AIOS/Sites/HW Media Rebuild` (Next.js 16 App Router, Tailwind v4, GSAP 3.15, Lenis 1.3).
- Dev server **already running** at http://localhost:3011 — do NOT restart it / kill the port / `rm -rf .next`. HMR applies edits.
- Branch `rebuild`. HEAD currently `2ec8383`. Deployed to Vercel (`hw-media-website-y7yi`) on `main` at `3b02f58`.
- Verify with Playwright (chromium installed): write node ESM scripts in `_audit/`, screenshot localhost:3011, then **Read the PNGs**. Measure objectively (opacity, sizes, colours) AND look.

## HARD RULES (hard-won — do not break)
1. **Verify every change with a screenshot before claiming done.** Never say "fixed" without visual proof. George has caught false claims repeatedly.
2. **One change at a time, commit each** (concise message). tsc clean (`npx tsc --noEmit`) + screenshot + no regression before moving on.
3. **NEVER touch** the lens intro dive/camera animation (`src/components/home/LensIntro.tsx`) or the finale (`src/components/home/WhirlwindGallery.tsx`).
4. **Keep** the colour scheme (light default; dark contrast bands on Trusted By + Testimonials via `data-surface="band"`) and the fonts. **Never add CSS filters** (saturate/contrast/grayscale) to videos.
5. **No unrequested creative additions.** Earlier "luke experiments" (giant type bumps, a corner-index element, scrubbed parallax/motion drift) were ADDED then George hated them and I reverted. Do only what's asked.
6. **Ask clarifying questions if unsure** — George explicitly invited this. Don't guess and fill gaps.
7. **Deploy is NON-destructive forward-commit** (force-push to main is auto-blocked):
   ```
   git fetch origin main
   TREE=$(git rev-parse HEAD^{tree})
   NEW=$(git commit-tree "$TREE" -p origin/main -m "deploy: <msg>")
   git push origin "$NEW":main
   ```

## DONE + deployed (this session, all client feedback to date)
- Nav: added **Home**, removed the **"Start here" Calendly** link (desktop + mobile), spread the words (`Nav.tsx`).
- Hero: swapped green `hero-loop.mp4` → `showreel-full.mp4` (green gone) (`LensIntro.tsx` line ~251).
- Featured Projects: brand **logos** not text labels; **Discover More** fixed (accordion 52vh + mt-6) (`OurWork.tsx`).
- Testimonials: three **dots** with 40px tap target, renamed from Reviews, no auto-scroll (`Testimonials.tsx`).
- Process: subtext **centred below** heading; no early "OUR" letters (head-start `(i/N)*0.18+0.05`); clears on scroll-off (outro `smooth(OUTRO,1.0,p)`) (`EditorFCP.tsx`).
- Work page: tiles **16:9 in colour**, reveal up one-by-one (`WorkTile.tsx`, `work/page.tsx`).
- Scroll: Lenis lerp **0.06**, wheelMultiplier 0.8 (`SmoothScroll.tsx`).
- `Reveal` component exists: `src/components/shell/Reveal.tsx` (reveal-as-you-reach-it: rise + fade + clip-up on enter). Applied to **StatsBlock only** so far.
- About: big **"Who's behind the camera?"** hero (dropped "founded 2018"), one-person studio (Harry **Wallis**) (`about/page.tsx`).

## REMAINING TASKS — do in this order

### 1. About page — full reference build (DO FIRST)
File `src/app/about/page.tsx`. Already done: big "Who's behind the camera?" hero, one-person studio, founded-2018 dropped. **Still to build:**
- The **`vision → strategy → creation → refinement → impact`** scroll-through (the list CHANGES as you scroll) — replicate from the reference About pages.
- Match the **auteurstudios.au/about** + **barstudios.co.uk/about** *feel*, especially **bar's top section animation** (George: "the nice animation in between"). Study both frame-by-frame (Playwright screenshots) before building.
- Keep: one employee = **Harry Wallis** only; the big "Who's behind the camera?".

### 2. Section blending / continuous flow (STILL NOT DONE — George re-flagged)
George: "the website doesn't really blend at all with each other still." He chose **"reveal as you reach it"** for section flow. The `Reveal` component is built but only on StatsBlock — the site still reads as discrete blocks.
- Roll out a **consistent reveal** across the homepage sections so each unveils as you reach it AND the sections blend/flow into one another (no hard "appears from the bottom"). Use/extend `Reveal` (`src/components/shell/Reveal.tsx`).
- Apply carefully — do NOT double-animate sections that already have entrances (Mission word write-on, Testimonials rise, FAQs fade, TrustedBy fade-up); make them consistent. Do NOT touch lens/finale/pinned OurWork+EditorFCP timelines.
- Verify the full scroll-through flows (no hard block edges, sections unveil).

### 3. Luke-style site — SEPARATE project (LAST; confirmed separate repo/branch)
A fresh render. Free rein on layout. Keep the **content/copy/films** (Break the Ordinary, Films not content, Trusted By, Featured Projects, etc.). Add the missing stack: **Three.js + @react-three/fiber + WebGL/GLSL** (we only have GSAP + Lenis now). "Go crazy." Reference: **lukebaffait.fr** (Lenis lerp 0.06 + heavy scrub + clipPath masks + yPercent/xPercent + filter blur — full inventory in `LUKE-GSAP.md`).

## Blocked on Harry (client) — cannot build without assets
- 9:16 **colour thumbnails** for Featured Projects + the **grid order** (his WhatsApp hierarchy).

## Later (when ready)
- Hero camera-lens animation: generate a camera-lens image/video via **Higgsfield MCP**, use as the intro animation (replaces current lens). George wants to do this together later.

## Animation toolkit — INSTALL (right after the About page, before section blending)
George wants luke's full animation arsenal "at his disposal" (site feels too basic with just GSAP+Lenis). Run:
```
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing
npm install -D @types/three
```
- three = 3D engine; @react-three/fiber = Three.js as React; drei = helpers (useGLTF for .glb, scroll); postprocessing = cinematic shader passes (bloom/DOF/distortion); WebGL/GLSL = free with three (ShaderMaterial as strings).
- Blender = free desktop app to author .glb 3D assets (or AI-generate via Higgsfield).
- **Next 16 + Turbopack caveat (AGENTS.md: "NOT the Next.js you know"):** R3F `<Canvas>` needs `"use client"` + usually a `dynamic(() => import(...), { ssr: false })` wrapper. Verify the build compiles + a test canvas renders (Playwright) before using it for real.
- Use it where it lifts the site out of "basic": the hero lens, section transitions, and especially the SEPARATE Luke build.

## References (study via Playwright before building)
- **auteurstudios.au** + **/work** — nav pill, work tiles one-by-one, process bullets, About.
- **barstudios.co.uk/about** — About top animation + colour-blocking.
- **lukebaffait.fr** — smoothness target (for the separate Luke project). See `LUKE-GSAP.md`.

## Key files
- Home sections: `src/components/home/{LensIntro,Mission,StatsBlock,TrustedBy,OurWork,EditorFCP,Testimonials,FAQs,WhirlwindGallery}.tsx`
- `src/components/shell/{Nav,SmoothScroll,Reveal,ThemeToggle}.tsx`
- `src/app/{globals.css,about/page.tsx,work/page.tsx,page.tsx}`; `src/components/work/WorkTile.tsx`
- Plans/notes: `MASTER-PLAN.md`, `CLIENT-PLAN.md`, `LUKE-GSAP.md`, `HANDOFF.md`
- Rollback tags: `checkpoint-notes-clean`, `checkpoint-luke-base`, `checkpoint-getting-there`.
