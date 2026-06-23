# HW Media — Client Meeting Action Plan

**Source:** Granola call "Hw x Gw Website Call" — 23 Jun 2026, Harry (hwmedia.productions) + George.
**Rule:** one item at a time, verify each with a screenshot before moving on. Keep the lens intro + the "Break the Ordinary" finale untouched.

**Status key:** ☐ todo · ✅ done · 🔁 needs reverting (I did the opposite) · ⏳ blocked on Harry asset · ❓ confirm current state

---

## A. Nav & global chrome

| # | Item (client's words) | Status | Where |
|---|---|---|---|
| A1 | Fix nav text disappearing / not flipping with light-dark (contrast bug) | ✅ shipped today — hero links now follow the toggle with a legibility outline | `Nav.tsx`, `globals.css` |
| A2 | Nav hover: change from **rings** to a **sliding cursor bubble** that glides between items (like the auteur/Aussie site) | ☐ | `Nav.tsx` + `globals.css` |
| A3 | Nav **hides on scroll down, reappears on scroll up** — whole site | ☐ | `Nav.tsx` (scroll-direction watch) |
| A4 | Logo: keep top-left, make **slightly bigger** | ☐ | `Nav.tsx` (`h-12/h-14` bump) |
| A5 | **Scroll-down indicator** that disappears after the first scroll — desktop + mobile | ☐ new component | mount on hero |

## B. Homepage layout & colour  (Outer Studios "colour-blocking")

| # | Item | Status | Where |
|---|---|---|---|
| B1 | Keep the light/dark toggle **and** add mixed-contrast sections (some light, some dark, accent breaks) | ✅ core done — `band` surface inverts with the toggle (Trusted By + Testimonials are the dark bands on the light site) | `globals.css` |
| B2 | Trusted By: **dark background, logos read white** | ✅ done | `TrustedBy.tsx` |
| B3 | Order: **Trusted By above Films/Featured Projects** (swap) | ❓ current order already = Stats → Trusted By → Featured Projects, so already correct — confirm with Harry | `page.tsx` |

## C. Featured Projects  (was "Our Work")

| # | Item | Status | Where |
|---|---|---|---|
| C1 | Rename "Our Work" → **"Featured Projects"** | ✅ done | `OurWork.tsx` |
| C2 | Replace text labels (McLaren, Toko…) with **brand logos**; text only on hover/expand | ☐ | `OurWork.tsx` |
| C3 | Thumbnails **4:3 → 9:16**, in **colour** (not B&W) | ⏳ needs Harry's colour thumbnails | `OurWork.tsx` + assets |
| C4 | Load animation: **all tiles appear together quickly on load**, then reveal-on-scroll for lower rows | ☐ | `OurWork.tsx` |
| C5 | Grid order to follow **Harry's WhatsApp hierarchy** | ⏳ needs the hierarchy from George/Harry | `content/projects` |
| C6 | Add **"Discover More"** button below the grid | ☐ | `OurWork.tsx` |
| C7 | Harry to send colour 9:16 thumbnails | ⏳ Harry | — |

## D. Our Process

| # | Item | Status | Where |
|---|---|---|---|
| D1 | Add **short subtext under each stage heading** (Aussie bullet style) | ☐ | `EditorFCP.tsx` |
| D2 | Push film thumbnails **down slightly** to fill the bottom of the section | ☐ | `EditorFCP.tsx` |
| D3 | Process animation: **stay in place on scroll** (don't disappear) so scrolling back up isn't an empty screen | ☐ | `EditorFCP.tsx` |

## E. Testimonials  (was "Reviews")

| # | Item | Status | Where |
|---|---|---|---|
| E1 | Section is called **"Testimonials"** | 🔁 I renamed it to "Reviews" — revert to "Testimonials" | `Testimonials.tsx` |
| E2 | **Conjoin** the "We Deliver" exit animation with the testimonials entry — feel like one scene | ☐ | `EditorFCP.tsx` ↔ `Testimonials.tsx` seam |
| E3 | Replace numbers (01/02/03) with **three clickable dots** + brand name + short quote | ☐ | `Testimonials.tsx` |
| E4 | **No auto-scroll** — manual dot clicks only | ❓ already manual — confirm | `Testimonials.tsx` |
| — | (Keeps the dark contrast band treatment — fits B1) | ✅ | — |

## F. Mobile

| # | Item | Status | Where |
|---|---|---|---|
| F1 | **Hamburger menu** icon (three lines) | ☐ | `Nav.tsx` |
| F2 | Fix **border cut-off in light mode** (too full-bleed on iPhone) | ☐ | layout/section padding |
| F3 | Featured Projects tiles: **reveal/fade-in on scroll** (mobile) | ☐ | `OurWork.tsx` |
| F4 | **Static numbers** (Stats) — match the laptop fade-in animation | ☐ | `StatsBlock.tsx` |
| F5 | Trusted By logos: **reduce size** so they don't bleed too wide | ☐ | `TrustedBy.tsx` |
| F6 | FAQs — working well, **no changes** | ✅ | — |

## G. Contact page

| # | Item | Status | Where |
|---|---|---|---|
| G1 | Footer: swap "HW Media" **text back to the logo** | ❓ footer already uses the logo image — confirm | `Footer.tsx` |
| G2 | Contact animation speed + Safari autofill | ✅ confirmed good, no action | — |

---

## Blocked on Harry (external)
- Colour **9:16 thumbnails** + CTA photo (CTA photo already in the Drive "website stills" folder).
- **WhatsApp grid hierarchy** for Featured Projects order.
- **Narrated walkthrough** (Claude voice-to-text → Google Doc) — more copy + feedback coming.

## Suggested execution order
1. **Reconcile quick wins:** revert E1 (Reviews → Testimonials); confirm B3, E4, G1.
2. **Nav system:** A4 logo bigger → A2 hover bubble → A3 hide-on-scroll → A5 scroll indicator.
3. **Featured Projects:** C2 logos → C4 load animation → C6 Discover More (C3/C5 when Harry sends assets).
4. **Process:** D1 subtext → D2 thumbnails down → D3 stay-in-place.
5. **Testimonials:** E3 dots → E2 conjoin seam.
6. **Mobile pass:** F1–F5.
