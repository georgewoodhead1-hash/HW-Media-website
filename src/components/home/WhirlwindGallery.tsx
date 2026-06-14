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

        const want = Math.floor(smooth(0.03, 0.32, p) * chars.length);
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
      className="relative motion-safe:md:-mt-[30vh] motion-safe:md:h-[440vh]"
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
          <span className="label-mono mt-3 block opacity-50">HW Media · London</span>
        </div>
      </div>
    </section>
  );
}
