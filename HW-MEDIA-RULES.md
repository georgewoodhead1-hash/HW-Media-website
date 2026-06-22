# HW Media — Rules & Audit (single source of truth)

Built from every piece of George's feedback so far. Read this before touching the site so we stop going against what's agreed.

---

## GOLDEN RULES (never break these)

**Fonts**
- ❌ NEVER the military monospace font (`label-mono` / IBM Plex Mono). KILLED — `.label-mono` and `.bar-label` now render in DM Sans.
- ❌ NEVER the handwriting font (Caveat / `font-hand`) for anything prominent.
- ❌ NEVER a different "special" font for one phrase (e.g. the old italic on "break the ordinary").
- ✅ Clean **DM Sans** (`var(--font-dm)`) for nav, buttons/CTAs, labels, small text — the font George likes (the "Films, not content" paragraph font).
- ✅ **Archivo** (`font-display`) for big headings.
- ⏳ TODO: confirm the exact **auteurstudios** font George wants for buttons (couldn't scrape it; using DM Sans as the clean stand-in until he names it).

**Colour**
- ❌ NO red anywhere. Gold = `#bfaa53` (`var(--gold)`).
- In the finale line, ONLY the word **"break"** is gold; everything else white.

**Motion (the recurring failure)**
- Everything **slow, scroll-tied (scrubbed), smooth** — the Our Work accordion is the benchmark. No fast snap-ins.
- More GSAP, **seamless like Framer**. The site currently feels **sticky/clunky** — must fix.
- The **type-across / typewriter effect** (from the finale) belongs on the major headings: **Tell us what you think, Our work, Trusted by, Films not content** (NOT the process).

**Content**
- Keep it **simple** — don't go overboard with text/labels/subtext.
- Don't delete files without asking — report what conflicts.

---

## SECTION SPEC (what each must be)

| Section | Canonical look | Status |
|---|---|---|
| **Lens intro** | Auto-plays one smooth realistic zoom on load; **locks scroll until done**; then releases | ✅ done |
| **Hero "Break the ordinary"** | Middle-left, raised; caption under it; bigger "Get in touch" CTA in DM Sans | ⏳ pending |
| **Mission "Films, not content"** | Less top/bottom padding, BIGGER type, no gold corners, typewriter heading | 🟡 slimmed; needs bigger + typewriter |
| **Trusted By** | Two rows, dim-by-default + hover→white+grow, typewriter heading | 🟡 rows+hover done; +typewriter |
| **Our Work** | **Accordion is the final layout**; bars fly in from the right + stack; seamless/luxury (not fast fade); heading sits above; typewriter | 🟡 accordion+slide-in done; smooth it + typewriter |
| **Our Process** | 4 films start in the corners → converge to a row; letters assemble (hidden till pin); NO subtext; **We plan / We film / We edit / We deliver**; bar fades in + synced to active clip | ✅ rebuilt |
| **Testimonials** | "Tell us what you think"; **click-to-select 1/2/3**; quote + role/sector + brand logo bottom-left; **clickable video → that project**; typewriter heading | 🟡 hover-version built; switch to click + link-to-project |
| **FAQ** | "**FAQ's**" (apostrophe), sat **in line with the video** (lower + slightly right) | ⏳ pending |
| **Finale** | "Every film is a chance to break the ordinary" — one font, only "break" gold, typewriter; footer rises (email, IG, LinkedIn, copyright, privacy). **Permanent bottom, never moves** | ✅ font fixed |
| **Work page** | Tiles **flush (no borders/gaps)**, **all videos playing at once**, **client LOGO not title text** (McLaren logo, not "McLaren Artura"); click → detail (storyboard + brief); **expand each brief with real brand research** (e.g. Chasing the Salt = Norton bikes, salt-flats speed run) | ⏳ pending |
| **Theme toggle** | Move to **bottom-left next to the socials**; restyle with a **ring** so it's obvious | ⏳ pending |
| **Nav** | Flat Work/About/Contact + Start Here; logo always visible; IG/LinkedIn bottom-left | ✅ done |

---

## DEAD / CONFLICTING FILES (report only — your call to delete)

These components are **not imported anywhere** and are leftovers from earlier iterations. They use the old fonts/red and conflict with the rules above. Safe to delete once you confirm:

- `src/components/home/Statement.tsx`
- `src/components/home/AboutHarry.tsx`
- `src/components/home/Praise.tsx`
- `src/components/home/Films.tsx`
- `src/components/shell/MenuOverlay.tsx` (old hamburger menu — removed)
- `src/components/shell/EdgeLabel.tsx` (the "EST 2018" label — removed)
- `src/components/work/WorkCard.tsx` (old work card — replaced by the grid)

Plus stray docs at the repo root from earlier (`PLAN.md`, `PLAN-LAB.md`, `COPY.md`, `TASTE.md`, `CLAUDE-DESIGN-HANDOFF.md`, etc.) that predate the rebuild.

---

## OUTSTANDING ACTIONS (priority order)

1. **Scroll smoothness** — kill the sticky/clunky feel, seamless like Framer (whole-site feel).
2. **Typewriter headings** — Tell us what you think · Our work · Trusted by · Films not content.
3. **Work page** — flush tiles, all playing, client logos, expanded briefs.
4. **Theme toggle** — bottom-left by socials + ring style.
5. **Hero** — middle-left, caption, bigger CTA.
6. **Mission** — bigger type, less padding.
7. **FAQ** — "FAQ's", in line with the video.
8. **Testimonials** — click-to-select + clickable video → project.
9. **Our Work** — smoother/luxury slide-in, heading above.
