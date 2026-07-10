"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Rule from "@/components/shell/Rule";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 04 — TESTIMONIALS in PLAIN FLOW (George: "one smooth scroll like 1820" — no
// pins, the page never stops). The ledger rises in on passage and dissipates
// as it leaves the viewport. (Client final round: split out of the old
// TestimonialsFaqs pair — the FAQs now live at the bottom of the page, after
// Process and the Defender band.)

interface Testimonial {
  slug: string;
  brand: string;
  quote: string;
  role: string;
  sector: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    slug: "mclaren",
    brand: "McLaren",
    quote: "The film outlived the campaign. Two years on we still open every pitch with it.",
    role: "Brand Director",
    sector: "Heritage Motoring",
  },
  {
    slug: "nike",
    brand: "Nike",
    quote: "Cinema standards on a social budget. We haven't gone anywhere else since.",
    role: "Brand Lead",
    sector: "Sportswear",
  },
  {
    slug: "zuma",
    brand: "Zuma",
    quote: "They turned a product launch into a film people actually chose to watch.",
    role: "Founder",
    sector: "Hospitality",
  },
];

const LOGO: Record<string, { file: string; h: string }> = {
  mclaren: { file: "mclaren-logo", h: "h-8 md:h-10" },
  nike: { file: "nike-white", h: "h-6 md:h-7" },
  zuma: { file: "zuma-white", h: "h-7 md:h-8" },
};

const HOLD = 7; // seconds per testimonial before the reel advances

// LANDSCAPE film for the showcase window (George: "make the film on the
// right landscape not portrait") — the wide 16:9 master, not the -p loop.
function filmFor(slug: string): { loop: string; poster: string } {
  const project = projects.find((p) => p.slug === slug);
  return {
    loop: project?.wide ?? `/videos/films/${slug}-w.mp4`,
    poster: project?.posterWide ?? `/videos/films/posters/${slug}-w.jpg`,
  };
}

