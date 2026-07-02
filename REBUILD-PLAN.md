# HW Media Rehaul — Working Plan (2026-07-02)

Bookmark/restore: `git checkout bookmark-2026-07-02-pre-rehaul` (fb39369).
LOCAL ONLY — no GitHub push, no Vercel deploy until George says so.
Rule: verify every step against the RENDERED page (computed styles / geometry / capture) before ticking.

## 0. Display font → Suisse Int'l Condensed  ✅ done when
Headings (`.font-display`, `.about-display`) render Suisse Cond SemiBold 600.
Archivo survives ONLY on contact "Tell us more." heading.
VERIFY: computed fontFamily on hero H1, section H2s = suisseCond; contact H1 = Archivo.

## 1. Gold ration  ✅ done when
Gold appears ONLY: logo, testimonial dots, full stops/periods, tiny accents.
Kill: two-tone "FEATURED **PROJECTS**", gold "TRUSTED BY", gold stats numbers, gold
"MORE.", gold eyebrows, gold buttons (→ cream/white), gold FAQ +/× and numbers.
VERIFY: scan pages for var(--gold) usages; each remaining one is on the approved list.

## 2. P0 defects  ✅ done when (each individually verified)
a. "FILMS,NOT" — ScrollType char-split swallows word spaces → visible space in settled render.
b. Dead black screen between Featured Projects and Process → gap ≤ 20vh, content always on screen.
c. Testimonials pin opens blank → heading+dots visible within first 15% of pin; pin shortened.
d. Dead black screen before finale → tiles enter as section pins (progress 0–5%).
e. Contact loads dim → full opacity on load with no scroll.
f. Hero headline mix-blend-difference → solid cream + scrim; legible over every clip.
g. Featured reveal: tile 1 clipped left + Castle Air misaligned → all 6 tiles aligned, inside viewport.
h. Finale corner pile-up (logo/N-chip/toggle) → no overlaps at rest.
i. Stray gold dot on mobile testimonials/finale → gone at 390px.
VERIFY: re-run _audit scroll captures; 0 dead viewports; geometry checks pass.

## 3. Scroll retune  ✅ done when
Lenis toward 1820 feel: lerp 0.055→~0.09, wheelMultiplier 0.68→~0.9. Feels direct, not floaty.

## 4. Drawn dividers (replace static hairlines between sections)  ✅ done when
New `Rule` component: line scales 0→100% on scroll (scaleX, ScrollTrigger).
All SECTION-separating static hairlines replaced; internal list hairlines may stay.

## 5. Seam pass  ✅ done when
No hard cut at: hero→mission, mission→stats/trusted, trusted→featured, featured→process,
testimonials→defender band, band→FAQs, FAQs→finale. Overlaps/gradients/drawn rules at each.
Helicopter band image → Defender placeholder (harry-field.jpg) with a purpose (line + CTA or removal).

## 6. Route transitions  ✅ done when
Navigating between pages sweeps through dark (template-level overlay), no cold swap, no white flash.

## 7. Process rebuilt from ZERO  ✅ done when
1820 services structure: 01 Pre-production / 02 Production / 03 Post-production / 04 In motion.
Suisse Cond headings, sticky STACKING panels (cards slide over each other), no sky imagery,
gold full stop on "In motion." — testimonials ride re-anchored and landing dead-on (geometry check).

## 8. Featured Projects polish  ✅ done when
Reveal starts later (post-Trusted-By), settles aligned, heading monochrome Suisse Cond,
tiles not clipped at any scroll position.

## 9. FAQs high-end  ✅ done when
10 → 5 questions, larger Suisse type, drawn rules, monochrome markers.

## 10. About polish  ✅ done when
"Service" micro-labels gone; What-We-Do cards have video loops behind on hover;
Harry section jazzed (bigger type treatment / motion); About otherwise free-rein cleanup.

## 11. Work page  ✅ done when
"Discover More" centered; tiles load in with layered choreography; drawn dividers between groups.

## 12. BTS mouse-trail section  ✅ done when
TrailField component (1820 recipe: cursor-spawn past move threshold, cycling images,
clip+scale+fade GSAP, idle auto-pulse that disables on discovery). Placed in About (Behind the camera).

## Parked / needs George
- Vercel deploy + GitHub push (explicitly held)
- Suisse Int'l + BR Firma licences before launch
- Harry's lens loading video (preview → approval → live)
- Harry's voice-note feedback round
