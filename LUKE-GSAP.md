# lukebaffait.fr — full GSAP inventory

Pulled from his live bundles (`index.js`, `core-renderer.js`, `hero-project.js` + vendor). GSAP **3.12.5**.

## The stack he loaded
- **gsap** core (3.12.5)
- **ScrollTrigger**
- **Observer** (wheel/touch/drag detection)
- **Lenis** for smooth scroll — *not* ScrollSmoother
- **No SplitText, no ScrollSmoother, no Flip/Draggable** vendor files
- A separate **WebGL renderer** (`core-renderer.js`) for image/media effects — not GSAP

## Smooth scroll = Lenis, tuned heavy
- `new Lenis({ lerp: 0.06 })` — that low lerp (0.06) is the whole "buttery" feel. (HW is ~0.085 = snappier. Drop it toward 0.06–0.07.)
- Defaults otherwise: `smoothWheel: true`, vertical, wheelMultiplier 1.
- Synced to GSAP the canonical way: **`ScrollTrigger.scrollerProxy`** + drive Lenis from **`gsap.ticker`** + call **`ScrollTrigger.update`** on Lenis scroll. This is what makes scroll position and ScrollTrigger agree perfectly (no lag/jitter).

## ScrollTrigger usage
- `ScrollTrigger.create` ×11 — the triggers
- `ScrollTrigger.refresh` ×5 — recalc on resize/content load
- `scrollerProxy` ×1 (the Lenis bridge), `ScrollTrigger.update`, `register`, `matchMedia`/`clearMatchMedia`, `isInViewport`/`positionInViewport`, `enable`/`disable`/`killAll`/`config`/`defaults`
- Config keys he actually uses: **`scrub` ×14 (dominant)**, `endTrigger` ×3 (chains one element's range to another), `pin` ×1, `anticipatePin`, `snap`, `toggleActions`
- **Takeaway:** almost everything is **scrubbed** (animation tied directly to scroll), barely any pinning. That's why it feels continuous, not "play-on-enter" poppy.

## GSAP methods
- `gsap.set` ×42 (state before animating), `gsap.to` ×15, `gsap.timeline` ×11, `gsap.fromTo` ×3
- `gsap.quickTo` ×4 — fast pointer/cursor-follow tweens
- `gsap.killTweensOf` ×7 — kills running tweens before re-firing = clean, jank-free interrupts
- `gsap.utils` ×3 (clamp/mapRange/interpolate), `gsap.ticker` ×3 (RAF), `gsap.getProperty`, `gsap.registerPlugin`

## Eases (restraint — no bounce/elastic/back)
- `'none'` ×34 — because scrubbed motion maps **linearly** to scroll
- `'power3.inOut'` ×13, `'power2.out'` ×12, `'power3.out'` ×8, `'power2.in'` ×8, `'power2.inOut'` ×2, plus one each `'power4'`, `'expo'`

## Animated properties / techniques
- **`clipPath` ×18** — masked reveals/wipes (a big part of the section-to-section feel)
- **`yPercent` ×18 / `xPercent` ×11** — transform-based, GPU, responsive movement
- **`filter` ×8** — blur/brightness transitions on scroll
- `stagger` ×7, `transformOrigin`, `force3D` (GPU), `willChange` (perf hint), `scaleX/Y`, `autoAlpha`, `skewX`, `rotation`/`rotationX`/`rotationY`
- `Observer.observe` — directional wheel/touch detection

## How to match it on HW (same stack already in place)
1. **Lower Lenis lerp** to ~0.06–0.07 in `SmoothScroll.tsx` / `lib/lenis.ts`.
2. **Bridge Lenis ↔ ScrollTrigger** with `scrollerProxy` + `gsap.ticker` + `ScrollTrigger.update` if not already wired.
3. **Favour `scrub` over play-on-enter**; reserve `pin` for the one or two moments that need it.
4. **Section transitions = scrubbed `clipPath` masks + `yPercent` drift + `filter: blur` + `stagger`**, eased `'none'` while scrubbing (or power2/power3 for non-scrub).
5. Use **`killTweensOf`** before re-firing hover/section tweens to kill jank.
6. Keep eases to **power2/power3 in/out** only — no bounce/elastic (matches the restraint).
