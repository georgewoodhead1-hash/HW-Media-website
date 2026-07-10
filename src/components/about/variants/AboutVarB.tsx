"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onPageEntered } from "@/lib/entrance";
import FooterReveal from "@/components/shell/FooterReveal";
import { safePlay } from "@/lib/video";
import { WhatWeDo, BehindTheCamera } from "./shared";

// ABOUT — VARIANT B: "Statement over live frame". One full-bleed film loop,
// but the TYPE does the work: the statement rises word by word over the
// footage on page-enter, then as you scroll the film RECEDES (scales back,
// dims) while the words hold the frame — the reverse of the usual hero.
// Mid-page: the 1820-style sign-off pair — big line, drawn hairline, quiet
// second line, centre axis.
// ⚠ ALL statement copy is PLACEHOLDER — Harry rewords before launch.

const H1 = ["Who's behind", "the camera."];

export default function AboutVarB() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancel: (() => void) | null = null;
    const ctx = gsap.context(() => {
      // words rise once the route transition lands
      const words = gsap.utils.toArray<HTMLElement>(".vb-w", el);
      gsap.set(words, { yPercent: 112 });
      cancel = onPageEntered(() => {
        gsap.to(words, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.1 });
      });

      // the film recedes while the words hold — scroll-driven, one motion
      const film = el.querySelector<HTMLElement>(".vb-film");
      const st = ScrollTrigger.create({
        trigger: ".vb-opener",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (film) gsap.set(film, { scale: 1 - p * 0.1, opacity: 1 - p * 0.62 });
          gsap.set(".vb-head", { yPercent: -p * 18 });
        },
      });

      // sign-off pair: line draws between the two statements
      const rule = el.querySelector<HTMLElement>(".vb-rule");
      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "center center" });
        gsap.to(rule, {
          scaleX: 1, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: ".vb-pair", start: "top 72%", toggleActions: "play none none reverse" },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-vb-rise]", el).forEach((node) => {
        gsap.from(node, {
          autoAlpha: 0, y: 34, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 82%" },
        });
      });

      return () => st.kill();
    }, el);

    const vid = el.querySelector<HTMLVideoElement>(".vb-film video");
    if (vid) safePlay(vid);

    return () => { cancel?.(); ctx.revert(); };
  }, []);

  return (
    <>
      <main ref={root} className="relative z-10 overflow-x-clip bg-[var(--bg)] text-[var(--fg)]">
        {/* 1 — STATEMENT OVER LIVE FRAME */}
        <section data-surface="media" className="vb-opener relative h-[160vh]">
          <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
            <div className="vb-film absolute inset-0 will-change-[transform,opacity]" aria-hidden>
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
            <h1 className="vb-head relative z-10 text-center will-change-transform">
              {H1.map((line, li) => (
                <span key={li} className="block overflow-hidden">
                  <span className="vb-w font-display block text-[clamp(2.8rem,8vw,8rem)] leading-[0.95] text-[#f5f1e6]">
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </section>

        {/* 2 — WHAT WE DO (kept) */}
        <WhatWeDo />

        {/* 3 — THE SIGN-OFF PAIR (replaces the brands band) */}
        <section data-surface="page" className="vb-pair relative z-10 bg-[var(--bg)] px-5 py-[24vh] text-center md:px-10">
          <h2 data-vb-rise className="font-display mx-auto max-w-5xl text-[clamp(2.2rem,5vw,4.8rem)] leading-[1.0]">
            The strongest brands are built on great stories.
          </h2>
          <span aria-hidden className="vb-rule mx-auto mt-10 block h-px w-[min(46vw,520px)] bg-[var(--fg)]" />
          <p
            data-vb-rise
            className="mx-auto mt-10 max-w-[46ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.55] text-[var(--fg)]"
            style={{ fontFamily: "var(--font-firma), sans-serif" }}
          >
            We make the films that tell them.
          </p>
        </section>

        {/* 4 — BEHIND THE CAMERA (kept) */}
        <BehindTheCamera />
      </main>
      <FooterReveal />
    </>
  );
}
