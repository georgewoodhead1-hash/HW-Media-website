"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 05 — Testimonials, rehauled. No carousel. Exactly three cards in a row,
// each tied to a real project. Hover a card and that project's campaign film
// fades in and plays as the card background (behind the quote, under a dark
// gradient so the text stays readable); on leave it fades back to the plain
// dark card and pauses. The detail the client likes stays: brand logo + role
// / sector bottom-left, with a small dotted aperture mark. Cards rise + fade
// on a slow, scrubbed scroll-in.

interface Testimonial {
  slug: string; // real project — drives which film plays
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
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);

  // scrubbed scroll-in — cards rise + fade slowly as the section enters
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!cards.length) return;

      const tween = gsap.fromTo(
        cards,
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            end: "top 38%",
            scrub: 1.2,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(cards, { clearProps: "transform,opacity" });
      };
    });

    return () => mm.revert();
  }, []);

  const handleEnter = useCallback((i: number) => {
    const video = videoRefs.current[i];
    const media = mediaRefs.current[i];
    if (!video || !media) return;
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
    gsap.to(media, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    safePlay(video);
  }, []);

  const handleLeave = useCallback((i: number) => {
    const video = videoRefs.current[i];
    const media = mediaRefs.current[i];
    if (!video || !media) return;
    gsap.to(media, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => video.pause(),
    });
  }, []);

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
        <span className="label-mono block text-[10px] tracking-[0.3em] text-[var(--gold)]/80">
          IN THEIR WORDS
        </span>
        <h2 className="font-display mt-5 max-w-3xl text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
          Tell us what you{" "}
          <span className="text-[var(--gold)]">think.</span>
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 px-5 md:grid-cols-3 md:px-10">
        {TESTIMONIALS.map((t, i) => {
          const film = filmFor(t.slug);
          return (
            <figure
              key={t.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              className="group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--hairline-dark)] bg-[var(--bg)] p-9 will-change-transform"
            >
              {/* hover film — fades in behind the quote, dark gradient keeps text legible */}
              <div
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 will-change-[opacity]"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  data-src={film.wide}
                  poster={film.posterWide}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/45" />
              </div>

              {/* quote — top */}
              <div className="relative z-10">
                <Aperture />
                <blockquote className="mt-7 text-[clamp(1.2rem,1.5vw,1.5rem)] leading-snug">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              {/* brand logo + role / sector — bottom-left (the detail the client likes) */}
              <figcaption className="relative z-10 mt-8 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[var(--hairline-dark)] bg-black/30 backdrop-blur-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/logos/${t.logo}.png`}
                    alt=""
                    aria-hidden
                    className={`logo-mark max-h-5 ${t.logoMaxW} object-contain opacity-90 [html[data-mode=light]_.group:not(:hover)_&]:invert`}
                  />
                </span>
                <span>
                  <span
                    className="block text-sm font-medium"
                    style={{ fontFamily: "var(--font-dm), sans-serif" }}
                  >
                    {t.role}
                  </span>
                  <span className="block text-xs opacity-60" style={{ fontFamily: "var(--font-dm), sans-serif" }}>
                    {t.sector}
                  </span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
