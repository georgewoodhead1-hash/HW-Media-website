# HW MEDIA — Claude Design Handoff

## THE PROMPT
You are designing the middle of an existing homepage for HW MEDIA — a premium London film & photography agency (clients: McLaren, Aston Martin, Nike, Norton, Red Bull). Brand feel: dark, cinematic, confident, expensive. The hero (a cinematic lens zoom), a "trusted by" logo wall, and the footer ALREADY EXIST (full code below) and must NOT change. Design the sections that sit between the logo wall and the footer, as one cohesive premium scroll: Mission → Selected Work → Our Process → Testimonials → FAQs. Match the existing animation language (code below), keep each section visually DISTINCT (no repeated template), and slot the new components into page.tsx between <TrustedBy/> and <WhirlwindGallery/>. Use only the brand colours, type and copy below.

## STACK & ANIMATION CONVENTIONS (match these)
- Next.js (App Router) + TypeScript + Tailwind v4 (`@theme inline` in globals.css) + GSAP 3 (ScrollTrigger) + Lenis smooth scroll (lerp 0.08).
- Pinned-section pattern: a tall `<section className="motion-safe:md:h-[Xvh]">` + a `sticky top-0 h-screen` stage + a `gsap.timeline({ scrollTrigger:{ trigger, start:"top top", end:"bottom bottom", scrub:0.8 }})`, all inside `gsap.matchMedia("(min-width:768px) and (prefers-reduced-motion: no-preference)")`, with a stacked `md:hidden motion-reduce:md:block` fallback.
- Flowing-section pattern: normal section + scroll-triggered reveals (fromTo with scrollTrigger start/end + scrub).
- Theme: `html[data-mode=dark|light]` sets `--bg/--fg`. Each section root sets `data-theme` + `data-surface`: `"media"` = always-dark cinema (footage), `"page"` = follows the global mode (editorial; goes cream in light). The nav re-themes to the surface beneath it.
- Type utility classes in globals.css: `.font-display` (big display), `.font-accent` (serif italic accent), `.label-mono` (mono labels), `.font-hand` (handwriting). Colours: `var(--gold)`, `var(--red)`, `var(--bg)`, `var(--fg)`.

## COLOURS (brand kit)
Gold #bfaa53 (primary) · #ffe266 · #eddb8e | Cream #f9f6e4 · #fdf6b6 · #fffef3 | Dark #000000 · #171717 · #1b1b1b · #292929 | Red #c62222 (accent/handwriting only)

## TYPE (brand kit)
Headings: Monument (Extended) · Section headers: Sofia Pro Semi Bold · Body: Sofia Pro Regular · Captions: Sofia Pro Light · Quotes: Sofia Pro Light italic · Handwriting: in red #c62222

## INFO / COPY
**Mission (verbatim):** "The strongest brands are built on great stories. From the inception of an idea to the distinctive character shaped through time and craft, we exist to reveal the untold stories of heritage embedded in our clients' brands, products and experiences through film."
**Selected Work (6 films, this order; client · category · stat; link to /work):** Otoko — Lake District — 2 shoot days · 4 locations · 1-man crew | McLaren — 3 shoot days · 6 locations · crew of 2 | Sans Matin (Hera) | Zuma | Nike | Salomon
**Our Process (4 stages):** Planning — "We find the story before anything is booked." | Filming — "One crew, every department, instinct welcome." | Editing — "Where the footage becomes a film." | Delivery — "Masters, plus every cutdown your channels need."
**Testimonials:** client quotes (placeholders for now), closing on: "The whole is greater than the sum of its parts." — Aristotle
**FAQs (sits AFTER Testimonials, just BEFORE the footer):** an accordion / expandable FAQ section. Placeholder questions to confirm with Harry — "How much does a film cost?", "How long does a project take?", "Do you shoot internationally?", "Is everything handled in-house?", "How do we get started?"

---
# EXISTING CODE (keep the hero, trusted-by and footer; match their animation language)

## FILE: src/app/page.tsx
```tsx
import LensIntro from "@/components/home/LensIntro";
import TrustedBy from "@/components/home/TrustedBy";
import WhirlwindGallery from "@/components/home/WhirlwindGallery";

// Rebuilding section by section. So far: hero (lens) → trusted by →
// footer. Mission, gallery, process and testimonials drop in between as
// each is designed and approved.
export default function Home() {
  return (
    <main>
      <LensIntro />
      <TrustedBy />
      <WhirlwindGallery />
    </main>
  );
}

```

## FILE: src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import {
  Archivo,
  Caveat,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shell/SmoothScroll";
