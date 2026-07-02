"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// V3 §1 — THE OPEN.
// Unseen's two-beat entrance (black beat → tiny centred line → the reel fades
// up beneath it) handed to Exo Ape's measured speed-split: over a 200vh pin the
// reel drifts at ~0.10x scroll speed while the headline rides over it at
// ~0.37x — the ~3.5:1 text:media ratio probed live on exoape.com
// (parallax-probe.json: image 0.12, text 0.37). The last quarter of the pin
// dims the reel back into the canvas so §2 opens on black, not on a cut.

const MEDIA_RATIO = 0.1; // reel screen-speed vs scroll
const TEXT_RATIO = 0.37; // headline screen-speed vs scroll (exoape-measured)
const PARA_RATIO = 0.46; // small copy rides slightly faster (exoape 0.49)

export default function Open() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const span = () => el.offsetHeight - window.innerHeight;

      // ---- Entrance choreography (time-based, plays once) ----
      // Beat 1: black. Beat 2: tiny line alone at centre. Beat 3: the reel
      // fades up as the line rises to its resting slot; headline mask-rises.
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .set(".v3o-vid", { autoAlpha: 0, scale: 1.06 })
        .set(".v3o-intro", { y: "34vh", autoAlpha: 0 })
        .set(".v3o-headline-line", { yPercent: 112 })
        .set([".v3o-para", ".v3o-cue"], { autoAlpha: 0 })
        .to(".v3o-intro", { autoAlpha: 1, duration: 0.9 }, 0.45)
        .to(".v3o-intro", { y: 0, duration: 1.1, ease: "expo.inOut" }, 1.7)
        .to(".v3o-vid", { autoAlpha: 1, scale: 1, duration: 2.0, ease: "power2.inOut" }, 1.9)
        .to(".v3o-headline-line", { yPercent: 0, duration: 1.2, stagger: 0.14, ease: "expo.out" }, 2.5)
        .to(".v3o-para", { autoAlpha: 1, y: 0, duration: 1.0 }, 3.3)
        .to(".v3o-cue", { autoAlpha: 1, duration: 0.8 }, 3.5);

      // Scroll cue: quiet vertical hairline pulse.
      gsap.fromTo(
        ".v3o-cueline",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.4, ease: "power2.inOut", repeat: -1, yoyo: true },
      );

      // ---- Speed-split ride (scrubbed over the whole pin) ----
      const ride = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
        defaults: { ease: "none" },
      });
      ride
        .fromTo(".v3o-vid", { y: 0 }, { y: () => -MEDIA_RATIO * span(), duration: 1 }, 0)
        .fromTo(".v3o-head", { y: 0 }, { y: () => -TEXT_RATIO * span(), duration: 1 }, 0)
        .fromTo(".v3o-para", { y: 0 }, { y: () => -PARA_RATIO * span(), duration: 1 }, 0)
        .to(".v3o-intro", { autoAlpha: 0, duration: 0.16 }, 0.02)
        .to(".v3o-cue", { autoAlpha: 0, duration: 0.08 }, 0.01)
        // final beat: the reel dims back into the canvas — no hard cut into §2
        .to(".v3o-dim", { autoAlpha: 1, duration: 0.15 }, 0.85)
        .to(".v3o-vid", { autoAlpha: 0.35, duration: 0.15 }, 0.85);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[230vh] md:h-[280vh]" aria-label="HW Media — break the ordinary">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        {/* reel — slow plane */}
        <div className="v3o-vid absolute inset-x-0 top-[-8%] h-[116%] will-change-transform">
          <video
            className="h-full w-full object-cover"
            src="/videos/showreel-full.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-[#050505]" />
        </div>

        {/* end-of-pin dim into canvas */}
        <div aria-hidden className="v3o-dim pointer-events-none absolute inset-0 bg-[#050505] opacity-0" />

        {/* tiny centred line — the Unseen beat */}
        <p
          className="v3o-intro absolute inset-x-0 top-[12vh] text-center text-[11px] uppercase tracking-[0.32em] text-[#c3c3c3]/60"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          HW Media — Film &amp; motion, London
        </p>

        {/* headline — fast plane, masked line reveals */}
        <div className="absolute inset-0 flex items-center px-5 md:px-10">
          <h1 className="v3o-head font-display text-[clamp(3.2rem,10.5vw,10.5rem)] leading-[0.9] text-[#c3c3c3] will-change-transform">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="v3o-headline-line block">Break the</span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="v3o-headline-line block">
                ordinary<span className="text-[var(--gold-text)]">.</span>
              </span>
            </span>
          </h1>
        </div>

        {/* small copy — fastest plane, Exo Ape lower-left */}
        <p className="v3o-para absolute bottom-[10vh] left-5 max-w-[340px] text-[15px] leading-[1.7] text-[#c3c3c3]/85 will-change-transform md:left-10">
          Commercials, brand films and aerial cinema — shot, cut and finished in-house. We make work people choose to
          watch.
        </p>

        {/* scroll cue */}
        <div className="v3o-cue absolute bottom-[10vh] right-5 hidden flex-col items-center gap-3 md:flex md:right-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#c3c3c3]/55" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
            Scroll
          </span>
          <span aria-hidden className="v3o-cueline block h-9 w-px bg-[#c3c3c3]/40" />
        </div>
      </div>
    </section>
  );
}
