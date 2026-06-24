# HW Media About — Original High-End Build (Implementation Plan)

> **For agentic workers / post-compaction self:** Execute task by task. This is a CREATIVE frontend build, so "verify" = `npx tsc --noEmit` clean + Playwright screenshot (WebGL needs swiftshader flags) + READ the PNG + confirm it matches the intent. Commit after each scene. Steps use `- [ ]`.

**Goal:** A brand-new, original, high-end About page for HW Media — dark + gold, Bar/Archivo type only, smooth scrubbed motion throughout, that tells the story of the business and of Harry. NOT a copy of the reference layouts; invent the moments.

**Architecture:** A single dark `<main>` (AboutExperience) with the global Lenis smooth scroll. Each scene is its own focused component, composed in order. The signature original devices: (a) the colossal "HW MEDIA" wordmark with a film STILL knocked out inside the letters (SVG mask), (b) the expanding circle reused as a recurring transition/reveal MOTIF, (c) monumental scrubbed type, (d) film STILLS only — NO big horizontal video; one optional VERTICAL (9:16) reel. A trailing gold custom cursor. Optional perf-gated WebGL only where it elevates (no gradient glow, no draggable toy).

**Tech Stack:** Next 16 + Turbopack, Tailwind v4, GSAP 3.15 (full free plugins: ScrollTrigger, SplitText, ScrollSmoother, Observer, Flip, DrawSVG, MotionPath, InertiaPlugin), Lenis (global), `.about-display`/`.about-body` (Archivo). Colours: `#050505` / `#f5f1e6` / `#bfaa53`.

---

## HARD RULES (do not break)
- Type: `.about-display` / `.about-body` only (Archivo/Owners). `.font-accent` + `.font-hand` are BANNED (neutralised in globals.css).
- Colours: dark `#050505`, cream `#f5f1e6`, gold `#bfaa53`.
- **NO big/horizontal films.** Use IMAGES (`/videos/films/posters/*-w.jpg` stills, `/images/*`). Film ONLY as VERTICAL 9:16 (`*-p.mp4`), sparingly.
- No mouse-gradient glow, no draggable toy, no clunky sticky-pin, no micro-labels/eyebrows, no em dashes, never "studio".
- Smooth is the bar (the expanding circle). Everything scrubbed + buttery.
- Perf: any WebGL `frameloop` off when off-screen, dpr ≤ 1.5. Never cook the CPU.
- Verify every scene with a screenshot before moving on. Turbopack stale-CSS: after globals.css edits, `lsof -ti:3011|xargs kill -9; rm -rf .next; npx next dev -p 3011` then re-verify.

## File map (src/components/about/)
- `AboutExperience.tsx` — composes all scenes (exists; rewrite order).
- `AboutIntro.tsx` — intro lock (exists; keep, short).
- `CustomCursor.tsx` — trailing gold cursor (exists; keep).
- `KnockoutHero.tsx` — NEW. Colossal "HW MEDIA" with a film still knocked out inside via SVG mask; still does a slow Ken-Burns pan (constant motion).
- `Statement.tsx` — NEW. Monumental scrubbed statement (what HW Media is). Lines rise out of clip masks.
- `CircleWipe.tsx` — NEW. Reusable expanding-circle transition (the motif) — a cream/still circle that grows on scroll to reveal/transition. Parameterised (content inside).
- `Harry.tsx` — REWRITE. Portrait STILL revealed via a circle/clip, monumental "HARRY WALLIS", scrubbed bio.
- `Work.tsx` — NEW. The work as STILLS (parallax column / circle reveals) + a kinetic brand cascade (type). Optional ONE vertical 9:16 reel.
- `Method.tsx` — REWRITE smooth. Five stages, gold fill sweeps as each centres (scrubbed, NO sticky pin).
- `ContactCircle.tsx` — KEEP (the loved expanding circle = the contact close).
- `AboutFooter.tsx` — KEEP (monumental stamp).
- DELETE from current build: `Business.tsx` (replaced by Statement + Work), any big-video usage.

---

### Task 1: KnockoutHero — the name as the work
**Files:** Create `src/components/about/KnockoutHero.tsx`. Modify `AboutExperience.tsx` to use it as the hero.
- [ ] Build a `<section>` min-h-screen, dark. A colossal "HW MEDIA" (`.about-display`, clamp up to ~18rem). Behind/through it, a film still (`/videos/films/posters/mclaren-w.jpg`) shows ONLY inside the letters via an SVG `<mask>` (white rect minus black `<text>` = letters are holes) OR `background-clip:text` with the still as background. The still slowly scales/pans (Ken Burns, gsap repeat yoyo) so it's alive. One quiet line above: "A creative media company making films for brands." Parallax the wordmark up on scroll (scrub). SplitText not needed if using SVG text; if DOM text + bg-clip, animate a mask reveal on load.
- [ ] Verify: `tsc` clean; screenshot at top; READ it; confirm the still reads inside the letters, dark + gold, no banned font, the still is panning (two frames differ). Commit.

