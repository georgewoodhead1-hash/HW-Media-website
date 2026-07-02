"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";

// Our process — ONE continuous film you scrub through (rebuild #3, blend-first).
// No boxes, no stack: the stage's film fills the screen edge to edge, one huge
// centred word over it, and a LIVE line drawing across the top of the page as
// you move 01 → 04. Scrolling crossfades stage into stage like a cut in an
// edit — the section reads as part of the site's film, not a diagram beside it.
// The last stage ("In motion.") carries the gold full stop the testimonials
// dot peels off.
interface Stage {
  n: string;
  name: string;
  copy: string;
  clip: string;
}

const STAGES: Stage[] = [
  {
    n: "01",
    name: "Pre-production",
    copy: "Brief, treatment, casting, locations, schedule — the film is planned to the minute before a frame is shot.",
    clip: "/videos/micro/m02.mp4",
  },
  {
    n: "02",
    name: "Production",
    copy: "Direction and cinematography on location. If it can be done in-camera, it's done in-camera.",
    clip: "/videos/micro/m07.mp4",
  },
  {
    n: "03",
    name: "Post-production",
    copy: "Edit, grade, sound and motion, all under one roof — the film finds its rhythm.",
    clip: "/videos/micro/m10.mp4",
  },
  {
    n: "04",
    name: "In motion",
    copy: "Aerial and motion design by the same crew, so nothing is lost in translation.",
    clip: "/videos/micro/m12.mp4",
  },
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sm = (a: number, b: number, t: number) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>(".ps-stage");
      const films = gsap.utils.toArray<HTMLVideoElement>(".ps-film");
      const line = el.querySelector<HTMLElement>(".ps-line");
      const counter = el.querySelector<HTMLElement>(".ps-count");
      const N = STAGES.length;

      gsap.set(stages, { autoAlpha: 0, y: 30 });
      gsap.set(films, { autoAlpha: 0 });

      let active = -1;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // the live line — draws across the page as you move through the stages
          if (line) gsap.set(line, { scaleX: p, transformOrigin: "left center" });
          // which stage owns this point of the scroll
          const f = Math.min(N - 1, Math.floor(p * N));
          const local = p * N - f; // 0..1 inside the stage
          stages.forEach((s, i) => {
            if (i !== f) { gsap.set(s, { autoAlpha: 0 }); return; }
            const inA = sm(0.0, 0.16, local);
            const outA = i === N - 1 ? 1 : 1 - sm(0.86, 1, local);
            gsap.set(s, { autoAlpha: Math.min(inA, outA), y: 30 * (1 - sm(0, 0.2, local)) });
          });
          films.forEach((v, i) => {
            const a = i === f ? 1 : i === f - 1 ? 1 - sm(0, 0.25, local) : 0;
            gsap.set(v, { autoAlpha: a });
          });
          // Division cut: dip through BLACK at every stage boundary, like a film edit
          const dip = el.querySelector(".ps-dip");
          if (dip) {
            const dEdge = Math.min(local, 1 - local);
            const black = f === 0 && local < 0.5 ? 0 : (1 - sm(0.02, 0.16, dEdge)) * 0.92;
            gsap.set(dip, { opacity: black });
          }
          if (f !== active) {
            active = f;
            if (counter) counter.textContent = STAGES[f].n;
            films.forEach((v, i) => { if (i === f) safePlay(v); else v.pause(); });
          }
        },
      });
      return () => st.kill();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="media"
      className="relative z-20 h-[420vh] text-[#f5f1e6]"
      aria-label="Our process"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#050505]">
        {/* the films — full bleed, one at a time, cutting like an edit */}
        {STAGES.map((s) => (
          <video
            key={s.n}
            className="ps-film absolute inset-0 h-full w-full object-cover"
            src={s.clip}
            poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ))}
        {/* the black frame every cut passes through */}
        <div aria-hidden className="ps-dip pointer-events-none absolute inset-0 bg-black opacity-0" />
        {/* one calm wash so the type always reads; the film still breathes */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-[#050505]" />

        {/* the DYNAMIC line — draws across the top of the page 01 → 04 */}
        <div className="absolute inset-x-0 top-0 px-5 pt-[12vh] md:px-10">
          <div className="relative h-px w-full bg-[#f5f1e6]/15">
            <span className="ps-line absolute inset-0 origin-left bg-[#f5f1e6]/80" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <h2 className="about-display text-[clamp(1.5rem,2.4vw,2.4rem)]">Our process</h2>
            <span className="ps-count about-display text-[clamp(1.5rem,2.4vw,2.4rem)] text-[#f5f1e6]/55">01</span>
          </div>
        </div>

        {/* the stages — everything centred on the page's axis */}
        <div className="relative flex h-full items-center justify-center px-5 text-center md:px-10">
          {STAGES.map((s, i) => (
            <div key={s.n} className="ps-stage absolute inset-x-0 mx-auto max-w-[1100px] px-5 will-change-transform">
              <h3 className="font-display text-[clamp(3.4rem,10vw,10rem)] leading-[0.9]">
                {s.name}
                {i === STAGES.length - 1 && <span className="wd-stop text-[var(--gold-text)]">.</span>}
              </h3>
              <p className="mx-auto mt-8 max-w-[46ch] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.55] text-[#f5f1e6]/85">
                {s.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