import Nav from "@/components/shell/Nav";
import Grain from "@/components/shell/Grain";
import Cursor from "@/components/shell/Cursor";
import EdgeLabel from "@/components/shell/EdgeLabel";
import ThemeToggle from "@/components/shell/ThemeToggle";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const hanken = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "HW Media — Cinematic Brand Storytelling",
  description:
    "Films for brands with a story worth telling. Brand films, documentary and photography. HW Media, London.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-mode="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${instrument.variable} ${hanken.variable} ${plexMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        {/* restore the saved mode before first paint — no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('hwm-mode');if(m==='light'||m==='dark')document.documentElement.dataset.mode=m}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full">
        <SmoothScroll>
          <Nav />
          {children}
          <Grain />
          <Cursor />
          <ThemeToggle />
          <EdgeLabel />
        </SmoothScroll>
      </body>
    </html>
  );
}

```

## FILE: src/lib/gsap.ts
```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
}

export { gsap, ScrollTrigger, SplitText };

```

## FILE: src/lib/lenis.ts
```ts
import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

```

## FILE: src/components/shell/SmoothScroll.tsx
```tsx
"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // reloading mid-pin restored a broken half-state (QA P1) — always start clean
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Premium continuous glide (luke / bennett feel): lerp mode so the page
    // is always easing toward the target — a weighted, heavy drift with no
    // abrupt starts or stops. Lower lerp = heavier. Touch stays native.
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.85,
      smoothWheel: true,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}

```

## FILE: src/content/projects.ts
```ts
// HARRY'S REAL FILMS (Drive drop, 2026-06-11), landing order as specified:
// Otoko Lake District, McLaren, Sans Matin Hera, Zuma, Nike, Salomon —
// plus Chasing the Salt as the seventh. Loops cut from the masters in
// Clients/hw-media/assets/films/ (wide -w 16:9, portrait -p 3:4).
// Stats for Otoko + McLaren are REAL (Norton deck p10); others TBC.

export interface Project {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  loop: string; // portrait 3:4 — the crate / landing scroll
  wide: string; // 16:9 — work grid, case pages
  poster: string;
  posterWide: string;
  tagline: string;
  stats: string;
  story: string;
  services: string[];
  credits: { role: string; name: string }[];
}

const p = (slug: string) => ({
  loop: `/videos/films/${slug}-p.mp4`,
  wide: `/videos/films/${slug}-w.mp4`,
  poster: `/videos/films/posters/${slug}-p.jpg`,
  posterWide: `/videos/films/posters/${slug}-w.jpg`,
});

export const projects: Project[] = [
  {
    slug: "otoko",
    title: "Otoko",
    client: "Otoko",
    category: "Brand film",
    year: "2026",
    ...p("otoko"),
    tagline: "A launch film shot across the Lake District, sunrise to sunset.",
    stats: "2 shoot days · 4 locations · 1-man crew",
    story:
      "Captured across two shoot days with the weather setting the tone. Drone work, FPV movement and fast-paced action balanced with slower, intentional moments.",
    services: ["Direction", "Cinematography", "Post Production"],
    credits: [{ role: "Director / DP", name: "Harry Wallis" }],
  },
  {
    slug: "mclaren",
    title: "McLaren Artura",
    client: "McLaren",
    category: "Commercial",
    year: "2025",
    ...p("mclaren"),
    tagline: "A hero campaign film built around pace, movement and impact.",
    stats: "3 shoot days · 6 locations · crew of 2",
    story:
      "Organised in under 72 hours with a two-man crew. Follow-car rig shots and multiple camera perspectives keep the audience inside the experience of speed.",
    services: ["Direction", "Cinematography", "Post Production"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "McLaren" },
    ],
  },
  {
    slug: "hera",
    title: "Hera",
    client: "Sans Matin",
    category: "Brand film",
    year: "2026",
    ...p("hera"),
    tagline: "A product story for Sans Matin, told with restraint.",
    stats: "1 shoot day · studio + location",
    story:
      "Quiet, deliberate framing that lets the product carry the film. Shot in a day, graded in house.",
    services: ["Direction", "Cinematography", "Colour"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Sans Matin" },
    ],
  },
  {
    slug: "zuma",
    title: "Zuma Maldives",
    client: "Zuma",
    category: "Brand film",
    year: "2025",
    ...p("zuma"),
    tagline: "A destination film for Zuma's Maldives residency.",
    stats: "on location · Maldives",
    story:
      "Food, water and light. A hospitality film that sells the feeling of being there rather than the menu.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Zuma" },
    ],
  },
  {
    slug: "nike",
    title: "Nike Pegasus 41",
    client: "Nike",
    category: "Commercial",
    year: "2025",
    ...p("nike"),
    tagline: "A social-first ad for the Pegasus 41.",
    stats: "vertical master · paid social",
    story:
      "Cut for the feed: fast, rhythmic, built to stop a thumb. Mastered vertical, never cropped as an afterthought.",
    services: ["Direction", "Edit", "Paid Social Versions"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Nike" },
    ],
  },
  {
    slug: "salomon",
    title: "Salomon S/Lab",
    client: "Salomon",
    category: "Commercial",
    year: "2025",
    ...p("salomon"),
    tagline: "Trail speed, shot at altitude for Salomon.",
    stats: "on the mountain · crew of 2",
    story:
      "Athletes, weather windows and thin air. Performance product filmed the way it gets used.",
    services: ["Direction", "Cinematography", "Edit & Grade"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Salomon" },
    ],
  },
  {
    slug: "chasing-the-salt",
    title: "Chasing the Salt",
    client: "Norton",
    category: "Documentary",
    year: "2026",
    ...p("chasing-the-salt"),
    tagline: "A land speed record attempt at Bonneville, with Norton.",
    stats: "10 days on the salt · crew of 3 · 10-min documentary",
    story:
      "A land-speed record attempt on the Bonneville salt flats. Heritage machines, thin air, and the people who refuse to let legends rest. The salt remembers.",
    services: ["Concept Development", "Direction", "Cinematography", "Post Production"],
    credits: [
      { role: "Director / DP", name: "Harry Wallis" },
      { role: "Client", name: "Norton Motorcycles" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((x) => x.slug === slug);
}

```

## FILE: src/components/home/LensIntro.tsx
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { safePlay } from "@/lib/video";

// CH.00 — the lens. A real cine prime hanging in dark space, starting small
// (further out). Scroll approaches it, then passes through the LAYERS of the
// glass: the barrel hardware and front element fly past first, then the
// middle group (chromatic edges, refraction sheen), then the rear element —
// each at its own speed, like moving through a real optical stack. The reel
// recessed in the throat grows until it IS the viewport, the framing racks
// back to the true shot, the headline lands and blends with the footage,
// then a long buffer holds before the page releases. Fully reversible.

const RIG_REST = 0.55; // the whole lens starts at half size — further out
const VESSEL_REST = 0.16; // reel disc scale within the rig
const INNER_REST = 2.85; // reel over-zoom so the disc is always covered

/* Coords rounded so V8 and JSC serialise identically (Safari hydration). */
function ring(r: number, count: number, longEvery: number, len: number, lenLong: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((i * 360) / count) * (Math.PI / 180);
    const long = i % longEvery === 0;
    const l = long ? lenLong : len;
    return {
      key: i,
      long,
      x1: (500 + r * Math.cos(a)).toFixed(2),
      y1: (500 + r * Math.sin(a)).toFixed(2),
      x2: (500 + (r - l) * Math.cos(a)).toFixed(2),
      y2: (500 + (r - l) * Math.sin(a)).toFixed(2),
    };
  });
}

