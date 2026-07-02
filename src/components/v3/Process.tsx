"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// V3 §5 — THE PROCESS. Four numbered stages, each one PINNED for 180vh: the
// stage film holds near-frozen on screen (~0.04x scroll speed, drifting only
// a few percent) while the title block rides over it at ~0.35x — the Exo Ape
// speed-split applied to the pipeline. Every stage gets a counter, a drawn
// hairline and one quiet line of copy. The melt gradient sits on the stage
// viewport itself (not the moving film) so stages hand over on pure canvas —
// no hard cuts (r1 fix: gradients that rode the translated film left seams).

interface Stage {
  n: string;
  name: string;
  copy: string;
  clip: string;
  last?: boolean;
}

const STAGES: Stage[] = [
  {
    n: "01",
    name: "Pre-production",
    copy: "Treatments, boards, casting and permits — locked before a single frame rolls.",
    clip: "/videos/micro/m02.mp4",
  },
  {
    n: "02",
    name: "Production",
    copy: "Directors, drone pilots and camera crews on set, anywhere in the world.",
    clip: "/videos/micro/m07.mp4",
  },
  {
    n: "03",
    name: "Post-production",
    copy: "Edit, grade, sound and finish — all of it under one roof.",
    clip: "/videos/micro/m10.mp4",
  },
  {
    n: "04",
    name: "In motion",
    copy: "Delivered in every cut, crop and format your channels need.",
    clip: "/videos/micro/m12.mp4",
    last: true,
  },
];

const MEDIA_DRIFT = 3; // yPercent each way — near-frozen on screen (~0.04x)
const TITLE_RIDE = "14vh"; // each way — ~0.35x scroll across the 80vh pin span

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".v3p-introline", {
        autoAlpha: 0,
        y: 22,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".v3p-intro", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(".v3p-stage").forEach((stage) => {
        const vid = stage.querySelector(".v3p-vid");
        const title = stage.querySelector(".v3p-title");
        const rule = stage.querySelector(".v3p-rule");
        // Speed-split inside the pin: film barely moves, title rides over it.
        const pin = { trigger: stage, start: "top top", end: "bottom bottom", scrub: true } as const;
        if (vid) gsap.fromTo(vid, { yPercent: MEDIA_DRIFT }, { yPercent: -MEDIA_DRIFT, ease: "none", scrollTrigger: { ...pin } });
        if (title) gsap.fromTo(title, { y: TITLE_RIDE }, { y: `-${TITLE_RIDE}`, ease: "none", scrollTrigger: { ...pin } });
        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: stage, start: "top 45%" },
          });
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="How we work">
      {/* intro rail */}
      <div className="v3p-intro px-5 pb-[8vh] pt-[6vh] md:px-10">
        <p
          className="v3p-introline text-[11px] uppercase tracking-[0.32em] text-[#c3c3c3]/55"
          style={{ fontFamily: "var(--font-firma), sans-serif" }}
        >
          How we work
        </p>
        <p className="v3p-introline mt-5 max-w-[420px] text-[15px] leading-[1.7] text-[#c3c3c3]/80">
          One team carries every film from first call to final delivery. Four stages, no hand-offs, no agencies in
          between.
        </p>
      </div>

      {STAGES.map((s) => (
        <div key={s.n} className="v3p-stage relative h-[130vh] md:h-[180vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="v3p-vid absolute inset-x-0 top-[-4%] h-[108%] will-change-transform">
              <video
                className="h-full w-full object-cover opacity-60"
                src={s.clip}
                poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden
              />
            </div>
            {/* melt gradient pinned to the stage viewport — edges always canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0) 30%, rgba(5,5,5,0) 70%, #050505 100%)" }}
            />
            <div className="relative flex h-full items-center px-5 md:px-10">
              <div className="v3p-title will-change-transform">
                <span
                  className="text-[13px] tracking-[0.24em] text-[#c3c3c3]/70"
                  style={{ fontFamily: "var(--font-firma), sans-serif" }}
                >
                  {s.n} / 04
                </span>
                <div aria-hidden className="v3p-rule mt-4 h-px w-[min(420px,58vw)] origin-left bg-[#f5f1e6]/25" />
                <h3 className="font-display mt-5 text-[clamp(2.8rem,8vw,8rem)] leading-[0.9] text-[#f5f1e6]">
                  {s.name}
                  {s.last && <span className="text-[var(--gold-text)]">.</span>}
                </h3>
                <p className="mt-5 max-w-[380px] text-[14px] leading-[1.7] text-[#c3c3c3]/80">{s.copy}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
