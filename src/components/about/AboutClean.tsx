"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import ProjectCTA from "@/components/shell/ProjectCTA";
import TrailField from "@/components/shell/TrailField";
import Rule from "@/components/shell/Rule";

// About — rebuilt from zero (George: keep ONLY What We Do, full creative freedom).
// Four beats, each a LAYER that slides over the last (the 1820 stack language
// the rest of the site now speaks):
//   1. a full-screen film with one huge centred line
//   2. WHAT WE DO — the kept grid, films behind every card
//   3. BEHIND THE CAMERA — Harry, with the BTS mouse-trail living in the air
//   4. the Defender "Start here" close.
// No eyebrows, no micro-labels, nothing typed quietly into the left margin.

const SERVICES = [
  { name: "Brand films", clip: "/videos/micro/m01.mp4" },
  { name: "Documentary", clip: "/videos/micro/m03.mp4" },
  { name: "Commercial", clip: "/videos/micro/m05.mp4" },
  { name: "Photography", clip: "/videos/micro/m04.mp4" },
  { name: "Live events", clip: "/videos/micro/m06.mp4" },
  { name: "Aerial", clip: "/videos/micro/m08.mp4" },
  { name: "Edit & grade", clip: "/videos/micro/m10.mp4" },
  { name: "Social cutdowns", clip: "/videos/micro/m11.mp4" },
];

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
      // grid + Harry beats rise as they arrive
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0,
          y: 44,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%" },
        });
      });
      // slow parallax on the opener film + Harry portrait
      gsap.utils.toArray<HTMLElement>("[data-para]").forEach((media) => {
        gsap.fromTo(
          media,
          { yPercent: -7 },
          { yPercent: 7, ease: "none", scrollTrigger: { trigger: media.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
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
    <main ref={root} className="on-media relative overflow-x-clip bg-[#050505] text-[#f5f1e6]">
      {/* 1 — OPENER: full-screen film, one huge centred line, fade-down into the page */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <video
          data-auto
          data-para
          className="absolute inset-x-0 top-[-7%] h-[114%] w-full object-cover"
          src="/videos/micro/m09.mp4"
          poster="/videos/micro/posters/m09.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-[#050505]" />
        <h1 className="relative z-10 px-5 text-center font-display text-[clamp(3rem,9.5vw,9.5rem)] leading-[0.92]" aria-label="Films people choose to watch.">
          {STATEMENT.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              {line.split("").map((c, ci) => (
                <span key={ci} aria-hidden className="abx-char inline-block whitespace-pre will-change-transform">{c}</span>
              ))}
            </span>
          ))}
        </h1>
      </section>

      {/* 2 — WHAT WE DO (the keeper) — a layer over the opener */}
      <section className="relative z-10 -mt-[9vh] rounded-t-[2rem] bg-[#0a0a09] px-5 pb-[16vh] pt-[11vh] shadow-[0_-24px_60px_rgba(0,0,0,0.6)] md:px-10">
        <Rule />
        <h2 className="about-display mt-10 text-center text-[clamp(2.4rem,6vw,5.4rem)]">
          What we do
        </h2>
        <div className="mx-auto mt-[8vh] grid max-w-[1600px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              data-rise
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-md border border-[#f5f1e6]/12 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#f5f1e6]/45"
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
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <h3 className="about-display relative text-[#f5f1e6]" style={{ fontSize: "clamp(1.4rem,2.2vw,2.1rem)", textTransform: "none" }}>{s.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — BEHIND THE CAMERA — the next layer; the BTS trail lives in the air */}
      <section className="relative z-20 -mt-[6vh] rounded-t-[2rem] bg-[#0e0d0c] px-5 pb-[18vh] pt-[12vh] shadow-[0_-24px_60px_rgba(0,0,0,0.55)] md:px-10">
        <TrailField
          images={["/videos/micro/posters/m01.jpg","/videos/micro/posters/m02.jpg","/videos/micro/posters/m04.jpg","/videos/micro/posters/m05.jpg","/videos/micro/posters/m06.jpg","/videos/micro/posters/m07.jpg","/videos/micro/posters/m08.jpg","/videos/micro/posters/m09.jpg","/videos/micro/posters/m11.jpg","/videos/micro/posters/m12.jpg"]}
        />
        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[70vh] max-w-[1100px] flex-col items-center justify-center text-center">
          <h2 data-rise className="about-display text-[clamp(2.8rem,8vw,7.6rem)] leading-[0.9]">
            Behind the camera
          </h2>
          <p data-rise className="about-body mt-10 max-w-[56ch] text-[clamp(1.25rem,1.8vw,1.7rem)] leading-[1.55] text-[#f5f1e6]/85">
            Every HW Media film is directed and shot by Harry Wallis — a CAA-authorised drone pilot, so the aerials stay in-house too. When a job needs more, a trusted collective scales around it, but the camera never leaves his hands. The person who promises the film is the person behind it.
          </p>
        </div>
      </section>

      {/* 4 — the Defender close */}
      <ProjectCTA />
    </main>
  );
}
