# ROUND 7 — George's fix brief (14 Jul 2026, evening)

Execute top to bottom. One fix at a time, verify each with the Playwright rig
before moving on. George's standard: smooth, no wobble, no dead freezes,
nothing sliding up the page when it should animate in place.

## Context (read first)

- Project: this folder. Dev: `npx next dev -p 3006` → http://localhost:3006
- Branch `rebuild`. Push: `gh auth switch --user georgewoodhead1-hash && git push origin rebuild; gh auth switch --user squirrelsneststay-beep`
- Loader runs ~6.4s on EVERY load — Playwright: goto with `waitUntil: "domcontentloaded"`, then `waitForTimeout(11000)`.
- Lenis smooth scroll: drive with `page.mouse.wheel(0, dy)` loops, NEVER `window.scrollTo`. Viewport: `{ viewport: { width: 1440, height: 900 } }` (the option is `viewport`, not `viewportSize`).
- After editing `globals.css`: kill :3006, `rm -rf .next`, restart (Turbopack stale-CSS gotcha).
- Scripts go in the session scratchpad, run with `cd <project> && NODE_PATH=./node_modules node <script>`.
- Key files: `src/components/home/OurWork.tsx` (Featured Projects),
  `src/components/home/Process.tsx` (strip + embedded testimonials),
  `src/components/home/Testimonials.tsx`, `src/components/home/FeatureBand.tsx`
  (story band), `src/components/shell/TitleRule.tsx`.
- House rules: sticky, never ScrollTrigger pin (a transformed ancestor breaks
  position:fixed). One writer per animated property (two triggers writing `y`
  on the same element fight each other tick by tick — OurWork's `breathe`
  onUpdate is the single bar-transform writer; keep it that way).

## 1. Featured Projects — PIN the exit; it must play in front of you

George: "add a little buffer… it will almost freeze… slow the scroll down…
when I keep scrolling they will NOT move up the page — they do the classic
animation out rather than go up the page."

- Wrap the Featured stage in a sticky window + runway (same pattern as the
  Process strip: outer div with extra height, inner `md:sticky md:top-0
  md:h-screen`). Size the runway ~160–200vh: enough scroll to hold the grid
  and play the whole exit while the section is FROZEN on screen.
- The exit choreography is driven by the runway scrub, not by the stage
  leaving the viewport. It must play right in front of you, complete, and
  ONLY THEN release the sticky so the page moves on.
- The current exit fires too late and the tiles never fully disappear —
  with the pin, drive every tile to full exit (alpha 0 / fully dropped) by
  scrub end.
- Keep the entrance as is (George: "I don't mind how they come in").
- Mind the existing `enter` trigger windows in OurWork.tsx — they reference
  the section top; re-anchor them to the new sticky geometry.

## 2. The exit choreography itself — even pairs + the Hera hand-off

George: "It's not even… the outer ones go down at once, [then] the middle
two and the very middle two. The Hera one should turn into a SQUARE first…
and then it should basically become BIGGER. That should be the START of the
Our Process bit."

- Six bars, indexes 0–5. Pairs drop TOGETHER and EVENLY: {0,5} first, then
  {1,4}, then {3} (index 2 = Hera is exempt). Even timing per pair — no
  wobble. The current version wobbles because drop + breathe-drift + scale
  compose loosely; during the pinned exit, kill the breathe drift entirely
  (freeze q at its current value or fade the drift out as the exit starts).
- HERA (index 2, the tile whose film = `/videos/films/hera-w.mp4`):
  1. First morphs to a SQUARE (animate width/aspect — it's a flex-1 bar, so
     animate `flex-grow`/explicit width + height toward 1:1, centred).
  2. Then GROWS to full-bleed (scale/size up to fill the sticky viewport)
     as the last beat of the pinned exit.
  3. Full-bleed Hera IS the start of Our Process: the strip's frame 1
     already plays hera-w.mp4 — the release of the Featured pin should hand
     straight into the Process runway with the same film filling the screen
     (match-cut). Tune the Process entrance so frame 1 is already covering
     the screen when it pins (it currently builds its word after entry —
     keep that).
  4. The current "condense down + fade" version is WRONG — bin it.
