"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
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
      const split = heading ? new SplitText(heading, { type: "chars", charsClass: "t-char" }) : null;
      const chars = (split?.chars as HTMLElement[]) ?? [];

      const scatter = chars.map((_, i) => ({
        x: (i % 2 ? 1 : -1) * (40 + ((i * 17) % 70)),
        y: -60 - ((i * 23) % 90),
        r: (i % 2 ? 1 : -1) * (8 + ((i * 13) % 14)),
      }));
      gsap.set(chars, { display: "inline-block", autoAlpha: 0 });
      gsap.set(rise, { autoAlpha: 0, yPercent: 16 });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top 88%",
        end: "top 32%",
        scrub: 1.0,
        onUpdate: (self) => {
          const p = self.progress;
          chars.forEach((c, i) => {
            const raw = (p - (i / Math.max(1, chars.length)) * 0.4) / 0.6;
            const t = Math.min(1, Math.max(0, raw));
            const e = t * t * (3 - 2 * t);
            gsap.set(c, { x: scatter[i].x * (1 - e), y: scatter[i].y * (1 - e), rotation: scatter[i].r * (1 - e), autoAlpha: e });
          });
          const rp = Math.min(1, Math.max(0, (p - 0.35) / 0.65));
          const re = rp * rp * (3 - 2 * rp);
          rise.forEach((el, i) => {
            const o = Math.min(1, Math.max(0, re * 1.25 - i * 0.12));
            gsap.set(el, { autoAlpha: o, yPercent: 16 * (1 - o) });
          });
        },
      });

      return () => { st.kill(); split?.revert(); gsap.set(rise, { clearProps: "opacity,transform,visibility" }); };
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
      data-flow
      className="relative z-30 overflow-hidden bg-[var(--bg)] pb-[9vh] pt-[11vh] text-[var(--fg)] motion-safe:md:-mt-[12vh]"
      aria-label="Testimonials"
    >
      <div className="px-5 md:px-10">
        <h2 className="t-head about-display max-w-3xl text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.0] text-[var(--fg)]">
          Testimonials
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 px-5 md:grid-cols-[1.05fr_0.95fr] md:items-stretch md:gap-12 md:px-10 lg:gap-16">
        {/* LEFT — the active quote + brand, with three clickable dots (client:
            dots instead of 01/02/03; manual selection only, no auto-scroll). */}
        <div data-rise className="flex flex-col justify-center">
          <div ref={quoteRef}>
            <blockquote
              className="about-body text-[clamp(1.55rem,2.8vw,2.7rem)] leading-[1.25]"
              style={{ fontWeight: 400 }}
            >
              <span className="not-italic text-[var(--gold-text)]">&ldquo;</span>
              {current.quote}
              <span className="not-italic text-[var(--gold-text)]">&rdquo;</span>
            </blockquote>

            <figcaption
              className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              <span className="text-base font-medium text-[var(--fg)]">{current.brand}</span>
              <span className="text-sm text-[var(--fg)]/45">{current.role} · {current.sector}</span>
            </figcaption>
          </div>

          {/* three clickable dots — bigger, generous tap target (client) */}
          <div className="-ml-3 mt-9 flex items-center">
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
                  className={`block rounded-full transition-all duration-300 ${
                    i === active ? "h-4 w-4 bg-[var(--gold)]" : "h-3 w-3 bg-[var(--fg)]/30 group-hover:bg-[var(--fg)]/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — tall portrait (3:4) film for the selected testimonial */}
        <Link
          data-rise
          href={`/work/${current.slug}`}
          aria-label={`View project — ${current.role}, ${current.sector}`}
          className="group relative mx-auto block aspect-[3/4] w-full max-h-[70vh] overflow-hidden rounded-2xl border border-[var(--hairline-dark)] bg-[var(--bg)] md:mx-0"
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
