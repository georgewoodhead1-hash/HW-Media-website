"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import FooterReveal from "@/components/shell/FooterReveal";
import TrailField from "@/components/shell/TrailField";

// About — v3, the 1820 page language end to end: full-bleed media openers
// with giant centred statements drifting against the frame, tiny labels on
// hairlines, bracket links, a mid-page statement band (their sky band), the
// kept WHAT WE DO grid, BEHIND THE CAMERA with the write-on copy + trail,
// then the reveal footer. ⚠ band line is 1820-derived placeholder copy.

// services grid content + the /services/<slug> pages share one source
import { SERVICES } from "@/content/services";

const STATEMENT = ["FILMS PEOPLE", "CHOOSE", "TO WATCH."];

export default function AboutClean() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // the opening line rises out of clip lines on load
      gsap.fromTo(
        ".abx-char",
        { yPercent: 114 },
        { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.04, delay: 0.35 },
      );
      // the opener statement DRIFTS against its footage while you scroll —
      // the layering effect from the process deck
      gsap.fromTo(
        ".abx-drift",
        { yPercent: 10 },
        { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".abx-opener", start: "top top", end: "bottom top", scrub: 0.8 } },
      );
      // grid + headings rise as they arrive
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 44,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 86%" },
        });
      });
      // slow parallax on full-bleed media
      gsap.utils.toArray<HTMLElement>("[data-para]").forEach((media) => {
        gsap.fromTo(
          media,
          { yPercent: -7 },
          { yPercent: 7, ease: "none", scrollTrigger: { trigger: media.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      // the crew copy WRITES ITSELF in — word-by-word fill, resolves fast
      const words = gsap.utils.toArray<HTMLElement>(".abx-word");
      if (words.length) {
        gsap.set(words, { opacity: 0.22 });
        gsap.to(words, {
          opacity: 1,
          duration: 0.4,
          stagger: 0.02,
          ease: "power1.out",
          scrollTrigger: { trigger: ".abx-crew", start: "top 72%", end: "top 30%", scrub: 0.8 },
        });
      }
    }, el);

    const vids = el.querySelectorAll<HTMLVideoElement>("video[data-auto]");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "10% 0px" },
    );
    vids.forEach((v) => io.observe(v));

    return () => { ctx.revert(); io.disconnect(); };
  }, []);

  return (
    <>
      {/* NOT on-media (George: About must follow the light/dark toggle) — only
          the two full-bleed FOOTAGE sections below are locked cinema-dark */}
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* 1 — OPENER: the 1820 pattern — a full-bleed STILL (not the showreel),
            the statement giant and centred over it, words drifting against the
            frame, tiny label on top */}
        <section data-surface="media" className="abx-opener relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-[10vh] md:px-10">
          <div className="absolute inset-[-8%]" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-para src="/images/hero-defocus.jpg" alt="" className="h-full w-full object-cover will-change-transform" />
            <div className="absolute inset-0 bg-black/45" />
            {/* fades to the PAGE bg (cream in light mode) so the locked-dark
                opener still hands over cleanly to the themed section below */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--page-bg)]" />
          </div>
          <div className="abx-drift relative z-10 text-center will-change-transform">
            <h1 className="font-display text-[clamp(2.6rem,7.5vw,7.5rem)] leading-[0.92]" aria-label="Films people choose to watch.">
              {STATEMENT.map((line, li) => (
                <span key={li} className="block overflow-hidden">
                  {line.split("").map((c, ci) => (
                    <span key={ci} aria-hidden className="abx-char inline-block whitespace-pre will-change-transform">{c}</span>
                  ))}
                </span>
              ))}
            </h1>
            {/* subtext in the site's UI face (George: the serif-ish body read
                as a different font to the rest of the site) */}
            <p
              className="mx-auto mt-9 max-w-[52ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.55] text-[var(--fg)]"
              style={{ fontFamily: "var(--font-firma), sans-serif" }}
            >
              HW Media is a London production agency led by director Harry Wallis —
              films and photography for McLaren, Aston Martin, Nike and more.
            </p>
            <p className="mt-9">
              <Link href="/work" className="blink text-[13px] tracking-[0.05em]">
                See the films
              </Link>
            </p>
          </div>
        </section>

        {/* 2 — WHAT WE DO. ONE heading only (George), in the bracket grammar;
            each tile links to its /services page, its name dead-centre in the
            "See the films" face */}
        <section className="relative z-10 bg-[var(--bg)] pb-[14vh] pt-[10vh]">
          <div data-rise className="text-center">
            <h2 className="inline-block">
              <span
                className="blink-title font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none"
                style={{ fontFamily: "var(--font-suisse-cond), 'Helvetica Neue', Arial, sans-serif", letterSpacing: "-0.015em" }}
              >
                What we do
              </span>
            </h2>
          </div>
          {/* mobile = 2-up little squares (George: single column was way too long) */}
          <div className="mt-[7vh] grid grid-cols-2 gap-0 lg:grid-cols-4">
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
                {/* the name — EXACTLY the "Discover the work" grammar (George):
                    bracketed .blink label that fills to a solid bar when the
                    tile is hovered, so it clearly reads as clickable */}
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

        {/* 2.5 — the 1820 band: full-bleed still, one line, bracket link */}
        <section data-surface="media" className="relative flex h-[78vh] items-center justify-center overflow-hidden">
          <div className="absolute inset-[-8%]" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-para src="/images/stills/s01.jpg" alt="" className="h-full w-full object-cover will-change-transform" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/35" />
          </div>
          <div data-rise className="relative z-10 max-w-3xl px-6 text-center">
            <h2 className="font-display text-[clamp(1.9rem,4.4vw,4.2rem)] leading-[1.0] tracking-[-0.015em]">
              Brands come for one film.
              <br />
              They stay for the next ten.
            </h2>
            <p className="mt-9">
              <Link href="/contact" className="blink text-[13px] tracking-[0.05em]">
                Start a project
              </Link>
            </p>
          </div>
        </section>

        {/* 3 — BEHIND THE CAMERA — ONE bracketed heading, no film strip
            (George), a TALL breathing playground: the snake field fills the
            whole section BEHIND the text, spawning under the cursor / a tap */}
        <section className="abx-crew relative z-20 bg-[var(--bg)] py-[26vh] md:py-[30vh]">
          <TrailField images={["m01", "m02", "m03", "m04", "m05", "m06", "m08", "m10", "m11", "m12"].map((m) => `/videos/micro/posters/${m}.jpg`)} />
          {/* the big three-line stack — no brackets, no bar, no CTA (George):
              just the heading floating in the playground */}
          <div className="pointer-events-none relative z-10 mx-auto flex flex-col items-center justify-center text-center">
            <h2 data-rise className="about-display text-[clamp(2.6rem,7vw,6.4rem)] leading-[0.94]">
              Behind
              <br />
              the
              <br />
              camera
            </h2>
          </div>
        </section>

      </main>
      {/* one footer site-wide — the 1820 reveal footer */}
      <FooterReveal />
    </>
  );
}