function GlassArt() {
  const knurl = ring(479, 120, 10, 7, 14);
  const aperture = ["22", "16", "11", "8", "5.6", "4", "2.8"];

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      <defs>
        <linearGradient id="lens-spec" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <path id="lens-engrave" d="M 500 95 A 405 405 0 1 1 499.99 95" fill="none" />
        <path id="lens-scale" d="M 152 500 A 348 348 0 0 0 848 500" fill="none" />
      </defs>

      {/* rim edges + filter thread */}
      <circle cx="500" cy="500" r="496" fill="none" stroke="rgba(245,241,230,0.3)" strokeWidth="1.5" />
      <circle cx="500" cy="500" r="490" fill="none" stroke="rgba(245,241,230,0.08)" strokeWidth="1" />
      <circle cx="500" cy="500" r="486" fill="none" stroke="rgba(245,241,230,0.06)" strokeWidth="1" />
      <circle cx="500" cy="500" r="442" fill="none" stroke="rgba(245,241,230,0.12)" strokeWidth="1" />

      {/* knurled grip */}
      {knurl.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.long ? "rgba(245,241,230,0.4)" : "rgba(245,241,230,0.18)"}
          strokeWidth={t.long ? 1.5 : 1}
        />
      ))}

      {/* the red index dot every real lens carries */}
      <circle cx="500" cy="32" r="6" fill="var(--red)" opacity="0.9" />
      <line x1="500" y1="44" x2="500" y2="62" stroke="var(--red)" strokeWidth="2" opacity="0.7" />

      {/* specular streak on the front glass */}
      <path d="M 181.27 269.36 A 396 396 0 0 1 437.14 110.02" fill="none" stroke="url(#lens-spec)" strokeWidth="6" strokeLinecap="round" opacity="0.55" />

      {/* engraved spec ring — white with the red Ø mark */}
      <text fill="rgba(245,241,230,0.4)" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 15, letterSpacing: 7 }}>
        <textPath href="#lens-engrave">
          HW MEDIA · CINE PRIME · 24–70 ƒ2.8 · LONDON · EST. MMXX ·
        </textPath>
      </text>
      <text fill="var(--red)" opacity="0.85" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 15, letterSpacing: 7 }}>
        <textPath href="#lens-engrave" startOffset="62%">
          Ø82
        </textPath>
      </text>

      {/* aperture scale along the lower arc */}
      <text fill="rgba(245,241,230,0.28)" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 13, letterSpacing: 2 }}>
        <textPath href="#lens-scale" startOffset="6%">
          {aperture.join("   ·   ")}
        </textPath>
      </text>
    </svg>
  );
}

