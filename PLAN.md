# HW Media — Master Build Plan (current)

**This file is the single source of truth.** Every change references an item here. Nothing gets built outside this plan. No "done" without a screenshot proving it. If George changes a requirement, it is edited HERE first, then built.

> Supersedes the old v2 plan (2026-06-13) which wrongly listed the camera intro as "locked/approved" — it is not; George has rejected it and it is the #1 job.

---

## 0. How we work (the method)

1. **Plan first.** Anything non-trivial goes in this file *before* I touch code.
2. **One item at a time, in priority order** (Section 3). No jumping around, no scope creep.
3. **Verify every change with a real screenshot** before calling it done — I paste the proof.
4. **Never claim "done" on anything I haven't shown working.** Can't prove it → it's 🟡 or ⛔, not 🟢.
5. **Localhost is the review surface:** `http://localhost:3011`. Push to GitHub at the end of a clean, verified batch (or when George says).
6. **If George says it's wrong, it's wrong.** I re-open the item here and fix it — no arguing.

---

## 1. Project facts

| | |
|---|---|
| Site | HW Media — London cinematic film **production company** (NOT agency, NOT "content") |
| Director | Harry Wallis — shoots every project himself |
| Stack | Next.js 16 (App Router), React 19, TS, Tailwind v4, **GSAP 3 + ScrollTrigger + SplitText**, Lenis smooth scroll |
| Local | `http://localhost:3011` · Repo branch `main` → GitHub `georgewoodhead1-hash/HW-Media-website` → auto-deploy Vercel `hw-media-website-y7yi` |

---

## 2. Golden rules (non-negotiable)

- **Gold only (`#bfaa53`). NEVER red** — including footage. A clip leading with a red light gets graded out or swapped.
- **Films, not "content". Production company, not "agency".** They travel and shoot on location.
- **Real fonts:** Archivo (display), Hanken (body), **BR Firma SemiBold** (CTAs/labels), IBM Plex Mono (micro labels). Never lookalikes.
- **Motion doctrine — "set pieces + calm between":** spectacle at the intro / films / process / finale; quiet editorial between, but *every* element still enters (masked rise, unclip, drawn rule). Slow, heavy, smooth, scroll-tied. Ease-out exponential. **Never parks. No abrupt stops.** Benchmark feel = the Our Work accordion.
- **The lens circle is the one connecting motif** — intro lens → films → finale ring. Open and close on the lens.
- **Sections overlap seamlessly** — never a hard black gap.
- **One idea per screen, vast space**, big type only for the hero motto + film titles.
- **Dark default + working light toggle.** Hero/cinema sections stay dark always.

---

## 3. OPEN — priority order (work top-down)

Keys: 🔴 broken/not started · 🟡 in progress · 🟢 done+verified · ⛔ blocked on George

### P1 🟢 Camera / lens intro — REBUILT as a scroll-driven fall-through
Rebuilt with **GSAP ScrollTrigger** (per George's direction). It is no longer an auto-play that flashes past or hides behind the loader — it is **scroll-scrubbed**: a real cine lens hangs in the dark at rest (with a "Scroll" cue); as you scroll you **fall through the barrel** (rig accelerates forward, the three glass planes blow past one at a time with motion blur), landing **dead-clean** on the full-frame showreel (no zoom), then the motto rises and holds. You control it with your scroll, so it can never flash past or hide. CSS-sticky stage + scrub (not ScrollTrigger pin) to stay smooth under Lenis. Verified frame-by-frame.
- *If George wants it tuned:* longer/shorter fall, more/less spin, different resting pose — all easy now that the structure is right.

### P2 ⛔ Hero motto "Break the ordinary" — interaction
Currently solid (clean, legible). The footage-knockout = the dark box George already rejected (it boxes on bright frames; multiply can't make the surround transparent). **Blocked on George's reference** for the exact "interact with the background" look. Stays solid until then.

### P3 ⛔ Real photo of Harry (About)
Old "Harry" image was a duplicated mountain; swapped to an on-location person as a **placeholder**. **Blocked:** need a real Harry headshot (one colour, I derive greyscale). Hover grey→colour already works.

### P4 🔴 Final full-site review pass
After P1: one slow end-to-end review (desktop + mobile, dark + light), fix anything that doesn't feel premium, capture proof, then push.

---

## 4. Blocked on George (please send)

1. **Reference for the camera-lens feel** (P1) — most useful single thing.
2. **Reference for the "Break the ordinary" interaction** (P2).
3. **Real photo of Harry Wallis** (P3).
4. Confirm **client-retention %** (placeholder 96%).
5. Real **booking link** (Calendly placeholder now).
6. **Land Rover / Defender films** if they go in the work grid.

---

## 5. Spec + status — by section

Home order: `Lens intro → Mission → Stats → Trusted By → Our Work → Our Process → Testimonials → FAQs → Finale/Footer`

| Section | Status | Notes |
|---|---|---|
| **Lens intro (hero)** | 🟢 | scroll-driven fall-through-the-lens (GSAP ScrollTrigger), lands clean/no zoom, motto rises + holds. Motto interaction still solid (P2). |
| **Mission** | 🟢 | quiet statement |
| **Stats** | 🟢 | 5 / 150+ / 96% count-up (96% placeholder) |
| **Trusted By** | 🟢 | TWO rows opposite directions; "TRUSTED BY" spaced + bigger |
| **Our Work** | 🟢 | 6 films, fly-in accordion, no bars, Zuma renders. Hover-expand: code correct, needs a hover-frame to fully prove |
| **Our Process** | 🟢 | assembles clean (garble fixed), stages crossfade, playhead, outro |
| **Testimonials** | 🟢 | heading + gold underline (not clipped), selectors, quote + attribution, 3:4 portrait, no bars |
| **FAQs** | 🟢 | reel stays full + in place, fades in place late (no cut/shrink/early gap); click accordion |
| **Finale/Footer** | 🟢 | gallery → closing line; email cleared of toggle; socials + CTA |
| **Nav** | 🟢 | ring-on-hover, gold/black logo per mode, Start Here CTA, legibility scrim |

Pages: **/work** 🟢 (greyscale+play-on-hover code correct; needs clean grid + hover capture) · **/about** 🟢 heading "Who's behind the camera" + true 3:4 film; ⛔ Harry photo placeholder (P3) · **/contact** 🟢 · **/work/[slug]** 🟢

---

## 6. Decisions log (so we stop re-litigating)

- **Motto knockout = rejected** — boxes on bright frames; motto stays solid until a reference defines the interaction.
- **No zoom at lens landing** — rig lands at scale 1 (native), not 1.4.
- **Dive plays AFTER the loader lifts** (`hw:reveal`), else it's invisible behind the veil.
- **Hero footage regraded** to remove the red traffic light (gold-only rule).
- **About vertical film = a true 720×960 clip** (salomon-p), not a square crop.
- **All film clips + posters cropped** to remove baked letterbox bars (verified at strict threshold).

---

## 7. References (George's stated DNA)

podium.global (buttery scroll) · lukebaffait.fr (restraint, tiny type, vast space) · bennettandclive.com (huge type over full-bleed footage) · oceanfilms.com.br (film + single ring) · auteurstudios (BR Firma, gold). Motion benchmark = the Our Work accordion.

---

*Last updated by Claude. Requirement changes are edited HERE first, then built.*
