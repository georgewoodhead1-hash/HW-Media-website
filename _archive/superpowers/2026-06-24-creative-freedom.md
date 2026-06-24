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
- Decision: go content-first (business + Harry) with ORIGINAL high-end smooth moments, keep the expanding circle as a recurring motif. Build via a proper written plan (`docs/superpowers/plans/2026-06-24-hw-about-creative.md`), then execute task by task, verifying each with a screenshot.

### TO-DO / THINKING LOG (for George — self-learning)

**What I DID (and why):**
1. **Knockout hero (`KnockoutHero.tsx`) — the name IS the work.** The colossal "HW MEDIA" is filled with a film STILL via `background-clip:text`, and the still slowly pans (Ken Burns) so it's alive. *Why:* this is an ORIGINAL device, not a copy of any reference layout — same instinct as the Let's Create circle (you said that's good *because* I made it from nothing). It's on-brand (the company literally made of its footage) and obeys the new rule (a still, not a big video).
2. **Statement (`Statement.tsx`)** — monumental "we make brand films that feel more cinematic, more considered, more worth remembering" rising out of clip masks on a scrubbed timeline. *Why:* it's the "about the business" content, and the smoothness matches the circle (the bar you set).
3. **Work (`Work.tsx`)** — a kinetic brand cascade (McLaren/Nike/Salomon… sliding on scroll), parallax film STILLS, and exactly ONE vertical 9:16 reel. *Why:* shows the work + clients dynamically, with NO big horizontal video (your new rule), film only vertical.
4. **Method (`Method.tsx`) — de-clunked.** Five stages, the active one advances as you scroll (no sticky pin → that was the clunk), gold fill transitions smoothly via CSS. *Why:* you liked the idea but hated the clunk; the sticky pin was the cause.
5. **Contact circle (`ContactCircle.tsx`) — kept.** The loved expanding-circle "Let's create" close.
6. **Removed entirely:** the mouse-following gradient shader, the draggable film "toy", every big horizontal autoplay video, the italic-serif/cursive accent font (banned in CSS + memory). *Why:* you called each "horrible / horrendous", and they were the WebGL bits that never landed.

**What I CONSIDERED and REJECTED:**
- A full single-WebGL-canvas world (one persistent R3F canvas) — built it, but the WebGL moments (gradient glow, draggable toy) were exactly what you hated, and the DOM circle was what you loved. So I dropped WebGL and went DOM-smooth (clip-path/transform reveals) which is what's actually landing. WebGL stays available for a targeted future effect, not as the backbone.
- A horizontal film strip / big showreel — rejected by the new "no big films" rule; replaced with stills + one vertical reel.
- Keeping the sticky-pinned Method — rejected (the clunk).

**The core lesson I'm taking:** stop reproducing the reference LAYOUTS. The references are the quality bar; the wins come from inventing original moments (knockout name, expanding circle, brand cascade) on a dark+gold, one-font, buttery-smooth canvas.

**Still to do (this pass):** an adversarial polish review (is it high-end/original/smooth enough?), tune the Harry scene (portrait reveal, needs your real photo), and confirm scene-to-scene transitions feel like one continuous smooth piece. BLOCKED on you: real Harry photo + real email/social URLs.

---

### POLISH PASS (after the adversarial review — what I changed and why)

I ran a multi-agent adversarial review of the built page. It scored the craft a 7 and the motion an 8, confirmed every hard rule passes, and confirmed performance is good (60fps, CPU not cooked, no WebGL). It then flagged seven specific things keeping it off "unbelievably high-end." I fixed all seven and re-verified the whole scroll with Playwright (and checked the *computed* styles, not just the screenshots, so I wasn't fooled by the Turbopack stale-CSS bug again).

**The seven fixes:**
1. **Desktop dead space (Statement).** The statement sat in a narrow left column with ~35% of the screen empty on the right. Rebuilt it as two columns: the monumental line on the left, a tall film still on the right that wipes open and parallaxes as you scroll. Now the composition uses the full width.
2. **Murky media (Work).** The film stills + the vertical reel read underexposed on the near-black surface. Added a mild brightness/contrast/saturation lift to all of them, so they read as deliberate cinema, not as mud.
3. **Bigger reel.** The one vertical reel was too small (300px). Bumped to 380px and gave it a warm gold hairline so it reads as the hero piece of the work section.
4. **Invisible ghost cascade (Work).** The outlined "ghost" brand row was at 45% and basically disappeared. Raised the outline to 70% so both brand rows are legible, and increased the slide distance so the cascade actually moves.
5. **Gold went olive at scale.** The accent gold (#bfaa53) muddies toward olive when it's huge on black. Added a brighter display gold (#cdb86a) used only on the big gold phrases (WORTH REMEMBERING, the WORK, WALLIS, work). Small accents/fills keep the original gold.
6. **Method left-hug void.** The "how we work" list hugged the left with the same empty right column. Added a giant outlined numeral (01–05) on the right that slides + fades in each time the active stage changes as you scroll. Fills the width AND adds a second piece of scroll-driven motion.
7. **Nav legibility.** Added a soft top scrim over the hero so the fixed nav always stays readable over the footage, and lifted the hero content above it.

**What I CONSIDERED and DEFERRED (deliberately, not forgotten):**
- **Circle-wipe transitions between every section** (the "let's create can go away and reveal the next scene" idea). I built the page so the expanding circle is the finale. Turning it into a transition that fires between *every* section is a bigger motion system, and the last time I added ambitious unverified motion it re-introduced the clunk you hated and broke things. With you away, I chose to ship a clean, verified, working page over gambling the working state on a half-built transition system in the last stretch. This is the clearest, safest next iteration to do *with* you in the room.
- **One shared visual thread** (a recurring gold ring / no hard black gaps between sections) — same reasoning. Worth doing, but as a deliberate next pass, not a rushed one.

**One thing I FLAGGED but did NOT change (your call):**
- The top-left **nav logo is still the script/handwritten "HW media" mark** (`/logos/hwmedia-dark.png`). You banned the handwritten *font* in the page type, and I've kept the page 100% clean of it (verified: the banned font is absent from the DOM, everything is Archivo). But that logo is a **brand-image asset in the global nav**, not a font choice inside the About page — so replacing it is a brand-identity decision across the whole site, not a polish fix in my remit. The footer already uses a clean Archivo "HW MEDIA" stamp, so there's an inconsistency. If you want the script mark gone too, say the word and I'll swap the nav logo for a clean "HW MEDIA" wordmark to match the footer. I didn't want to delete your brand mark on my own.

**Verification:** `tsc` clean. Full-scroll Playwright capture at 1440px read end-to-end. Computed styles confirmed: display font = Archivo (not the stale Hanken), gold-lg = #cdb86a, ghost stroke = 70%, banned accent font = absent. Performance unchanged (no WebGL, no always-on canvases).

**The honest state:** this is now a genuinely original, high-end, smooth, dark+gold, one-font About page that obeys every rule you set — name made of footage, monumental scrubbed statement, kinetic brand cascade, Harry, a method section that finally fills the frame and moves, and the loved expanding-circle close. The two deferred items (circle transitions, shared thread) are the path from "high-end" to "unforgettable," and they're safest to do together when you're back.
