"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// SC.07 — the finale. Tiles train in from the bottom-left, swing up into the
// tilted ring and KEEP SPINNING while the line types itself in the middle
// ("Every film is a chance to break the ordinary."). Then the tiles SPREAD
// OUT to their resting spots, fill the page, and HOLD there — and as you keep
// scrolling the whole stage lifts off the FOOTER revealed layered behind it
// (Stone Visuals sticky reveal — see shell/FooterReveal). No fly-off, no
// spiral exit: George reverted that.

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
      const N = tiles.length;
      // geometry recomputed on refresh so a resize/orientation change never
      // leaves the whirlwind firing tiles to stale positions (audit fix)
      let W = window.innerWidth;
      let H = window.innerHeight;
      let RX = 0.33 * W;
      let RY = 0.24 * H;
      let START = { x: -0.58 * W, y: 0.55 * H };
      const recompute = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        RX = 0.33 * W;
        RY = 0.24 * H;
        START = { x: -0.58 * W, y: 0.55 * H };
      };
      const PHI = (-14 * Math.PI) / 180; // ring tilted: it arches higher to the right
      const GAP = 0.055;
      const ENTRY = 0.18;
      const SPIN = (Math.PI * 2) / 0.5; // one full circuit per 0.5 path units
      const T0 = (-32 * Math.PI) / 180; // join LOW, just left of bottom — never at the word
      const HEAD_MAX = ENTRY + 0.5 * 0.85 + (N - 1) * GAP; // ~one circuit, still turning as they fire off

      gsap.set(tiles, { x: START.x, y: START.y, scale: 0.5, autoAlpha: 0 });
      gsap.set(chars, { opacity: 0 });
      gsap.set(cta, { opacity: 0, y: 26 });

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

      const place = (pRaw: number) => {
        // the first ~22% of the section happens BEHIND the FAQs curtain
        // (Stone Visuals stage-curtain reveal) — tiles are already training in
        // as the curtain clears, so there's no dead black viewport between the
        // last FAQ row leaving and the show starting
        const p = Math.min(1, Math.max(0, (pRaw - 0.17) / 0.83));
        const head = smooth(0.0, 0.58, p) * HEAD_MAX;
        tiles.forEach((t, i) => {
          const s = head - i * GAP; // unclamped: the ring never piles up
          if (s <= 0) {
            gsap.set(t, { autoAlpha: 0, x: START.x, y: START.y });
            return;
          }
          const pos = pathPos(s);
          const d = (Math.cos(pos.theta) + 1) / 2;
          // ring spins while the line types (below) … then the tiles SPREAD OUT
          // to their resting spots and HOLD there to the end — the spread page
          // is the final frame the footer reveal lifts away
          const eOut = smooth(0.6 + i * 0.012, 0.74 + i * 0.012, p);
          const x = lerp(pos.x, (SCATTER[i][0] / 100) * W, eOut);
          const y = lerp(pos.y, (SCATTER[i][1] / 100) * H, eOut);
          const scale = lerp(lerp(0.55, 1.1, d), 0.8, eOut);
          gsap.set(t, {
            x, y, scale,
            rotationY: Math.sin(pos.theta) * -40 * (1 - eOut),
            opacity: Math.min(1, s * 8) * lerp(lerp(0.55, 1, d), 1, eOut),
            autoAlpha: Math.min(1, s * 8),
            zIndex: Math.round(lerp(lerp(2, 30, d), 6, eOut)),
          });
        });

        // the line types itself WHILE the ring is still spinning around it
        const want = Math.floor(smooth(0.26, 0.56, p) * chars.length);
        if (want !== typedRef.current) {
          typedRef.current = want;
          chars.forEach((c, i) => {
            c.style.opacity = i < want ? "1" : "0";
          });
        }

        // Start here follows the finished line, before the spread completes
        const e = smooth(0.6, 0.78, p);
        gsap.set(cta, { opacity: e, pointerEvents: e > 0.5 ? "auto" : "none", y: 26 * (1 - e) });
      };
      place(0);

      const st = ScrollTrigger.create({
        trigger: root,
        // start only when the section is PINNED and filling the screen — not when
        // its top edge first appears (that made the whole thing animate while the
        // FAQs were still on screen / way too early).
        start: "top top",
        end: "bottom bottom",
        scrub: 1.6, // heavier catch-up = the smooth, weighted feel (George)
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => { recompute(); place(self.progress); },
      });

      // the HAND-OFF into the footer: as the page starts lifting off the
      // fixed footer, the whole finale stage drifts up and dims — the last
      // frame flows into the reveal instead of cutting (scrubbed = reversible)
      const stage = root.querySelector<HTMLElement>(".whirl-stage");
      const handoff = stage
        ? gsap.fromTo(
            stage,
            { y: 0, autoAlpha: 1 },
            {
              y: -90, autoAlpha: 0.45, ease: "none",
              scrollTrigger: { trigger: root, start: "bottom bottom", end: "bottom 30%", scrub: 1.2 },
            },
          )
        : null;

      return () => { st.kill(); handoff?.scrollTrigger?.kill(); handoff?.kill(); };
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
      data-surface="page"
      data-chapter="The finale"
      className="relative z-0 motion-safe:md:-mt-[100vh] motion-safe:md:h-[400vh]"
      aria-label="Selected work finale"
    >
      <div
        className="whirl-stage sticky top-0 hidden h-screen items-center justify-center overflow-hidden will-change-transform md:flex"
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

        {/* the tagline is GONE (client final round) — the ring spins around
            the lone CTA now */}
        <div className="relative z-10 max-w-2xl px-8 text-center">
          <Link href="/contact" className="cta-start blink inline-block text-[14px] tracking-[0.05em]">
            Start here
          </Link>
        </div>

      </div>

      {/* mobile/reduced: grid + CTA (footer = shell/FooterReveal) */}
      <div className="px-5 py-24 md:hidden">
        <div className="grid grid-cols-2 gap-4">
          {TILES.slice(0, 6).map((src, i) => (
            <video key={`${src}-${i}`} className="aspect-video w-full rounded-md object-cover" src={src} muted loop playsInline preload="none" />
          ))}
        </div>
        <Link href="/contact" className="blink mt-10 inline-block text-[14px] tracking-[0.05em]">
          Start here
        </Link>
      </div>
    </section>
  );
}
