# HW Media — SEO Strategy

Updated 12 Jul 2026 after the full pre-launch audit (audit ran read-only against localhost:3006 + source; findings folded in below). One change already shipped with the security deploy: the vercel.app address now sends `X-Robots-Tag: noindex`, so Google cannot index the temporary URL while the real domain still runs the old site. Everything else in this file is still to do.

## 1. Where the site stands (audit verdict)

**Solid.** Every page has a unique title, description, canonical, OG and Twitter card, and one H1. Organization, Person and WebSite schema on every page; FAQ schema on home; VideoObject + breadcrumbs on all 34 case pages, and all 136 referenced video/poster files exist. The sitemap lists all 47 real routes. robots.txt is sane and blocks no AI crawlers. Headings, FAQ answers and briefs are real server-rendered text — the animations only mask them after load, so crawlers see everything.

**The gap, in one sentence:** the site is technically ready but says almost nothing a buyer searches for — the money phrases appear in zero visible sentences, the eight service pages average ~117 words, and no menu or footer even links to them.

**The audit's ranked findings:**

- CRITICAL — vercel.app indexable while canonicals point at the unlaunched domain. **Fixed 12 Jul (noindex header, host-scoped, lifts itself at cutover).**
- HIGH — "film production company" / "video production" appear 0 times in visible body copy on home, /work and services. Service pages ~117 words each. Services unreachable from nav/footer; their breadcrumbs claim Home > About > Service. Loader blocks first paint ~5.3s on every load; hero is a 7MB video with no poster. Service pages ship no og:image and their descriptions are auto-cut mid-word.
- MEDIUM — sitemap stamps every URL "modified now" on every fetch. llms.txt covers 6 of 34 case pages and 0 services. Six case pages are missing from the /work gallery (only reachable via next-project links). Video schema uses fake 1-January dates and no duration. Only 1 of 3 testimonials is in the HTML. /work has ~99 visible words.
- LOW — /work description 12 chars over limit; "Showreel 2025 — Showreel for HW Media — HW Media" double-brand title; duplicate desktop/mobile heading sets; Trusted-by logos have empty alt text.

## 2. The strategy — five moves, in order

### Move 1 — Sprint the code fixes (George, ~1 day, before or at launch)

Everything here is mechanical and needs no copy from Harry.

1. Add the services to the footer and build a small /services hub; repoint service breadcrumbs to it. Google currently can't crawl to the money pages.
2. Loader to ~2s and once per session; give the hero video a poster jpg and preload hint. This is the whole site's speed score.
3. Service page metadata: an og:image per service and a hand-written ~150-character description each (no more auto-slicing).
4. Sitemap: real per-page dates or drop the field.
5. Regenerate llms.txt from projects.ts + services.ts so all 34 films and 8 services are listed, and it can never drift again.
6. Add the six missing films to the /work gallery (or a plain text list of all 34 at the bottom).
7. Render all three testimonials in the HTML, switch with CSS only.
8. The small stuff: trim /work description, special-case the Showreel title, name the client logos (alt="McLaren" is entity proof), one visible intro paragraph on /work.

### Move 2 — Launch right (George + Harry, cutover week)

Order matters here. Nothing else counts until this is done.

1. Crawl the old hwmedia.co.uk and build a 301 map from every old URL to its new page.
2. Point the domain at Vercel. The noindex header only matches vercel.app, so the real domain indexes normally from day one. Set the vercel.app URL to redirect to the domain.
3. Verify in Google Search Console + Bing, submit the sitemap, request indexing on home, /work and all services.
4. Confirm GPTBot and PerplexityBot can reach the site (some DNS providers block them).
5. Analytics with the contact-form submit tracked — without this nothing below can be proven.
6. Create the Google Business Profile (after Harry decides street address vs service-area). Not before the domain moves.

### Move 3 — Say what we sell (George + Harry, the highest-upside work)

The audit's core finding: Google can't rank the site for phrases no page says.

1. Keyword map first: one target phrase per page, agreed before writing, so pages never compete.
2. Put the exact phrase in one visible sentence or H2 on home, /work and each service page. Plain full sentences, house voice — the no-pitch-copy rule still applies.
3. Rebuild the eight service pages to 300–500 words each: George records a call with Harry per service, drafts from the transcript. Target phrase in a real H2, a quotable answer block, client name-drops.
4. Deepen 6–8 flagship case studies to 150–250-word production stories; cross-link each case to its parent service.
5. Build the automotive page — McLaren, Ferrari, Aston Martin and Land Rover on one page is the most defensible ranking on the site.

### Move 4 — Earn the authority (mostly Harry, the next quarter)

1. Reviews: Harry personally asks past client contacts, two lines each, ~12 reviews over 8 weeks, each naming the project type.
2. Client credit sweep: every place a film is already published gets an HW Media credit with a link; credit line becomes standard in every delivery email.
3. Films to Vimeo, then fix the video schema in one pass — real dates, durations, embed links — and ship a video sitemap. This unlocks film thumbnails in search on 34 pages.
4. Curated YouTube channel: 10–12 flagship films, keyworded titles, London location, descriptions linking to the matching case and service pages.
5. Industry directories only: The Knowledge, KFTV, ProductionHub, Clutch, LBB, full Vimeo profile, Bing Places, Apple Business Connect — identical business details everywhere.
6. Pitch "how it was made" stories (McLaren first) to Shots, Little Black Book, Directors Notes; enter 3–4 targeted awards a year; chase a Vimeo Staff Pick.

### Move 5 — Measure (George, ongoing)

Search Console monthly. Re-run the target ChatGPT/Perplexity questions quarterly. Report rankings, AI mentions and form enquiries against the launch baseline. Keep the Business Profile alive with one post per new film.

## 3. What not to do

1. No blog, no posting schedule. The site ranks on a small set of deep pages, not volume.
2. No Yell, Bark, generic directories or paid listicles. Worthless links, damaged positioning.
3. No bought, incentivised or templated reviews. Google suspends profiles for it.
4. Don't chase "videographer London" — that phrase means one person with a camera, the opposite of the brand.
5. Don't promise Harry a knowledge panel or fast local-pack ranking. The profile and branded search are near-certain; the rest takes months.
6. No pricing published anywhere without Harry's explicit sign-off.
7. No Business Profile or directory listing before the domain moves.
8. No sales language in SEO copy. Plain full sentences in Harry's voice are both the brand rule and what AI engines quote.
