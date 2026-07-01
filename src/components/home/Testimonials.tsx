"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 05 — Testimonials, click-to-select (modelled on outerstudios/auteur).
// Two columns. LEFT: a vertical stack of three numbered selectors (01/02/03)
// each carrying its brand logo — click to select — sitting above the selected
// testimonial's quote, role, sector and brand mark. RIGHT: a tall portrait
// (3:4) campaign film for the selected testimonial, playing on loop, that
// cross-fades smoothly when the selection changes. Clicking the film (or the
// "View project" affordance) navigates to that project's case page. Defaults
// to the first selected.

interface Testimonial {
  slug: string; // real project — drives which film plays + where it links
  brand: string; // display name (McLaren, Nike, …)
  quote: string;
  role: string;
  sector: string;
  logo: string; // /logos/<logo>.png
  logoMaxW: string; // per-logo width so marks sit visually even (attribution mark)
  selectorMaxW: string; // larger per-logo width for the prominent selector marks
}

const TESTIMONIALS: Testimonial[] = [
  {
    slug: "mclaren",
    brand: "McLaren",
    quote: "The film outlived the campaign. Two years on we still open every pitch with it.",
    role: "Brand Director",
    sector: "Heritage Motoring",
    logo: "mclaren-logo",
    logoMaxW: "max-w-[112px]",
    selectorMaxW: "max-w-[168px]",
  },
  {
    slug: "nike",
    brand: "Nike",
    quote: "Cinema standards on a social budget. We haven't gone anywhere else since.",
    role: "Brand Lead",
    sector: "Sportswear",
    logo: "nike-white",
    logoMaxW: "max-w-[66px]",
    selectorMaxW: "max-w-[100px]",
  },
  {
    slug: "zuma",
    brand: "Zuma",
    quote: "They turned a product launch into a film people actually chose to watch.",
    role: "Founder",
    sector: "Hospitality",
    logo: "zuma-white",
    logoMaxW: "max-w-[96px]",
    selectorMaxW: "max-w-[144px]",
  },
];

