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

// ABOUT v2 (George: "too centred, no stacking/blending, copy is shit").
// The skeleton, not the decoration, carries the page now:
//   1. film opener is STICKY — the About Us sheet rides up OVER it while the
//      film settles back (the house curtain blend, same grammar as the
//      footer reveal and the route transition)
//   2. About Us: statement HUGE and LEFT, running to the edge; prose sits
//      RIGHT and LOW (staggered baselines, nothing centred)
//   3. the receipts: three oversized lines, alternating left/right/left,
//      each drifting against the scroll at its own speed while it ink-fills
//   4. What We Do: heading left on the rule, the kept grid with per-column
//      parallax drift so the wall moves as you pass it
//   5. Behind the Camera: full-bleed trail field, heading pushed left
// Entrances gate on the route transition. ⚠ Copy = placeholder for Harry.

const OPENER = "Who's behind the camera.";
const CH1_LINES = ["The person who", "promises the film", "shoots the film."];
const CH1_PROSE_A =
  "HW Media is a London production company led by director Harry Wallis. A small senior crew on every job, and no layers between you and the people making the work.";
const CH1_PROSE_B =
  "Harry shoots every project himself, with a trusted collective of creatives who scale around the job when it gets bigger.";

const RECEIPTS: { text: string; align: "left" | "right" | "center" }[] = [
  { text: "Sixty films.", align: "left" },
  { text: "Fourteen countries.", align: "right" },
  { text: "Most clients come back.", align: "left" },
];

