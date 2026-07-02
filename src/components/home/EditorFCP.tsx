"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { safePlay } from "@/lib/video";
import Rule from "@/components/shell/Rule";

// Our process — STACKING PANELS (1820 services treatment, George's pick).
// Four full-screen panels, each sticky at the top of the viewport, so every
// next stage slides UP AND OVER the one before it — real layers, not a flat
// list. As a panel is covered it scales back and dims (depth). Each panel:
// number, huge condensed title, copy, and the stage's film. The last panel
// ("In motion.") carries the gold full stop the testimonials dot peels off.
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
    copy: "Brief, treatment, casting, locations and schedule. We map the whole shoot before a single frame is captured, so the day runs like clockwork and the idea survives contact with the real world.",
    clip: "/videos/micro/m02.mp4",
  },
  {
    n: "02",
    name: "Production",
    copy: "Direction and cinematography on location. A tight crew, the right kit, and a director behind the camera rather than watching a monitor. Wherever it can be done in-camera, we do it in-camera.",
    clip: "/videos/micro/m07.mp4",
  },
  {
    n: "03",
    name: "Post-production",
    copy: "Edit, grade, sound and motion, all under one roof. Where the film finds its rhythm: cut with intent, coloured with care, finished to a master plus every cutdown your channels need.",
    clip: "/videos/micro/m10.mp4",
  },
  {
    n: "04",
    name: "In motion",
    copy: "Aerial, timelapse and the moving-image extras that lift a film. CAA-authorised drone work and motion design, handled by the same crew, so nothing is outsourced and nothing is lost in translation.",
    clip: "/videos/micro/m12.mp4",
  },
];

// tone ladder — each layer a step lighter, so the stack reads as 3D depth
const TONES = ["#060606", "#0a0a09", "#0e0d0c", "#121110"];

export default function EditorFCP() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".proc-panel");

      // DEPTH — as the next panel slides over, the one beneath scales back + dims
      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next) return;
        gsap.fromTo(
          panel.querySelector(".proc-inner"),
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.94,
            filter: "brightness(0.45)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: 0.4 },
          },
        );
      });

      // each panel's content rises as the panel arrives
      panels.forEach((panel) => {
        gsap.from(panel.querySelectorAll(".proc-rise"), {
          autoAlpha: 0,
          y: 46,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: panel, start: "top 62%" },
        });
      });

      ScrollTrigger.refresh();
    }, el);

    // stage films play only while on screen
    const vids = el.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) safePlay(v); else v.pause();
      }),
      { rootMargin: "15% 0px" },
    );
    vids.forEach((v) => io.observe(v));

    return () => {
      ctx.revert();
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="process"
      data-theme="dark"
      data-surface="media"
      className="relative z-20 text-[var(--fg)]"
      aria-label="Our process"
    >
      {/* header — one drawn line, one big statement, air around it */}
      <div className="bg-[#050505] px-5 pb-[8vh] pt-[10vh] md:px-10">
        <Rule />
        <h2 className="font-display mt-10 max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)] leading-[0.9]">
          Idea to master, in-house.
        </h2>
      </div>

      {/* the stack — each stage slides up OVER the previous (sticky layers) */}
      <div className="relative">
        {STAGES.map((s, i) => (
          <article
            key={s.n}
            className="proc-panel sticky top-0 h-screen overflow-hidden"
            style={{ zIndex: i + 1 }}
          >
            <div
              className="proc-inner flex h-full w-full origin-top flex-col justify-between rounded-t-[2rem] px-5 pb-[6vh] pt-[7vh] shadow-[0_-24px_60px_rgba(0,0,0,0.6)] will-change-transform md:px-10"
              style={{ backgroundColor: TONES[i] }}
            >
              <div className="grid flex-1 grid-cols-1 items-center gap-8 md:grid-cols-[1.35fr_1fr] md:gap-14">
                {/* LEFT — number + huge condensed title + copy */}
                <div>
                  <span className="proc-rise block text-[clamp(0.95rem,1.2vw,1.15rem)] text-[var(--fg)]/45" style={{ fontFamily: "var(--font-firma), sans-serif" }}>
                    {s.n} / 04
                  </span>
                  <h3 className="proc-rise font-display mt-5 text-[clamp(3.2rem,8.5vw,8.5rem)] leading-[0.88]">
                    {s.name}
                    {i === STAGES.length - 1 && <span className="wd-stop text-[var(--gold-text)]">.</span>}
                  </h3>
                  <p className="proc-rise mt-8 max-w-[46ch] text-[clamp(1.05rem,1.4vw,1.3rem)] leading-[1.55] text-[var(--fg)]/75">
                    {s.copy}
                  </p>
                </div>

                {/* RIGHT — the stage's film, a tall layer of its own */}
                <div className="proc-rise relative hidden aspect-[3/4] max-h-[62vh] w-full overflow-hidden rounded-xl md:block">
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    src={s.clip}
                    poster={s.clip.replace("micro/", "micro/posters/").replace(".mp4", ".jpg")}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
