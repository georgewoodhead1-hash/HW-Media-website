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
      gsap.set(foot, { yPercent: 110, autoAlpha: 0 });

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

        // slim footer rises up from the bottom edge at the very end
        const f = smooth(0.9, 0.99, p);
        gsap.set(foot, {
          yPercent: 110 * (1 - f),
          autoAlpha: f,
          pointerEvents: f > 0.5 ? "auto" : "none",
        });
      };
      place(0);

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => { recompute(); place(self.progress); },
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
      data-surface="page"
      data-chapter="The finale"
      className="relative motion-safe:md:-mt-[30vh] motion-safe:md:h-[340vh]"
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
            <span aria-hidden>
              {LINE_B.split(" ").map((w, wi, arr) => {
                const isGold = w.replace(/[^a-zA-Z]/g, "").toLowerCase() === "break";
                return (
                  <span key={`b${wi}`} className={`inline-block whitespace-nowrap ${isGold ? "text-[var(--gold-text)]" : ""}`}>
                    {w.split("").map((c, i) => (
                      <span key={i} className="type-char">{c}</span>
                    ))}
                    {wi < arr.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </span>
          </p>
          <Link
            href="/contact"
            className="cta-start label-mono lift-hover mt-10 inline-block rounded-full border-2 border-[var(--gold)] bg-[var(--bg)]/60 px-14 py-6 text-base text-[var(--gold-text)] backdrop-blur-sm transition-colors duration-500 hover:bg-[var(--gold)] hover:text-[#050505]"
          >
            Start here ⟶
          </Link>
        </div>

        {/* slim footer — rises up from the bottom edge at the very end of the scroll */}
        <div
          className="finale-foot absolute inset-x-0 bottom-0 z-[60] border-t border-[var(--hairline-dark)] bg-[var(--bg)]/95 px-8 py-5 backdrop-blur-md will-change-transform"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          {/* left padding clears the fixed theme toggle + social rail in the
              bottom-left corner so the email is never occluded by them. */}
          <div className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-3 pl-[172px] pr-2 text-sm text-[var(--fg)]">
            <a
              href="mailto:harry@hwmedia.productions"
              className="text-[var(--fg)]/85 transition-colors hover:text-[var(--gold-text)]"
            >
              harry@hwmedia.productions
            </a>

            <nav className="flex items-center gap-6" aria-label="Social links">
              <a
                href="https://www.instagram.com/hwmedia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--fg)]/85 transition-colors hover:text-[var(--gold-text)]"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/harry-wallis-98b47b161/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--fg)]/85 transition-colors hover:text-[var(--gold-text)]"
              >
                LinkedIn
              </a>
            </nav>

            <div className="flex items-center gap-6 text-[var(--fg)]/55">
              <span>© {new Date().getFullYear()} HW MEDIA · LONDON</span>
              <Link href="/privacy" className="transition-colors hover:text-[var(--gold-text)]">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* mobile/reduced: line + grid + CTA + slim footer */}
      <div className="px-5 py-24 md:hidden">
        <p className="font-display text-2xl">
          Every film is a chance to <span className="text-[var(--gold-text)]">break</span> the ordinary.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {TILES.slice(0, 6).map((src, i) => (
            <video key={`${src}-${i}`} className="aspect-video w-full rounded-md object-cover" src={src} muted loop playsInline preload="none" />
          ))}
        </div>
        <Link href="/contact" className="label-mono mt-10 inline-block rounded-full border border-[var(--gold)] px-10 py-4 text-[var(--gold-text)]">
          Start here ⟶
        </Link>

        {/* slim footer — static on mobile / reduced-motion */}
        <div
          className="mt-16 border-t border-[var(--hairline-dark)] pt-6 text-sm"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          <a href="mailto:harry@hwmedia.productions" className="block text-[var(--fg)]/85">
            harry@hwmedia.productions
          </a>
          <div className="mt-4 flex items-center gap-6">
            <a
              href="https://www.instagram.com/hwmedia/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg)]/85"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/harry-wallis-98b47b161/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg)]/85"
            >
              LinkedIn
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[var(--fg)]/55">
            <span>© {new Date().getFullYear()} HW MEDIA · LONDON</span>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
