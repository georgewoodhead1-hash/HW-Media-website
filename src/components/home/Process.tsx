"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import TitleRule from "@/components/shell/TitleRule";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// 04 — OUR PROCESS, v8 (George, 2026-07-13): HORIZONTAL. The four frames
// conjoin side by side into one filmstrip and the scroll pulls it RIGHT
// ACROSS THE SCREEN, left to right through the stages — not up and down.
// The v7 depth grammar is kept, rotated 90°: the words travel with their
// frame but at their own speed with a whisper of tilt, floating in front
// of the image. Mobile keeps the plain vertical stack (no scroll-jacking
// on touch).
//
// Geometry: the runway is 560vh; a sticky window holds the 400vw track and
// the scrub maps runway progress to track x (300vw of travel, with a small
// dwell on DELIVER at the end). Sticky, not pin — a pinned (transformed)
// section ancestor breaks position:fixed elsewhere (house gotcha).

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

const N = STAGES.length;
const sm = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];
      const runway = root.querySelector<HTMLElement>(".proc-runway");
      const track = root.querySelector<HTMLElement>(".proc-track");
      const panels = gsap.utils.toArray<HTMLElement>(".proc-panel", root);
      if (!runway || !track || panels.length !== N) return;

      // each panel's word-build, played/reversed as its frame crosses in
      const builds = panels.map((panel) => {
        const word = panel.querySelector<HTMLElement>(".proc-word");
        const num = panel.querySelector<HTMLElement>(".proc-num");
        const sub = panel.querySelector<HTMLElement>(".proc-sub");
        const cta = panel.querySelector<HTMLElement>(".proc-cta");
        gsap.set(word, { clipPath: "inset(0% 100% 0% 0%)", x: 44 });
        gsap.set(num, { autoAlpha: 0, letterSpacing: "0.6em" });
        gsap.set([sub, cta], { autoAlpha: 0, x: 18 });
        const tl = gsap.timeline({ paused: true });
        tl.to(num, { autoAlpha: 1, letterSpacing: "0.22em", duration: 0.5, ease: "power2.out" }, 0)
          // the word wipes open in the strip's travel direction
          .to(word, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.75, ease: "power2.out" }, 0.08)
          .to(sub, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" }, 0.4)
          .to(cta, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.6);
        kills.push(() => tl.kill());
        return tl;
      });

      // frame 01 builds as the section arrives, before the strip engages
      const first = ScrollTrigger.create({
        trigger: runway,
        start: "top 72%",
        onEnter: () => builds[0].play(),
        onLeaveBack: () => builds[0].reverse(),
      });
      kills.push(() => first.kill());

      const texts = panels.map((p) => p.querySelector<HTMLElement>(".proc-text"));
      const imgs = panels.map((p) => p.querySelector<HTMLElement>("img"));

      // ONE scrub drives the strip and every frame's depth from its transit
      const drive = ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // strip travel — right to left, small dwell on the last frame
          const travel = Math.min(1, p / 0.94);
          gsap.set(track, { xPercent: (-100 * (N - 1)) / N * travel, force3D: true });

          panels.forEach((panel, i) => {
            // transit t: 0 = fully right of frame, 0.5 = centred, 1 = fully left
            const t = Math.min(1, Math.max(0, (travel * (N - 1) - (i - 1)) / 2));
            // the 3D float, rotated to the horizontal: words lead the frame,
            // the image lags inside it, a whisper of Y-tilt (v7 grammar)
            const text = texts[i];
            const img = imgs[i];
            if (text) {
              gsap.set(text, {
                xPercent: 34 - 68 * t,
                rotationY: -(7 - 14 * t),
                z: 40 * (1 - Math.abs(t - 0.5) * 2),
                autoAlpha: 1 - sm(0.82, 0.97, t),
                force3D: true,
              });
            }
            if (img) gsap.set(img, { xPercent: -8 + 16 * t, scale: 1.1 - 0.1 * t, force3D: true });
            // words assemble as the frame crosses in (frame 01 handled above)
            if (i > 0) {
              const tl = builds[i];
              if (t > 0.3) {
                if (tl.reversed() || (!tl.isActive() && tl.progress() === 0)) tl.play();
              } else if (t < 0.24) {
                if (!tl.reversed() && (tl.isActive() || tl.progress() > 0)) tl.reverse();
              }
            }
          });
        },
      });
      kills.push(() => drive.kill());

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
      data-chapter="04 — Our process"
      className="relative z-[20] bg-[var(--bg)] text-[var(--fg)]"
      aria-label="Our process"
    >
      {/* centred title, dynamic lines drawing out either side of the words */}
      <div className="px-5 pt-[4vh] md:px-10">
        <TitleRule title="Our Process" className="mb-[5vh]" />
      </div>

      {/* THE STRIP — four frames conjoined side by side; the runway's scroll
          pulls the track across the screen. Mobile: plain vertical stack. */}
      <div className="proc-runway relative md:h-[560vh]">
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <div className="proc-track md:flex md:h-screen md:w-[400vw] md:will-change-transform">
            {STAGES.map((s) => (
              <div
                key={s.n}
                className="proc-panel relative flex h-[80vh] items-center justify-center overflow-hidden md:h-full md:w-screen md:flex-none"
                style={{ perspective: "900px" }}
              >
                <div className="absolute inset-y-0 inset-x-[-9%]" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" className="h-full w-full object-cover will-change-transform" loading="lazy" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                </div>

                <div className="proc-text relative z-10 max-w-3xl px-6 text-center will-change-transform">
                  <p className="proc-num label-mono mb-4 text-[11px] tracking-[0.22em] text-[var(--fg)]">
                    {s.n} / 04
                  </p>
                  <h3 className="proc-word font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-[0.95]">
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
          </div>
        </div>
      </div>
    </section>
  );
}
