"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import TitleRule from "@/components/shell/TitleRule";
import Testimonials from "@/components/home/Testimonials";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// 04 — OUR PROCESS, v11 (George, 2026-07-14): Deliver is a FULL citizen of
// the strip — it rides across the whole page and parks at the centre
// exactly like Edit and Production. The morph to "Testimonials" only
// begins once Deliver's film is visibly moving out to the left, and the
// rewrite itself is QUICK. The title (word + hairlines + plusses) lives in
// a FIXED screen-space layer — it physically cannot drift sideways. After
// the lines draw, the title glides up into the top third and the
// TESTIMONIAL CONTENT BUILDS IN PLACE beneath it, inside this same sticky
// screen: the quote writes itself, the film opens centre-out. Nothing
// scrolls up from the bottom; there is no gap. The composed screen then
// scrolls away as one.
//
// Timeline over the runway scrub p:
//   0.00–0.92  strip travel (full −100%; ~115vh of scroll per frame)
//   0.72–0.80  the word rewrites (Deliver's frame is exiting under it)
//   0.80–0.86  hairlines + plusses draw out of the word
//   0.87–0.93  title glides up to the top third
//   ≥0.90      testimonial content writes in (hw:tst events, reversible)
//
// Sticky, not pin (transformed-ancestor gotcha). Mobile keeps the plain
// vertical stack with Testimonials in normal flow below it.

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
const TRAVEL_END = 0.92;
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
      const fixed = root.querySelector<HTMLElement>(".proc-fixed");
      if (!runway || !track || panels.length !== N || !fixed) return;

      // word-builds: frames 1–3 live in their panels; Deliver's text lives
      // in the fixed screen-space layer
      const partsFor = (i: number) => {
        const scope = i === N - 1 ? fixed : panels[i];
        return {
          word: scope.querySelector<HTMLElement>(".proc-word"),
          sub: scope.querySelector<HTMLElement>(".proc-sub"),
          cta: scope.querySelector<HTMLElement>(".proc-cta"),
        };
      };
      const builds = STAGES.map((_, i) => {
        const { word, sub, cta } = partsFor(i);
        gsap.set(word, { clipPath: "inset(0% 100% 0% 0%)", x: 30 });
        gsap.set([sub, cta], { autoAlpha: 0, x: 18 });
        const tl = gsap.timeline({ paused: true });
        tl.to(word, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 0.75, ease: "power2.out" }, 0)
          .to(sub, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" }, 0.3)
          .to(cta, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.5);
        kills.push(() => tl.kill());
        return tl;
      });

      const first = ScrollTrigger.create({
        trigger: runway,
        start: "top 72%",
        onEnter: () => builds[0].play(),
        onLeaveBack: () => builds[0].reverse(),
      });
      kills.push(() => first.kill());

      const texts = panels.map((p, i) => (i === N - 1 ? null : p.querySelector<HTMLElement>(".proc-text")));
      const imgs = panels.map((p) => p.querySelector<HTMLElement>(".proc-media"));
      const lastWord = fixed.querySelector<HTMLElement>(".proc-word");
      const lastSub = fixed.querySelector<HTMLElement>(".proc-sub");
      const lastCta = fixed.querySelector<HTMLElement>(".proc-cta");
      const mLineL = fixed.querySelector<HTMLElement>(".pm-line-l");
      const mLineR = fixed.querySelector<HTMLElement>(".pm-line-r");
      const mPlus = fixed.querySelectorAll<HTMLElement>(".pm-plus");
      gsap.set(mLineL, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(mLineR, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(mPlus, { autoAlpha: 0, scale: 0.4 });
      let morphShown: string | null = null;
      let tstShown = false;

      const drive = ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const travel = Math.min(1, p / TRAVEL_END);
          gsap.set(track, { xPercent: -100 * travel, force3D: true });

          const vw = window.innerWidth / 100;
          panels.forEach((panel, i) => {
            const last = i === N - 1;
            const c = i * 100 - 400 * travel;
            const t = Math.min(1, Math.max(0, (100 - c) / 200));
            const img = imgs[i];
            if (img) gsap.set(img, { xPercent: -8 + 16 * t, scale: 1.1 - 0.1 * t, force3D: true });

            if (!last) {
              const text = texts[i];
              if (text) {
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
            } else {
              // Deliver's text is SCREEN-SPACE: it rides in with its frame
              // then parks dead-centre; s is its true screen offset, so a
              // parked word sits at exactly 0 — no drift possible
              const hold = sm(0.2, 0.38, t);
              const s = c * (1 - hold);
              gsap.set(fixed, { x: s * vw, force3D: true });
            }
            if (i > 0) {
              const tl = builds[i];
              if (t > 0.3) {
                if (tl.reversed() || (!tl.isActive() && tl.progress() === 0)) tl.play();
              } else if (t < 0.24) {
                if (!tl.reversed() && (tl.isActive() || tl.progress() > 0)) tl.reverse();
              }
            }
          });

          // ── the outro, quick and late (George: Deliver stays; the
          // rewrite only starts once its film is moving out, then it's fast)
          const q = (p - 0.72) / 0.08;
          if (lastSub) gsap.set(lastSub, { autoAlpha: q > 0 ? 1 - sm(0, 0.3, q) : 1 });
          if (lastCta) gsap.set(lastCta, { autoAlpha: q > 0 ? 1 - sm(0, 0.3, q) : 1 });
          if (lastWord) {
            let out: string;
            if (q <= 0) out = "Deliver.";
            else if (q >= 1) out = MORPH_TARGET;
            else {
              out = MORPH_TARGET.split("")
                .map((ch, i) => {
                  const lockAt = 0.08 + 0.82 * (i / (MORPH_TARGET.length - 1));
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
          // hairlines + plusses out of the word
          const lp = sm(0.8, 0.86, p);
          if (mLineL) gsap.set(mLineL, { scaleX: lp });
          if (mLineR) gsap.set(mLineR, { scaleX: lp });
          const pp = sm(0.84, 0.88, p);
          mPlus.forEach((el) => gsap.set(el, { autoAlpha: pp, scale: 0.4 + 0.6 * pp }));

          // the title glides up into the top third…
          gsap.set(fixed, { y: -18 * sm(0.87, 0.93, p) + "vh" });

          // …and the testimony writes itself in beneath it
          if (p >= 0.9 && !tstShown) {
            tstShown = true;
            window.dispatchEvent(new CustomEvent("hw:tst", { detail: "in" }));
          } else if (p < 0.875 && tstShown) {
            tstShown = false;
            window.dispatchEvent(new CustomEvent("hw:tst", { detail: "out" }));
          }
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
      aria-label="Our process and testimonials"
    >
      {/* centred title, dynamic lines drawing out either side of the words */}
      <div className="px-5 pt-[4vh] md:px-10">
        <TitleRule title="Our Process" className="mb-[5vh]" />
      </div>

      {/* THE STRIP — four frames conjoined side by side. Mobile: vertical. */}
      <div className="proc-runway relative md:h-[600vh]">
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

                  {last ? (
                    /* mobile-only static block; on md+ Deliver's text lives
                       in the fixed screen-space layer below */
                    <div className="relative z-10 max-w-3xl px-6 text-center md:hidden">
                      <h3 className="font-display text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">{s.name}.</h3>
                      <p className="about-body mx-auto mt-6 max-w-xl text-[14px] leading-relaxed text-[var(--fg)]">{s.sub}</p>
                      <p className="mt-7">
                        <Link href={s.href} className="blink text-[13px] tracking-[0.05em]">{s.cta}</Link>
                      </p>
                    </div>
                  ) : (
                    <div className="proc-text relative z-10 max-w-3xl px-6 text-center will-change-transform">
                      <h3 className="proc-word font-display text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">
                        {s.name}
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
                  )}
                </div>
              );
            })}
          </div>

          {/* THE FIXED STAGE (md+) — Deliver's word/title + the testimony,
              in screen space above the track. The title row spans the full
              viewport; it cannot drift with the exiting frame. */}
          <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
            <div className="proc-fixed absolute inset-0 flex flex-col items-center justify-center will-change-transform">
              <div className="flex w-full items-center gap-4 px-5 md:gap-6 md:px-10">
                <style>{`@keyframes pmSpin { to { transform: rotate(360deg); } } .pm-plus{ animation: pmSpin 26s linear infinite; } @media (prefers-reduced-motion: reduce){ .pm-plus{ animation: none; } }`}</style>
                <span aria-hidden className="pm-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
                <span aria-hidden className="pm-line-l block h-px flex-1 bg-[var(--fg)] will-change-transform" />
                <h3 className="proc-word font-display shrink-0 text-center text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">
                  Deliver.
                </h3>
                <span aria-hidden className="pm-line-r block h-px flex-1 bg-[var(--fg)] will-change-transform" />
                <span aria-hidden className="pm-plus shrink-0 text-[19px] leading-none text-[var(--fg)]" style={{ fontFamily: "var(--font-firma), sans-serif" }}>+</span>
              </div>
              <p className="proc-sub about-body mx-auto mt-6 max-w-xl px-6 text-center text-[14px] leading-relaxed text-[var(--fg)] md:text-[16px]">
                {STAGES[N - 1].sub}
              </p>
              <p className="proc-cta mt-7">
                <Link href={STAGES[N - 1].href} className="blink pointer-events-auto text-[13px] tracking-[0.05em]">
                  {STAGES[N - 1].cta}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* the testimony — INSIDE the sticky screen on md+ (revealed by the
          scrub under the risen title); plain flow on mobile */}
      <div className="md:pointer-events-none md:absolute md:inset-0">
        <div className="md:sticky md:top-0 md:h-screen">
          <div className="md:pointer-events-auto md:absolute md:inset-x-0 md:top-[30%]">
            <Testimonials embedded />
          </div>
        </div>
      </div>
    </section>
  );
}