### Task 2: Statement — what HW Media is
**Files:** Create `src/components/about/Statement.tsx`.
- [ ] Monumental statement, lines rising out of `overflow-hidden` masks on a scrubbed ScrollTrigger (`yPercent 112 -> 0`, ease none, scrub): "We make brand films that feel more cinematic, more considered, and more worth remembering." Gold on the last phrase. A short prose line under it with the brands (McLaren, Aston Martin, Nike, Salomon, Defender). No film.
- [ ] Verify: screenshot mid-reveal; READ; smooth + on-brand. Commit.

### Task 3: CircleWipe — the recurring motif (reusable)
**Files:** Create `src/components/about/CircleWipe.tsx`.
- [ ] A reusable section: a tall (`min-h ~180vh`) relative wrapper + a `sticky top-0 h-screen` inner holding a panel masked `clip-path: circle(var(--cr,0%) at 50% 50%)`, the radius scrubbed `0% -> 92%` once the section pins (`start "top top" end "+=80%"`). Props: `bg` (cream or a still), `children` (centred content). This is the loved contact-circle mechanic, generalised so it can transition between scenes AND be the contact close. Verified pattern: GSAP can animate the CSS var `--cr`.
- [ ] Verify: drop one instance in the page; screenshot the circle growing (measure `--cr` rising); READ. Commit.

### Task 4: Harry — the one director
**Files:** Rewrite `src/components/about/Harry.tsx`.
- [ ] Portrait STILL (`/images/harry-color.jpg`, placeholder) revealed inside a circle or a clip-mask as you scroll (reuse the circle motif or a clip-path inset). Monumental "HARRY WALLIS" (`.about-display`, gold surname). Scrubbed bio: "Behind HW Media is one director. Harry writes, shoots and cuts every film himself, and works close to the brand, so the people who commission the film are the people he makes it with." Cursor-tilt on the portrait (DOM gsap rotationX/Y) is fine. NO big video.
- [ ] Verify: screenshot; READ; monumental, smooth, image-not-video. Commit.

### Task 5: Work — stills + kinetic brand cascade (+ optional vertical reel)
**Files:** Create `src/components/about/Work.tsx`.
- [ ] Present the work as STILLS only: a parallax column / grid of film stills (`*-w.jpg`) that drift at different scrubbed speeds, OR stills revealed through small circle masks. Plus a KINETIC brand cascade: the brand names (McLaren, Aston Martin, Nike, Salomon, Defender, Norton) as monumental type that slides horizontally on scroll velocity (scrub xPercent). Optional: exactly ONE vertical 9:16 reel (`/videos/films/salomon-p.mp4`) in a phone-format frame that plays + reveals smoothly. NO horizontal video.
- [ ] Verify: screenshot; READ; stills not big video, brand cascade kinetic, smooth. Commit.

### Task 6: Method — five stages, smooth (de-clunked)
**Files:** Rewrite `src/components/about/Method.tsx`.
- [ ] Five stages (Vision, Strategy, Creation, Refinement, Impact) as rows. The active row = the one nearest viewport centre, driven by a single ScrollTrigger `onUpdate` over the list (`active = floor(progress*5)`), NO sticky pin. The gold fill (`.hww-row[data-on]::before`) + text-flip transition smoothly via CSS. Clean copy (Bar register). NO film panel.
- [ ] Verify: screenshot at two depths (different stage active); READ; smooth, not clunky. Commit.

### Task 7: Compose + contact circle + footer + intro
**Files:** Rewrite `src/components/about/AboutExperience.tsx`. Keep `ContactCircle.tsx`, `AboutFooter.tsx`, `AboutIntro.tsx`. Delete `Business.tsx`.
- [ ] Order: AboutIntro -> CustomCursor -> KnockoutHero -> Statement -> (CircleWipe transition) -> Harry -> Work -> Method -> ContactCircle (the final circle / Let's create) -> AboutFooter. One dark `<main className="about-experience on-media bg-[#050505]">`. Remove Business import.
- [ ] Verify whole page: `tsc` clean; full-scroll Playwright screenshots (swiftshader flags) at every scene; READ them; no console errors; one continuous smooth dark+gold piece; no big video, no banned font, no gradient, no toy. Commit.

### Task 8: Polish pass (adversarial)
- [ ] Run a Workflow: 2 agents adversarially review the rendered page vs the brief (high-end? original? smooth? dark+gold? Bar font? no big video? perf?), return prioritised fixes. Apply the fixes. Re-verify. Commit.
- [ ] Append the TO-DO / THINKING LOG to `docs/superpowers/specs/2026-06-24-creative-freedom.md` for George's self-learning: what was built, what was tried/rejected, and why.

---

## Self-review (done)
- Spec coverage: fonts/colours rule (all tasks use `.about-display`/`.about-body` + the palette); no-big-film rule (Tasks 1,4,5 use stills; only Task 5 optional vertical reel); originality (Task 1 knockout name + Task 3 circle motif are invented, not copied); smooth (every task scrubbed, no sticky); business+Harry (Tasks 2,4,5). ✓
- No placeholders: each task names the exact file + the concrete technique + the verification. ✓
- Consistency: `--cr` CSS var + `.hww-row[data-on]` + `.about-display`/`.about-body` used consistently. ✓