// resolve each testimonial's PORTRAIT (3:4) campaign film from the real project
// data, falling back to convention if a slug is ever missing
function filmFor(slug: string): { loop: string; poster: string } {
  const project = projects.find((p) => p.slug === slug);
  return {
    loop: project?.loop ?? `/videos/films/${slug}-p.mp4`,
    poster: project?.poster ?? `/videos/films/posters/${slug}-p.jpg`,
  };
}

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // scroll-in — the heading's letters assemble from a scatter (an echo of the
  // "Our process" letters reforming) and the columns rise, all SCRUBBED so it
  // blends straight out of the process scene instead of popping up on its own.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const heading = root.querySelector<HTMLElement>(".t-head");
      const rise = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-rise]"));
      const fullstop = root.querySelector<HTMLElement>(".t-fullstop");
      const dots = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".t-dot"));

      const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
      const sm = (a: number, b: number, t: number) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      gsap.set(heading, { autoAlpha: 0, y: 24 });
      gsap.set(rise, { autoAlpha: 0, y: 32 });
      gsap.set(dots, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(fullstop, { autoAlpha: 0 });
      gsap.set(root.querySelectorAll(".t-qword"), { opacity: 0 }); // greyed scroll-write words start hidden

      const HALF = 14; // half the 28px dot, to centre it on a point
      // the LIVE "We deliver." full stop element, so the dot sits ON it on any screen
      const wdStop = (() => {
        const ss = Array.from(document.querySelectorAll<HTMLElement>("#process h2 span")).filter((s) => s.textContent?.trim() === ".");
        return ss[ss.length - 1] ?? null;
      })();
      let lockedSx = 0, lockedSy = 0; // the full stop's position, latched during the hold
      let firstOff = -1, firstX = 0; // the first dot's layout offset from the section top, cached while unpinned

      const procTop = () => {
        const p = document.querySelector<HTMLElement>("#process");
        return p ? p.getBoundingClientRect().top + window.scrollY : 0;
      };

      // ── PHASE 1 — the full stop HOLDS on "We deliver." while the words fade out,
      // THEN glides across to the first dot on ONE clean bezier, CLICKS into place,
      // and crossfades into the real dot (no jump). NO line.
      const ride = ScrollTrigger.create({
        trigger: root,
        start: () => procTop() + 2.05 * window.innerHeight,
        end: () => procTop() + 3.7 * window.innerHeight,
        scrub: 1.4, // buttery
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          // START — latch the LIVE full stop position during the early hold (process
          // still pinned), then FREEZE it so the dot doesn't trail the words as they
          // scroll off. Glyph baseline ≈ 0.30 up from the line-box bottom. Any screen.
          if (p < 0.32 && wdStop) {
            const r = wdStop.getBoundingClientRect();
            if (r.width) { lockedSx = r.left + r.width / 2; lockedSy = r.bottom - 0.3 * r.height; }
          }
          const Sx = lockedSx || 0.782 * vw;
          const Sy = lockedSy || 0.313 * vh;
          // END — the first dot's PINNED viewport position, computed deterministically
          // (pin holds the section top at 10%, plus the dot's layout offset). Cached
          // while unpinned so it's stable + correct on ANY screen → lands dead-on, no rise.
          if (p < 0.3) {
            const btn = dots[0]?.parentElement;
            if (btn) { const br = btn.getBoundingClientRect(); firstOff = br.top - root.getBoundingClientRect().top; firstX = br.left + br.width / 2; }
          }
          let Ex = firstX || 0.037 * vw;
          let Ey = firstOff >= 0 ? 0.1 * vh + firstOff : 0.651 * vh; // first dot, pinned
          // once the section is actually pinned, home on the dot's LIVE centre so it
          // lands dead-on (exact on any screen, no half-cm-high drift)
          if (reveal && reveal.isActive) {
            const lb = dots[0]?.parentElement;
            if (lb) { const lr = lb.getBoundingClientRect(); Ex = lr.left + lr.width / 2; Ey = lr.top + lr.height / 2; }
          }
          const Cx = lerp(Sx, Ex, 0.5);
          const Cy = lerp(Sy, Ey, 0.62);
          // HOLD on the full stop through the "We deliver" fade (p<0.42), then glide
          const t = sm(0.42, 0.88, p);
          const u = 1 - t;
          const cx = u * u * Sx + 2 * u * t * Cx + t * t * Ex;
          const cy = u * u * Sy + 2 * u * t * Cy + t * t * Ey;
          const grow = sm(0.66, 0.85, p); // period size → full dot size before it lands
          const click = Math.sin(sm(0.8, 0.95, p) * Math.PI) * 0.16; // overshoot that settles = the "click"
          const dotScale = lerp(0.5, 1, grow) * (1 + click);
          const radius = lerp(4, HALF, grow); // soft square → circle
          // crossfade travelling dot OUT, real first dot IN — same spot + size (pinned
          // by now, so the real dot is exactly at E) → seamless, no jump
          const swap = sm(0.92, 1.0, p);
          gsap.set(fullstop, {
            x: cx - HALF,
            y: cy - HALF,
            scale: dotScale,
            borderRadius: `${radius}px`,
            autoAlpha: clamp01(sm(0, 0.04, p)) * (1 - swap),
          });
          gsap.set(dots[0], { scale: 1, autoAlpha: swap });
        },
      });

      // ── PHASE 2 — PINNED. The scroll LOCKS and the section builds itself like an
      // animation: the other two dots appear, THEN the heading, THEN the quote and
      // film. Staged + scrubbed, so you can't blow straight past it.
      // pin the CONTENT wrapper only — NOT the section — so the pin's transform
      // never lands on the fixed full stop (a transformed ancestor breaks fixed).
      const content = root.querySelector<HTMLElement>(".t-content");
      const reveal = ScrollTrigger.create({
        trigger: root,
        start: "top 10%",
        end: "+=235%",
        pin: content || true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const q = self.progress;
          // 1) the 2nd + 3rd dots write in after the first
          dots.forEach((d, i) => {
            if (i === 0) return;
            const a = sm(0.18 + (i - 1) * 0.1, 0.3 + (i - 1) * 0.1, q);
            gsap.set(d, { scale: a, autoAlpha: a });
          });
          // 2) the heading rises
          const h = sm(0.32, 0.46, q);
          gsap.set(heading, { autoAlpha: h, y: lerp(24, 0, h) });
          // 3) the QUOTE WRITES ITSELF in — greyed words filling to full one by one,
          //    tied to scroll. This is the slow, dynamic build (not one block at once).
          const appear = sm(0.46, 0.5, q);
          const qw = root.querySelectorAll<HTMLElement>(".t-qword");
          const n = qw.length || 1;
          qw.forEach((w, i) => {
            const a0 = 0.52 + (i / n) * 0.34;
            const fill = sm(a0, a0 + 0.1, q);
            w.style.opacity = String(appear * lerp(0.16, 1, fill));
          });
          // 4) brand + film rise last
          rise.forEach((el, i) => {
            const r = sm(0.8 + i * 0.07, 0.96 + i * 0.07, q);
            gsap.set(el, { autoAlpha: r, y: lerp(34, 0, r) });
          });
        },
      });

      return () => {
        ride.kill();
        reveal.kill();
        gsap.set([heading, ...rise, ...dots, fullstop].filter(Boolean), { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  // play the active film, pause + reset the others; smooth cross-fade
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        gsap.to(video, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        safePlay(video);
      } else {
        gsap.to(video, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => video.pause(),
        });
      }
    });

    const quote = quoteRef.current;
    if (quote && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        quote,
        { opacity: 0.55 },
        { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" },
      );
    }
  }, [active]);

  const current = TESTIMONIALS[active];

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="media"
      data-chapter="05 — Testimonials"
      className="relative z-30 overflow-x-clip bg-[var(--bg)] pb-[9vh] pt-[5vh] text-[var(--fg)] motion-safe:md:-mt-[12vh]"
      aria-label="Testimonials"
    >
      {/* the gold full stop carried from "We deliver." — fixed to the viewport, it
          rides down (no drawn line) and settles into the first dot. Desktop only. */}
      <span aria-hidden className="t-fullstop pointer-events-none fixed left-0 top-0 z-[80] h-[28px] w-[28px] rounded-[6px] bg-[var(--gold)] opacity-0 shadow-[0_0_24px_rgba(191,170,83,0.85)] will-change-transform" />

      <div className="t-content grid grid-cols-1 gap-10 px-5 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-12 md:px-10 lg:gap-16">
        {/* LEFT — title at the top (so the film aligns to it), then the active
            quote + brand, then the three clickable dots. */}
        <div className="flex flex-col">
          <h2 className="t-head about-display max-w-3xl text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.0] text-[var(--fg)]">
            Testimonials
          </h2>

          <div className="mt-8 flex min-h-[clamp(13rem,19vw,16rem)] flex-col" ref={quoteRef}>
            <blockquote
              className="about-body text-[clamp(1.55rem,2.8vw,2.7rem)] leading-[1.25]"
              style={{ fontWeight: 400 }}
            >
              <span className="t-qword not-italic text-[var(--gold-text)]">&ldquo;</span>
              {current.quote.split(" ").map((w, i) => (
                <span key={`${active}-${i}`} className="t-qword">{w}{" "}</span>
              ))}
              <span className="t-qword not-italic text-[var(--gold-text)]">&rdquo;</span>
            </blockquote>

            <figcaption
              data-rise
              className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              <span className="text-base font-medium text-[var(--fg)]">{current.brand}</span>
              <span className="text-sm text-[var(--fg)]/45">{current.role} · {current.sector}</span>
            </figcaption>
          </div>

          {/* the dots row — the flying gold full stop lands here and clicks into
              the (bigger) selector dots. */}
          <div className="relative -ml-3 mt-9 flex items-center">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Show ${t.brand} testimonial`}
                className="group flex items-center justify-center p-3"
              >
                <span
                  className={`t-dot block aspect-square rounded-full transition-[background-color,transform] duration-300 ${
                    i === active ? "h-7 w-7 bg-[var(--gold)]" : "h-7 w-7 bg-[var(--fg)]/25 group-hover:bg-[var(--fg)]/55"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — tall portrait (3:4) film, top-aligned with the title */}
        <Link
          data-rise
          href={`/work/${current.slug}`}
          aria-label={`View project — ${current.role}, ${current.sector}`}
          className="group relative mx-auto block aspect-[3/4] w-full max-h-[64vh] overflow-hidden rounded-2xl border border-[var(--hairline-dark)] bg-[var(--bg)] md:mx-0"
        >
          {TESTIMONIALS.map((t, i) => {
            const film = filmFor(t.slug);
            return (
              <video
                key={t.slug}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="absolute inset-0 h-full w-full object-cover opacity-0 will-change-[opacity]"
                data-src={film.loop}
                poster={film.poster}
                muted
                loop
                playsInline
                preload="none"
              />
            );
          })}
          {/* subtle gradient so the View-project affordance stays legible */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
          />
          <span
            className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 py-2 text-xs tracking-[0.18em] text-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--gold)]/70 group-hover:text-[var(--gold-text)]"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            VIEW PROJECT
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
