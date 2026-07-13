"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import TitleRule from "@/components/shell/TitleRule";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// 04 — OUR PROCESS, v9 (George, 2026-07-13): HORIZONTAL, with the words
// FRONT AND CENTRE. The four frames conjoin side by side and the scroll
// pulls the strip across the screen. The IMAGE carries the movement — each
// stage's words come to the SCREEN CENTRE quickly, PARK there while their
// frame passes underneath, then hand back to the frame on the way out
// (v8's ride-along words crossed the viewport too fast to read). The
// words counter-translate against the track: screen offset s(t) =
// frameOffset(t) × (1 − hold(t)), where hold ramps in by t=0.38 and out
// after t=0.62. No numbers.
//
// THE OUTRO: after the last frame, the image sinks to black while the
// letters of "Deliver." scramble and lock, left to right, into
// "Testimonials" — the word writes itself, then the testimony arrives
// (the Testimonials section rides up beneath it). Scroll-driven and fully
// reversible: scroll back and it unwrites into Deliver.
//
// Geometry: 640vh runway; sticky window; 400vw track. Strip travel is done
// at 78% of the runway; the outro morph owns 80% → 96%. Sticky, not pin —
// a pinned (transformed) section ancestor breaks position:fixed elsewhere
// (house gotcha). Mobile keeps the plain vertical stack.

interface Stage {
  name: string;
  sub: string;
  cta: string;
  href: string;
  img: string;
}

const STAGES: Stage[] = [
  {
    name: "Pre-production",
    sub: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot.",
    cta: "Start a project", href: "/contact", img: "/videos/posters/loop-01.jpg",
  },
  {
    name: "Production",
    sub: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera.",
    cta: "Behind the scenes", href: "/about", img: "/videos/posters/loop-02.jpg",
  },
  {
    name: "Edit",
    sub: "Edit, grade, sound and motion under one roof. The film finds its rhythm.",
    cta: "See the films", href: "/work", img: "/videos/posters/loop-03.jpg",
  },
  {
    name: "Deliver",
    sub: "The master film plus every vertical, square and short-form cutdown your channels need — mastered properly, never cropped as an afterthought.",
    cta: "Start here", href: "/contact", img: "/videos/posters/loop-04.jpg",
  },
];

