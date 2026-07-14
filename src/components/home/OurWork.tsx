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
// the hand-off tile — its film is also frame 1 of Our Process (the match-cut)
const HERA = WORKS.find((p) => p.slug === "hera");

// brand logos for the collapsed tiles (client: logos, not text labels).
// ROUND-8: Sans Matin + Castle Air wired (files exist); Otoko has no logo
// file yet — wordmark fallback until the client supplies one.
const LOGO: Record<string, string> = {
  McLaren: "mclaren-logo",
  Nike: "nike-white",
  Zuma: "zuma-white",
  Salomon: "salomon-logo-white",
  Defender: "defender-white",
  "Black Crows": "logo-black-crows-white",
  "Sans Matin": "sm-new-logo-design-white-2025",
  "Castle Air": "castle-air-white",
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
      gsap.set(head, { autoAlpha: 1, yPercent: 0 });
      gsap.set(chars, { opacity: 0 });
      gsap.set(bars, { autoAlpha: 0, yPercent: 34, scale: 0.97, force3D: true });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 16 });

      // ENTRANCE — "Featured Projects" types itself ONCE when the section
      // arrives (motion review: scrub-typing strands the heading half-written
      // whenever the user pauses; il capo's text always COMMITS).
      // ROUND-8: the underline is GONE from the load-in — it lives on the
      // heading's HOVER now (gold bar), pure CSS.
      const typeTl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 55%", toggleActions: "play none none reverse" },
      });
      typeTl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.045, ease: "none" }, 0);

      // ENTRANCE on passage — the bars fly in one after another as the
      // section arrives; the page NEVER stops (1820: no pins anywhere).
      // WINDOW RETIMED (George: "no in animation"): the old 78%→8% window
      // finished the fade while the bars were still BELOW THE FOLD — it ran,
      // but off-screen. Now it resolves as the section fills the frame.
      const enter = ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        end: "top 0%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const ctaIn = smooth(0.62, 0.82, p);
          if (cta) gsap.set(cta, { autoAlpha: ctaIn, y: lerp(16, 0, ctaIn) });
          bars.forEach((bar, i) => {
            const a = i * 0.09;
            const t = smooth(a, a + 0.42, p);
            gsap.set(bar, {
              yPercent: lerp(34, 0, t),
              autoAlpha: t,
              scale: lerp(0.97, 1, t),
              force3D: true,
            });
            if (vids[i]) gsap.set(vids[i], { scale: lerp(1.12, 1, t) });
          });
        },
      });

      // EXIT v3 (ROUND-7): the section PINS and the exit plays IN PLACE.
      // The runway holds the sticky stage frozen on screen; ONE scrub owns
      // the whole choreography: a short buffer, the heading lifts away,
      // then the tiles drop in EVEN PAIRS — {0,5}, then {1,4}, then {3} —
      // while HERA (index 2) swaps for a free clone layer that morphs to a
      // SQUARE and then GROWS to full-bleed. Full-bleed hera IS the first
      // frame of Our Process (same film) — the match-cut hand-off.
      const runway = root.querySelector<HTMLElement>(".ow-runway");
      const pinWin = root.querySelector<HTMLElement>(".ow-pin");
      const clone = root.querySelector<HTMLElement>(".ow-heroclone");
      const cloneVid = clone?.querySelector("video") ?? null;
      const cloneSkin = clone?.querySelector<HTMLElement>(".ow-heroclone-skin") ?? null;
      const sm = (a: number, b: number, v: number) => {
        const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
        return t * t * (3 - 2 * t);
      };
      const dropP = new Array(bars.length).fill(0);
      let driftKill = 0; // the breathe drift dies as the exit starts (the wobble)
      let exitP = 0;
      let swapped = false;
      let synced = false;
      const rect0 = { l: 0, t: 0, w: 0, h: 0 };
      const exit = ScrollTrigger.create({
        trigger: runway ?? root,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // ROUND-8 SEAMLESS HAND-OFF: the Process runway is pulled up under
        // this section (md:-mt-[100vh]) so its frame 1 — same film,
        // frame-synced, word already built — is PINNED beneath us before
        // the exit completes. At release the whole section simply stops
        // painting: no scroll seam, no second frame, you're just looking
        // at Our Process.
        onLeave: () => gsap.set(root, { autoAlpha: 0 }),
        onEnterBack: () => gsap.set(root, { autoAlpha: 1 }),
        onUpdate: (self) => {
          const p = self.progress;
          exitP = p;
          driftKill = sm(0, 0.08, p);
          // buffer first (George: "almost freeze"), then the heading lifts away
          const headP = sm(0.06, 0.3, p);
          gsap.set(head, { autoAlpha: 1 - headP, yPercent: -headP * 30 });
          if (cta) gsap.set(cta, { autoAlpha: 1 - headP });
          // EVEN pairs, outermost first — each pair moves as one
          dropP[0] = dropP[5] = sm(0.08, 0.34, p);
          dropP[1] = dropP[4] = sm(0.2, 0.46, p);
          dropP[3] = sm(0.32, 0.58, p);

          // HERA: swap the in-layout tile for the clone, then square → full-bleed
          const heraBar = bars[2];
          if (clone && pinWin && heraBar) {
            if (p > 0.02 && !swapped) {
              const br = heraBar.getBoundingClientRect();
              const wr = pinWin.getBoundingClientRect();
              rect0.l = br.left - wr.left;
              rect0.t = br.top - wr.top;
              rect0.w = br.width;
              rect0.h = br.height;
              gsap.set(clone, {
                autoAlpha: 1,
                left: rect0.l, top: rect0.t, width: rect0.w, height: rect0.h,
              });
              gsap.set(heraBar, { autoAlpha: 0 });
              if (cloneSkin) gsap.set(cloneSkin, { autoAlpha: 1 });
              if (cloneVid) {
                cloneVid.currentTime = vids[2]?.currentTime ?? 0;
                safePlay(cloneVid);
              }
              swapped = true;
            } else if (p <= 0.02 && swapped) {
              gsap.set(clone, { autoAlpha: 0 });
              gsap.set(heraBar, { autoAlpha: 1 });
              cloneVid?.pause();
              swapped = false;
              synced = false;
            }
            if (swapped) {
              const iw = window.innerWidth;
              const ih = window.innerHeight;
              const S = ih * 0.44; // the square, centred
              // shrink-to-square QUICKER (George); the square then holds a
              // beat. ROUND-9: the GROW is widened (0.55→1.0) so the
              // dramatic full-bleed part reads slower / less abrupt
              const sqP = sm(0.26, 0.4, p);
              const grP = sm(0.55, 1.0, p);
              const lp = (a: number, b: number, t: number) => a + (b - a) * t;
              const l1 = lp(rect0.l, (iw - S) / 2, sqP);
              const t1 = lp(rect0.t, (ih - S) / 2, sqP);
              const w1 = lp(rect0.w, S, sqP);
              const h1 = lp(rect0.h, S, sqP);
              gsap.set(clone, {
                left: lp(l1, 0, grP),
                top: lp(t1, 0, grP),
                width: lp(w1, iw, grP),
                height: lp(h1, ih, grP),
                borderRadius: 6 * (1 - grP),
              });
              // the tile's gradient + wordmark dissolve as the square forms
              if (cloneSkin) gsap.set(cloneSkin, { autoAlpha: 1 - sm(0, 0.5, sqP) });
              // near the hand-off, put the strip's first frame on the SAME
              // frame of the film so the seam between the two is invisible
              if (p >= 0.85 && !synced && cloneVid) {
                const stripVid = document.querySelector<HTMLVideoElement>(".proc-media");
                if (stripVid && stripVid.readyState >= 1) {
                  stripVid.currentTime = cloneVid.currentTime;
                  synced = true;
                }
              }
              if (p < 0.85) synced = false;
            }
          }
        },
      });

      // ONE writer for every bar transform — the breathe drift and the pair
      // drops compose here (two triggers writing y separately would fight
      // each other tick by tick). Opacity is only touched once the exit is
      // live, so the entrance fade keeps sole ownership until then.
      const vh = () => window.innerHeight / 100;
      const breathe = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const q = self.progress - 0.5;
          bars.forEach((bar, i) => {
            const amp = [10, 22, 14, 26, 12, 20][i % 6];
            if (i === 2) {
              // hera never drops — the clone carries it from here
              gsap.set(bar, { y: q * -amp * (1 - driftKill), force3D: true });
              return;
            }
            const props: gsap.TweenVars = {
              y: q * -amp * (1 - driftKill) + dropP[i] * 120 * vh(),
              force3D: true,
            };
            if (exitP > 0) props.autoAlpha = 1 - sm(0.5, 1, dropP[i]);
            gsap.set(bar, props);
          });
        },
      });

      return () => { enter.kill(); exit.kill(); breathe.kill(); };
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
      className="relative z-30 bg-[var(--bg)] text-[var(--fg)]"
      aria-label="Our work"
    >
      {/* ----- desktop / motion: the PINNED stage (ROUND-7) — the runway's
          extra height is the scroll the exit owns; the stage stays frozen
          on screen while the whole choreography plays in front of you ----- */}
      {/* ROUND-9: runway 280→360vh so the exit + hera hand-off play SLOWER
          (George: the fade-out and the Sans Matin grow were too fast) */}
      <div className="ow-runway relative motion-safe:md:h-[360vh]">
        <div className="ow-pin relative md:sticky md:top-0">
      <div className="ow-stage hidden overflow-hidden px-5 motion-safe:md:flex motion-safe:md:h-screen motion-safe:md:flex-col motion-safe:md:justify-center md:px-10">
        {/* ROUND-8 (George): no resting underline — hover the heading and
            the GOLD bar draws in under it */}
        <div className="group relative z-10 mx-auto mb-[3vh] w-fit">
          <h2
            className="ow-head font-display whitespace-nowrap text-center text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.9] tracking-[-0.05em] will-change-transform"
          >
            {"Featured ".split("").map((c, i) => (
              <span key={`f-${i}`} className="ow-char inline-block whitespace-pre">{c}</span>
            ))}
            {"Projects".split("").map((c, i) => (
              <span key={`p-${i}`} className="ow-char inline-block whitespace-pre text-[var(--fg)]">{c}</span>
            ))}
          </h2>
          <span
            aria-hidden
            className="mx-auto mt-3 block h-[3px] w-[min(46vw,540px)] origin-left scale-x-0 bg-[var(--gold-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
          />
        </div>


        {/* the accordion row — final layout; each film reveals in place with a masked wipe */}
        <div className="relative z-0 flex h-[64vh] gap-2">
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

              {/* collapsed — brand logo (text only on hover/expand, client).
                  ROUND-8: logos BIGGER */}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                {LOGO[p.client] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/logos/${LOGO[p.client]}.png`}
                    alt={p.client}
                    className="max-h-12 w-auto max-w-[82%] object-contain opacity-90"
                  />
                ) : (
                  /* no logo file yet (Otoko — client to supply): a clean
                     horizontal wordmark stands in so it reads like a mark */
                  <span className="font-display whitespace-nowrap text-[17px] tracking-[0.14em] text-white/90">
                    {p.client.toUpperCase()}
                  </span>
                )}
              </span>

              {/* expanded — title + watch */}
              <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="label-mono text-[10px] tracking-[0.24em] text-[var(--fg)]">
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

        {/* ROUND-8: bigger, no underline (hover box stays) */}
        <Link
          href="/work"
          className="ow-cta blink blink-bare relative z-10 mt-6 self-center text-[17px] font-medium"
        >
          Discover more
        </Link>
      </div>

          {/* the HERA hand-off layer — swaps in for the real tile at exit
              start, morphs to a SQUARE, then grows full-bleed. Frame 1 of
              Our Process plays the same film: the match-cut. */}
          <div className="ow-heroclone invisible pointer-events-none absolute left-0 top-0 z-20 hidden overflow-hidden rounded-md opacity-0 motion-safe:md:block">
            <video
              className="h-full w-full object-cover"
              src={HERA?.wide}
              poster={HERA?.posterWide}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            {/* the tile's skin (gradient + wordmark) so the swap is invisible */}
            <div className="ow-heroclone-skin absolute inset-0" aria-hidden>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />
              <span className="absolute inset-0 flex items-center justify-center p-3">
                <span className="font-display whitespace-nowrap text-[15px] tracking-[0.14em] text-white/90">
                  {HERA?.client.toUpperCase()}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* mobile stack — centred + tighter (George's mobile pass) */}
      <div className="flex flex-col gap-4 px-5 py-[7vh] md:hidden">
        <h2 className="font-display mb-2 text-center text-5xl tracking-[-0.04em]" style={{ fontWeight: 400 }}>Featured Projects<span className="text-[var(--gold-text)]">.</span></h2>
        {WORKS.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="ow-mtile relative block aspect-video overflow-hidden rounded-md">
            <video className="absolute inset-0 h-full w-full object-cover" src={p.wide} poster={p.posterWide} muted loop playsInline preload="none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="label-mono text-[9px] tracking-[0.2em] text-[var(--fg)]">{p.client.toUpperCase()}</span>
              <h3 className="font-display text-xl text-white" style={{ fontWeight: 400 }}>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