export default function LensIntro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const vesselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const rearRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullReelRef = useRef<HTMLVideoElement>(null);
  const [reelOpen, setReelOpen] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(wrap, { height: "100vh" });
      gsap.set(rigRef.current, { scale: 1 });
      gsap.set(vesselRef.current, { xPercent: -50, yPercent: -50, scale: 1 / RIG_REST });
      gsap.set(
        [frontRef.current, midRef.current, rearRef.current, vignetteRef.current, dimRef.current, cueRef.current],
        { autoAlpha: 0 },
      );
      gsap.set(veilRef.current, { opacity: 1 });
      gsap.set(".hero-motto", { autoAlpha: 1, y: 0 });
      return;
    }

    // Resting state set synchronously — the timeline only animates AWAY from it.
    gsap.set(rigRef.current, { scale: RIG_REST });
    gsap.set(vesselRef.current, { xPercent: -50, yPercent: -50, scale: VESSEL_REST });
    gsap.set(innerRef.current, { xPercent: -50, yPercent: -50, scale: INNER_REST });
    gsap.set(dimRef.current, { opacity: 0.5 });
    gsap.set(".hero-motto", { autoAlpha: 0, y: 40 });

    const ctx = gsap.context(() => {
      gsap.set(veilRef.current, { opacity: 0 });
      gsap.set(".hero-motto", { autoAlpha: 0, y: 40 });

      {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });

        tl
          // PHASE 1 — approach: the whole lens grows from half size
          .to(rigRef.current, { scale: 1, duration: 0.22, ease: "power1.out" }, 0)
          // PHASE 2 — through the layers of the glass, nearest first
          .to(frontRef.current, { scale: 7, duration: 0.2, ease: "power1.in" }, 0.24)
          .to(frontRef.current, { autoAlpha: 0, duration: 0.1 }, 0.34)
          .to(midRef.current, { scale: 6, duration: 0.22, ease: "power1.in" }, 0.3)
          .to(midRef.current, { autoAlpha: 0, duration: 0.1 }, 0.42)
          .to(rearRef.current, { scale: 5, duration: 0.24, ease: "power1.in" }, 0.36)
          .to(rearRef.current, { autoAlpha: 0, duration: 0.12 }, 0.48)
          // the reel approaches behind the stack
          .to(
            vesselRef.current,
            {
              keyframes: [
                { scale: 0.42, duration: 0.16, ease: "none" },
                { scale: 0.97, duration: 0.14, ease: "power1.in" },
                { scale: 1, duration: 0.08, ease: "none" },
              ],
            },
            0.24,
          )
          // rack back to the true framing as you land inside the film
          .to(innerRef.current, { scale: 1, duration: 0.16, ease: "power1.inOut" }, 0.5)
          // the stage opens up
          .to(vignetteRef.current, { opacity: 0, duration: 0.25 }, 0.3)
          .to(dimRef.current, { opacity: 0, duration: 0.35 }, 0.25)
          .to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0.03)
          // the scrim settles and the motto rises in as one clean unit
          .to(veilRef.current, { opacity: 1, duration: 0.12 }, 0.48)
          .to(".hero-motto", { autoAlpha: 1, y: 0, duration: 0.1, ease: "power3.out" }, 0.52)
          // a gentle drift through the hold — never a parked frame
          .to(".hero-motto", { y: -16, duration: 0.26, ease: "none" }, 0.74)
          .to(wrap, { duration: 0.22 }, 0.78);
      }
    }, wrap);

    return () => {
      ctx.revert();
    };
  }, []);

  const openReel = () => {
    setReelOpen(true);
    dialogRef.current?.showModal();
    getLenis()?.stop();
    videoRef.current?.pause();
    const reel = fullReelRef.current;
    if (reel) {
      reel.currentTime = 0;
      safePlay(reel);
    }
  };

  const closeReel = () => {
    fullReelRef.current?.pause();
    dialogRef.current?.close();
    setReelOpen(false);
    getLenis()?.start();
    safePlay(videoRef.current);
  };

  return (
    <div ref={wrapRef} data-theme="dark" data-surface="media" data-chapter="CH.00 — The lens" className="relative h-[460vh]">
      <div
        className="on-media sticky top-0 h-screen overflow-hidden bg-[#050505]"
        data-cursor="play"
        onClick={openReel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openReel();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Play showreel with sound"
      >
        {/* the rig: everything physical scales together on approach */}
        <div ref={rigRef} className="absolute inset-0 will-change-transform">
          {/* the reel, recessed in the throat — already playing at rest */}
          <div
            ref={vesselRef}
            className="lens-vessel absolute left-1/2 top-1/2 h-[124vmax] w-[124vmax] will-change-transform"
          >
            <div ref={innerRef} className="absolute left-1/2 top-1/2 h-screen w-screen will-change-transform">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src="/videos/hero-loop.mp4"
                poster="/videos/posters/hero-loop.jpg"
                autoPlay
                muted
                loop
                playsInline
              />
              <div ref={dimRef} className="absolute inset-0 bg-black" />
            </div>
          </div>

          {/* REAR ELEMENT — last glass before the reel, exits last */}
          <div ref={rearRef} className="pointer-events-none absolute inset-0 will-change-transform">
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 9.5%, rgba(0,0,0,0.55) 12.5%, transparent 16%)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f1e6]/14" />
            <div
              className="absolute left-1/2 top-1/2 h-[36vmin] w-[36vmin] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{ background: "radial-gradient(closest-side, rgba(196,74,168,0.1), transparent 70%)" }}
            />
          </div>

          {/* MIDDLE GROUP — chromatic edges + refraction sheen, exits second */}
          <div ref={midRef} className="pointer-events-none absolute inset-0 will-change-transform">
            <div className="absolute left-1/2 top-1/2 h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f1e6]/16" />
            {/* chromatic aberration: magenta outside, cyan inside the edge */}
            <div className="absolute left-1/2 top-1/2 h-[77vmin] w-[77vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(216,74,160,0.28)]" />
            <div className="absolute left-1/2 top-1/2 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(64,196,210,0.25)]" />
            {/* curved refraction sheen */}
            <div
              className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(ellipse at 62% 30%, rgba(255,255,255,0.09), transparent 46%)",
                filter: "blur(1.5px)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{ background: "radial-gradient(closest-side, rgba(64,196,160,0.1), transparent 72%)" }}
            />
          </div>

          {/* FRONT — barrel hardware + front element, exits first */}
          <div ref={frontRef} className="pointer-events-none absolute inset-0 will-change-transform">
            {/* shadow seating the barrel in the dark */}
            <div
              className="absolute left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 58%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0.18) 72%, transparent 80%)",
              }}
            />
            {/* machined metal rim: brushed conic sheen masked to an annulus */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 215deg, #0a0a0a, #232323 11%, #0c0c0c 23%, #2a2a2a 36%, #0b0b0b 52%, #1f1f1f 67%, #090909 81%, #222 93%, #0a0a0a)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 65.8%, black 66.6%, black 75%, transparent 75.6%)",
                maskImage:
                  "radial-gradient(circle, transparent 65.8%, black 66.6%, black 75%, transparent 75.6%)",
              }}
            />
            {/* hard edge-light catching the top-left of the rim */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 150deg, transparent 0deg, rgba(255,255,255,0.22) 40deg, rgba(255,255,255,0.05) 80deg, transparent 120deg, transparent 360deg)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 73.6%, black 74.2%, black 75.2%, transparent 75.8%)",
                maskImage:
                  "radial-gradient(circle, transparent 73.6%, black 74.2%, black 75.2%, transparent 75.8%)",
              }}
            />
            {/* machined focus-ring band */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "repeating-conic-gradient(#101010 0deg 1.1deg, #1d1d1d 1.1deg 2.2deg)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 56.5%, black 57.2%, black 62.5%, transparent 63.2%)",
                maskImage:
                  "radial-gradient(circle, transparent 56.5%, black 57.2%, black 62.5%, transparent 63.2%)",
                opacity: 0.85,
              }}
            />
            {/* stepped barrel-depth shadows */}
            <div
              className="absolute left-1/2 top-1/2 h-[132vmin] w-[132vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, transparent 26%, rgba(0,0,0,0.4) 29%, transparent 33%, transparent 42%, rgba(0,0,0,0.45) 45.5%, transparent 50%, transparent 56%, rgba(0,0,0,0.5) 60%, transparent 64.5%)",
              }}
            />
            {/* front-element dome highlight */}
            <div
              className="absolute left-1/2 top-1/2 h-[88vmin] w-[88vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(ellipse at 36% 28%, rgba(255,255,255,0.11), transparent 44%)",
              }}
            />
            {/* multicoating flares */}
            <div
              className="absolute left-1/2 top-1/2 h-[58vmin] w-[58vmin] rounded-full mix-blend-screen"
              style={{
                transform: "translate(-88%, -86%)",
                background: "radial-gradient(closest-side, rgba(196,74,168,0.2), transparent 70%)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[34vmin] w-[34vmin] rounded-full mix-blend-screen"
              style={{
                transform: "translate(-150%, 36%)",
                background: "radial-gradient(closest-side, rgba(120,90,220,0.14), transparent 70%)",
              }}
            />
            <GlassArt />
          </div>
        </div>

        {/* stage depth */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 50%, transparent 32%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* legibility scrim — fades in under the motto so it sits cleanly over
            any footage. A gradient surface, not a text shadow. */}
        <div
          ref={veilRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[58%]"
          style={{ background: "linear-gradient(to top, rgba(3,3,3,0.82), rgba(3,3,3,0.25) 52%, transparent)" }}
        />

        {/* the motto — our mainstream display font, solid and bold, standing
            out over the reel. No knockout, no glass, no shadow, one clean rise. */}
        <h1 className="hero-motto font-display absolute bottom-0 left-0 z-10 px-5 pb-14 text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.86] text-[#f5f1e6] will-change-transform md:px-10 md:pb-20">
          Break the<br />
          <span className="text-[var(--gold)]">ordinary.</span>
        </h1>

        {/* resting cue */}
        <div ref={cueRef} className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2">
          <span className="label-mono text-[10px] opacity-70">Scroll into the glass</span>
          <span className="block h-8 w-px animate-pulse bg-[var(--gold)]" />
        </div>
      </div>

      {/* fullscreen reel */}
      <dialog
        ref={dialogRef}
        onClose={closeReel}
        className="m-0 h-screen max-h-none w-screen max-w-none bg-black p-0 backdrop:bg-black/90"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <video
            ref={fullReelRef}
            className="h-full w-full object-contain"
            src="/videos/showreel-full.mp4"
            controls={reelOpen}
            playsInline
          />
          <button
            onClick={closeReel}
            className="label-mono absolute right-6 top-6 rounded-full border border-[var(--hairline-dark)] bg-black/40 px-5 py-3 text-[#f5f1e6] backdrop-blur-sm transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            aria-label="Close showreel"
          >
            Close ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}

```

## FILE: src/components/home/TrustedBy.tsx
```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// 02 — Trusted by. Sits right under the hero. A logo wall the client
// asked for: two rows looping in opposite directions, fading at both
// edges, each mark waking from dimmed to full under the cursor. Every
// logo shares one height so the wall reads even. Follows the theme.

const ROW_A = [
  "mclaren-logo", "nike-white", "red-bull-7", "natwest-white", "spotify-white",
  "defender-white", "meta-logo-white", "aston-martin-white", "airbus-white",
  "abby-road-studios-white", "soho-house-white", "salomon-logo-white",
];
const ROW_B = [
  "zuma-white", "led-zeppelin-logo-1", "waldorf-astoria-white", "diageo-white",
  "tui-white", "racing-tv-white", "mac-cosemetics-white", "malle-logo-white",
  "62ebd2669147fe93452c8ffd-er-primary-logowhite", "castle-air-white",
  "kayali-white", "crystal-ski-white",
];

function Row({ logos, reverse, dur }: { logos: string[]; reverse?: boolean; dur: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: dur, ease: "none", repeat: -1 },
    );
    return () => { tween.kill(); };
  }, [reverse, dur]);

  const list = [...logos, ...logos];
  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 9%, black 91%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 9%, black 91%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-16 py-6 will-change-transform">
        {list.map((slug, i) => (
          <span key={`${slug}-${i}`} className="flex h-12 w-[150px] shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${slug}.png`}
              alt=""
              aria-hidden
              className="logo-mark max-h-[29px] max-w-[130px] object-contain opacity-55 transition-opacity duration-300 hover:opacity-100 [html[data-mode=light]_&]:invert"
              loading="lazy"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section
      data-theme="dark"
      data-surface="page"
      data-chapter="02 — Trusted by"
      className="relative px-5 py-20 md:px-10 md:py-28"
      aria-label="Trusted by"
    >
      <div className="mb-12 flex items-baseline justify-between">
        <span className="label-mono text-[11px] tracking-[0.28em] opacity-60">TRUSTED BY</span>
        <span className="label-mono text-[11px] tracking-[0.28em] text-[var(--gold)]/80">
          40+ BRANDS · 8 YEARS
        </span>
      </div>
      <Row logos={ROW_A} dur={44} />
      <Row logos={ROW_B} reverse dur={56} />
    </section>
  );
}

```

## FILE: src/components/home/WhirlwindGallery.tsx
```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// SC.07 — the finale AND the end of the page. Tiles train in from the
// bottom-left, slide UNDER the words first, swing up the far side into a
// circle, and KEEP SPINNING — and while the ring is still turning, each
// tile fires off in turn to its own spot on the screen. The line types
// itself with the scroll and never leaves. "Start here" rises, the page
// LOCKS (nothing below this section), and a slim footer slides up from
// the bottom edge: contacts left, socials right. That's the site.

const TILES = [
  "/videos/micro/m01.mp4", "/videos/micro/m02.mp4", "/videos/micro/m03.mp4",
  "/videos/micro/m04.mp4", "/videos/micro/m05.mp4", "/videos/micro/m06.mp4",
  "/videos/micro/m07.mp4", "/videos/micro/m08.mp4", "/videos/micro/m09.mp4",
  "/videos/micro/m10.mp4", "/videos/micro/m11.mp4", "/videos/micro/m12.mp4",
  "/videos/micro/m05.mp4", "/videos/micro/m09.mp4",
];

// 14 resting places — tighter spread, bottom strip left clear for the footer
const SCATTER = [
  [-36, -26], [-12, -29], [12, -28], [36, -25],
  [-43, -4], [43, -6],
  [-26, -16], [26, -15],
  [-36, 16], [-12, 20], [12, 19], [36, 15],
  [-26, 8], [26, 7],
];

const LINE_A = "Every film is a chance to ";
const LINE_B = "break the ordinary.";

const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function WhirlwindGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const typedRef = useRef(-1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const tiles = gsap.utils.toArray<HTMLElement>(".whirl-tile", root);
      const chars = gsap.utils.toArray<HTMLElement>(".type-char", root);
      const cta = root.querySelector(".cta-start");
      const foot = root.querySelector(".finale-foot");
      const N = tiles.length;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const RX = 0.33 * W;
      const RY = 0.24 * H;
      const PHI = (-14 * Math.PI) / 180; // ring tilted: it arches higher to the right
      const START = { x: -0.58 * W, y: 0.55 * H };
      const GAP = 0.055;
      const ENTRY = 0.18;
      const SPIN = (Math.PI * 2) / 0.5; // one full circuit per 0.5 path units
      const T0 = (-32 * Math.PI) / 180; // join LOW, just left of bottom — never at the word
      const HEAD_MAX = ENTRY + 0.5 * 0.85 + (N - 1) * GAP; // ~one circuit, still turning as they fire off

      gsap.set(tiles, { x: START.x, y: START.y, scale: 0.5, autoAlpha: 0 });
      gsap.set(chars, { opacity: 0 });
      gsap.set(cta, { opacity: 0, y: 26 });
      gsap.set(foot, { yPercent: 102 });

      const pathPos = (s: number) => {
        if (s < ENTRY) {
          const t = s / ENTRY;
          const ex0 = Math.sin(T0) * RX;
          const ey0 = Math.cos(T0) * RY;
          const E = {
            x: ex0 * Math.cos(PHI) - ey0 * Math.sin(PHI),
            y: ex0 * Math.sin(PHI) + ey0 * Math.cos(PHI),
          };
          const C = { x: -0.4 * W, y: 0.5 * H }; // hugs the floor on the way in
          const u = 1 - t;
          return {
            x: u * u * START.x + 2 * u * t * C.x + t * t * E.x,
            y: u * u * START.y + 2 * u * t * C.y + t * t * E.y,
            theta: T0,
          };
        }
        const theta = T0 + (s - ENTRY) * SPIN; // …and it keeps spinning
        const ex = Math.sin(theta) * RX;
        const ey = Math.cos(theta) * RY;
        // tilt the ring (rope-loop, not a perfect circle): higher on the right
        return {
          x: ex * Math.cos(PHI) - ey * Math.sin(PHI),
          y: ex * Math.sin(PHI) + ey * Math.cos(PHI),
          theta,
        };
      };

      const place = (p: number) => {
        const head = smooth(0.02, 0.82, p) * HEAD_MAX;
        tiles.forEach((t, i) => {
          const s = head - i * GAP; // unclamped: the ring never piles up
          if (s <= 0) {
            gsap.set(t, { autoAlpha: 0, x: START.x, y: START.y });
            return;
          }
          const pos = pathPos(s);
          const d = (Math.cos(pos.theta) + 1) / 2;
          // each tile fires off its own spot WHILE the ring still turns
          const eOut = smooth(0.6 + i * 0.018, 0.76 + i * 0.018, p);
          const x = lerp(pos.x, (SCATTER[i][0] / 100) * W, eOut);
          const y = lerp(pos.y, (SCATTER[i][1] / 100) * H, eOut);
          const scale = lerp(lerp(0.55, 1.1, d), 0.8, eOut);
          gsap.set(t, {
            x, y, scale,
            rotationY: Math.sin(pos.theta) * -40 * (1 - eOut),
            opacity: Math.min(1, s * 16) * lerp(lerp(0.55, 1, d), 1, eOut),
            autoAlpha: Math.min(1, s * 16),
            zIndex: Math.round(lerp(lerp(2, 30, d), 6, eOut)),
          });
        });

        const want = Math.floor(smooth(0.04, 0.5, p) * chars.length);
        if (want !== typedRef.current) {
          typedRef.current = want;
          chars.forEach((c, i) => {
            c.style.opacity = i < want ? "1" : "0";
          });
        }

        const e = smooth(0.82, 0.9, p);
        gsap.set(cta, { opacity: e, pointerEvents: e > 0.5 ? "auto" : "none", y: 26 * (1 - e) });
        // the slim footer rises from the bottom edge — the page ends here
        gsap.set(foot, { yPercent: 102 - 102 * smooth(0.92, 0.99, p) });
      };
      place(0);

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => place(self.progress),
      });
      return () => st.kill();
    });

    const vids = root.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "10% 0px" },
    );
    vids.forEach((v) => io.observe(v));

    return () => {
      mm.revert();
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="media"
      data-chapter="The finale"
      className="relative motion-safe:md:h-[520vh]"
      aria-label="Every film is a chance to break the ordinary"
    >
      <div
        className="sticky top-0 hidden h-screen items-center justify-center overflow-hidden md:flex"
        style={{ perspective: "1100px" }}
      >
        <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {TILES.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="whirl-tile absolute -ml-[4.5rem] -mt-11 w-36 overflow-hidden rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.45)] will-change-transform"
            >
              <video className="aspect-video w-full object-cover" src={src} poster={src.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")} aria-hidden muted loop playsInline preload="none" />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl px-8 text-center">
          <p className="font-display text-[clamp(1.7rem,1rem+2vw,3rem)] leading-tight" aria-label={LINE_A + LINE_B}>
            {LINE_A.trim().split(" ").map((w, wi) => (
              <span key={`a${wi}`} className="inline-block whitespace-nowrap" aria-hidden>
                {w.split("").map((c, i) => (
                  <span key={i} className="type-char">{c}</span>
                ))}
                {" "}
              </span>
            ))}
            <span className="font-accent text-[var(--gold)]" aria-hidden>
              {LINE_B.split(" ").map((w, wi, arr) => (
                <span key={`b${wi}`} className="inline-block whitespace-nowrap">
                  {w.split("").map((c, i) => (
                    <span key={i} className="type-char">{c}</span>
                  ))}
                  {wi < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </p>
          <Link
            href="/contact"
            className="cta-start label-mono lift-hover mt-10 inline-block rounded-full border-2 border-[var(--gold)] bg-[var(--bg)]/60 px-14 py-6 text-base text-[var(--gold)] backdrop-blur-sm transition-colors duration-500 hover:bg-[var(--gold)] hover:text-[#050505]"
          >
            Start here ⟶
          </Link>
        </div>

        {/* the slim footer — rises from the bottom edge, the page ends here */}
        <footer className="finale-foot absolute inset-x-0 bottom-0 z-30 border-t border-[var(--hairline-dark)] bg-[var(--bg)]/95 py-6 pl-16 pr-5 backdrop-blur-sm md:pl-20 md:pr-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-col gap-1.5">
              <a href="mailto:harry@hwmedia.productions" className="text-base transition-colors hover:text-[var(--gold)] md:text-lg">
                harry@hwmedia.productions
              </a>
              <a href="https://wa.me/" className="text-base transition-colors hover:text-[var(--gold)] md:text-lg">
                
              </a>
            </div>
            <div className="flex items-center gap-6">
              <span className="label-mono opacity-70">HW Media · London</span>
              <a href="https://www.instagram.com/hwmedia/" aria-label="Instagram" className="opacity-70 transition-opacity hover:opacity-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/harry-wallis-98b47b161/" aria-label="LinkedIn" className="opacity-70 transition-opacity hover:opacity-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5A2.49 2.49 0 1 1 5 8.48a2.49 2.49 0 0 1-.02-4.98zM3 9.75h4v10.75H3zM9.5 9.75h3.83v1.47h.05c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.79 2.6 4.79 5.98v5.25h-4v-4.65c0-1.11-.02-2.54-1.58-2.54-1.59 0-1.83 1.21-1.83 2.46v4.73h-4.04z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* mobile/reduced: line + grid + CTA + slim footer */}
      <div className="px-5 py-24 md:hidden">
        <p className="font-display text-2xl">
          Every film is a chance to <span className="font-accent text-[var(--gold)]">break the ordinary.</span>
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {TILES.slice(0, 6).map((src, i) => (
            <video key={`${src}-${i}`} className="aspect-video w-full rounded-md object-cover" src={src} muted loop playsInline preload="none" />
          ))}
        </div>
        <Link href="/contact" className="label-mono mt-10 inline-block rounded-full border border-[var(--gold)] px-10 py-4 text-[var(--gold)]">
          Start here ⟶
        </Link>
        <div className="mt-12 border-t border-[var(--hairline-dark)] pt-6 text-sm">
          <a href="mailto:harry@hwmedia.productions" className="block">harry@hwmedia.productions</a>
          <a href="https://wa.me/" className="mt-1 block"></a>
          <span className="label-mono mt-3 block opacity-50">HW Media · London</span>
        </div>
      </div>
    </section>
  );
}

```

## FILE: src/app/globals.css
```css
@import "tailwindcss";

:root {
  --black: #050505;
  --black-2: #0a0a0a;
  --cream: #f9f6e4;
  --ink: #171717;
  --paper-text: #f5f1e6;
  --gold: #bfaa53;
  --red: #c62222;
  --tint-w: rgba(255, 255, 255, 0.1);
  --tint-b: rgba(0, 0, 0, 0.1);
  --hairline-dark: rgba(245, 241, 230, 0.14);
  --hairline-light: #d8d2bd;
  --ease-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --dur-fast: 0.2s;
  --dur-base: 0.4s;
  --dur-slow: 0.6s;
  --dur-slower: 0.8s;
  --dur-slowest: 1s;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-fast: 0s;
    --dur-base: 0s;
    --dur-slow: 0s;
    --dur-slower: 0s;
    --dur-slowest: 0s;
  }
}

@theme inline {
  --color-black: var(--black);
  --color-black-2: var(--black-2);
  --color-cream: var(--cream);
  --color-ink: var(--ink);
  --color-paper: var(--paper-text);
  --color-gold: var(--gold);
  --color-brand-red: var(--red);
}

/* ---- Global mode (user toggle, bottom-left) ----
   ONE surface for the whole site. Gold + red never change; only the
   background/foreground contrast flips. Legacy vars (--ink, --paper-text,
   --hairline-*) are set literally per mode so every existing component
   follows without edits. */
html,
html[data-mode="dark"] {
  --bg: var(--black);
  --fg: #f5f1e6;
  --ink: #f5f1e6;
  --paper-text: #f5f1e6;
  --hairline-dark: rgba(245, 241, 230, 0.14);
  --hairline-light: rgba(245, 241, 230, 0.14);
}
html[data-mode="light"] {
  --bg: var(--cream);
  --fg: #171717;
  --ink: #171717;
  --paper-text: #171717;
  --hairline-dark: rgba(23, 23, 23, 0.16);
  --hairline-light: #d8d2bd;
}

/* always-cinema surfaces (lens stage, menu overlay, text over footage):
   locked to dark regardless of mode */
.on-media {
  --bg: #050505;
  --fg: #f5f1e6;
  --ink: #f5f1e6;
  --paper-text: #f5f1e6;
  --hairline-dark: rgba(245, 241, 230, 0.14);
  --hairline-light: rgba(245, 241, 230, 0.14);
  color: #f5f1e6;
}

html {
  background: var(--bg);
  color: var(--fg);
  transition: background 0.5s var(--ease-expo), color 0.5s var(--ease-expo);
}

body {
  font-family: var(--font-body), sans-serif;
  font-weight: 400;
}

/* ---- Type roles ----
   Display voice = Archivo Expanded Black (George's pick over the client Playfair kit).
   Normal keeps Archivo — compare :3003 vs :3004. */
.font-display {
  font-family: var(--font-archivo), sans-serif;
  font-variation-settings: "wdth" 125;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.82;
}

/* Editorial-restraint display scale — nothing on the site exceeds display-xl. */
.display-xl {
  font-size: clamp(2.45rem, 1.1rem + 4.6vw, 6rem); /* 39 → 96px */
  line-height: 0.86;
}
.display-lg {
  font-size: clamp(2.25rem, 1.1rem + 3.2vw, 4rem); /* 36 → 64px */
  line-height: 0.9;
}
.display-md {
  font-size: clamp(1.75rem, 1rem + 1.9vw, 2.75rem); /* 28 → 44px */
  line-height: 0.95;
}

/* Scene markers — the one sanctioned label grammar (edit-timeline indices). */
.scene-marker {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}
.scene-marker::after {
  content: "";
  flex: 1;
  height: 1px;
  background: currentColor;
  opacity: 0.18;
  align-self: center;
}

.font-accent {
  font-family: var(--font-instrument), serif;
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}

.label-mono {
  font-family: var(--font-plex-mono), monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.font-hand {
  font-family: var(--font-hand), cursive;
  color: var(--red);
}

/* ---- Section theming: every section follows the global mode ---- */
[data-theme] {
  background: var(--bg);
  color: var(--fg);
  transition: background 0.5s var(--ease-expo), color 0.5s var(--ease-expo);
}

::selection {
  background: var(--gold);
  color: var(--black);
}

/* ---- Nav: follows the global mode; wordmark stays gold in both ---- */
.nav-root {
  color: var(--fg);
  transition: color var(--dur-slow) var(--ease-expo);
}
/* the nav re-themes to the surface beneath it: cinema sections force the
   nav dark (so light mode never bleeds a cream band over footage);
   editorial sections leave it inheriting the global mode */
.nav-root[data-surface="media"] {
  --bg: #050505;
  --fg: #f5f1e6;
}
.nav-wordmark {
  color: var(--gold);
}
.nav-link {
  position: relative;
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 1px;
  width: 100%;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--dur-base) var(--ease-expo);
}
.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* ---- Film grain (dark sections only) ---- */
.grain {
  background-size: 240px 240px;
  opacity: 0.07;
  transition: opacity var(--dur-slow) linear;
  animation: grain-jump 0.9s steps(6) infinite;
}
html[data-mode="light"] .grain {
  opacity: 0;
}
@keyframes grain-jump {
  0% { background-position: 0 0; }
  20% { background-position: -60px 40px; }
  40% { background-position: 40px -70px; }
  60% { background-position: -110px -30px; }
  80% { background-position: 80px 90px; }
  100% { background-position: 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .grain { animation: none; }
}

/* Hide native cursor only where the custom one takes over */
@media (pointer: fine) {
  [data-cursor="play"] { cursor: none; }
}

/* SplitText line wrappers clip their rising chars. nowrap stops char spans
   re-wrapping inside the mask on narrow viewports (the mask would grow a
   row tall and leak the dropped chars). */
.split-line {
  overflow: hidden;
  white-space: nowrap;
}

/* ---- Outlined display type — strokes follow the mode foreground ---- */
.svc-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--fg);
}
@media (max-width: 767px) {
  .svc-outline {
    -webkit-text-stroke: 1px var(--fg);
  }
}
/* mid-strength outline (deck's "FOR THOSE WHO DARE" marquee) */
.ghost-outline {
  color: transparent;
  -webkit-text-stroke: 1.5px color-mix(in srgb, var(--fg) 45%, transparent);
}
@media (max-width: 767px) {
  .ghost-outline {
    -webkit-text-stroke: 1px color-mix(in srgb, var(--fg) 45%, transparent);
  }
}
/* faint ghost numerals (services scenes) */
.ghost-outline-ink {
  color: transparent;
  -webkit-text-stroke: 1.5px color-mix(in srgb, var(--fg) 22%, transparent);
}

/* ---- Deck motifs (from the Chasing The Salt treatment) ---- */
/* highlight-bar label: text sitting in a solid bar, inverted vs the mode */
.bar-label {
  display: inline-block;
  background: var(--fg);
  color: var(--bg);
  font-family: var(--font-plex-mono), monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  padding: 0.5em 0.95em 0.45em;
}
/* the deck ends text blocks with a short heavy rule */
.note-rule::after {
  content: "";
  display: block;
  width: 3rem;
  height: 2px;
  background: currentColor;
  margin-top: 1.25rem;
  opacity: 0.85;
}

/* white client logos stay visible in light mode */
html[data-mode="light"] .logo-mark {
  filter: invert(1);
}

/* ---- Lens vessel: circular glass that holds the reel ---- */
.lens-vessel {
  clip-path: circle(50%);
  border-radius: 50%;
}

/* ---- Interaction polish ---- */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}
/* gentle lift for chips, buttons, cards */
.lift-hover {
  transition: transform 0.45s var(--ease-expo), box-shadow 0.45s var(--ease-expo);
}
.lift-hover:hover {
  transform: translateY(-3px);
}
/* ledger rows warm up on hover */
.ledger-row {
  transition: border-color 0.4s var(--ease-expo), padding-left 0.4s var(--ease-expo);
}
.ledger-row:hover {
  border-color: var(--gold);
  padding-left: 0.5rem;
}
/* timeline clips respond to the cursor */
.tl-clip {
  transition: transform 0.4s var(--ease-expo), filter 0.4s var(--ease-expo);
}
.tl-clip:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.15);
}