export default function Testimonials() {
  const testiRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const advanceRef = useRef<gsap.core.Tween | null>(null);
  const visibleRef = useRef(false);
  const [active, setActive] = useState(0);

  // ── rise in on passage, dissipate on the way out ──
  useEffect(() => {
    const root = testiRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const pieces = gsap.utils.toArray<HTMLElement>("[data-t-el]", root);
      const film = root.querySelector<HTMLElement>(".tst-film");
      const rule = root.querySelector<HTMLElement>(".tst-rule");

      gsap.set(pieces, { autoAlpha: 0, y: 30 });
      gsap.set(film, { autoAlpha: 0, y: 30 });

      const enter = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none reverse" },
      });
      enter
        .to(pieces, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0)
        .to(film, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.25);

      // dissipate WHILE leaving — writing first, then the lines, all in motion
      const exit = ScrollTrigger.create({
        trigger: root,
        start: "bottom 62%",
        end: "bottom 10%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const sm = (a: number, b: number) => {
            const x = Math.min(1, Math.max(0, (p - a) / (b - a)));
            return x * x * (3 - 2 * x);
          };
          // PURE FADE on the way out (George: no dipping above the screen)
          pieces.forEach((el, i) => {
            const o = sm(0 + i * 0.03, 0.5 + i * 0.03);
            gsap.set(el, { autoAlpha: 1 - o });
          });
          if (film) gsap.set(film, { autoAlpha: 1 - sm(0.05, 0.55) });
          if (rule) gsap.set(rule, { autoAlpha: 1 - sm(0.4, 0.85) });
          const live = p < 0.2 && visibleRef.current;
          if (live) advanceRef.current?.play();
          else advanceRef.current?.pause();
        },
      });

      return () => { enter.scrollTrigger?.kill(); enter.kill(); exit.kill(); };
    });
    return () => mm.revert();
  }, []);

  const goTo = useCallback((i: number) => {
    setActive((prev) => (i === prev ? prev : i));
  }, []);

  // the reel: crossfade the small film, run the progress line, advance
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the quote writes itself in on every switch
    const words = document.querySelectorAll<HTMLElement>(".tsq-word");
    if (words.length && !reduced) {
      gsap.fromTo(words, { opacity: 0.25 }, { opacity: 1, duration: 0.45, stagger: 0.04, ease: "power1.out", overwrite: "auto" });
    }
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        gsap.to(video, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        if (visibleRef.current) safePlay(video);
      } else {
        gsap.to(video, { opacity: 0, duration: 0.5, ease: "power2.inOut", overwrite: "auto", onComplete: () => video.pause() });
      }
    });

    advanceRef.current?.kill();
    barRefs.current.forEach((bar, i) => {
      if (bar) gsap.set(bar, { scaleX: i < active ? 1 : 0, transformOrigin: "left center" });
    });
    const activeBar = barRefs.current[active];
    if (activeBar && !reduced) {
      advanceRef.current = gsap.fromTo(
        activeBar,
        { scaleX: 0 },
        {
          scaleX: 1, duration: HOLD, ease: "none",
          paused: !visibleRef.current,
          onComplete: () => goTo((active + 1) % TESTIMONIALS.length),
        },
      );
    }
    return () => { advanceRef.current?.kill(); };
  }, [active, goTo]);

  // only run media while the testimonials are on screen
  useEffect(() => {
    const root = testiRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        visibleRef.current = e.isIntersecting;
        const video = videoRefs.current[active];
        if (e.isIntersecting) {
          if (video) safePlay(video);
          advanceRef.current?.play();
        } else {
          video?.pause();
          advanceRef.current?.pause();
        }
      }),
      { threshold: 0.3 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [active]);

  return (
    <section
      ref={testiRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="04 — Testimonials"
      className="relative z-30 bg-[var(--bg)] px-5 pb-[7vh] pt-[7vh] text-[var(--fg)] md:px-10 md:pb-[14vh] md:pt-[10vh]"
      aria-label="Testimonials"
    >
      {/* header (George): big title like Trusted by, then the hairline WITH
          the plusses drawing underneath it */}
      <div className="tst-rule mb-[8vh]">
        <div className="mb-6 text-center">
          <h2 className="inline-block">
            <span
              className="blink font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none"
              style={{ fontFamily: "var(--font-suisse-cond), 'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.015em" }}
            >
              Testimonials
            </span>
          </h2>
        </div>
        <Rule bg="var(--bg)" />
      </div>

      <div className="md:grid md:grid-cols-[1.6fr_1fr] md:items-center md:gap-16">
        {/* LEFT — the 1820-style showcase: one voice at a time, big.
            Mobile: compressed + centred (George) */}
        <div className="flex flex-col justify-between text-center md:min-h-[56vh] md:text-left">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-t-el
              key={`logo-${active}`}
              src={`/logos/${LOGO[TESTIMONIALS[active].slug]?.file ?? TESTIMONIALS[active].slug}.png`}
              alt={TESTIMONIALS[active].brand}
              className={`${LOGO[TESTIMONIALS[active].slug]?.h ?? "h-8"} mx-auto w-auto object-contain md:mx-0`}
            />
            <blockquote
              data-t-el
              key={`q-${active}`}
              className="font-display mt-6 max-w-[46rem] text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.04] md:mt-10"
            >
              <span className="tsq-word">&ldquo;</span>
              {TESTIMONIALS[active].quote.split(" ").map((w, i) => (
                <span key={`${active}-${i}`} className="tsq-word">{w}{" "}</span>
              ))}
              <span className="tsq-word">&rdquo;</span>
            </blockquote>
            <figcaption data-t-el className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 md:mt-8 md:justify-start">
              <span className="label-mono text-[11px] tracking-[0.2em] text-[var(--fg)]">
                {TESTIMONIALS[active].role} · {TESTIMONIALS[active].sector}
              </span>
              <Link href={`/work/${TESTIMONIALS[active].slug}`} className="blink text-[11px] tracking-[0.05em]">
                View project
              </Link>
            </figcaption>
          </div>

          {/* the HUD (George): numbers in BOXES — active/hover fills solid —
              with the reel progress line running underneath each */}
          <div data-t-el className="mt-7 flex items-end justify-center gap-5 md:mt-12 md:justify-start">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-pressed={active === i}
                aria-label={`Show ${t.brand} testimonial`}
                className="group flex w-20 flex-col items-stretch gap-2 pb-1 md:w-24"
              >
                <span
                  className={`label-mono flex items-center justify-center border px-3 py-2 text-[13px] tracking-[0.2em] transition-colors duration-300 ${
                    active === i
                      ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
                      : "border-[var(--fg)]/45 text-[var(--fg)] group-hover:border-[var(--fg)] group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative block h-px w-full overflow-hidden bg-[var(--fg)]/20">
                  <span
                    ref={(el) => { barRefs.current[i] = el; }}
                    className="absolute inset-0 origin-left scale-x-0 bg-[var(--fg)]"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="tst-film mx-auto mt-7 w-full max-w-[520px] md:mx-0 md:mt-0 md:justify-self-end">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--hairline-dark)] bg-black">
            {TESTIMONIALS.map((t, i) => {
              const film = filmFor(t.slug);
              return (
                <video
                  key={t.slug}
                  ref={(el) => { videoRefs.current[i] = el; }}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 will-change-[opacity]"
                  data-src={film.loop}
                  poster={film.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
