"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Testimonials from "@/components/home/Testimonials";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// 04 — OUR PROCESS, v13 (George, 2026-07-14 round 2): SIMPLE AGAIN.
// The morph is BINNED — Deliver behaves exactly like Edit and Production:
// rides across the whole page, parks at the centre, hands back, exits
// left. When the strip has gone the screen is black and the TESTIMONIALS
// LOAD UP ON IT — title with the dynamic outward line-draw + plusses,
// quote writing itself, film opening centre-out — vertically centred,
// inside this same sticky screen (hw:tst events, reversible). The
// right-edge fade mask is gone (it read as a black bar while Deliver was
// parked). Words park at screen centre; the image carries the motion.
//
// HAND-OFF: frame 1 plays the SAME film as the featured tile that closes
// the Featured Projects exit (hera) — the sections match-cut.
//
// Runway scrub p: 0–TRAVEL_END strip travel (full −100%); ≥TST_IN
// testimonials in (out <TST_OUT). Sticky, not pin. Mobile: vertical stack.

interface Stage {
  name: string;
  sub: string;
  cta: string;
  href: string;
  img: string;
  poster?: string;
}

const STAGES: Stage[] = [
  {
    name: "Pre-production",
    sub: "Brief, treatment, casting, locations, schedule. The film is planned to the minute before a frame is shot.",
    cta: "Start a project", href: "/contact",
    // the match-cut film — same footage the Featured exit closes on
    img: "/videos/films/hera-w.mp4", poster: "/videos/films/posters/hera-w.jpg",
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
// ROUND-8/9 hand-off + curtain. The section is pulled up 100vh under the
// Featured pin (md:-mt-[100vh]); the first 100vh is a DEAD ZONE (the strip
// holds still while Featured's exit still owns the screen). ROUND-9: runway
// shortened 740→560vh (George: the hold "only lets go after a while").
const RUNWAY_VH = 480;
// ROUND-10.1: the covered overlap (dead scroll) drops 100→40vh so there's
// far less nothing-happening scroll between the square filling the screen
// and Pre-production writing in (George: "it fills the screen and then it
// takes a lot to get there").
const OVERLAP_VH = 40;
const DEAD = OVERLAP_VH / RUNWAY_VH;
// travel completes at TRAVEL_END (Deliver fully off-screen left = the
// curtain fully pulled). Deliver reaches CENTRE at travel 0.75 → p' 0.66.
const TRAVEL_END = 0.88;
// ROUND-9 CURTAIN: the testimonials sit BEHIND the strip and compose while
// the Deliver frame still covers the centre (fires a touch before Deliver
// fully centres), then the last of the travel pulls Deliver off like a
// curtain to reveal them — no more "both animating at once".
const TST_IN = 0.6;
const TST_OUT = 0.55;

const sm = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = Array.from(root.querySelectorAll<HTMLVideoElement>(".proc-media"));
    // ROUND-8 audit fix: warm the videos WELL before the section is on
    // screen. The hand-off frame (panel 0 = the match-cut film) was paused
    // off-screen and only got play() at the seam, so it painted black for a
    // beat before decoding. A big top/bottom margin means frame 1 is already
    // decoded and playing by the time the Featured pin hands over — no gap.
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) media.forEach((v) => safePlay(v));
        else media.forEach((v) => v.pause());
      }),
      { rootMargin: "1600px 0px" },
    );
    io.observe(root);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];
      const runway = root.querySelector<HTMLElement>(".proc-runway");
      const track = root.querySelector<HTMLElement>(".proc-track");
      const panels = gsap.utils.toArray<HTMLElement>(".proc-panel", root);
      if (!runway || !track || panels.length !== N) return;

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

      // ROUND-9: Pre-production must WRITE ITSELF IN after the hand-off, not
      // appear pre-built (George). The old `first` trigger fired during the
      // covered overlap, so the word was already done when revealed. It's
      // now driven from the scrub below — it plays only once the dead zone
      // ends and the strip is live in front of you.

      const texts = panels.map((p) => p.querySelector<HTMLElement>(".proc-text"));
      const imgs = panels.map((p) => p.querySelector<HTMLElement>(".proc-media"));
      let tstShown = false;

      const drive = ScrollTrigger.create({
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // dead-zone remap: p stays 0 through the covered overlap
          const p = Math.max(0, (self.progress - DEAD) / (1 - DEAD));
          const travel = Math.min(1, p / TRAVEL_END);
          gsap.set(track, { xPercent: -100 * travel, force3D: true });

          const vw = window.innerWidth / 100;
          panels.forEach((panel, i) => {
            const c = i * 100 - 400 * travel;
            const t = Math.min(1, Math.max(0, (100 - c) / 200));
            const text = texts[i];
            const img = imgs[i];
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
            // ROUND-10: frame 1 (i=0) does NOT zoom — it sits at scale 1 to
            // match the grown hera clone (seamless click, no zoom). The rest
            // keep the parallax drift.
            if (img) {
              if (i === 0) gsap.set(img, { xPercent: 0, scale: 1, force3D: true });
              else gsap.set(img, { xPercent: -8 + 16 * t, scale: 1.1 - 0.1 * t, force3D: true });
            }
            const tl = builds[i];
            if (i === 0) {
              // Pre-production writes in the MOMENT the (now short) dead zone
              // ends — George: "as soon as it gets to all four corners,
              // Pre-production should be loading in already"
              if (p > 0.002) {
                if (tl.reversed() || (!tl.isActive() && tl.progress() === 0)) tl.play();
              } else if (p < 0.002) {
                if (!tl.reversed() && (tl.isActive() || tl.progress() > 0)) tl.reverse();
              }
            } else {
              if (t > 0.3) {
                if (tl.reversed() || (!tl.isActive() && tl.progress() === 0)) tl.play();
              } else if (t < 0.24) {
                if (!tl.reversed() && (tl.isActive() || tl.progress() > 0)) tl.reverse();
              }
            }
          });

          // the testimony loads on the black once the strip has gone —
          // then HOLDS (~170vh of runway left after the reveal, George)
          if (p >= TST_IN && !tstShown) {
            tstShown = true;
            window.dispatchEvent(new CustomEvent("hw:tst", { detail: "in" }));
          } else if (p < TST_OUT && tstShown) {
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
      className="relative z-[20] bg-[var(--bg)] text-[var(--fg)] md:-mt-[40vh]"
      aria-label="Our process and testimonials"
    >
      {/* the "Our Process" banner is GONE (ROUND-7: "getting in the way") —
          the strip pins UNDER the Featured exit (the -mt overlap): frame 1
          is already on screen when Featured stops painting. The match-cut. */}

      {/* THE STRIP — four frames conjoined side by side. Mobile: vertical.
          ROUND-10 runway 560→480vh (George: takes ages to scroll off). */}
      <div className="proc-runway relative md:h-[480vh]">
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          {/* the track rides ABOVE the testimonials (z-20) so the Deliver
              frame is the CURTAIN that pulls back to reveal them */}
          <div className="proc-track md:relative md:z-20 md:flex md:h-screen md:w-[400vw] md:will-change-transform">
            {STAGES.map((s, i) => (
              <div
                key={s.name}
                // ROUND-10 CURTAIN: Deliver (the last frame) feathers its
                // RIGHT edge to transparent so, as it pulls back over the
                // testimonials behind it, they're revealed through a soft
                // dark gradient instead of a hard film cut (George).
                className="proc-panel relative flex h-[80vh] items-center justify-center overflow-hidden md:h-full md:w-screen md:flex-none md:overflow-visible"
                style={
                  i === N - 1
                    ? {
                        perspective: "900px",
                        WebkitMaskImage: "linear-gradient(to right, #000 62%, transparent 100%)",
                        maskImage: "linear-gradient(to right, #000 62%, transparent 100%)",
                      }
                    : { perspective: "900px" }
                }
              >
                {/* ROUND-10: frame 1 sits FULL-BLEED (inset-0, no parallax
                    inset) so it matches the grown hera clone exactly — the
                    click into Our Process is seamless, no zoom (George) */}
                <div className="absolute inset-0 overflow-hidden" aria-hidden>
                  <div className={i === 0 ? "absolute inset-0" : "absolute inset-y-0 inset-x-[-9%]"}>
                    <video
                      src={s.img}
                      className="proc-media h-full w-full object-cover will-change-transform"
                      poster={s.poster ?? s.img.replace("/videos/", "/videos/posters/").replace(".mp4", ".jpg")}
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
              </div>
            ))}
          </div>

          {/* THE TESTIMONY — ROUND-9: it sits BEHIND the strip (z-0) and
              composes while the Deliver frame still covers it; the last of
              the travel pulls Deliver off like a curtain to reveal it. On
              mobile these wrappers are plain flow after the stacked panels. */}
          <div className="md:pointer-events-none md:absolute md:inset-0 md:z-0 md:flex md:items-center">
            <div className="w-full md:pointer-events-auto">
              <Testimonials embedded />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
