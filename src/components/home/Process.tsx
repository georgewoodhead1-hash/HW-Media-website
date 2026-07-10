"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Rule from "@/components/shell/Rule";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// 04 — OUR PROCESS, v7 (George): the images SCROLL WITH THE PAGE — plain
// full-screen stills in flow, appearing from the bottom and riding up with
// the scroll like everything else. The words travel with their image but on
// their own slightly different speed and a whisper of tilt, so the type
// floats in front of the frame (the 3D feel). No fixed frames, no windows,
// no stacking.

interface Stage {
  n: string;
  name: string;
  sub: string;
  cta: string;
  href: string;
  img: string;
}

const STAGES: Stage[] = [
  {
    n: "01", name: "PRE-PRODUCTION",
    sub: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot.",
    cta: "Start a project", href: "/contact", img: "/videos/posters/loop-01.jpg",
  },
  {
    n: "02", name: "PRODUCTION",
    sub: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera.",
    cta: "Behind the scenes", href: "/about", img: "/videos/posters/loop-02.jpg",
  },
  {
    n: "03", name: "EDIT",
    sub: "Edit, grade, sound and motion under one roof. The film finds its rhythm.",
    cta: "See the films", href: "/work", img: "/videos/posters/loop-03.jpg",
  },
  {
    n: "04", name: "DELIVER",
    sub: "The master film plus every vertical, square and short-form cutdown your channels need — mastered properly, never cropped as an afterthought.",
    cta: "Start here", href: "/contact", img: "/videos/posters/loop-04.jpg",
  },
];

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];

      gsap.utils.toArray<HTMLElement>(".proc-panel", root).forEach((panel) => {
        const word = panel.querySelector<HTMLElement>(".proc-word");
        const num = panel.querySelector<HTMLElement>(".proc-num");
        const sub = panel.querySelector<HTMLElement>(".proc-sub");
        const cta = panel.querySelector<HTMLElement>(".proc-cta");

        gsap.set(word, { clipPath: "inset(0% 0% 100% 0%)", y: 44 });
        gsap.set(num, { autoAlpha: 0, letterSpacing: "0.6em" });
        gsap.set([sub, cta], { autoAlpha: 0, y: 16 });

        // words build as the panel arrives; reverses cleanly on the way back up
        const build = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 72%", toggleActions: "play none none reverse" },
        });
        build
          .to(num, { autoAlpha: 1, letterSpacing: "0.22em", duration: 0.5, ease: "power2.out" }, 0)
          .to(word, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.75, ease: "power2.out" }, 0.08)
          .to(sub, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.4)
          .to(cta, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.6);
        kills.push(() => { build.scrollTrigger?.kill(); build.kill(); });

        // OUT — the words lift and dissolve as the panel exits through the top
        const out = ScrollTrigger.create({
          trigger: panel,
          start: "bottom 52%",
          end: "bottom 14%",
          scrub: true,
          onUpdate: (self) => {
            const t = panel.querySelector<HTMLElement>(".proc-text");
            if (t) gsap.set(t, { autoAlpha: 1 - self.progress });
          },
        });
        kills.push(() => out.kill());

        // the words follow their image at a slightly different speed, with a
        // whisper of tilt — the 3D float (George)
        const text = panel.querySelector<HTMLElement>(".proc-text");
        const img = panel.querySelector<HTMLElement>("img");
        const drift = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
        });
        drift
          .fromTo(text, { yPercent: 34, rotationX: 7, z: 40 }, { yPercent: -34, rotationX: -7, z: 0, ease: "none" }, 0)
          .fromTo(img, { yPercent: -8, scale: 1.1 }, { yPercent: 8, scale: 1.0, ease: "none" }, 0);
        kills.push(() => { drift.scrollTrigger?.kill(); drift.kill(); });
      });

      return () => kills.forEach((k) => k());
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="media"
      data-chapter="05 — Our process"
      className="relative z-[20] bg-[var(--bg)] text-[var(--fg)]"
      aria-label="Our process"
    >
      <div className="px-5 pt-[2vh] md:px-10">
        <Rule label="Our process" className="mb-[5vh]" bg="var(--bg)" />
      </div>

      {/* four full-screen stills IN FLOW — they arrive from the bottom and
          scroll up with the page; the words ride with them */}
      {STAGES.map((s) => (
        <div
          key={s.n}
          className="proc-panel relative flex h-[80vh] items-center justify-center overflow-hidden md:h-screen"
          style={{ perspective: "900px" }}
        >
          <div className="absolute inset-[-9%]" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" className="h-full w-full object-cover will-change-transform" loading="lazy" />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          </div>

          <div className="proc-text relative z-10 max-w-3xl px-6 text-center will-change-transform">
            <p className="proc-num label-mono mb-4 text-[11px] tracking-[0.22em] text-[var(--fg)]">
              {s.n} / 04
            </p>
            <h3 className="proc-word font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.015em]">
              {s.name}
              {s.n === "04" && "."}
            </h3>
            <p className="proc-sub about-body mx-auto mt-6 max-w-xl text-[14px] leading-relaxed text-[var(--fg)] md:text-[16px]">
              {s.sub}
            </p>
            <p className="proc-cta mt-7">
              <Link href={s.href} className="blink text-[13px] tracking-[0.05em]">
                {s.cta}
              </Link>
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
