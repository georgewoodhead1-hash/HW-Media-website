"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 03 — Our Work. The FINAL layout is the vinyl-browse accordion (the look the
// client signed off — film bars side by side, hover one to expand). The only
// new thing is the ENTRANCE: as the section pins, "Our work" reveals in the
// middle, then the six film bars fly in from the right edge one by one and
// settle into their accordion slots ("bang, bang, bang"). Once they're home
// the accordion behaves exactly as before (hover-expand). All scroll-driven,
// slow and smooth.

const WORKS = projects.slice(0, 6);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, t: number) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

export default function OurWork() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const bars = gsap.utils.toArray<HTMLElement>(".ow-bar", root);
      const head = root.querySelector<HTMLElement>(".ow-head");
      const N = bars.length;

      // type the heading in char-by-char as the section pins, then settle it as
      // a smaller title ABOVE the accordion row (it never fades away).
      const split = head ? new SplitText(head, { type: "chars" }) : null;
      const chars = split ? (split.chars as HTMLElement[]) : [];

      // bars arrive between FROM and TO; the windows are wide and overlapping so
      // each film glides across rather than popping. After TO the full accordion
      // is held so there's a comfortable window to hover before release.
      const FROM = 0.2;
      const TO = 0.82;
      const span = (TO - FROM) / N;

      const place = (p: number) => {
        // heading types itself in char-by-char in its OWN row ABOVE the
        // accordion (it never moves over the films — no overlap).
        if (head && chars.length) {
          chars.forEach((ch, i) => {
            const cs = (i / Math.max(1, chars.length)) * 0.14;
            const reveal = smooth(0.04 + cs, 0.14 + cs, p);
            gsap.set(ch, { autoAlpha: reveal, yPercent: lerp(60, 0, reveal) });
          });
        }
        // each film bar glides in from the right edge into its accordion slot,
        // fading up smoothly along a soft ramp (no hard cut, no pop).
        const vw = window.innerWidth;
        bars.forEach((bar, i) => {
          const a = FROM + i * span;
          const b = a + span * 2.1; // wide, overlapping windows = seamless glide
          const t = smooth(a, b, p);
          const fade = smooth(a, a + (b - a) * 0.7, p); // soft alpha ramp
          gsap.set(bar, {
            x: lerp(vw * 1.05, 0, t),
            autoAlpha: fade,
            rotate: lerp(1.6, 0, t),
          });
        });
      };

      gsap.set(bars, { x: window.innerWidth * 1.05, autoAlpha: 0 });
      if (chars.length) gsap.set(chars, { autoAlpha: 0 });
      place(0);

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      });

      return () => {
        st.kill();
        split?.revert();
      };
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "10% 0px" },
    );
    root.querySelectorAll("video").forEach((v) => io.observe(v));

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
      data-chapter="03 — Our work"
      className="relative bg-[var(--bg)] text-[var(--fg)] motion-safe:md:h-[380vh]"
      aria-label="Our work"
    >
      {/* ----- desktop / motion: pinned stage — heading then bars fly in to the accordion ----- */}
      <div className="hidden overflow-hidden px-5 motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:flex motion-safe:md:h-screen motion-safe:md:flex-col motion-safe:md:justify-center md:px-10">
        <h2
          className="ow-head font-display relative z-10 mb-[3.5vh] whitespace-nowrap text-center text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.9] will-change-transform"
          style={{ fontWeight: 400 }}
        >
          Our <span className="text-[var(--gold)]">work</span>
        </h2>

        {/* the accordion row — final layout; bars fly in from the right into their slots */}
        <div className="relative z-0 flex h-[60vh] gap-2">
          {WORKS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="ow-bar group relative flex-1 overflow-hidden rounded-md ring-1 ring-[var(--hairline-dark)] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:flex-[5]"
              aria-label={`${p.title} — ${p.client}`}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={p.wide}
                poster={p.posterWide}
                muted
                loop
                playsInline
                preload="none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 transition-colors duration-500 group-hover:from-black/65" />

              {/* collapsed — vertical client label */}
              <span className="label-mono absolute bottom-5 left-1/2 -translate-x-1/2 rotate-180 whitespace-nowrap text-[11px] tracking-[0.2em] text-white/80 opacity-100 transition-opacity duration-300 [writing-mode:vertical-rl] group-hover:opacity-0">
                {p.client.toUpperCase()}
              </span>

              {/* expanded — title + watch */}
              <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="label-mono text-[10px] tracking-[0.24em] text-[var(--gold)]">
                  {String(i + 1).padStart(2, "0")} · {p.client.toUpperCase()}
                </span>
                <h3 className="font-display mt-2 whitespace-nowrap text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none text-white" style={{ fontWeight: 400 }}>
                  {p.title}
                </h3>
                <span className="label-mono mt-3 inline-block text-[10px] tracking-[0.22em] text-white/70">WATCH ⟶</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* mobile stack */}
      <div className="flex flex-col gap-4 px-5 py-[10vh] md:hidden">
        <h2 className="font-display mb-2 text-4xl" style={{ fontWeight: 400 }}>Our <span className="text-[var(--gold)]">work</span></h2>
        {WORKS.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="relative block aspect-video overflow-hidden rounded-md">
            <video className="absolute inset-0 h-full w-full object-cover" src={p.wide} poster={p.posterWide} muted loop playsInline preload="none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="label-mono text-[9px] tracking-[0.2em] text-[var(--gold)]">{p.client.toUpperCase()}</span>
              <h3 className="font-display text-xl text-white" style={{ fontWeight: 400 }}>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