/* ---- Film focus (selected films): hovering one card dims the others ---- */
.film-focus:has(.film-card:hover) .film-card:not(:hover) {
  opacity: 0.4;
}
.film-focus .film-card {
  transition: opacity 0.5s var(--ease-expo);
}

/* ---- Footer wordmark marquee ---- */
.marquee {
  display: flex;
}
/* track motion is GSAP-driven (velocity-reactive); CSS fallback only
   when reduced motion is off but JS fails is intentionally absent */

/* FCP-style clip selection */
/* S4-B: playhead lights gold while being dragged */
.fcp-scrubbing .fcp-ph-line {
  background: var(--gold);
  box-shadow: 0 0 12px rgba(191, 170, 83, 0.85);
}

.fcp-clip.fcp-active {
  border-color: var(--gold);
  box-shadow: 0 0 0 1px var(--gold), 0 0 14px rgba(191, 170, 83, 0.35);
}

/* options-board styleframe motion */
@keyframes hw-marquee { to { transform: translateX(-50%); } }
@keyframes hw-roll { to { transform: translateY(-50%); } }
@keyframes hw-blink { 0%, 58% { opacity: 1; } 59%, 100% { opacity: 0; } }
@keyframes hw-flicker { 0%, 100% { opacity: 0.92; } 42% { opacity: 0.66; } 43% { opacity: 0.88; } 71% { opacity: 0.5; } 72% { opacity: 0.9; } }
@keyframes hw-eq { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }

```
