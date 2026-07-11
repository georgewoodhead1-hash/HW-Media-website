"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";
import { safePlay } from "@/lib/video";
import Rule from "@/components/shell/Rule";
import FooterReveal from "@/components/shell/FooterReveal";
import TrailField from "@/components/shell/TrailField";
import { SERVICES } from "@/content/services";

// ABOUT — final-round rebuild on 1820's actual About grammar (captured live):
//   1. full-bleed film, ONE centred condensed line over it. Nothing else.
//   2. every chapter marked by the house plus-hairline rule (+ ── LABEL ── +)
//   3. first chapter = big statement LEFT, real paragraph RIGHT (asymmetric)
//   4. WHAT WE DO grid (kept), under its chapter rule
//   5. one giant centred statement beat, ink-filling on scroll
//   6. BEHIND THE CAMERA (kept) with the trail field
// Entrances gate on the route transition landing (hw:page-entered).
// ⚠ Statement lines are PLACEHOLDER — Harry rewords before launch.

const OPENER = "Who's behind the camera.";
const CH1_STATEMENT = ["A small crew.", "On purpose."];
const CH1_PROSE_A =
  "HW Media is a London production company led by director Harry Wallis. A small senior crew on every job, and no layers between you and the people making the work.";
const CH1_PROSE_B =
  "Harry shoots every project himself, with a trusted collective of creatives who scale around the job when it gets bigger.";

export default function AboutMain() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // ── 1. opener line rises out of its clip once the page has landed ──
      const words = gsap.utils.toArray<HTMLElement>(".ab-ow", el);
      gsap.set(words, { yPercent: 112 });
      cancel = onPageEntered(() => {
        gsap.to(words, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.07, delay: 0.1 });
      });

      // the film drifts slightly against the scroll on the way out
      const film = el.querySelector<HTMLElement>(".ab-film");
      if (film) {
        gsap.fromTo(
          film,
          { yPercent: 0 },
          {
            yPercent: 10, ease: "none",
            scrollTrigger: { trigger: ".ab-opener", start: "top top", end: "bottom top", scrub: true },
          },
        );
      }

      // ── chapter content rises on its own passage ──
      gsap.utils.toArray<HTMLElement>("[data-ab-rise]", el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0, y: 40, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 84%" },
        });
      });

      // ── 5. the giant line ink-fills word by word ──
      const fills = gsap.utils.toArray<HTMLElement>(".ab-fill", el);
      if (fills.length) {
        gsap.set(fills, { opacity: 0.14 });
        gsap.to(fills, {
          opacity: 1, stagger: 0.06, ease: "none",
          scrollTrigger: { trigger: ".ab-statement", start: "top 72%", end: "top 20%", scrub: 0.7 },
        });
      }
    }, el);

    const vid = el.querySelector<HTMLVideoElement>(".ab-film video");
    if (vid) safePlay(vid);

    return () => { cancel?.(); ctx.revert(); };
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* ── 1. OPENER — full-bleed film, one line ── */}
        <section data-surface="media" className="ab-opener relative flex h-[100svh] items-center justify-center overflow-hidden md:h-screen">
          <div className="ab-film absolute inset-[-6%] will-change-transform" aria-hidden>
            <video
              className="h-full w-full object-cover"
              src="/videos/showreel-full.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>
          <h1 className="relative z-10 px-5 text-center">
            {OPENER.split(" ").map((w, i, arr) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="ab-ow font-display inline-block whitespace-pre text-[clamp(2.6rem,7vw,7rem)] leading-[1.02] text-[#f5f1e6]">
                  {w}{i < arr.length - 1 ? "\u00A0" : ""}
                </span>
              </span>
            ))}
          </h1>
        </section>

        {/* ── 2/3. CHAPTER: ABOUT US — statement left, prose right ── */}
        <section data-surface="page" className="relative z-10 bg-[var(--bg)] px-5 pb-[16vh] pt-[6vh] md:px-10">
          <Rule label="About us" bg="var(--bg)" className="mb-[10vh]" />
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <h2 data-ab-rise className="font-display text-[clamp(2.2rem,4.6vw,4.6rem)] leading-[0.98]">
              {CH1_STATEMENT.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h2>
            <div className="max-w-[54ch] md:pt-2">
              <p data-ab-rise className="text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.6]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {CH1_PROSE_A}
              </p>
              <p data-ab-rise className="mt-6 text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.6]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {CH1_PROSE_B}
              </p>
              <p data-ab-rise className="mt-9">
                <Link href="/work" className="blink text-[13px] tracking-[0.05em]">
                  See the films
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. CHAPTER: WHAT WE DO (kept grid) ── */}
        <section data-surface="page" className="relative z-10 bg-[var(--bg)] pb-[14vh]">
          <div className="px-5 md:px-10">
            <Rule label="What we do" bg="var(--bg)" className="mb-[9vh]" />
          </div>
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-ab-rise
                aria-label={`${s.name} — what we offer`}
                className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black"
                onMouseEnter={(e) => { const v = e.currentTarget.querySelector("video"); v?.play().catch(() => {}); }}
                onMouseLeave={(e) => { e.currentTarget.querySelector("video")?.pause(); }}
              >
                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-25 transition-opacity duration-500 group-hover:opacity-75"
                  src={s.clip}
                  poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden
                />
                <div aria-hidden className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/20" />
                <h3 className="relative text-center">
                  <span className="blink blink-fill text-[clamp(12px,1.05vw,15px)] !text-[#f5f1e6] group-hover:!text-[var(--bg)]">
                    {s.name}
                  </span>
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 5. THE STATEMENT BEAT — one giant line, ink-filling ── */}
        <section data-surface="page" className="ab-statement relative z-10 bg-[var(--bg)] px-5 py-[22vh] md:px-10">
          <h2 className="font-display mx-auto max-w-6xl text-center text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[1.0]">
            {"Films, not content.".split(" ").map((w, i) => (
              <span key={i} className="ab-fill inline-block whitespace-pre">{w}{" "}</span>
            ))}
          </h2>
        </section>

        {/* ── 6. CHAPTER: BEHIND THE CAMERA (kept) ── */}
        <section data-surface="page" className="abx-crew relative z-20 bg-[var(--bg)] pb-[24vh] pt-[4vh]">
          <div className="px-5 md:px-10">
            <Rule label="Behind the camera" bg="var(--bg)" className="mb-[6vh]" />
          </div>
          <div className="relative py-[18vh] md:py-[22vh]">
            <TrailField images={["m01", "m02", "m03", "m04", "m05", "m06", "m08", "m10", "m11", "m12"].map((m) => `/videos/micro/posters/${m}.jpg`)} />
            <div className="pointer-events-none relative z-10 mx-auto flex flex-col items-center justify-center text-center">
              <h2 data-ab-rise className="about-display text-[clamp(2.6rem,7vw,6.4rem)] leading-[0.94]">
                Behind
                <br />
                the
                <br />
                camera
              </h2>
            </div>
          </div>
        </section>
      </main>
      <FooterReveal />
    </>
  );
}
