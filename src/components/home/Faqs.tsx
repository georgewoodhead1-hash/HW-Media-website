"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import TitleRule from "@/components/shell/TitleRule";
// FAQ copy lives in content/site.ts — it doubles as FAQPage JSON-LD on the home page
import { FAQS } from "@/content/site";

// 06 — FAQS in plain flow, rows building one by one on their own passage.
// NO exit fades of any kind (George, 2026-07-13) — the rows scroll away
// naturally; the closing line draws across the page and the story band
// follows. The pen stroke is gone.

export default function Faqs() {
  const faqRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const root = faqRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const kills: (() => void)[] = [];
      const rule = root.querySelector<HTMLElement>(".faq-rule");

      if (rule) {
        gsap.set(rule, { autoAlpha: 0, y: 20 });
        const t = gsap.to(rule, {
          autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", toggleActions: "play none none reverse" },
        });
        kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      }

      gsap.utils.toArray<HTMLElement>(".faq-row", root).forEach((row) => {
        const line = row.querySelector<HTMLElement>(".faq-line");
        const rest = Array.from(row.children).filter((c) => c !== line);
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: "center center" });
        const step = gsap.utils.toArray<HTMLElement>(".faq-row", root).indexOf(row);
        gsap.set(rest, { autoAlpha: 0, x: -34 - step * 14, y: 10 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 86%", toggleActions: "play none none reverse" },
        });
        if (line) tl.to(line, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0);
        tl.to(rest, { autoAlpha: 1, x: 0, y: 0, duration: 0.75, ease: "power3.out" }, 0.12);
        kills.push(() => { tl.scrollTrigger?.kill(); tl.kill(); });
      });

      // the closing line draws across the page when it arrives — and that is
      // the ONLY exit event. NO fade-outs anywhere (George, 2026-07-13: "the
      // FAQs fade out way too soon… we don't need them to fade out. The only
      // thing that needs to happen is that line animation, then the
      // wherever-the-story-is band comes up"). The rows and the title simply
      // scroll away with the page.
      const closer = root.querySelector<HTMLElement>(".faq-closer");
      if (closer) {
        gsap.set(closer, { scaleX: 0, transformOrigin: "center center" });
        const t = gsap.to(closer, {
          scaleX: 1, duration: 0.9, ease: "expo.out",
          scrollTrigger: { trigger: closer, start: "top 92%", toggleActions: "play none none reverse" },
        });
        kills.push(() => { t.scrollTrigger?.kill(); t.kill(); });
      }

      return () => kills.forEach((k) => k());
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={faqRef}
      data-theme="dark"
      data-surface="page"
      data-chapter="06 — FAQs"
      // a short black beat after the closer-line wipe (the pen is gone —
      // the story band's small-film rise follows straight on)
      className="relative z-30 bg-[var(--bg)] px-5 pb-[5vh] pt-[6vh] text-[var(--fg)] md:px-10 md:pb-[7vh]"
      aria-label="Frequently asked questions"
    >
      {/* header: centred title with dynamic lines either side */}
      <div className="faq-rule mb-[7vh]">
        <TitleRule title="FAQs" />
      </div>

      <div className="w-full">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="faq-row" style={{ marginLeft: `min(${i * 4.5}vw, ${i * 4.5}%)` }}>
              <span aria-hidden className="faq-line block h-px w-full bg-[var(--fg)]" />
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-transform duration-300 hover:translate-x-2 md:py-6"
              >
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span
                    className={`label-mono shrink-0 rounded-[2px] px-2 py-1 text-[14px] tracking-[0.2em] transition-colors duration-300 ${
                      isOpen ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg)] group-hover:bg-[var(--fg)]/15"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(2rem,3.5vw,3.3rem)] leading-[1.05] text-[var(--fg)]">
                    {f.q}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-2xl leading-none text-[var(--fg)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-[135deg]" : "rotate-0 group-hover:rotate-90"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="grid overflow-hidden transition-all duration-[400ms] ease-in-out motion-reduce:transition-none"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-[var(--fg)] md:pl-[3.6rem] md:text-[18px]">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {/* the bottom line — draws in, rides down the page, then wipes away
            left→right; a black beat follows before the pen line comes down */}
        <span aria-hidden className="faq-closer block h-px w-full bg-[var(--fg)]" />
      </div>
    </section>
  );
}
