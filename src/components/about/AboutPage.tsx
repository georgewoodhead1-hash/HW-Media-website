"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import Rule from "@/components/shell/Rule";
import FooterReveal from "@/components/shell/FooterReveal";
import PageBuild from "@/components/shell/PageBuild";

// ABOUT — George's final structure, nothing more:
//   1. a quiet top: title + two plain lines, built smoothly by the page
//      transition (words rise → hairline draws → copy arrives)
//   2. WHAT WE DO (the kept grid) + Discover the work
//   3. MEET THE FOUNDER — Harry, and why he started it
// ⚠ Founder copy is drafted for Harry to reword before launch.

const INTRO_A =
  "HW Media is a London production company led by director Harry Wallis.";
const INTRO_B =
  "A small senior crew on every job, and no layers between you and the people making the work.";

const FOUNDER_COPY_A =
  "Harry started HW Media in 2018, shooting films for the brands he grew up around. The idea has not changed since: the person who promises the film is the person behind the camera.";
const FOUNDER_COPY_B =
  "He directs and shoots every project himself, with a trusted collective of creatives who scale around the job when it gets bigger. He is also a CAA-authorised drone pilot, so the aerials stay in-house.";

export default function AboutPage() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]", el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 44,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 86%" },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageBuild />
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* ── 1. THE TOP — title and two plain lines, built by the transition ── */}
        <section data-surface="page" className="relative z-10 bg-[var(--bg)] px-5 pb-[10vh] pt-[24vh] md:px-10">
          <h1 data-enter-words className="font-display text-[clamp(2.8rem,7vw,7rem)] leading-[0.95]">
            About HW Media.
          </h1>
          <span aria-hidden data-enter-line className="mt-8 block h-px w-[min(52vw,640px)] bg-[var(--fg)]/60" />
          <div className="mt-8 max-w-[58ch]">
            <p data-enter className="text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.6]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
              {INTRO_A}
            </p>
            <p data-enter className="mt-4 text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.6]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
              {INTRO_B}
            </p>
          </div>
        </section>

        {/* ── 2. WHAT WE DO (kept) + Discover the work ── */}
        <section data-surface="page" className="relative z-10 bg-[var(--bg)] pb-[14vh] pt-[4vh]">
          <div className="px-5 md:px-10">
            <Rule label="What we do" bg="var(--bg)" className="mb-[8vh]" />
          </div>
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-rise
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
          <p data-rise className="mt-[7vh] text-center">
            <Link href="/work" className="blink text-[13px] tracking-[0.05em]">
              Discover the work
            </Link>
          </p>
        </section>

        {/* ── 3. MEET THE FOUNDER ── */}
        <section data-surface="page" className="relative z-10 bg-[var(--bg)] px-5 pb-[20vh] pt-[4vh] md:px-10">
          <Rule label="Meet the founder" bg="var(--bg)" className="mb-[9vh]" />
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div data-rise className="relative overflow-hidden md:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/harry-field.jpg"
                alt="Harry Wallis, director of HW Media"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="md:col-span-6 md:col-start-7 md:pt-6">
              <h2 data-rise className="font-display text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[0.98]">
                Harry Wallis
              </h2>
              <p data-rise className="label-mono mt-3 text-[11px] tracking-[0.22em] text-[var(--fg)]">
                DIRECTOR / DP
              </p>
              <p data-rise className="mt-8 max-w-[52ch] text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.65]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {FOUNDER_COPY_A}
              </p>
              <p data-rise className="mt-5 max-w-[52ch] text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.65]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                {FOUNDER_COPY_B}
              </p>
              <p data-rise className="mt-9">
                <Link href="/contact" className="blink text-[13px] tracking-[0.05em]">
                  Get in touch
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterReveal />
    </>
  );
}
