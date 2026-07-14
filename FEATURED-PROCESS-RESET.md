# RESET PLAN — Featured → Our Process (14 Jul 2026)

George's call. Compact after reading this, start fresh, execute this file.
This is the honest version, written to be critical of the current work — not
to defend it.

---

## PART 1 — WHERE I (the last session) WENT WRONG. Read this first.

**1. I verified still screenshots, never motion.** Every "verified / done" I
gave came from frozen frames. George's complaints are ALL about movement —
"it clicks and clunks", "the transition is weird", "stop-start", "too quick",
"takes too long". None of that shows in a still. So I repeatedly declared
things fixed that he could plainly see were broken. This is the root failure.
FIX: never claim a motion fix from a screenshot again. Record the scroll to
video, cut it to a filmstrip with ffmpeg, and watch the sequence. See Part 5.

**2. The hera "square" is built the wrong way and cannot be tuned into
looking good.** I animate a box from a tall rectangle to a square by changing
its width/height. The video inside is `object-cover`, so the CROP changes as
the box reshapes — the picture squishes and re-frames mid-move. That is why
"rectangle → square is really weird." It is inherent to the method. Rounding,
slowing, widening the window — none of it fixes a re-cropping video.

**3. The whole Featured → Process hand-off is a house of cards.** It is: a
cloned tile (`.ow-heroclone`) that fakes the hera tile, living in `OurWork`,
animated across a section boundary into `Process` (a *different* component),
glued with a negative-margin "dead zone" overlap hack, syncing TWO separate
`<video>` elements frame-by-frame so the swap looks seamless. Every fix risks
breaking the next thing because it is held together with tape. That is why it
keeps "going backwards."

**4. I kept adding cleverness when the target is simple.** monolog and 1820
are restrained. I built a clone match-cut, a curtain reveal, dead-zone
remapping, a 3D lens dive. Complexity is what makes it clunk. The job was
smooth and simple; I made it elaborate and fragile.

**5. I patched parameters instead of rebuilding.** Ten rounds of nudging
smoothstep windows (`sm(0.44,0.6)` → `sm(0.4,0.6)` …) on a broken foundation.
That is rearranging deck chairs. The foundation is the problem.

---

## PART 2 — WHAT IS ACTUALLY FINE. Do NOT touch these.

Per George, on the home page:
- The **horizontal strip once you're in it**: Production → Edit → Deliver
  travelling side by side, words parking at centre. This works. Leave it.
- Deliver → Testimonials **as a mechanism** (a curtain/gradient reveal) is the
  right idea — but the timing is wrong (see Part 4).
- Everything else on the page is not in scope for this reset unless George
  says so: loader, hero showreel, Trusted by, What we do grid (2×4
  slot-machine), FAQs, story band, footer, About panel.

---

## PART 3 — WHAT IS ROTTEN. Rebuild this from scratch.

**The entire entry into Our Process:** Featured Projects tiles → the tiles
dropping away → the hera tile becoming a square → growing to full-bleed →
the "Our Process" title → arriving at the first film frame (Pre-production).

Everything from the Featured grid up to "you are now on the Production strip"
is the rotten chunk. Delete the clone/dead-zone/frame-sync machinery and do
it again, simply.

### The simpler approach to build instead (concrete)

The core mistake is reshaping/moving a video. Don't. Instead:

1. **One component.** Put the Our Process intro and the strip in a single
   pinned section, or make the hera reveal the literal first panel of the
   strip. No cross-component clone, no `-mt` dead-zone overlap, no two-video
   frame-sync.

2. **Reveal, don't reshape.** The hera film sits at a FIXED full-bleed size
   the whole time. A clip-path (or mask) starts at the hera tile's rectangle
   and grows — tile → square → full screen. Because the video never changes
   size, it never re-crops. No squish. (This is exactly the clip-reveal that
   works on the What we do tiles — reuse that idea.)

3. **Sequence, cleanly:**
   - the other 5 tiles drop away (Salomon drops with the two on the right —
     Nike + Castle Air — not as a lone straggler), leaving hera;
   - the hera clip snaps/eases to a **square** (fixed video revealed through a
     square window), holds a beat;
   - **"Our Process"** fades in over the square, holds;
   - the square window grows to full screen as "Our Process" fades out — the
     corners travel to the screen edges;
   - the moment it fills the screen, it IS the Production/first frame (same
     fixed video), and the word writes itself on IMMEDIATELY — no dead scroll.

