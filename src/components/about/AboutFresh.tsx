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

// ABOUT — fresh build, no ties to previous attempts. Structured on the
// HOMEPAGE's own beats so the two pages read as one site:
//   1. OPENER = the home hero grammar: full-bleed film, one giant
//      left-anchored line rising after the transition lands
//   2. THE MANIFESTO = the Bennett & Clive About move (captured live):
//      a ghost outlined title holds the stage while big statement lines
//      scroll through it, each brightening as it passes the centre
//   3. WHAT WE DO = the kept grid under the house plus-rule
//   4. BEHIND THE CAMERA = a full-bleed beat like the story band: the
//      trail field is the footage, the heading rides left
// ⚠ Manifesto lines are drafted in Harry's voice — he rewords pre-launch.

const MANIFESTO = [
  "Everyone makes content now.",
  "More of it than ever, faster than ever.",
  "Most of it looks exactly how that sounds.",
  "We work the other way.",
  "One director. A small senior crew.",
  "The person who promises the film shoots it.",
  "Sixty films. Fourteen countries.",
  "Most clients come back.",
];

export default function AboutFresh() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // ── 1. opener line rises out of its clip once the page lands ──
      const words = gsap.utils.toArray<HTMLElement>(".af-ow", el);
      gsap.set(words, { yPercent: 112 });
      cancel = onPageEntered(() => {
        gsap.to(words, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.08, delay: 0.1 });
      });

      // the film drifts as you leave the opener (home hero's quiet exit)
      const film = el.querySelector<HTMLElement>(".af-film");
      if (film) {
        gsap.fromTo(
          film,
          { yPercent: 0 },
          {
            yPercent: 12, ease: "none",
            scrollTrigger: { trigger: ".af-opener", start: "top top", end: "bottom top", scrub: true },
          },
        );
      }

      // ── 2. manifesto lines brighten as they pass the centre of the frame ──
      gsap.utils.toArray<HTMLElement>(".af-line", el).forEach((line) => {
        gsap.set(line, { opacity: 0.16 });
        const st = ScrollTrigger.create({
          trigger: line,
          start: "top 88%",
          end: "bottom 12%",
          scrub: 0.4,
          onUpdate: (self) => {
            // peak brightness at the centre of the viewport, dim either side
            const r = line.getBoundingClientRect();
            const mid = r.top + r.height / 2;
            const d = Math.abs(mid - window.innerHeight / 2) / (window.innerHeight / 2);
            gsap.set(line, { opacity: 0.16 + (1 - Math.min(1, d * 1.35)) * 0.84 });
          },
        });
        return () => st.kill();
      });

      // the ghost title drifts slower than the lines (depth)
      const ghost = el.querySelector<HTMLElement>(".af-ghost");
      if (ghost) {
        gsap.fromTo(
          ghost,
          { yPercent: -6 },
          {
            yPercent: 6, ease: "none",
            scrollTrigger: { trigger: ".af-manifesto", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }

      // ── shared: content rises on its own passage ──
      gsap.utils.toArray<HTMLElement>("[data-af-rise]", el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0, y: 40, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 86%" },
        });
      });
    }, el);

    const vid = el.querySelector<HTMLVideoElement>(".af-film video");
    if (vid) safePlay(vid);

    return () => { cancel?.(); ctx.revert(); };
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* ── 1. OPENER — the home hero grammar, About's words ── */}
        <section data-surface="media" className="af-opener relative flex h-[100svh] items-end overflow-hidden pb-[12vh] md:h-screen">
          <div className="af-film absolute inset-[-6%] will-change-transform" aria-hidden>
            <video
              className="h-full w-full object-cover"
              src="/videos/showreel-full.mp4"
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <h1 className="relative z-10 w-full px-5 md:px-10">
            {"Films, not content.".split(" ").map((w, i, arr) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="af-ow font-display inline-block whitespace-pre text-[clamp(3rem,9vw,9.5rem)] leading-[0.95] text-[#f5f1e6]">
                  {w}{i < arr.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>
        </section>

        {/* ── 2. THE MANIFESTO — lines scroll through the ghost title ── */}
        <section data-surface="page" className="af-manifesto relative z-20 bg-[var(--bg)] py-[16vh]">
          {/* ghost outlined title, held behind the passage */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span
              className="af-ghost font-display whitespace-nowrap text-[20vw] leading-none will-change-transform"
              style={{ WebkitTextStroke: "1px rgba(245,241,230,0.10)", color: "transparent" }}
            >
              ABOUT
            </span>
          </div>
          <div className="relative flex flex-col gap-[7vh] px-5 md:px-10">
            {MANIFESTO.map((line) => (
              <p key={line} className="af-line font-display text-center text-[clamp(1.9rem,4.6vw,4.6rem)] leading-[1.02]">
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* ── 3. WHAT WE DO — the kept grid, house rule grammar ── */}
        <section data-surface="page" className="relative z-20 bg-[var(--bg)] pb-[16vh] pt-[8vh]">
          <div className="px-5 md:px-10">
            <Rule label="What we do" bg="var(--bg)" className="mb-[9vh]" />
          </div>
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-af-rise
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

        {/* ── 4. BEHIND THE CAMERA — full-bleed beat, heading rides left ── */}
        <section data-surface="page" className="abx-crew relative z-20 bg-[var(--bg)] pb-[22vh] pt-[2vh]">
          <div className="px-5 md:px-10">
            <Rule label="Behind the camera" bg="var(--bg)" className="mb-[4vh]" />
          </div>
          <div className="relative py-[16vh] md:py-[20vh]">
            <TrailField images={["m01", "m02", "m03", "m04", "m05", "m06", "m08", "m10", "m11", "m12"].map((m) => `/videos/micro/posters/${m}.jpg`)} />
            <div className="pointer-events-none relative z-10 px-5 md:px-10">
              <h2 data-af-rise className="about-display text-left text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.92]">
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
