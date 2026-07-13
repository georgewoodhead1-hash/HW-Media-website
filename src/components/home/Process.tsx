"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import TitleRule from "@/components/shell/TitleRule";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// 04 — OUR PROCESS, v10 (George, 2026-07-13 round 2): NO DEAD STOP.
// The strip never parks — the Deliver frame KEEPS SCROLLING out to the
// left (its trailing right edge fades into black) while the parked word
// scramble-writes into "Testimonials". As the last sliver leaves, the
// hairlines draw OUT OF THE WORD to either side with the house plusses —
// that IS the Testimonials title (the section below has none) — and the
// testimony rises from the bottom on the next scroll.
//
// Words: come to the screen centre quickly, park while their frame passes,
// hand back late. The image carries the motion. No numbers.
//
// Geometry: 640vh runway, sticky window, 400vw track. Track runs a FULL
// −100% (four frame-widths: the last frame exits), done at p=0.90. Morph
// owns p 0.62→0.80 (while the image exits beneath it); the title lines
// draw p 0.83→0.92. Sticky, not pin (transformed-ancestor gotcha). Mobile
// keeps the plain vertical stack.

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
    cta: "Start a project", href: "/contact", img: "/videos/loop-01.mp4",
  },
  {
    name: "Production",
    sub: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera.",
    cta: "Behind the scenes", href: "/about", img: "/videos/loop-02.mp4",
  },
  {
    name: "Edit",
    sub: "Edit, grade, sound and motion under one roof. The film finds its rhythm.",
    cta: "See the films", href: "/work", img: "/videos/loop-03.mp4",
  },
  {
    name: "Deliver",
    sub: "The master film plus every vertical, square and short-form cutdown your channels need — mastered properly, never cropped as an afterthought.",
    cta: "Start here", href: "/contact", img: "/videos/loop-04.mp4",
  },
];