- REMOVE the "Our Process" TitleRule banner above the strip entirely
  (George: "getting in the way"). Delete the TitleRule block from
  Process.tsx (keep the import only if still used elsewhere in the file).
  With the banner gone the two sticky sections sit flush — the match-cut.
- Smoothness: use one scrub, smoothstep windows per pair, transforms only.

## 3. KILL the black bar across Our Process (the embedded Testimonials)

George: "a black bar across the whole of Our Process. I can't even see the
writing. The testimonial section is there and getting in the way."

- Root cause: the embedded `<Testimonials embedded />` section sits in an
  `absolute inset-0` overlay INSIDE the strip's sticky window, and
  `globals.css` has `[data-theme] { background: var(--bg) }` — so the
  section paints its own full-width BLACK background band over the strip
  even while its content is hidden.
- Fix properly: when `embedded`, the section must paint NOTHING until its
  reveal: set `autoAlpha: 0` + `pointerEvents: none` on the section root at
  mount (inside the md matchMedia), flip visible in the `hw:tst` "in"
  handler (before the enter timeline plays), back to hidden on "out".
  ALSO make the embedded variant background transparent (either drop the
  `data-theme` attribute when embedded or add an inline
  `style={{ background: "transparent" }}` that beats the `[data-theme]`
  rule).
- Verify with a screenshot at each strip frame: the frames must be
  full-bleed footage with the words readable — zero black bands.

## 4. Hold the testimonials screen longer

- After the testimonials reveal (`hw:tst` "in" at p≥0.84 of the Process
  runway), there's barely any scroll left before the sticky releases.
  Extend the Process runway (560vh → ~640vh) and keep the reveal at the
  same absolute scroll position (retune the threshold, e.g. fire ~p 0.78
  of the longer runway) so there's roughly 80–100vh of held, readable
  screen time after the content finishes writing in.

## 5. Testimonial layout: 16:9 film right, 4-line quote left

- Film window: aspect-square → **aspect-video (16:9)**. It should take up
  the right side of the page but sit a bit more LEFT than the current
  square (less right-margin hug — try `justify-self-auto` with the grid gap
  doing the separation, or a small negative correction).
- Quote: must wrap to ~4 lines, not 2 — narrow the quote block
  (`max-w-[46rem]` → around `max-w-[30rem]`) and/or raise the type size a
  step so it reads with "more thickness and depth".
- Grid: quote column left, film right, vertically balanced (items-center
  stays). Verify with a screenshot: 4-line quote, 16:9 film, no dead space.
- The reveal choreography (title word rises, lines draw OUTWARD to the
  plusses, quote writes word-by-word, film clip-opens) stays exactly as is.

## 6. FAQs — DONE, do not touch

George: "FAQs are fine now."

## 7. Story band ("Wherever the story is") — start later, never freeze

- It starts building too early (visible expansion begins the moment the
  section edge appears) and there's a dead-frozen stretch at the end of the
  pin (expansion settles at p 0.82, then ~18% of the sticky hold has zero
  motion = the "freeze" George feels).
- Retune the scrub mapping in FeatureBand.tsx: expansion effectively starts
  once the section is properly on its way in (~p 0.25) and is still
  finishing as the pin releases (~p 0.96): e = sm(0, 1, sm(0.25, 0.96, p)).
  Keep the words at the tail (wIn ~0.82–0.93, cIn ~0.87–0.97).
- Keep the GPU scale+counter-scale mechanic (do NOT go back to clip-path —
  that was the scroll lag).
- If a freeze feel remains, shorten the section (md:h-[130vh] → 115vh) so
  the pin never outlives the motion.

## Verification checklist (all of it, before pushing)

1. Wheel-scroll the full home page top to bottom — capture frames through:
   Featured pin + triangle exit + Hera square→grow → Process strip (words
   readable, NO black bar) → testimonials hold (16:9 film, 4-line quote) →
   FAQs → story band (no early start, no freeze) → footer.
2. Scroll back UP through the same — everything must reverse cleanly.
3. `npx tsc --noEmit` clean; light mode sweep still all-flip (toggle
   `document.documentElement.dataset.mode = "light"`, no section stays
   near-black except the hero).
4. Commit with a descriptive message, push (auth dance above), and give
   George the localhost link per section.
