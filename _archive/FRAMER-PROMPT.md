# HW Media — Framer Mega-Prompt

Paste everything below the line into Framer AI (or Workshop) to scaffold the site.

---

Build a premium, dark, cinematic marketing website for **HW Media** — a London-based film **production company** (not an agency: they travel and shoot on location). Founder/director **Harry Wallis** personally shoots every project. Clients include McLaren, Aston Martin, Nike, Red Bull, Zuma, Salomon, Norton, Defender, Spotify, Meta, NatWest, Soho House, Abbey Road Studios.

**Positioning line:** "Break the ordinary." Sub-line: "we go where the story is." Tone: confident, understated, cinematic. Premium film-house energy — think a director's reel, not a SaaS landing page.

## Brand & design tokens
- **Theme:** dark by default, with a light-mode toggle. The hero and any "cinema" sections stay dark always.
- **Background:** near-black, warm-tinted (#0b0b0a). Never pure #000.
- **Text:** warm cream (#f4efe2).
- **Accent:** a single muted antique GOLD — #bfaa53 for fills/lines; on light backgrounds use a deeper gold (#8a6d12) so text stays AA-legible. Gold is the ONLY accent. No other colours. Never red.
- **Hairlines:** 1px lines at ~8% cream on dark / ~10% ink on light. Use thin rules and generous negative space, not boxes.
- **Type:**
  - Display / headlines: **Archivo** (heavy weight ~900), tight leading (0.9), large but restrained.
  - Body: **Hanken Grotesk**.
  - CTAs, labels, captions, sub-text: **BR Firma SemiBold** (a clean geometric grotesk) — this is the signature "label" face.
  - Tiny mono labels / counters: **IBM Plex Mono**, letter-spaced, uppercase.
- **Corners:** large soft radius on media panels (~28px). **Motion:** slow, heavy, scroll-tied. Ease-out exponential curves. No bounce. Sections overlap seamlessly (negative margins) — never a hard black gap between sections.

## Global chrome
- **Loading screen:** full black, the gold "HW media" logo fades/scales in, holds, scales out, then the veil lifts straight into the hero camera move.
- **Sticky nav:** left = HW logo (gold on dark, black on light). Right = links **Work · About · Contact**, each gets a thin ring on hover (not a permanent border). Far right = a bordered pill CTA **"Start here"** linking to the booking page.
- A small theme toggle and social marks pinned bottom-left.

## Page: Home (in this exact order)

1. **Hero — the camera lens.** A full-bleed, rounded, inset black panel. On load, a hyper-detailed 3D camera-lens (barrel rings, glass elements, lens flares) sits far back and tumbled in 3D space; the camera then **falls THROUGH the lens** — rushing forward in Z with a spiralling barrel-roll, the glass elements blowing past the viewer one plane at a time — and lands dead-clean on a full-frame showreel (no leftover zoom). Then the motto rises in: huge **"Break the / ordinary."** ("ordinary." in gold), the sub-line "we go where the story is", and a pill CTA **"Book a call with us →"**. Clicking the panel opens the full showreel with sound. A small "Scroll" cue at the bottom.

2. **Mission.** One quiet, slow-revealing statement line about why they make films. Vast space, small-ish type. No wall of text.

3. **Stats band.** Three gold figures that count up on scroll: **5** Years in business · **150+** Projects completed · **96%** Client retention. Thin, no cards.

4. **Trusted by.** Two horizontal marquee rows of client logos scrolling in **opposite directions**, logos large and dimmed, brightening on hover while the row slows. A quiet section band, slightly lighter than the page.

5. **Our work.** A "vinyl browse" accordion: six film bars side by side, each a muted looping clip with a vertical client label. Hover one and it expands wide, revealing the title + "Watch ⟶". On entry, the bars fly in from the right one by one and settle into the row. Films: Otoko, McLaren, Sans Matin, Zuma, Nike, Salomon.

6. **Our process.** A fully scroll-tied sequence on a black stage: scattered letters assemble into **"Our process."**, four film clips drift in from the corners, then the title crossfades **We plan → We film → We edit → We deliver** while a tall gold playhead sweeps across the row, lighting the active clip. Ends by breaking apart into the next section.

7. **Testimonials.** Two columns. Left: a stack of three numbered, logo-bearing selectors (McLaren / Nike / Zuma) — click to switch — above the selected client's quote, role and sector. Right: a tall portrait (3:4) campaign film that cross-fades when you switch. Heading "Testimonials" with a short gold underline. Example quote: "The film outlived the campaign. Two years on we still open every pitch with it." — Brand Director, Heritage Motoring.

8. **FAQs.** Left column (sticky): the gold "FAQ's" heading and a tall vertical film reel that stays in place as you read, then fades cleanly out in place at the end. Right column: a click-to-open accordion of questions (one open at a time, smooth height + opacity).

9. **Finale / footer.** A light-mode whirlwind gallery that resolves into the closing line **"Every film is a chance to break the ordinary."** with contact email, socials, and the booking CTA. This line always lives at the very bottom.

## Other pages
- **/work** — a flush grid (gap-0) of all films; each tile greyscale + paused by default, plays + turns to colour on hover; links to its case page. A centred "Have a project in mind?" booking CTA.
- **/work/[slug]** — individual film case pages (hero film, client, role, the brief, stills).
- **/about** — "Who's behind the camera": Harry Wallis, a greyscale portrait that turns to colour on hover, a vertical film, and the studio story.
- **/contact** — booking-led: a clear "Start here" / "Book a call" CTA (Calendly-style), email, socials.

## Motion doctrine (apply everywhere)
Slow, premium, weighty scroll (smooth-scroll/Lenis feel). Every section transition overlaps the next so there is never a black gap. Pinned sections drift continuously — no abrupt stops. Big type is reserved for the hero motto and film titles only; everywhere else stays small and restrained with lots of air. One accent (gold), one idea per screen.