const N = STAGES.length;
const TRAVEL_END = 0.78; // strip parked by here; the rest is the outro's
const MORPH_TARGET = "Testimonials";
const SCRAMBLE = "aeimnorstuv";

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
        const sub = panel.querySelector<HTMLElement>(".proc-sub");
        const cta = panel.querySelector<HTMLElement>(".proc-cta");
        gsap.set(word, { clipPath: "inset(0% 100% 0% 0%)", x: 30 });
        gsap.set([sub, cta], { autoAlpha: 0, x: 18 });
        const tl = gsap.timeline({ paused: true });
        tl.to(word, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.75, ease: "power2.out" }, 0)
          .to(sub, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" }, 0.3)
          .to(cta, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.5);
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
      const lastWord = panels[N - 1].querySelector<HTMLElement>(".proc-word");
      const lastSub = panels[N - 1].querySelector<HTMLElement>(".proc-sub");
      const lastCta = panels[N - 1].querySelector<HTMLElement>(".proc-cta");
      const blackout = panels[N - 1].querySelector<HTMLElement>(".proc-blackout");
      let morphShown: string | null = null; // last text written (skip no-op writes)

      // ONE scrub drives the strip, every frame's depth, and the outro
      const drive = ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const travel = Math.min(1, p / TRAVEL_END);
          gsap.set(track, { xPercent: (-100 * (N - 1)) / N * travel, force3D: true });

          const vw = window.innerWidth / 100;
          panels.forEach((panel, i) => {
            // transit t: 0 = fully right of frame, 0.5 = centred, 1 = fully left
            const t = Math.min(1, Math.max(0, (travel * (N - 1) - (i - 1)) / 2));
            const text = texts[i];
            const img = imgs[i];
            // WORDS PARK AT THE SCREEN CENTRE: the frame's own screen offset
            // is c = 100 − 200t (vw). The words' screen offset flattens to 0
            // while hold() is up — they arrive quickly, sit front-and-centre
            // as the image passes beneath, and hand back to the frame late.
            if (text) {
              const c = 100 - 200 * t;
              const hold = sm(0.2, 0.38, t) * (1 - sm(0.62, 0.8, t));
              const s = c * (1 - hold);
              gsap.set(text, {
                x: (s - c) * vw,
                rotationY: Math.max(-3, Math.min(3, -s / 10)),
                z: 30 * hold,
                autoAlpha: 1 - sm(0.86, 0.98, t),
                force3D: true,
              });
            }
            // IMAGE: unchanged — the frame carries the motion
            if (img) gsap.set(img, { xPercent: -8 + 16 * t, scale: 1.1 - 0.1 * t, force3D: true });
            if (i > 0) {
              const tl = builds[i];
              if (t > 0.3) {
                if (tl.reversed() || (!tl.isActive() && tl.progress() === 0)) tl.play();
              } else if (t < 0.24) {
                if (!tl.reversed() && (tl.isActive() || tl.progress() > 0)) tl.reverse();
              }
            }
          });

          // ── THE OUTRO — image to black, the word rewrites itself ──
          const q = (p - 0.8) / 0.16; // 0→1 across the morph zone
          if (blackout) gsap.set(blackout, { opacity: sm(0, 0.9, q) });
          if (lastSub) gsap.set(lastSub, { autoAlpha: q > 0 ? 1 - sm(0, 0.25, q) : 1 });
          if (lastCta) gsap.set(lastCta, { autoAlpha: q > 0 ? 1 - sm(0, 0.25, q) : 1 });
          if (lastWord) {
            let out: string;
            if (q <= 0) {
              out = "Deliver.";
            } else if (q >= 1) {
              out = MORPH_TARGET;
            } else {
              // every letter alive at once, locking left to right — the
              // word literally writes itself into "Testimonials"
              out = MORPH_TARGET.split("")
                .map((ch, i) => {
                  const lockAt = 0.12 + 0.78 * (i / (MORPH_TARGET.length - 1));
                  if (q >= lockAt) return ch;
                  const g = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
                  return i === 0 ? g.toUpperCase() : g;
                })
                .join("");
            }
            if (out !== morphShown && (q > 0 && q < 1 ? true : out !== lastWord.textContent)) {
              lastWord.textContent = out;
              morphShown = q > 0 && q < 1 ? null : out; // mid-morph always rewrites (scramble ticks)
            }
          }
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
      <div className="proc-runway relative md:h-[640vh]">
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          <div className="proc-track md:flex md:h-screen md:w-[400vw] md:will-change-transform">
            {STAGES.map((s, i) => (
              <div
                key={s.name}
                className="proc-panel relative flex h-[80vh] items-center justify-center overflow-hidden md:h-full md:w-screen md:flex-none md:overflow-visible"
                style={{ perspective: "900px" }}
              >
                {/* the image clips inside its own holder, so the parked
                    words are free to hang past the frame edge un-clipped */}
                <div className="absolute inset-0 overflow-hidden" aria-hidden>
                  <div className="absolute inset-y-0 inset-x-[-9%]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img} alt="" className="h-full w-full object-cover will-change-transform" loading="lazy" />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                    {/* the outro's fall to black lives on the last frame only */}
                    {i === N - 1 && <div className="proc-blackout absolute inset-0 bg-black opacity-0" />}
                  </div>
                </div>

                <div className="proc-text relative z-10 max-w-3xl px-6 text-center will-change-transform">
                  <h3 className="proc-word font-display text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">
                    {s.name}
                    {i === N - 1 && "."}
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