export default function AboutMain() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // ── 1. opener line rises once the page lands ──
      const words = gsap.utils.toArray<HTMLElement>(".ab-ow", el);
      gsap.set(words, { yPercent: 112 });
      cancel = onPageEntered(() => {
        gsap.to(words, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.07, delay: 0.1 });
      });

      // the film settles back as the About Us sheet rides over it
      const film = el.querySelector<HTMLElement>(".ab-film");
      const openLine = el.querySelector<HTMLElement>(".ab-openline");
      const settle = ScrollTrigger.create({
        trigger: ".ab-opener",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          if (film) gsap.set(film, { scale: 1 - p * 0.06, opacity: 1 - p * 0.45 });
          if (openLine) gsap.set(openLine, { yPercent: -p * 30, autoAlpha: 1 - p * 1.4 });
        },
      });

      // ── 3. the receipts: each line drifts against the scroll while filling ──
      gsap.utils.toArray<HTMLElement>(".ab-receipt", el).forEach((line, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          line,
          { xPercent: dir * 6 },
          {
            xPercent: dir * -6, ease: "none",
            scrollTrigger: { trigger: line, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
        const inks = line.querySelectorAll<HTMLElement>(".ab-ink");
        gsap.set(inks, { opacity: 0.13 });
        gsap.to(inks, {
          opacity: 1, stagger: 0.05, ease: "none",
          scrollTrigger: { trigger: line, start: "top 82%", end: "top 34%", scrub: 0.6 },
        });
      });

      // ── 4. What We Do: per-column parallax drift ──
      gsap.utils.toArray<HTMLElement>(".ab-tile", el).forEach((tile, i) => {
        const speed = [0, 26, 10, 34][i % 4];
        gsap.fromTo(
          tile,
          { y: speed },
          {
            y: -speed, ease: "none",
            scrollTrigger: { trigger: ".ab-grid", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // chapter content rises on its own passage
      gsap.utils.toArray<HTMLElement>("[data-ab-rise]", el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0, y: 40, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 84%" },
        });
      });

      return () => settle.kill();
    }, el);

    const vid = el.querySelector<HTMLVideoElement>(".ab-film video");
    if (vid) safePlay(vid);

    return () => { cancel?.(); ctx.revert(); };
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* ── 1. OPENER — sticky film; the next sheet rides over it ── */}
        <section data-surface="media" className="ab-opener relative h-[170vh]">
          <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden md:h-screen">
            <div className="ab-film absolute inset-0 will-change-[transform,opacity]" aria-hidden>
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
            <h1 className="ab-openline relative z-10 w-full px-5 text-left md:px-10">
              {OPENER.split(" ").map((w, i, arr) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                  <span className="ab-ow font-display inline-block whitespace-pre text-[clamp(2.8rem,8.5vw,9rem)] leading-[0.98] text-[#f5f1e6]">
                    {w}{i < arr.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </section>

        {/* ── 2. ABOUT US — the sheet that rides over the film ── */}
        <section data-surface="page" className="relative z-20 -mt-[70vh] bg-[var(--bg)] px-5 pb-[10vh] pt-[9vh] md:px-10">
          <Rule label="About us" bg="var(--bg)" className="mb-[9vh]" />
          <div className="md:grid md:grid-cols-12 md:gap-6">
            {/* the statement — huge, left, running toward the edge */}
            <h2 className="font-display col-span-9 text-[clamp(2.6rem,6.4vw,6.6rem)] leading-[0.94]">
              {CH1_LINES.map((line, i) => (
                <span key={line} data-ab-rise className={`block ${i === 1 ? "md:pl-[8vw]" : ""} ${i === 2 ? "md:pl-[16vw]" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>
            {/* the prose — right column, sat LOW (staggered baseline) */}
            <div className="col-span-3 mt-10 max-w-[46ch] md:mt-[24vh]">
              <p data-ab-rise className="text-[15px] leading-[1.65] md:text-[16px]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {CH1_PROSE_A}
              </p>
              <p data-ab-rise className="mt-5 text-[15px] leading-[1.65] md:text-[16px]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {CH1_PROSE_B}
              </p>
              <p data-ab-rise className="mt-8">
                <Link href="/work" className="blink text-[13px] tracking-[0.05em]">
                  See the films
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. THE RECEIPTS — oversized lines, alternating edges, drifting ── */}
        <section data-surface="page" className="relative z-20 overflow-hidden bg-[var(--bg)] py-[14vh]">
          {RECEIPTS.map(({ text, align }) => (
            <p
              key={text}
              className={`ab-receipt font-display whitespace-nowrap px-5 text-[clamp(3rem,9vw,9.5rem)] leading-[1.06] will-change-transform md:px-10 ${
                align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
              }`}
            >
              {text.split(" ").map((w, i) => (
                <span key={i} className="ab-ink inline-block whitespace-pre">{w}{" "}</span>
              ))}
            </p>
          ))}
        </section>

        {/* ── 4. WHAT WE DO — heading on the rule, drifting wall ── */}
        <section data-surface="page" className="relative z-20 bg-[var(--bg)] pb-[16vh] pt-[6vh]">
          <div className="px-5 md:px-10">
            <Rule label="What we do" bg="var(--bg)" className="mb-[9vh]" />
          </div>
          <div className="ab-grid grid grid-cols-2 gap-0 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                aria-label={`${s.name} — what we offer`}
                className="ab-tile group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-black will-change-transform"
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

        {/* ── 5. BEHIND THE CAMERA — full-bleed field, heading pushed left ── */}
        <section data-surface="page" className="abx-crew relative z-20 bg-[var(--bg)] pb-[24vh] pt-[2vh]">
          <div className="px-5 md:px-10">
            <Rule label="Behind the camera" bg="var(--bg)" className="mb-[4vh]" />
          </div>
          <div className="relative py-[16vh] md:py-[20vh]">
            <TrailField images={["m01", "m02", "m03", "m04", "m05", "m06", "m08", "m10", "m11", "m12"].map((m) => `/videos/micro/posters/${m}.jpg`)} />
            <div className="pointer-events-none relative z-10 px-5 md:px-10">
              <h2 data-ab-rise className="about-display text-left text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.92]">
                Behind
                <br />
                the camera
              </h2>
            </div>
          </div>
        </section>
      </main>
      <FooterReveal />
    </>
  );
}
