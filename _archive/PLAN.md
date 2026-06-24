# HW Media — Fix Plan (v3, from your feedback)

**North star: auteurstudios.au.** Strip it right down. Minimal, clean, lots of calm space, **left-aligned**, **one idea per screen**, **slow quiet motion**, **consistent fonts**. The site is too noisy and too fast right now. Less, but better.

**I will not write code until you OK this.** Then ONE item at a time, in order, screenshot it, show you, stop, wait for your go. No "it's fixed" without proof. Stays local — no Vercel push.

---

## A. Things I broke / overreached on (revert these)

| # | What | Fix |
|---|---|---|
| **A1** | **I changed fonts across the whole site without being asked.** You only asked why the FAQ font differed — I shouldn't have touched anything else (incl. "Break the Ordinary"). | Restore the original type. ONE consistent type system, the look you had. |
| **A2** | **Letters are gapped/spaced out** (the expanded display face). | Kill the letter-gapping — tighten it so words read as solid, clean type. |
| **A3** | **"Start Here" button is still a different font/style** (nav vs footer), and I kept failing to fix it. | Make EVERY "Start Here" identical to the nav links (Work/About/Contact) — same font, size, weight, treatment. |
| **A4** | **Horrible vignette (dark edges) around the showreel.** | Remove it completely. |
| **A5** | **I sped the animations up.** The Our Work (artwork) and Our Process effects are ridiculously fast. | Make them **much slower** — slow, deliberate, premium. |
| **A6** | **I churned the section gaps.** | Do spacing as one deliberate pass (A7). |
| **A7** | **Too much empty black/white space between sections** — it takes too long. | Condense the gaps. Tight, calm rhythm between sections. |

## B. Sections — exactly what each should be

| Section | What it should be |
|---|---|
| **Hero** | "Break the ordinary." + "we go where the story is" + "Book a call with us" all **in line and matched** (one alignment, one set, not three mismatched styles). No vignette. The motto should **interact with the footage** (you mentioned a reference — if you send it I'll match it exactly; otherwise I'll do a clean restrained version). Footage should not lead with a red light (gold only). |
| **Lens** | Auto-plays. Needs to feel **deep** — falling far into the lens, not a shallow zoom. No tilt. |
| **Our Work** | Keep the reveal you liked, but **much slower**. |
| **Our Process** | **Much slower** — right now the whole thing scrolls and the effects fire too fast to make sense. Slow, legible, no letter-debris. |
| **Reviews** (rename from "Testimonials") | Copy **auteurstudios**: ONE review on screen at a time (carousel), numbered 1·2·3, a large clean quote, small attribution, **left-aligned and all in line**. Kill the half-width underline. Calm and minimal — strip the noise. |
| **FAQ** | Run it **back to the scroll-effect version** (the earlier one). It's completely broken now. |
| **All sections** | Auteur restraint — less on screen, more space used well, quiet fade/reveal motion, left-aligned, consistent. |

## C. Housekeeping
- Clean the working folder noise: remove `_audit/`, `_gsap-skills/`, stray plan files. Working dir = `Sites/HW Media Rebuild` (branch `rebuild`).

## D. Lower priority (after A + B)
- Grade the hero footage (lift blacks, contrast/warmth).
- Real photo of Harry (you send it).

---

## Order I'll work in (one at a time, show you each)
1. **A1/A2 fonts** — restore original type + kill letter-gapping (everything consistent).
2. **A3 Start Here** — match the nav links everywhere.
3. **A4 vignette** — remove from the showreel.
4. **A5 slow down** Our Work + Our Process animations.
5. **A7 condense** the gaps between sections.
6. **Reviews** — rebuild auteur-style (rename, carousel, aligned, underline fixed).
7. **FAQ** — back to the scroll-effect version.
8. **Lens** — deeper.
9. **Hero** — align the three elements; motto interaction (your ref).

---

**Your move:** is this right? Change anything, or say "go" and I start at #1 and show you before moving on.
