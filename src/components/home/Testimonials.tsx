"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";
import ScrollType from "@/components/shell/ScrollType";

// 05 — Testimonials, click-to-select (modelled on outerstudios/auteur).
// Three testimonials, each tied to a real project. A row of three numbered
// selectors (with brand logo) sits beneath a single large panel. Clicking a
// selector swaps the panel — quote, reviewer role + sector, brand logo and the
// campaign film — with a slow, smooth cross-fade. The active film plays; the
// others pause. Clicking the film (or the "View project" affordance)
// navigates to that project's case page. Defaults to the first selected.

interface Testimonial {
  slug: string; // real project — drives which film plays + where it links
  quote: string;
  role: string;
  sector: string;
  logo: string; // /logos/<logo>.png
  logoMaxW: string; // per-logo width so marks sit visually even
}

const TESTIMONIALS: Testimonial[] = [
  {
    slug: "mclaren",
    quote: "The film outlived the campaign. Two years on we still open every pitch with it.",
    role: "Brand Director",
    sector: "Heritage Motoring",
    logo: "mclaren-logo",
    logoMaxW: "max-w-[88px]",
  },
  {
    slug: "nike",
    quote: "Cinema standards on a social budget. We haven't gone anywhere else since.",
    role: "Brand Lead",
    sector: "Sportswear",
    logo: "nike-white",
    logoMaxW: "max-w-[52px]",
  },
  {
    slug: "zuma",
    quote: "They turned a product launch into a film people actually chose to watch.",
    role: "Founder",
    sector: "Hospitality",
    logo: "zuma-white",
    logoMaxW: "max-w-[76px]",
  },
];

// resolve each testimonial's campaign film from the real project data,
// falling back to convention if a slug is ever missing
function filmFor(slug: string): { wide: string; posterWide: string } {
  const project = projects.find((p) => p.slug === slug);
  return {
    wide: project?.wide ?? `/videos/films/${slug}-w.mp4`,
    posterWide: project?.posterWide ?? `/videos/films/posters/${slug}-w.jpg`,
  };
}

function Aperture() {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-[var(--gold)]/55"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
    </span>
  );
}

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // scrubbed scroll-in — the panel + selectors rise and fade slowly on enter
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const rise = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-rise]"));
      if (!rise.length) return;

      const tween = gsap.fromTo(
        rise,
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            end: "top 40%",
            scrub: 1.2,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(rise, { clearProps: "transform,opacity" });
      };
    });

    return () => mm.revert();
  }, []);

  // play the active film, pause + reset the others; smooth cross-fade the panel
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

    const panel = panelRef.current;
    if (panel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        panel,
        { opacity: 0.55 },
        { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" },
      );
    }
  }, [active]);

  const current = TESTIMONIALS[active];
  const currentFilm = filmFor(current.slug);

  return (
    <section
      ref={rootRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="05 — Testimonials"
      className="relative overflow-hidden bg-[var(--bg)] py-[14vh] text-[var(--fg)]"
      aria-label="Testimonials"
    >
      <div className="px-5 md:px-10">
        <span
          className="label-mono block text-[10px] tracking-[0.3em] text-[var(--gold)]/80"
          style={{ fontFamily: "var(--font-dm), sans-serif" }}
        >
          IN THEIR WORDS
        </span>
        <ScrollType
          as="h2"
          className="font-display mt-5 max-w-3xl text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]"
          gold={["think."]}
          style={{ fontWeight: 400 }}
        >
          Tell us what you think.
        </ScrollType>
      </div>

      <div className="mt-14 px-5 md:px-10">
        {/* large panel — the selected testimonial: film + quote + brand + role/sector */}
        <div
          ref={panelRef}
          data-rise
          className="grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-[var(--hairline-dark)] bg-[var(--bg)] md:grid-cols-2"
        >
          {/* film — clicking it opens the project case page */}
          <Link
            href={`/work/${current.slug}`}
            aria-label={`View project — ${current.role}, ${current.sector}`}
            className="group relative block aspect-video overflow-hidden md:aspect-auto md:min-h-[440px]"
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
                  data-src={film.wide}
                  poster={film.posterWide}
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
              className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 py-2 text-xs tracking-[0.18em] text-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--gold)]/70 group-hover:text-[var(--gold)]"
              style={{ fontFamily: "var(--font-dm), sans-serif" }}
            >
              VIEW PROJECT
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </Link>

          {/* quote + caption */}
          <div className="flex flex-col justify-between p-9 md:p-11">
            <div>
              <Aperture />
              <blockquote className="mt-7 text-[clamp(1.3rem,1.9vw,1.9rem)] leading-snug">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            </div>

            <figcaption className="mt-8 flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--hairline-dark)] bg-black/30 backdrop-blur-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${current.logo}.png`}
                  alt=""
                  aria-hidden
                  className={`logo-mark max-h-5 ${current.logoMaxW} object-contain opacity-90 [html[data-mode=light]_&]:invert`}
                />
              </span>
              <span>
                <span
                  className="block text-sm font-medium"
                  style={{ fontFamily: "var(--font-dm), sans-serif" }}
                >
                  {current.role}
                </span>
                <span
                  className="block text-xs opacity-60"
                  style={{ fontFamily: "var(--font-dm), sans-serif" }}
                >
                  {current.sector}
                </span>
              </span>
            </figcaption>
          </div>
        </div>

        {/* selector row — click to swap the panel */}
        <div data-rise className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {TESTIMONIALS.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                aria-label={`Show testimonial ${i + 1} — ${t.role}, ${t.sector}`}
                className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left transition-colors duration-300 sm:px-5 ${
                  isActive
                    ? "border-[var(--gold)]/70 bg-[var(--gold)]/10"
                    : "border-[var(--hairline-dark)] bg-[var(--bg)] hover:border-[var(--gold)]/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`text-xs tabular-nums transition-colors duration-300 ${
                      isActive ? "text-[var(--gold)]" : "opacity-50 group-hover:opacity-80"
                    }`}
                    style={{ fontFamily: "var(--font-dm), sans-serif" }}
                  >
                    0{i + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/logos/${t.logo}.png`}
                    alt=""
                    aria-hidden
                    className={`logo-mark max-h-4 ${t.logoMaxW} object-contain transition-opacity duration-300 [html[data-mode=light]_&]:invert ${
                      isActive ? "opacity-100" : "opacity-60 group-hover:opacity-90"
                    }`}
                  />
                </span>
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-[var(--gold)]" : "bg-[var(--fg)]/25 group-hover:bg-[var(--fg)]/45"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