const N = STAGES.length;
const TRAVEL_END = 0.92; // full −100% track travel lands here
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

    // the loops only spin while the strip is anywhere near the viewport
    // (autoplay defers on below-fold media; battery says pause when gone)
    const media = Array.from(root.querySelectorAll<HTMLVideoElement>(".proc-media"));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) media.forEach((v) => safePlay(v));
        else media.forEach((v) => v.pause());
      }),
      { rootMargin: "300px 0px" },
    );
    io.observe(root);

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
      const imgs = panels.map((p) => p.querySelector<HTMLElement>(".proc-media"));
      const lastWord = panels[N - 1].querySelector<HTMLElement>(".proc-word");
      const lastSub = panels[N - 1].querySelector<HTMLElement>(".proc-sub");
      const lastCta = panels[N - 1].querySelector<HTMLElement>(".proc-cta");
      const mLineL = panels[N - 1].querySelector<HTMLElement>(".pm-line-l");
      const mLineR = panels[N - 1].querySelector<HTMLElement>(".pm-line-r");
      const mPlus = panels[N - 1].querySelectorAll<HTMLElement>(".pm-plus");
      gsap.set(mLineL, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(mLineR, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(mPlus, { autoAlpha: 0, scale: 0.4 });
      let morphShown: string | null = null;

      // ONE scrub drives the strip, every frame's depth, and the outro
      const drive = ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // continuous travel — the last frame EXITS, never parks (George:
          // "the image just keeps scrolling")
          const travel = Math.min(1, p / TRAVEL_END);
          gsap.set(track, { xPercent: -100 * travel, force3D: true });

          const vw = window.innerWidth / 100;
          panels.forEach((panel, i) => {
            const last = i === N - 1;
            // frame centre offset (vw): +100 entering right, 0 centred, −100 gone left
            const c = i * 100 - 400 * travel;
            // transit t: 0 → entering, 0.5 → centred, 1 → fully left
            const t = Math.min(1, Math.max(0, (100 - c) / 200));
            const text = texts[i];
            const img = imgs[i];
            if (text) {
              // words park at the screen centre while the frame passes; the
              // LAST word never hands back — it stays parked and becomes
              // the Testimonials title while its image leaves underneath
              const hold = last
                ? sm(0.2, 0.38, t)
                : sm(0.2, 0.38, t) * (1 - sm(0.62, 0.8, t));
              const s = c * (1 - hold);
              gsap.set(text, {
                x: (s - c) * vw,
                rotationY: Math.max(-3, Math.min(3, -s / 10)),
                z: 30 * hold,
                autoAlpha: last ? 1 : 1 - sm(0.86, 0.98, t),
                force3D: true,
              });
            }
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

          // ── THE OUTRO — the word rewrites itself while its image leaves ──
          const q = (p - 0.62) / 0.18;
          if (lastSub) gsap.set(lastSub, { autoAlpha: q > 0 ? 1 - sm(0, 0.22, q) : 1 });
          if (lastCta) gsap.set(lastCta, { autoAlpha: q > 0 ? 1 - sm(0, 0.22, q) : 1 });
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
                  const lockAt = 0.1 + 0.8 * (i / (MORPH_TARGET.length - 1));
                  if (q >= lockAt) return ch;
                  const g = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
                  return i === 0 ? g.toUpperCase() : g;
                })
                .join("");
            }
            if (out !== morphShown && (q > 0 && q < 1 ? true : out !== lastWord.textContent)) {
              lastWord.textContent = out;
              morphShown = q > 0 && q < 1 ? null : out;
            }
          }
          // the title takes its lines: hairlines draw OUT OF the word to
          // either side, plusses landing at the ends (scroll-driven)
          const lp = sm(0.83, 0.92, p);
          if (mLineL) gsap.set(mLineL, { scaleX: lp });
          if (mLineR) gsap.set(mLineR, { scaleX: lp });
          const pp = sm(0.89, 0.95, p);
          mPlus.forEach((el) => gsap.set(el, { autoAlpha: pp, scale: 0.4 + 0.6 * pp }));
        },
      });
      kills.push(() => drive.kill());

      return () => kills.forEach((k) => k());
    });

    return () => {
      io.disconnect();
      mm.revert();
    };
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
            {STAGES.map((s, i) => {
              const last = i === N - 1;
              return (
                <div
                  key={s.name}
                  className="proc-panel relative flex h-[80vh] items-center justify-center overflow-hidden md:h-full md:w-screen md:flex-none md:overflow-visible"
                  style={{ perspective: "900px" }}
                >
                  {/* the image clips inside its own holder, so the parked
                      words are free to hang past the frame edge un-clipped.
                      The LAST frame wears a right-edge fade — its trailing
                      edge dissolves into black as it scrolls out (George). */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    aria-hidden
                    style={
                      last
                        ? {
                            WebkitMaskImage: "linear-gradient(to right, black 62%, transparent 100%)",
                            maskImage: "linear-gradient(to right, black 62%, transparent 100%)",
                          }
                        : undefined
                    }
                  >
                    <div className="absolute inset-y-0 inset-x-[-9%]">
                      {/* LIVING frames (motion review: a film company's
                          process can't be frozen JPEGs — every held
                          composition contains playing film) */}
                      <video
                        src={s.img}
                        className="proc-media h-full w-full object-cover will-change-transform"
                        poster={s.img.replace("/videos/", "/videos/posters/").replace(".mp4", ".jpg")}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                    </div>
                  </div>

                  <div className={`proc-text relative z-10 px-6 text-center will-change-transform ${last ? "w-full max-w-none md:px-10" : "max-w-3xl"}`}>
                    {last ? (
                      /* the last word carries the TITLE ROW: after the morph,
                         hairlines + plusses draw out of it (TitleRule grammar) */
                      <div className="flex w-full items-center gap-4 md:gap-6">
                        <style>{`@keyframes pmSpin { to { transform: rotate(360deg); } } .pm-plus{ animation: pmSpin 26s linear infinite; } @media (prefers-reduced-motion: reduce){ .pm-plus{ animation: none; } }`}</style>
                        <span aria-hidden className="pm-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
                        <span aria-hidden className="pm-line-l block h-px flex-1 bg-[var(--fg)] will-change-transform" />
                        <h3 className="proc-word font-display shrink-0 text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">
                          {s.name}.
                        </h3>
                        <span aria-hidden className="pm-line-r block h-px flex-1 bg-[var(--fg)] will-change-transform" />
                        <span aria-hidden className="pm-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
                      </div>
                    ) : (
                      <h3 className="proc-word font-display text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">
                        {s.name}
                      </h3>
                    )}
                    <p className={`proc-sub about-body mx-auto mt-6 max-w-xl text-[14px] leading-relaxed text-[var(--fg)] md:text-[16px]`}>
                      {s.sub}
                    </p>
                    <p className="proc-cta mt-7">
                      <Link href={s.href} className="blink text-[13px] tracking-[0.05em]">
                        {s.cta}
                      </Link>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
