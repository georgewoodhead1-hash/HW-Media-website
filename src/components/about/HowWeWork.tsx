"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// How we operate — the five stages, driven by SCROLL not hover. As the list
// passes through the viewport a gold fill advances row by row, the active row's
// type inverts and its description opens. Clean light surface (Bar), Archivo.

interface Stage {
  key: string;
  body: string;
}

const STAGES: Stage[] = [
  { key: "Vision", body: "Every project starts with the story the brand already has. We find the idea worth filming before a camera ever comes out." },
  { key: "Strategy", body: "Treatment, arcs, shot design. The film is authored on paper first, so nothing is left to chance on the day." },
  { key: "Creation", body: "We come to the brand and shoot where the story happens, with the people who build it. One director behind the lens, a trusted crew when it needs more hands." },
  { key: "Refinement", body: "The edit and the grade, obsessed over until every frame earns its place in the final cut." },
  { key: "Impact", body: "Masters and the cutdowns your channels actually need. Work people remember, not content they scroll past." },
];

export default function HowWeWork() {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(0);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: list,
      start: "top 72%",
      end: "bottom 55%",
      onUpdate: (self) => {
        const idx = Math.min(STAGES.length - 1, Math.max(0, Math.floor(self.progress * STAGES.length)));
        setActive(idx);
      },
    });
    // heading reveal
    const tween = gsap.from("[data-hww-head]", {
      yPercent: 60,
      autoAlpha: 0,
      ease: "power3.out",
      duration: 1,
      scrollTrigger: { trigger: "[data-hww-head]", start: "top 88%", once: true },
    });
    return () => {
      st.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="ch-process" data-surface="page" className="about-body border-t border-[var(--hairline-dark)] px-5 py-[14vh] md:px-10">
      <div data-hww-head className="mb-12 flex flex-col gap-3 md:mb-16">
        <span className="about-label text-[var(--gold-text)]">How we operate</span>
        <h2 className="about-display max-w-2xl text-[var(--fg)]" style={{ fontSize: "clamp(2.4rem,6vw,4.6rem)" }}>
          Five stages. <span className="text-[var(--gold-text)]">No corners.</span>
        </h2>
      </div>

      <ul ref={listRef} className="border-b border-[var(--hairline-dark)]">
        {STAGES.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.key} className="hww-row border-t border-[var(--hairline-dark)]" data-on={on}>
              <div className="block w-full px-4 py-6 md:px-8 md:py-8">
                <div className="flex items-baseline gap-4 md:gap-7">
                  <span className={`about-label shrink-0 transition-colors duration-500 ${on ? "text-[var(--black)]/65" : "text-[var(--gold-text)]"}`}>
                    0{i + 1}
                  </span>
                  <span className={`about-display transition-colors duration-500 ${on ? "text-[var(--black)]" : "text-[var(--fg)]"}`} style={{ fontSize: "clamp(2.1rem,6vw,4.4rem)" }}>
                    {s.key}
                  </span>
                </div>
                <div className="overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: on ? 200 : 0, opacity: on ? 1 : 0 }}>
                  <p className={`mt-4 max-w-2xl text-[clamp(0.95rem,1.3vw,1.2rem)] leading-relaxed transition-colors duration-500 md:ml-[3.4rem] ${on ? "text-[var(--black)]/80" : "text-[var(--fg)]/65"}`}>
                    {s.body}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
