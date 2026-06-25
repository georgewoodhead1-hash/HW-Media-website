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

const WORKS = projects.slice(0, 6);

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
      const FROM = 0.05;
      const TO = 0.58;
      const span = (TO - FROM) / N;

      const cta = root.querySelector<HTMLElement>(".ow-cta");
      gsap.set(head, { autoAlpha: 0, yPercent: 18 });
      gsap.set(bars, { autoAlpha: 0, yPercent: 48, scale: 0.955, force3D: true });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 16 });

      const place = (p: number) => {
        const enterHead = smooth(0.02, 0.12, p);
        const exit = smooth(0.86, 1, p);
        const ctaIn = smooth(0.45, 0.62, p);
        gsap.set(head, { autoAlpha: enterHead * (1 - exit), yPercent: lerp(18, 0, enterHead) - exit * 26 });
        if (cta) gsap.set(cta, { autoAlpha: ctaIn * (1 - exit), y: lerp(16, 0, ctaIn) - exit * 18 });
        bars.forEach((bar, i) => {
          const a = FROM + i * span;
          const b = a + span * 2.4;
          const t = smooth(a, b, p);
          gsap.set(bar, {
            yPercent: lerp(48, 0, t) - exit * 10,
            autoAlpha: t * (1 - exit),
            scale: lerp(0.955, 1, t) * lerp(1, 0.92, exit),
          });
          if (vids[i]) gsap.set(vids[i], { scale: lerp(1.12, 1, t) });
        });
      };
      place(0);

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
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
      className="relative z-10 bg-[var(--bg)] text-[var(--fg)] motion-safe:md:h-[130vh]"
      aria-label="Our work"
    >
      {/* ----- desktop / motion: pinned stage — heading then bars fly in to the accordion ----- */}
      <div className="hidden overflow-hidden px-5 motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:flex motion-safe:md:h-screen motion-safe:md:flex-col motion-safe:md:justify-center md:px-10">
        <h2
          className="ow-head font-display relative z-10 mb-[3.5vh] whitespace-nowrap text-center text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9] tracking-[-0.05em] will-change-transform"
                 >
          Featured <span className="text-[var(--gold-text)]">Projects</span>
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
