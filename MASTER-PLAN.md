# HW Media — Master Build Plan

Combines three inputs: **Harry's client call** (23 Jun), the **premium-gap analysis** (why lukebaffait feels better than ours), and the **reference DNA** (auteur / bar / luke). A checkpoint of the current site is tagged before any of this starts, so we can always roll back.

## Goal in one line
Make HW feel like lukebaffait: **premium, effortless, continuous.** That is won by **motion + restraint first**, then Harry's tactical fixes layered on top. Do the tactical list without the foundation and it still feels cheap.

---

## Why luke feels premium and ours doesn't (5 root causes → the work)

1. **Responds to you (scrub) vs performs at you (play-on-enter)** → rewrite motion to scrub.
2. **One idea per screen vs everything at once** → strip the noise, subtract.
3. **One continuous thing vs a stack of boxes** → morph the seams (clipPath/blur), kill hard edges.
4. **Ruthless consistency vs patchwork** → one type + motion + palette system.
5. **Weight + slow pace vs light + rushed** → Lenis lerp ~0.065, slow deliberate timing.

---

## PHASES (build order)

### Phase 1 — Premium motion foundation  *(biggest lever, do first)*
- **1.1** Lenis lerp → ~0.065 for weight/inertia. `SmoothScroll.tsx` / `lib/lenis.ts`
- **1.2** Bridge Lenis ↔ ScrollTrigger: `scrollerProxy` + drive from `gsap.ticker` + `ScrollTrigger.update` on scroll (perfect sync, no lag).
- **1.3** Convert section entrances from **play-on-enter → scrub** (motion tied to scroll position).
- **1.4** One motion language: eases = `power2/power3` in/out, `'none'` for scrubs; one duration set; remove per-section speed drift.
- **1.5** Section **seams → scrubbed clipPath mask + yPercent drift + subtle blur** (continuous, no hard box edges). Lens intro + finale stay untouched; apply morph seams between the rest.
- **Verify:** continuous slow-scroll capture = no pops, no parks, no hard cuts.

### Phase 2 — Restraint pass  *(subtract)*
- **2.1** One idea per screen: cut competing elements (fewer FAQ rows visible at once, trim marquee/stat density).
- **2.2** One type system: lock display + body scale, consistent everywhere (no stray sizes/weights).
- **2.3** Palette + colour-blocking done cleanly (bar / "Outer Studios" rhythm); bands intentional, not patchy.
- **2.4** More negative space, bigger scale contrast on the one thing that matters per screen.

### Phase 3 — Nav  *(Harry)*
- **3.1** ✅ contrast/toggle bug (done)
- **3.2** Hover = a single outlined **pill that slides** between items (auteur), not per-item rings.
- **3.3** **Hide on scroll-down, show on scroll-up**, whole site.
- **3.4** Logo slightly **bigger** (stays top-left).
- **3.5** **Scroll-down indicator** that disappears after the first scroll (desktop + mobile).

### Phase 4 — Featured Projects  *(Harry)*
- **4.1** ✅ renamed to Featured Projects
- **4.2** Brand **logos instead of text labels**; text only on hover/expand.
- **4.3** Thumbnails **9:16, colour** *(needs Harry's thumbnails)*.
- **4.4** All tiles load together fast, **lower rows reveal on scroll**.
- **4.5** **"Discover More"** button under the grid.
- **4.6** Grid order per **Harry's WhatsApp hierarchy** *(needs the hierarchy)*.

### Phase 5 — Process  *(Harry)*
- **5.1** Short **subtext under each stage heading** (auteur bullet style).
- **5.2** Push film thumbnails **down** to fill the bottom of the section.
- **5.3** Animation **stays in place** on scroll (no empty screen scrolling back up).

### Phase 6 — Testimonials  *(Harry)*
- **6.1** Rename **"Reviews" → "Testimonials"** (revert my earlier rename).
- **6.2** Three clickable **dots** + brand + short quote (not 01/02/03).
- **6.3** **No auto-scroll** (manual dot clicks only — confirm).
- **6.4** **Conjoin** the "We Deliver" exit with the testimonials entry (one scene) — folds into Phase 1 seam work.

### Phase 7 — Mobile  *(Harry)*
- **7.1** **Hamburger** menu (three lines).
- **7.2** Fix **light-mode edge cut-off** (iPhone full-bleed).
- **7.3** Featured Projects tiles **fade-in on scroll**.
- **7.4** **Static numbers animate** (match laptop fade-in).
- **7.5** Trusted By logos **smaller** (no wide bleed).

### Phase 8 — Contact / footer / confirms
- **8.1** Footer: text → **logo** *(confirm already done)*.
- **8.2** Confirm Trusted By sits **above** Films (B3) and Testimonials has no auto-scroll (E4).

---

## Blocked on Harry
Colour **9:16 thumbnails** + CTA photo (already in the Drive "website stills" folder), the **WhatsApp grid order**, and the **narrated walkthrough** (more copy/feedback coming).

## Rules of engagement
One change at a time. Verify each with a screenshot before moving on. **Never** touch the lens intro animation or the finale. The checkpoint tag is the rollback point.
