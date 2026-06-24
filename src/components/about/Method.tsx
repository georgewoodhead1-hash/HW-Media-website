"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Scene — Method. The page PINS (sticky) while the five stages run big down the
// LEFT and a film PLAYS on the right, swapping to the active stage as you scroll
// through. No hover; the active stage advances with scroll. Only the active film
// decodes. Copy in Bar's value register.
interface Stage { key: string; body: string; film: string; poster: string; }

const STAGES: Stage[] = [
  { key: "Vision", body: "We start with the brand and the story it already has, and find the idea worth filming before a camera comes out.", film: "/videos/films/mclaren-w.mp4", poster: "/videos/films/posters/mclaren-w.jpg" },
  { key: "Strategy", body: "Treatment, structure, shot design. The film is written down before the shoot, so the day is spent making it, not deciding it.", film: "/videos/films/salomon-w.mp4", poster: "/videos/films/posters/salomon-w.jpg" },
  { key: "Creation", body: "We come to the brand and film on location, with the people who make the work. One director on the camera, start to finish.", film: "/videos/films/zuma-w.mp4", poster: "/videos/films/posters/zuma-w.jpg" },
  { key: "Refinement", body: "The edit and the grade, worked until the cut feels effortless and every frame is doing a job.", film: "/videos/films/nike-w.mp4", poster: "/videos/films/posters/nike-w.jpg" },
  { key: "Impact", body: "The master and the cutdowns each channel actually needs, so the film keeps working long after the shoot.", film: "/videos/films/hera-w.mp4", poster: "/videos/films/posters/hera-w.jpg" },
];

export default function Method() {
  const root = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setActive(0); return; }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setActive(Math.min(STAGES.length - 1, Math.max(0, Math.floor(self.progress * STAGES.length)))),
      });
      gsap.from("[data-m-row]", { autoAlpha: 0, x: -28, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: el, start: "top 70%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="ch-method" className="relative" style={{ minHeight: "230vh" }}>
      <div className="sticky top-0 flex h-screen items-center px-5 md:px-10">
        <div className="grid w-full items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <ul className="border-b border-[var(--hairline-dark)]">
            {STAGES.map((s, i) => {
              const on = active === i;
              return (
                <li key={s.key} data-m-row className="hww-row border-t border-[var(--hairline-dark)]" data-on={on}>
                  <div className="px-3 py-4 md:px-5 md:py-5">
                    <div className="flex items-baseline gap-4 md:gap-6">
                      <span className={`about-label shrink-0 transition-colors duration-500 ${on ? "text-[var(--black)]/65" : "text-[var(--gold-text)]"}`}>0{i + 1}</span>
                      <span className={`about-display transition-colors duration-500 ${on ? "text-[var(--black)]" : "text-[#f5f1e6]"}`} style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)" }}>{s.key}</span>
                    </div>
                    <div className="overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: on ? 200 : 0, opacity: on ? 1 : 0 }}>
                      <p className={`mt-2 max-w-md text-[clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed transition-colors duration-500 md:ml-12 ${on ? "text-[var(--black)]/80" : "text-[#f5f1e6]/65"}`}>{s.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div data-cursor="Play" className="relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1 ring-[var(--hairline-dark)] md:ml-auto md:max-w-[440px]">
            {STAGES.map((s, i) => (
              <video
                key={s.key}
                ref={(el) => { videoRefs.current[i] = el; }}
                src={s.film}
                poster={s.poster}
                muted
                loop
                playsInline
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
