I'll write the handoff brief now. The materials are comprehensive — I don't need to read anything else since all the source content (pain points, auteur spec, codebase audit) is provided in full. Let me compile the definitive document.

# HW MEDIA — FRESH BUILD HANDOFF BRIEF

> The current build is thrashed and over-engineered. This session is a clean restart aiming to one-shot a calm, restrained, premium site. **Read this whole document before touching code.** The PAIN POINTS (Section 3) are the law — every single one must be honoured.

---

## 1. TL;DR

1. **HW Media is a film PRODUCTION company** that travels and shoots on location — premium, cinematic, dark + gold. NOT a "film agency", NOT about "content". The site must feel like a **$20k site**: slow, heavy, smooth, scroll-tied motion.
2. **The target is [auteurstudios.au](https://auteurstudios.au/)** translated to dark + gold: minimal, vast negative space, **ONE idea per screen, LEFT-ALIGNED**, quiet/slow/restrained motion, one consistent type system. Fable reportedly *one-shot* this look — so a clean calm build is achievable. The current build failed by doing the opposite (noise, over-engineering).
3. **The #1 rule: LESS. CALM. ALIGNED.** George's loudest structural complaint is *"too much going on / too much noise."* When in doubt, remove, slow down, and line things up. Restraint is the aesthetic, not a compromise.
4. **Dev-process rules (non-negotiable, learned from the failed session):** plan first and confirm before building · **ONE change at a time, verify, then move on** · **NEVER claim something is "fixed" or "done" without a screenshot proving it** (the last dev gaslit by claiming fixes that weren't real) · keep the good bits untouched.
5. **KEEP THE FINALE EXACTLY AS-IS.** The "break the ordinary" finale + rising footer is the one section George loves and is the **quality bar for everything else**. Do not touch it.

---

## 2. The ONE thing that's GOOD — keep it (the quality bar)

**`WhirlwindGallery.tsx` — the finale + footer.** George's exact words: *"an amazing animation, works really well, clean."*

What it does (and must continue to do, untouched):
- 220vh pinned, `scrub: 0.6`, resize-hardened (`invalidateOnRefresh` + `onRefresh` geometry recompute).
- 14 micro-video tiles "train in" from bottom-left → swing into a tilted spinning ring → each fires off to its own scatter position.
- The line **"Every film is a chance to break the ordinary."** types itself on, with only **"break"** in gold.
- "Start here" CTA rises → a **slim footer slides up from the bottom edge** (email left, Instagram/LinkedIn, copyright + Privacy).
- Mobile / reduced-motion fallback: static grid + line + footer.

**This is the standard.** Every other section should feel this clean, this deliberate, this finished. If a section doesn't meet this bar, it isn't done. **Do not modify this file.**

---

## 3. PAIN POINTS — complete, grouped by section (THE LAW)

> Three headline issues dominate everything: **(A) the FAQ is "completely fucked"**, **(B) the lens is too shallow — no real depth**, and **(C) the whole site is "too fast / too much noise."** Fix the philosophy first (less, calm, aligned), then these specifics.

### 3.1 HERO / LENS — *headline issue: not enough depth*
- **"3D" means DEPTH, not angle.** To George, 3D = falling deep *into* the lens (a rabbit-hole dive). **Remove ALL tilt / angle / rotation.** It is currently too **shallow** — it must feel like falling deep in.
- **Must ZOOM AUTOMATICALLY on load** (auto-play the dive).
- **Must NOT land zoomed-in or low-quality.** It lands clean, **full-frame, sharp**.
- **Remove the vignette.** The dark radial edges around the showreel are "horrible" — kill them.
- **Kill the letter-gapping.** Gaps between letters (caused by an expanded font width axis) must go — set width back to normal.
- **Gold only, NEVER red.** A red traffic light appears in the hero footage — it must read gold only. (Token-level: `--red` is already aliased to gold, but check the source footage / any literal red.)
- **The motto must INTERACT with the moving footage.** "Break the ordinary" should composite with the live showreel behind it. A knockout-with-a-box treatment was **tried and REJECTED.** George may provide a reference for the interaction he wants — **if no reference yet, do a clean solid-type version, do NOT reinvent the knockout box.**
- **Align the three hero lines.** "Break the ordinary" + "we go where the story is" + "Book a call with us" are mismatched and not in line. They must **align and read as one set** (same alignment, same type system, coherent stack — mirror the auteur left-stack).

### 3.2 FONTS — *the dev changed them without permission; restore consistency*
- **George NEVER asked to change the site font.** The previous dev changed it across the whole site AND on "Break the Ordinary" without permission. **Restore ONE consistent original type system.** Do not change fonts unless explicitly told.
- **The FAQ must NOT be the odd font out.** George literally asked *"why is the FAQ font different."* FAQ body goes in the **light body font, never the heavy display face.**
- **"Start Here" must be identical everywhere.** The "Start Here" button font currently differs between the footer and the nav. **Every "Start Here" must match the nav links** (top-left nav is the reference).
- **No replicas of licensed fonts.** Use real fonts. **BR Firma** is the real auteur label font — **licence it before launch** (the bundled `.otf` is licence-pending).

### 3.3 PACING / SPACING / MOTION — *headline issue: too fast, too much noise, disconnected boxes*
- **Animations are WAY too fast.** Specifically **Our Work** (artwork reveal) and **Our Process** animate ridiculously quickly. **Slow them right down** — deliberate and premium.
- **Our Process "just scrolls"** with effects firing too fast — it makes no sense. Re-pace it so the motion reads.
- **Too much empty black/white space BETWEEN sections.** **Condense the inter-section spacing.**
- **No full-black VOIDS at seams.** Empty pinned stages create near-empty black screens between sections — **never** show a near-empty black screen between sections.
- **Sections feel like disconnected boxes.** They must **BLEND seamlessly** — a storytelling flow with a **slow premium scroll**, one section dissolving into the next.
- **Keep the Our Work reveal STYLE** ("comes up like that") — George likes it — **but slower, and don't break it.** (The dev broke Salomon's reveal: the last film doesn't complete. Don't repeat that.)

### 3.4 FAQ — *headline issue: "completely fucked", "shocking layout" (his single loudest, most-repeated grievance)*
- **Nothing is aligned** with anything else — fix the alignment completely.
- **The reel/film image on the LEFT must STAY PINNED in place** the entire time you read the questions. **Currently it drifts up the screen — that is the core bug.** It must not move while you scroll the questions.
- **It must FADE IN on entry** (the fade was broken / didn't happen).
- **Remove the big BLACK GAP** after the FAQ, before the finale.
- **Go back to the earlier "scroll-effect" version** where the reel had a clean scroll behaviour. George liked **video-left + questions-right + a blend**.
- **The reel fades off IN PLACE** (never cut in half) as the next section covers it — pinned, then fades out where it sits.
- **Questions = clean click-accordion, ONE open at a time**, in a **calm light body font** (NOT the heavy display face — the heavy FAQ font being the odd-one-out is exactly what George complained about).

### 3.5 TESTIMONIALS → rename "REVIEWS" — *too much going on; copy auteur exactly*
- **Rename the section from "Testimonials" to "Reviews."**
- **Strip it right down** — "too much going on."
- **Fix the alignment** — everything is currently misaligned; get it all in line.
- **The underline only goes halfway across** — fix it or remove it.
- **Copy auteurstudios:** a **CAROUSEL**, **ONE review on screen at a time**, **numbered 1 · 2 · 3** nav, a **large clean quote**, **small attribution**, **left-aligned**, minimal.
- **The section sits too high** — bring it down; the **attribution should sit up directly under the quote.**

### 3.6 WORK PAGE
- **No "Selected Work" heading** (remove it).
- **Film tiles greyscale + paused by default; colour + play on HOVER** (not all playing at once).
- **Centred "Have a project in mind?" booking CTA.**

### 3.7 ABOUT PAGE
- **Heading: "Who's behind the camera".**
- **A genuinely vertical (3:4) film.**
- **A greyed photo of HARRY that turns colour on hover.** The current images are a **duplicated MOUNTAIN, not Harry** — needs a **real Harry headshot** (blocked on George — see Section 7).

### 3.8 NAV
- **Ring-on-hover** (no permanent borders on nav items).
- **Logo gold on dark / black on light.**
- **"Start here" CTA** (matching the nav link font — see Fonts).

### 3.9 GLOBAL RULES (LAW — from `HW-MEDIA-RULES.md`)
- **Film PRODUCTION company** that travels and shoots on location — **NOT** a "film agency", **NOT** about "content".
- **Gold only: `#bfaa53`. NEVER red.**
- **No IBM Plex Mono / military monospace font** anywhere prominent (only allowed inside the lens SVG engraving, if at all).
- **No prominent handwriting font** (Dancing Script must not appear prominently).
- **Real fonts, never replicas. BR Firma must be licensed before launch.**
- **Must feel PREMIUM — a $20k site. Slow, heavy, smooth, scroll-tied motion.**

---

## 4. TARGET AESTHETIC SPEC (from auteurstudios.au → dark + gold)

> Keep auteur's exact structural DNA; swap the palette to dark + gold. The "cinematic" feel comes from **looping video + big serif + restraint**, NOT from heavy motion. Cached source for re-inspection: `/tmp/auteur_home.html`, `/tmp/auteur.css`.

### 4.1 Type system (one coherent system — pick and commit)
Auteur uses a **dual serif/sans** personality. Three roles:

| Role | Auteur font | Free / licensable substitute | Usage |
|---|---|---|---|
| **Display + names** (the soul) | Very Vogue Display | **Fraunces** (high opsz) / PP Editorial New / Canela | Big editorial headlines, all attribution names. Mixed-case, **never uppercased.** |
| **Labels / nav / buttons** | **BR Firma** 600 | Söhne / Suisse Int'l / Inter 600 | Eyebrows, nav, buttons, numbers, all-caps labels. UPPERCASE, letter-spacing `+0.05em`. |
| **Body** | Karla Variable | **Karla** (free, Google) | Paragraphs, quotes. line-height **1.5**, weight 400. |

**Signature heading move (use this):** an upright serif sentence with **ONE word in real `<em>` italic + gold.** e.g. `Have a <em>project</em> in mind?`, `Our <em>story</em>`. The italic word is the only gold in the heading.

**Casing rules:** display serif mixed-case, `line-height 1.0`, `letter-spacing 0`, `text-wrap: balance`. Labels = BR Firma 600 UPPERCASE `+0.05em` `line-height 1.1`. Body = Karla 400 `line-height 1.5`.

> **NOTE for this codebase:** the repo currently ships Archivo (display) + Instrument Serif (accents) + Hanken Grotesk (body) + BR Firma (labels). The previous dev's font-swapping is a top grievance. **Decide ONE system up front, confirm with George, then never change it mid-build.** The cleanest path to the auteur look is serif-display (Fraunces/Instrument) + BR Firma labels + Hanken/Karla body — but **George must confirm**, since "changing fonts without being told" is exactly what got the last dev in trouble.

### 4.2 Type scale (fluid `clamp`, 320px→1440px)

| Style | Min | Max | Family | Case |
|---|---|---|---|---|
| display | 64px | **112px** | serif | mixed |
| display-small | 40px | 64px | serif | mixed |
| h1 | 40px | 80px | serif | mixed |
| h2 | 40px | 64px | serif | mixed |
| h3 | 36px | 48px | serif | mixed |
| h4 | 28px | 32px | serif | mixed |
| h5 | 22px | 24px | BR Firma | UPPER |
| h6 | 16px | 18px | BR Firma | UPPER |
| text-large | 18px | 20px | body | — |
| **text-main (body)** | **16px** | **16px fixed** | body | — |
| text-small | 12px fixed | 12px | body/label | often UPPER |

Line-height tokens: display/headings `1.0`, labels `1.1`, large `1.3`, **body `1.5`.**
Clamp formula: `clamp({min}rem, {min}rem + ({max}-{min}) * ((100vw - 20rem) / (90 - 20)), {max}rem)`.

### 4.3 Colour — dark + gold (monochrome + ONE accent)
```
--bg:         #0b0b0c   (or warm #12100c)   /* repo currently #050505 — fine */
--bg-2:       #000000
--surface:    faint warm-black card, 1px gold-tint border
--text:       #ece7da   (warm off-white — NOT pure #fff)
--text-muted: rgba(236,231,218,.6)
--gold:       #bfaa53   (LOCKED — the brand gold)
--border:     rgba(201,162,75,.18)   /* hairline gold */
```
**Apply gold ONLY to:** the italic `<em>` words in serif headings · the reviews divider · link hover underline · text selection · button hover state · the active numbered nav digit. **Body stays warm-white.** No second accent, no gradients on text, no red ever.

### 4.4 Alignment system
- **Default to LEFT.** Hero + section-intro headlines left-aligned, hung on a left content-wrapper inside a 12-col grid. Eyebrow label **above** the serif headline, CTA button **below** — a clean left stack.
- **Body + reviews: left-aligned** (`place-items: start`).
- **Centre ONLY a short manifesto moment** (e.g. an about-page line, or numbered process steps 01/02/03). For a film studio, left is the rule; centre is the rare exception.
- `text-wrap: balance` on all headings.

### 4.5 Reviews carousel (the centrepiece — replicate precisely)
**Mechanism:** a flex track where **each slide is `flex: none; width: 100%`** → exactly **ONE review visible at a time, full-width.** Driven by **numbered nav `1` `2` `3`** (not arrows, not dots), `gap: 1rem`, group `opacity: 0.6`; active digit = full opacity / gold. Numbers in **BR Firma, ~24px, uppercase styling**, centred click target ~1.5rem wide.

**Each slide = a 2-column grid, `align-items: end` (bottom-aligned):**
- **LEFT column** (vertical flex, generous `gap` ≈ 40–64px):
  1. **Quote** — body font (16px, line-height 1.5). **Plain paragraph, NOT oversized, NOT in quote marks.** Length varies; layout absorbs it.
  2. **Attribution** (flex row, `gap: 0.5rem`): `[Name]` `│` `[Company]` — **both at display-small size in the serif (40→64px — large!)**, **company in italic**, split by a **thin vertical divider** (~1.5px, full-height, text-colour). The **names are the visual hero**; the quote is humble body text.
- **RIGHT column:** a **16:9 looping video** (`aspect-ratio:16/9`, `border-radius: 0.5rem`, `overflow:clip`), autoplay/muted/loop/playsinline — a silent clip of that client's work beside their words.

**Transition between slides:** quick crossfade/slide (~0.3s), eased (Section 4.7).

**Net:** one at a time · numbered 1/2/3 · small humble quote · BIG serif name `│` *italic company* split by a hairline rule · paired 16:9 muted loop · attribution sits **directly under** the quote (fixes "section too high" + "attribution should sit up under the quote").

### 4.6 Spacing / negative-space rhythm
Fluid scale (min→max): space-1 6–8px · space-4 20–24px · space-5 28–32px · space-7 36–48px · **space-8 40–64px** (the big internal gap, e.g. quote↔attribution).
- **Page gutter:** tight, `8px→16px` (content breathes, not the frame).
- **Section padding-block:** desktop in the **6–10rem** range — lots of vertical air, but **condense the dead space between sections** (George's complaint) so seams blend rather than gap.
- **Radius:** `8px` everywhere (cards, video). **Hairline border:** `~1.5px`.
- **Restraint:** large empty margins around big serif type, single accent so nothing competes.

### 4.7 Motion — slow, restrained, composed (NOT bouncy, NOT scrubbed circus)
- **Two easing curves only:** `cubic-bezier(.25, .46, .45, .94)` (easeOutQuad — dominant, soft decelerate, no overshoot) and `cubic-bezier(.4, 0, .2, 1)` (Material standard).
- **Durations:** short + consistent — **0.2s** (hovers), **0.3s** (reveals/slider), occasionally 0.35s/0.5s. Nothing long or theatrical.
- **Reveal style:** gentle **fade + small upward translate** on scroll-in, eased with easeOutQuad. **No scrub-pinning, no parallax circus, no kinetic typography.**
- **Hover:** buttons invert fill smoothly over 0.2s; links draw a gold underline; video cards sit still and loop.
- **Scroll feel:** native scroll with soft entrance animations — **NOT a heavy Lenis/GSAP-scrub experience.** The cinematic quality comes from looping video + big serif, not from motion.

> **Important tension with the current build:** the repo leans on heavy GSAP ScrollTrigger pin/scrub everywhere (this is the over-engineering George hates). Auteur's restraint is the opposite. **BUT** the two sections George explicitly LIKES — the **finale** and **Our Work's** scrubbed reveal — are scrub-driven. So the rule is: **keep the two good scrub moments, make everything else calm fade-up reveals.** Don't pin/scrub every section.

### 4.8 One-shot build checklist (dark + gold film studio)
1. **Fonts:** one committed system (serif display + BR Firma labels + body) — confirm with George first.
2. **Palette:** warm-black bg, warm-white text `#ece7da`, single gold `#bfaa53` on italic heading words / dividers / hovers / selection / active nav digit only.
3. **Type scale:** fluid clamps, display tops at 112px, body fixed 16px/1.5.
4. **Heading move:** upright serif sentence, ONE word `<em>` italic + gold.
5. **Layout:** left-aligned hero stack (eyebrow → big serif → outlined button) on a 12-col grid; centre only a short manifesto.
6. **Reviews:** one-at-a-time full-width slide, numbered 1 2 3 nav @0.6 opacity, small body quote, BIG serif name │ *italic company* split by 1.5px rule, paired 16:9 muted-loop video.
7. **Spacing:** tight 8–16px gutter, big 40–64px internal gaps, 8px radius, 1.5px hairlines, lots of vertical air, **condensed seams.**
8. **Motion:** 0.2–0.3s, `cubic-bezier(.25,.46,.45,.94)`, fade-up reveals, button fill-invert on hover, nothing bouncy/scrubbed (except the two good scrub moments).

---

## 5. CURRENT CODE MAP

**Root:** `/Users/georgewoodhead/Web Dev AIOS/Sites/HW Media Rebuild` · git branch `rebuild` (== `main`) · latest commit `fbd7232`.

### 5.1 Tech stack
| Item | Version | Notes |
|---|---|---|
| **Next.js** | **16.2.8** | App Router. ⚠️ **NOT the Next.js in your training data — read `node_modules/next/dist/docs/` before writing code** (per `AGENTS.md`). Dev runs on **port 3006** (`next dev -p 3006`). |
| **React** | 19.2.7 | |
| **GSAP** | 3.15.0 | `src/lib/gsap.ts` registers ScrollTrigger, SplitText, ScrambleText (Scramble effectively unused). |
| **Lenis** | 1.3.23 | `src/components/shell/SmoothScroll.tsx`: `lerp 0.085`, `wheelMultiplier 0.95`. Driven by `gsap.ticker`. Nothing currently stops Lenis. |
| **Tailwind** | v4 (`@tailwindcss/postcss`) | CSS-first via `@theme inline` in `globals.css`. No `tailwind.config`. |
| **TypeScript** | ^5 | No tests, no ESLint config present. |

### 5.2 Homepage section order (`src/app/page.tsx`)
1. `LensIntro` (hero/lens) → 2. `Mission` → 3. `StatsBlock` → 4. `TrustedBy` → 5. `OurWork` → 6. `EditorFCP` (Our Process) → 7. `Testimonials` → 8. `FAQs` → 9. `WhirlwindGallery` (finale + permanent footer).

### 5.3 Per-component verdict — KEEP / REBUILD / SIMPLIFY

| Component | State | Verdict |
|---|---|---|
| **`WhirlwindGallery.tsx`** (finale) | The good one George loves | **KEEP VERBATIM — do not touch.** Quality bar. |
| **`OurWork.tsx`** | Working; the motion benchmark (pinned 185vh, scrubbed clip-path wipe → hover-expand accordion) | **KEEP the style.** Only **slow it down**; don't break Salomon's reveal (last film must complete). |
| **`Mission.tsx`** | Working, simple ("Films, not content." + scrubbed per-word fade) | **KEEP.** Clean, matches the condensed ask. |
| **`StatsBlock.tsx`** | Working (3 count-ups: 5yrs / 150+ / 96% retention) | **KEEP.** `96%` is a placeholder (blocked on George). |
| **`TrustedBy.tsx`** | Working (two opposite logo marquees, dim→hover-grow, 18 logos) | **KEEP.** Client wants logos slightly smaller (meeting note). |
| **`Testimonials.tsx`** | Working but wrong design (click-index 01/02/03 + half-width gold rule) | **REBUILD → Reviews carousel** per 4.5. Rename to "Reviews", numbered 1·2·3, big serif name, calm. |
| **`FAQs.tsx`** | **BROKEN per all docs** (reel drifts up, no fade, black gap, heavy font, uses `.label-mono`) | **REBUILD** → pinned reel-left that fades in/out **in place** + click-accordion right in **light body font**, blend into finale. **This is the #1 fix.** |
| **`EditorFCP.tsx`** (Our Process) | Over-engineered/fragile (215vh pin, scatter-assemble letters, swirl films, fragile timing, Process→Testimonials gap) | **SIMPLIFY / SLOW DOWN dramatically.** Re-pace so motion reads; close the gap before Reviews; consider replacing the scatter circus with calm fade-up steps. |
| **`LensIntro.tsx`** (hero) | Over-engineered (~480 lines of gradient-built lens; too shallow/2D; motto interaction unresolved; tilt present) | **SIMPLIFY / REWORK for DEPTH.** Remove tilt, add auto-zoom dive into depth, land sharp full-frame, remove vignette, kill letter-gapping, align the 3 hero lines, motto interacts with footage (await reference; do NOT redo the rejected knockout box). |

**Data layer to keep:** `src/content/projects.ts` + `src/content/site.ts`. **Font to keep:** `src/fonts/BRFirma-SemiBold.otf` (BR Firma 600).

### 5.4 Design tokens (`src/app/globals.css`)
- **Colours:** `--black #050505`, `--cream #f9f6e4`, `--gold #bfaa53`, **`--red` aliased to `#bfaa53`** (so "no red" is enforced at the token level — every `var(--red)` renders gold). Hairlines + motion vars (`--ease-expo: cubic-bezier(0.19,1,0.22,1)`, `--dur-*`, all → 0 under reduced-motion).
- **Mode system:** `html[data-mode="dark"|"light"]` (default dark, restored pre-paint from `localStorage 'hwm-mode'`). `.on-media` / `section[data-surface="media"]` locked to dark (lens + finale = "cinema bookends").
- **Fonts wired in `layout.tsx`:** `--font-archivo` (Archivo, display) · `--font-instrument` (Instrument Serif italic, accents) · `--font-body` (Hanken Grotesk) · `--font-firma` (BR Firma 600, labels/CTAs) · `--font-plex-mono` (IBM Plex Mono — **only** inside lens SVG) · `--font-hand` (Dancing Script — **docs want this gone, never prominent**).
- **`.font-display`:** `wdth 100` (already pulled back from 125 to kill letter-gapping), `letter-spacing -0.02em`, uppercase, `line-height 0.86`. Display tiers: `.display-xl` (39→96px), `.display-lg`, `.display-md` — "nothing exceeds display-xl."
- **`.label-mono` + `.bar-label`** now render in **BR Firma** (NOT IBM Plex — the "never the military mono" rule). FAQ still uses `.label-mono` on numerals — **drop/neutralise it in the rebuild.**

### 5.5 Real assets present (so you build against what exists)
- **Fonts:** `src/fonts/BRFirma-SemiBold.otf` (only bundled custom font; **licence pending**). All Google fonts pull at build.
- **`public/videos/` (~41MB):** Hero `hero-loop.mp4` (+poster), `showreel-full.mp4`; `loop-01..05.mp4`. **`videos/films/` (17 mp4s):** `otoko`, `mclaren`, `hera`, `zuma`, `nike`, `salomon`, `chasing-the-salt`, `bts` each as `-w.mp4` (16:9) + `-p.mp4` (3:4); plus `defender-reel.mp4` (FAQ reel). Matching `films/posters/*.jpg`. **`videos/micro/` (12 mp4s):** `m01..m12.mp4` (+ posters) — finale tiles + process clips.
- **`public/logos/` (40 PNGs, ~6.5MB):** white client wordmarks (mclaren, aston-martin, nike, red-bull, spotify, defender, meta, natwest, airbus, soho-house, salomon, diageo, led-zeppelin, abbey-road, waldorf-astoria, tui, etc.) + HW marks `hwmedia-dark/light/white.png`. Light mode inverts via `.logo-mark` filter.
- **`public/images/` (~532KB):** `harry-bw.jpg`, `harry-color.jpg` (**both PLACEHOLDER — real Harry photo blocked**), `hero-defocus.jpg`, `hw-logo-gold.png`, `stills/s01..s06.jpg`.
- **`public/options/`:** `a-00..a-07.png` (internal styleframe boards).

### 5.6 Canonical docs (repo root — read these too)
| Doc | Role |
|---|---|
| **`HW-MEDIA-RULES.md`** | **Single source of truth** — golden rules, per-section spec + status, dead-files list, prioritised actions. |
| **`COPY.md`** | Every word on the site, positioning, verified facts, brand lines, open questions for Harry. |
| **`PLAN.md`** | Fix plan v3 (north star auteur; overreaches listed; per-section targets; says FAQ "completely broken, run back to scroll-effect version"). |
| **`TASKS.md`** | Live task list / working memory (survives compaction) — live URL `hw-media-website-y7yi.vercel.app`, restart pattern, ordered tasks, client meeting notes A–F, DONE/BLOCKED. |
| **`PRODUCT.md`** | Brand/positioning brief — register, users, voice, visual DNA, anti-references. |

**Stray/pre-rebuild docs flagged safe to remove:** `AGENTS.md` (keep its Next-16 warning in mind first), `CLAUDE.md`, `CLAUDE-DESIGN-HANDOFF.md`, `DESIGN.md`, `FRAMER-PROMPT.md`, `PLAN-LAB.md`, `TASTE.md`, `README.md`.
**Cleanup also flagged:** remove `_gsap-skills/` (vendored GSAP AI skill pack, reference only) and `_audit/` (Playwright/ffmpeg screenshot rig) from the working folder.

---

## 6. HOW NOT TO FAIL (process rules from the last session's failures)

The previous dev thrashed the build. **Do the exact opposite of each failure:**

1. **NEVER claim "fixed"/"done" without a screenshot proving it.** The last dev repeatedly claimed things were fixed when they weren't — George called it **gaslighting**. Every "done" must be backed by a captured screenshot of the actual result. *(The repo has a Playwright/ffmpeg rig in `_audit/` if you want shots; even a single manual screenshot per change satisfies the rule.)*
2. **ONE change at a time, then verify.** The last dev changed **5 things at once and broke the working sections.** Make one change, confirm it, keep moving. Never touch the sections George likes while fixing others.
3. **Plan first, confirm, then build incrementally.** The last dev built with no plan. Write a short plan, get George's nod, then implement step by step. *(Use `/create-plan` if helpful.)*
4. **Restraint, not engineering.** The last dev over-engineered — tall pinned scrub sections everywhere, bespoke per-section motion. **The target is the OPPOSITE: shared calm motion, fewer moving parts, less.** When unsure, remove.
5. **Keep the good bits sacred.** Finale (`WhirlwindGallery`) and Our Work's reveal style are loved — **do not break them.** The last dev broke Salomon's reveal; don't repeat that class of mistake.
6. **Don't change fonts without being told.** The font swap was unsanctioned and is a top grievance. Confirm the type system **once**, then leave it.
7. **No near-empty black screens, ever.** If a transition produces a black void, that's a bug — fix the seam.

---

## 7. BLOCKED ON GEORGE (assets / decisions he still owes)

1. **Real Harry photo** — a genuine greyscale→colour Harry headshot for the About page. Current `harry-bw.jpg` / `harry-color.jpg` are placeholders (a duplicated mountain). About page can't be truthful without it.
2. **The motto-interaction reference site** — the example of how "Break the ordinary" should interact with the moving footage. Until provided, ship a clean solid-type version; **do NOT re-attempt the rejected knockout-with-a-box.**
3. **Real client-retention %** — the `96%` retention stat in `StatsBlock` is a placeholder TBD.
4. **Real booking link** — the live "Book a call" / "Start here" / "Have a project in mind?" CTA destination.
5. **Font licensing decision** — **BR Firma** needs a commercial licence before launch; confirm whether to license it or commit to a substitute (Söhne/Suisse/Inter for labels) **before** locking the type system.

---

*Build order suggestion (for the planning step, to confirm with George): keep finale + Our Work + Mission + Stats + TrustedBy → fix the LENS (depth, auto-zoom, no tilt/vignette, aligned hero lines) → rebuild the FAQ (pinned reel that fades in/out in place + light-font accordion, no black gap) → rebuild Reviews carousel → slow + simplify Our Process and close its gap → final pacing/seam pass so every section blends. One change at a time, screenshot each, never touch what George loves.*