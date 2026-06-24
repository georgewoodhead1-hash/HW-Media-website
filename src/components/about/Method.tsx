"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Task 6 — How we work, smooth (de-clunked). Five stages; the active one is the
// one nearest centre as you scroll the list (one ScrollTrigger, no sticky pin).
// The gold fill + text-flip transition smoothly via CSS. No film panel.
interface Stage { key: string; body: string; }

const STAGES: Stage[] = [
  { key: "Vision", body: "We start with the brand and the story it already has, and find the idea worth filming before a camera comes out." },
  { key: "Strategy", body: "Treatment, structure, shot design. The film is written down before the shoot, so the day is spent making it, not deciding it." },
  { key: "Creation", body: "We come to the brand and film on location, with the people who make the work. One director on the camera, start to finish." },
  { key: "Refinement", body: "The edit and the grade, worked until the cut feels effortless and every frame is doing a job." },
  { key: "Impact", body: "The master and the cutdowns each channel actually needs, so the film keeps working long after the shoot." },
];

export default function Method() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setActive(0); return; }
    const ctx = gsap.context(() => {
      const list = el.querySelector<HTMLElement>("[data-list]");
      if (list) {
        ScrollTrigger.create({
          trigger: list,
          start: "top 68%",
          end: "bottom 42%",
          onUpdate: (self) => setActive(Math.min(STAGES.length - 1, Math.max(0, Math.floor(self.progress * STAGES.length)))),
        });
      }
      gsap.from("[data-m-head]", { yPercent: 55, autoAlpha: 0, ease: "power3.out", duration: 1, scrollTrigger: { trigger: "[data-m-head]", start: "top 85%", once: true } });
      gsap.from("[data-m-row]", { autoAlpha: 0, x: -26, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: list, start: "top 80%", once: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative px-5 py-[16vh] md:px-10">
      <h2 data-m-head className="about-display mb-12 max-w-2xl text-[#f5f1e6]" style={{ fontSize: "clamp(2.2rem,5.5vw,4.4rem)" }}>
        How we <span className="text-[var(--gold-text)]">work.</span>
      </h2>
      <ul data-list className="max-w-4xl border-b border-[var(--hairline-dark)]">
        {STAGES.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.key} data-m-row className="hww-row border-t border-[var(--hairline-dark)]" data-on={on}>
              <div className="px-3 py-6 md:px-6 md:py-7">
                <div className="flex items-baseline gap-4 md:gap-7">
                  <span className={`about-label shrink-0 transition-colors duration-500 ${on ? "text-[var(--black)]/65" : "text-[var(--gold-text)]"}`}>0{i + 1}</span>
                  <span className={`about-display transition-colors duration-500 ${on ? "text-[var(--black)]" : "text-[#f5f1e6]"}`} style={{ fontSize: "clamp(2rem,5vw,3.6rem)" }}>{s.key}</span>
                </div>
                <div className="overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: on ? 200 : 0, opacity: on ? 1 : 0 }}>
                  <p className={`mt-3 max-w-xl text-[clamp(0.95rem,1.3vw,1.15rem)] leading-relaxed transition-colors duration-500 md:ml-14 ${on ? "text-[var(--black)]/80" : "text-[#f5f1e6]/65"}`}>{s.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