4. **No rounded corners** anywhere in this (George).

5. **Seamless means literally the same element.** Because the full-bleed hera
   IS the first frame (not a clone handed to a twin video), there is nothing
   to sync, nothing to darken, nothing to zoom. If it's one element, the
   "click into the next stage" George hates cannot happen.

Sanity check before building: if the plan still contains the words "clone",
"dead zone", "frame-sync", or "-mt overlap", it's the old broken approach.
Start over.

---

## PART 4 — TWO SPECIFIC TIMING FIXES (separate from the rebuild)

**A. Testimonials appear too quickly.** They currently start composing while
Deliver is still on screen. Delay the reveal so it lands on the TAIL END —
after the Deliver word/film has finished its beat. The testimonials should be
the payoff at the very end, not something already happening.

**B. The Deliver gradient must be on the tail end.** George: "the deliver
gradient needs to be on the tail end of the last bit, at the end of the word
/ the film." So the soft dark gradient that reveals the testimonials should
kick in only at the END of the Deliver frame — as its word/film finishes —
gradually uncovering the testimonials. Right now the gradient/reveal is timed
too early and overlaps the Deliver content. Move it to the tail.

Net: Deliver plays fully → at its tail, the gradient sweeps → testimonials
revealed. One thing at a time, not everything at once.

---

## PART 5 — HOW TO VERIFY (the thing I got wrong)

Stop trusting single screenshots for motion. For anything animated:

1. Record the scroll with Playwright video (`recordVideo` on the context) OR
   capture a DENSE filmstrip — a frame every ~80–120ms while wheel-scrolling
   at a realistic cadence (`page.mouse.wheel`, NOT scrollTo; Lenis needs it).
2. Stitch frames into a contact sheet with **ffmpeg** (it's installed; the
   old `_audit/` rig did exactly this) and actually look at the sequence as
   motion, not one frozen point.
3. Test in Chrome (George is on Chrome — but build so it's smooth on Safari
   too; don't hand-wave browser differences).
4. Only call a motion change "done" after watching the sequence, and say
   plainly when something needs George's eye because feel can't be measured.

---

## PART 6 — STATE / POINTERS FOR THE FRESH SESSION

- Project: `Sites/HW Media Rebuild`. Branch `rebuild`. Dev: `npx next dev -p
  3006` → http://localhost:3006. **Run it detached** (it kept getting killed
  mid-session — that was the "crashing", not a code bug; the hero showreel is
  fine, it just couldn't load while the server was down).
- Push dance: `gh auth switch --user georgewoodhead1-hash && git push origin
  rebuild; gh auth switch --user squirrelsneststay-beep`.
- Files in scope: `src/components/home/OurWork.tsx` (Featured + the rotten
  clone), `src/components/home/Process.tsx` (strip + dead-zone + testimonials
  wiring), `src/components/home/Testimonials.tsx` (compose timing).
- Current HEAD `cdf8785` is the state to REBUILD from — the clone/dead-zone
  approach in OurWork.tsx + Process.tsx `-mt-[40vh]` / `DEAD` / hw:tst is the
  machinery to rip out for the intro. Keep the strip travel + panels.
- Gotcha: after editing `globals.css`, kill :3006, `rm -rf .next`, restart
  (Turbopack serves stale CSS otherwise).
- Loader wait for Playwright: ~8s (3D dive), use `waitForTimeout(11500)`.

## PART 7 — ORDER OF WORK (fresh session)

1. Build the scroll→video→ffmpeg filmstrip harness FIRST. Don't animate
   anything until you can watch motion.
2. Rip out the clone/dead-zone/frame-sync intro. Rebuild the Featured → Our
   Process entry as ONE component with a fixed full-bleed hera video revealed
   through a growing clip (Part 3). Verify as motion.
3. Fix testimonials timing + Deliver tail gradient (Part 4). Verify as motion.
4. Only then show George. Be honest about what's measured vs what needs his
   feel.
