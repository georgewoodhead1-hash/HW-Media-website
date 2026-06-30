"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 03 — Our Work. The FINAL layout is the vinyl-browse accordion (the look the
// client signed off — film bars side by side, hover one to expand). The only
// new thing is the ENTRANCE: as the section pins, "Our work" reveals in the
// middle, then the six film bars fly in from the right edge one by one and
// settle into their accordion slots ("bang, bang, bang"). Once they're home
// the accordion behaves exactly as before (hover-expand). All scroll-driven,
// slow and smooth.

// Featured order George specified: Otoko, McLaren, Hera, Salomon, Nike, Castle Air
// (Zuma dropped). Picked by slug so projects.ts order stays free.
const FEATURED_SLUGS = ["otoko", "mclaren", "hera", "salomon", "nike", "castle-air"];
const WORKS = FEATURED_SLUGS.map((s) => projects.find((p) => p.slug === s)).filter(
  (p): p is (typeof projects)[number] => Boolean(p),
);

// brand logos for the collapsed tiles (client: logos, not text labels)
const LOGO: Record<string, string> = {
  McLaren: "mclaren-logo",
  Nike: "nike-white",
  Zuma: "zuma-white",
  Salomon: "salomon-logo-white",
  Defender: "defender-white",
  "Black Crows": "logo-black-crows-white",
};

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
      const vids = bars.map((b) => b.querySelector("video"));

      // GPU-ONLY reveal (transform + opacity, NO per-frame clip-path — that churn
      // was the clunk): the heading lifts in, then each film slides up + fades in
      // turn. On the section's EXIT the whole stage zooms out and lifts away as
      // Our Process rises over it — the scroll transition out of Featured Projects.
      const FROM = 0.0;
      const TO = 0.4;
      const span = (TO - FROM) / N;

      const cta = root.querySelector<HTMLElement>(".ow-cta");
      const chars = gsap.utils.toArray<HTMLElement>(".ow-char", root);
      const caret = root.querySelector<HTMLElement>(".ow-caret");
      gsap.set(head, { autoAlpha: 1, yPercent: 0 });
      gsap.set(chars, { opacity: 0 });
      gsap.set(caret, { autoAlpha: 1 });
      gsap.set(bars, { autoAlpha: 0, yPercent: 48, scale: 0.96, force3D: true });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 16 });

      // ENTRANCE — type "Featured Projects" like a typewriter AS YOU SCROLL in: the
      // chars light up tied to scroll, the gold caret fading out as the line finishes.
      const typeTl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 84%", end: "top 50%", scrub: 0.7 } });
      typeTl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.05, ease: "none" }, 0);
      typeTl.to(caret, { autoAlpha: 0, duration: 0.06 }, ">0.06");

      const place = (p: number) => {
        const headOut = smooth(0.84, 0.97, p);
        const ctaIn = smooth(0.3, 0.44, p);
        // EXIT — a slow, SYNCED show-curtain that drops on the TOP of every film
        // (bottom stays put, top clips down). Held back to 0.72 so the films sit
        // fully revealed for a long beat BEFORE the curtain falls (was exiting
        // before the entrance even finished).
        const exit = smooth(0.72, 1, p);
        gsap.set(head, { autoAlpha: 1 - headOut, yPercent: -headOut * 30 });
        if (cta) gsap.set(cta, { autoAlpha: ctaIn * (1 - headOut), y: lerp(16, 0, ctaIn) - headOut * 22 });
        bars.forEach((bar, i) => {
          const a = FROM + i * span;
          const b = a + span * 2.4;
          const t = smooth(a, b, p);
          gsap.set(bar, {
            yPercent: lerp(48, 0, t),
            autoAlpha: t,
            scale: lerp(0.96, 1, t),
            clipPath: `inset(${(exit * 100).toFixed(2)}% 0% 0% 0% round 0.375rem)`,
          });
          if (vids[i]) gsap.set(vids[i], { scale: lerp(1.12, 1, t) });
        });
      };
      place(0);

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1.1,
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => place(self.progress),
      });

      return () => { st.kill(); };
    });

    // mobile: the md:hidden tile stack is otherwise static — give each tile a
    // gentle fade-in + slight rise as it scrolls into view, staggered down.
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const tiles = gsap.utils.toArray<HTMLElement>(".ow-mtile", root);
      const tweens = tiles.map((tile, i) =>
        gsap.fromTo(
          tile,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: (i % 2) * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tile,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        ),
      );
      return () => tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "10% 0px" },
    );
    // mobile tiles only — the desktop accordion plays on hover (below), so all six
    // films never decode at once (a real clunk source per the audit).
    root.querySelectorAll(".ow-mtile video").forEach((v) => io.observe(v));

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
      className="relative z-10 bg-[var(--bg)] text-[var(--fg)] motion-safe:md:h-[230vh]"
      aria-label="Our work"
    >
      {/* ----- desktop / motion: pinned stage — heading then bars fly in to the accordion ----- */}
      <div className="hidden overflow-hidden px-5 motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:flex motion-safe:md:h-screen motion-safe:md:flex-col motion-safe:md:justify-center md:px-10">
        <h2
          className="ow-head font-display relative z-10 mb-[3.5vh] whitespace-nowrap text-center text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9] tracking-[-0.05em] will-change-transform"
        >
          {"Featured ".split("").map((c, i) => (
            <span key={`f-${i}`} className="ow-char inline-block whitespace-pre">{c}</span>
          ))}
          {"Projects".split("").map((c, i) => (
            <span key={`p-${i}`} className="ow-char inline-block whitespace-pre text-[var(--gold-text)]">{c}</span>
          ))}
          <span aria-hidden className="ow-caret ml-1 inline-block h-[0.82em] w-[4px] translate-y-[0.06em] bg-[var(--gold)] align-baseline" />
        </h2>

        {/* the accordion row — final layout; each film reveals in place with a masked wipe */}
        <div className="relative z-0 flex h-[52vh] gap-2">
          {WORKS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              onMouseEnter={(e) => { const v = e.currentTarget.querySelector("video"); if (v) v.play().catch(() => {}); }}
              onMouseLeave={(e) => { const v = e.currentTarget.querySelector("video"); if (v) v.pause(); }}
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
                preload="metadata"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 transition-colors duration-500 group-hover:from-black/65" />

              {/* collapsed — brand logo (text only on hover/expand, client) */}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                {LOGO[p.client] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/logos/${LOGO[p.client]}.png`}
                    alt={p.client}
                    className="max-h-8 w-auto max-w-[80%] object-contain opacity-90"
                  />
                ) : (
                  <span className="label-mono rotate-180 whitespace-nowrap text-[11px] tracking-[0.2em] text-white/80 [writing-mode:vertical-rl]">
                    {p.client.toUpperCase()}
                  </span>
                )}
              </span>

              {/* expanded — title + watch */}
              <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="label-mono text-[10px] tracking-[0.24em] text-[var(--gold-text)]">
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

        <Link
          href="/work"
          className="ow-cta group relative z-10 mt-6 inline-flex items-center gap-2 self-center rounded-full border border-[var(--fg)]/30 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--fg)] transition-colors duration-300 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          Discover more
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* mobile stack */}
      <div className="flex flex-col gap-4 px-5 py-[10vh] md:hidden">
        <h2 className="font-display mb-2 text-5xl tracking-[-0.04em]" style={{ fontWeight: 400 }}>Featured <span className="text-[var(--gold-text)]">Projects</span></h2>
        {WORKS.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="ow-mtile relative block aspect-video overflow-hidden rounded-md">
            <video className="absolute inset-0 h-full w-full object-cover" src={p.wide} poster={p.posterWide} muted loop playsInline preload="none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="label-mono text-[9px] tracking-[0.2em] text-[var(--gold-text)]">{p.client.toUpperCase()}</span>
              <h3 className="font-display text-xl text-white" style={{ fontWeight: 400 }}>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
