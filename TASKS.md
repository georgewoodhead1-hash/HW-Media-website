# HW Media — Live Task List (work top-to-bottom, verify + tick each)

## Context (survives compression)
- **Live URL:** https://hw-media-website-y7yi.vercel.app (Vercel project `hw-media-website-y7yi`, team `web-dev-aios-s-projects`, prj_JBXNMvukg6jnwGaz7fp1scwTENUn). Auto-deploys on push to `main`. ssoProtection now OFF, framework=nextjs (both fixed).
- **Local dev:** `npx next dev -p 3011` → http://localhost:3011 (George's :3008 tab has a stuck cache — use 3011). Restart pattern: `lsof -ti:3011|xargs kill; rm -rf .next; npx next dev -p 3011`.
- **Workflow:** edit → tsc clean → restart 3011 → Playwright screenshot to VERIFY → commit → `git push origin HEAD:main` (deploys). NEVER claim done without a screenshot.
- Branch `rebuild` == `main` (fast-forwarded). v1 safe at tag `client-review-v1`.
- Repo: georgewoodhead1-hash/HW-Media-website.

## DO IN THIS ORDER. Tick only when screenshot-verified.

1. **MOTTO — redo, current one REJECTED.** It has an ugly black box around it; it plays a SEPARATE video (different footage from the hero bg) so "Break the" and "ordinary" don't match the scene and don't interact with the ACTUAL background. KILL the black box. Make the letters reveal the REAL hero video behind (mask the actual `videoRef` hero footage to the text — one video, no box), OR if not clean, a tasteful solid. "Book a call with us" is the only good bit — keep that. File: LensIntro.tsx (`.motto-knock*` in globals.css).
2. **HERO BORDER — too thin → thicker.** Also a "weird black line around it" he dislikes — find + remove the double/black edge. File: LensIntro sticky stage (border on the inset rounded panel). Make border ~2px and a cleaner colour.
3. **SUBLINE FONT — drop handwritten entirely.** "we go where the story is" should use the MAIN subheading font (var(--font-firma) = BR Firma), NOT Dancing Script / handwritten. File: LensIntro `.font-hand` p → firma.
4. **CTA — match auteur font + make "Start here" BIG + consistent.** All CTAs same face (BR Firma), the nav "Start here" notably bigger, in line. Files: Nav.tsx, LensIntro, etc.
5. **SEAMLESS SCROLL — kill the gaps (NOT done).** TrustedBy→OurWork and OurWork→Process have dead scroll. Overlap sections (negative-margin handoff) so the next starts entering as the current releases. Files: page.tsx / section heights + -mt.
6. **PROCESS → TESTIMONIALS transition (broken).** "We deliver" flies off screen then there's a LONG gap before Testimonials, and Testimonials is NOT dynamic / doesn't animate in / sits too far down. Tighten: reduce the gap, make Testimonials rise/animate in promptly + higher. Files: EditorFCP outro end + Testimonials entrance + page flow.
7. **FAQ — still broken, "nothing like it was."** The click-accordion + reel feels wrong vs the old smooth scroll-blend version. Revisit: make it smooth/dynamic again (he liked video-left + things-right + blend). File: FAQs.tsx.
8. **CTA naming / "Start here" everywhere consistent** (ties to #4).
9. **Display-weight unification** (.font-display → 400 default + .font-display-black for hero/finale; remove inline fontWeight:400). globals.css + components.
10. **Accessibility** — real "Play showreel" button on lens (not a div), alt text on logos/imagery, contact form <label>s + real endpoint, skip link in layout.
11. **Dead-code + unused-font cleanup** — delete ScrollWords.tsx, WorkCard.tsx if unused; drop unused next/font imports (Instrument_Serif, IBM_Plex_Mono, DM_Sans if unused).
12. **LAYOUT PASS** — go section by section: "is this the right layout?" Add tasteful colours/borders/tonal bands to give the page structure (TrustedBy already has a band). Propose + implement lightly.
13. **Final audit** — run /impeccable polish + design-skills review before final sign-off.
14. **BLACK BARS on films** — Zuma, McLaren + many others show letterbox black bars (above/below/sides). EVERY video must FILL its frame, no bars anywhere. Fix object-fit:cover + a scale to crop any baked-in letterbox in the source mp4s. Check: WorkTile (scale-[1.08] may be too low), OurWork accordion bars, work/[slug] detail page, Testimonials portrait, Process clips, finale tiles. Do AFTER the rest.

## WORKING METHOD (client rule, going forward)
George's standing process: (1) a PLANNER captures EVERYTHING he says verbatim (no compacting) into this plan; (2) main agent works each item top-to-bottom, ticking off + SCREENSHOT-verifying each; (3) a VERIFIER checks the finished work against this plan. Treat TASKS.md as that living plan. At the end, run a verification pass (Workflow: planner-spec vs built-result) before declaring done. Do NOT stop to chat between items — just keep executing and only report when the batch is done.

## DONE this session (verified + pushed live)
- Real BR Firma font; real HW logo (gold dark / black light), nav ring-on-hover.
- Mission condensed + no stat numbers. Testimonials: BR Firma quote, attribution moved up under quote, underline (96x3 gold, verified), bigger McLaren logo, dotted-circle removed. Work page: no "Selected Work", 12 tiles, centred logos, centred "Have a project in mind", films greyscale+frozen→colour+play on hover. Footer email bigger. TrustedBy colour band + bigger logos. About: vertical film + Harry greyscale hover (placeholder photo). Contact: simple form + 24h subtext + "Tell us more" interstitial (eggshell). Finale flips light mode + geometry resize-harden. Gold-text contrast sweep. Process: slowed (640vh, scrub 2) + outro. Hero border + Dancing-Script subline (BOTH being changed again per #1-3 above).

## BLOCKED (George said forget for now)
- Land Rover videos (need files in a shared Drive folder; Frame.io won't download).
- Real Harry photo (placeholder in About).
- Real booking link (placeholder Calendly URL in src/content/site.ts BOOKING_URL).

## GOLDEN RULES
- NO military monospace font. NO red (gold #bfaa53 only). One font per phrase. SLOW, scroll-tied, smooth animations (benchmark = Our Work accordion). Verify with screenshots before claiming done.
