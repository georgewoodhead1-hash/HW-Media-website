"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";
import ScrollType from "@/components/shell/ScrollType";

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
    logoMaxW: "max-w-[112px]",
  },
  {
    slug: "nike",
    quote: "Cinema standards on a social budget. We haven't gone anywhere else since.",
    role: "Brand Lead",
    sector: "Sportswear",
    logo: "nike-white",
    logoMaxW: "max-w-[66px]",
  },
  {
    slug: "zuma",
    quote: "They turned a product launch into a film people actually chose to watch.",
    role: "Founder",
    sector: "Hospitality",
    logo: "zuma-white",
    logoMaxW: "max-w-[96px]",
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
  const quoteRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // scrubbed scroll-in — the columns rise and fade slowly on enter
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
      data-surface="page"
      data-chapter="05 — Testimonials"
      className="relative overflow-hidden bg-[var(--bg)] py-[9vh] text-[var(--fg)]"
      aria-label="Testimonials"
    >
      <div className="px-5 md:px-10">
        <ScrollType
          as="h2"
          className="font-display max-w-3xl text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]"
          style={{ fontWeight: 400 }}
        >
          Testimonials
        </ScrollType>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 px-5 md:grid-cols-[1.05fr_0.95fr] md:items-stretch md:gap-12 md:px-10 lg:gap-16">
        {/* LEFT — selectors + the selected quote / role / sector / brand */}
        <div data-rise className="flex flex-col">
          {/* vertical selector stack — click to swap */}
          <div className="flex flex-col gap-3">
            {TESTIMONIALS.map((t, i) => {
              const isActive = i === active;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`Show testimonial ${i + 1} — ${t.role}, ${t.sector}`}
                  className={`group flex items-center justify-between gap-4 rounded-xl border px-5 py-5 text-left transition-colors duration-300 sm:px-6 ${
                    isActive
                      ? "border-[var(--gold)]/70 bg-[var(--gold)]/10"
                      : "border-[var(--hairline-dark)] bg-[var(--bg)] hover:border-[var(--gold)]/40"
                  }`}
                >
                  <span className="flex items-center gap-4 sm:gap-5">
                    <span
                      className={`text-sm tabular-nums transition-colors duration-300 ${
                        isActive ? "text-[var(--gold)]" : "opacity-50 group-hover:opacity-80"
                      }`}
                      style={{ fontFamily: "var(--font-firma), sans-serif" }}
                    >
                      0{i + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/logos/${t.logo}.png`}
                      alt=""
                      aria-hidden
                      className={`logo-mark max-h-6 ${t.logoMaxW} object-contain transition-opacity duration-300 [html[data-mode=light]_&]:invert ${
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

          {/* selected testimonial — quote + role + sector + brand mark */}
          <div ref={quoteRef} className="mt-9 flex flex-1 flex-col justify-between">
            <div>
              <Aperture />
              <blockquote className="mt-7 text-[clamp(1.35rem,2vw,2rem)] leading-snug">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            </div>

            <figcaption className="mt-9 flex items-center gap-4">
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
                  style={{ fontFamily: "var(--font-firma), sans-serif" }}
                >
                  {current.role}
                </span>
                <span
                  className="block text-xs opacity-60"
                  style={{ fontFamily: "var(--font-firma), sans-serif" }}
                >
                  {current.sector}
                </span>
              </span>
            </figcaption>
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
            className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 py-2 text-xs tracking-[0.18em] text-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:border-[var(--gold)]/70 group-hover:text-[var(--gold)]"
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
