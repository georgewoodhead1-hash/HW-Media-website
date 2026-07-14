"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { projects } from "@/content/projects";
import { safePlay } from "@/lib/video";

// 05 — TESTIMONIALS in PLAIN FLOW (George: "one smooth scroll like 1820" —
// no pins, the page never stops). Split from the old TestimonialsFaqs pair
// (final round): the diagonal tiles band now sits between this and the FAQs.

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

// The film for the showcase window — SQUARE now (client: "make it a square
// format taking up the right side"), so the wide master is centre-cropped by
// object-cover inside a 1:1 frame.
function filmFor(slug: string): { loop: string; poster: string } {
  const project = projects.find((p) => p.slug === slug);
  return {
    loop: project?.wide ?? `/videos/films/${slug}-w.mp4`,
    poster: project?.posterWide ?? `/videos/films/posters/${slug}-w.jpg`,
  };
}

export default function Testimonials({ embedded = false }: { embedded?: boolean }) {
  const testiRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const advanceRef = useRef<gsap.core.Tween | null>(null);
  const visibleRef = useRef(false);
  const [active, setActive] = useState(0);

  // ── the build (George, 2026-07-14): the content APPEARS IN PLACE under
  // the morphed title — the quote WRITES ITSELF word by word, the film
  // opens with the centre-out clip reveal, nothing slides up from the
  // bottom. Embedded mode (inside the Process outro screen) is driven by
  // "hw:tst" events from the strip's scrub; standalone keeps a trigger. ──
  useEffect(() => {
    const root = testiRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const pieces = gsap.utils
        .toArray<HTMLElement>("[data-t-el]", root)
        .filter((el) => el.tagName !== "BLOCKQUOTE");
      const quote = root.querySelector<HTMLElement>("blockquote");
      const words = quote ? Array.from(quote.querySelectorAll<HTMLElement>(".tsq-word")) : [];
      const film = root.querySelector<HTMLElement>(".tst-film");
      const ttWord = root.querySelector<HTMLElement>(".tt-word");
      const ttLineL = root.querySelector<HTMLElement>(".tt-line-l");
      const ttLineR = root.querySelector<HTMLElement>(".tt-line-r");
      const ttPlus = root.querySelectorAll<HTMLElement>(".tt-plus");

      gsap.set(pieces, { autoAlpha: 0, y: 24 });
      if (quote) gsap.set(quote, { autoAlpha: 1 });
      gsap.set(words, { autoAlpha: 0 });
      if (film) gsap.set(film, { clipPath: "inset(50%)" });
      if (ttWord) gsap.set(ttWord, { yPercent: 115 });
      gsap.set(ttLineL, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(ttLineR, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(ttPlus, { autoAlpha: 0, scale: 0.4 });

      const enter = gsap.timeline({ paused: true });
      enter
        // the title: word rises, then the LINES DRAW OUTWARD from it with
        // the plusses landing at the ends — the dynamic TitleRule move
        // (George: not a fade)
        .to(ttWord, { yPercent: 0, duration: 0.7, ease: "expo.out" }, 0)
        .to([ttLineL, ttLineR], { scaleX: 1, duration: 0.8, ease: "power4.inOut" }, 0.25)
        .to(ttPlus, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.85)
        // the content beneath it
        .to(pieces[0] ?? [], { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.35)
        // the quote writes itself out
        .to(words, { autoAlpha: 1, duration: 0.05, stagger: 0.05, ease: "none" }, 0.5)
        .to(pieces.slice(1), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" }, 0.85)
        // the film opens centre-out (the house reveal), no slide
        .to(film, { clipPath: "inset(0%)", duration: 1.1, ease: "power4.inOut" }, 0.55);

      const onTst = (e: Event) => {
        const dir = (e as CustomEvent).detail;
        // the quote spans are re-keyed when the reel advances — target the
        // LIVE ones on every event, not the mount-time list
        const liveWords = root.querySelectorAll<HTMLElement>(".tsq-word");
        if (dir === "in") {
          visibleRef.current = true;
          enter.play();
          gsap.fromTo(liveWords, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, stagger: 0.05, delay: 0.2, ease: "none", overwrite: "auto" });
          advanceRef.current?.play();
          if (videoRefs.current[0]) safePlay(videoRefs.current[0]!);
        } else {
          visibleRef.current = false;
          enter.reverse();
          gsap.to(liveWords, { autoAlpha: 0, duration: 0.25, overwrite: "auto" });
          advanceRef.current?.pause();
        }
      };

      if (embedded) {
        window.addEventListener("hw:tst", onTst);
        return () => {
          window.removeEventListener("hw:tst", onTst);
          enter.kill();
        };
      }
      // standalone fallback: play on passage
      const st = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%", toggleActions: "play none none reverse" },
      });
      st.call(() => enter.play(), [], 0);
      return () => { st.scrollTrigger?.kill(); st.kill(); enter.kill(); };
    });
    return () => mm.revert();
  }, [embedded]);

  const goTo = useCallback((i: number) => {
    setActive((prev) => (i === prev ? prev : i));
  }, []);

  // the reel: crossfade the film, run the progress line, advance
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the quote writes itself in on every switch — but never before the
    // section has been revealed (this ran on mount and un-hid the quote
    // inside the strip's sticky screen before its cue)
    const words = document.querySelectorAll<HTMLElement>(".tsq-word");
    if (words.length && !reduced && visibleRef.current) {
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

  // only run media while the testimonials are on screen. Embedded mode gets
  // its visibility from the hw:tst events instead (the IO would fire the
  // moment the strip pins, long before the reveal).
  useEffect(() => {
    if (embedded) return;
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
  }, [active, embedded]);

  return (
    <section
      ref={testiRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="05 — Testimonials"
      className={
        embedded
          ? "relative z-30 px-5 pb-[8vh] pt-[6vh] text-[var(--fg)] md:px-10 md:pb-0 md:pt-0"
          : "relative z-30 bg-[var(--bg)] px-5 pb-[6vh] pt-[6vh] text-[var(--fg)] md:px-10 md:pb-[9vh] md:pt-[10vh]"
      }
      aria-label="Testimonials"
    >
      {/* the title — its lines draw OUTWARD from the word with plusses at
          the ends (the dynamic move, part of the load-in; George) */}
      <div className="mb-[5vh] flex items-center gap-4 md:mb-[6vh] md:gap-6">
        <span className="tt-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
        <span className="tt-line-l block h-px flex-1 bg-[var(--fg)] will-change-transform" />
        <h2 className="shrink-0 overflow-hidden text-center">
          <span className="tt-word font-display block text-[clamp(1.8rem,3.6vw,3.4rem)] leading-none">
            Testimonials
          </span>
        </h2>
        <span className="tt-line-r block h-px flex-1 bg-[var(--fg)] will-change-transform" />
        <span className="tt-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
      </div>

      {/* the composition sits centred as one block: quote column and the
          square film locked to each other (no dead space below) */}
      <div className="md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-12">
        {/* LEFT — the 1820-style showcase: one voice at a time, big.
            Mobile: compressed + centred (George) */}
        <div className="tst-copy flex flex-col justify-between text-center will-change-transform md:text-left">
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
              className="font-display mt-5 max-w-[46rem] text-[clamp(1.5rem,2.9vw,2.7rem)] leading-[1.04] md:mt-7"
            >
              {TESTIMONIALS[active].quote.split(" ").map((w, i, arr) => (
                <span key={`${active}-${i}`} className="tsq-word">
                  {i === 0 && "“"}
                  {w}
                  {i === arr.length - 1 ? "”" : " "}
                </span>
              ))}
            </blockquote>
            <figcaption data-t-el className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 md:mt-8 md:justify-start">
              <span className="label-mono text-[11px] tracking-[0.2em] text-[var(--fg)]">
                {TESTIMONIALS[active].role}
              </span>
              <Link href={`/work/${TESTIMONIALS[active].slug}`} className="blink text-[11px] tracking-[0.05em]">
                View project
              </Link>
            </figcaption>
          </div>

        {/* the HUD: BIG bare numerals, the Stone Visuals treatment (George:
            "big 01 02 03 in big writing, not little boxes") — active is full
            cream, idle sits back; the gold reel-progress line runs under each */}
          <div data-t-el className="mt-6 flex items-end justify-center gap-8 md:mt-8 md:justify-start md:gap-10">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-pressed={active === i}
                aria-label={`Show ${t.brand} testimonial`}
                className="group flex flex-col items-stretch gap-3 pb-1"
              >
                <span
                  className={`font-display text-5xl leading-none transition-colors duration-300 md:text-6xl ${
                    active === i ? "text-[var(--fg)]" : "text-[var(--fg)]/25 group-hover:text-[var(--fg)]/60"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative block h-px w-full overflow-hidden bg-[var(--fg)]/20">
                  <span
                    ref={(el) => { barRefs.current[i] = el; }}
                    className="absolute inset-0 origin-left scale-x-0 bg-[var(--gold-accent)]"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — the SQUARE film window, locked level with the quote
            column (items-center on the grid keeps the block balanced) */}
        <div className="tst-film mx-auto mt-7 w-full max-w-[480px] md:mx-0 md:mt-0 md:justify-self-end">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[var(--hairline-dark)] bg-black">
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
